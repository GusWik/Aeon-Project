import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

//css
import '../../assets/css/common.css'

//images
import logoImage from '../../assets/images/logo.png'

import ComponentBase from '../../ComponentBase'
import * as Const from '../../../Const'

import Dialog from '../../../modules/Dialog.js'
import ValidateTextBox from '../../../modules/ValidateTextBox.js'

//通信用のモジュールを読み込み
import { dispatchGetConnections } from '../../../actions/PostActions.js'
import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

class Forgot_Reset extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)

    var key = props.location.search.substring(3)

    this.state = {
      settingKey: key,
      notice_data: {},
      token: props.history.token !== undefined ? props.history.token : '',
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
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      // AMM00003 API Run
      case Const.CONNECT_TYPE_FORGOT_RESET_CHECK:
        params = {
          settingKey: this.state.settingKey,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break

      // AMM00004 API Run
      case Const.CONNECT_TYPE_FORGOT_RESET_COMP:
        params = {
          settingKey: this.state.settingKey,
          newPassword: $('#newPassword').val(),
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break

      // IF NO API SPECIFIED
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  validatePassword() {
    var password = $('#newPassword').val()
    var birthday = $('#birthday').val()
    var validateBase = new ValidateTextBox()
    var ischeck = true
    var ischeckBirthday = true

    if (
      validateBase.validate(Const.TEXT_VALIDATE_KIND_ALPHA_U_L, password) ===
      false
    )
      ischeck = false
    if (
      validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, password, 8) ===
      false
    )
      ischeck = false
    if (
      validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MAX, password, 20) ===
      false
    )
      ischeck = false
    if (
      validateBase.validate(Const.TEXT_VALIDATE_KIND_NUMBER, birthday) === false
    )
      ischeckBirthday = false
    if (
      validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, birthday, 8) ===
      false
    )
      ischeckBirthday = false

    if (!ischeck) {
      $('#newPassword').addClass('is-error')
      $('#newPassword_error').text('パスワードが正しくありません。')
    }
    if (!ischeckBirthday) {
      $('#birthday').addClass('is-error')
      $('#birthday_error').text('生年月日が正しくありません。')
    }
    if (!ischeck || !ischeckBirthday) {
      return
    } else {
      // THIS WILL REDIRECT TO THE NEXT PAGE
      if ($('#newPassword').val() === $('#newPassword2').val()) {
        var params = {
          newpassword: $('#newPassword').val(),
          birthday: $('#birthday').val(),
          settingKey: this.state.settingKey,
          token: this.state.token,
        }
        this.props.history.push({
          pathname: '/forgot/reset/confirm',
          state: params,
        })
      } else {
        $('#newPassword2').addClass('is-error')
        $('#newPassword_error').text('パスワードが一致しません。')
      }
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        if (!data.auth_errors) this.props.history.push('/login')
      } else if (type === Const.CONNECT_TYPE_FORGOT_RESET_CHECK) {
        this.setState({ token: data.data.token })
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
      } else if (type === 'validation_errors') {
        this.props.history.push({
          pathname: '/error',
          search: '?e=3',
          state: {
            description: '有効なURLではありません',
          },
        })
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
    this.goTop()
    //if(window.customerId === undefined) return;
    document.title = Const.TITLE_FORGOT_RESET

    let fromConfirm = localStorage.getItem('fromConfirm')
    let newPassword = localStorage.getItem('newPassword')
    let birthday = localStorage.getItem('birthday')
    if (fromConfirm && newPassword) {
      $('#newPassword').val(newPassword)
      $('#newPassword2').val(newPassword)
      $('#birthday').val(birthday)
      localStorage.removeItem('fromConfirm')
      localStorage.removeItem('newPassword')
      localStorage.removeItem('birthday')
    }

    //onchange validate
    $('#newPassword').on('input', function (event) {
      var password = $('#newPassword').val()
      var validateBase = new ValidateTextBox()
      var ischeck = true

      if (
        validateBase.validate(Const.TEXT_VALIDATE_KIND_ALPHA_U_L, password) ===
        false
      )
        ischeck = false
      if (
        validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, password, 8) ===
        false
      )
        ischeck = false
      if (
        validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MAX, password, 20) ===
        false
      )
        ischeck = false

      if (!ischeck) {
        $('#newPassword').addClass('is-error')
        $('#newPassword_error').text('パスワードが正しくありません。')
      } else {
        $('#newPassword').removeClass('is-error')
        $('#newPassword_error').text('')
      }
    })

    $('#birthday').on('input', function (event) {
      var birthday = $('#birthday').val()
      var validateBase = new ValidateTextBox()
      var ischeckBirthday = true
      if (
        validateBase.validate(Const.TEXT_VALIDATE_KIND_NUMBER, birthday) ===
        false
      )
        ischeckBirthday = false
      if (
        validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, birthday, 8) ===
        false
      )
        ischeckBirthday = false

      if (!ischeckBirthday) {
        $('#birthday').addClass('is-error')
        $('#birthday_error').text('生年月日が正しくありません。')
      } else {
        $('#birthday').removeClass('is-error')
        $('#birthday_error').text('')
      }
    })

    if (!fromConfirm) {
      new Promise((resolve, reject) => {
        this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
        resolve(this.handleConnect(Const.CONNECT_TYPE_FORGOT_RESET_CHECK))
      })
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

  onLogin(e) {
    e.preventDefault()
    this.validatePassword()
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialogMap_x_' + i} />
          } else {
            return <React.Fragment key={'dialogMap_y_' + i} />
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
                </div>{' '}
              </div>
            </header>
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <h1 className="a-h1">パスワード設定</h1>
                  <div className="m-form">
                    <h2 className="a-h2">パスワードの設定を行ってください。</h2>
                    <hr className="a-hr a-hr-full" />
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
                      <br />
                      お申し込み時に設定された生年月日を入力してください。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="newPassword"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin(e)
                            }}
                            tabIndex="1"
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="newPassword"
                          >
                            パスワード
                          </label>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="newPassword2"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin(e)
                            }}
                            tabIndex="1"
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="newPassword2"
                          >
                            パスワード再入力
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="newPassword_error"
                        ></div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="text"
                            id="birthday"
                            maxLength="8"
                            placeholder="19900101"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13') this.onLogin(e)
                            }}
                            tabIndex="1"
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="birthday"
                          >
                            生年月日
                            <span
                              className="a-weak"
                              style={{ fontWeight: 'normal' }}
                            >
                              （半角数字8桁）
                            </span>
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="birthday_error"
                        ></div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={(e) => this.onLogin(e)}
                          >
                            確認する
                          </button>
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

export default connect(mapStateToProps)(Forgot_Reset)
