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

class User_Separate extends ComponentBase {
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
            optionConfig:
              props.history.location.state !== undefined
                ? props.history.location.state.optionConfig
                : [],
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
      ],
      item:
        props.history.location.state !== undefined
          ? props.history.location.state.item
          : [],
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_SEPARATE
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

  items(data) {
    let trs = data.map((item, key) => (
      <tr style={{ padding: '1rem 0' }} key>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">ご契約者名</dt>
            <dd>{item.userName}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">プラン名</dt>
            <dd>{item.planName}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">回線数</dt>
            <dd>{item.lines}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">ご契約回線番号1（SIM名）</dt>
            <dd>{`${item.number}（${item.name}）`}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp" />
            <dd style={{ flex: 1 }}>
              {(() => {
                if (key == 0) {
                  return <span>選択中</span>
                } else {
                  return (
                    <div style={{ display: 'flex' }}>
                      <button
                        className="a-btn-submit"
                        style={{ width: '100px', padding: '6px' }}
                        id=""
                        type="button"
                        onClick={(e) => this.onLogin(e, 0, item)}
                      >
                        切り替え
                      </button>
                      <button
                        className="a-btn-submit"
                        style={{ width: '100px', padding: '6px' }}
                        id=""
                        type="button"
                        onClick={(e) => this.onLogin(e, 1, item)}
                      >
                        分離
                      </button>
                    </div>
                  )
                }
              })()}
            </dd>
          </dl>
        </td>
      </tr>
    ))
    return trs
  }

  onLogin(e, type, item) {
    switch (type) {
      case 0:
        {
          // 切り替え 確認ダイアログ表示
          e.preventDefault()
          // validate newPassword
          let isInvalid
          let newPassword = $('#newPassword').val()
          // checking password length
          if (newPassword.length < 8 || newPassword.length > 20) {
            $('#newPassword').addClass('is-error')
            $('#newPassword_error').text(
              '新しいパスワード は 8 ～ 20 文字で入力してください。'
            )
            isInvalid = true
          }

          // checking password Character type
          if (
            !newPassword.match(/^[a-zA-Z0-9]+$/) ||
            !newPassword.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/)
          ) {
            $('#newPassword').addClass('is-error')
            $('#newPassword_error').text(
              '新しいパスワードは大小を含む英数字で入力してください。'
            )
            isInvalid = true
          }
          if (isInvalid) return
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].title = 'SIMの開通'
          var values = []
          values[0] = {
            text: (
              <div>
                <p style={{ textAlign: 'left' }}>
                  以下の内容でログイン分離しますか？
                </p>
                <p style={{ textAlign: 'left' }}>
                  <span>{`ご契約者名：${item.contractorLastName} ${item.contractorFirstName}`}</span>
                </p>
                <p style={{ textAlign: 'left' }}>
                  <span>{`プラン名：${item.planName}`}</span>
                </p>
                <p style={{ textAlign: 'left' }}>
                  <span>{`回線数：${item.lineCount}`}</span>
                </p>
                <p style={{ textAlign: 'left' }}>
                  <span>{`ご契約回線番号1：${item.tel}`}</span>
                </p>
                <p style={{ textAlign: 'left' }}>
                  <span>{`ログインパスワード：${$(
                    '#newPassword'
                  ).val()}`}</span>
                </p>
              </div>
            ),
          }
          var button = dialogs_copy[0].button
          button[1].value = '分離する'
          dialogs_copy[0].values = values
          dialogs_copy[0].button = button
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
        }
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
        case 'dialog_button_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          // ID分離API
          this.handleConnect(Const.CONNECT_TYPE_ISOLATE_ID)
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

    switch (type) {
      case Const.CONNECT_TYPE_ISOLATE_ID:
        params = {
          linkedCustomerId: this.state.item.customerId,
          newPassword: $('#newPassword').val(),
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
        case Const.CONNECT_TYPE_ISOLATE_ID:
          if (data.data.result === 'OK') {
            // 契約一覧画面へ
            this.props.history.push({
              pathname: '/mypage/user/list/',
            })
          } else {
            // 分離に失敗しました
            var dialogs_copy = [...this.state.dialogs_error]
            dialogs_copy[0].title = 'ログイン分離に失敗しました。'
            var values = []
            values[0] = {
              text: 'お手数ですが、トップページから再度操作をお願いします。',
            }
            dialogs_copy[0].values = values
            dialogs_copy[0].state = true
            this.setState({ dialogs_error: dialogs_copy })
          }
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      var values = []
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
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
                  <h1 className="a-h1">ログイン分離</h1>
                  <div className="m-form">
                    <h2 className="a-h2 a-ta-center">
                      ログイン分離後のパスワードを設定してください。
                    </h2>
                    <div className="box-frame">
                      <div className="m-form_section">
                        <div className="m-field">
                          <div className="m-field_control">
                            <input
                              className="a-input"
                              type="password"
                              id="newPassword"
                              onKeyDown={(e) => {
                                if (e.keyCode == '13') {
                                  // 確認ダイアログ表示
                                  this.onLogin(e, 0, this.state.item)
                                }
                              }}
                              style={{ marginBottom: '1.5rem' }}
                            />
                            <label
                              className="m-field_label a-label"
                              htmlFor="sim"
                            >
                              分離後のパスワード
                            </label>
                            <p className="">
                              <span className="a-primary">
                                ・英大文字と英小文字を含む
                                <br />
                                ・数字を含む
                                <br />
                                ・８文字以上、２０文字以内
                              </span>
                            </p>
                          </div>
                          <div
                            className="m-field_error a-error"
                            id="newPassword_error"
                          />
                        </div>
                      </div>
                      <div className="m-form_section">
                        <div className="m-btn-group">
                          <p className="m-btn">
                            <button
                              className="a-btn-submit btn-separation"
                              onClick={(e) => {
                                // 確認ダイアログ表示
                                this.onLogin(e, 0, this.state.item)
                              }}
                              id="btnsim"
                              type="button"
                            >
                              分離する
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

export default connect(mapStateToProps)(User_Separate)
