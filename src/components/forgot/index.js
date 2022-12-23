import React from 'react'
import { connect } from 'react-redux'

import { dispatchPostConnections } from '../../actions/PostActions.js'
import { setConnectionCB } from '../../actions/PostActions'

import $ from 'jquery'

// css
import '../assets/css/common.css'

// images
import logoImage from '../assets/images/logo.png'
import Pic_Id01 from '../assets/images/pic_id_01.png'

import pic_id_01 from '../assets/images/pic_id_01.png'

import * as Const from '../../Const'
import Dialog from '../../modules/Dialog'

import ComponentBase from '../ComponentBase.js'

class Forgot extends ComponentBase {
  constructor(props) {
    super(props)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.redirrectForgot = this.redirrectForgot.bind(this)

    this.state = {
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_ONE,
          title: 'お客さまIDとパスワードについて',
          values: [
            {
              text: (
                <p>
                  お客さまIDとパスワードは、ご契約時にお渡しの
                  <span className="a-primary">お申し込み完了通知書</span>
                  に記載されています。
                </p>
              ),
            },
            {
              text: (
                <p>
                  <img src={pic_id_01} />
                </p>
              ),
            },
            { text: <p>お申し込み完了通知書をご参照の上、ご入力ください。</p> },
            {
              text: (
                <p>
                  お申し込み完了通知書を無くしてしまったお客さまは、
                  <span className="a-primary">
                    イオンモバイルお客さまセンターへ
                  </span>
                  お問い合わせください。
                  <br />
                  お問い合わせは
                  <a
                    href=""
                    id="modal_customer"
                    onClick={(e) => {
                      e.preventDefault()
                      this.callbackDialog(
                        Const.EVENT_CLICK_BUTTON,
                        'modal_customer',
                        ''
                      )
                    }}
                  >
                    こちら
                  </a>
                  。
                </p>
              ),
            },
          ],
          otherTitle: 'イオンモバイルお客さまセンター',
          others: [
            {
              text: (
                <p>
                  <a className="a-link-tel" href="tel:0120-025-260">
                    0120-025-260
                  </a>
                </p>
              ),
            },
            { text: <p>＜受付時間＞10時30分〜19時30分（年中無休）</p> },
          ],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-dismiss',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },
      ],
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
    }
  }

  handleConnect(type) {
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_FORGOT:
        params = {
          customerId: $('#customerId').val(),
          mailAddress: $('#mailAddress').val(),
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  onLogin() {
    this.handleConnect(Const.CONNECT_TYPE_FORGOT)
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_FORGOT) {
        // THIS WILL REDIRECT TO THE NEXT PAGE
        window.location.href = '/forgot/complete'
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

  componentDidMount() {
    this.redirrectForgot()
    this.goTop()
    // if(window.customerId === undefined) return;
    document.title = Const.TITLE_FORGOT

    $('.t-modal_overlay').click(function () {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('#modal_customer.t-modal_content').removeClass('is-active')
    })

    $('#customerId').on('input', function (event) {
      $('#customerId').removeClass('is-error')
      $('#customerId_error').text('')
    })

    $('#mailAddress').on('input', function (event) {
      $('#mailAddress').removeClass('is-error')
      $('#mailAddress_error').text('')
    })
  }

  // declare redirect forgot func
  redirrectForgot() {
    if (localStorage.getItem('isLoggedIn') === '1') {
      let params = {}
      this.props.history.push({
        pathname: '/login',
        state: params,
      })
    }
  }
  callbackDialog(type, id) {
    console.log('callbackDialog ' + id)
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'a-link': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'modal_customer': {
          if ($('#modal_id.t-modal_content').hasClass('is-active') === true) {
            $('#modal_id.t-modal_content').removeClass('is-active')
          }
          $('#modal_customer.t-modal_content').addClass('is-active')
          $('#modal_customer.t-modal_content').css('top', '319.8px')
          break
        }
        case 'modal_overlay': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_close': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        default: {
          break
        }
      }
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/login')
          break
      }
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    window.customerId = ''
    if (url === '/contact/') {
      let params = {}
      params.frompage = 'fromForgot'
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'dialog_fr_' + i} />
          }
        })}
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog2_' + i} />
          } else {
            return <React.Fragment key={'dialog2_fr_' + i} />
          }
        })}
        <div>
          <div className="t-wrapper">
            <header className="t-header">
              <div className="t-header_inner">
                <div className="t-header_logo">
                  <a className="t-header_logo_link" href="/">
                    <img src={logoImage} alt="AEON MOBILE" />
                  </a>
                </div>
              </div>
            </header>
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <h1 className="a-h1">パスワードをお忘れのお客さま</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      マイページのパスワードをリセットし、ご登録のメールアドレスに、パスワード設定画面のURLを記載したメールをお送りします。
                    </h2>
                    <p>
                      ※メール受信設定をされている場合は、「aeonmobile.jp」からのメールを許可してください。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="text"
                            id="customerId"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin()
                            }}
                            tabIndex="1"
                          />
                          <label className="m-field_label a-label" htmlFor="id">
                            お客さまID
                          </label>
                          <div className="m-field_modal">
                            <a
                              href=""
                              id="modal_id"
                              onClick={(e) => {
                                e.preventDefault()
                                this.callbackDialog(
                                  Const.EVENT_CLICK_BUTTON,
                                  'a-link',
                                  ''
                                )
                              }}
                            >
                              お客さまIDとは？
                            </a>
                          </div>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="customerId_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="email"
                            id="mailAddress"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin()
                            }}
                            tabIndex="1"
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="email"
                          >
                            ご登録のメールアドレス
                          </label>
                          <div
                            className="m-field_error a-error"
                            id="mailAddress_error"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={(e) => this.onLogin()}
                          >
                            送信する
                          </button>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            onClick={() => {
                              this.props.history.push('/login')
                            }}
                          >
                            戻る
                          </a>
                        </p>
                      </div>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <p>
                      ※メールアドレスをご登録頂いていないお客さまは、お手数ですが
                      <span className="a-primary">
                        イオンモバイルお客さまセンター
                      </span>
                      までお問い合わせください。
                    </p>
                    <p className="m-btn">
                      <a
                        className="a-btn-radius-arrow"
                        href=""
                        onClick={(e) => this.goNextDisplay(e, '/contact/')}
                      >
                        各種お問い合わせは
                        <wbr />
                        こちら
                      </a>
                    </p>
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
            <div className="t-modal">
              <div className="t-modal_overlay" />
              <div className="t-modal_content" id="modal_id">
                <div className="m-modal">
                  <div className="m-modal_inner">
                    <h2 className="a-h3">お客さまIDとパスワードについて</h2>
                    <p>
                      お客さまIDとパスワードは、ご契約時にお渡しの
                      <span className="a-primary">お申し込み完了通知書</span>
                      に記載されています。
                    </p>
                    <p>
                      <img src={Pic_Id01} alt="" />
                    </p>
                    <p>お申し込み完了通知書をご参照の上、ご入力ください。</p>
                    <p>
                      お申し込み完了通知書を無くしてしまったお客さまは、
                      <span className="a-primary">
                        イオンモバイルお客さまセンターへ
                      </span>
                      お問い合わせください。
                      <br />
                      お問い合わせは
                      <a href="#modal_customer" data-modal>
                        こちら
                      </a>
                      。
                    </p>
                    <p className="m-btn">
                      <button className="a-btn-dismiss" type="button">
                        閉じる
                      </button>
                    </p>
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps)(Forgot)
