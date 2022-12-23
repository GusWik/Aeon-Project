// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT IMAGES

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'
import Dialog from '../../../../modules/Dialog.js'

// 通信用のモジュールを読み込み
import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'
import ValidateTextBox from '../../../../modules/ValidateTextBox.js'

class User_Integrate extends ComponentBase {
  constructor(props) {
    super(props)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)

    this.state = {
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      url_data: [
        {
          callback: this.headerUrlHandler,
          pass_data: {
            customer_id:
              props.history.location.state !== undefined
                ? props.history.location.state.customer_id
                : '',
          },
          dispatch: props.dispatch,
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
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel',
              value: 'キャンセル',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },
        {
          id: 1,
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
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },
        {
          id: 2,
          type: Const.DIALOG_GENERIC_ERROR,
          title: '',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_close',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
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
      customer_id: '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_INTEGRATE
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

  onLogin(type, item) {
    switch (type) {
      case 0:
        // 確認用ログインAPI
        this.handleConnect(Const.CONNECT_TYPE_LOGIN)
        break
      case 1:
        // 切り替え 確認ダイアログ表示
        var dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].title = 'SIMの開通'
        var values = []
        this.setState({ requestType: 1 })
        values[0] = {
          text: (
            <div>
              <p style={{ textAlign: 'left' }}>
                SMS送信された認証コードを入力してください。（半角数字8桁）
              </p>
              <div className="m-field">
                <input
                  className="a-input"
                  type="text"
                  id="smsAuthenticationCode"
                  onKeyDown={(e) => {
                    if (e.keyCode == '13') {
                      // ID統合API
                      this.onSend(this.state.requestType)
                    }
                  }}
                />
                <div
                  className="m-field_error a-error"
                  id="smsAuthenticationCode_error"
                />
              </div>
            </div>
          ),
        }
        var button = dialogs_copy[0].button
        button[1].value = '認証する'
        dialogs_copy[0].values = values
        dialogs_copy[0].button = button
        dialogs_copy[0].state = true
        this.setState({ dialogs: dialogs_copy })
        break
      case 2:
        {
          // 切り替え 確認ダイアログ表示
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].title = 'SIMの開通'
          var values = []
          let list = item.map((i, index) => {
            return (
              <div className="m-field_control-check" key={index}>
                <label htmlFor={`notice${index}`}>
                  <input
                    className="a-input-radio"
                    type="radio"
                    name="notice"
                    id={`notice${index}`}
                    onClick={(e) => {
                      this.setState({ lineNo: i.telNo })
                    }}
                  />
                  <span>{i.telNo}</span>
                </label>
              </div>
            )
          })
          values[0] = {
            text: (
              <div>
                <p style={{ textAlign: 'left' }}>
                  SMS送信する回線を選択してください。
                </p>
                <div className="m-form_section" style={{ textAlign: 'left' }}>
                  <div className="m-field">{list}</div>
                </div>
              </div>
            ),
          }
          var button = dialogs_copy[0].button
          button[1].value = '送信する'
          dialogs_copy[0].values = values
          dialogs_copy[0].button = button
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
        }
        break
      case 3:
        // 切り替え 確認ダイアログ表示
        var dialogs_copy = [...this.state.dialogs]
        // dialogs_copy[1].title = 'SIMの開通'
        var values = []
        values[0] = {
          text: (
            <div style={{ textAlign: 'left' }}>
              <p className="a-primary">※Google認証の連携が完了していません。</p>
              <p>
                該当のアカウントでログインしていただき、
                <br />
                お客さま情報（ログイン設定）画面 > 2段階認証設定メニュー
                <br />
                から連携の設定を完了してください。
              </p>
            </div>
          ),
        }
        dialogs_copy[2].values = values
        dialogs_copy[2].state = true
        this.setState({ dialogs: dialogs_copy })
        break
      case 4:
        // 切り替え 確認ダイアログ表示
        var dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].title = 'SIMの開通'
        var values = []
        values[0] = {
          text: (
            <div>
              <p style={{ textAlign: 'left' }}>
                Google認証アプリで発行された認証コードを入力してください。（半角数字6桁）
              </p>
              <div className="m-field">
                <input
                  className="a-input"
                  type="text"
                  id="googleAuthenticationCode"
                  onKeyDown={(e) => {
                    if (e.keyCode == '13') {
                      // ID統合API
                      this.onSend(this.state.requestType)
                    }
                  }}
                />
                <div
                  className="m-field_error a-error"
                  id="googleAuthenticationCode_error"
                />
              </div>
            </div>
          ),
        }
        var button = dialogs_copy[0].button
        button[1].value = '認証する'
        dialogs_copy[0].values = values
        dialogs_copy[0].button = button
        dialogs_copy[0].state = true
        this.setState({ dialogs: dialogs_copy })
        break
      case 5:
        // 切り替え 確認ダイアログ表示
        var dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].title = 'SIMの開通'
        var values = []
        values[0] = {
          text: (
            <div>
              <p style={{ textAlign: 'left' }}>
                以下の番号に認証コードをSMS送信します。
              </p>
              <div className="m-form_section" style={{ textAlign: 'left' }}>
                <div className="m-field">
                  <div className="m-field_control-check">
                    <label htmlFor="notice1">
                      <span>{item}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ),
        }
        var button = dialogs_copy[0].button
        button[1].value = '送信する'
        dialogs_copy[0].values = values
        dialogs_copy[0].button = button
        dialogs_copy[0].state = true
        this.setState({ dialogs: dialogs_copy, lineNo: item })
        break
      default:
        break
    }
  }

  onSend(type) {
    switch (type) {
      case 0:
        // ID統合リクエストAPI
        this.handleConnect(Const.CONNECT_TYPE_REQUEST_INTEGRATE_ID)
        break
      case 1:
        // ID統合API
        this.handleConnect(Const.CONNECT_TYPE_INTEGRATE_ID)
        break
      default:
        break
    }
  }

  callbackDialog(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_close': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[2].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
          if (this.state.requestType === 0) {
            var dialogs_copy = [...this.state.dialogs]
            dialogs_copy[0].state = false
            dialogs_copy[1].state = false
            this.setState({ dialogs: dialogs_copy })
          }
          // ID統合リクエストAPI or ID統合API
          this.onSend(this.state.requestType)
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

  // 通信処理
  handleConnect(type) {
    var params = {}
    var validateBase = new ValidateTextBox()
    switch (type) {
      case Const.CONNECT_TYPE_LOGIN:
        var customer_id = $('#customer_id').val()
        this.setState({ customer_id })
        var password = $('#password').val()
        var ischeckID = true
        var ischeckPW = true
        // validate customer_id type
        if (
          validateBase.validate(
            Const.TEXT_VALIDATE_LENGTH_MIN,
            customer_id,
            1
          ) === false
        )
          ischeckID = false
        // validate password type
        if (
          validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, password, 1) ===
          false
        )
          ischeckPW = false
        if (!ischeckID || !ischeckPW) {
          if (!ischeckID) {
            $('#customer_id').addClass('is-error')
            $('#customer_id_error').text('お客さまIDを入力してください')
          }
          if (!ischeckPW) {
            $('#password').addClass('is-error')
            $('#password_error').text('パスワードを入力してください')
          }
          return
        }
        params = {
          login_type: 'customer',
          customer: {
            customer_id,
            password,
          },
          union_login: '1',
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        params = {
          customerId: window.customerId,
          customerInfoGetFlg: '',
          sessionNoUseFlg: '',
          tokenFlg: '',
          simGetFlg: '1',
          lineKeyObject: '',
          unionCustomerId: this.state.customer_id,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_REQUEST_INTEGRATE_ID:
        params = {
          authenticationMethod: this.state.authenticationMethod,
          telNo: this.state.lineNo,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_INTEGRATE_ID:
        var authenticationCode
        var ischeckCode = true
        var validateLength
        if (this.state.authenticationMethod === '1') {
          authenticationCode = 'smsAuthenticationCode'
          validateLength = 8
        } else {
          authenticationCode = 'googleAuthenticationCode'
          validateLength = 6
        }
        var codeValue = $(`#${authenticationCode}`).val()
        // validate smsAuthenticationCode
        if (
          // 半角数字${validateLength}桁
          validateBase.validate(
            Const.TEXT_VALIDATE_LENGTH_MIN,
            codeValue,
            validateLength
          ) === false ||
          validateBase.validate(
            Const.TEXT_VALIDATE_LENGTH_MAX,
            codeValue,
            validateLength
          ) === false ||
          validateBase.validate(Const.TEXT_VALIDATE_KIND_NUMBER, codeValue) ===
            false
        ) {
          ischeckCode = false
        }
        if (!ischeckCode) {
          $(`#${authenticationCode}`).addClass('is-error')
          $(`#${authenticationCode}_error`).text(
            `認証コードは半角数字${validateLength}桁で入力してください。`
          )
          return
        }
        var dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].state = false
        dialogs_copy[1].state = false
        this.setState({ dialogs: dialogs_copy })
        params = {
          linkedCustomerId: this.state.customer_id,
          authenticationMethod: this.state.authenticationMethod,
          smsAuthenticationCode:
            this.state.authenticationMethod === '1'
              ? $('#smsAuthenticationCode').val()
              : undefined,
          googleAuthenticationCode:
            this.state.authenticationMethod === '2'
              ? $('#googleAuthenticationCode').val()
              : undefined,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        // json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_LOGIN:
          // agreement API
          this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
          break
        case Const.CONNECT_TYPE_AGREEMENT_DATA:
          let simInfo = data.data.lineInfo[0].simInfo
          this.setState({ simInfo })
          // SIM種別	simType
          // 文字列 1:音声/2:SMS/3:データ/4:シェア
          // authenticationMethod
          // 1:SMS認証 / 2:GoogleAuthenticater認証
          let smsAvailable = []
          let authenticationMethod = ''
          simInfo.map((item) => {
            if (item.simType == 1 || item.simType == 2 || item.simType == 4) {
              smsAvailable.push({
                telNo: item.lineNo,
              })
            }
          })
          if (smsAvailable.length) {
            // 契約が音声 or データSMS
            authenticationMethod = '1'
          } else {
            // GA設定済み
            if (data.data.secretKey) {
              authenticationMethod = '2'
            }
          }
          this.setState({ authenticationMethod })
          if (!authenticationMethod) {
            // エラー表示
            this.onLogin(3)
          } else if (authenticationMethod === '1') {
            this.setState({ requestType: 0 })
            if (smsAvailable.length === 1) {
              // 対象お客さまIDアカウントの契約回線にSMS送信可能な回線が含まれており、1回線のみの場合
              this.onLogin(5, smsAvailable[0].telNo)
            } else {
              // 対象お客さまIDアカウントの契約回線にSMS送信可能な回線が含まれており、複数回線存在する場合
              this.onLogin(2, smsAvailable)
            }
          } else if (authenticationMethod === '2') {
            this.setState({ requestType: 1 })
            // 対象お客さまIDアカウントの契約回線にSMS送信可能な回線が含まれておらず、Google認証連携が完了している場合
            this.onSend(0)
          }
          break
        case Const.CONNECT_TYPE_REQUEST_INTEGRATE_ID:
          // ダイアログ表示
          if (this.state.requestType === 1) {
            this.onLogin(4)
          } else {
            this.onLogin(1)
          }
          break
        case Const.CONNECT_TYPE_INTEGRATE_ID:
          if (data.data.result === 'OK') {
            // 完了画面へ
            this.props.history.push({
              pathname: '/mypage/user/integrate/complete',
            })
          } else {
            // 統合に失敗しました
            var dialogs_copy = [...this.state.dialogs_error]
            dialogs_copy[0].title = 'ログイン統合に失敗しました。'
            var values = []
            values[0] = {
              text: 'お手数ですが、トップページから再度操作をお願いします。',
            }
            dialogs_copy[0].values = values
            dialogs_copy[0].state = true
            this.setState({ dialogs_error: dialogs_copy })
          }
          break
        default:
          break
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
        if (data.type === 0) {
          // TOYBOX API エラー
          values[0] = { text: '統合できない契約情報です' }
          dialogs_copy[0].title = 'ログイン統合エラー'
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
        } else if (data.response) {
          if (
            data.response.response &&
            data.response.response.error_detail &&
            data.response.response.error_detail.error_message
          ) {
            values[0] = {
              text: data.response.response.error_detail.error_message,
            }
            dialogs_copy[0].values = values
            dialogs_copy[0].state = true
          } else if (
            data.response.error_detail &&
            data.response.error_detail.error_message
          ) {
            values[0] = {
              text: data.response.error_detail.error_message,
            }
            dialogs_copy[0].values = values
            dialogs_copy[0].state = true
          }
        }
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

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
          }
        })}
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
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
                  <h1 className="a-h1">ログイン統合</h1>
                  <div className="m-form">
                    <h2 className="a-h2 a-ta-center">
                      ログイン統合するアカウントのお客さまID・パスワードを入力してください。
                    </h2>
                    <p style={{ textAlign: 'left' }}>
                      ※統合先アカウントのご契約回線がデータ回線かつSMS送信オプションが含まれない場合、統合先アカウントのお客さまマイページへログイン頂き、「お客さま情報（ログイン設定）」より、2段階認証（
                      Google
                      Authenticator）にて、認証コードの払い出しが必要です。
                    </p>
                    <div className="box-frame">
                      <div className="m-form_section">
                        <div className="m-field">
                          <div className="m-field_control">
                            <input
                              className="a-input"
                              type="text"
                              id="customer_id"
                              onKeyDown={(e) => {
                                if (e.keyCode == '13') {
                                  // 確認ダイアログ表示
                                  this.onLogin(0)
                                }
                              }}
                            />
                            <label
                              className="m-field_label a-label"
                              htmlFor="customer_id"
                            >
                              お客さまID
                            </label>
                          </div>
                          <div
                            className="m-field_error a-error"
                            id="customer_id_error"
                          />
                        </div>
                        <div className="m-field">
                          <div className="m-field_control">
                            <input
                              className="a-input"
                              type="password"
                              id="password"
                              onKeyDown={(e) => {
                                if (e.keyCode == '13') {
                                  // 確認ダイアログ表示
                                  this.onLogin(0)
                                }
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
                      </div>
                      <div className="m-form_section">
                        <div className="m-btn-group">
                          <p className="m-btn">
                            <button
                              className="a-btn-submit btn-integration"
                              onClick={(e) => {
                                // 確認ダイアログ表示
                                this.onLogin(0)
                              }}
                              id="btnCustomerId"
                              type="button"
                            >
                              確認
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

export default connect(mapStateToProps)(User_Integrate)
