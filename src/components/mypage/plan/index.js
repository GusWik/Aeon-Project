// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

import {
  getAgreementData,
  getApplyEntryInfo,
  getService,
  getAppInfo,
} from '../../../actions/ArsActions'
import { getPlanList, getSimInfoEnable } from '../../../actions/Methods.js'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

class Plan extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataHistoryHandler = this.dataHistoryHandler.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.isStopPlanChange = this.isStopPlanChange.bind(this)

    this.sendApiName = ''

    this.state = {
      planId: 0,
      changePlanName: '',
      planName: '',
      planChangeHistory: [],
      status: 0,
      requestDate: '',
      planMst: [],
      groupActivateDate:
        props.history.location.state !== undefined
          ? props.history.location.state.groupActivateDate
          : '',
      type1Restriction: '',
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '',
          sessionNoUseFlg: '1',
          token: '',
        },
      ],
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
      simInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : [],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      simInfo_enable: [],
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
      valid_state: false,
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
                  {' '}
                  プラン変更を申込みます。
                  <br />
                  よろしいですか？{' '}
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
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          body: '',
          remarks: '',
          values: [
            {
              text: (
                <p>
                  プラン変更を取り消します。
                  <br /> よろしいですか？
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel2',
              value: 'キャンセル',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
            {
              id: 'dialog_button_ok2',
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
      isStop: false,
      mousikomiType: '',
      btnDisabled: true,
      studentDiscountEnds: false,
      nextPlan: null,
      nextPlanName: '',
      changeStatus: false, //変更フラグ
      changeCommitTime: '',
      contractStatus: '',
      customerInfo: {},
      planNum: '',
      isADFSLogined: false,
      isKind: false,
      disableEditBtn: true, //プラン選択枠がない場合の遷移ボタンの状態
      redirectApp:
        props.history.location.state !== undefined &&
        props.history.location.state.redirectApp === true
          ? true
          : false,
      is_enable_email: false,
      emailModal: false,
    }
  }

  handleConnect(type) {
    var params = {}
    if (type === Const.CONNECT_TYPE_PLAN) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        perNum: 3, // 固定
        pageNo: 1, // 固定
      }
    } else if (type === Const.CONNECT_TYPE_CHANGING_PLAN_MST) {
      let simKind = ''
      console.log('CONNECT_TYPE_CHANGING_PLAN_MST')
      console.log(this.props)
      if (
        this.props.location.state.simInfo.length > 1 ||
        this.props.location.state.simInfo[0] == '1'
      ) {
        // シェア or 音声
        simKind = '04'
      } else if (this.props.location.state.simInfo[0] == '2') {
        // SMS
        simKind = '02'
      } else {
        // データ
        simKind = '01'
      }
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        gender: this.props.customerInfo.gender,
        simKind,
      }
    } else if (type === Const.CONNECT_TYPE_CHANGE_PLAN) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        nowPlanId: this.state.planId,
        planId: $('.a-select option:selected').val(),
        token: this.state.token,
      }
    } else if (type === Const.CONNECT_TYPE_CANCEL_PLAN) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        nowPlanId: this.state.planChangeHistory[0].nowserviceId,
        planId: this.state.planChangeHistory[0].changeserviceId,
        token: this.state.token,
      }
    } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerInfoGetFlg: '',
        tokenFlg: '',
        simGetFlg: '1',
        sessionNoUseFlg: '',
        customerId: window.customerId,
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      }
    } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
      params = {
        customerId: window.customerId,
      }
    }
    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
    this.sendApiName = type
  }

  handleConnectChange(type, data, status, token) {
    console.log('=======================================')
    console.log('handleConnectChange')
    console.log(type, data, status)
    console.log('=======================================')
    if (token && type === Const.CONNECT_TYPE_PLAN) this.setState({ token })
    this.setState({ loading_state: false })

    if (status === Const.CONNECT_SUCCESS) {
      var params = data.data
      if (type === Const.CONNECT_TYPE_PLAN) {
        this.setState({ planName: params.planName })
        this.setState({ planId: params.planId })
        this.setState({
          changePlanName: params.planChangeHistory[0]
            ? params.planChangeHistory[0].changeserviceName
            : '',
        })
        this.setState({
          status: params.planChangeHistory[0]
            ? params.planChangeHistory[0].status
            : '',
        })
        this.setState({
          mousikomiType: params.planChangeHistory[0]
            ? params.planChangeHistory[0].mousikomi_type
            : '',
        })
        this.setState({
          requestDate: params.planChangeHistory[0]
            ? params.planChangeHistory[0].mousikomiDate
            : '',
        })
        this.setState({ token: params.token })
        this.setState({ planChangeHistory: params.planChangeHistory })
        this.setState({ isStop: params.stopFlg == 1 })
        this.handleConnect(Const.CONNECT_TYPE_CHANGING_PLAN_MST)
        // }
        this.checkKind()
        this.getPlanNum()
      } else if (type === Const.CONNECT_TYPE_CHANGING_PLAN_MST) {
        this.setState({ planMst: params.plan })

        //3年学割チェック
        this.getStudentDiscountEnds()
      } else if (type === Const.CONNECT_TYPE_CHANGE_PLAN) {
        //this.sendApiName = ''
        if (params.result === 'OK') {
          this.goNextDisplay(
            null,
            '/mypage/plan/complete/',
            this.state.lineInfo[0]
          )
        } else {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
        }
      } else if (type === Const.CONNECT_TYPE_CANCEL_PLAN) {
        this.sendApiName = ''
        if (data.data.result === 'OK') {
          this.goNextDisplay(null, '/mypage/plan/change/complete/')
        } else {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
        }
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        var params = data.data

        let groupActivateDate = params.lineInfo[0].groupActivateDate
        this.setState({
          groupActivateDate: groupActivateDate,
        })
        this.type1RestrictionFixing()
      } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
        // 契約ステータス(contractStatus)
        let contract = data.data.contractList.filter(
          (item) => item.customerId == window.customerId
        )[0]
        console.log(contract.contractStatus)
        this.setState({
          contractStatus: contract.contractStatus,
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
      } else if (
        this.sendApiName == Const.CONNECT_TYPE_CANCEL_PLAN ||
        this.sendApiName == Const.CONNECT_TYPE_CHANGE_PLAN
      ) {
        this.sendApiName = ''
        dialogs_copy[0].title = 'お申込みを受付できませんでした'
        var values = []
        values[0] = {
          text:
            'お申込みを受付できませんでした。この状態が続く場合はお客さまセンターまでお問い合わせください。',
        }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data.response.error_detail.error_message }
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

  type1RestrictionFixing() {
    //Type1 かつ (月末-1日 or 月末-2日) かつ 開通当日　の場合、プラン変更できない
    let dateEquals = (a, b) => {
      return (
        a.getFullYear() == b.getFullYear() &&
        a.getMonth() == b.getMonth() &&
        a.getDate() == b.getDate()
      )
    }
    let today = new Date()
    let activated = new Date(this.state.groupActivateDate)
    var type1Restriction = false
    if (dateEquals(today, activated) && this.state.lineInfo[0].lineDiv == '1') {
      //開通当日かつType1
      let last2day = new Date(today.getFullYear(), today.getMonth() + 1, -2)
      let last1day = new Date(today.getFullYear(), today.getMonth() + 1, -1)
      if (dateEquals(today, last1day) || dateEquals(today, last2day)) {
        //月末-1日 or 月末-2日
        type1Restriction = true
      }
    }
    this.setState({
      type1Restriction: type1Restriction,
    })
  }

  dataHistoryHandler(type, index) {
    if (this.state.planChangeHistory.length > 0) {
      var TempReturn = ' '
      var d = ''
      var year = ''
      var month = ''
      var day = ''
      var time_data = []
      var seconds_data = []
      switch (type) {
        case 'datetime':
          TempReturn = this.state.planChangeHistory[index].mousikomiDate
          break
        case 'datetime_formatted':
          d = this.state.planChangeHistory[index].mousikomiDate
          time_data = d.split(':')
          seconds_data = time_data[2].split('.')
          TempReturn =
            time_data[0] + '時' + time_data[1] + '分' + seconds_data[0] + '秒'
          TempReturn = d
          break
        case 'status':
          var temp = this.state.planChangeHistory[index].status
          switch (temp) {
            case '01':
              if (this.state.planChangeHistory[index].mousikomi_type == '02') {
                TempReturn = '取消依頼中'
              } else {
                TempReturn = '申請依頼中'
              }
              break
            case '02':
              TempReturn = '取消完了'
              break
            case '03':
              if (this.state.planChangeHistory[index].mousikomi_type == '02') {
                TempReturn = '取消依頼処理中'
              } else {
                TempReturn = '変更依頼処理中'
              }
              break
            case '04':
              TempReturn = '申請完了'
              break
            case '05':
              TempReturn = '申請失敗'
              break
            case '06':
              TempReturn = '取消完了'
              break
            case '07':
              TempReturn = '取消失敗'
              break
            case '08':
              TempReturn = '反映済み'
              break
            case '09':
              TempReturn = '反映失敗'
              break
            case '10':
              TempReturn = '反映中'
              break
            default:
              break
          }
          break
        case 'changeStatus':
          var temp = this.state.planChangeHistory[index].status
          switch (temp) {
            case '01':
              TempReturn = '未完了'
              break
            case '03':
              if (this.state.planChangeHistory[index].mousikomi_type == '02') {
                TempReturn = '完了'
              } else {
                TempReturn = '未完了'
              }
              break
            case '04':
              TempReturn = '完了'
              break
            case '07':
              TempReturn = '完了'
              break
            default:
              TempReturn = '完了'
              break
          }
          break
        case 'targetMonth':
          year = this.state.planChangeHistory[index].targetMonth.substring(0, 4)
          month = this.state.planChangeHistory[index].targetMonth.substring(4)
          day = '01'
          TempReturn = year + '/' + month + '/' + day
          break
        case 'cancelableMonth':
          d = new moment(this.dataHistoryHandler('targetMonth', 0))
          if (!this.isRequestedBeforeEndOfMonth()) {
            d.subtract(3, 'd')
          } else if (this.isRequestedBeforeEndOfMonth2Days()) {
            // 申請日が-2日18:59:59以前
            d.subtract(3, 'd')
          } else {
            d.subtract(2, 'd')
          }
          TempReturn = d.format('YYYY/MM/DD')
          break
        case 'before':
          TempReturn = this.state.planChangeHistory[index].nowserviceName
          break
        case 'after':
          TempReturn = this.state.planChangeHistory[index].changeserviceName
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  toggle_dialog_box() {
    var dialogs_copy = [...this.state.dialogs]

    if (!this.isPlanChanging()) {
      dialogs_copy[0].state = true
    } else {
      dialogs_copy[1].state = true
    }
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
          if (this.isPlanChanging()) {
            this.handleConnect(Const.CONNECT_TYPE_CANCEL_PLAN)
          } else {
            this.handleConnect(Const.CONNECT_TYPE_CHANGE_PLAN)
          }
          break
        }
        case 'dialog_button_cancel2': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 't-modal_overlay2': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok2': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
          if (this.isPlanChanging()) {
            this.handleConnect(Const.CONNECT_TYPE_CANCEL_PLAN)
          } else {
            this.handleConnect(Const.CONNECT_TYPE_CHANGE_PLAN)
          }
          break
        }
        default: {
          break
        }
      }
    }
  }

  checkBox() {
    if ($('#agreement').is(':checked')) {
      // CHECK WHEATHER DATE IS BELOW LAST DAY OR NOT
      this.setState({ btnDisabled: false })
    } else {
      this.setState({ btnDisabled: true })
    }
  }

  async componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_PLAN

    await this.getCustomerInfo()

    // 解約状態の回線を除いた配列
    const simInfo_enable = getSimInfoEnable(this.state.simInfo)
    this.setState({ simInfo_enable })

    this.handleConnect(Const.CONNECT_TYPE_PLAN)
    this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
    if (!this.state.groupActivateDate) {
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
    } else {
      this.type1RestrictionFixing()
    }

    this.checkBox()
    this.switchBtnDisplay()

    var self = this
    $(window).on('load resize', function () {
      self.switchBtnDisplay()
    })
    this.getChangeStatus()

    const { result } = await getAppInfo()
    if (result !== 'NG' && result.user_id) {
      this.setState({ isADFSLogined: true })
      console.log(result)
    }

    const { mailAddress, token } = await getAgreementData(window.customerId)
    if (mailAddress) {
      const email_domail = mailAddress.substr(mailAddress.indexOf('@') + 1)
      // ※下記が空かどうかで判別 ****@aeon.aeonも空扱いにする
      if (email_domail !== 'aeon.aeon') {
        this.setState({ is_enable_email: true })
      }
    }

    let passData = _.cloneDeep(this.state.passData)
    passData[0].token = token
    this.setState({ passData })
  }

  switchBtnDisplay() {
    var w = $(window).width()
    if (w >= 600) {
      $('#a-btn-dismiss-sp').css('display', 'none')
      $('#a-btn-dismiss-pc').css('display', 'block')
    } else {
      $('#a-btn-dismiss-sp').css('display', 'block')
      $('#a-btn-dismiss-pc').css('display', 'none')
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.goNextDisplay(null, '/login/')
          break
      }
    }
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()

    if (url === '/mypage/plan/change/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.simInfo = this.state.simInfo
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

    if (url === '/mypage/plan/complete/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.simInfo = this.state.simInfo
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/plan/history/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.lineKeyObject = this.state.lineInfo[0].lineKeyObject
      params.lineDiv = this.state.lineInfo[0].lineDiv
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/plan/edit/') {
      //let params = {}
      // NEED TO SEND THE CUSTOMER ID
      console.log(this.state.simInfo)
      params.simInfo = this.state.simInfo
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.lineKeyObject = this.state.lineInfo[0].lineKeyObject
      params.lineDiv = this.state.lineInfo[0].lineDiv
      params.redirectApp = this.state.redirectApp
      console.log('passdate::', params)
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

    if (url === '/mypage/mail') {
      console.log('passdate::', params)
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

  renderHistory() {
    let history = this.state.planChangeHistory.length ? (
      this.state.planChangeHistory.map((item, key) => (
        <tr key={'tr' + key}>
          <td className="m-operate_date">
            <span className="a-sp">
              {this.dataHistoryHandler('datetime', key)}
            </span>
            <span className="a-pc">
              {this.dataHistoryHandler('datetime_formatted', key)}
            </span>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">プラン適用日</dt>
              <dd>{this.dataHistoryHandler('targetMonth', key)}</dd>
            </dl>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">状態</dt>
              <dd>{this.dataHistoryHandler('status', key)}</dd>
            </dl>
          </td>
          <td>{this.before_after_empty_fixing(key)}</td>
        </tr>
      ))
    ) : (
      <td colSpan="4">
        <div style={{ padding: '2rem' }}>プラン変更履歴はありません。</div>
      </td>
    )
    let table = (
      <table className="m-operate">
        <colgroup>
          <col />
          <col />
          <col />
          <col className="a-wd-45" />
        </colgroup>
        <thead className="a-pc">
          <tr>
            <th>受付日時</th>
            <th>プラン適用日</th>
            <th>状態</th>
            <th>
              <div className="m-operate_changes">
                <span className="m-operate_changes_before">変更前</span>
                <span className="m-operate_changes_after">変更後</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="m-operate_tbody">{history}</tbody>
      </table>
    )
    return (
      <div>
        <div className="t-inner_wide">
          <div
            className="top-aside_header"
            style={{ padding: 0, marginBottom: '12px' }}
          >
            <h2 className="a-h3 a-fw-normal a-mb-5">◎プラン変更履歴</h2>
            <p className="m-btn">
              <a
                className="a-btn-link a-btn-link-sm"
                href=""
                onClick={(e) => this.goNextDisplay(e, '/mypage/plan/history/')}
              >
                一覧へ
              </a>
            </p>
          </div>
        </div>
        <div className="t-inner_wide" key="plan_change">
          {table}
        </div>
      </div>
    )
  }

  before_after_empty_fixing(key) {
    if (
      this.state.planChangeHistory[key].changeserviceName ||
      this.state.planChangeHistory[key].nowserviceName
    ) {
      return (
        <div className="m-operate_changes-arrow">
          <dl className="m-operate_dl-before">
            <dt className="a-sp">変更前</dt>
            <dd>{this.dataHistoryHandler('before', key)}</dd>
          </dl>
          <dl className="m-operate_dl-after">
            <dt className="a-sp">変更後</dt>
            <dd>{this.dataHistoryHandler('after', key)}</dd>
          </dl>
        </div>
      )
    } else {
      return ''
    }
  }

  // プラン変更ステータス一覧  →ステータスは下記の通りです。
  //01:受付 / 02:受付取消完了 / 03:申請 / 04:申請完了 / 05:申請失敗 / 06:取消完了 / 07:取消失敗 / 08:反映済み / 10:反映中

  // 変更中ステータス
  isPlanChanging() {
    return (
      this.state.status == '01' ||
      this.state.status == '03' ||
      this.state.status == '04' ||
      this.state.status == '07' ||
      this.state.status == '10'
    )
  }
  // 操作無効ステータス
  isChangeDisabled() {
    if (this.state.status == '01' && this.state.mousikomiType == '02') {
      return true
    } else if (this.state.status == '03') {
      return true
    } else if (this.state.status == '10') {
      return true
    } else {
      // 最終申し込みが月末-1日の18時59分以前 && ステータスが変更中の場合
      if (this.isRequestedBeforeEndOfMonth()) {
        if (this.isPlanChanging()) {
          // 月末-2日の18時59分〜月末-1日の18時59分は取り消し不可にする
          if (this.isEndOfMonth()) {
            // -1日〜月末
            return true
          } else {
            // 〜-2日の18時59分までの申し込みだった場合
            if (this.isRequestedBeforeEndOfMonth2Days()) {
              if (this.isEndOfMonth('before')) {
                // 月末-2日の18時59分〜月末-1日の18時59分
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          }
        }
      } else {
        if (this.isEndOfMonth('before')) {
          return (
            this.state.status == '04' ||
            this.state.status == '07' ||
            this.state.status == '10'
          )
        }
      }
    }
    return false
  }
  // 強制停止による無効ステータス
  isForceStop() {
    // 強制停止フラグ == true && 操作無効でない && 変更中でない
    //未収がある（支払いエラーがある）

    return (
      (this.state.isStop &&
        !this.isChangeDisabled() &&
        !this.isPlanChanging()) ||
      !this.isPaymentError()
    )
  }
  isPaymentError() {
    //未収がある（支払いエラーがある）
    return (
      this.props.paymentError &&
      this.props.paymentError.errorCode !== '0000' &&
      this.props.paymentError.unchangeableCreditCard == '0'
    )
  }
  // 月末制限
  isEndOfMonth(before) {
    var today = new Date()
    var hour = today.getHours()
    var diff
    if (before) {
      diff = 2
    } else {
      diff = 1
    }
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    // 月末-1(or-2)日の18時〜月末ならtrue
    if (today.getDate() == lastDay.getDate() - diff) {
      return hour >= 19
    } else {
      return lastDay.getDate() - diff < today.getDate()
    }
  }
  // 最終申し込みが月末-1日の18時以前かどうか（targetMonth基準）
  isRequestedBeforeEndOfMonth() {
    let targetMonth = this.state.planChangeHistory[0]
      ? this.state.planChangeHistory[0].targetMonth
      : 1
    let d = new Date()
    var month = d.getFullYear() * 100 + (d.getMonth() + 1) //ymで判定
    if (d.getMonth() == 11) {
      //12月なら翌年1月
      month = (d.getFullYear() + 1) * 100 + 1
    } else {
      month = month + 1
    }
    return month == parseInt(targetMonth, 10)
  }
  // 最終申し込み日時が-2日18時59分以前かどうか（mousikomiDate基準）
  isRequestedBeforeEndOfMonth2Days() {
    let requestDate = moment(this.state.requestDate)
    let d = new Date()
    let borderDate = moment()
      .endOf('month')
      .subtract(2, 'd')
      .hour(19)
      .minute(0)
      .second(0)
      .millisecond(0)
    return requestDate.isBefore(borderDate)
  }
  isIotZeroSelectable() {
    // 変更可能なプラン一覧にIoT Zeroが含まれているかどうか
    // 性別法人かつSMSなし
    let zeroPlans = this.props.iotPlans.zeroPlans
    let includes = false
    this.state.planMst.map((item) => {
      if (zeroPlans.indexOf(item.planId) !== -1) {
        includes = true
      }
    })
    return includes
  }

  //３年学割JSON 取得
  getStudentDiscountEnds() {
    fetch(
      `${Const.CONNECT_TYPE_IOT_TIME_LIMITED_PLANS}?v=${this.getTimestamp()}`,
      {
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
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (!json || json.length <= 0) return
        const today = moment()
        const clone = moment(today)

        //月末
        let lastDay = clone
          .endOf('month')
          .subtract(1, 'days')
          .startOf('date')
          .hour(18)
        //console.log('今月末 :', lastDay.format('YYYY-MM-DD HH:mm:ss'))

        let referenceMonth = moment(today)
        if (today.isAfter(lastDay, 'hour')) {
          referenceMonth = referenceMonth.add(1, 'month')
        }
        /* console.log(
          'referenceMonth :',
          referenceMonth.format('YYYY-MM-DD HH:mm:ss')
        ) */

        let SubjectData
        //JSONから現在月を絞る
        for (var key in json) {
          var expireAt = moment(key, 'YYYYMM')
          /* console.log(
            referenceMonth.format('YYYY/MM/DD'),
            expireAt.format('YYYY/MM/DD')
          )
          console.log('month', referenceMonth.isSame(expireAt, 'month')) */
          if (referenceMonth.isSame(expireAt, 'month')) {
            SubjectData = json[key]
            break
          }
        }

        //データなければ終了
        if (!SubjectData || SubjectData.length <= 0) return

        //月のデータから対象のプランIDがあるかどうか
        //対象日の学割情報
        let HitData = SubjectData.find((item) => {
          return item.originalPlanID == this.state.planId
        })

        //データなければ終了
        if (!HitData || HitData.length <= 0) return
        const nextPlan = this.state.planMst.find(
          (v) => v.planId == HitData.destinationPlanID
        )
        if (nextPlan) {
          this.setState({
            studentDiscountEnds: true,
            nextPlan: nextPlan,
            nextPlanName: nextPlan.planName,
          })
        }
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  isStopPlanChange() {
    //2/27 19:00〜3/2 10:00
    //3/1 0:00 からは、全員表示
    if (
      moment().isBetween(
        '2022-03-01 00:00:00',
        '2022-03-02 10:00:00',
        null,
        '[]'
      )
    ) {
      return true
    }
    //2/27 19:00〜 2/28 23:59:59プラン変更を申し込んでいない方
    //※2/27 19:00〜 23:59:59の期間は、プラン変更中の方はそもそも変更申込できないので表示不要

    //console.log('isPlanChanging', this.isPlanChanging())
    if (
      moment().isBetween(
        '2022-02-27 19:00:00',
        '2022-02-28 23:59:59',
        null,
        '[]'
      ) &&
      !this.isPlanChanging()
    ) {
      return true
    }

    return false
  }

  isGakuwariStopPlan() {
    // 月末-2日19:00から月末-1日の18:59までキャンセルできないようにする

    /* console.log(
      'isRequestedBeforeEndOfMonth',
      this.isRequestedBeforeEndOfMonth()
    )
    console.log(
      'isRequestedBeforeEndOfMonth2Days',
      this.isRequestedBeforeEndOfMonth2Days()
    )
    console.log('isEndOfMonth', this.isEndOfMonth('before')) */

    const today = moment()
    const clone = moment(today)

    //月末
    let lastDayStart = clone
      .clone()
      .endOf('month')
      .subtract(2, 'days')
      .startOf('date')
      .hour(19)
    let lastDayEnd = clone
      .clone()
      .endOf('month')
      .subtract(1, 'days')
      .startOf('date')
      .hour(19)
    console.log(
      '期間 :',
      lastDayStart.format('YYYY-MM-DD HH:mm:ss'),
      lastDayEnd.format('YYYY-MM-DD HH:mm:ss')
    )
    /* console.log(today.format('YYYY-MM-DD HH:mm:ss'))
    console.log(
      this.isPlanChanging() &&
        today.isBetween(lastDayStart, lastDayEnd, null, '[]')
    ) */
    if (today.isBetween(lastDayStart, lastDayEnd, null, '[]')) {
      return true
    }

    return false
  }

  //学割自動適用された人のステータス
  isGakuwariAutoStatus() {
    return (
      this.state.status == '01' ||
      this.state.status == '03' ||
      this.state.status == '04'
    )
  }

  //学割最終月かつプラン変更ステータスが01,03,04のいずれか、かつ-2日19時以降-1日18:59:59まで
  isDisabledGakuwariCancelPlan() {
    //console.log('学割適用', this.state.studentDiscountEnds)
    //console.log('自動適用', this.isGakuwariAutoStatus())
    //console.log('適用期間', this.isGakuwariStopPlan())
    if (this.state.studentDiscountEnds) {
      return this.isGakuwariStopPlan() && this.isGakuwariAutoStatus()
    }
    return false
  }

  linkChangePlan() {
    //this.props.history.push('/mypage/plan/edit')
  }

  async getChangeStatus() {
    const { result, commitTime, planServiceId } = await getApplyEntryInfo(
      window.customerId,
      '305'
    )

    if (result !== 'NG') {
      this.setState({
        changeStatus: true,
        changeCommitTime: commitTime,
      })
      //PLAN名取得API
      if (planServiceId) {
        const { planName: changePlanName } = await getService(planServiceId)
        this.setState({ changePlanName })
      }
    }
  }

  getCustomerInfo() {
    const lineKeyObject = localStorage.getItem('lineKeyObject')
    const body = {
      customerInfoGetFlg: '1',
      tokenFlg: '1',
      simGetFlg: '',
      sessionNoUseFlg: 1,
      customerId: window.customerId,
      lineKeyObject: lineKeyObject || '',
    }
    const params = {
      body: JSON.stringify(body),
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
    }
    return fetch(Const.DOMAIN + Const.CONNECT_TYPE_AGREEMENT_DATA, params)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        try {
          if (json && json.data) {
            console.log(json.data.customerInfo)
            this.setState({ customerInfo: json.data.customerInfo })
            return json.data.customerInfo
          }

          return null
        } catch (error) {
          return null
        }
      })
      .catch((err) => {
        console.log('ConnectError :', err)
        this.errApplyNumber()
        return null
      })
  }

  //シェア回線追加中
  isChangeFlag() {
    const cancelContract = localStorage.getItem('cancelContract')
    if (
      this.state.contractStatus !== 'sent' || //シェア追加中
      this.state.customerInfo.cancelRequestDate != '' ||
      cancelContract == '1'
    ) {
      return true
    }
    return false //変更OK
  }

  async getPlanNum() {
    let planNum = ''

    const { planKind, customerType, seniorPlanFlag } = await getService(
      this.state.planId
    )

    if (planKind === 1) {
      if (seniorPlanFlag) {
        planNum = '11' // やさしい音声プラン
      } else if (customerType === 3) {
        planNum = 'a01' // APP音声プラン
      } else {
        planNum = '01' // 音声プラン
      }
    } else if (planKind === 2) {
      if (seniorPlanFlag) {
        planNum = '12' // やさしいデータプラン
      } else if (customerType === 3) {
        planNum = 'a02' // APPデータプラン
      } else {
        planNum = '02' // データプラン
      }
    } else if (planKind === 3) {
      if (seniorPlanFlag) {
        planNum = '13' // やさしいシェア音声プラン
      } else if (customerType === 3) {
        planNum = 'a03' // APPシェア音声プラン
      } else {
        planNum = '03' // シェアプラン
      }
    }

    const isAppuser = this.state.isADFSLogined || customerType === 3

    const plan_list = getPlanList(
      planNum,
      isAppuser,
      this.state.isKind,
      this.state.lineInfo[0].lineDiv,
      this.state.simInfo_enable.length > 1 ? true : false // 1回線以下の場合 isMulti=true
    )
    if (plan_list.length === 0) {
      this.setState({ disableEditBtn: true })
    } else {
      this.setState({ disableEditBtn: false })
    }
  }

  checkKind() {
    let isKind = false

    if (this.state.customerInfo.birthday) {
      const birthday0 = moment(this.state.customerInfo.birthday).format('YYYY')
      const birthday1 = moment(this.state.customerInfo.birthday).format('MM')
      const birthday2 = moment(this.state.customerInfo.birthday).format('DD')

      const birthday = moment([birthday0, parseInt(birthday1) - 1, birthday2])

      const now = moment()
      if (now.diff(birthday, 'years') >= 60) {
        isKind = true
      }

      console.log(now.diff(birthday, 'years'))
    }
    this.setState({ isKind })
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
              <span>高速通信中</span>
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

    if (
      this.state.type1Restriction === true ||
      this.state.type1Restriction === ''
    ) {
      this.check_box_tag = ''
      this.api_button = ''
    } else {
      this.api_button = (
        <button
          className="a-btn-submit"
          id="submit"
          type="button"
          disabled={this.state.btnDisabled || !this.isForceStop()}
          onClick={this.toggle_dialog_box}
        >
          {!this.isPlanChanging() ? '上記内容で申し込む' : '取り消し'}
        </button>
      )

      this.item = this.state.planMst.map((item, key) => (
        <option value={item.planId} key={'tr' + key}>
          {item.planName}
        </option>
      ))

      this.check_box_tag = <span className="a-weak">同意します</span>
      this.make_a_plan = (
        <li>
          お申込み内容、「ご確認ください」をご確認いただき
          <span className="a-primary">「同意します」にチェック</span>
          を入れてお申し込みください。
        </li>
      )
    }

    this.make_gakuwari_text = this.isDisabledGakuwariCancelPlan() ? (
      <p>
        ※ご自身でご希望のプランに変更したい場合は、イオンモバイルお客さまセンターに
        <a className="a-link" href="/contact/">
          お問い合わせ
        </a>
        ください。
      </p>
    ) : (
      <p>
        ※ご自身でご希望のプランに変更したい場合は、以下のプラン一覧からお選びください。
      </p>
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
                    <li className="m-breadcrumb_item">料金プランのご変更</li>
                  </ol>
                  <h1 className="a-h1">料金プランのご変更</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <h2 className="a-h3 a-fw-normal a-mb-5">
                        ◎ご利用中の料金プラン
                      </h2>
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h3 className="a-h3">{this.state.planName}</h3>
                        </div>
                      </div>
                    </div>

                    {(() => {
                      if (
                        (this.state.studentDiscountEnds &&
                          !this.isPlanChanging()) ||
                        this.isDisabledGakuwariCancelPlan()
                      ) {
                        return (
                          <div className="t-inner_wide">
                            <div
                              style={{
                                margin: '0 auto 10px',
                                width: '0',
                                height: '0',
                                borderStyle: 'solid',
                                borderBottom: '0 solid transparent',
                                borderRight: '16rem solid transparent',
                                borderLeft: '16rem solid transparent',
                                borderTop: '30px solid #faf7df',
                              }}
                            />

                            <h2 className="a-h3 a-fw-normal a-mb-5">
                              ◎翌月適用予定の料金プラン
                            </h2>
                            <div
                              className="m-box-bg a-ta-center"
                              style={{ background: '#faf7df' }}
                            >
                              <div className="m-box_body">
                                <h3 className="a-h3">
                                  {this.state.nextPlanName}
                                </h3>
                              </div>
                            </div>
                            {this.make_gakuwari_text}
                          </div>
                        )
                      }
                    })()}

                    <div className="m-form_section">
                      <p>
                        月々のご利用プラン（高速データ通信の容量）のご変更のお申込みができます。
                      </p>
                      <ul className="a-list">
                        <li>‣ プラン変更手数料は無料です。</li>
                        <li>
                          ‣「音声プラン→データプラン」「データプラン→音声プラン」などの変更はできません。
                        </li>
                        <li>
                          ‣
                          ご契約のプランにより、こちらから変更できるプランに制限がある場合がございます。
                          <br />
                          （表示されたプラン以外に変更をご希望の場合は、イオンモバイルお客さまセンターまでお問い合わせください）
                        </li>
                      </ul>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    {this.state.changeStatus && (
                      <div className="t-inner_wide" key="plan">
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
                              </td>
                            </tr>
                            <tr>
                              <th>プラン変更のお手続き</th>
                              <td className="a-fw-bold a-primary">申込み中</td>
                            </tr>
                            <tr>
                              <th>申請日</th>
                              <td className="a-fw-bold">
                                {moment(this.state.changeCommitTime).format(
                                  'YYYY年M月D日H:mm'
                                )}
                              </td>
                            </tr>
                            {/* <tr>
                              <th>プラン適用日</th>
                              <td className="a-fw-bold">
                                {this.dataHistoryHandler('targetMonth', 0)}
                              </td>
                            </tr>
                            <tr>
                              <th>取消可能期限</th>
                              <td className="a-fw-bold">
                                {this.dataHistoryHandler('cancelableMonth', 0)}
                              </td>
                            </tr> */}
                          </tbody>
                        </table>

                        <div className="m-box">
                          <div className="m-box_body">
                            <h3 className="a-h3">ご確認ください</h3>
                            <ul className="a-list-border">
                              <li>
                                毎月末日の前日18:59までプランの変更と取消が可能です。
                                <br />
                                但し、月末日の前々日18:59までにプランの変更を申し込まれた方は、その申込が適用される翌月1日までプランの変更ができなくなります。
                              </li>
                              <li>
                                毎月月末の前日19:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
                              </li>
                              <li>
                                システムメンテナンス日は、お申込みいただけません。
                              </li>
                              <li>
                                ご利用料金のお支払いが確認できていないお客さまは、プラン変更のお申込みをお受けしかねる場合がございます。
                              </li>
                              {this.make_a_plan}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {(() => {
                      if (!this.state.changeStatus) {
                        if (this.isStopPlanChange()) {
                          return (
                            <div className="t-inner_wide" key="plan_change">
                              <h2 className="a-h3 a-fw-normal a-mb-5">
                                ◎プラン変更停止中
                              </h2>
                              <p className="a-mb-20">
                                システムメンテナンスにともない、プラン変更の受付を停止しております。
                                <br />
                                受付再開は、3月2日(水)10時00分を予定しております。
                                <br />
                                システムメンテナンスの詳細は、お知らせをご確認ください。
                              </p>
                            </div>
                          )
                        } else {
                          if (this.isPlanChanging()) {
                            return (
                              <div className="t-inner_wide" key="plan">
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
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>プラン変更のお手続き</th>

                                      <td className="a-fw-bold a-primary">
                                        <div>
                                          {' '}
                                          {this.dataHistoryHandler(
                                            'changeStatus',
                                            0
                                          )}{' '}
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>申請日</th>
                                      <td className="a-fw-bold">
                                        {this.state.requestDate}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>プラン適用日</th>
                                      <td className="a-fw-bold">
                                        {this.dataHistoryHandler(
                                          'targetMonth',
                                          0
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>取消可能期限</th>
                                      <td className="a-fw-bold">
                                        {this.dataHistoryHandler(
                                          'cancelableMonth',
                                          0
                                        )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div className="m-box">
                                  <div className="m-box_body">
                                    <h3 className="a-h3">ご確認ください</h3>
                                    <ul className="a-list-border">
                                      <li>
                                        毎月末日の前日18:59までプランの変更と取消が可能です。
                                        <br />
                                        但し、月末日の前々日18:59までにプランの変更を申し込まれた方は、その申込が適用される翌月1日までプランの変更ができなくなります。
                                      </li>
                                      <li>
                                        毎月月末の前日19:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
                                      </li>
                                      {(() => {
                                        if (this.isIotZeroSelectable()) {
                                          return (
                                            <li>
                                              法人専用プラン「IoT
                                              Zero」へプランへ変更される場合は、当月分も含む利用しなかった高速データ通信容量の繰り越しはできません。ご注意ください。
                                            </li>
                                          )
                                        }
                                      })()}
                                      <li>
                                        プラン変更取消後、再度プラン変更をお申込みいただく場合はプラン変更の取消完了後お申込みいただけます。
                                      </li>
                                      {this.make_a_plan}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )
                          } else {
                            return (
                              <div>
                                {false == this.isChangeFlag() && (
                                  <div
                                    className="t-inner_wide"
                                    key="plan_change"
                                  >
                                    <h2 className="a-h3 a-fw-normal a-mb-5">
                                      ◎プラン一覧
                                    </h2>
                                    <div className="m-field">
                                      <select className="a-select" id="planId">
                                        <option value="">
                                          変更後のプランをお選びください。
                                        </option>
                                        {this.item}
                                      </select>
                                      <div
                                        className="m-field_error a-error"
                                        id="planId_error"
                                      />
                                    </div>
                                    {!this.state.disableEditBtn && (
                                      <div style={{ marginBottom: '24px' }}>
                                        <button
                                          onClick={(e) => {
                                            {
                                              if (this.state.is_enable_email) {
                                                this.goNextDisplay(
                                                  e,
                                                  '/mypage/plan/edit/',
                                                  this.state.lineInfo[0]
                                                )
                                              } else {
                                                this.setState({
                                                  emailModal: true,
                                                })
                                              }
                                            }
                                          }}
                                          /* onClick={this.linkChangePlan} */
                                          className="btn_plan_change"
                                        >
                                          上記以外のプランへの変更をご希望の方はこちら
                                        </button>
                                      </div>
                                    )}

                                    <div className="m-box">
                                      <div className="m-box_body">
                                        <h3 className="a-h3">ご確認ください</h3>
                                        <ul className="a-list-border">
                                          <li>
                                            毎月末日の前日18:59までプランの変更と取消が可能です。
                                            <br />
                                            但し、月末日の前々日18:59までにプランの変更を申し込まれた方は、その申込が適用される翌月1日までプランの変更ができなくなります。
                                          </li>
                                          <li>
                                            毎月月末の前日19:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
                                          </li>
                                          {(() => {
                                            if (this.isIotZeroSelectable()) {
                                              return (
                                                <li>
                                                  法人専用プラン「IoT
                                                  Zero」へプランへ変更される場合は、当月分も含む利用しなかった高速データ通信容量の繰り越しはできません。ご注意ください。
                                                </li>
                                              )
                                            }
                                          })()}
                                          <li>
                                            システムメンテナンス日は、お申込みいただけません。
                                          </li>
                                          <li>
                                            ご利用料金のお支払いが確認できていないお客さまは、プラン変更のお申込みをお受けしかねる場合がございます。
                                          </li>
                                          {this.make_a_plan}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          }
                        }
                      }
                    })()}

                    {(() => {
                      /* console.log('isChangeDisabled', !this.isChangeDisabled())
                      console.log('isForceStop', !this.isForceStop())
                      console.log(
                        !this.isChangeDisabled() && !this.isForceStop()
                      ) */
                      if (false == this.isChangeFlag()) {
                        if (!this.state.changeStatus) {
                          if (!this.isStopPlanChange()) {
                            return (
                              <React.Fragment>
                                {!this.isChangeDisabled() &&
                                !this.isDisabledGakuwariCancelPlan() &&
                                !this.state.type1Restriction ? (
                                  <div className="m-form_section">
                                    <div className="m-field">
                                      <div className="m-field_control-check">
                                        <label htmlFor="agreement">
                                          <input
                                            className="a-input-checkbox"
                                            type="checkbox"
                                            id="agreement"
                                            disabled={!this.isForceStop()}
                                            data-agreement-target="submit"
                                            onClick={(e) => this.checkBox()}
                                          />
                                          {this.check_box_tag}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                                {this.state.type1Restriction ? (
                                  <div className="m-form_section">
                                    <p className="a-primary a-fs-sm a-ta-center">
                                      <b>
                                        本日開通いただいたタイプ1回線については、プラン変更のお申し込みを受付できません。
                                        <br />
                                        恐れ入りますが、明日以降に再度お手続きいただきますようお願いいたします。
                                      </b>
                                    </p>
                                    <div
                                      className="m-btn-group"
                                      style={{ marginBottom: '5rem' }}
                                    >
                                      <p className="m-btn">{this.api_button}</p>
                                    </div>
                                  </div>
                                ) : null}
                                {!this.isChangeDisabled() &&
                                !this.isDisabledGakuwariCancelPlan() ? (
                                  <div className="m-form_section">
                                    {(() => {
                                      if (!this.isForceStop()) {
                                        return (
                                          <p className="a-primary a-fs-sm a-ta-center">
                                            <b>
                                              ご登録いただきましたクレジットカードに複数回請求が出来ないなど、
                                              <br />
                                              お支払い状況が正常ではない場合プラン変更のお申込みができません
                                            </b>
                                          </p>
                                        )
                                      }
                                    })()}
                                    <div
                                      className="m-btn-group"
                                      style={{ marginBottom: '5rem' }}
                                    >
                                      <p className="m-btn">{this.api_button}</p>
                                    </div>
                                  </div>
                                ) : null}
                              </React.Fragment>
                            )
                          }
                        } else {
                          return (
                            <div>
                              <div className="m-form_section">
                                <p className="a-primary a-h3">
                                  ※お手続きが完了するまでは、「取り消し」は行えません。
                                </p>
                                <div
                                  className="m-btn-group"
                                  style={{ marginBottom: '5rem' }}
                                >
                                  <p className="m-btn">{this.api_button}</p>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      }
                    })()}

                    {this.renderHistory()}
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn" id="a-btn-dismiss-sp">
                          <a
                            className="a-btn-dismiss"
                            onClick={() => {
                              this.props.history.push('/login')
                            }}
                          >
                            戻る
                          </a>
                        </p>
                        <p className="m-btn" id="a-btn-dismiss-pc">
                          <a
                            className="a-btn-dismiss"
                            onClick={() => {
                              this.props.history.push('/login')
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

        {this.state.emailModal && (
          // emailが有効な場合

          <div className="xl-modal is-active">
            <div className="xl-modal_content">
              <p className="xl-modal_title">メールアドレス登録のお願い</p>
              <p className="xl-modal_desc">
                メールアドレスの登録が完了しておりません。
                <br />
                各種お手続きを行う際に、お手続きの申し込み完了やお手続き処理の完了について、メールでお知らせしております。この機会にメールアドレスのご登録をお願い致します。
              </p>
              <div className="xl-modal_btns">
                <button
                  className="xl-modal_btn border"
                  onClick={(e) => {
                    this.goNextDisplay(
                      e,
                      '/mypage/plan/edit/',
                      this.state.lineInfo[0]
                    )
                  }}
                >
                  メールアドレスを登録せず進む
                </button>
                <button
                  className="xl-modal_btn primary"
                  onClick={(e) => {
                    this.goNextDisplay(
                      e,
                      '/mypage/mail',
                      this.state.passData[0]
                    )
                  }}
                >
                  メールアドレスを登録する
                </button>
              </div>
            </div>
            <div
              className="xl-modal_overlay"
              onClick={() =>
                this.setState({
                  emailModal: false,
                })
              }
            ></div>
          </div>
        )}
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
    customerInfo: postReducer.customerInfo,
    iotPlans: postReducer.iotPlans,
    paymentError: postReducer.paymentError,
  }
}

export default connect(mapStateToProps)(Plan)
