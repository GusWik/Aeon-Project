import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../../assets/css/common.css'

import ComponentBase from '../../../ComponentBase.js'

import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class Operate_Password extends ComponentBase {
  constructor(props) {
    super(props)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    console.log('props.history :: ', props.history)

    let token = ''
    if (props.history.token) {
      token = props.history.token
    } else if (props.history.location.state) {
      token = props.history.location.state.token
    }

    this.state = {
      passData: [
        {
          old_password:
            props.history.state !== undefined
              ? props.history.state.old_password
              : '',
          new_password:
            props.history.state !== undefined
              ? props.history.state.new_password
              : '',
          token: token,
        },
      ],

      customerInfoGetFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.customerInfoGetFlg
          : '',
      tokenFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.tokenFlg
          : '',
      simGetFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.simGetFlg
          : '',
      sessionNoUseFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.sessionNoUseFlg
          : '',

      dialogs_error: [
        {
          id: 0,
          type: Const.DIALOG_GENERIC_ERROR,
          title: '',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialogError,
              interval: null,
            },
          ],
          callback: this.callbackDialogError,
          state: false,
        },
      ],
      url_data: [
        {
          callback: this.headerUrlHandler,
          pass_data: {
            customer_id:
              props.history.location.state !== undefined
                ? props.history.location.state.customer_id
                : '',
            lineKeyObject:
              props.history.location.state !== undefined
                ? props.history.location.state.lineKeyObject
                : '',
            lineDiv:
              props.history.location.state !== undefined
                ? props.history.location.state.lineDiv
                : '',
          },
          dispatch: props.dispatch,
        },
      ],
    }

    props.history.state = undefined
  }

  componentDidMount() {
    $('#old_password').attr('value', this.state.passData[0].old_password)
    $('#new_password').attr(
      'value',
      this.state.passData[0].new_password
        ? this.state.passData[0].new_password
        : ''
    )
    $('#new_password2').attr(
      'value',
      this.state.passData[0].new_password
        ? this.state.passData[0].new_password
        : ''
    )

    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_OPERATE_PASSWORD

    $('#old_password').on('input', function (event) {
      $('#old_password').removeClass('is-error')
      $('#old_password_error').text('')
    })

    $('#new_password').on('change', function () {
      $('#new_password2_error').text($('#new_password_error').text())
      $('#new_password2').addClass('is-error')
      // if( $('#new_password').val()!="")  {
      //  $('#new_password2').removeClass("is-error");
      // }
    })

    $('#new_password').on('input', function (event) {
      $('#new_password').removeClass('is-error')
      $('#new_password_error').text('')
      // $("#new_password2").removeClass("is-error");
      // $("#new_password2_error").text("");
    })

    $('#new_password2').on('input', function (event) {
      $('#new_password').removeClass('is-error')
      $('#new_password2').removeClass('is-error')
      $('#new_password2_error').text('')
    })
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mypage')
          break
      }
    }
  }

  sendPassword(e) {
    if (e !== null) e.preventDefault()

    let isInvalid

    let old_password = $('#old_password').val()
    let new_password = $('#new_password').val()
    let new_password2 = $('#new_password2').val()

    // checking password match
    if (new_password || new_password2) {
      if (new_password != new_password2) {
        $('#new_password').addClass('is-error')
        $('#new_password2').addClass('is-error')
        $('#new_password2_error').text('パスワードが一致しません。')
        isInvalid = true
      }
    }
    // checking password required
    if (!old_password || !new_password || !new_password2) {
      if (!old_password) {
        $('#old_password').addClass('is-error')
        $('#old_password_error').text('現在のパスワード は必須です。')
      }
      if (!new_password) {
        $('#new_password').addClass('is-error')
        $('#new_password_error').text('新しいパスワード は必須です。')
      }
      if (!new_password2) {
        $('#new_password2').addClass('is-error')
        $('#new_password2_error').text('新しいパスワード再入力 は必須です。')
      }
      isInvalid = true
    }

    // checking password length
    if (new_password.length < 8 || new_password.length > 20) {
      $('#new_password').addClass('is-error')
      $('#new_password_error').text(
        '新しいパスワード は 8 ～ 20 文字で入力してください。'
      )
      isInvalid = true
    }
    if (new_password2.length < 8 || new_password2.length > 20) {
      $('#new_password2').addClass('is-error')
      $('#new_password2_error').text(
        '新しいパスワード再入力 は 8 ～ 20 文字で入力してください。'
      )
      isInvalid = true
    }

    // checking password Character type
    if (
      !new_password.match(/^[a-zA-Z0-9]+$/) ||
      !new_password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/)
    ) {
      $('#new_password').addClass('is-error')
      $('#new_password_error').text(
        '新しいパスワードは大小を含む英数字で入力してください。'
      )
      isInvalid = true
    }
    if (
      !new_password2.match(/^[a-zA-Z0-9]+$/) ||
      !new_password2.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/)
    ) {
      $('#new_password2').addClass('is-error')
      $('#new_password2_error').text(
        '新しいパスワード再入力は大小を含む英数字で入力してください。'
      )
      isInvalid = true
    }
    if (isInvalid) return

    var passData_copy = [...this.state.passData]
    passData_copy[0].old_password = old_password
    passData_copy[0].new_password = new_password
    // passData_copy[0].token =this.state.passData[0].token ;
    this.setState({ passData: passData_copy })

    // if okay....  transit
    this.goNextDisplay(
      null,
      '/mypage/operate/password/confirm',
      this.state.passData[0]
    )
  }

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    console.log('this is from the header*******************')
    console.log(params)
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()
    if (url === '/mypage/operate/password/confirm') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
        <div>
          <div className="t-wrapper">
            <Header
              isExistStatus={this.props.isExistStatus}
              {...this.state.url_data[0]}
            />
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <ol className="m-breadcrumb">
                    <li className="m-breadcrumb_item">
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">パスワード変更</li>
                  </ol>
                  <h1 className="a-h1">パスワード変更</h1>
                  <div className="m-form">
                    <h2 className="a-h2">パスワードの変更を行ってください。</h2>
                    <hr className="a-hr a-hr-full" />
                    <p>現在のパスワードを入力してください。</p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="old_password"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.sendPassword(e)
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="old_password"
                          >
                            現在のパスワード
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="old_password_error"
                        />
                      </div>
                    </div>
                    <p>
                      ご希望のパスワードを
                      <br />
                      <span className="a-primary">
                        ・英大文字と英小文字を含む
                        <br />
                        ・数字を含む
                        <br />
                        ・８文字以上、２０文字以内
                      </span>
                      <br />
                      で設定してください。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="new_password"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.sendPassword(e)
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="new_password"
                          >
                            新しいパスワード
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="new_password_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="new_password2"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.sendPassword(e)
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="new_password2"
                          >
                            新しいパスワード再入力
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="new_password2_error"
                        />
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={(e) => this.sendPassword(e)}
                          >
                            確認画面へ進む
                          </button>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            href=""
                            onClick={(e) => {
                              e.preventDefault()
                              this.props.history.goBack()
                            }}
                          >
                            戻る
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <footer className="t-footer">
              <div className="t-footer_inner">
                <p className="t-footer_copyright">
                  &copy; AEON RETAIL CO.,LTD. All rights reserved.
                </p>
              </div>
            </footer>
            <div className="t-pagetop">
              <a href="" onClick={(e) => this.scrollToTop(e)}>
                TOP
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
  }
}

export default connect(mapStateToProps)(Operate_Password)
