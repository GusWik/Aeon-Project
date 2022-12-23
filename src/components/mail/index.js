import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../ComponentBase.js'

import { dispatchPostConnections } from '../../actions/PostActions.js'
import { setConnectionCB } from '../../actions/PostActions.js'

import * as Const from '../../Const.js'
import Dialog from '../../modules/Dialog.js'
import Header from '../../modules/Header.js'

class Mail extends ComponentBase {
  constructor(props) {
    super(props)

    console.log(window)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)

    // Loginコンポーネントのメンバ変数定義
    this.state = {
      mailInfo: [
        {
          token: '',
          mailAddress: '',
          password: '',
        },
      ],
      loginMailAddressFlg: '',
      initialPassChangeFlg: '',

      // プログレス表現の表示状況
      loading_state: false,

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
  }

  handleConnect(type) {
    var params = {}

    switch (type) {
      // case Const.CONNECT_TYPE_CHECK_MAIL_ADDRESS:
      //   params = {
      //     mailAddress: $("#email1").val()
      //   };
      //   this.setState({ loading_state: true });
      //   setConnectionCB(this.handleConnectChange);
      //   this.props.dispatch(dispatchPostConnections(type, params));
      //   break;

      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        params = {
          customerId: window.customerId,
          customerInfoGetFlg: '1',
          sessionNoUseFlg: '',
          tokenFlg: '1',
          simGetFlg: '',
          lineKeyObject: '',
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break

      case Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS:
        params = {
          mail_address: $('#mail_address').val(),
          password: $('#password').val(),
          login_use: $('#apply').is(':checked') === true ? '1' : '0',
          token: this.state.mailInfo[0].token,
        }

        // mail addrees match validate
        if ($('#mail_address').val() != $('#mail_address2').val()) {
          $('#mail_address').addClass('is-error')
          $('#mail_address2').addClass('is-error')
          $('#mail_address2_error').text('メールアドレスが一致しません')
          // password  match validate
          if ($('#apply').is(':checked') === true) {
            if ($('#password').val() != $('#password2').val()) {
              $('#password').addClass('is-error')
              $('#password2').addClass('is-error')
              $('#password2_error').text('パスワードが一致しません。')
              return
            }
          }
          return
        } else if ($('#apply').is(':checked') === true) {
          if ($('#password').val() != $('#password2').val()) {
            $('#password').addClass('is-error')
            $('#password2').addClass('is-error')
            $('#password2_error').text('パスワードが一致しません。')
            return
          }
        }

        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break

      default:
        // json
        this.setState({ loading_state: true })
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      var params = data.data
      // if (type === Const.CONNECT_TYPE_CHECK_MAIL_ADDRESS) {
      //   if (params.result === "OK") {
      //     //params.token
      //     this.handleConnect(Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS);
      //   }
      // } else
      if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        var mailInfo_copy = [...this.state.mailInfo]
        mailInfo_copy[0].token = params.token
        this.setState({ mailInfo: mailInfo_copy })

        this.setState({ loginMailAddressFlg: params.loginMailAddressFlg })
        this.setState({ initialPassChangeFlg: params.initialPassChangeFlg })
        // checking  checkbox
        if (this.state.loginMailAddressFlg === '1') {
          $('#apply').prop('checked', true)
        } else {
          $('#apply').prop('checked', false)
        }

        this.checkBox()
      } else if (type === Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS) {
        if (params.result === 'OK') {
          var mailInfo_copy = [...this.state.mailInfo]
          mailInfo_copy[0].mailAddress = $('#mail_address').val()
          mailInfo_copy[0].password = $('#password').val()
          this.setState({ mailInfo: mailInfo_copy })

          // let params= this.state.mailInfo[0];
          // let url = `/mail/auth/`;
          // this.props.history.push({
          //     pathname: url,
          //     state: params
          // });

          this.props.history.push('/mail/auth')
        }
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
    }
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

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mail')
          break
      }
    }
  }

  // コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    this.goTop()
    console.log('CID::', window.customerId)
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MAIL
    this.checkBox()
    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)

    $('#mail_address').on('change', function () {
      $('#mail_address2_error').text($('#mail_address_error').text())
      $('#mail_address2').addClass('is-error')
      if ($('#mail_address').val() != '') {
        $('#mail_address2').removeClass('is-error')
      }
    })

    $('#mail_address').on('input', function () {
      $('#mail_address_error').text('')
      // $('#mail_address2_error').text("");
      $('#mail_address').removeClass('is-error')
      // $('#mail_address2').removeClass("is-error");
    })

    $('#mail_address2').on('input', function () {
      $('#mail_address_error').text('')
      $('#mail_address2_error').text('')
      $('#mail_address').removeClass('is-error')
      $('#mail_address2').removeClass('is-error')
    })

    $('#password').on('change', function () {
      $('#password2_error').text($('#password_error').text())
      $('#password2').addClass('is-error')
      if ($('#password').val() != '') {
        $('#password2').removeClass('is-error')
      }
    })

    $('#password').on('input', function () {
      $('#password_error').text('')
      // $('#password2_error').text("");
      $('#password').removeClass('is-error')
      // $('#password2').removeClass("is-error");
    })

    $('#password2').on('input', function () {
      $('#password_error').text('')
      $('#password2_error').text('')
      $('#password').removeClass('is-error')
      $('#password2').removeClass('is-error')
    })
  }

  checkBox() {
    if ($('#apply').is(':checked')) {
      if (this.state.initialPassChangeFlg === '1') {
        $('#pwrd.m-form_section').show()
      } else {
        $('#pwrd.m-form_section').hide()
      }
      $('#password').val('')
      $('#password2').val('')
    } else {
      $('#pwrd.m-form_section').hide()
      $('#password_error').text('')
      $('#password2_error').text('')
      $('#password').removeClass('is-error')
      $('#password2').removeClass('is-error')
      $('#pwrd.m-form_section').hide()
      // $('#password').val("");
      // $('#password2').val("");
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
    }
  }

  // 画面レイアウト
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
                    <li className="m-breadcrumb_item">メールアドレス登録</li>
                  </ol>
                  <h1 className="a-h1">メールアドレス登録</h1>
                  <div className="m-form">
                    <h2 className="a-h2">メールアドレスをご入力ください。</h2>
                    <p>
                      ご入力頂いたメールアドレス宛にご本人確認用のURLを記載したメールをお送りします。
                    </p>
                    <div className="m-box-bg">
                      <div className="m-box_body">
                        <p>
                          完了通知の受け取りが郵送からメールアドレスに届くようになります。
                        </p>
                        <p>
                          また、チェックを付けるとメールアドレスでマイページにログインできるようになります。
                        </p>
                      </div>
                    </div>
                    <p>
                      ※メール受信設定をされている場合は、「aeonmobile.jp」からのメールを許可してください。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="email"
                            id="mail_address"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="email1"
                          >
                            メールアドレス
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="mail_address_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="email"
                            id="mail_address2"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="email2"
                          >
                            メールアドレス（再入力）
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="mail_address2_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control-check">
                          <label htmlFor="apply">
                            <input
                              className="a-input-checkbox"
                              type="checkbox"
                              id="apply"
                              onClick={(e) => this.checkBox()}
                            />
                            <span className="a-weak">
                              このメールアドレスをログインで使用する
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section" id="pwrd">
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
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="password"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="password"
                          >
                            パスワード
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="password_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="password2"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="password2"
                          >
                            パスワード再入力
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="password2_error"
                        />
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={(e) =>
                              this.handleConnect(
                                Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                              )
                            }
                          >
                            送信する
                          </button>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            href="javascript:history.back();"
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

export default connect(mapStateToProps)(Mail)
