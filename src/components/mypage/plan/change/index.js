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
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const'

// IMPORT MODULES
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class Plan_change extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.scrollToTop = this.scrollToTop.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.dateFixing = this.dateFixing.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      loading_state: false,
      planId: 0,
      changeId: 0,
      changePlanId: 0,
      changePlanName: '',
      status: 0,
      requestDate: '',
      adaptionDate: '',
      cancellationDate: '',
      v_state: 0,
      planMst: [],
      commissionMst: [],

      // LINE INFO
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

      simInfo: 
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : '',

      token: '',

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
                  プラン変更を申込みます。
                  <br /> よろしいですか？
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
      btnDisabled: true,
    }
  }

  handleConnect(type) {
    var params = {}
    if (type === Const.CONNECT_TYPE_PLAN) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    } else if (type === Const.CONNECT_TYPE_CHANGING_PLAN_MST) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    } else if (type === Const.CONNECT_TYPE_CANCEL_PLAN) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        changeId: this.state.changeId,
        token: this.state.token,
      }
    } else if (type === Const.CONNECT_TYPE_COMMISSION_MST) {
      params = {
        id: '2',
      }
    }

    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    this.setState({ loading_state: false })

    if (status === Const.CONNECT_SUCCESS) {
      var params = data.data
      switch (type) {
        case Const.CONNECT_TYPE_PLAN:
          {
            // IF 10 then redirected to plan
            if (params.status === '10') {
              this.goNextDisplay(e, '/mypage/plan/', this.state.lineInfo[0])
            } else {
              this.setState({ planId: params.planId })
              this.setState({ changeId: params.changeId })
              this.setState({ changePlanId: params.changePlanId })
              this.setState({ changePlanName: params.changePlanName })
              this.setState({ status: params.status })
              this.setState({ requestDate: params.requestDate })
              this.setState({ token: params.token })
              this.handleConnect(Const.CONNECT_TYPE_CHANGING_PLAN_MST)
              this.dateFixing()
            }
          }
          break
        case Const.CONNECT_TYPE_CHANGING_PLAN_MST:
          {
            this.setState({ planMst: params.plan })
            this.handleConnect(Const.CONNECT_TYPE_COMMISSION_MST)
          }
          break
        case Const.CONNECT_TYPE_COMMISSION_MST:
          {
            this.setState({ commissionMst: data.data })
          }
          break
        case Const.CONNECT_TYPE_CANCEL_PLAN: {
          if (data.data.result === 'OK') {
            this.goNextDisplay(e, '/mypage/plan/change/complete/')
          } else {
            var dialogs_copy = [...this.state.dialogs]
            dialogs_copy[0].state = false
            this.setState({ dialogs: dialogs_copy })
          }
          break
        }
        case Const.CONNECT_TYPE_CHANGE_PLAN: {
          if (data.data[0].result === 'OK') {
            this.goNextDisplay(
              e,
              '/mypage/plan/complete/',
              this.state.lineInfo[0]
            )
          } else {
            var dialogs_copy = [...this.state.dialogs]
            dialogs_copy[0].state = false
            this.setState({ dialogs: dialogs_copy })
          }
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
          if (this.state.status === '10') {
            this.handleConnect(Const.CONNECT_TYPE_CHANGE_PLAN)
          } else {
            this.handleConnect(Const.CONNECT_TYPE_CANCEL_PLAN)
          }
          break
        }
        default: {
          break
        }
      }
    }
  }

  dataFixingHandler(type, index) {
    if (this.state.commissionMst.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'planId':
          TempReturn = this.state.planMst[index].planId
          break
        case 'commission':
          TempReturn = this.state.commissionMst[index].commission
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  dateFixing() {
    if (this.state.requestDate) {
      var dx = new Date()
      var d = new Date(this.state.requestDate)
      // next month first day
      d.setMonth(d.getMonth() + 1)
      d.setDate('01')
      this.setState({
        adaptionDate:
          d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(),
      })
      // this month last day
      d.setDate(d.getDate() - 3)
      this.setState({
        cancellationDate:
          d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(),
      })
      var dx_before = new Date(d)
      dx_before.setDate(dx_before.getDate() + 1)
      var dx_after = new Date(d)
      dx_after.setDate(dx_after.getDate() + 3)
      // dx => SYSTEM DATE
      // d => CANCELLATION DATE
      // v_state:0 => valid (available)
      // v_state:0 => invalid (unavailable)
      if (dx < dx_before) {
        // IF SYSTEM DATE IS BEFORE CANCELLATION DATE
        this.setState({ v_state: 0 })
      } else {
        // IF SYSTEM DATE IS AFTER CANCELLATION DATE
        if (dx < dx_after) {
          // IF SYSTEM DATE IS AFTER CANCELLATION DATE BEFORE 2 DAYS
          this.setState({ v_state: 1 })
        } else {
          // IF SYSTEM DATE IS AFTER CANCELLATION DATE AFTER 2 DAYS
          this.setState({ v_state: 0 })
        }
      }
    } else {
      // SYSTEM DATE
      var dx = new Date()
      var y = dx.getFullYear()
      var m = dx.getMonth()
      // if this month is january
      var lastDay = new Date(y, m + 1, 0, 21, 0, 0) // End of the month 31/01/2019 21:00:00
      var nextDay = new Date(y, m + 1, 1) // First of next month 01/02/2019 00:00:00
      if (dx < lastDay) {
        this.setState({ v_state: 0 })
      } else {
        if (dx < nextDay) {
          this.setState({ v_state: 1 })
        } else {
          this.setState({ v_state: 0 })
        }
      }
    }
  }

  checkBox() {
    if (this.state.v_state === 0) {
      if ($('#agreement').is(':checked')) {
        this.setState({ btnDisabled: false })
      } else {
        this.setState({ btnDisabled: true })
      }
    } else {
      this.setState({ btnDisabled: true })
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_PLAN_CHANGE
    this.handleConnect(Const.CONNECT_TYPE_PLAN)
    this.checkBox()
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.goNextDisplay(e, '/login/')
          break
      }
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/mypage/plan/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.simInfo = this.state.simInfo
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/login/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/plan/complete/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/plan/change/complete/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
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
        disabled={this.state.btnDisabled}
        onClick={this.toggle_dialog_box}
      >
        取り消し
      </button>
    )

    if (this.state.v_state === 0) {
      this.check_box_tag = <span className="a-weak">同意します</span>
      this.make_a_plan = (
        <li>
          お申込み内容、「ご確認ください」をご確認いただき
          <span className="a-primary">「同意します」にチェック</span>
          を入れてお申し込みください。
        </li>
      )
    } else {
      this.check_box_tag = ''
      this.make_a_plan = ''
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
                      プラン確認・変更・取消
                    </li>
                  </ol>
                  <h1 className="a-h1">プラン確認・変更・取消</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <h2 className="a-h3 a-fw-normal a-mb-5">
                        ◎現在ご利用中のプラン
                      </h2>
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h3 className="a-h3">
                            {' '}
                            {(this.state.commissionMst.planName != undefined
                              ? this.state.commissionMst.planName
                              : '') +
                              '　税込 ' +
                              (this.state.commissionMst.commission != undefined
                                ? this.state.commissionMst.commission
                                : '') +
                              ' 円'}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <p>
                        月々の通信容量変更のお申し込みやお申し込みの取消が行えます。
                      </p>
                      <p>
                        「音声通話機能付き→シェア音声プラン」、「データプラン→データSMS付プラン」のように契約種別をまたぐプランの変更はできません。
                      </p>
                      <p>
                        また、ご契約プランにより、マイページよりプラン変更ができないプランがございます。
                      </p>
                      <p>※プラン変更手数料は、無料です。</p>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="t-inner_wide">
                      <h2 className="a-h3 a-fw-normal a-mb-5">
                        ◎変更申請中のプラン
                      </h2>
                      <table className="a-table-bg a-table-between">
                        <tbody>
                          <tr>
                            <th>
                              申請中
                              <br />
                              プラン
                            </th>

                            <td className="a-fw-bold">
                              {this.state.changePlanName}
                              <br />
                              税込{' '}
                              {this.state.commissionMst.commission != undefined
                                ? this.state.commissionMst.commission
                                : ''}{' '}
                              円
                            </td>
                          </tr>
                          <tr>
                            <th>状態</th>

                            <td className="a-fw-bold a-primary">
                              {this.state.status === '10' ? (
                                <div> 申請可 </div>
                              ) : this.state.status === '20' ? (
                                <div> 受付待ち </div>
                              ) : null}
                            </td>
                          </tr>
                          <tr>
                            <th>申請日</th>
                            <td className="a-fw-bold">
                              {this.state.requestDate}
                            </td>
                          </tr>
                          <tr>
                            <th>プラン適応日</th>
                            <td className="a-fw-bold">
                              {this.state.adaptionDate}
                            </td>
                          </tr>
                          <tr>
                            <th>取消可能期限</th>
                            <td className="a-fw-bold">
                              {this.state.cancellationDate}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="m-box">
                        <div className="m-box_body">
                          <h3 className="a-h3">ご確認ください</h3>
                          <ul className="a-list-border">
                            <li>
                              月末日の2日前以降は、お申込み内容を取り消す事はできません。
                            </li>
                            {this.make_a_plan}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
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
                            {this.check_box_tag}
                          </label>
                        </div>
                      </div>
                    </div>
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
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
  }
}

export default connect(mapStateToProps)(Plan_change)
