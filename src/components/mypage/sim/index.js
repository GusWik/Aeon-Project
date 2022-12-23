import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import _ from 'lodash'

import '../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

// 通信用のモジュールを読み込み
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

import { getApplyNumber, getApplyEntryInfo } from '../../../actions/ArsActions'

// setTimeout処理
var st

class Sim extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      api_data: {},
      option_data: [],
      use_data: {},
      lineInfo: [
        {
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
      ],
      simInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : [],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      customerInfo: {},
      loading_state: false,
      modelJanCode: '',
      iccid: '',
      simType: '',
      simKind: '',
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
      isSp: false,
      isMismatch: false,
      changeSimNameHistory: false,
      infoCancellation: {
        operation_type1: true,
        operation_type2: true,
        msg: '',
        status: 0,
      },
      contractStatus: '',
      mailAddress: '',
      emailModal: false,
      emailModal_link: '',
      is_enable_email: false, //email登録
      changeStatus_sim: false, //変更フラグ SIM変更
      changeStatus_option: false, //変更フラグ オプション変更
      changeModal: false,
      changeTypeModal: false,
      optionModal: false,
      disabledModal: false, //解約中、変更中用モーダル
    }
  }

  async componentDidMount() {
    this.goTop()
    if (!window.customerId) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      document.title = this.state.lineInfo[0].lineNo
      this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
      this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      this.getChangeStatus()
    }
    var _w = $(window).width()
    this.setState({ isSp: _w <= 600 })

    var self = this
    $(window).on('load resize', function () {
      var w = $(window).width()
      self.setState({ isSp: w <= 600 })
    })

    $('.t-modal_overlay').click(function () {
      console.log('test')
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
    })
  }
  componentWillUnmount() {
    if (st) clearTimeout(st)
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      // api AMM00008 - sim
      case Const.CONNECT_TYPE_SIM_DATA:
        params = {
          lineKeyObject: this.state.lineInfo[0].lineKeyObject,
          lineDiv: this.state.lineInfo[0].lineDiv,
          lineNo: this.state.lineInfo[0].lineNo,
          tokenFlg: '1',
        }
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
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            customerInfoGetFlg: '1',
            tokenFlg: '1',
            simGetFlg: '',
            sessionNoUseFlg: 1,
            customerId: window.customerId,
            lineKeyObject: lineKeyObject || '',
          }
          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(dispatchPostConnections(type, params))
        }
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
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        if (data.data && data.data.customerId) {
          this.setState({ customer_id: data.data.customerId })
          window.customerId = data.data.customerId
          document.title = this.state.lineInfo[0].lineNo
          this.getChangeStatus()
          this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
          this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
          this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
        } else {
          this.props.history.push('/error?e=1')
        }
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        console.log(data.data.modelJanCode)
        this.setState({
          api_data: data.data,
          option_data: data.data.optionArray,
          modelJanCode: data.data.modelJanCode,
        })
        // this.setState({ Use30day_data : data.data[0].dataUse30day});

        let simType = ''
        if (this.state.lineInfo[0].lineDiv === '1' && data.data.type === 'D') {
          simType = '01'
        } else if (
          this.state.lineInfo[0].lineDiv === '1' &&
          data.data.type === 'K'
        ) {
          simType = '03'
        } else if (
          this.state.lineInfo[0].lineDiv === '2' &&
          data.data.type === 'D'
        ) {
          simType = '02'
        }

        let simKind = ''
        switch (data.data.simType) {
          case '1':
            simKind = '04'
            break
          case '2':
            simKind = '02'
            break
          case '3':
            simKind = '01'
            break
          case '4':
            simKind = '04'
            break
          default:
            break
        }
        this.setState({ simType, simKind })

        this.setState({ use_data: data.data.dataUseArray })
        this.setState({ token: data.data.token })
        this.setState({ isMismatch: data.data.mismatchFlag == 1 })
        this.switchSimNameStatus(data)
        this.checkCancellation(
          data.data.removeDate,
          data.data.cancelDate,
          data.data.soundAgreement,
          data.data.SimCancelRequestDate
        )
      } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
        // 契約ステータス(contractStatus)
        let contract = data.data.contractList.filter(
          (item) => item.customerId == window.customerId
        )[0]
        this.setState({
          contractStatus: contract.contractStatus,
        })
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        const { customerInfo } = data.data
        this.setState({ customerInfo })

        const { mailAddress, token } = data.data
        this.setState({ mailAddress })
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
        this.props.history.push('/error?e=1')
      }
    }
  }

  // SIM名変更の履歴/時間を見て表示切替を実施
  switchSimNameStatus(data) {
    let ICCID = data.data.ICCID
    let histories = localStorage.getItem('changeSimNameHistory')
    if (histories) {
      histories = JSON.parse(histories)
      let history = histories.filter((item) => {
        return item.ICCID == ICCID
      })
      if (history.length) {
        let target = history[history.length - 1]
        let time = target.time
        time = parseInt(time)
        let timeStamp = Math.round(new Date().getTime() / 1000)
        if (timeStamp - 300 < time) {
          let diff = time + 300 - timeStamp
          this.setState({ changeSimNameHistory: true })
          // 差分時間経過後に再取得（最大5分）
          st = setTimeout(
            function () {
              // localStorage更新
              this.updateHistory(ICCID)
              this.setState({ changeSimNameHistory: false })
              this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
            }.bind(this),
            1000 * diff
          )
        } else {
          // localStorage更新
          this.updateHistory(ICCID)
        }
      }
    }
  }
  // localStorage更新
  updateHistory(ICCID) {
    let histories = localStorage.getItem('changeSimNameHistory')
    if (histories) {
      histories = JSON.parse(histories)
      let newHistories = histories.filter((item) => {
        return item.ICCID != ICCID
      })
      if (newHistories && newHistories.length) {
        localStorage.setItem(
          'changeSimNameHistory',
          JSON.stringify(newHistories)
        )
      } else {
        localStorage.removeItem('changeSimNameHistory')
      }
    } else {
      localStorage.removeItem('changeSimNameHistory')
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

  dataFixingHandler(type, index) {
    if (
      this.state.api_data[type] !== undefined &&
      this.state.api_data[type] !== null
    ) {
      var TempReturn = ' '
      switch (type) {
        // case "lineNo":
        //   TempReturn = this.state.api_data.lineNo;
        //   break;
        case 'nickName':
          TempReturn = this.state.api_data.nickName
          break
        case 'dataUse30day':
          TempReturn = this.state.api_data.dataUse30day.highSpeedGB + 'GB'
          break
        case 'dataUseArray':
          if (index === 0)
            TempReturn = this.state.api_data.dataUseArray.traffic1dayGB + 'GB'
          if (index === 1)
            TempReturn = this.state.api_data.dataUseArray.traffic2dayGB + 'GB'
          if (index === 2)
            TempReturn = this.state.api_data.dataUseArray.traffic3dayGB + 'GB'
          break
        case 'highSpeedDataStatus':
          TempReturn = parseInt(this.state.api_data.highSpeedDataStatus)
          break
        case 'startDate':
          if (
            !this.state.api_data.startDate ||
            this.state.api_data.startDate == '1900/01/01'
          ) {
            TempReturn = '-'
          } else {
            TempReturn = this.state.api_data.startDate
          }
          break
        case 'ICCID':
          TempReturn = this.state.api_data.ICCID
          break
        case 'SIM':
          TempReturn = this.state.api_data.SIM
          break
        case 'activateSimStatus':
          TempReturn = this.state.api_data.activateSimStatus
          break
        case 'optionName':
          TempReturn = this.state.option_data[index].optionName
          break
        case 'status':
          TempReturn = this.state.option_data[index].status
          break
        case 'mnpStatus':
          TempReturn = this.state.api_data.mnpStatus
          break
        case 'mnpNumber':
          TempReturn = this.state.api_data.mnpNumber
          break
        case 'mnpExpiration':
          TempReturn = this.state.api_data.mnpExpiration
          break
        case 'terminalModel':
          TempReturn = this.state.api_data.terminalModel
          break
        case 'terminalColor':
          TempReturn = this.state.api_data.terminalColor
          break
        case 'terminalMaker':
          TempReturn = this.state.api_data.terminalMaker
          break
        case 'IMEI':
          TempReturn = this.state.api_data.IMEI
          break
        case 'soundAgreement':
          TempReturn = this.state.api_data.soundAgreement
          break
        case 'removeDate': //解約日
          TempReturn = this.state.api_data.removeDate
          break
        case 'cancelDate': //IIJ解約日
          TempReturn = this.state.api_data.cancelDate
          break
        case 'simType': //回線種別
          TempReturn = this.state.api_data.simType
          break
        case 'ContractCancelRequestDate':
          TempReturn = this.state.api_data.ContractCancelRequestDate
          break
        case 'SimCancelRequestDate':
          TempReturn = this.state.api_data.SimCancelRequestDate
          break
        case 'stopFlg':
          TempReturn = this.state.api_data.stopFlg
          break
        case 'activateDate':
          TempReturn = this.state.api_data.activateDate
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    }
  }

  async goNextDisplay(e, url, params) {
    e.preventDefault()

    if (url === '/mypage/sim/change/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/sim/user/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.userName = this.state.api_data.nickName
      params.ICCID = this.state.api_data.ICCID
      params.token = this.state.token
      params.mailAddress =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.mailAddress
          : ''
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/sim/reissue/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      params.iccid = this.state.api_data.ICCID
      params.simType = this.state.simType
      params.simKind = this.state.simKind
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/sim/options/') {
      console.log(this.state.lineInfo[0])
      const applyNumber = await getApplyNumber()
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      params.applyNumber = applyNumber
      params.modelJanCode = this.state.modelJanCode
      //params.iccid = this.state.iccid
      //加入済オプションのみ
      //const option_data = this.state.option_data.filter((u) => u.status === '1')
      //params.option_data = option_data
      params.simType = this.state.simType
      params.simKind = this.state.simKind
      params.customerInfo = this.state.customerInfo
      params.simInfo = this.state.simInfo
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/speed/change/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/call/history/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/used/') {
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/call/usage/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/mnp/') {
      params.date = this.state.api_data.startDate
      params.mailAddress =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.mailAddress
          : ''
      params.mnpMovingInFlag = this.state.api_data.mnpMovingInFlag
      params.stopFlg = this.state.api_data.stopFlg
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/option/voip/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/user/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/user/cancellation/procedure/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }

    if (url === '/mypage/mail') {
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
  OutLink(e) {
    e.preventDefault()
    if (localStorage.getItem(Const.LINEDIV) === '1') {
      window.open(Const.APN_IIJ_URL, '_blank')
    } else {
      window.open(Const.APN_NCOM_URL, '_blank')
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

  // RETURN OPTION SERVICES
  returnOptionServices() {
    // 留守番電話・割り込み電話着信は単体表示
    // 追加音声シェア料金以降、オプションサービス項目でまとめて表示
    let optionServices = []
    let services = this.state.option_data.map((Optiondata, key) => {
      if (Optiondata.optionId < '0702000006') {
        return (
          <tr>
            <th>{Optiondata.optionName}</th>
            <td>
              {Optiondata.status === '1' ? (
                <div className="m-flex-between">
                  <span className="a-primary">契約中</span>
                </div>
              ) : (
                <div className="m-flex-between">
                  <span className="a-disabled">未契約</span>
                </div>
              )}
            </td>
          </tr>
        )
      } else {
        if (Optiondata.status == 1) optionServices.push(Optiondata)
      }
    })
    services.push(
      <tr>
        <th>オプションサービス</th>
        <td>
          <div
            className="m-flex-between sp-block"
            style={{ textAlign: 'left', position: 'relative' }}
          >
            {optionServices.length ? (
              <div>
                <ul
                  style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.5 }}
                >
                  {optionServices.map((item) => {
                    if (item.optionId == '0702010013') {
                      return (
                        <li style={{ display: 'table' }}>
                          <div
                            style={{
                              display: 'table-cell',
                              paddingRight: '1.2rem',
                            }}
                          >
                            {item.optionName}
                          </div>
                          <div style={{ display: 'table-cell' }}>
                            <a
                              className="a-btn-link a-btn-link-sm"
                              style={{ minWidth: '84px' }}
                              href=""
                              onClick={(e) =>
                                this.goNextDisplay(e, '/mypage/option/voip/', {
                                  optionConfig: item.optionConfig,
                                })
                              }
                            >
                              設定情報
                            </a>
                          </div>
                        </li>
                      )
                    } else {
                      var block_serial = null
                      var foundSerial = item.optionConfig.find((key) => {
                        return key.name.match(/serial_no/)
                      })
                      if (foundSerial) {
                        block_serial = (
                          <span className="a-fs-sm a-weak a-sp-block a-mb-sp-10">
                            （{foundSerial.info}）
                          </span>
                        )
                      }

                      return (
                        <li>
                          {item.optionName}
                          {block_serial}
                        </li>
                      )
                    }
                  })}
                </ul>
              </div>
            ) : (
              <span className="a-disabled">未契約</span>
            )}
            {this.state.simType.length > 0 && (
              <div className="m-btn">
                <button
                  className={
                    'a-btn-change ' +
                    (this.state.changeStatus_option ||
                    this.isAddFlag() ||
                    this.isCancelFlag()
                      ? 'a-disabled'
                      : '')
                  }
                  onClick={(e) => {
                    if (this.state.changeStatus_option) {
                      this.setState({ optionModal: true })
                    } else if (this.isAddFlag() || this.isCancelFlag()) {
                      this.setState({
                        disabledModal: true,
                      })
                    } else {
                      if (this.state.is_enable_email) {
                        this.goNextDisplay(
                          e,
                          '/mypage/sim/options/',
                          this.state.lineInfo[0]
                        )
                      } else {
                        this.setState({ emailModal: true })
                        this.setState({
                          emailModal_link: '/mypage/sim/options/',
                        })
                        e.preventDefault()
                      }
                    }
                  }}
                >
                  変更する
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    )
    return services
  }

  //解約チェック
  // status 0 契約中（デフォルト）  1 解約済み  2 解約済み(MNP解約手続き中の回線)  3 解約手続き中  4 解約手続き中(解約当月の場合)
  checkCancellation(
    removeDate = '',
    cancelDate = '',
    soundAgreement,
    cancelRequestDate = ''
  ) {
    const today = moment()

    if (removeDate != '') {
      if (today.isSame(removeDate, 'month')) {
        //解約済み MNPポートアウト（月中解約済）	removeDateが当月でcancelDateが月末でない
        if (
          cancelDate != '' &&
          !moment().endOf('month').isSame(moment(cancelDate), 'day')
        ) {
          this.setState({
            infoCancellation: {
              operation_type1: false,
              operation_type2: false,
              msg: '解約済み ',
              status: 5,
            },
          })
          return false
        }

        //解約予約済(解約当月の場合)	removeDateが当月で空でない
        this.setState({
          infoCancellation: {
            operation_type1: true,
            operation_type2: false,
            msg: '解約申込済',
            status: 4,
          },
        })
      } else {
        //解約済み removeDateが当月でなくて空でない

        this.setState({
          infoCancellation: {
            operation_type1: false,
            operation_type2: false,
            msg: '解約済み',
            status: 1,
          },
        })
        return false
      }
    } else if (
      cancelDate != '' &&
      (soundAgreement == '1' || soundAgreement == '4')
    ) {
      //解約済み(MNP解約手続き中の回線)	simTypeが1 or 4で、removeDateが空、cancelDateがあり
      this.setState({
        infoCancellation: {
          operation_type1: false,
          operation_type2: false,
          msg: '解約手続き中',
          status: 2,
        },
      })
      return false
    } else if (cancelRequestDate != '') {
      //解約手続き中	cancelRequestDateが空でなくてremoveDateが空
      this.setState({
        infoCancellation: {
          operation_type1: true,
          operation_type2: false,
          msg: '解約手続き中',
          status: 3,
        },
      })
      return false
    } else {
      // 契約中
      this.setState({
        infoCancellation: {
          operation_type1: true,
          operation_type2: true,
          msg: '',
          status: 0,
        },
      })
    }
  }

  //回線の解約が可能かどうか
  checkCancellationSIM() {
    let { contractStatus } = this.state
    let flag = this.dataFixingHandler('stopFlg', 0) ? true : false
    let type = 0

    //・未収がある場合
    if (
      this.props.paymentError &&
      this.props.paymentError.errorCode !== '0000' &&
      this.props.paymentError.unchangeableCreditCard == '0'
    ) {
      return {
        flag: false,
        type: 3,
      }
    }

    //解約可能かどうかチェック
    //・いずれかの回線が強制停止中
    if (
      this.dataFixingHandler('stopFlg', 0) &&
      this.dataFixingHandler('stopFlg', 0) == '1'
    ) {
      return {
        flag: false,
        type: 1,
      }
    }
    //・解約申請中
    if (
      (this.dataFixingHandler('ContractCancelRequestDate', 0) &&
        this.dataFixingHandler('ContractCancelRequestDate', 0) !== '') ||
      (this.dataFixingHandler('SimCancelRequestDate', 0) &&
        this.dataFixingHandler('SimCancelRequestDate', 0) !== '')
    ) {
      return {
        flag: false,
        type: 2,
      }
    }

    let cancelContract = localStorage.getItem('cancelContract')
    if (cancelContract == '1') {
      return {
        flag: false,
        type: 7,
      }
    }

    //・シェア追加処理中の場合
    if (contractStatus !== 'sent') {
      return {
        flag: false,
        type: 4,
      }
    }

    // mnpStatusが0以外の場合は、発行中と判定する
    // CRSimInfoMnpStatus {//0：新規発行可能、1：発行申請受付済み,発行待ち、2：有効なMNP予約番号あり、3：新規発行抑止期間
    //  let ready = 0
    //  let publishing = 1
    //  let exists = 2
    //  let suspended = 3
    // }
    // 1,2,3は、予約番号が発行済か、申請中か、期限切れ後の抑止期間
    // ncomの場合は（空文字）を返す。
    if (
      this.dataFixingHandler('mnpStatus', 0) &&
      this.dataFixingHandler('mnpStatus', 0) != '' &&
      this.dataFixingHandler('mnpStatus', 0) != '0'
    ) {
      return {
        flag: false,
        type: 5,
      }
    }

    //大口法人不可
    let l_Corp = localStorage.getItem('l_Corp')
    // 1:大口法人 0 それ以外
    if (l_Corp && l_Corp == '1') {
      return { flag: false, type: 6 }
    }

    //解約判定追加
    if (!this.state.infoCancellation.operation_type2) {
      return { flag: false, type: 7 }
    }

    return {
      flag: flag,
      type: type,
    }
  }

  notCancellationMessage(type) {
    let checkCancellationSIM = this.checkCancellationSIM()
    let text =
      type == 1
        ? '解約のお手続きを行うことができません。'
        : 'MNP予約番号を申請できません。'
    let msg
    switch (checkCancellationSIM.type) {
      case 6:
        msg = `お客さまのご契約内容では、マイページからの解約を承ることができません。<br />
        お手数ではございますが、お客さまセンターまでお問い合わせください。`
        break
      case 5:
        msg = 'MNP予約番号取得中のため、' + text
        break
      case 4:
        msg = 'その他のお手続き中のため、' + text
        break
      case 3:
        msg = 'お支払いエラーのため、' + text
        break
      case 7:
      case 2:
        msg = '解約手続き中のため、' + text
        break
      case 1:
        msg = '強制停止中のため、' + text
        break
      default:
        msg = '回線解約を受付できません'
        break
    }
    return msg
  }

  //SIM詳細のMNP発行を当日行えないように
  //期間の変更可能に endDateの日付足す
  isTodayMnp() {
    let today = moment()
    let activateDate = this.dataFixingHandler('activateDate')
    if (activateDate && activateDate != '') {
      let startDate = moment(activateDate).startOf('day')
      let endDate = moment(activateDate).endOf('day').add(0, 'day')
      /*
            console.log(
        `今日は${today.format('YYYY/MM/DD HH:mm:ss')} 開始日 ${startDate.format(
          'YYYY/MM/DD HH:mm:ss'
        )} 〜 終了日 ${endDate.format(
          'YYYY/MM/DD HH:mm:ss'
        )}  期間内 ${today.isBetween(startDate, endDate, null, '[]')} `
      )
      */
      if (today.isBetween(startDate, endDate, null, '[]')) {
        return true
      }
    }
    return false
  }

  async getChangeStatus() {
    const { result: result_sim } = await getApplyEntryInfo(
      window.customerId,
      '801'
    )
    const { result: result_option } = await getApplyEntryInfo(
      window.customerId,
      '306,901'
    )

    if (result_sim === 'OK') {
      this.setState({
        changeStatus_sim: true,
      })
    }
    if (result_option === 'OK') {
      this.setState({
        changeStatus_option: true,
      })
    }
  }

  //シェア回線追加中
  isAddFlag() {
    if (
      this.state.contractStatus !== 'sent' || //シェア追加中
      this.state.customerInfo.cancelRequestDate != ''
    ) {
      return true
    }
    return false //変更OK
  }
  //解約処理中
  isCancelFlag() {
    const cancelContract = localStorage.getItem('cancelContract')
    if (cancelContract == '1') {
      return true
    }
    return false //変更OK
  }

  render() {
    this.used_data = (
      <div key="tr1">
        <table className="m-simtable-total">
          <colgroup>
            <col className="a-wd-35 a-wd-pc-40" />
          </colgroup>
          <thead>
            <tr>
              <th>過去30日分の合計</th>
              <th>{this.dataFixingHandler('dataUse30day', 0)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>昨日</th>
              <td>{this.dataFixingHandler('dataUseArray', 0)}</td>
            </tr>
            <tr>
              <th>2日前</th>
              <td>{this.dataFixingHandler('dataUseArray', 1)}</td>
            </tr>
            <tr>
              <th>3日前</th>
              <td>{this.dataFixingHandler('dataUseArray', 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )

    if (this.state.customerInfo.length > 0) {
      this.customer_info_block = (
        <div>
          <div className="m-simheader m-flex-between a-mb-5">
            <h3 className="a-h4 a-fs-pc-20">利用者情報</h3>
            <p className="m-btn">
              <a
                className="a-btn-change"
                href=""
                onClick={(e) => this.goNextDisplay(e, '/mypage/user/')}
              >
                変更する
              </a>
            </p>
          </div>
          <table className="m-simtable">
            <colgroup>
              <col className="a-wd-35 a-wd-pc-20" />
            </colgroup>
            <tbody>
              <tr>
                <th>利用者名</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.state.customerInfo[0].userName}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>利用者名（カナ）</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.state.customerInfo[0].userNameKana}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>郵便番号</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.state.customerInfo[0].postCode}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>住所</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.state.customerInfo[0].address}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      this.customer_info_block = ''
    }

    var apnLink = {
      fontWeight: 'bold',
    }

    if (this.dataFixingHandler('mnpStatus') === '0') {
      let checkCancellationSIM = this.checkCancellationSIM()
      let isTodayMnp = this.isTodayMnp()

      let disabledMnp = false

      if (!checkCancellationSIM.flag) {
        switch (checkCancellationSIM.type) {
          case 4:
          case 3:
          case 2:
          case 1:
            disabledMnp = true
            break
          case 6:
          case 5:
          default:
            break
        }
      }

      this.mnp_data_block = (
        <table className="m-simtable">
          <tbody>
            <tr>
              <th>MNP予約番号発行申込</th>
              <td>
                <div
                  className={!this.state.isSp ? 'm-flex-between' : ''}
                  style={{ textAlign: 'center' }}
                >
                  <span className="a-disabled">
                    {!this.state.infoCancellation.operation_type2
                      ? this.state.infoCancellation.msg
                      : disabledMnp || isTodayMnp
                      ? 'MNP予約番号発行不可'
                      : 'MNP予約番号発行可能'}
                  </span>
                  <span className="m-btn">
                    <a
                      className={
                        'a-btn-change ' +
                        (!this.state.infoCancellation.operation_type2 ||
                        disabledMnp ||
                        isTodayMnp
                          ? 'a-disabled'
                          : '')
                      }
                      href=""
                      onClick={(e) => {
                        if (
                          !this.state.infoCancellation.operation_type2 ||
                          disabledMnp ||
                          isTodayMnp
                        ) {
                          e.preventDefault()
                          let msg = this.notCancellationMessage(2)
                          if (isTodayMnp) {
                            msg = 'SIM契約当日のMNP予約番号発行申込は行えません'
                          }

                          this.goTop()
                          $('.m-customer_content').html(msg)

                          $('.t-modal_content .m-customer_ttl').text(
                            'MNP予約番号発行申込は行えません'
                          )

                          $('.t-modal').addClass('is-active')
                          $('.t-modal_content').addClass('is-active')

                          return false
                        } else {
                          this.goNextDisplay(
                            e,
                            '/mypage/mnp/',
                            this.state.lineInfo[0]
                          )
                        }
                      }}
                    >
                      MNP予約番号発行申込
                    </a>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )
    } else if (
      this.dataFixingHandler('mnpStatus') === '' ||
      this.dataFixingHandler('mnpStatus') === undefined ||
      this.dataFixingHandler('mnpStatus') === null
    ) {
      this.mnp_data_block = ''
    } else {
      this.mnp_data_block = (
        <table className="m-simtable">
          <colgroup>
            <col className="a-wd-35 a-wd-pc-20" />
          </colgroup>
          <tbody>
            <tr>
              <th>MNP予約番号発行申込</th>
              <td>
                <div className="m-flex-between">
                  <span className="a-primary">申し込み中</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>MNP予約番号</th>
              <td>
                <div className="m-flex-between">
                  <span>{this.dataFixingHandler('mnpNumber', 0)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>MNP有効期限</th>
              <td>
                <div className="m-flex-between">
                  <span>{this.dataFixingHandler('mnpExpiration', 0)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )
    }
    if (this.state.isMismatch) {
      this.mnp_data_block = ''
    }

    if (this.state.api_data.terminalModel) {
      this.terminal_data = (
        <div>
          <div className="m-simheader m-flex-between a-mb-5">
            <h3 className="a-h4 a-fs-pc-20">端末情報</h3>
          </div>
          <table className="m-simtable">
            <colgroup>
              <col className="a-wd-35 a-wd-pc-20" />
            </colgroup>
            <tbody>
              <tr>
                <th>メーカー</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.dataFixingHandler('terminalMaker', 0)}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>機種名</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.dataFixingHandler('terminalModel', 0)}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>色</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.dataFixingHandler('terminalColor', 0)}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th>IMEI</th>
                <td>
                  <div className="m-flex-between">
                    <span>{this.dataFixingHandler('IMEI', 0)}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      this.terminal_data = ''
    }

    let checkCancellationSIM = this.checkCancellationSIM()

    this.cancel_data_block = (
      <table className="m-simtable">
        <tbody>
          <tr>
            <th>回線の解約</th>
            <td>
              <div
                className={!this.state.isSp ? 'm-flex-between' : ''}
                style={{ textAlign: 'center' }}
              >
                <span className="a-disabled">
                  {checkCancellationSIM.flag
                    ? '回線解約可能'
                    : '回線解約を受付できません'}
                </span>
                <span className="m-btn">
                  <a
                    className={
                      'a-btn-change ' +
                      (checkCancellationSIM.flag ? '' : 'a-disabled')
                    }
                    href=""
                    onClick={(e) => {
                      if (checkCancellationSIM.flag) {
                        this.goNextDisplay(
                          e,
                          '/mypage/user/cancellation/procedure/',
                          {
                            type: '02',
                            lineNo: this.state.lineInfo[0].lineNo,
                          }
                        )
                      } else {
                        e.preventDefault()
                        $('.t-modal_content .m-customer_ttl').text(
                          '回線の解約申込は行えません'
                        )
                        this.goTop()
                        $('.m-customer_content').html(
                          this.notCancellationMessage(1)
                        )
                        $('.t-modal').addClass('is-active')
                        $('.t-modal_content').addClass('is-active')
                        return false
                      }
                    }}
                  >
                    回線解約申込
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    )

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
                      {this.state.lineInfo[0].lineNo}
                    </li>
                  </ol>
                  <h1 className="a-h1">{this.state.lineInfo[0].lineNo}</h1>
                  <div className="t-inner_wide">
                    <div className="m-flex-between">
                      {(() => {
                        if (this.state.changeSimNameHistory) {
                          return (
                            <h2
                              className="a-h2-line"
                              style={{ color: '#b50080', fontSize: '1.8rem' }}
                            >
                              {this.dataFixingHandler('nickName', 0)}
                              <br />
                              (名称変更中)
                            </h2>
                          )
                        } else {
                          return (
                            <h2 className="a-h2-line">
                              {this.dataFixingHandler('nickName', 0)}
                            </h2>
                          )
                        }
                      })()}
                      <p
                        className="m-btn"
                        style={{
                          display: this.state.isMismatch ? 'none' : 'block',
                        }}
                      >
                        <a
                          className="a-btn-change"
                          href=""
                          onClick={(e) =>
                            this.goNextDisplay(
                              e,
                              '/mypage/sim/user/',
                              this.state.lineInfo[0]
                            )
                          }
                        >
                          SIM名称を変更する
                        </a>
                      </p>
                    </div>

                    {this.state.isMismatch ? (
                      <div
                        className="m-box-important"
                        style={{ padding: '1.5rem' }}
                      >
                        <p>
                          SIMの情報が正常に表示されないのでMNP転出等の機能がご利用になれません
                          <br />
                          お客さまセンターへお問い合わせください
                        </p>
                        <p>ICCID: {this.dataFixingHandler('ICCID', 0)}</p>
                        <p>コールセンター: 0120-025-260</p>
                        <p>営業時間: 10:30-19:30（年中無休）</p>
                      </div>
                    ) : null}

                    <div className="m-simdata">
                      <div className="m-simdata_header m-flex-between a-mb-10">
                        <h3 className="a-h3-ic">
                          <span className="a-ic-graph" role="img" />
                          データ使用量
                        </h3>
                        <p className="m-btn">
                          <a
                            className="a-btn-link a-btn-link-sm"
                            href=""
                            onClick={(e) =>
                              this.goNextDisplay(
                                e,
                                '/mypage/used/',
                                this.state.lineInfo[0]
                              )
                            }
                          >
                            詳細
                          </a>
                        </p>
                      </div>
                      <div className="m-simdata_flex">
                        <div className="m-simdata_flex_item">
                          <div className="m-simdata_flex_inner">
                            {this.used_data}
                          </div>
                        </div>
                        <div className="m-simdata_flex_item">
                          {/* check sound agreement */}
                          {this.dataFixingHandler('soundAgreement', 0) ===
                          '1' ? (
                            // under contract
                            <div className="m-simdata_voice">
                              <h3 className="a-h4">
                                音声通話：
                                {this.state.infoCancellation.status != 0 ? (
                                  <span className="a-fs-xl a-fs-pc-20 a-disabled">
                                    {this.state.infoCancellation.msg}
                                  </span>
                                ) : (
                                  <span className="a-fs-xl a-fs-pc-20 a-primary">
                                    契約中
                                  </span>
                                )}
                              </h3>
                              <ul className="m-simdata_btn">
                                <li className="m-simdata_btn_item">
                                  <a
                                    className="a-btn a-btn-sm a-btn-resp"
                                    href=""
                                    onClick={(e) =>
                                      this.goNextDisplay(
                                        e,
                                        '/mypage/call/usage/',
                                        this.state.lineInfo[0]
                                      )
                                    }
                                  >
                                    通話料明細
                                  </a>
                                </li>
                                <li className="m-simdata_btn_item">
                                  <a
                                    className="a-btn a-btn-sm a-btn-resp"
                                    href=""
                                    onClick={(e) =>
                                      this.goNextDisplay(
                                        e,
                                        '/mypage/call/history/',
                                        this.state.lineInfo[0]
                                      )
                                    }
                                  >
                                    通話履歴
                                  </a>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            // contractless
                            <div className="m-simdata_voice">
                              <h3 className="a-h4">
                                音声通話：
                                <span className="a-fs-xl a-fs-pc-20 a-disabled">
                                  {this.state.infoCancellation.status != 0
                                    ? this.state.infoCancellation.msg
                                    : '契約なし'}
                                </span>
                              </h3>
                              <ul className="m-simdata_btn">
                                <li className="m-simdata_btn_item">
                                  <span className="a-btn a-btn-sm a-btn-resp is-disabled">
                                    通話料明細
                                  </span>
                                </li>
                                <li className="m-simdata_btn_item">
                                  <span className="a-btn a-btn-sm a-btn-resp is-disabled">
                                    通話履歴
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div key="tr1">
                      <table className="m-simtable">
                        <colgroup>
                          <col className="a-wd-35 a-wd-pc-20" />
                        </colgroup>
                        <tbody>
                          <tr>
                            <th>高速データ通信</th>
                            <td>
                              <div className="m-flex-between">
                                <span className="a-primary">
                                  {!this.state.infoCancellation
                                    .operation_type1 ? (
                                    <div>
                                      <span className="a-disabled">
                                        {this.state.infoCancellation.msg}
                                      </span>
                                    </div>
                                  ) : this.dataFixingHandler(
                                      'highSpeedDataStatus',
                                      0
                                    ) === 1 ? (
                                    <div>
                                      <span className="a-primary">
                                        高速通信中
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="a-disabled">
                                        低速通信中
                                      </span>
                                    </div>
                                  )}
                                </span>
                                <span className="m-btn">
                                  <a
                                    className={
                                      'a-btn-change ' +
                                      (!this.state.infoCancellation
                                        .operation_type1 && 'a-disabled')
                                    }
                                    href=""
                                    onClick={(e) => {
                                      if (
                                        this.state.infoCancellation
                                          .operation_type1
                                      ) {
                                        this.goNextDisplay(
                                          e,
                                          '/mypage/speed/change/',
                                          this.state.lineInfo[0]
                                        )
                                      } else {
                                        e.preventDefault()
                                        return false
                                      }
                                    }}
                                  >
                                    変更する
                                  </a>
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>利用開始日</th>
                            <td>
                              <div className="m-flex-between">
                                <span>
                                  {this.dataFixingHandler('startDate', 0)}
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>ICCID</th>
                            <td>
                              <div className="m-flex-between">
                                <span>
                                  {this.dataFixingHandler('ICCID', 0)}
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>SIM</th>
                            <td style={{ padding: 0 }}>
                              <div
                                className="m-flex-between sp-block"
                                style={{
                                  marginBottom: 0,
                                  padding: '0.85rem 1.2rem 0.85rem 1.5rem',
                                }}
                              >
                                <span>{this.dataFixingHandler('SIM', 0)}</span>
                                <span className="m-btn">
                                  {this.state.api_data.ICCID &&
                                    this.state.simType &&
                                    this.state.simKind && (
                                      <button
                                        className={
                                          'a-btn-change ' +
                                          (this.state.changeStatus_sim ||
                                          (this.state.api_data.sizeChangeFlag ==
                                            1 &&
                                            !this.state.api_data
                                              .deliveryNumber) ||
                                          (this.state.api_data.simType !==
                                            '1' &&
                                            this.state.api_data.simType !==
                                              '4') ||
                                          this.isAddFlag() ||
                                          this.isCancelFlag()
                                            ? 'a-disabled'
                                            : '')
                                        }
                                        onClick={(e) => {
                                          if (
                                            this.state.api_data
                                              .sizeChangeFlag == 1 &&
                                            !this.state.api_data.deliveryNumber
                                          ) {
                                            this.setState({
                                              changeModal: true,
                                            })
                                          } else if (
                                            this.state.api_data.simType !==
                                              '1' &&
                                            this.state.api_data.simType !== '4'
                                          ) {
                                            this.setState({
                                              changeTypeModal: true,
                                            })
                                          } else if (
                                            this.isAddFlag() ||
                                            this.isCancelFlag()
                                          ) {
                                            this.setState({
                                              disabledModal: true,
                                            })
                                          } else {
                                            if (!this.state.is_enable_email) {
                                              this.setState({
                                                emailModal: true,
                                              })
                                              this.setState({
                                                emailModal_link:
                                                  '/mypage/sim/reissue/',
                                              })
                                              e.preventDefault()
                                            } else {
                                              this.goNextDisplay(
                                                e,
                                                '/mypage/sim/reissue/',
                                                this.state.lineInfo[0]
                                              )
                                            }
                                          }
                                        }}
                                      >
                                        SIMカード再発行・サイズ変更
                                      </button>
                                    )}
                                </span>
                              </div>
                              {this.state.api_data.deliveryNumber && (
                                <div
                                  style={{
                                    padding: '0.85rem 1.2rem 0.85rem 1.5rem',
                                    textAlign: 'left',
                                    borderTop: '1px #707070 dashed',
                                  }}
                                >
                                  配送番号：
                                  <span style={{ color: '#B50080' }}>
                                    {this.state.api_data.deliveryNumber}
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>SIMカード有効状態</th>
                            <td>
                              <div className="m-flex-between">
                                <span className="a-primary">
                                  {!this.state.infoCancellation
                                    .operation_type1 ? (
                                    <div>
                                      <span className="a-disabled">
                                        {this.state.infoCancellation.msg}
                                      </span>
                                    </div>
                                  ) : this.dataFixingHandler(
                                      'activateSimStatus',
                                      0
                                    ) === '1' ? (
                                    <div>
                                      <span className="a-primary">利用中</span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="a-disabled">停止中</span>
                                    </div>
                                  )}
                                </span>
                                <span className="m-btn">
                                  <a
                                    className={
                                      'a-btn-change ' +
                                      (!this.state.infoCancellation
                                        .operation_type1 && 'a-disabled')
                                    }
                                    href=""
                                    onClick={(e) => {
                                      if (
                                        this.state.infoCancellation
                                          .operation_type1
                                      ) {
                                        this.goNextDisplay(
                                          e,
                                          '/mypage/sim/change/',
                                          this.state.lineInfo[0]
                                        )
                                      } else {
                                        e.preventDefault()
                                        return false
                                      }
                                    }}
                                  >
                                    変更する
                                  </a>
                                </span>
                              </div>
                            </td>
                          </tr>
                          {this.returnOptionServices()}
                        </tbody>
                      </table>
                    </div>

                    {this.mnp_data_block}

                    {this.cancel_data_block}

                    {this.customer_info_block}

                    {this.terminal_data}
                    <p className="a-ta-right">
                      <a
                        className="a-link-arrow"
                        style={apnLink}
                        href=""
                        onClick={(e) => this.OutLink(e)}
                        target="_blank"
                      >
                        APN設定についてはこちら
                      </a>
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
            <div className="t-modal">
              <div className="t-modal_overlay" />
              <div
                className="t-modal_content"
                style={{
                  top: '50%',
                  left: '50%',
                  position: 'fixed',
                  transform: 'translate(-50%,-50%)',
                }}
              >
                <div className="m-customer">
                  <h2 className="m-customer_ttl a-h3">
                    回線の解約申込は行えません
                  </h2>
                  <p className="m-customer_content"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.changeModal && (
          // sim再発行
          <div className="t-modal is-active">
            <div
              className="t-modal_overlay"
              onClick={() => {
                this.setState({ changeModal: false })
              }}
            />
            <div
              className="t-modal_content is-active"
              style={{
                top: '50%',
                left: '50%',
                position: 'fixed',
                transform: 'translate(-50%,-50%)',
              }}
            >
              <div className="m-customer">
                <h2 className="m-customer_ttl a-h3">申込中エラー</h2>
                <p className="m-customer_content">
                  SIMカード再発行・サイズ変更のお手続き中のため、申し込みできません。
                </p>
              </div>
            </div>
          </div>
        )}
        {this.state.changeTypeModal && (
          // sim再発行
          <div className="t-modal is-active">
            <div
              className="t-modal_overlay"
              onClick={() => {
                this.setState({ changeTypeModal: false })
              }}
            />
            <div
              className="t-modal_content is-active"
              style={{
                top: '50%',
                left: '50%',
                position: 'fixed',
                transform: 'translate(-50%,-50%)',
              }}
            >
              <div className="m-customer">
                <h2 className="m-customer_ttl a-h3">申込不可</h2>
                <p className="m-customer_content">
                  SIM再発行・サイズ変更は、音声のみ申し込み可能です。
                </p>
              </div>
            </div>
          </div>
        )}
        {this.state.optionModal && (
          // オプションサービス
          <div className="t-modal is-active">
            <div
              className="t-modal_overlay"
              onClick={() => {
                this.setState({ optionModal: false })
              }}
            />
            <div
              className="t-modal_content is-active"
              style={{
                top: '50%',
                left: '50%',
                position: 'fixed',
                transform: 'translate(-50%,-50%)',
              }}
            >
              <div className="m-customer">
                <h2 className="m-customer_ttl a-h3">申込中エラー</h2>
                <p className="m-customer_content">
                  オプションサービスの変更手続き中のため、申し込みできません。
                </p>
              </div>
            </div>
          </div>
        )}

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
                    if (this.state.emailModal_link === '/mypage/sim/reissue/') {
                      this.goNextDisplay(
                        e,
                        '/mypage/sim/reissue/',
                        this.state.lineInfo[0]
                      )
                    } else if (
                      this.state.emailModal_link === '/mypage/sim/options/'
                    ) {
                      this.goNextDisplay(
                        e,
                        '/mypage/sim/options/',
                        this.state.lineInfo[0]
                      )
                    }
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
        {this.state.disabledModal && (
          <div className="t-modal is-active">
            <div
              className="t-modal_overlay"
              onClick={() => {
                this.setState({ disabledModal: false })
              }}
            />
            <div
              className="t-modal_content is-active"
              style={{
                top: '50%',
                left: '50%',
                position: 'fixed',
                transform: 'translate(-50%,-50%)',
              }}
            >
              <div className="m-customer">
                <h2 className="m-customer_ttl a-h3">
                  <span style={{ display: 'block' }}>
                    {this.isAddFlag() &&
                      'その他のお手続き中のため、申し込みできません'}
                  </span>
                  <span style={{ display: 'block' }}>
                    {this.isCancelFlag() &&
                      '解約処理中のため、申し込みできません'}
                  </span>
                </h2>
              </div>
            </div>
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
    paymentError: postReducer.paymentError,
  }
}

export default connect(mapStateToProps)(Sim)
