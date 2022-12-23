import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import Dialog from '../../../modules/Dialog.js'

//css
import '../../assets/css/common.css'

//images
import logoImage from '../../assets/images/logo.png'

import ComponentBase from '../../ComponentBase'
import * as Const from '../../../Const'

import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

class Forgot_Reset_Confirm extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)

    var key = props.location.search.replace('?k=')

    console.log(key)

    this.state = {
      settingkey: key,

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
      newPass: '',
      birthday: '',
      settingKey:
        props.history.location.state !== undefined
          ? props.history.location.state.settingKey
          : '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
    }
  }

  handleConnect(type) {
    var params = {}
    switch (type) {
      // AMM00004 API Run
      case Const.CONNECT_TYPE_FORGOT_RESET_COMP:
        params = {
          settingKey: this.state.settingKey,
          newPassword: this.state.newPass,
          birthday: this.state.birthday,
          token: this.state.token,
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

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_FORGOT_RESET_COMP) {
        window.location.href = '/forgot/reset/complete'
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
      } else if (type === 'validation_errors') {
        if (token) this.props.history.token = token
        localStorage.setItem('fromConfirm', true)
        localStorage.setItem('newPassword', this.state.newPass)
        localStorage.setItem('birthday', this.state.birthday)
        this.props.history.goBack()
        setTimeout(() => {
          for (var key in data) {
            if (key.indexOf('.') !== -1) {
              var key2 = key.split('.')[1]
              $('#' + key2 + '_error')
                .text(data[key])
                .change()
              $('#' + key2)
                .addClass('is-error')
                .change()
            } else {
              $('#' + key + '_error')
                .text(data[key])
                .change()
              $('#' + key)
                .addClass('is-error')
                .change()
            }
          }
        }, 100)
      }
    }
  }

  componentDidMount() {
    this.goTop()
    // if(window.customerId === undefined) return;
    document.title = Const.TITLE_FORGOT_RESET_CONFIRM
    this.setState({
      newPass:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.newpassword
          : '',
    })
    this.setState({
      birthday:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.birthday
          : '',
    })
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

  onLogin() {
    this.handleConnect(Const.CONNECT_TYPE_FORGOT_RESET_COMP)
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
                </div>
              </div>
            </header>
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <h1 className="a-h1">パスワード設定確認</h1>
                  <div className="m-form">
                    <div className="m-form_section">
                      <div className="m-field">
                        <div
                          className="m-field_control-value"
                          style={{ borderBottom: 'none' }}
                        >
                          <span className="a-label">新しいパスワード</span>
                          <span className="a-fs-lg a-weak">
                            {this.state.newPass}
                          </span>
                        </div>
                        <div className="m-field_control-value">
                          <span className="a-label">生年月日</span>
                          <span className="a-fs-lg a-weak">
                            {this.state.birthday}
                          </span>
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
                            確定する
                          </button>
                        </p>
                        <p className="m-btn">
                          <button
                            className="a-btn-dismiss"
                            type="button"
                            onClick={(e) => {
                              localStorage.setItem('fromConfirm', true)
                              localStorage.setItem(
                                'newPassword',
                                this.state.newPass
                              )
                              localStorage.setItem(
                                'birthday',
                                this.state.birthday
                              )
                              history.back()
                            }}
                          >
                            戻る
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

export default connect(mapStateToProps)(Forgot_Reset_Confirm)
