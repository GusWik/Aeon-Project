import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import $ from 'jquery'

//css
import '../../assets/css/common.css'

//images
import logoImage from '../../assets/images/logo.png'
import * as Const from '../../../Const.js'

//各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'
import Dialog from '../../../modules/Dialog.js'

import {
  awaitPostMessage,
  dispatchPostConnections,
} from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'
import { getmypageid, getAgreementData } from '../../../actions/ArsActions.js'
import {
  getPathName,
  isValidUrl,
  redirectPlanPage,
} from '../../../actions/Methods.js'

const URL_MYPAGE_PLAN = '/mypage/plan/'

class Login_Mail extends ComponentBase {
  constructor(props) {
    super(props)

    this.callbackDialogError = this.callbackDialogError.bind(this)

    //通信関数をバインド
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    // Loginコンポーネントのメンバ変数定義
    this.state = {
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

      //プログレス表現の表示状況
      loading_state: false,
      // リダイレクト処理
      redirect_url: '',
      client_id: '',
      oauthClientId: [],
      url_params: '',
    }

    //ヒストリ
    Login_Mail.PropTypes = {
      location: ReactRouterPropTypes.location.isRequired,
      history: ReactRouterPropTypes.history.isRequired,
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          break
      }
    }
  }

  //通信処理
  handleConnect(type) {
    var params = {}

    switch (type) {
      case Const.CONNECT_TYPE_LOGIN:
        params = {
          login_type: 'mail',
          mail: {
            mail_address: $('#mail_address').val(),
            password: $('#password').val(),
          },
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        //json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  //通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      //redirect_urlを確認
      if (this.state.redirect_url && isValidUrl(this.state.redirect_url)) {
        // /mypage/plan/edit/ の場合のみ別処理
        const path = getPathName(this.state.redirect_url)
        if (path === URL_MYPAGE_PLAN) {
          redirectPlanPage(this.props)
          return
        } else {
          location.href = this.state.redirect_url
          return
        }
      }
      this.props.history.push({
        pathname: '/mypage',
        state: { customer_id: data.customer_id },
      })
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
        // ログインエラー検知用
        awaitPostMessage('login_fail')
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

  onLogin() {
    this.handleConnect(Const.CONNECT_TYPE_LOGIN)
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    this.goTop()
    //if(window.customerId === undefined) return;
    document.title = Const.TITLE_LOGIN_MAIL
    $('#mail_address').on('input', function (event) {
      $('#mail_address').removeClass('is-error')
      $('#mail_address_error').text('')
    })
    $('#password').on('input', function (event) {
      $('#password').removeClass('is-error')
      $('#password_error').text('')
    })

    const url = new URL(window.location.href)
    const params = url.searchParams
    const client_id = params.get('client_id')
    const redirect_url = params.get('redirect_url')
    if (client_id) {
      this.setState({ client_id })
    }
    if (redirect_url) {
      this.setState({ redirect_url })
    }

    this.get_oauthClientId()

    if (url.search.length > 0) {
      console.log(url.search)
      this.setState({ url_params: url.search })
    }
  }

  get_oauthClientId() {
    fetch(Const.CONNECT_TYPE_OAUTH_CLIENT_ID, {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (!json || json.length <= 0) return false
        this.setState({ oauthClientId: json.oauthClientId })
        console.log(json.oauthClientId)
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  // リダイレクト確認(JSON include処理を除く)
  redirectUriCheck() {
    if (!(this.state.client_id && this.state.redirect_url)) {
      return false
    }

    const includeClient_id = this.includeClient_id(this.state.client_id)
    const enableUri = isValidUrl(this.state.redirect_url)

    if (
      this.state.client_id &&
      this.state.redirect_url &&
      includeClient_id &&
      enableUri //urlの形
    ) {
      return true
    } else {
      return false
    }
  }

  //画面レイアウト
  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} />
          } else {
            return <React.Fragment />
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
                  <h1 className="a-h1">メールアドレスログイン</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      ログイン用に登録したメールアドレスとパスワードをご入力ください。
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="email"
                            id="mail_address"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin()
                            }}
                            tabIndex="1"
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="email"
                          >
                            メールアドレス
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="mail_address_error"
                        ></div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="password"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin()
                            }}
                            tabIndex="1"
                            autoComplete="off"
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
                        ></div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <p className="m-btn">
                        <button
                          className="a-btn-submit"
                          id="btn_login"
                          type="button"
                          onClick={(e) => this.onLogin()}
                        >
                          ログイン
                        </button>
                      </p>
                      <p>
                        <a className="a-link-arrow" href="/forgot/">
                          パスワードをお忘れのお客さま
                        </a>
                      </p>
                      <p>
                        ６回以上ログインに失敗するとロックされ一定時間ご利用ができなくなりますのでご注意ください。
                      </p>
                    </div>
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          onClick={() => {
                            this.props.history.push(
                              `/login${this.state.url_params}`
                            )
                          }}
                        >
                          戻る
                        </a>
                      </p>
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

export default connect(mapStateToProps)(Login_Mail)
