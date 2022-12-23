import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../../assets/css/common.css'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'

// import dialogs
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class Operate_Password_Confirm extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      passData: [
        {
          old_password:
            props.history.location.state !== undefined
              ? props.history.location.state.old_password
              : '',
          new_password:
            props.history.location.state !== undefined
              ? props.history.location.state.new_password
              : '',
          token:
            props.history.location.state !== undefined
              ? props.history.location.state.token
              : '',
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
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      // api AMM000033 - changePass
      case Const.CONNECT_TYPE_CHANGE_PASS:
        params = {
          old_password: this.state.passData[0].old_password,
          new_password: this.state.passData[0].new_password,
          token: this.state.passData[0].token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, this.props))
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_CHANGE_PASS) {
        var params = data.data
        if (params.result === 'OK') {
          let url = `/mypage/operate/password/complete`
          // NEED TO SEND THE CUSTOMER ID
          let params = {}
          params.customer_id = this.state.url_data[0].pass_data.customer_id
          this.props.history.push({
            pathname: url,
            state: params,
          })
        } else if (params.result == 'NG') {
          // error handling
          if (params.validation_errors) {
            data = params.validation_errors
            // need  transit to password page
            if (token) this.props.history.token = token
            this.props.history.goBack()
            this.props.history.state = this.state.passData[0]
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
          } else if (params.api_error) {
            data = params.api_error
            // need  transit to password page
            if (token) this.props.history.token = token
            this.props.history.goBack()
            this.props.history.state = this.state.passData[0]
            setTimeout(() => {
              $('#old_password_error')
                .text('現在のパスワードが正しくありません。')
                .change()
              $('#old_password').addClass('is-error').change()
            }, 100)
          }
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
      } else if (type === 'validation_errors') {
        console.log('validatin error', data)
        // need  transit to password page
        this.props.history.goBack()
        this.props.history.state = this.state.passData[0]
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

        /* let url = `/mypage/operate/password/`;
        let params = {};
        params=this.state.passData[0];
        params.customer_id = this.state.url_data[0].pass_data.customer_id;
        this.props.history.push({
        pathname: url,
        state: params
        }); */
      }
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_OPERATE_PASSWORD_CONFIRM
    console.log('DD::' + this.state.passData[0].old_password)
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
    e.preventDefault()
    if (url === '/mypage/operate/password/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
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
    } else if (url === '/mypage/user/') {
      let params = {}
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
                    <li className="m-breadcrumb_item">
                      <a
                        href=""
                        onClick={(e) =>
                          this.goNextDisplay(e, '/mypage/operate/password/')
                        }
                      >
                        パスワード変更
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">確認</li>
                  </ol>
                  <h1 className="a-h1">パスワード変更確認</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      パスワードの変更を行うと、現在使用中のパスワードが使用できなくなりますが、よろしいですか？
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control-value">
                          <span className="a-label">ご利用中のパスワード</span>
                          <span className="a-fs-lg a-weak">
                            {this.props.history.location.state !== undefined
                              ? this.props.history.location.state.old_password
                              : ''}
                          </span>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_control-value">
                          <span className="a-label">新しいパスワード</span>
                          <span className="a-fs-lg a-weak">
                            {this.props.history.location.state !== undefined
                              ? this.props.history.location.state.new_password
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <button
                            className="a-btn-submit"
                            onClick={(e) =>
                              this.handleConnect(Const.CONNECT_TYPE_CHANGE_PASS)
                            }
                            type="button"
                            disabled={this.state.passData[0].token == ''}
                          >
                            変更する
                          </button>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            href=""
                            onClick={(e) => {
                              e.preventDefault()
                              this.props.history.goBack()
                              this.props.history.state = this.state.passData[0]
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

export default connect(mapStateToProps)(Operate_Password_Confirm)
