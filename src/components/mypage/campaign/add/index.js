// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import {
  setConnectionCB,
  dispatchPostConnections,
} from '../../../../actions/PostActions.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const'

// IMPORT MODULES
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class CampaignTicketAdd extends ComponentBase {
  constructor(props) {
    super(props)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.fixCouponStop = this.fixCouponStop.bind(this)

    this.state = {
      loading_state: false,
      token: '',
      groupActivateDate: '',

      lineInfo: [
        {
          lineDiv:
            props.history.location.state !== undefined
              ? props.history.location.state.lineDiv
              : '',
          lineKeyObject:
            props.history.location.state !== undefined
              ? props.history.location.state.lineKeyObject
              : '',
          lineNo:
            props.history.location.state !== undefined
              ? props.history.location.state.lineNo
              : '',
        },
      ],
      seniorPlanFlag: 0,
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          body: '',
          remarks: '',
          values: [
            {
              text: (
                <p>
                  データ通信容量を追加します。
                  <br />
                  よろしいですか？
                </p>
              ),
            },
          ],
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
          key: 'dialog_bx',
        },
        {
          id: 1,
          type: Const.DIALOG_ONE,
          title: 'エラー',
          body: '',
          remarks: '',
          values: [
            {
              text: <p>クーポン付与に失敗しました。</p>,
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
          key: 'dialog_bx',
        },
      ],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
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
      isStop: false,
      isStopForActivateDate: false,
      btnDisabled: true,
      isPageLoaded: false,
      addId:
        props.history.location.state !== undefined
          ? props.history.location.state.addId
          : '',
    }
  }

  handleConnect(type) {
    var params = {}
    if (type == Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerInfoGetFlg: '',
        tokenFlg: '',
        simGetFlg: '1',
        sessionNoUseFlg: '',
        customerId: window.customerId,
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      }
    } else if (type === Const.CONNECT_TYPE_HIGH_SPEED_STATUS) {
      params = {
        lineKeyObject: this.state.url_data[0].pass_data.lineKeyObject,
        lineDiv: this.state.url_data[0].pass_data.lineDiv,
        // lineNo     : this.state.lineInfo[0].lineNo
      }
    } else if (type === Const.CONNECT_TYPE_PLAN) {
      params = {
        lineKeyObject: this.state.url_data[0].pass_data.lineKeyObject,
        lineDiv: this.state.url_data[0].pass_data.lineDiv,
        perNum: 3, // 固定
        pageNo: 1, // 固定
      }
    } else if (type === Const.CONNECT_TYPE_CHECK_1G_TICKET) {
      //1Gクーポン使用チェックAPI
      params = {
        lineKeyObject: this.state.url_data[0].pass_data.lineKeyObject,
        lineDiv: this.state.url_data[0].pass_data.lineDiv,
        addId: this.state.addId, //waonAddPointHistoryList.waonAddId
      }
    } else if (type === Const.CONNECT_TYPE_USE_1G_TICKET) {
      //1Gクーポン使用API
      params = {
        lineKeyObject: this.state.url_data[0].pass_data.lineKeyObject,
        lineDiv: this.state.url_data[0].pass_data.lineDiv,
        addId: this.state.addId, //waonAddPointHistoryList.waonAddId
        token: this.state.token,
      }
    }
    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    console.log(
      'handleConnectChange',
      type,
      data,
      status,
      token,
      type === 'validation_errors'
    )
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      this.setState({ loading_state: false })
      switch (type) {
        case Const.CONNECT_TYPE_AGREEMENT_DATA: {
          let params = data.data
          this.setState({
            groupActivateDate: params.lineInfo[0].groupActivateDate,
          })
          this.fixCouponStop()
          this.handleConnect(Const.CONNECT_TYPE_PLAN)
          break
        }
        case Const.CONNECT_TYPE_HIGH_SPEED_STATUS: {
          if (data.data.status === 'OK') {
            this.setState({
              token: data.data.token,
              isStop: data.data.stopFlg == 1,
              isPageLoaded: true,
            })
          }

          break
        }
        case Const.CONNECT_TYPE_PLAN: {
          let params = data.data
          if (params.seniorPlanFlag) {
            this.setState({ seniorPlanFlag: params.seniorPlanFlag })
          }

          this.handleConnect(Const.CONNECT_TYPE_HIGH_SPEED_STATUS)

          break
        }
        case Const.CONNECT_TYPE_CHECK_1G_TICKET: {
          if (data.data.result === 'OK') {
            this.setState({
              token: data.data.token,
            })
            //1Gクーポン使用チェックAPI
            this.toggle_dialog_box()
          }

          break
        }
        case Const.CONNECT_TYPE_USE_1G_TICKET: {
          //1Gクーポン使用API
          if (data.data.result === 'OK') {
            this.goNextDisplay(
              null,
              '/mypage/campaign/add/complete',
              this.state.lineInfo[0]
            )
          } else {
            var dialogs_copy = [...this.state.dialogs]
            dialogs_copy[0].state = false
            dialogs_copy[1].state = true
            this.setState({ dialogs: dialogs_copy })
          }
          break
        }

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
        // token無効エラー
        // システムエラー画面へ遷移
        this.props.history.push('/error?e=1')
        document.title = Const.TITLE_ERROR
      } else {
        this.props.history.push('/')
      }
    }
  }

  fixCouponStop() {
    console.log('fixCouponStop')
    let dateEquals = (a, b) => {
      return (
        a.getFullYear() == b.getFullYear() &&
        a.getMonth() == b.getMonth() &&
        a.getDate() == b.getDate()
      )
    }
    let today = new Date()
    let activated = new Date(this.state.groupActivateDate)

    console.log(today, activated, dateEquals(today, activated))
    if (dateEquals(today, activated)) {
      this.setState({
        isStop: true,
        isStopForActivateDate: true,
      })
    }
  }

  toggle_dialog_box() {
    var dialogs_copy = [...this.state.dialogs]
    dialogs_copy[0].state = true

    this.setState({ dialogs: dialogs_copy })
  }

  callbackDialog(type, id) {
    var is_check = true
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 't-modal_overlay': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          this.handleConnect(Const.CONNECT_TYPE_USE_1G_TICKET)
          break
        }
        case 'dialog_button_close': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        default: {
          break
        }
      }
    }
  }

  dataFixingHandler(type, index) {
    var TempReturn = ' '
    switch (type) {
      case 'name':
        TempReturn = ' '
        break
      case 'commission':
        TempReturn = ' '
        break
      default:
        TempReturn = ' '
    }
    return TempReturn
  }

  checkBox() {
    if ($('#agreement').is(':checked')) {
      this.setState({ btnDisabled: false })
    } else {
      this.setState({ btnDisabled: true })
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SPEED

    this.checkBox()
    // Scroll to a certain element
    if (
      !this.props.location.state ||
      !this.props.location.state.lineKeyObject ||
      this.props.location.state.lineKeyObject == '' ||
      this.props.location.state.addId == ''
    ) {
      this.props.history.push('/')
    }
    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
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

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/speed/complete/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/campaign/') {
      var _params = this.state.url_data[0].pass_data
      _params['type'] = '3'
      this.props.history.push({
        pathname: url,
        state: _params,
      })
    } else {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  render() {
    const table_head = {
      background: '#b50080',
      padding: '6.5px 12px',
      padding: '.65rem 1.2rem',
    }

    const table_tr = {
      padding: '6.5px 12px',
      padding: '.65rem 1.2rem',
    }

    this.items = (
      <table className="a-table-between">
        <tbody>
          <tr className="m-status_tr">
            <th className="m-status_th" style={table_head}>
              高速データ通信：
            </th>
            <td className="m-status_td" style={table_head}>
              <span>利用中</span>
            </td>
          </tr>
          <tr>
            <th style={table_tr}>変更手数料</th>
            <td className="a-fw-bold" style={table_tr}>
              無料
            </td>
          </tr>
        </tbody>
      </table>
    )

    this.api_button = (
      <button
        className="a-btn-submit"
        id="submit"
        type="button"
        disabled={
          this.state.btnDisabled || !this.state.token || this.state.token == ''
        }
        onClick={(e) => {
          this.handleConnect(Const.CONNECT_TYPE_CHECK_1G_TICKET)
        }}
      >
        容量を追加する
      </button>
    )

    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} />
          } else {
            return <React.Fragment key="react_fragment" />
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
                          this.goNextDisplay(e, '/mypage/campaign/')
                        }
                      >
                        紹介チケット・クーポン・特典
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">データ通信容量追加</li>
                  </ol>
                  <h1 className="a-h1">データ通信容量追加</h1>
                  <div className="m-form">
                    <h2 className="a-h2">データ通信容量追加のお申込み</h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="t-inner_wide">
                      <table className="a-table-simple a-table-between">
                        <tbody>
                          <tr className="a-fs-lg">
                            <th>追加容量</th>
                            <td className="a-fw-bold">
                              1GB
                              <br />
                              <small>
                                (1GBクーポン特典
                                <br className="a-sp" /> 使用)
                              </small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {(() => {
                      console.log('seniorPlanFlag', this.state.seniorPlanFlag)
                      if (this.state.seniorPlanFlag === 0) {
                        return (
                          <div className="m-form_section">
                            <p>当月分の高速データ通信容量を追加します。</p>
                            <ul className="a-list">
                              <li>
                                ‣
                                当月中に追加した高速データ通信容量を使いきれなかった場合でも、翌月に繰り越しはできません。
                              </li>
                              <li>
                                ‣ 回線開通当日はお申し込みいただけません。
                              </li>
                              <li>
                                ‣
                                お申込み後のキャンセルはできませんので、お間違えのないようご確認の上、
                                <span className="a-primary">
                                  「同意します」にチェック
                                </span>
                                を入れて送信してください。
                              </li>
                            </ul>
                          </div>
                        )
                      } else {
                        return (
                          <div className="m-form_section">
                            <p>高速データ通信容量を追加します。</p>
                            <ul className="a-list">
                              <li>
                                ‣
                                交換された追加容量の未使用分は、交換月の翌月から3か月目の末日まで繰り越しが可能です。
                                <br />
                                例）9月に容量を追加された場合、12月末で繰越可能
                              </li>
                              <li>
                                ‣
                                交換された追加容量について、高速データ通信の通信速度は、最大で約500MBに制限されます。
                              </li>
                              <li>
                                ‣
                                お申込み後のキャンセルはできませんので、お間違えのないようご確認の上、
                                <span className="a-primary">
                                  「同意します」にチェック
                                </span>
                                を入れて送信してください。
                              </li>
                            </ul>
                          </div>
                        )
                      }
                    })()}

                    {this.state.isPageLoaded && (
                      <React.Fragment>
                        {(() => {
                          if (this.state.isStopForActivateDate) {
                            return (
                              <div className="m-form_section">
                                <p className="a-primary a-fs-sm a-ta-center">
                                  <b>
                                    開通当日のため、容量を追加できません。
                                    <br />
                                    恐れ入りますが、明日以降に再度お手続きいただきますようお願いいたします。
                                  </b>
                                </p>
                              </div>
                            )
                          } else {
                            return (
                              <div
                                className="m-form_section"
                                style={{
                                  display: this.state.isStop ? 'none' : 'block',
                                }}
                              >
                                <div className="m-field">
                                  <div className="m-field_control-check">
                                    <label htmlFor="agreement">
                                      <input
                                        className="a-input-checkbox"
                                        type="checkbox"
                                        id="agreement"
                                        data-agreement-target="submit"
                                        onClick={(e) => this.checkBox()}
                                      />
                                      <span className="a-weak">同意します</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        })()}

                        <div className="m-form_section">
                          <div className="m-btn-group">
                            <p
                              className="m-btn"
                              style={{
                                display: this.state.isStop ? 'none' : 'flex',
                              }}
                            >
                              {this.api_button}
                            </p>
                            <p className="m-btn">
                              <a
                                className="a-btn-dismiss"
                                onClick={(e) => {
                                  this.goNextDisplay(e, '/mypage/campaign/')
                                }}
                              >
                                戻る
                              </a>
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    )}
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

export default connect(mapStateToProps)(CampaignTicketAdd)
