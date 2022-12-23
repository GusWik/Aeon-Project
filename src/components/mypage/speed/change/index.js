// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const'

// IMPORT MODULES
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class Speed_change extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      user_nick_name: '',
      lineInfo: {
        lineKeyObject:
          props.history.location.state !== undefined
            ? props.history.location.state.lineKeyObject
            : '',
        lineNo:
          props.history.location.state !== undefined
            ? props.history.location.state.lineNo
            : '',
        lineDiv:
          props.history.location.state !== undefined
            ? props.history.location.state.lineDiv
            : '',
      },
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

      token: '',
      highSpeedDataStatus: '0',

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
                <p>高速データ通信を再開（OR　停止）します。よろしいですか？</p>
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
          close: false,
        },
      ],
      serviceId: '',
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SPEED_CHANGE
    this.handleConnect(Const.CONNECT_TYPE_LINE_STATUS)
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    this.handleConnect(Const.CONNECT_TYPE_PLAN)
  }

  handleConnect(type) {
    var params = {}
    switch (type) {
      // API AMM000020
      case Const.CONNECT_TYPE_LINE_STATUS: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
      // API AMM000021
      case Const.CONNECT_TYPE_CHANGE_LINE_STATUS: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
          token: this.state.token,
          highSpeedDataDiv: this.state.highSpeedDataStatus === '1' ? '0' : '1',
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))

        break
      }
      case Const.CONNECT_TYPE_SIM_DATA: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
      case Const.CONNECT_TYPE_PLAN: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          perNum: 3, // 固定
          pageNo: 1, // 固定
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, true))
        break
      }

      default: {
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
    }

    this.setState({ loading_state: true })
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      var d = data.data
      this.setState({ loading_state: false })
      document.title = Const.TITLE_MYPAGE_SPEED_CHANGE
      switch (type) {
        case Const.CONNECT_TYPE_LINE_STATUS: {
          this.setState({ token: d.token })
          this.setState({ highSpeedDataStatus: d.highSpeedDataStatus })
          break
        }
        case Const.CONNECT_TYPE_CHANGE_LINE_STATUS: {
          if (data.data.result === 'OK') {
            this.handleConnect(Const.CONNECT_TYPE_LINE_STATUS)
          } else {
            var dialogs_copy = [...this.state.dialogs]
            dialogs_copy[0].state = false
            this.setState({ dialogs: dialogs_copy })
          }
          break
        }

        case Const.CONNECT_TYPE_SIM_DATA: {
          this.setState({ user_nick_name: data.data.nickName })
          break
        }

        case Const.CONNECT_TYPE_PLAN: {
          this.setState({ serviceId: data.data.planId })
          break
        }

        default: {
          break
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
      } else if (type === 'validation_errors') {
        // token無効エラー
        // システムエラー画面へ遷移
        this.props.history.push('/error?e=1')
        document.title = Const.TITLE_ERROR
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        if (
          data &&
          data.response &&
          data.response.StatusCode &&
          data.response.StatusCode == 480
        ) {
          dialogs_copy[0].title = ''
          var values = []
          values[0] = { text: '短時間での連続での切り替えはできません。' }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          dialogs_copy[0].close = true
          this.setState({ dialogs_error: dialogs_copy })
        } else {
          // システムエラー画面へ遷移
          this.props.history.push('/error?e=1')
          document.title = Const.TITLE_ERROR
        }
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

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          if (dialogs_copy[0].close) {
            dialogs_copy[0].close = false
            this.setState({ dialogs_error: dialogs_copy })
          } else {
            this.setState({ dialogs_error: dialogs_copy })
            this.props.history.push('/mypage/sim/user')
          }
          break
      }
    }
  }

  toggle_dialog_box() {
    var dialogs_copy = [...this.state.dialogs]
    dialogs_copy[0].state = true

    var values = [{ text: <p>高速データ通信を停止します。よろしいですか？</p> }]

    if (this.state.highSpeedDataStatus === '0') {
      values = [{ text: <p>高速データ通信を再開します。よろしいですか？</p> }]
    }

    dialogs_copy[0].values = values

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
          this.handleConnect(Const.CONNECT_TYPE_CHANGE_LINE_STATUS)
          break
        }
        default: {
          break
        }
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
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
    }
  }

  isZeroPlan() {
    return this.props.iotPlans.zeroPlans.indexOf(this.state.serviceId) !== -1
  }

  render() {
    const table_head = {
      background: '#b50080',
      padding: '6.5px 12px',
      padding: '.65rem 1.2rem',
      verticalAlign: 'middle',
    }

    const table_tr = {
      padding: '6.5px 12px',
      padding: '.65rem 1.2rem',
    }
    if (this.state.highSpeedDataStatus === '1') {
      this.items = (
        <table className="a-table-between">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th a-sp" style={table_head}>
                高速データ
                <br />
                通信：
              </th>
              <th className="m-status_th a-pc" style={table_head}>
                高速データ通信：
              </th>
              <td className="m-status_td" style={table_head}>
                <span>高速通信中</span>
              </td>
            </tr>
          </tbody>
        </table>
      )

      this.api_button = (
        <button
          className="a-btn-submit"
          type="button"
          onClick={this.toggle_dialog_box}
        >
          データ通信速度を切り替える
        </button>
      )
    } else {
      this.items = (
        <table className="m-status-disabled a-table-between">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th a-sp">
                高速データ
                <br />
                通信：
              </th>
              <th className="m-status_th a-pc">高速データ通信：</th>
              <td className="m-status_td" style={{ verticalAlign: 'middle' }}>
                <span>低速通信中</span>
              </td>
            </tr>
          </tbody>
        </table>
      )

      this.api_button = (
        <button
          className="a-btn-submit"
          type="button"
          onClick={this.toggle_dialog_box}
        >
          データ通信速度を切り替える
        </button>
      )
    }
    if (this.isZeroPlan()) {
      this.api_button = null
    }

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
                      データ通信速度の切り替え
                    </li>
                  </ol>
                  <h1 className="a-h1">データ通信速度の切り替え</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            {this.state.user_nick_name}
                            <br />
                            {'（電話番号：' + this.state.lineInfo.lineNo + '）'}
                          </h2>
                        </div>
                      </div>

                      {this.items}
                    </div>
                    <hr className="a-hr a-hr-full" />
                    {(() => {
                      if (!this.isZeroPlan()) {
                        return (
                          <div className="m-form_section">
                            <p className="a-fw-bold">
                              表示中のSIMカードのデータ通信速度を切り替えられます。
                            </p>
                            <p>変更は即時に反映されます。</p>
                          </div>
                        )
                      } else {
                        return (
                          <div className="m-form_section">
                            <p className="a-fw-bold a-primary">
                              IoT
                              Zeroプランは速度切り替えをご利用いただけません。
                            </p>
                          </div>
                        )
                      }
                    })()}
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">{this.api_button}</p>
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
  let postReducer = state.PostReducer.postReducer
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
    iotPlans: postReducer.iotPlans,
  }
}

export default connect(mapStateToProps)(Speed_change)
