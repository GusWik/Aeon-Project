// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $, { timers } from 'jquery'
import moment from 'moment'

// IMPORT COMMON CSS
import '../../../../assets/css/common.css'

// IMPORT IMAGES

// IMPORT COMPONENT BASE
import ComponentBase from '../../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../../modules/Header.js'
import Dialog from '../../../../../modules/Dialog.js'

import loadingImage from '../../../../../modules/images/loaderTop.gif'

// 通信用のモジュールを読み込み
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../../actions/PostActions.js'

class User_Cancellation_Procedure extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.getApplyNumber = this.getApplyNumber.bind(this)
    this.setCancelLine = this.setCancelLine.bind(this)
    this.popUp = this.popUp.bind(this)
    this.getTelNumber = this.getTelNumber.bind(this)
    this.checkConfirmationTel = this.checkConfirmationTel.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.errApplyNumber = this.errApplyNumber.bind(this)
    this.checkPlanStauts = this.checkPlanStauts.bind(this)
    this.showPlanErrorDialog = this.showPlanErrorDialog.bind(this)
    this.checkDisabledPlan = this.checkDisabledPlan.bind(this)

    this.state = {
      pageLoaded: false,
      customerInfo: [
        {
          address: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          aeonPeopleFlag: '',
          birthday: '',
          gender: '',
          phoneNumber: '',
          postCode: '',
          sharePlanFlag: '',
          userName: '',
          userNameKana: '',
          userNameKanaMei: '',
          userNameKanaSei: '',
          userNameMei: '',
          userNameSei: '',
          endDate: '',
          startDate: '',
          unpaidFlag: '',
          cancelRequestDate: '',
        },
      ],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      contractStatus: '',
      loading_state: false,
      token: '',
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
          type: Const.DIALOG_ONE,
          title: 'お手続き内容が変更されました',
          values: [
            {
              text: (
                <p>
                  全ての回線を選択されたので、イオンモバイル通信契約を解約するに変更されました
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_status_change_ok',
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
          type: Const.DIALOG_THREE,
          title: 'ご確認ください',
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
              callback: () =>
                this.callbackDialog(
                  Const.EVENT_CLICK_BUTTON,
                  'dialog_time_check_confirm_cancel'
                ),
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: () =>
                this.callbackDialog(
                  Const.EVENT_CLICK_BUTTON,
                  'dialog_time_check_confirm_ok'
                ),
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },
        {
          id: 3,
          type: Const.DIALOG_ONE,
          title:
            '翌月開始プランが確定済み（反映待ち）のため、解約のお申し込みを受付できません',
          values: [
            {
              text: (
                <p>プラン反映以降（翌月1日以降）に再度お申し込みください</p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_plan_error_ok',
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
      lineInfo: [
        {
          lineDiv: '',
          lineKeyObject: '',
          planName: '',
          removeStatus: '',
        },
      ],
      check_lICCIDs: [],
      simInfo: [
        {
          ICCID: '',
          lineNo: '',
          nickName: '',
          highSpeedDataStatus: '',
          cancelDate: '', //IIJ解約日
          removeDate: '', //解約日
          simType: '', //回線種別
          cancelRequestDate: '',
        },
      ],
      lineInfoNum: 0,
      planId: 0,
      planName: '',
      cancelType: 1,
      cancelTypeDisabled: false,
      seniorPlanFlag: 0,
      check_agreement: [false, false, false, false, false, false, false],
      lineKeyObject: localStorage.getItem('lineKeyObject') || '',
      makeLineStatus: [],
      confirmationTel: null,
      timeLimit: '',
      check_timeNext: false,
      check_timeAfter: false,
      plan_data: null,
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_CANCELLATION_PROCEDURE

    if (
      this.props.history.location.state &&
      this.props.history.location.state.type === '02'
    ) {
      //SIM詳細
      //SIM番号
      this.setState({
        lineInfoNum: this.props.history.location.state.lineNo,
        cancelType: 2,
      })
    }

    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 1)
      this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
    }

    $('.t-modal_overlay').click(function () {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('#modal_customer.t-modal_content').removeClass('is-active')
      $('#ConfirmationTel').val('')
    })

    $('#ConfirmationTel').on('input', function (event) {
      $('#ConfirmationTel').removeClass('is-error')
      $('#confirmationTel_error').text('')
    })
  }

  // 通信処理
  handleConnect(type, num, value) {
    var params = {}
    var lineDiv = localStorage.getItem('lineDiv')
    switch (type) {
      case Const.CONNECT_TYPE_REQUESTMNP:
        params = {
          lineKeyObject: this.state.lineKeyObject,
          lineDiv: lineDiv || '',
          lineNo: value.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      // api AMM00005 - agreement
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        params = {
          customerId: window.customerId,
          customerInfoGetFlg: '',
          sessionNoUseFlg: '',
          tokenFlg: '1',
          simGetFlg: '1',
          lineKeyObject: this.state.lineKeyObject,
        }
        if (num == 2) {
          params['customerInfoGetFlg'] = '1'
          params['simGetFlg'] = ''
        }
        // IF simGetFlg is 0 then lineKeyObject is not passing
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        params = {
          customerId: window.customerId,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_CANCEL_LINE:
        params = {
          applyNumber: value.applyNumber,
          receptionistKbn: '2',
          receptionStoreCode: '',
          receptionistCode: '',
          receptionistName: '',
          cancelType: this.state.cancelType.toString(),
        }

        if (this.state.cancelType == 2) {
          //cancelTypeが1だったら simInfo: []
          //cancelTypeが2だったら siminfo:[{iccid:解約する回線のICCID}]
          let selectList = this.state.makeLineStatus.filter(
            (key) => key.select == true
          )
          var removelineNo = selectList.map((item) => {
            var obg = {}
            obg['iccid'] = item.ICCID
            return obg
          })
          params['simInfo'] = removelineNo
        }

        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))

        break
      case Const.CONNECT_TYPE_PLAN:
        //var _lineDiv = localStorage.getItem('lineDiv')
        params = {
          lineKeyObject: this.state.lineKeyObject,
          lineDiv: lineDiv || '',
          perNum: 3, // 固定
          pageNo: 1, // 固定
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, true))
        break
      default:
        // json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  makeLineInfo() {
    var { simInfo, makeLineStatus } = this.state

    if (
      simInfo.every(
        (key) =>
          this.checkCancellation(
            key.removeDate,
            key.cancelDate,
            key.simType,
            key.cancelRequestDate
          ).flg == true
      )
    ) {
      //エラー内容
      //全ての回線が操作不能なためエラー画面へ遷移させる
      this.props.history.push('/error?e=6')
      return
    }
    makeLineStatus = simInfo.map((item) => {
      return Object.assign(item, {
        updateFlag: false,
        select: this.state.lineInfoNum == item.lineNo ? true : false,
        disabled: this.checkCancellation(
          item.removeDate,
          item.cancelDate,
          item.simType,
          item.cancelRequestDate
        ).flg
          ? '2'
          : '0',
        Expiration: '',
        MNPNumber: '',
        MNPPendingStatus: '',
        MNPRequestDate: '',
        MNPStatus: '',
      })
    })

    if (simInfo.length == 1 && this.state.cancelType == 2) {
      makeLineStatus.map((key) => {
        key.select = false
        return key
      })
      this.setState({
        lineInfoNum: 0,
        cancelType: 1,
      })
    }

    if (
      makeLineStatus.some((key) => key.disabled == '2' || key.disabled == '1')
    ) {
      this.setState({ cancelTypeDisabled: true, cancelType: 2 })
    }
    this.setState({ makeLineStatus })
    var lineDiv = localStorage.getItem('lineDiv')
    simInfo.map(async (item) => {
      if ((item.simType == '1' || item.simType == '4') && lineDiv == '1') {
        await this.handleConnect(Const.CONNECT_TYPE_REQUESTMNP, 0, {
          lineNo: item.lineNo,
        })
      }
    })
  }

  makeLineObj(param, json) {
    var { makeLineStatus } = this.state

    if (json && param && param.lineNo !== '') {
      makeLineStatus.map((item) => {
        if (item.lineNo == param.lineNo) {
          let mnpStatus = item.disabled
          if (this.checkStatus(json.MNPStatus) == '1') {
            mnpStatus = true
          }

          return Object.assign(item, {
            updateFlag: true,
            select: this.state.lineInfoNum == param.lineNo ? true : false,
            disabled: mnpStatus,
            Expiration: json.Expiration,
            MNPNumber: json.MNPNumber,
            MNPPendingStatus: json.MNPPendingStatus,
            MNPRequestDate: json.MNPRequestDate,
            MNPStatus: json.MNPStatus,
          })
        }
      })

      if (this.state.cancelType == 2 && this.state.lineInfoNum) {
        let fund = makeLineStatus.find(
          (item) => item.lineNo == this.state.lineInfoNum
        )
        if (fund && fund.select && fund.disabled != '0') {
          this.setState({
            lineInfoNum: 0,
            //cancelType: 1,
          })
        }
      }

      if (makeLineStatus.some((key) => key.disabled == true)) {
        this.setState({ cancelTypeDisabled: true, cancelType: 2 })
        //MNP予約番号判定ロジックを元に、契約中回線でMNPを申し込んでおり、当日が有効期限+1日を超えていない回線が1回線でもある場合選択不可
      }

      if (
        makeLineStatus.every(
          (key) => key.updateFlag && key.MNPStatus != '' && key.MNPStatus != '0'
        )
      ) {
        //エラー内容
        //全ての回線が操作不能なためエラー画面へ遷移させる
        this.props.history.push('/error?e=7')
        return
      }

      //解約回線がある
      //解約済    removeDate != ''
      //回線解約中 removeDate = '' and  sim.SimCancelRequestDate != ''
      //         removeDate = '' and  agreement.customerInfo.cancelRequestDate != ''
      //契約解約中 removeDate = '' and  sim.ContractCancelRequestDate != ''
      //         removeDate = '' and  agreement.lineInfo.simInfo.cancelRequestDate!= ''

      if (
        makeLineStatus.some((key) => {
          return (
            (key.removeDate == '' && key.cancelRequestDate != '') ||
            (key.removeDate == '' && this.state.customerInfo.cancelRequestDate)
          )
        })
      ) {
        this.props.history.push('/error?e=6')
        return
      }

      this.setState({ makeLineStatus })
    }
  }

  //解約チェック
  checkCancellation(removeDate, cancelDate, simType, cancelRequestDate) {
    const today = moment()

    if (removeDate != '') {
      if (today.isSame(removeDate, 'month')) {
        //解約済み MNPポートアウト（月中解約済）	removeDateが当月でcancelDateが月末でない
        if (
          cancelDate != '' &&
          !moment().endOf('month').isSame(moment(cancelDate), 'day')
        ) {
          console.log('解約済み MNPポートアウト（月中解約済）')
          return {
            flg: true,
            msg: '解約済み ',
            status: 5,
          }
        }
        console.log('解約予約済')
        //解約予約済(解約当月の場合)	removeDateが当月で空でない
        return {
          flg: true,
          msg: '解約申込済',
          status: 4,
        }
      } else {
        //解約済み removeDateが当月でなくて空でない
        console.log('解約済み')
        return {
          flg: true,
          msg: '解約済み',
          status: 1,
        }
      }
    } else if (cancelDate != '' && (simType == '1' || simType == '4')) {
      console.log('解約済み(MNP解約手続き中の回線)	')
      //解約済み(MNP解約手続き中の回線)	simTypeが1 or 4で、removeDateが空、cancelDateがあり
      return {
        flg: true,
        msg: '解約手続き中',
        status: 2,
      }
    } else if (cancelRequestDate != '') {
      console.log('解約手続き中')
      //解約手続き中	cancelRequestDateが空でなくてremoveDateが空
      return {
        flg: true,
        msg: '解約手続き中',
        status: 3,
      }
    } else {
      console.log('契約中')
      // 契約中
      return {
        flg: false,
        msg: '',
        status: 0,
      }
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token, param) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 1)
        this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        var params = data.data
        if (params.customerInfo && params.customerInfo.userName != '') {
          if (params.customerInfo.cancelRequestDate != '') {
            this.props.history.push('/error?e=6')
            return
          }

          if (params.customerInfo.sharePlanFlag != '1') {
            this.setState({ cancelType: 1, lineInfoNum: 0 })
          }

          this.setState({ customerInfo: params.customerInfo })

          let l_Corp = localStorage.getItem('l_Corp')
          // 1:大口法人 0 それ以外
          if (l_Corp && l_Corp == '1') {
            this.props.history.push('/error?e=8')
            return
          }
          //プランチェック行う
          this.handleConnect(Const.CONNECT_TYPE_PLAN)
        } else {
          this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 2)
        }
        if (params.lineInfo.length) {
          this.setState({ lineInfo: params.lineInfo })
          let _url_data = this.state.url_data
          _url_data[0].pass_data = Object.assign(
            _url_data[0].pass_data,
            params.lineInfo[0]
          )
          this.setState({ url_data: _url_data })
          this.setState({
            simInfo: params.lineInfo[0].simInfo,
          })

          this.makeLineInfo()
        }
      } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
        // 契約ステータス(contractStatus)
        let contract = data.data.contractList.filter(
          (item) => item.customerId == window.customerId
        )[0]
        this.setState({
          contractStatus: contract.contractStatus,
        })
      } else if (type === Const.CONNECT_TYPE_REQUESTMNP) {
        this.makeLineObj(param, data.data)
      } else if (type === Const.CONNECT_TYPE_CANCEL_LINE) {
        this.goNextDisplay(null, '/mypage/user/cancellation/procedure/complete')
      } else if (type === Const.CONNECT_TYPE_PLAN) {
        this.setState({ plan_data: data.data })
        this.checkPlanStauts()
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
        values[0] = { text: data.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else {
        this.props.history.push('/login')
      }
    }
  }

  checkStatus(mnpStatus) {
    // mnpStatusが0以外の場合は、発行中と判定する
    // CRSimInfoMnpStatus {//0：新規発行可能、1：発行申請受付済み,発行待ち、2：有効なMNP予約番号あり、3：新規発行抑止期間
    //  let ready = 0
    //  let publishing = 1
    //  let exists = 2
    //  let suspended = 3
    // }
    // 1,2,3は、予約番号が発行済か、申請中か、期限切れ後の抑止期間
    // ncomの場合は（空文字）を返す。
    if (mnpStatus && mnpStatus != '' && mnpStatus != '0') {
      return '1'
    }

    return '0'
  }

  goNextDisplay(e, url, params) {
    if (url == '/mypage/user/cancellation/procedure/complete') {
      this.props.history.push({
        pathname: url,
      })
      return
    }
    e.preventDefault()
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  // CHECK SERVER ERROR
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
    console.log('this is from the header*******************')
    console.log(params)
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }
  returnPlanName(item) {
    if (item.planName) {
      return item.planName
    } else {
      if (
        (item.contractStatus == 'beforeRegistration' &&
          item.warehouseStatus == 'cancel') ||
        (item.contractStatus == 'cancel' && item.warehouseStatus == 'cancel')
      ) {
        // キャンセル
        return <span style={{ color: '#B50080' }}>お申し込みキャンセル</span>
      } else if (
        item.contractStatus == 'verified' &&
        item.warehouseStatus == 'invalidCheckEC'
      ) {
        // 申し込み内容不備
        return <span style={{ color: '#B50080' }}>お申し込み内容不備</span>
      }
    }
  }

  returnLineCount() {
    return (this.state.simInfo && this.state.simInfo.length) || '-'
  }

  returnLineNum(num) {
    return (this.state.simInfo && this.state.simInfo[num].lineNo) || '-'
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
          // 操作対象契約切替API
          this.handleConnect(Const.CONNECT_TYPE_CHANGE_CONTRACT)
          break
        }
        case 'dialog_status_change': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_status_change_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_time_check_confirm': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[2].state = true

          if (this.checkTimeNext()) {
            dialogs_copy[2].values = [
              {
                text: (
                  <p>
                    ただいまお申し込みいただいた場合、お手続きが翌月1日となります。当月中の解約とはなりません。
                  </p>
                ),
              },
            ]
          } else if (this.checkTimeAfter()) {
            dialogs_copy[2].values = [
              {
                text: (
                  <p>
                    ただいまお申し込みいただいた場合、お手続きが明日となります。本日中の解約とはなりません。
                  </p>
                ),
              },
            ]
          } else {
            dialogs_copy[2].state = false
          }

          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_time_check_confirm_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[2].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_time_check_confirm_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[2].state = false
          this.setState({ dialogs: dialogs_copy })
          this.setCancelLine()
          break
        }
        case 'dialog_plan_error': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[3].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_plan_error_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[3].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        default: {
          break
        }
      }
    }
  }

  //同意のチェックボックス
  checkBox(event, num) {
    var _check_agreement = this.state.check_agreement
    if ($('#agreement_' + num).is(':checked')) {
      _check_agreement[num] = true
    } else {
      _check_agreement[num] = false
    }
    this.setState({ check_agreement: _check_agreement })
  }

  //全て同意されているかどうか
  checkAll(arr) {
    let flag = false
    if (this.checkTimeNext()) {
      flag = arr.every((value) => value == true) && this.state.check_timeNext
    } else if (this.checkTimeAfter()) {
      flag = arr.every((value) => value == true) && this.state.check_timeAfter
    } else {
      flag = arr.every((value) => value == true)
    }
    return !flag
  }

  // 申込番号発行
  async getApplyNumber() {
    let body = {
      applyType: 3,
      receptionType: 5,
    }
    let params = {
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
    $('.t-wrapper').hide()
    $('.loading').show()
    return fetch(Const.ARS_CREATE_APPLY_NUMBER, params)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        try {
          if (json && json.data.applyNumber) {
            return json.data.applyNumber
          } else {
            this.errApplyNumber()
          }
          return null
        } catch (error) {
          this.errApplyNumber()
        }
      })
      .catch((err) => {
        $('.t-wrapper').show()
        $('.loading').hide()
        console.log('ConnectError :', err)
        this.errApplyNumber()
        return null
      })
  }

  errApplyNumber() {
    $('.t-modal_overlay').click()
    var dialogs_copy = [...this.state.dialogs_error]
    var values = []
    dialogs_copy[0].title = 'ご確認ください'
    values[0] = { text: '現在申込処理中の情報変更があります。' }
    dialogs_copy[0].values = values
    dialogs_copy[0].state = true
    this.setState({ dialogs_error: dialogs_copy })
  }

  async setCancelLine() {
    let applyNumber = await this.getApplyNumber()
    $('.t-wrapper').show()
    $('.loading').hide()
    if (!applyNumber) {
      return
    }
    console.log('applyNumber', applyNumber)
    this.handleConnect(Const.CONNECT_TYPE_CANCEL_LINE, 0, {
      applyNumber: applyNumber,
    })
  }

  handleChangeCancelType(val) {
    if (val == 1) {
      var { makeLineStatus } = this.state
      makeLineStatus.map((key) => {
        key.select = false
        return key
      })
    }
    this.setState({ cancelType: val })
  }

  //同意のチェックボックス
  LineCheck(event, lineNo, index) {
    var { makeLineStatus } = this.state
    makeLineStatus[index].select = event.target.checked

    //プランチェック挟む
    if (this.state.plan_data.planChangeHistory) {
      if (
        this.state.plan_data.planChangeHistory.length > 0 &&
        this.state.plan_data.planChangeHistory[0]
      ) {
        var lastplanChangeHistory = this.state.plan_data.planChangeHistory[0]
        if (this.checkDisabledPlan(lastplanChangeHistory)) {
          if (
            makeLineStatus.every((key) => {
              console.log(key.disabled, key.select == true)
              if (key.disabled == '0') {
                return key.select
              } else {
                return true
              }
            })
          ) {
            this.goTop()
            //タイプ２
            this.callbackDialog(Const.EVENT_CLICK_BUTTON, 'dialog_plan_error')
            makeLineStatus.map((key) => {
              key.select = false
              return key
            })
            this.setState({
              cancelTypeDisabled: true,
              cancelType: 2,
              makeLineStatus,
            })
            return
          }
        }
      }
    }

    if (makeLineStatus.every((key) => key.select == true)) {
      this.goTop()

      //通常
      this.callbackDialog(Const.EVENT_CLICK_BUTTON, 'dialog_status_change')
      makeLineStatus.map((key) => {
        key.select = false
        return key
      })
      this.setState({
        cancelTypeDisabled: false,
        cancelType: 1,
        makeLineStatus,
      })
    } else {
      this.setState({
        cancelType: 2,
        makeLineStatus: makeLineStatus,
      })
    }
  }

  popUp(e) {
    e.preventDefault()
    this.setState({ confirmationTel: '' })

    if (this.state.cancelType == 2) {
      var isSelect = this.state.makeLineStatus.every(
        (key) => key.select == false
      )

      if (isSelect) {
        $('#siminfo_error').text('解約する回線を選択してください')
        this.goTop()
        return
      } else {
        $('#siminfo_error').text('')
      }
    }
    this.goTop()

    $('.t-modal').addClass('is-active')
    $('.t-modal_content').addClass('is-active')
  }

  checkConfirmationTel(e) {
    var tel = $('#ConfirmationTel').val()

    if (!tel || tel == '') {
      $('#ConfirmationTel').addClass('is-error')
      $('#confirmationTel_error').text('入力してください')
      return
    }

    var selectTels = this.getTelNumber()
    if (!selectTels) return

    // 完全一致
    if (
      !selectTels.some((item) => {
        return item.lineNo == tel
      })
    ) {
      $('#ConfirmationTel').addClass('is-error')
      $('#confirmationTel_error').text('入力内容を確認してください')
      return
    }

    e.preventDefault()

    let isCheckAfter = this.checkTimeAfter() && !this.state.check_timeAfter
    let isCheckNext = this.checkTimeNext() && !this.state.check_timeNext

    if (isCheckAfter || isCheckNext) {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('#modal_customer.t-modal_content').removeClass('is-active')
      $('#ConfirmationTel').val('')
      this.callbackDialog(
        Const.EVENT_CLICK_BUTTON,
        'dialog_time_check_confirm',
        ''
      )
    } else {
      this.setCancelLine()
    }
  }

  getTelNumber() {
    let selectList = this.state.makeLineStatus
    if (this.state.cancelType == 2) {
      selectList = this.state.makeLineStatus.filter((key) => key.select == true)
    }
    if (selectList && selectList.length > 0) {
      return selectList
    }
    return null
  }
  checkBoxTimeNext(event, num) {
    var check_timeNext = this.state.check_timeNext
    if ($('#agreement_' + num).is(':checked')) {
      check_timeNext = true
    } else {
      check_timeNext = false
    }
    this.setState({ check_timeNext: check_timeNext })
  }
  checkBoxTimeAfter(event, num) {
    var check_timeAfter = this.state.check_timeAfter
    if ($('#agreement_' + num).is(':checked')) {
      check_timeAfter = true
    } else {
      check_timeAfter = false
    }
    this.setState({ check_timeAfter: check_timeAfter })
  }

  checkTimeNext() {
    const today = moment()
    const clone = moment(today).startOf('day')
    //月末
    let lastDay = clone.clone().endOf('month')
    let lastNeforeDay = lastDay
      .clone()
      .subtract(1, 'days')
      .startOf('date')
      .hour(18)
    return (
      today.clone().isSame(lastDay, 'day') ||
      today.clone().isSameOrAfter(lastNeforeDay, 'hour')
    )
  }
  checkTimeAfter() {
    const today = moment()
    const clone = moment(today).startOf('day')
    let after18 = clone.clone().hour(18)

    return today.clone().isSameOrAfter(after18, 'hour')
  }
  getNowTime() {
    /* 月末日全日、月末-1日の18時以降 */
    if (this.checkTimeNext()) {
      return (
        <div className="t-inner_wide">
          <div className="m-box-bg">
            <p className="">
              ただいまお申し込みいただいた場合、お手続きが翌月1日となります。当月中の解約とはなりません。
            </p>
          </div>
          <div className="m-field">
            <div className="m-field_control-check">
              <label htmlFor="agreement_98">
                <input
                  className="a-input-checkbox"
                  type="checkbox"
                  id="agreement_98"
                  onClick={(e) => this.checkBoxTimeNext(e, 98)}
                />
                <span className="a-weak">確認しました</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
    if (this.checkTimeAfter()) {
      return (
        <div className="t-inner_wide">
          <div className="m-box-bg">
            <p className="">
              ただいまお申し込みいただいた場合、お手続きが明日となります。本日中の解約とはなりません。
            </p>
          </div>
          <div className="m-field">
            <div className="m-field_control-check">
              <label htmlFor="agreement_99">
                <input
                  className="a-input-checkbox"
                  type="checkbox"
                  id="agreement_99"
                  onClick={(e) => this.checkBoxTimeAfter(e, 99)}
                />
                <span className="a-weak">確認しました</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
  }

  //月末-2日でプラン変更が確定した状態で-1日に解約を申し込むとBBで利用開始前エラーとなる
  checkPlanStauts() {
    console.log('planChangeHistory', this.state.plan_data.planChangeHistory)
    if (
      this.state.plan_data.planChangeHistory.length > 0 &&
      this.state.plan_data.planChangeHistory[0]
    ) {
      var lastplanChangeHistory = this.state.plan_data.planChangeHistory[0]
      if (this.checkDisabledPlan(lastplanChangeHistory)) {
        this.setState({ cancelTypeDisabled: true })
        if (this.state.cancelType == 1) {
          if (
            this.state.makeLineStatus.every(
              (key) =>
                key.updateFlag && key.MNPStatus != '' && key.MNPStatus != '0'
            )
          ) {
            this.showPlanErrorDialog()
            return
          } else if (this.state.customerInfo.sharePlanFlag != '1') {
            this.showPlanErrorDialog()
            return
          } else {
            this.setState({ cancelTypeDisabled: true, cancelType: 2 })
          }
        }
      }
    }

    this.setState({ pageLoaded: true })
  }
  checkDisabledPlan(lastplanChangeHistory) {
    //プラン変更履歴の一番最新の状態を見て、ステータスが１０の場合
    //プラン変更履歴の最終更新日時が月末-2日19時より前（最終更新日時 < 月末-2日19時）、
    //かつ現在日時が月末-2日19時以降（現在日時 > 月末-2日19時）、
    //かつ最終ステータスが4
    var status = lastplanChangeHistory.status
    if (status == '10') {
      return true
    }
    if (status == '04') {
      var mousikomiDate = moment(lastplanChangeHistory.mousikomiDate)
      //
      var today = moment()
      var endMonth = moment()
        .endOf('month')
        .subtract(2, 'days')
        .hour(19)
        .minute(0)
        .second(0)

      console.log(mousikomiDate.format('YYYY-MM-DD HH:mm:ss'))
      console.log(endMonth.format('YYYY-MM-DD HH:mm:ss'))
      console.log(today.format('YYYY-MM-DD HH:mm:ss'))
      console.log(
        mousikomiDate.valueOf() < endMonth.valueOf() &&
          today.valueOf() > endMonth.valueOf()
      )
      if (
        mousikomiDate.valueOf() < endMonth.valueOf() &&
        today.valueOf() > endMonth.valueOf()
      ) {
        return true
      }
    }
    return false
  }

  showPlanErrorDialog() {
    var dialogs_copy = [...this.state.dialogs_error]
    var values = []
    dialogs_copy[0].title =
      '翌月開始プランが確定済み（反映待ち）のため、解約のお申し込みを受付できません'
    values[0] = {
      text: 'プラン反映以降（翌月1日以降）に再度お申し込みください',
    }
    dialogs_copy[0].values = values
    dialogs_copy[0].state = true
    this.setState({ dialogs_error: dialogs_copy })
  }

  render() {
    var { customerInfo, lineInfo, pageLoaded } = this.state

    this.tel_list = this.state.makeLineStatus.map((key, i) => (
      <li key={'simInfo_' + key.lineNo}>
        <div className="m-field_control-check">
          <label htmlFor={'sim_' + key.lineNo}>
            <input
              className="a-input-checkbox"
              type="checkbox"
              disabled={key.disabled == '2' || key.disabled == '1'}
              checked={key.select}
              value={key.select}
              id={'sim_' + key.lineNo}
              onClick={(e) => this.LineCheck(e, key.lineNo, i)}
            />
            <span className="a-weak">
              {key.lineNo} (ICCID: {key.ICCID})
            </span>
            <span
              className="a-primary a-fs-sm"
              style={{
                display: key.disabled == '1' ? 'inline' : 'none',
                padding: '0 0 0 20px',
              }}
            >
              MNP予約番号取得中につき解約できません
            </span>
            <span
              className="a-primary a-fs-sm"
              style={{
                display: key.disabled == '2' ? 'inline' : 'none',
                padding: '0 0 0 20px',
              }}
            >
              解約済です
            </span>
          </label>
        </div>
      </li>
    ))
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
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
                  <ol className="m-breadcrumb">
                    <li className="m-breadcrumb_item">
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">解約手続き</li>
                  </ol>
                  <h1 className="a-h1">解約手続き</h1>

                  {!pageLoaded ? (
                    <React.Fragment>
                      <div
                        className=""
                        style={{ margin: '150px 0', textAlign: 'center' }}
                      >
                        <img
                          className=""
                          style={{
                            width: 104,
                            height: 14,
                            margin: 'auto',
                          }}
                          id="loading_img"
                          src={loadingImage}
                          alt="ローディング中..."
                        />
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <h2 className="a-h3 a-fw-normal a-mb-10 a-pc">
                        対象のご契約をご確認ください
                      </h2>
                      <div className="">
                        <table className="list-contracts-table">
                          <colgroup>
                            <col />
                            <col />
                            <col />
                          </colgroup>
                          <thead className="a-pc">
                            <tr>
                              <th>ご契約者名</th>
                              <th>お客さまID</th>
                              <th>プラン名</th>
                              <th>回線数</th>
                              <th>ご契約回線番号1</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="list-contracts-selected">
                              <td className="list-contracts-name arrow">
                                <div className="name-contents">
                                  <dl className="">
                                    <dt
                                      className="a-sp"
                                      style={{ width: '100%' }}
                                    >
                                      ご契約者名 :
                                    </dt>
                                    <dd style={{ wordBreak: 'keep-all' }}>
                                      {customerInfo.userName}
                                    </dd>
                                  </dl>
                                </div>
                              </td>
                              <td>
                                <dl>
                                  <dt className="a-sp">お客さまID</dt>
                                  <dd style={{ wordBreak: 'keep-all' }}>
                                    {window.customerId}
                                  </dd>
                                </dl>
                              </td>
                              <td>
                                <dl>
                                  <dt className="a-sp">プラン名</dt>
                                  <dd>{lineInfo[0].planName}</dd>
                                </dl>
                              </td>
                              <td>
                                <dl>
                                  <dt className="a-sp">回線数</dt>
                                  <dd>{this.returnLineCount()}</dd>
                                </dl>
                              </td>
                              <td>
                                <dl>
                                  <dt className="a-sp">ご契約回線番号1</dt>
                                  <dd style={{ wordBreak: 'keep-all' }}>
                                    {this.returnLineNum(0)}
                                  </dd>
                                </dl>
                              </td>
                              <td className="list-contracts-status">
                                <div
                                  style={{
                                    flex: 1,
                                    width: '100%',
                                    textAlign: 'center',
                                  }}
                                >
                                  <span>選択中</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p>お手続き内容を選択してください</p>
                      <div className="m-form_section">
                        <div className="m-field">
                          <div className="m-field_control-check">
                            <label
                              htmlFor="cancelType1"
                              style={{ cursor: 'default' }}
                            >
                              <input
                                className="a-input-radio"
                                type="radio"
                                name="cancelType"
                                id="cancelType1"
                                checked={this.state.cancelType === 1}
                                onChange={() => this.handleChangeCancelType(1)}
                                disabled={this.state.cancelTypeDisabled}
                              />
                              <span>イオンモバイル通信契約を解約する</span>
                            </label>
                          </div>

                          {(() => {
                            if (this.state.customerInfo.sharePlanFlag == '1') {
                              return (
                                <React.Fragment>
                                  <div className="m-field_control-check">
                                    <label
                                      htmlFor="cancelType2"
                                      style={{ cursor: 'default' }}
                                    >
                                      <input
                                        className="a-input-radio"
                                        type="radio"
                                        name="cancelType"
                                        id="cancelType2"
                                        checked={this.state.cancelType === 2}
                                        onChange={() =>
                                          this.handleChangeCancelType(2)
                                        }
                                        //disabled={this.state.notice_data.status == 1}
                                      />
                                      <span>一部回線を解約する</span>
                                    </label>
                                  </div>
                                  <div
                                    style={{
                                      margin: '20px 40px 40px',
                                    }}
                                  >
                                    <div className="m-field">
                                      <ul className="a-list">
                                        {this.tel_list}
                                      </ul>
                                    </div>
                                    <div
                                      className="m-field_error a-error"
                                      id="siminfo_error"
                                    />
                                  </div>
                                </React.Fragment>
                              )
                            }
                          })()}
                        </div>
                      </div>
                      <p>
                        解約のお手続きについて、以下の内容をご確認ください。
                        <br />
                        ご確認、ご同意いただいた上で各項目にチェックを入れてください。
                      </p>

                      <div>
                        {this.getNowTime()}
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              解約をお申し込みいただき、処理が完了すると解約を取り消すことができません
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_0">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_0"
                                  onClick={(e) => this.checkBox(e, 0)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              基本料金、オプションサービス料などの月額定額料金は、解約のお申し込み日にかかわらず、当月の料金を満額でご請求します。
                              <br />
                              通話料・SMS通信料・高速データ通信容量の追加などの従量料金は、解約のお申し込み日にかかわらず、ご利用の全額をご請求します。
                              <br />
                              通話料・SMS通信料は、解約の翌々月、月額定額料金から1か月遅れて請求されます（一部の料金はさらに遅れて請求される場合があります）。
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_1">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_1"
                                  onClick={(e) => this.checkBox(e, 1)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              回線および一部を除くオプションは月末までご利用いただけます。
                              <br />
                              通話、SMS送受信、高速データ通信容量の追加もご利用頂けます。ご利用の際はご利用の全額を請求します。
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_2">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_2"
                                  onClick={(e) => this.checkBox(e, 2)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              シェア音声プランを音声プランへ変更される場合は、音声プランで利用される回線（電話番号）以外の回線を解約する必要があります。
                              <br />
                              （MNP転出の場合、解約の反映は転出後数日かかります）
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_3">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_3"
                                  onClick={(e) => this.checkBox(e, 3)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              解約のお手続きを開始すると、対象回線のMNP予約番号の取得は行なえません
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_4">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_4"
                                  onClick={(e) => this.checkBox(e, 4)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              解約対象回線にて、オプションの解約、かけ放題オプションの切り替えをお申し込み中の場合、オプションに関するお申し込みは取り消しとさせていただきます
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_5">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_5"
                                  onClick={(e) => this.checkBox(e, 5)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="t-inner_wide">
                          <div className="m-box-bg">
                            <p className="">
                              次月のプラン変更をお申し込み頂いており、契約を解約される場合、プラン変更のお申し込みは取り消しとさせていただきます
                            </p>
                          </div>
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label htmlFor="agreement_6">
                                <input
                                  className="a-input-checkbox"
                                  type="checkbox"
                                  id="agreement_6"
                                  onClick={(e) => this.checkBox(e, 6)}
                                />
                                <span className="a-weak">確認しました</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="m-form_section">
                        <p className="m-btn">
                          <button
                            disabled={this.checkAll(this.state.check_agreement)}
                            className="a-btn-submit"
                            onClick={this.popUp}
                            type="button"
                          >
                            解約を申し込む
                          </button>
                        </p>
                        <p className="m-btn">
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
                    </React.Fragment>
                  )}
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

          <div className="t-modal" style={{ position: 'fixed' }}>
            <div className="t-modal_overlay" />
            <div
              className="t-modal_content kaiyaku"
              id="modal_id"
              style={{
                top: '50%',
                marginTop: `-${$('#modal_id').height() / 2}px`,
              }}
            >
              <div className="m-modal">
                <div className="m-modal_inner">
                  <h2 className="a-h3  m-modal_attention a-primary a-ta-center">
                    ご確認ください
                  </h2>
                  <p>
                    以下の内容で解約を申し込みます。
                    <br />
                    内容に誤りがなければ、
                    <b className="a-primary">解約対象のいずれかの電話番号</b>
                    を入力して
                    <br />
                    「解約を申し込む」からお申し込みください。
                  </p>
                  <table className="a-table-bg">
                    <tbody>
                      <tr>
                        <th>解約種別</th>
                        <td>
                          :
                          <b>
                            {this.state.cancelType == 2
                              ? '一部回線を解約する'
                              : 'イオンモバイル通信契約を解約する'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <th>対象お客さまID</th>
                        <td>
                          : <b>{window.customerId}</b>
                        </td>
                      </tr>
                      {(() => {
                        var telList = this.getTelNumber()
                        if (telList) {
                          var block_tel = telList.map((key) => (
                            <li style={{ marginBottom: '3px' }}>
                              : <b>{key.lineNo}</b>
                            </li>
                          ))
                          return (
                            <tr>
                              <th>対象電話番号</th>
                              <td>
                                <ul className="a-list">{block_tel}</ul>
                              </td>
                            </tr>
                          )
                        }
                      })()}
                    </tbody>
                  </table>
                  <div className="a-mb-40">
                    <div className="m-field">
                      <div className="m-field_control">
                        <input
                          className="a-input"
                          type="text"
                          id="ConfirmationTel"
                          onChange={(e) => {
                            this.setState({ confirmationTel: e.target.value })
                            //if (e.keyCode == '13') this.onLogin()
                          }}
                          tabIndex="1"
                        />
                        <label
                          className="m-field_label a-label"
                          htmlFor="ConfirmationTel"
                        >
                          確認用電話番号入力
                        </label>
                      </div>
                      <div
                        className="m-field_error a-error"
                        id="confirmationTel_error"
                      />
                    </div>
                  </div>
                  <p className="m-btn">
                    <button
                      onClick={this.checkConfirmationTel}
                      className="a-btn-submit"
                      type="button"
                      disabled={!this.state.confirmationTel}
                    >
                      解約を申し込む
                    </button>
                  </p>
                </div>
              </div>
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
    url: postReducer.url,
    parameters: postReducer.parameters,
    type: postReducer.type,
    paymentError: postReducer.paymentError,
  }
}
export default connect(mapStateToProps)(User_Cancellation_Procedure)
