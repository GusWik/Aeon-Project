import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../assets/css/common.css'

// 通信用のモジュールを読み込み
import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

class Notice_Change extends ComponentBase {
  constructor(props) {
    super(props)

    console.log('props :: ', props.history.location.state)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    // this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this);
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      customerID: '',
      mailAddress: '',
      status:
        props.history.location.state !== undefined
          ? props.history.location.state.status
          : '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
      loading_state: false,
      api_data: {},

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
      btnDisabled: true,
    }
  }

  handleConnect(type) {
    var params = {}
    this.setState({ loading_state: true })
    if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerId: window.customerId,
        customerInfoGetFlg: '1',
        tokenFlg: '1',
        simGetFlg: '',
      }
    } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
      params = {
        customerId: window.customerId,
      }
    } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
      var status = '1'
      if ($('#notice1:checked').val()) {
        status = '1'
      } else if ($('#notice2:checked').val()) {
        status = '2'
      }

      params = {
        customerId: window.customerId,
        status: status,
        token: this.state.token,
      }
    }
    // 通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      console.log(data.data)
      if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        this.setState({ mailAddress: data.data.mailAddress })

        this.setState({ token: data.data.token })
        var url = Const.CONNECT_TYPE_NOTIFICATION_DATA
        this.handleConnect(url)
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        this.setState({ token: data.data.token })
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        var params = data.data
        if (params.result === 'OK') {
          let url = `/mypage/notice/complete`
          this.props.history.push({
            pathname: url,
            state: params,
          })
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
          values[0] = {
            text: data.response.response.error_detail.error_message,
          }
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
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_NOTICE_CHANGE

    // $('#notice1').prop("checked", true);

    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)

    if (this.state.status === 1) {
      $('#notice1').prop('checked', true)
    } else {
      $('#notice2').prop('checked', true)
    }

    var self = this
    $('#notice2').click(
      function () {
        console.log('notice2 :: ', $('#notice2').is(':checked'))
        if ($('#notice2').is(':checked')) {
          if (
            self.state.mailAddress === undefined ||
            self.state.mailAddress === ''
          ) {
            this.setState({ btnDisabled: true })
          } else {
            this.setState({ btnDisabled: false })
          }
        }
      }.bind(this)
    )

    $('#notice1').click(
      function () {
        console.log('notice1 :: ', $('#notice1').is(':checked'))
        if ($('#notice1').is(':checked')) {
          this.setState({ btnDisabled: false })
        }
      }.bind(this)
    )
  }

  dataFixingHandler(type, index) {
    if (this.state.api_data.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'status':
          TempReturn = this.state.api_data[index].status
          break
        case 'token':
          TempReturn = this.state.api_data[index].token
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
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

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/mail/':
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
  render() {
    if (this.state.mailAddress === '') {
      this.notLoggedMessage = (
        <div>
          <h3 className="a-h4 a-mb-5" id="mailRegister">
            <h3 className="a-h4 a-mb-5">メールアドレスが登録されていません</h3>
          </h3>
          <div className="m-box-bg">
            <div className="m-box_body">
              <p>
                メールで通知するためには事前に「
                <a href="" onClick={(e) => this.goNextDisplay(e, '/mail/')}>
                  メールアドレス変更
                </a>
                」画面からメールアドレスを登録してください。
              </p>
            </div>
          </div>
        </div>
      )

      this.registerMessage = (
        <h3 className="a-h4 a-mb-5">受け取り先のメールアドレス</h3>
      )
    } else {
      this.registerMessage = (
        <h3 className="a-h4 a-mb-5" style={{ display: 'inline' }}>
          受け取り先のメールアドレス
        </h3>
      )

      this.notLoggedMessage = null
    }

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
                      各種完了通知書の受け取り方法変更
                    </li>
                  </ol>
                  <h1 className="a-h1">各種完了通知書の受け取り方法変更</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      各種完了通知書の受け取り方法を「郵送」または「メールで通知」から選ぶことができます。
                    </h2>
                    <p>
                      ※お電話又は店頭にて、同日中に複数回の情報変更をお申込みされた場合、郵送にて通知書を送付させていただく場合がございます。
                    </p>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control-check">
                          <label htmlFor="notice1">
                            <input
                              className="a-input-radio"
                              type="radio"
                              name="notice"
                              id="notice1"
                              // checked="checked"
                            />
                            <span>郵送</span>
                          </label>
                        </div>
                        <div className="m-field_control-check">
                          <label htmlFor="notice2">
                            <input
                              className="a-input-radio"
                              type="radio"
                              name="notice"
                              id="notice2"
                            />
                            <span>メールで通知</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <p>※変更反映まで数分かかります。</p>
                    <div className="m-form_section t-inner_wide">
                      {(() => {
                        if (this.state.mailAddress) {
                          return (
                            <div>
                              <h3 className="a-h4 a-mb-5">
                                {/* 受け取り先のメールアドレス  */}
                                {this.registerMessage}
                              </h3>
                              <div className="m-box-bg">
                                <div className="m-box_body">
                                  <p className="a-fs-lg a-fw-bold a-ta-center">
                                    {this.state.mailAddress}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        } else {
                          return this.notLoggedMessage
                        }
                      })()}
                    </div>
                    <div className="m-btn-group">
                      <p className="m-btn">
                        <button
                          className="a-btn-submit"
                          type="button"
                          disabled={this.state.btnDisabled}
                          onClick={(e) =>
                            this.handleConnect(
                              Const.CONNECT_TYPE_INSERT_NOTIFICATION
                            )
                          }
                        >
                          変更する
                        </button>
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          onClick={() => {
                            this.props.history.push('/mypage/notice')
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

export default connect(mapStateToProps)(Notice_Change)
