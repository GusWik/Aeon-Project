import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser'

// css
import '../assets/css/common.css'
import '../assets/css/custom.css'

// images
import logoImage from '../assets/images/logo.png'
import ic_app_denwa from '../assets/images/ic_app_denwa.png?v=201909041100'
import ic_app_switch from '../assets/images/ic_app_switch.png'
import ic_option_houdai from '../assets/images/ic_option_houdai.png'
import ic_option_child from '../assets/images/ic_option_child.png'
import ic_option_ifilter from '../assets/images/ic_option_ifilter.png'
import shokaiCpImg from '../assets/images/syoukaitoku_1000×350.jpg'
import limitedNetsuperImg from '../assets/images/netsuper_20221125.jpg'
import limitedQuestionnaireImg from '../assets/images/20220817_ASH_ad_1000_350.jpg'
import limitedNetsuperImg_2 from '../assets/images/netsuper_20220926.jpg'
import limitedCampaignImgDay1 from '../assets/images/221125_ac_yokoku_01_1000x350.jpg'
import limitedCampaignImgDay2 from '../assets/images/221125_ac_start_01_1000x350.jpg'
import newPlanImgSp from '../assets/images/newPlan_1000x350-601.jpg'
import newPlanImgPc from '../assets/images/newPlan_1000x350.jpg'
import imgEA02AC from '../assets/images/EA02_ac.svg'
import limitedQuestionnairePt2PcImg from '../assets/images/questionnaire_20221031_pc.png'
import limitedQuestionnairePt2SpImg from '../assets/images/questionnaire_20221031_sp.png'

import maintenanceImg_pc from '../assets/images/smartphone_maintenance_pc.jpg'
import maintenanceImg_sp from '../assets/images/smartphone_maintenance_sp.jpg'

import ComponentBase from '../ComponentBase.js'
import * as Chart_default from '../../modules/Chart_const.js'
import * as Const from '../../Const.js'

// IMPORT MODULES
import Dialog from '../../modules/Dialog.js'
import Header from '../../modules/Header.js'

// IMPORT PIE CHARTS
// import PieCharts from '../../modules/PieChart';
import { Doughnut } from 'react-chartjs-2'

import Slider from 'react-slick'

import {
  dispatchGetConnections,
  dispatchPostConnections,
  awaitPostMessage,
  setConnectionCB,
} from '../../actions/PostActions.js'

import loadingImage from '../../modules/images/loaderTop.gif'

const Link = {
  fontweight: '500',
}

// setTimeout処理
var st

class Mypage extends ComponentBase {
  constructor(props) {
    super(props)

    this.applyCustomerInfo = this.applyCustomerInfo.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.updateChartData = this.updateChartData.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.setCampaignPopUp = this.setCampaignPopUp.bind(this)
    this.setLocalStorageRemoveLine = this.setLocalStorageRemoveLine.bind(this)

    this.checkcancellationNewFunc = this.checkcancellationNewFunc.bind(this)
    this.closeCheckcancellationModal = this.closeCheckcancellationModal.bind(
      this
    )

    this.state = {
      applyNumber: '',
      popup_state: true,
      data_available: false,
      interval: null,
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      // Set the banner Space
      banner_space: true,
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
      settings: {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        autoplay: true,
        autoplaySpeed: 6000,
      },
      banner_settings: {
        // edited
        infinite: false,
        dots: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      importantNoticeArray: [],
      noticeArray: [],
      bannerArray: [],
      dataPlanSize: {
        GB: '0',
        MB: '0',
      },
      dataFreeSumSize: {
        GB: '0',
        MB: '0',
      },
      dataFreeMonthSize: {
        GB: '0',
        MB: '0',
      },
      dataFreeAddBroughtSize0: {
        GB: '0',
        MB: '0',
      },
      dataFreeAddBroughtSize1: {
        GB: '0',
        MB: '0',
      },
      dataFreeAddBroughtSize2: {
        GB: '0',
        MB: '0',
      },
      dataFreeAddBroughtSize3: {
        GB: '0',
        MB: '0',
      },
      customerID: '',
      mailAddress: '',
      loginMailAddressFlg: 0,
      loginYahooFlg: 0,
      loginGoogleFlg: 0,
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
      changePlanType: '',
      lineInfo: [
        {
          lineDiv: '',
          lineKeyObject: '',
          planName: '',
          removeStatus: '',
        },
      ],
      lineList: [],
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

      // FOR DIALOG ERROR
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
      // FOR DIALOG ERROR
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
          title: '料金プラン変更の手続きについて',
          values: [
            {
              text: (
                <p>
                  解約お手続き中のため、プラン変更はお申し込みいただけません
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-dismiss',
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
          type: Const.DIALOG_ONE,
          title: '料金プラン変更の手続きについて',
          values: [
            {
              text: (
                <p>
                  本日開通いただいたタイプ1回線については、プラン変更のお申し込みを受付できません。
                  <br />
                  恐れ入りますが、明日以降に再度お手続きいただきますようお願いいたします。
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-dismiss',
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
          id: 3,
          type: Const.DIALOG_ONE,
          title: '高速データ通信容量の追加について',
          values: [
            {
              text: (
                <p>
                  開通当日のため、容量を追加できません。
                  <br />
                  恐れ入りますが、明日以降に再度お手続きいただきますようお願いいたします。
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-dismiss',
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

      // FOR CHART DATA
      chartData01: {
        datasets: [
          {
            label: 'dataPlanSize',
            data: [0, 0, 0],
            backgroundColor: Chart_default.row_data.backgroundColor,
            hoverBackgroundColor: Chart_default.row_data.hoverBackgroundColor,
            hoverBorderColor: Chart_default.row_data.hoverBorderColor,
            borderColor: '#FFFFFF',
            borderWidth: 0,
          },
        ],
      },
      chartData02: {
        datasets: [
          {
            label: 'FreeSumSize',
            data: [0, 0, 0],
            backgroundColor: Chart_default.frist_data.backgroundColor,
            hoverBackgroundColor: Chart_default.frist_data.hoverBackgroundColor,
            hoverBorderColor: Chart_default.frist_data.hoverBorderColor,
            borderColor: Chart_default.frist_data.borderColor,
            borderWidth: 2,
          },
        ],
      },
      options01: {
        tooltips: {
          enabled: false,
        },
        animation: {
          animateScale: false,
          duration: 0,
          easing: 'linear',
          onAnimationComplete: function (animation) {
            // console.log("done");
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 70,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 20,
            fontColor: 'red',
            padding: 0,
            boxWidth: 20,
          },
        },
        layout: {
          width: 1000,
          height: 1000,
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
            backgroundColor: '#FFFFFF',
            hoverBorderColor: '#FFFFFF',
          },
        },
      },
      options02: {
        tooltips: {
          enabled: false,
        },
        animation: {
          animateScale: false,
          duration: 0,
          easing: 'linear',
          onAnimationComplete: function (animation) {
            // console.log("done");
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 90,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 20,
            fontColor: 'red',
            padding: 0,
            boxWidth: 20,
          },
        },
        layout: {
          width: 1000,
          height: 1000,
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
            backgroundColor: '#FFFFFF',
            hoverBorderColor: '#FFFFFF',
          },
        },
      },
      pieChart_display: false,
      planId: 0,
      planName: '',
      seniorPlanFlag: 0,
      loading_state: false,
      loading_state_extra: true,
      loading_state_top: true,
      loading_fail: false,
      isRemoveStatus: false,
      changeMailHistory: false,
      isAgreementError: 0,
      agreementErrorType: null,
      isGetCustomerInfoFlg: false,
      isMnpError: false,
      mvnoApplyNumber: '',
      contractStatus: '',
      warehouseStatus: '',
      isType1K: false,
      campaignPopUp: false,
      limitedCampaignPopUp: false,
      limitedQuestionnairePt2PopUp: false,
      limitedQuestionnairePopUp: false,
      limitedNetsuperPopUp: false,
      limitedNetsuperPopUp_2: false,
      shokaiPopUp: false,
      maintenancePopUp: false,
      newPlanPopUp: false,
      cancellationNewPopUp: false,
      detailsBtnText: '詳細',
      isMaintenance: false,
      errorMessages: {},
      isAddressError: false,
      all_line_cancellation: false, //全回線解約
      studentDiscountEnds: false,
      // END OF THE STATE
    }
  }
  // customerInfoに反映
  applyCustomerInfo(type, data, status, token) {
    if (token && type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      this.setState({ token })
    }
    if (status === Const.CONNECT_SUCCESS) {
      var params
      if (data.data && data.data.length > 0) {
        params = data.data[0]
      } else {
        params = data.data
      }
      if (params) {
        if (params.customerInfo && params.customerInfo.userName) {
          this.setState({ customerInfo: params.customerInfo })
          this.props.updateCustomerInfo(params.customerInfo)
        }
      }
    }
  }

  handleConnect(type, kind) {
    var params = {}
    this.setState({ loading_state: true })
    switch (type) {
      case Const.CONNECT_TYPE_REQUEST_ACTIVATE:
        params = {
          lineNumber: this.state.lineNumber,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_APPLY_LINE_LIST:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, true))
        break
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        params = {
          customerId: this.state.customer_id,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, true))
        break
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      // AMM00005 API Run
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          let lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            customerId: this.state.customer_id,
            customerInfoGetFlg: '',
            sessionNoUseFlg: '',
            tokenFlg: '1',
            simGetFlg: '1',
            planChangeFlg: '1',
            lineKeyObject: lineKeyObject || '',
          }
          if (kind === 'extra' || kind === 'customerInfo') {
            params = {
              customerId: this.state.customer_id,
              customerInfoGetFlg: '1',
              sessionNoUseFlg: '1',
              tokenFlg: '1',
              simGetFlg: '',
              lineKeyObject: '',
            }
          }
          if (kind === 'customerInfo') {
            this.setState({ isGetCustomerInfoFlg: true })
          }
          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(
            dispatchPostConnections(type, params, false, '/mypage')
          )
        }
        break
      // AMM00006 API Run
      case Const.CONNECT_TYPE_TOP_DATA:
        params = {
          lineKeyObject: this.state.lineInfo[this.state.lineInfoNum]
            .lineKeyObject,
          lineDiv: this.state.lineInfo[this.state.lineInfoNum].lineDiv,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(
          dispatchPostConnections(type, params, true, '/mypage')
        )
        break
      case Const.CONNECT_TYPE_PLAN:
        params = {
          lineKeyObject: this.state.lineInfo[this.state.lineInfoNum]
            .lineKeyObject,
          lineDiv: this.state.lineInfo[this.state.lineInfoNum].lineDiv,
          perNum: 3, // 固定
          pageNo: 1, // 固定
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params, true))
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // customerIdでlineKeyObjectを更新チェック
  checkCustomerId(newId) {
    let customerId = localStorage.getItem('customerId')
    if (!customerId) {
      // customerId保存
      // lineKeyObject削除
      localStorage.setItem('customerId', newId)
      localStorage.removeItem('lineInfoNum')
      localStorage.removeItem('lineKeyObject')
    } else {
      // customerIdが異なる場合
      if (customerId != newId) {
        // customerId保存
        // lineKeyObject削除
        localStorage.setItem('customerId', newId)
        localStorage.removeItem('lineInfoNum')
        localStorage.removeItem('lineKeyObject')
      }
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token && type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      this.setState({ token })
    }
    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      //console.log(type, data.data, status, token)
      var params
      if (data.data && data.data.length > 0) {
        params = data.data[0]
      } else {
        params = data.data
      }
      // RUN ONLY IF DATA IS AVAILABLE
      if (data) {
        if (type === Const.CONNECT_TYPE_ERROR_MESSAGES) {
          this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
        } else if (type === Const.CONNECT_TYPE_MYPAGEID) {
          this.setState({ customer_id: data.data.customerId })
          window.customerId = data.data.customerId
          this.checkCustomerId(data.data.customerId)
          this.handleConnect(Const.CONNECT_TYPE_TOP_NOTICE_DATA)
          this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
          // メールアドレス変更の時刻を見て表示切替を実施
          this.switchMailStatus()
          // customerInfo取得
          this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 'customerInfo')

          //解約新規チェック
          this.checkcancellationNewFunc()
        } else if (type === Const.CONNECT_TYPE_REQUEST_ACTIVATE) {
          // リスト再取得
          this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
        } else if (type === Const.CONNECT_TYPE_APPLY_LINE_LIST) {
          let lineList = data.data.lineList
          if (lineList) {
            this.setState({
              applyNumber: lineList[0] ? lineList[0].applyNumber : '',
              lineList,
            })
            // check if mnp error
            let mnpError = lineList.filter((item) => {
              return item.activateStatus == '9'
            })
            if (mnpError.length) {
              this.setState({ isMnpError: true })
            }
            // check if invalid Address error
            let addressError = lineList.filter((item) => {
              return item.deliveryNumber
            })
            if (addressError.length) {
              this.setState({ isAddressError: true })
            }
          }
        } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
          // 申込書番号(mvnoApplyNumber)
          // 契約ステータス(contractStatus)
          // 倉庫連携ステータス(warehouseStatus)
          let contract = data.data.contractList.filter(
            (item) => item.customerId == window.customerId
          )[0]
          this.setState({
            mvnoApplyNumber: contract.mvnoApplyNumber,
            contractStatus: contract.contractStatus,
            warehouseStatus: contract.warehouseStatus,
          })
          if (
            (this.state.contractStatus == 'beforeRegistration' &&
              this.state.warehouseStatus == 'cancel') ||
            (this.state.contractStatus == 'cancel' &&
              this.state.warehouseStatus == 'cancel')
          ) {
            // 契約ステータス: 登録前(beforeRegistration)
            // 倉庫連携ステータス: キャンセル(cancel)
            // の場合 ■キャンセル表示
          } else {
            // ■回線申し込み情報表示
            // 申込回線一覧取得(applyLineList)
            this.handleConnect(Const.CONNECT_TYPE_APPLY_LINE_LIST)
          }
        } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
          if (this.state.isGetCustomerInfoFlg) {
            this.applyCustomerInfo(type, data, status, token)
            this.setState({ isGetCustomerInfoFlg: false })
            return
          }
          try {
            this.setState({ customerID: params.customerID })
            this.setState({ mailAddress: params.mailAddress })
            this.setState({ loginMailAddressFlg: params.loginMailAddressFlg })
            this.setState({ loginYahooFlg: params.loginYahooFlg })
            this.setState({ loginGoogleFlg: params.loginGoogleFlg })
            if (params.customerInfo && params.customerInfo.userName) {
              this.setState({ customerInfo: params.customerInfo })
              this.props.updateCustomerInfo(params.customerInfo)
            }
            if (params.lineInfo.length) {
              this.setState({ lineInfo: params.lineInfo })
              this.setState({
                groupActivateDate: params.lineInfo[0].groupActivateDate,
              })

              this.setLocalStorageRemoveLine(params.lineInfo)

              let _url_data = this.state.url_data
              _url_data[0].pass_data = Object.assign(
                _url_data[0].pass_data,
                params.lineInfo[0]
              )
              this.setState({ url_data: _url_data })
              this.setState({
                simInfo: params.lineInfo[this.state.lineInfoNum].simInfo,
              })
              localStorage.setItem(
                Const.LINEKEYOBJECT,
                params.lineInfo[this.state.lineInfoNum].lineKeyObject
              )
              localStorage.setItem(
                Const.LINEDIV,
                params.lineInfo[this.state.lineInfoNum].lineDiv
              )
            }

            //console.log(this.state.lineInfoNum, params.lineInfo)

            console.log('lineInfo', params.lineInfo[this.state.lineInfoNum])
            if (
              params.lineInfo[this.state.lineInfoNum] &&
              'planChange' in params.lineInfo[this.state.lineInfoNum] &&
              this.isSharePlan()
            ) {
              let { changePlanType } = params.lineInfo[
                this.state.lineInfoNum
              ].planChange

              //翌月反映予定のプラン変更が申し込まれており、そのプランがシングルプラン（シェア以外）である場合、シェア追加ボタンを押せないようにする
              if (changePlanType) {
                //1:音声 / 2:データ / 3:シェア
                // 現在契約中のプラン名に"シェア"の文字が含まれるかどうか
                this.setState({ changePlanType: changePlanType })
              } else {
                this.setState({ changePlanType: '' })
              }
            }

            if (
              //解約表示になってしまうケースへの対応
              params.lineInfo[this.state.lineInfoNum] &&
              params.lineInfo[this.state.lineInfoNum].simInfo.length > 0
            ) {
              var simInfos = params.lineInfo[this.state.lineInfoNum].simInfo
              var arr = []
              for (var i = 0; i < simInfos.length; i++) {
                var _siminfo = simInfos[i]
                if (
                  !this.checkCancellation(
                    _siminfo.removeDate,
                    _siminfo.cancelDate,
                    _siminfo.simType
                  ).operation_type1
                ) {
                  arr.push(_siminfo)
                }
              }
              if (arr.length == simInfos.length) {
                //TOPは空にする
                //this.setState({ dataPlanSize: params.dataPlanSize })
                //this.setState({ dataFreeSumSize: params.dataFreeSumSize })
                //this.setState({ dataFreeMonthSize: params.dataFreeMonthSize })
                /*
                this.setState({
                  dataFreeAddBroughtSize0: params.dataFreeAddBroughtSize0,
                })
                this.setState({
                  dataFreeAddBroughtSize1: params.dataFreeAddBroughtSize1,
                })
                this.setState({
                  dataFreeAddBroughtSize2: params.dataFreeAddBroughtSize2,
                })
                this.setState({
                  dataFreeAddBroughtSize3: params.dataFreeAddBroughtSize3,
                })
                */
                this.setState({
                  loading_state_top: false,
                  all_line_cancellation: true,
                })
              } else {
                this.handleConnect(Const.CONNECT_TYPE_TOP_DATA)
              }
            } else {
              this.setState({ isRemoveStatus: true })
              this.setState({ loading_state_top: false })
              this.setState({ loading_fail: true })
            }
            setTimeout(() => {
              if (this.state.mailAddress === '') {
                this.oneTimePopUp()
              }
            }, 1)
          } catch (e) {
            console.log('error: ', e)
          } finally {
            this.setState({ loading_state_extra: false })
          }
        } else if (type === Const.CONNECT_TYPE_TOP_DATA) {
          this.setState({ dataPlanSize: params.dataPlanSize })
          this.setState({ dataFreeSumSize: params.dataFreeSumSize })
          this.setState({ dataFreeMonthSize: params.dataFreeMonthSize })
          this.setState({
            dataFreeAddBroughtSize0: params.dataFreeAddBroughtSize0,
          })
          this.setState({
            dataFreeAddBroughtSize1: params.dataFreeAddBroughtSize1,
          })
          this.setState({
            dataFreeAddBroughtSize2: params.dataFreeAddBroughtSize2,
          })
          this.setState({
            dataFreeAddBroughtSize3: params.dataFreeAddBroughtSize3,
          })
          this.setState({ loading_state_top: false })
          this.updateChartData()
          // 回線タイプ取得、判定
          this.handleConnect(Const.CONNECT_TYPE_PLAN)
        } else if (type === Const.CONNECT_TYPE_PLAN) {
          this.setState({ planName: params.planName })
          this.setState({ planId: params.planId })
          if (params.seniorPlanFlag) {
            this.setState({ seniorPlanFlag: params.seniorPlanFlag })
          }

          //3年学割チェック
          this.getStudentDiscountEnds()
        } else if (type === Const.CONNECT_TYPE_TOP_NOTICE_DATA) {
          this.setState({ importantNoticeArray: params.importantNoticeArray })
          this.setState({ noticeArray: params.noticeArray })
          this.setState({ bannerArray: params.bannerArray })
          this.setState({ data_available: true })

          var w = $(window).width()
          var settings_copy = this.state.settings
          var banner_settings_copy = this.state.banner_settings
          if (w >= 600) {
            settings_copy.speed = 1000
            banner_settings_copy.slidesToShow = 3
            banner_settings_copy.slidesToScroll = 3
          } else {
            settings_copy.speed = 500
            banner_settings_copy.slidesToShow = 1
            banner_settings_copy.slidesToScroll = 1
          }

          if (this.state.bannerArray.length <= 2) {
            console.log(this.state.bannerArray.length)
            banner_settings_copy.infinite = false
          } else {
            banner_settings_copy.infinite = true
          }

          if (this.state.bannerArray.length <= 0) {
            this.setState({ banner_space: false })
          } else {
            this.setState({ banner_space: true })
          }
          this.setState({
            settings: settings_copy,
            banner_settings: banner_settings_copy,
          })
          this.setState({ loading_state: false })
          this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
        }
      }
    }
    // IF ERROR IN CONNECTION
    else if (status === Const.CONNECT_ERROR) {
      // TODO 一時対処
      if (type === Const.CONNECT_TYPE_CONTRACT_LIST) return
      this.setState({ mailAddress: '' })
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        if (
          data.response &&
          data.response.error_detail &&
          data.response.error_detail.error_code &&
          (data.response.error_detail.error_code === 'E99908' ||
            data.response.error_detail.error_code === 'E99902')
        ) {
          // agreement API エラー
          // お客様情報が存在しません
          // 該当したデータ情報が存在しません
          this.props.isExistStatus(
            'set',
            false,
            data.response.error_detail.error_code
          )
        }
        if (
          (data.name == 'KPD.Order.bindFirstLine' ||
            data.name == 'KPD.Order.bindLine') &&
          data.response &&
          data.response.StatusCode == '510'
        ) {
          // Const.CONNECT_TYPE_REQUEST_ACTIVATE
          // ご利用いただけません
          dialogs_copy[0].title = data.code
          var values = []
          values[0] = {
            text: (
              <p style={{ color: '#B50080', margin: '0' }}>
                ただいまの時間は開通は行なえません。
                <br />
                受付時間：09:00-19:00
              </p>
            ),
          }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({ dialogs_error: dialogs_copy })
        } else if (
          data.name &&
          data.name.startsWith('KPD.Support.') &&
          data.response &&
          data.response.StatusCode == '500'
        ) {
          // システムメンテナンス表示
          this.setState({ isMaintenance: true })
        } else {
          if (!this.state.isAgreementError) {
            let agreementErrorType = data.type
            this.setState({
              agreementErrorType,
              isAgreementError: true,
            })
            this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 'extra')
          }
        }
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else {
        // CONNECT_TYPE_APPLY_LINE_LIST
        if (type === Const.CONNECT_TYPE_APPLY_LINE_LIST) return
        if (type === Const.CONNECT_TYPE_REQUEST_ACTIVATE) return
        this.props.history.push('/login')
      }
      setTimeout(() => {
        this.setState({ loading_state: false })
        this.setState({ loading_state_top: false })
        this.setState({ loading_fail: true })
      }, 1)
    }
  }

  // SET THE PIE CHART DATA
  updateChartData() {
    // set background canvas
    var element = document.getElementById('bgDoughnutCanvas')
    if (element) {
      var context = element.getContext('2d')
      context.arc(
        238,
        214,
        160,
        (0 * Math.PI) / 180,
        (360 * Math.PI) / 180,
        false
      )
      context.fillStyle = 'rgba(204, 204, 204, 0)'
      context.fill()
      context.strokeStyle = 'rgb(204, 204, 204)'
      context.lineWidth = 56.5
      context.stroke()
    }
    var chartsx01 = this.state.chartData01
    var chartsx02 = this.state.chartData02
    var dark_pink, gray, pink, white

    var dataFreeSumSize = parseFloat(this.state.dataFreeSumSize.GB)
    var dataPlanSize = parseFloat(this.state.dataPlanSize.GB)

    // INNER CIRCLE-----------------------------------------
    dark_pink = dataFreeSumSize < dataPlanSize ? dataFreeSumSize : dataPlanSize
    gray = dataPlanSize > dataFreeSumSize ? dataPlanSize - dataFreeSumSize : 0

    // OUTER CIRCLE-----------------------------------------
    pink = dataPlanSize < dataFreeSumSize ? dataFreeSumSize - dataPlanSize : 0
    if (dataFreeSumSize >= 2 * dataPlanSize) {
      pink = dataPlanSize
    }

    white = dataPlanSize < dataFreeSumSize ? dataPlanSize - pink : 100
    if (dataFreeSumSize >= 2 * dataPlanSize) {
      white = 0
    }

    var options01 = this.state.options01
    var options02 = this.state.options02
    options01.animation.duration = 1200
    options02.animation.duration = 1200
    options02.cutoutPercentage = 90

    if (pink != 0) {
      // change animation condition
      options01.animation.easing = 'linear'
      options02.animation.easing = 'linear'
      this.setState({ options01, options02 })
    }

    chartsx01.datasets = [
      {
        label: 'dataPlanSize',
        data: [0, dark_pink, gray],
        backgroundColor: Chart_default.row_data.backgroundColor,
        hoverBackgroundColor: Chart_default.row_data.hoverBackgroundColor,
        hoverBorderColor: Chart_default.row_data.hoverBorderColor,
        borderColor: '#FFFFFF',
        borderWidth: 0,
      },
    ]

    let _this = this
    this.setState({ chartData01: chartsx01 }, function () {
      if (pink != 0) {
        setTimeout(function () {
          $('#outerDoughnut').css('opacity', '1')
          chartsx02.datasets = [
            {
              label: 'FreeSumSize',
              data: [pink, white, 0],
              backgroundColor: Chart_default.frist_data.backgroundColor,
              hoverBackgroundColor:
                Chart_default.frist_data.hoverBackgroundColor,
              hoverBorderColor: Chart_default.frist_data.hoverBorderColor,
              borderColor: Chart_default.frist_data.borderColor,
              borderWidth: 2,
            },
          ]
          _this.setState({ chartData02: chartsx02 })
        }, 1200 + 150)
      }
    })
  }

  // RESET THE PIE CHART DATA
  resetChartData() {
    var options01 = this.state.options01
    var options02 = this.state.options02
    options01.animation.duration = 0
    options02.animation.duration = 0

    var chartData01 = this.state.chartData01
    var chartData02 = this.state.chartData02

    chartData01.datasets[0].data = [0, 0, 0]
    chartData02.datasets[0].data = [0, 0, 0]

    this.setState({
      options01,
      options02,
      chartData01,
      chartData02,
    })
  }

  makePresentage(x, y) {
    return (100 * x) / (x + y)
  }

  setCampaignPopUp(type) {
    if (type === 'newPlan') {
      this.setState({ newPlanPopUp: true })
    } else if (type === 'maintenance') {
      this.setState({ maintenancePopUp: true })
    } else if (type === 'shokai') {
      this.setState({ shokaiPopUp: true })
    } else if (type === 'limitedCampaign') {
      this.setState({ limitedCampaignPopUp: true })
    } else if (type === 'limitedQuestionnairePt2') {
      this.setState({ limitedQuestionnairePt2PopUp: true })
    } else if (type === 'limitedQuestionnaire') {
      this.setState({ limitedQuestionnairePopUp: true })
    } else if (type === 'limitedNetsuper') {
      this.setState({ limitedNetsuperPopUp: true })
    } else if (type === 'limitedNetsuper_2') {
      this.setState({ limitedNetsuperPopUp_2: true })
    } else {
      this.setState({ campaignPopUp: true })
    }
    $('.t-modal').addClass('is-active')
    $('.t-modal_content').addClass('is-active')
    let vh = $(window).height()
    let ch = $('#modal_mail').height()
    if (vh && !ch) ch = 300
    let top = (vh - ch) / 2
    $('.t-modal_content').css('top', top).css('position', 'fixed')
  }

  oneTimePopUp() {
    if (!this.getOneTimePopUp()) {
      console.log('OneTimePopUp Show')
      $('.t-modal').addClass('is-active')
      $('.t-modal_content').addClass('is-active')
      let vh = $(window).height()
      let ch = $('#modal_mail').height()
      let top = (vh - ch) / 2
      $('.t-modal_content').css('top', top).css('position', 'fixed')
      this.setOneTimePopUp()
    } else {
      console.log('OneTimePopUp Hide')
    }
  }
  getErrorMessages() {
    fetch(Const.CONNECT_TYPE_ERROR_MESSAGES, {
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
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState({
          errorMessages: json.mypage || {},
        })
        this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  componentDidMount() {
    let reload = localStorage.getItem('reload')
    if (reload) {
      // ログイン後に1度リロード
      localStorage.removeItem('reload')
      location.reload()
    }
    localStorage.setItem('isLoggedIn', '1')
    let lineInfoNum = localStorage.getItem('lineInfoNum')
    if (lineInfoNum) {
      this.setState({ lineInfoNum })
    }
    this.goTop()
    console.log('window.customerId :: ', window.customerId)
    // if(window.customerId === undefined) return;

    document.title = Const.TITLE_MYPAGE

    var chartsx01 = this.state.chartData01
    var chartsx02 = this.state.chartData02

    chartsx01.datasets[0].data = [0, 0, 0]

    chartsx02.datasets[0].data = [0, 0, 0]

    this.setState({
      chartData01: chartsx01,
      chartData02: chartsx02,
    })
    this.props.isExistStatus('set', true, 'E99908')
    this.props.isExistStatus('set', true, 'E99902')

    this.getErrorMessages()

    $('.top-important_inner')
      .find('.slick-track')
      .addClass('top-important_list')
    $('.top-important_inner')
      .find('.slick-initialized')
      .css('padding', '0 0 0 6.5rem')
    $('.top-important_inner').find('.slick-track').css('padding', '0')
    $('.top-main_banner').find('.slick-slider').addClass('top-main_slider')

    $('#modal_mail').click(function (e) {
      e.preventDefault()
      // $('.t-modal').addClass("is-active");
      // $('.t-modal_content').addClass("is-active");
      // $('.t-modal_content').css("top", "195.2px").css("position", "fixed");
    })

    $('.t-modal_overlay').click(
      function () {
        $('.t-modal').removeClass('is-active')
        $('.t-modal_content').removeClass('is-active')
        if (this.state.campaignPopUp) {
          this.setState({ campaignPopUp: false })
        }
        if (this.state.maintenancePopUp) {
          this.setState({ maintenancePopUp: false })
        }
        if (this.state.shokaiPopUp) {
          this.setState({ shokaiPopUp: false })
        }
        if (this.state.newPlanPopUp) {
          this.setState({ newPlanPopUp: false })
        }
        if (this.state.limitedCampaignPopUp) {
          this.setState({ limitedCampaignPopUp: false })
        }
        if (this.state.limitedQuestionnairePt2PopUp) {
          this.setState({ limitedQuestionnairePt2PopUp: false })
        }
        if (this.state.limitedQuestionnairePopUp) {
          this.setState({ limitedQuestionnairePopUp: false })
        }
        if (this.state.limitedNetsuperPopUp) {
          this.setState({ limitedNetsuperPopUp: false })
        }
        if (this.state.limitedNetsuperPopUp_2) {
          this.setState({ limitedNetsuperPopUp_2: false })
        }
      }.bind(this)
    )

    $('#CloseDialog').click(
      function () {
        $('.t-modal').removeClass('is-active')
        $('.t-modal_content').removeClass('is-active')
        if (this.state.campaignPopUp) {
          this.setState({ campaignPopUp: false })
        }
        if (this.state.maintenancePopUp) {
          this.setState({ maintenancePopUp: false })
        }
        if (this.state.shokaiPopUp) {
          this.setState({ shokaiPopUp: false })
        }
        if (this.state.newPlanPopUp) {
          this.setState({ newPlanPopUp: false })
        }
        if (this.state.limitedCampaignPopUp) {
          this.setState({ limitedCampaignPopUp: false })
        }
        if (this.state.limitedQuestionnairePt2PopUp) {
          this.setState({ limitedQuestionnairePt2PopUp: false })
        }
        if (this.state.limitedQuestionnairePopUp) {
          this.setState({ limitedQuestionnairePopUp: false })
        }
        if (this.state.limitedNetsuperPopUp) {
          this.setState({ limitedNetsuperPopUp: false })
        }
        if (this.state.limitedNetsuperPopUp_2) {
          this.setState({ limitedNetsuperPopUp_2: false })
        }
      }.bind(this)
    )

    var self = this
    $(window).on('load resize', function () {
      var w = $(window).width()
      var settings_copy = self.state.settings
      var banner_settings_copy = self.state.banner_settings
      if (w >= 600) {
        settings_copy.speed = 1000
        banner_settings_copy.slidesToShow = 3
        banner_settings_copy.slidesToScroll = 3
      } else {
        settings_copy.speed = 500
        banner_settings_copy.slidesToShow = 1
        banner_settings_copy.slidesToScroll = 1
      }
      setTimeout(() => {
        self.setState({
          settings: settings_copy,
          banner_settings: banner_settings_copy,
        })
      }, 100)
    })

    /* var w = $(window).width();
    var banner_settings_copy = this.state.banner_settings;
    if(w >= 600){
      banner_settings_copy.slidesToShow = 3;
      banner_settings_copy.slidesToScroll = 3;
    }else{
      banner_settings_copy.slidesToShow = 1;
      banner_settings_copy.slidesToScroll = 1;
    }
    setTimeout(()=> {
        this.setState({banner_settings : banner_settings_copy});
    },1); */
    awaitPostMessage('login')

    var isMailAuthCompleteFail = localStorage.getItem('isMailAuthCompleteFail')
    var mailAuthComplete = localStorage.getItem('mailAuthComplete')
    localStorage.removeItem('isMailAuthCompleteFail')
    localStorage.removeItem('mailAuthComplete')
    if (isMailAuthCompleteFail && mailAuthComplete) {
      // URL遷移でメールアドレス変更処理を実行
      window.location.href = mailAuthComplete
    }

    // //for pop up display count
    // this.count=0;
  }
  // コンポーネントが画面から削除されるときに実行されるイベント
  componentWillUnmount() {
    clearInterval(this.state.interval)
    if (st) clearTimeout(st)
  }

  // メールアドレス変更の履歴/時間を見て表示切替を実施
  switchMailStatus() {
    let customerId = window.customerId
    let histories = localStorage.getItem('changeMailHistory')
    if (histories) {
      histories = JSON.parse(histories)
      let history = histories.filter((item) => {
        return item.customerId == customerId
      })
      if (history.length) {
        let target = history[history.length - 1]
        let time = target.time
        time = parseInt(time)
        let timeStamp = Math.round(new Date().getTime() / 1000)
        if (timeStamp - 60 < time) {
          let diff = time + 60 - timeStamp
          this.setState({ changeMailHistory: true })
          // 差分時間経過後に再取得（最大1分）
          st = setTimeout(
            function () {
              // localStorage更新
              this.updateHistory(customerId)
              this.setState({ changeMailHistory: false })
              this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
            }.bind(this),
            1000 * diff
          )
        } else {
          // localStorage更新
          this.updateHistory(customerId)
        }
      }
    }
  }
  // localStorage更新
  updateHistory(customerId) {
    let histories = localStorage.getItem('changeMailHistory')
    if (histories) {
      histories = JSON.parse(histories)
      let newHistories = histories.filter((item) => {
        return item.customerId != customerId
      })
      if (newHistories && newHistories.length) {
        localStorage.setItem('changeMailHistory', JSON.stringify(newHistories))
      } else {
        localStorage.removeItem('changeMailHistory')
      }
    } else {
      localStorage.removeItem('changeMailHistory')
    }
  }

  dataFixingHandler(type, index, subIndex) {
    var TempReturn = ' '
    if (this.state.data_available) {
      switch (type) {
        case 'dataPlanSize':
          TempReturn = this.state.dataPlanSize.GB + 'GB'
          break
        case 'dataFreeMonthSize':
          TempReturn = this.state.dataFreeMonthSize.GB + 'GB'
          break
        case 'dataFreeAddBroughtSize':
          {
            let dataFreeAddBrought = 0
            if (this.state[`dataFreeAddBroughtSize${subIndex}`]) {
              dataFreeAddBrought =
                dataFreeAddBrought +
                parseFloat(this.state[`dataFreeAddBroughtSize${subIndex}`].GB)
            }
            TempReturn = '＋' + dataFreeAddBrought + 'GB'
          }
          break
        case 'dataFreeAddBroughtSizeCurrentMonth':
          {
            let dataFreeAddBroughtSizeCurrentMonth = 0
            if (this.state.dataFreeAddBroughtSize0) {
              dataFreeAddBroughtSizeCurrentMonth =
                dataFreeAddBroughtSizeCurrentMonth +
                parseFloat(this.state.dataFreeAddBroughtSize0.GB)
            }
            TempReturn = '＋' + dataFreeAddBroughtSizeCurrentMonth + 'GB'
          }
          break
        case 'dataFreeAddBroughtSizeOver3Month':
          {
            let total = 0
            if (this.state.dataFreeAddBroughtSize1) {
              total = total + parseFloat(this.state.dataFreeAddBroughtSize1.GB)
            }
            if (this.state.dataFreeAddBroughtSize2) {
              total = total + parseFloat(this.state.dataFreeAddBroughtSize2.GB)
            }
            if (this.state.dataFreeAddBroughtSize3) {
              total = total + parseFloat(this.state.dataFreeAddBroughtSize3.GB)
            }
            TempReturn = '＋' + total + 'GB'
          }
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return TempReturn
    }
  }

  getWindowSize() {
    var w = window

    var d = document

    var e = d.documentElement

    var g = d.getElementsByTagName('body')[0]

    var w = w.innerWidth || e.clientWidth || g.clientWidth

    var h = w.innerHeight || e.clientHeight || g.clientHeight

    return {
      width: w,
      height: h,
    }
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
        case 'dialog_button_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          // アクティベート依頼API実行
          this.handleConnect(Const.CONNECT_TYPE_REQUEST_ACTIVATE)
          break
        }
        case 'dialog_cancelRequestDate': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_type1Restriction': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[2].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_couponStopRestriction': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[3].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_close': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[1].state = false
          dialogs_copy[2].state = false
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

  goNextDisplay(e, url, params, lineNo) {
    e.preventDefault()
    if (url === '/mypage/sim/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      // NEED TO SEND THE LINE NO
      params.lineNo = lineNo
      //MNP転出のお申し込み
      params.mailAddress = this.state.mailAddress
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/speed/change/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.lineNo = lineNo
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/communication/change/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.lineNo = lineNo
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/news/detail/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      url = url + params.noticeId
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/news/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/option/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/payment/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/operate/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/') {
      if (lineNo) {
        params.anchorName = lineNo
      }
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/speed/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.seniorPlanFlag = this.state.seniorPlanFlag
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/plan/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    // LINKS IN HEADER BUT NOT ACTUALLY ON HEADER--------------
    else if (url === '/contact/') {
      let params = {}
      params.frompage = 'fromMypage'
      console.log('passdate::', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/campaign/') {
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

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    console.log('this is from the header*******************')
    console.log(params)
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  // HANDLE THE HEADER LINKS
  async onChangeSelectValue(e) {
    // チャート図をリセット
    var val = e.target.value
    this.setState({ loading_state_top: true })
    await this.resetChartData()
    this.setState({ lineInfoNum: val })
    localStorage.setItem('lineInfoNum', val)
    localStorage.setItem(
      'lineKeyObject',
      this.state.lineInfo[val].lineKeyObject
    )
    // 再読み込み
    location.reload()
  }

  // RETURN 料金プラン変更リンク
  returnChangePlanLink() {
    let startDate = this.state.customerInfo.startDate
    if (
      (this.state.contractStatus !== 'sent' &&
        this.state.contractStatus !== 'waitingOptionRegistrarion') ||
      moment(startDate).isSame(moment(), 'day')
    ) {
      return null
    }

    //契約中回線判定
    if (this.state.simInfo.length > 0) {
      var arr = []
      for (var i = 0; i < this.state.simInfo.length; i++) {
        var _siminfo = this.state.simInfo[i]
        if (
          !this.checkCancellation(
            _siminfo.removeDate,
            _siminfo.cancelDate,
            _siminfo.simType
          ).operation_type2
        ) {
          arr.push(_siminfo)
        }
      }
      if (arr.length == this.state.simInfo.length) {
        return null
      }
    }

    let groupActivateDate = this.state.groupActivateDate
    let last1day = moment().endOf('month').add(-1, 'd')
    let last2day = moment().endOf('month').add(-2, 'd')
    let type1Restriction = false
    if (
      this.state.lineInfo[0].lineDiv == '1' &&
      moment(groupActivateDate).isSame(moment(), 'day')
    ) {
      if (
        last1day.isSame(moment(), 'day') ||
        last2day.isSame(moment(), 'day')
      ) {
        type1Restriction = true
      }
    }
    return (
      <p className="top-main_btn m-btn">
        <a
          className="a-btn-radius-arrow"
          href=""
          onClick={(e) => {
            let cancelRequestDate = this.state.customerInfo.cancelRequestDate
            if (cancelRequestDate && cancelRequestDate != '') {
              e.preventDefault()
              this.goTop()
              this.callbackDialog(
                Const.EVENT_CLICK_BUTTON,
                'dialog_cancelRequestDate',
                ''
              )
            } else if (type1Restriction) {
              e.preventDefault()
              this.goTop()
              this.callbackDialog(
                Const.EVENT_CLICK_BUTTON,
                'dialog_type1Restriction',
                ''
              )
            } else {
              this.goNextDisplay(
                e,
                '/mypage/plan/',
                this.state.lineInfo[this.state.lineInfoNum]
              )
            }
          }}
        >
          料金プラン変更手続き
        </a>
      </p>
    )
  }

  // RETURN top-main_info
  returnTopMainInfo() {
    if (this.state.loading_state_top) {
      return (
        <div
          className="top-main_info"
          id="top_main_space_remover"
          style={{ position: 'relative' }}
        >
          <div
            style={{
              // position: 'absolute',
              // top: 0,
              // left: 0,
              width: '100%',
              // height: '100%',
              backgroundColor: '#ffffff',
              zIndex: 100,
              textAlign: 'center',
            }}
          >
            <div className="" style={{ margin: '150px 0' }}>
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
          </div>
        </div>
      )
    } else if (this.state.loading_fail) {
      // 1: 未アクティベート 2:アクティベート中 回線情報は出せない
      let isNotActivated = this.state.lineList.filter((item) => {
        return (
          item.activateStatus == '1' ||
          item.activateStatus == '2' ||
          item.activateStatus == null
        )
      })

      if (isNotActivated.length) {
        return (
          <div
            className="top-main_info"
            id="top_main_space_remover"
            style={{ position: 'relative' }}
          />
        )
      } else {
        if (this.state.isMaintenance) {
          let message = (
            <div>
              <p style={{ fontWeight: 'bold' }}>
                只今システムメンテナンス中です。
              </p>
              <p>
                ご不便をおかけいたしますことをお詫び申し上げます。
                <br />
                メンテナンスの状況等については、お知らせよりご確認ください。
              </p>
            </div>
          )
          if (this.state.errorMessages.isMaintenance) {
            message = ReactHtmlParser(this.state.errorMessages.isMaintenance)
          }
          return (
            <div
              className="top-main_info"
              id="top_main_space_remover"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  textAlign: 'center',
                }}
              >
                <div className="agreementErrorArea">{message}</div>
              </div>
            </div>
          )
        }
        return (
          <div
            className="top-main_info"
            id="top_main_space_remover"
            style={{ position: 'relative' }}
          >
            <div
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                textAlign: 'center',
              }}
            >
              <div className="agreementErrorArea">
                <p style={{ fontWeight: 'bold' }}>
                  回線情報を読み込みできませんでした。
                </p>
                {(() => {
                  if (
                    this.state.agreementErrorType != 1 &&
                    this.state.agreementErrorType != 2
                  ) {
                    return (
                      <p>
                        本日回線を開通いただいている方は、翌日以降ご確認いただけます。
                      </p>
                    )
                  }
                })()}
                <p>
                  この状態が続く場合は、お客さまセンターまでお問い合わせください。
                </p>
                {(() => {
                  if (this.props.isExistStatus('get')) {
                    return (
                      <p>
                        <a className="a-link" href="/mypage/user/">
                          お客さま情報（ログイン設定）はこちら
                        </a>
                      </p>
                    )
                  }
                })()}
              </div>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div
          className="top-main_info"
          id="top_main_space_remover"
          style={{ position: 'relative' }}
        >
          <div className="top-main_info_graph">
            <div className="top-main_graph">
              <div className="m-graph" style={{ marginBottom: '3.2em' }}>
                <div className="pieChart_test">
                  <div
                    id="bgDoughnut"
                    className="pieChart_cover"
                    style={{ position: 'absolute', top: 0 }}
                  >
                    <canvas
                      id="bgDoughnutCanvas"
                      height="448"
                      width="476"
                      className="chartjs-render-monitor"
                      style={{
                        display: 'block',
                        height: '224px',
                        width: '238px',
                        margin: '0 auto',
                      }}
                    />
                  </div>
                  <div
                    className="pieChart_cover01"
                    style={{ height: '200px', paddingTop: '12px' }}
                  >
                    <div className="pieChartLables">
                      <div className="pieChartLbl1">
                        <div className="piChartBlock1" />
                        <div className="p_text1">ご利用中のプラン容量</div>
                      </div>
                      <div className="pieChartLbl2">
                        <div className="piChartBlock2" />
                        <div className="p_text2">繰越・追加容量</div>
                      </div>
                    </div>
                    <div className="pieChart_center" style={{ zIndex: 1 }}>
                      残り
                      <br />
                      高速データ通信容量
                      <br />
                      <span className="pieChart_center_val1">
                        {!this.isZeroPlan()
                          ? this.state.dataFreeSumSize.GB
                          : '0'}
                      </span>
                      GB
                      <div className="pieChart_hr" />
                      <div className="pieChart_center_val2">
                        /{this.state.dataPlanSize.GB}
                        <span className="pieChart_center_val_sub1">GB</span>
                        <br />
                        <span className="pieChart_center_bottom">(当月分)</span>
                      </div>
                    </div>
                    {this.getPieChart01()}
                  </div>
                  <div
                    id="outerDoughnut"
                    className="pieChart_cover"
                    style={{ opacity: 0, position: 'absolute', top: 0 }}
                  >
                    {this.getPieChart02()}
                  </div>
                </div>
              </div>
            </div>
            {this.returnChangePlanLink()}
            {(() => {
              if (!this.isZeroPlan() && !this.state.all_line_cancellation) {
                this.isActivateDate = moment().isSame(
                  moment(this.state.groupActivateDate),
                  'day'
                )
                return (
                  <p className="top-main_btn m-btn">
                    <a
                      className="a-btn-radius-plus"
                      href=""
                      onClick={(e) => {
                        if (this.isActivateDate) {
                          e.preventDefault()
                          this.goTop()
                          this.callbackDialog(
                            Const.EVENT_CLICK_BUTTON,
                            'dialog_couponStopRestriction',
                            ''
                          )
                        } else {
                          this.goNextDisplay(
                            e,
                            '/mypage/speed/',
                            this.state.lineInfo[this.state.lineInfoNum]
                          )
                        }
                      }}
                    >
                      高速データ通信容量追加
                    </a>
                  </p>
                )
              }
            })()}
            <p className="top-main_link" style={{ textAlign: 'center' }}>
              <a
                style={Link}
                href=""
                onClick={(e) =>
                  this.goNextDisplay(
                    e,
                    '/guide/',
                    this.state.lineInfo[this.state.lineInfoNum],
                    '#a7'
                  )
                }
              >
                ※容量の表示について
              </a>
            </p>
            {!this.state.all_line_cancellation ? (
              <p className="top-main_link" style={{ textAlign: 'center' }}>
                <a
                  style={Link}
                  href=""
                  onClick={(e) =>
                    this.goNextDisplay(
                      e,
                      '/mypage/campaign/',
                      Object.assign(
                        { type: 1 },
                        this.state.url_data[0].pass_data
                      )
                    )
                  }
                >
                  紹介チケットを発行
                </a>
              </p>
            ) : null}
          </div>
          <div className="top-main_info_data">
            <h2 className="top-main_ttl a-h3-ic a-h3-ic-sm">
              <span className="a-ic-data" role="img" />
              高速データ通信容量
            </h2>
            <table className="top-main_data">
              <tbody>
                <tr>
                  <th>
                    <span className="top-main_data_th-01">契約容量</span>
                  </th>
                  <td>{this.getContractCapacityText()}</td>
                </tr>
                {!this.state.all_line_cancellation ? (
                  <React.Fragment>
                    <tr>
                      <th>
                        <span className="top-main_data_th-02">
                          今月分残り容量
                        </span>
                      </th>
                      <td>
                        {!this.isZeroPlan()
                          ? this.dataFixingHandler('dataFreeMonthSize', 0, 0)
                          : '0GB'}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ verticalAlign: 'initial' }}>
                        <span className="top-main_data_th-03">
                          繰越・追加容量
                        </span>
                      </th>
                      <td style={{ paddingRight: '0' }}>
                        {this.dataFixingHandler(
                          'dataFreeAddBroughtSizeCurrentMonth',
                          0,
                          0
                        )}
                        <span className="a-fw-normal a-fs-sm a-fs-pc-14">
                          （期限：当月末）
                        </span>
                        {this.renderFreeAddBroughtsDetail()}
                      </td>
                    </tr>
                  </React.Fragment>
                ) : (
                  <tr>
                    <th />
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
            <h2 className="top-main_ttl a-h3-ic a-h3-ic-sm">
              <span className="a-ic-sim" role="img" />
              SIMカード
            </h2>
            <table className="top-main_sim">
              <colgroup>
                <col />
                <col className="a-wd-42" />
              </colgroup>
              <tbody>{this.simInfo}</tbody>
            </table>
            {(() => {
              let isIij = this.state.simInfo.some((item) => {
                return (
                  this.checkCancellation(
                    item.removeDate,
                    item.cancelDate,
                    item.simType,
                    item.cancelRequestDate
                  ).status == 2
                )
              })
              if (isIij) {
                return ''
                /*
                (
                  <div className="a-fs-sm a-mb-10">
                    ※MNP解約手続き中の回線がある場合、シングルプランへの切り替えは翌月以降から可能となります
                  </div>
                )
                */
              } else {
                return ''
              }
            })()}

            {(() => {
              if (
                this.isSharePlan() &&
                (this.state.changePlanType == '' ||
                  this.state.changePlanType == '3')
              ) {
                if (
                  this.state.contractStatus === 'sent' &&
                  this.checkValidLine(this.state.simInfo)
                ) {
                  return (
                    <div>
                      <p className="top-main_btn m-btn">
                        <a
                          className="a-btn-radius-plus"
                          href=""
                          onClick={(e) => this.goToLink(e, 'add')}
                        >
                          シェア回線を追加する
                        </a>
                      </p>
                      <p
                        className="top-main_link"
                        style={{ textAlign: 'center' }}
                      >
                        ※外部お申し込みページを開きます。
                      </p>
                    </div>
                  )
                } else if (
                  this.state.contractStatus !== 'sent' &&
                  !this.state.contractStatus.match(/^remove*/)
                ) {
                  return (
                    <div>
                      <p
                        className="top-main_link"
                        style={{ textAlign: 'center' }}
                      >
                        ※回線お申し込み中のため、シェア回線追加はできません。
                      </p>
                    </div>
                  )
                } else if (!this.checkValidLine(this.state.simInfo)) {
                  return (
                    <div>
                      <p
                        className="top-main_link"
                        style={{ textAlign: 'center' }}
                      >
                        ※シェア回線でお申し込み可能な回線数は【最大5回線】となります。
                      </p>
                    </div>
                  )
                }
              }
            })()}
          </div>
        </div>
      )
    }
  }

  returnSimKind(kind) {
    let simKind = ''
    switch (kind) {
      case '04':
        simKind = '音声'
        break
      case '02':
        simKind = 'SMS'
        break
      case '01':
        simKind = 'データ'
        break
      default:
        simKind = '音声'
        break
    }
    return simKind
  }
  returnActivateStatus(item) {
    let activateStatus = item.activateStatus
    let status = ''
    switch (activateStatus) {
      case 1:
        status = '未アクティベート'
        break
      case 2:
        status = 'アクティベート中'
        break
      case 3:
        status = 'アクティベート完了'
        break
      case 9:
        status = (
          <span>
            開通エラー
            <br />
            エラーコード：{this.returnErrorCode(item.err_code)}
          </span>
        )
        break
      default:
        status = '申し込み中'
        break
    }
    return status
  }
  returnErrorCode(code) {
    let link = (
      <a
        href=""
        onClick={(e) => {
          e.preventDefault()
          this.props.history.push('/guide/mnp')
        }}
        style={{ color: '#B50080' }}
      >
        {code || '----'}
      </a>
    )
    return link
  }
  returnShipmentStatus(item) {
    let status
    if (item.deliveryNumber) {
      let link = (
        <a
          className="a-primary"
          href={`https://jizen.kuronekoyamato.co.jp/jizen/servlet/crjz.b.NQ0010?id=${item.deliveryNumber}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {item.deliveryNumber}
        </a>
      )
      status = (
        <dd
          style={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ flex: '0.7 1 auto' }}>出荷済</div>
          <div style={{ flex: '1.3 1 auto' }}>
            荷物お問い合わせ番号
            <br />
            ヤマト運輸({link})
          </div>
        </dd>
      )
    } else if (item.activateStatus == '9') {
      status = (
        <dd style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>転入エラー</div>
        </dd>
      )
    } else {
      status = (
        <dd style={{ display: 'flex' }}>
          <div style={{ flex: '1 1 auto' }}>出荷待ち</div>
        </dd>
      )
    }
    return status
  }

  // シェアプラン判定
  isSharePlan() {
    // 現在契約中のプラン名に"シェア"の文字が含まれるかどうか
    return (
      this.state.customerInfo && this.state.customerInfo.sharePlanFlag === '1'
    )
  }

  // 一般契約判定
  isGeneralContract() {
    // gender
    // 1:男性 2:女性 3:法人
    return this.state.customerInfo.gender !== '3'
  }

  returnActivateDescrpition(item, activatingList) {
    // アクティベート可能判定（simType & 時間）
    // タイプ1D（ドコモ回線）タイプ1K（KDDI回線）共通 09:00～19:00
    let isActivating = activatingList && activatingList.length > 0
    let iccid = item.iccid
    let lineNumber = item.lineNumber
    if (!iccid || !lineNumber) {
      return null
    }
    let isType1K = true
    let regexp = /[A-Z]/gi
    if (iccid.substring(0, 1).match(regexp)) {
      // タイプ1D（ドコモ回線）
      isType1K = false
    }
    let isValidTime = false
    let now = moment()
    let startTime = moment({ hour: 9 })
    let endTime = moment({ hour: 19 })
    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      isValidTime = true
    }
    if (
      item.ondemandMnpStatus == '1' &&
      item.iccid &&
      item.activateStatus == 1 &&
      isActivating &&
      isValidTime
    ) {
      return (
        <p style={{ color: '#B50080', fontSize: '85%', margin: '0' }}>
          アクティベート待ち
        </p>
      )
    } else {
      return null
    }
  }

  returnActivateMassage(validList) {
    let item = validList.find((item) => {
      return (
        item.ondemandMnpStatus == '1' && item.iccid && item.activateStatus == 1
      )
    })
    if (!item) return null

    let iccid = item.iccid
    let lineNumber = item.lineNumber
    if (!iccid || !lineNumber) {
      return null
    }
    let isValidTime = false
    let now = moment()
    let startTime = moment({ hour: 9 })
    let endTime = moment({ hour: 19 })
    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      isValidTime = true
    }

    //月末はね、翌月のプラン変更がもう申し込めないので
    //翌々月のプラン変更になるのでOK
    //-1日は 2022/5/30

    //月末-1日 or -2日
    const today = moment()
    const twoDaysBeforeEndOfMonth = moment()
      .endOf('month')
      .subtract(2, 'days')
      .startOf('day')
    const beforeEndOfMonth = moment()
      .endOf('month')
      .subtract(1, 'days')
      .endOf('day')

    const showMsg =
      today.valueOf() > twoDaysBeforeEndOfMonth.valueOf() &&
      today.valueOf() < beforeEndOfMonth.valueOf()
        ? true
        : false

    let dayText = moment().isSame(beforeEndOfMonth, 'day')
      ? '月末前日'
      : '月末前々日'

    if (showMsg && isValidTime) {
      return (
        <p className="a-fs-sm" style={{ marginTop: '-0.5rem' }}>
          ※{dayText}
          のため、本日開通いただいた場合は本日中のプラン変更はお申し込みいただけません。
        </p>
      )
    } else {
      return null
    }
  }

  returnActivateButton(item, activatingList) {
    // アクティベート可能判定（simType & 時間）
    // タイプ1D（ドコモ回線）タイプ1K（KDDI回線）共通 09:00～19:00
    let isActivating = activatingList && activatingList.length > 0
    let iccid = item.iccid
    let lineNumber = item.lineNumber
    if (!iccid || !lineNumber) {
      return null
    }
    let isType1K = true
    let regexp = /[A-Z]/gi
    if (iccid.substring(0, 1).match(regexp)) {
      // タイプ1D（ドコモ回線）
      isType1K = false
    }
    let isValidTime = false
    let now = moment()
    let startTime = moment({ hour: 9 })
    let endTime = moment({ hour: 19 })
    if (now.isAfter(startTime) && now.isBefore(endTime)) {
      isValidTime = true
    }
    let isActivateLock = item.activate_lock_flag == 1

    if (item.ondemandMnpStatus == '1' && item.iccid) {
      if (item.activateStatus == 1) {
        if (!isValidTime) {
          return (
            <dd>
              <p style={{ color: '#B50080', margin: '0' }}>
                ただいまの時間は開通は行なえません。
                <br />
                受付時間：09:00-19:00
              </p>
            </dd>
          )
        } else {
          return (
            <dd>
              <button
                className={
                  'a-btn-change' +
                  (isActivating || isActivateLock ? ' disabled' : '')
                }
                disabled={isActivating || isActivateLock}
                onClick={(e) => {
                  e.preventDefault()
                  this.setState({ isType1K })
                  var dialogs_copy = [...this.state.dialogs]
                  dialogs_copy[0].title = 'SIMの開通'
                  var values = []
                  values[0] = {
                    text: (
                      <div>
                        <p>対象の回線を開通しますか？</p>
                        <p
                          className="a-link-attention"
                          style={{ fontweight: 'normal', fontSize: '80%' }}
                        >
                          <small>
                            開通作業が完了すると転入元のSIMは発信・通信を行うことができなくなります。
                          </small>
                        </p>
                        <p
                          className="a-link-attention"
                          style={{ fontweight: 'normal', fontSize: '80%' }}
                        >
                          <small>
                            お手元に対象のSIMが届いていることをご確認ください。
                          </small>
                        </p>
                        <p>回線番号：{item.lineNumber}</p>
                        <p
                          style={{
                            color: '#b50080',
                            fontweight: 'normal',
                            fontSize: '80%',
                          }}
                        >
                          <small>
                            開通・回線切替まで、通常30分〜1時間程度かかります。
                            <br />
                            ※処理状況により前後する場合がございます。
                          </small>
                        </p>
                      </div>
                    ),
                  }
                  dialogs_copy[0].values = values
                  dialogs_copy[0].state = true
                  this.setState({
                    lineNumber: item.lineNumber,
                    dialogs: dialogs_copy,
                  })
                }}
              >
                <b>開通する</b>
              </button>
            </dd>
          )
        }
      } else if (item.activateStatus == 3) {
        return <dd>----</dd>
      } else {
        return (
          <dd>
            <button
              className="a-btn-change disabled"
              disabled
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              <b>開通する</b>
            </button>
          </dd>
        )
      }
    } else if (item.ondemandMnpStatus == '0') {
      return <dd>----</dd>
    } else if (item.ondemandMnpStatus == '3') {
      return <dd>SIM発送待ち</dd>
    } else {
      return <dd>----</dd>
    }
  }

  returnProcessingLines() {
    let validList = this.state.lineList.filter((item) => {
      return item.activateStatus != '4'
    })
    if (validList.length === 0) {
      return null
    }

    return (
      <div>
        <div
          className="top-main top-main_activation"
          style={{
            width: 'auto',
            marginBottom: this.state.isMnpError ? '0' : '2rem',
          }}
        >
          <h2 className="top-main_ttl a-h3-ic a-h3-ic-sm">
            <span className="a-ic-sim" role="img" />
            処理中の回線
          </h2>

          <table className="list-contracts-table">
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="a-pc">
              <tr>
                <th>回線番号・ICCID</th>
                <th>種別</th>
                <th>ステータス</th>
                <th>出荷状態</th>
                <th>開通</th>
              </tr>
            </thead>
            <tbody>{this.items(validList)}</tbody>
          </table>
          {this.returnActivateMassage(validList)}
        </div>
      </div>
    )
  }

  returnLineList() {
    if (
      (this.state.contractStatus == 'beforeRegistration' &&
        this.state.warehouseStatus == 'cancel') ||
      (this.state.contractStatus == 'cancel' &&
        this.state.warehouseStatus == 'cancel')
    ) {
      // キャンセル表示
      return (
        <div>
          <div
            className="top-main top-main_activation"
            style={{
              width: 'auto',
              marginBottom: this.state.isMnpError ? '0' : '2rem',
              textAlign: 'center',
            }}
          >
            <h2 className="top-main_ttl">お申し込みがキャンセルされました。</h2>
            <div>申込書番号：{this.state.mvnoApplyNumber}</div>
          </div>
        </div>
      )
    } else if (
      this.state.contractStatus == 'verified' &&
      this.state.warehouseStatus == 'invalidCheckEC'
    ) {
      // 申し込み書修正表示
      // 申込書番号(mvnoApplyNumber) →修正へ
      return (
        <div
          className="m-box-important top-main"
          style={{ width: 'auto', marginBottom: '2rem' }}
        >
          <h5 className="m-box-important_label">重要</h5>
          <p className="a-link-attention">
            ※現在お申し込みいただいている内容に不備がありました。
            <br />
            <a
              href=""
              id="modal_customer"
              onClick={(e) => this.goToLink(e, 'modify')}
            >
              こちらのリンク
            </a>
            からお申し込みページを開いていただき、お申し込み内容の修正をお願いいたします。
          </p>
        </div>
      )
    } else {
      // 1: 未アクティベート / 2: アクティベート中 / 3: アクティベート完了 / 9: エラー
      // 回線申し込み情報表示
      // 申込回線一覧に未アクティベート(1)アクティベート中(2)のデータが1件も残っていない場合は申込回線一覧そのものを表示しない
      // ICCIDが空の場合は、「申込受付中」等を表示
      // アクティベートステータス(activateStatus)が4の回線は例外として表示しない
      let isNotActivated = this.state.lineList.filter((item) => {
        return item.activateStatus == '1' || item.activateStatus == null
      })
      let isActivating = this.state.lineList.filter((item) => {
        return item.activateStatus == '2'
      })
      // activateCompAtで判定
      let now = moment()
      let activateCompAfter2day = this.state.lineList.map((item) => {
        if (!item.activateCompAt) {
          return item.activateStatus == '4'
        } else {
          // 最終activateCompAtが2日以上前かを判定
          let activateCompAt = moment(item.activateCompAt)
          let after2Day = activateCompAt.add(2, 'day')
          return after2Day.isBefore(now)
        }
      })
      let isAfterComp2Day = activateCompAfter2day.indexOf(false) === -1
      if (!isAfterComp2Day) {
        return this.returnProcessingLines()
      } else if (isNotActivated.length === 0 && isActivating.length === 0) {
        return null
      } else {
        return this.returnProcessingLines()
      }
    }
  }

  items(data) {
    let activatingList = data.filter((item) => {
      return item.activateStatus == '2'
    })
    let trs = data.map((item, key) => {
      return (
        <tr key={key}>
          <td
            className="list-contracts-name arrow"
            style={{ textAlign: 'left' }}
          >
            <div className="name-contents">
              <div style={{ flex: '1' }}>
                <span className="a-sp">
                  回線電話：{item.lineNumber || '発行中'}
                  <br />
                </span>
                <span className="a-pc">
                  {item.lineNumber || '発行中'}
                  <br />
                </span>
                <small>ICCID：{item.iccid || '発行中'}</small>
              </div>

              <div className="a-sp right-contents">
                {this.returnActivateButton(item, activatingList)}
              </div>
            </div>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">種別：</dt>
              <dd>{this.returnSimKind(item.simKind)}</dd>
            </dl>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">ステータス：</dt>
              <dd style={{ color: '#B50080' }}>
                {this.returnActivateStatus(item)}
                {this.returnActivateDescrpition(item, activatingList)}
              </dd>
            </dl>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">出荷状態：</dt>
              {this.returnShipmentStatus(item)}
            </dl>
          </td>
          <td className="a-pc" style={{ paddingBottom: '1rem' }}>
            <dl className="m-operate_dl">
              <dt className="a-sp">開通：</dt>
              {this.returnActivateButton(item, activatingList)}
            </dl>
          </td>
        </tr>
      )
    })
    return trs
  }

  goToLink(e, type) {
    e.preventDefault()
    switch (type) {
      case 'add':
        if (this.state.mailAddress === '') {
          // メールアドレス登録してください
          $('.t-modal').addClass('is-active')
          $('.t-modal_content').addClass('is-active')
          let vh = $(window).height()
          let ch = $('#modal_mail').height()
          let top = (vh - ch) / 2
          $('.t-modal_content').css('top', top).css('position', 'fixed')
        } else {
          window.open('/register/add/agreement')
        }
        break
      case 'modify':
        if (this.state.isAddressError) {
          window.open(
            `/register/modify/step2?applyNumber=${this.state.mvnoApplyNumber}&type=isAddressError`
          )
        } else {
          window.open(
            `/register/modify/step1?applyNumber=${this.state.mvnoApplyNumber}`
          )
        }
        break
      default:
        window.open('/register/add/agreement')
        break
    }
  }

  slidingButton(key) {
    $('#sliding_' + key).slideToggle()
    if ($('#sliding_btn_' + key).hasClass('is-active') === true) {
      $('#sliding_btn_' + key).removeClass('is-active')
      this.setState({ detailsBtnText: '詳細' })
    } else {
      $('#sliding_btn_' + key).addClass('is-active')
      this.setState({ detailsBtnText: '閉じる' })
    }
  }
  // dataFreeAddBroughtSize1~3
  renderdataFreeAddBroughtSize(index) {
    if (
      this.state[`dataFreeAddBroughtSize${index}`] &&
      parseFloat(this.state[`dataFreeAddBroughtSize${index}`].GB) > 0
    ) {
      return (
        <div>
          {this.dataFixingHandler('dataFreeAddBroughtSize', 0, index)}
          <span className="a-fw-normal a-fs-sm a-fs-pc-14">
            （期限：{this.state[`dataFreeAddBroughtSize${index}`].broughtDate}）
          </span>
        </div>
      )
    }
    return null
  }
  // 翌月以降詳細
  renderFreeAddBroughtsDetail() {
    let total = 0
    for (var i = 1; i < 4; i++) {
      if (this.state[`dataFreeAddBroughtSize${i}`]) {
        total = total + parseFloat(this.state[`dataFreeAddBroughtSize${i}`].GB)
      }
    }
    let details = (
      <div
        className="m-charge_item"
        style={{ border: 'none', marginTop: '.9rem' }}
      >
        {this.dataFixingHandler('dataFreeAddBroughtSizeOver3Month', 0, 0)}
        <span className="a-fw-normal a-fs-sm a-fs-pc-14">
          （期限：翌月以降）
        </span>
        {(() => {
          if (total > 0) {
            return (
              <button
                type="button"
                data-accordion-target="a"
                onClick={() => this.slidingButton(1)}
                id="sliding_btn_1"
                style={{
                  color: '#B50080',
                  display: 'block',
                  fontSize: '1.4rem',
                  fontWeight: 'normal',
                  marginTop: '.9rem',
                  paddingRight: '.9rem',
                  textAlign: 'right',
                  textDecoration: 'underline',
                  width: '100%',
                }}
              >
                <span>{this.state.detailsBtnText}</span>
              </button>
            )
          }
        })()}
        <div className="m-charge_body-accordion" id="sliding_1">
          {this.renderdataFreeAddBroughtSize(1)}
          {this.renderdataFreeAddBroughtSize(2)}
          {this.renderdataFreeAddBroughtSize(3)}
        </div>
      </div>
    )
    return details
  }

  renderPaymentError() {
    // errorCode
    // 0000:正常、2003:有効期限切れ、左記以外:決済エラー（2000など）
    // unchangeableCreditCard
    // 0:変更可／1:変更不可
    if (
      this.props.paymentError.errorCode !== '0000' &&
      this.props.paymentError.unchangeableCreditCard == '0'
    ) {
      let message = ''
      if (this.props.paymentError.errorCode === '2003') {
        message =
          'ご登録のお支払い方法の有効期限が切れました。こちらのページから更新をお願いいたします。'
      } else {
        message =
          'お支払いの決済が失敗しました。こちらのページから更新をお願いいたします。'
      }
      return (
        <div className="top-notice">
          <div className="top-notice_inner">
            <a
              className="a-link-attention"
              href=""
              onClick={(e) => this.goNextDisplay(e, '/mypage/payment/change')}
            >
              {message}
            </a>
          </div>
        </div>
      )
    }
    return null
  }

  isZeroPlan() {
    return this.props.iotPlans.zeroPlans.indexOf(this.state.planId) !== -1
  }

  //解約チェック
  // status 0 契約中（デフォルト）  1 解約済み  2 解約済み(MNP解約手続き中の回線)  3 解約手続き中  4 解約手続き中(解約当月の場合)
  checkCancellation(
    removeDate = '',
    cancelDate = '',
    simType,
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
          return {
            operation_type1: false,
            operation_type2: false,
            msg: '解約済み ',
            status: 5,
          }
        }
        //解約予約済(解約当月の場合)	removeDateが当月で空でない
        return {
          operation_type1: true,
          operation_type2: false,
          msg: '解約申込済',
          status: 4,
        }
      } else {
        //解約済み removeDateが当月でなくて空でない
        return {
          operation_type1: false,
          operation_type2: false,
          msg: '解約済み',
          status: 1,
        }
      }
    } else if (cancelDate != '' && (simType == '1' || simType == '4')) {
      //解約済み(MNP解約手続き中の回線)	simTypeが1 or 4で、removeDateが空、cancelDateがあり
      return {
        operation_type1: false,
        operation_type2: false,
        msg: '解約手続き中',
        status: 2,
      }
    } else if (cancelRequestDate != '') {
      //解約手続き中	cancelRequestDateが空でなくてremoveDateが空
      return {
        operation_type1: true,
        operation_type2: false,
        msg: '解約手続き中',
        status: 3,
      }
    } else {
      // 契約中
      return {
        operation_type1: true,
        operation_type2: true,
        msg: '',
        status: 0,
      }
    }
  }

  //契約用の文言取得
  getContractCapacityText() {
    let cancelRequestDate = this.state.customerInfo.cancelRequestDate
    let sims = this.state.simInfo.some((item) => {
      if (
        item.removeDate &&
        item.removeDate == '' &&
        item.cancelRequestDate &&
        item.cancelRequestDate != ''
      ) {
        return true
      } else {
        return false
      }
    })
    if (this.state.all_line_cancellation) {
      //解約済み
      return '解約済'
    } else if ((cancelRequestDate && cancelRequestDate != '') || sims) {
      //解約手続き中
      return (
        <React.Fragment>
          <span className="a-disabled" style={{ paddingRight: '10px' }}>
            解約手続き中
          </span>
          <span>{this.dataFixingHandler('dataPlanSize', 0, 0) + '／月'}</span>
        </React.Fragment>
      )
    } else {
      //通常
      return this.dataFixingHandler('dataPlanSize', 0, 0) + '／月'
    }
  }

  //有効回線チェック
  //ボタン表示
  //契約中回線1回線以上で契約回線4回線以下
  //当月解約 + 契約中 合計が4回線以下

  //ボタン非表示
  //当月解約5回線
  //契約中回線が0回線

  // return true  シェア追加可能 false シェア追加不可

  checkValidLine(sims) {
    //解約してない5回線だったらに変えないといけない

    //・契約中の回線が5回線未満
    //→ 解約チェック status の０が５回線未満
    //かつ
    //・契約中+当月解約回線（MNP解約以外、申し込み時点で利用可能な状態）の合計が10回線未満
    //→ 解約チェック status の０と４と３の合計が10回線未満
    //↑は&&条件、両方達成してたらボタンを表示する
    /*
      0	契約中（デフォルト）	removeDateもcancelRequestDateもcancelDateも空
      1	解約済み 	removeDateが当月でなくて空でない
      5	解約済み MNPポートアウト（月中解約済）	removeDateが当月でcancelDateが月末でない
      4	解約予約済(解約当月の場合)	removeDateが当月で空でない
      2	解約済み(MNP解約手続き中の回線)	simTypeが1 or 4で、removeDateが空、cancelDateがあり
      3	解約手続き中	cancelRequestDateが空でなくてremoveDateが空
    */

    let count = 0
    let removeCount = 0
    let thisMonthRemoveCount = 0
    for (var i = 0; i < sims.length; i++) {
      switch (
        this.checkCancellation(
          sims[i].removeDate,
          sims[i].cancelDate,
          sims[i].simType,
          sims[i].cancelRequestDate
        ).status
      ) {
        case 5:
        case 2:
        case 1:
          //status: 1,
          //status: 2,
          //status: 5,
          removeCount++
          break
        case 4:
        case 3:
          //status: 4,
          //status: 3,
          thisMonthRemoveCount++
          break
        default:
          //status: 0,
          count++
          break
      }
    }
    //契約中回線が一つもない、もしくは５回線以上あればシェア追加ボタンはださない
    if (count <= 0 || count >= 5) {
      return false
    }

    //契約中+当月解約回線（MNP解約以外、申し込み時点で利用可能な状態）の合計が10回線未満
    if (count < 5 && thisMonthRemoveCount > 0) {
      return count + thisMonthRemoveCount < 10
    }

    //removedateを含めないsimの数
    return count < 5
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

        //３年学割の終了月かどうか判定を行う
        const today = moment()
        const clone = moment(today)

        //月末2日前の19時から月末までは、当月+1月に終わるプランかどうかでみる必要がある
        //月末2日前の19時から月末になったら、次の月扱いで参照すればいいかな
        //今月だったら1月30日の19時以降は2月扱いになる
        //3年学割の画面表示については、月末-1日の19時

        //月末
        let lastDay = clone
          .endOf('month')
          .subtract(1, 'days')
          .startOf('date')
          .hour(18)
        let referenceMonth = moment(today)
        if (today.isAfter(lastDay, 'hour')) {
          referenceMonth = referenceMonth.add(1, 'month')
        }

        const planId = this.state.planId
        let SubjectData

        //JSONから現在月を絞る
        for (var key in json) {
          var expireAt = moment(key, 'YYYYMM')
          if (referenceMonth.isSame(expireAt, 'month')) {
            SubjectData = json[key]
            break
          }
        }

        //データなければ終了
        if (!SubjectData || SubjectData.length <= 0) return

        //月のデータから対象のプランIDがあるかどうか
        //対象日の学割情報
        if (
          SubjectData.some((item) => {
            return item.originalPlanID == planId
          })
        ) {
          //対象IDがあれば表示
          this.setState({ studentDiscountEnds: true })
        }
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  //解約新規用JSON 取得
  checkcancellationNewFunc() {
    fetch(
      `${Const.CONNECT_TYPE_CANCELLATION_NEW_IDS}?v=${this.getTimestamp()}`, //TODO JSON差し替え
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

        //データなければ終了
        if (!json.oldCustomerIds || json.oldCustomerIds.length <= 0) return

        //id チェック
        const nowId = window.customerId
        if (
          json.oldCustomerIds.some((id) => {
            return id == nowId
          })
        ) {
          //対象IDがあれば表示
          this.setState({ cancellationNewPopUp: true })
        }
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  //解約新規ポップアップ閉じるボタン
  closeCheckcancellationModal() {
    this.setState({ cancellationNewPopUp: false })
  }

  //解約情報をローカルストレージにセット
  setLocalStorageRemoveLine(lineInfo) {
    var { customerInfo, lineInfoNum } = this.state

    let l_Corp = lineInfo.length > 1 ? '1' : '0'
    localStorage.setItem('l_Corp', l_Corp)

    //解約回線がある
    //解約済    removeDate != ''
    //回線解約中 removeDate = '' and  sim.SimCancelRequestDate != ''
    //         removeDate = '' and  agreement.customerInfo.cancelRequestDate != ''
    //契約解約中 removeDate = '' and  sim.ContractCancelRequestDate != ''
    //         removeDate = '' and  agreement.lineInfo.simInfo.cancelRequestDate!= ''

    //[this.state.lineInfoNum].simInfo

    const simInfo = lineInfo[lineInfoNum].simInfo
    let cancelContract = '0'

    for (var i = 0; i < simInfo.length; i++) {
      var _siminfo = simInfo[i]
      if (_siminfo.removeDate == '') {
        if (
          customerInfo.cancelRequestDate != '' ||
          _siminfo.cancelRequestDate != ''
        ) {
          cancelContract = '1'
          break
        }
      }
    }
    localStorage.setItem('cancelContract', cancelContract)
  }

  render() {
    if (
      this.props.isExistStatus('get') &&
      !this.state.loading_state_extra &&
      !this.state.loading_state_top &&
      this.state.mailAddress === '' &&
      !this.state.changeMailHistory
    ) {
      this.notLoggedMessage = (
        <div className="top-notice_inner">
          <a
            className="a-link-attention"
            href=""
            // id= "modal_mail" onClick={()=>this.oneTimePopUp()}
            onClick={(e) => this.goNextDisplay(e, '/mail/')}
          >
            メールアドレスが登録されていません
          </a>
        </div>
      )
    } else {
      this.notLoggedMessage = ''
    }

    // MAPPING noticeArray
    this.noticeArray = this.state.noticeArray.map((item, key) => (
      <li className="m-news_item" key={'m-news_item' + key}>
        <a
          className="m-news_link"
          href=""
          onClick={(e) => this.goNextDisplay(e, '/mypage/news/detail/', item)}
        >
          <time className="m-news_time" dateTime="2018-09-27">
            {item.date}
          </time>
          <div className="m-news_excerpt">{item.title}</div>
        </a>
      </li>
    ))

    // MAPPING bannerArray
    this.bannerArray = this.state.bannerArray.map((item, key) => (
      <div className="top-main_slider_item" key={'top-main_slider_item' + key}>
        <a
          href={item.linkUrl}
          target={item.newWinFlg === 1 ? '_blank' : '_self'}
        >
          <img src={item.imageUrl} alt={item.alt} />
        </a>
      </div>
    ))

    // MAPPING simInfo
    this.simInfo = this.state.simInfo.map((item, key) => (
      <tr key={'simInfo_' + key}>
        <th>
          <dl className="top-main_sim_card">
            <dt>{item.nickName}</dt>
            <dd>
              <span className="m-btn">
                <a
                  className="a-btn-sim"
                  href=""
                  onClick={(e) =>
                    this.goNextDisplay(
                      e,
                      '/mypage/sim/',
                      this.state.lineInfo[this.state.lineInfoNum],
                      item.lineNo
                    )
                  }
                >
                  {item.lineNo}
                </a>
              </span>
            </dd>
          </dl>
        </th>
        <td style={{ minWidth: '300px' }}>
          <dl className="top-main_sim_data">
            <dt>
              {this.checkCancellation(
                item.removeDate,
                item.cancelDate,
                item.simType,
                item.cancelRequestDate
              ).operation_type1
                ? '高速データ通信：'
                : ''}
            </dt>
            <dd className="textarea">
              <span className="a-primary a-fw-bold a-fs-lg">
                {this.checkCancellation(
                  item.removeDate,
                  item.cancelDate,
                  item.simType,
                  item.cancelRequestDate
                ).operation_type1 ? (
                  item.highSpeedDataStatus == 0 ? (
                    <span className="a-disabled">低速通信中</span>
                  ) : (
                    '高速通信中'
                  )
                ) : (
                  <span className="a-disabled a-fs-md">
                    {
                      this.checkCancellation(
                        item.removeDate,
                        item.cancelDate,
                        item.simType,
                        item.cancelRequestDate
                      ).msg
                    }
                  </span>
                )}
              </span>
            </dd>
            <dd>
              <span className="m-btn">
                <a
                  className={
                    'sim-btn a-btn-link ' +
                    (!this.checkCancellation(
                      item.removeDate,
                      item.cancelDate,
                      item.simType,
                      item.cancelRequestDate
                    ).operation_type1 && 'a-disabled')
                  }
                  href=""
                  onClick={(e) => {
                    if (
                      this.checkCancellation(
                        item.removeDate,
                        item.cancelDate,
                        item.simType,
                        item.cancelRequestDate
                      ).operation_type1
                    ) {
                      this.goNextDisplay(
                        e,
                        '/mypage/speed/change/',
                        this.state.lineInfo[this.state.lineInfoNum],
                        item.lineNo
                      )
                    } else {
                      e.preventDefault()
                      return false
                    }
                  }}
                >
                  速度変更
                </a>
              </span>
            </dd>
          </dl>
          {(() => {
            if (
              this.checkCancellation(
                item.removeDate,
                item.cancelDate,
                item.simType,
                item.cancelRequestDate
              ).operation_type1
            ) {
              return (
                <dl className="top-main_sim_data top_communication_data">
                  <dt>5G通信：</dt>
                  <dd className="textarea">
                    <span className="a-primary a-fw-bold a-fs-lg textarea">
                      {item.sim5gStatus == '1' ? (
                        'ON'
                      ) : (
                        <span className="a-disabled">OFF</span>
                      )}
                    </span>
                  </dd>
                  <dd>
                    <span className="m-btn">
                      <a
                        className={'a-btn-link sim-btn'}
                        href=""
                        onClick={(e) => {
                          this.goNextDisplay(
                            e,
                            '/mypage/communication/change/',
                            this.state.lineInfo[this.state.lineInfoNum],
                            item.lineNo
                          )
                        }}
                      >
                        変更
                      </a>
                    </span>
                  </dd>
                </dl>
              )
            }
          })()}
        </td>
      </tr>
    ))

    // MAPPING importantNoticeArray
    if (this.state.importantNoticeArray.length > 0) {
      $('#notice-hide').show()
      this.importantNoticeArray = this.state.importantNoticeArray.map(
        (item, key) => (
          <div
            className="top-important_list_item"
            key={'importantNoticeArray_' + item}
          >
            <a
              className="a-link a-link-chevron"
              href=""
              onClick={(e) =>
                this.goNextDisplay(e, '/mypage/news/detail/', item)
              }
              style={{ transform: 'translateZ(0)' }}
            >
              {item.title}
            </a>
          </div>
        )
      )
    } else {
      $('#notice-hide').hide()
      // $("#notice-hide").css("display", "none");
    }

    if (this.state.banner_space) {
      $('#top_main_space_remover').css('marginBottom', '3.5rem')
    } else {
      $('#top_main_space_remover').css('marginBottom', '0')
    }

    // DISPLAY THE PIE CHART IF DATA AVAILABLE
    this.getPieChart01 = () => {
      return (
        <Doughnut
          data={this.state.chartData01}
          options={this.state.options01}
          className="donghnut"
        />
      )
    }
    this.getPieChart02 = () => {
      return (
        <Doughnut
          data={this.state.chartData02}
          options={this.state.options02}
          className="donghnut"
        />
      )
    }

    let isBannerDisplayed = true
    // if (this.state.contractStatus == 'beforeRegistration' && this.state.warehouseStatus == 'cancel') {
    //   isBannerDisplayed = false
    // } else if (!this.state.lineList.length) {
    //   isBannerDisplayed = false
    // }

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
              setCampaignPopUp={this.setCampaignPopUp}
              {...this.state.url_data[0]}
            />
            <main className="t-main">
              <div className="t-container">
                <div className="top-important" id="notice-hide">
                  <div className="top-important_inner">
                    <h2 className="top-important_label">重要</h2>
                    <Slider {...this.state.settings}>
                      {this.importantNoticeArray}
                    </Slider>
                  </div>
                </div>
                {this.renderPaymentError()}
                <div className="top-notice">{this.notLoggedMessage}</div>
                {this.returnLineList()}
                {(() => {
                  if (this.state.isMnpError) {
                    return (
                      <p
                        className="top-main top-main_activation"
                        style={{
                          display: 'block',
                          marginBottom: '2rem',
                          paddingTop: '0',
                          width: 'auto',
                        }}
                      >
                        お申し込みの回線内にMNP転入に失敗した回線がありました。詳しくは
                        <span>{this.returnErrorCode('こちら')}</span>
                      </p>
                    )
                  }
                })()}
                <div className="top-main">
                  <div
                    className="top-main_banner"
                    style={{ display: isBannerDisplayed ? 'block' : 'none' }}
                  >
                    <Slider {...this.state.banner_settings}>
                      {this.bannerArray}
                    </Slider>
                  </div>
                  {this.state.lineInfo.length > 1 ? (
                    <div className="top-main_select">
                      <select
                        className="a-select-default"
                        onChange={this.onChangeSelectValue.bind(this)}
                        value={this.state.lineInfoNum}
                      >
                        {this.state.lineInfo.map((m, i) => {
                          return (
                            <option value={i} key={'option_' + i}>
                              {this.state.lineInfo.length === 1
                                ? '契約'
                                : '契約' + (i + 1)}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  ) : null}

                  {(() => {
                    if (this.state.studentDiscountEnds) {
                      return (
                        <div
                          className="top-main_info_data a-mb-40"
                          style={{ flex: '1 0 auto' }}
                        >
                          <div className="m-box-important m-box-bg">
                            <h2 className="a-h3-line" style={{}}>
                              重要なお知らせ
                            </h2>
                            <p className="a-fs-md">
                              3年学割の対象期間が今月末をもって終了致します。
                              <a
                                className="a-link"
                                href=""
                                onClick={(e) => {
                                  let cancelRequestDate = this.state
                                    .customerInfo.cancelRequestDate
                                  if (
                                    cancelRequestDate &&
                                    cancelRequestDate != ''
                                  ) {
                                    e.preventDefault()
                                    this.callbackDialog(
                                      Const.EVENT_CLICK_BUTTON,
                                      'dialog_cancelRequestDate',
                                      ''
                                    )
                                  } else {
                                    this.goNextDisplay(
                                      e,
                                      '/mypage/plan/',
                                      this.state.lineInfo[
                                        this.state.lineInfoNum
                                      ]
                                    )
                                  }
                                }}
                              >
                                詳細はこちら
                              </a>
                              をご確認ください。
                            </p>
                          </div>
                        </div>
                      )
                    }
                  })()}

                  {this.returnTopMainInfo()}
                </div>
              </div>
              <div className="t-container-bg">
                <div className="top-aside">
                  <div className="top-aside_header">
                    <h2 className="top-aside_ttl">お知らせ</h2>
                    <p className="m-btn">
                      <a
                        className="a-btn-link a-btn-link-sm"
                        href=""
                        onClick={(e) => this.goNextDisplay(e, '/mypage/news/')}
                      >
                        一覧へ
                      </a>
                    </p>
                  </div>
                  {(() => {
                    if (this.state.noticeArray.length > 0) {
                      return (
                        <div className="top-aside_body">
                          <div className="top-aside_inner">
                            <div className="top-aside_news m-news">
                              <ul className="m-news_list">
                                {this.noticeArray}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="top-aside_body">
                          <div className="t-inner_full">
                            <div className="m-news">
                              <p className="m-news_message">
                                お知らせはありません。
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })()}
                  <div className="top-aside_header">
                    <h2 className="top-aside_ttl">おススメオプション</h2>
                    <p className="m-btn">
                      <a
                        className="a-btn-link a-btn-link-sm"
                        href=""
                        onClick={(e) =>
                          this.goNextDisplay(
                            e,
                            '/mypage/option/',
                            this.state.lineInfo[this.state.lineInfoNum]
                          )
                        }
                      >
                        一覧へ
                      </a>
                    </p>
                  </div>
                  <div className="top-aside_body">
                    <div className="top-aside_inner">
                      <h3 className="a-h3 a-fw-normal">アプリ</h3>
                      <div className="top-aside_option">
                        <div
                          className="m-media"
                          style={{ width: 'auto', flex: 1 }}
                        >
                          <div className="m-media_pic">
                            <a
                              href="https://aeonmobile.jp/plan/aeondenwa/"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <img src={ic_app_denwa} alt="" />
                            </a>
                          </div>
                          <div className="m-media_body">
                            <h4 className="a-h3 a-fs-pc-18 a-mb-5">
                              イオンでんわ
                            </h4>
                            <p className="a-weak">
                              イオンモバイル公式アプリ「イオンでんわ」を利用することで、国内通話が一律税込11円/30秒でご利用いただけます。
                              <br />
                              また、イオンでんわで発信可能な指定の「国際通話サービス提供国・地域」に限り、30秒につき10円（非課税）でご利用いただけます。
                            </p>
                            <div className="m-media_full">
                              <div className="m-box-important">
                                <h5 className="m-box-important_label">重要</h5>
                                <p>
                                  タイプ１au回線にて、「イオンでんわ5分かけ放題」「イオンでんわ10分かけ放題」「やさしい10分かけ放題」をご契約中のお客さまは「イオンでんわ」を利用して音声通話を発信してください。
                                  <br />
                                  標準の通話アプリを利用して発信された場合、通常の通話料金が請求されます。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="m-media"
                          style={{ width: 'auto', flex: 1 }}
                        >
                          <div className="m-media_pic">
                            <a
                              href="https://aeonmobile.jp/plan/data-switch-app/"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <img src={ic_app_switch} alt="" />
                            </a>
                          </div>
                          <div className="m-media_body">
                            <h4 className="a-h3 a-fs-pc-18 a-mb-5">
                              イオンモバイル速度切り替え
                            </h4>
                            <p className="a-weak">
                              マイページへのログイン不要で、簡単に高速通信のON/OFFが可能！
                              <br />
                              「イオンモバイル速度切り替え」を利用することで、簡単に通信速度の高速・低速を切り替えることが可能です！
                            </p>
                          </div>
                        </div>
                      </div>
                      <h3 className="a-h3 a-fw-normal">オプション</h3>
                      <div className="top-aside_option">
                        <div className="m-media">
                          <div className="m-media_pic">
                            <img src={ic_option_houdai} alt="" />
                          </div>
                          <div className="m-media_body">
                            <h4 className="a-h3 a-fs-pc-18 a-mb-5">
                              アプリ超ホーダイ
                            </h4>
                            <p className="a-weak">
                              人気アプリが月額固定で使い放題のサービスです。
                            </p>
                          </div>
                        </div>
                        <div className="m-media">
                          <div className="m-media_pic">
                            <img src={ic_option_child} alt="" />
                          </div>
                          <div className="m-media_body">
                            <h4 className="a-h3 a-fs-pc-18 a-mb-5">
                              子どもパック
                            </h4>
                            <p className="a-weak">
                              お子様がスマホを安全に使うためのアプリに加え、人気の学習アプリをセットに
                            </p>
                          </div>
                        </div>
                        <div className="m-media">
                          <div className="m-media_pic">
                            <img src={ic_option_ifilter} alt="" />
                          </div>
                          <div className="m-media_body">
                            <h4 className="a-h3 a-fs-pc-18 a-mb-5">
                              Iフィルター
                            </h4>
                            <p className="a-weak">
                              有害サイトフィルタリングソフト
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <footer className="t-footer">
              <div className="t-footer_aside">
                <ul className="t-footer_help">
                  {/* <li className="t-footer_help_item">
                    <a className="t-footer_help_link" href="" onClick={(e)=>this.goNextDisplay(e,"/mypage/payment/", (this.state.lineInfo[this.state.lineInfoNum]))}>
                      お支払い方法
                    </a>
                  </li> */}
                  <li className="t-footer_help_item">
                    <a
                      className="t-footer_help_link"
                      href=""
                      onClick={(e) =>
                        this.goNextDisplay(
                          e,
                          '/mypage/operate/',
                          this.state.lineInfo[this.state.lineInfoNum]
                        )
                      }
                    >
                      マイページ操作履歴
                    </a>
                  </li>
                  <li className="t-footer_help_item">
                    <a
                      className="t-footer_help_link"
                      href=""
                      onClick={(e) =>
                        this.goNextDisplay(
                          e,
                          '/guide/',
                          this.state.lineInfo[this.state.lineInfoNum]
                        )
                      }
                    >
                      マイページご利用方法
                    </a>
                  </li>
                </ul>
                <div className="t-footer_nav">
                  <div className="t-footer_nav_item">
                    <div className="t-footer_nav_header">
                      <h2 className="a-h2 a-fs-pc-18">AEON MOBILEのSNS</h2>
                    </div>
                    <div className="t-footer_nav_body">
                      <p className="m-btn">
                        <a
                          className="a-btn-facebook"
                          href="https://www.facebook.com/aeonmb/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span
                            className="a-ic-facebook-fill"
                            aria-label="Facebook"
                            role="img"
                          />
                          Facebook
                        </a>
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn-twitter"
                          href="https://twitter.com/AEON_MOBILE"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span
                            className="a-ic-twitter"
                            aria-label="Twitter"
                            role="img"
                          />
                          Twitter
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="t-footer_nav_item">
                    <div className="t-footer_nav_header">
                      <h2 className="a-h2 a-fs-pc-18">AEON MOBILE公式サイト</h2>
                    </div>
                    <div className="t-footer_nav_body">
                      <p className="m-btn">
                        <a
                          className="a-btn-official"
                          href="https://aeonmobile.jp/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img src={logoImage} alt="AEON MOBILE公式サイト" />
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="t-footer_nav_item">
                    <div className="t-footer_nav_header">
                      <h2 className="a-h2 a-fs-pc-18">お問い合わせ</h2>
                    </div>
                    <div className="t-footer_nav_body">
                      <p className="m-btn">
                        <a
                          className="a-btn-radius-arrow"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/contact/')}
                        >
                          各種お問い合わせは
                          <wbr />
                          こちら
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                className={`t-modal_content ${
                  this.state.campaignPopUp ||
                  this.state.maintenancePopUp ||
                  this.state.shokaiPopUp ||
                  this.state.newPlanPopUp ||
                  this.state.limitedCampaignPopUp ||
                  this.state.limitedQuestionnairePt2PopUp ||
                  this.state.limitedQuestionnairePopUp ||
                  this.state.limitedNetsuperPopUp ||
                  this.state.limitedNetsuperPopUp_2
                    ? 'campaign'
                    : ''
                }`}
                id="modal_mail"
              >
                <div className="m-modal">
                  <div className="m-modal_inner">
                    {(() => {
                      if (this.state.campaignPopUp) {
                        return (
                          <div className="m-modal_attention waonCampaign">
                            <h2
                              className="a-h3"
                              style={{ textAlign: 'center' }}
                            >
                              ご利用可能なクーポン・特典があります。
                              <br />
                              ご確認ください。
                            </h2>
                          </div>
                        )
                      } else if (this.state.maintenancePopUp) {
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://aeonmobile.jp/smartphone_maintenance/',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={`${maintenanceImg_pc}?v=${this.getTimestamp()}`}
                                alt=""
                                style={{ marginBottom: '1em' }}
                                className="a-pc"
                              />
                              <img
                                src={`${maintenanceImg_sp}?v=${this.getTimestamp()}`}
                                alt=""
                                style={{ marginBottom: '1em' }}
                                className="a-sp"
                              />
                            </a>
                          </div>
                        )
                      } else if (this.state.shokaiPopUp) {
                        return (
                          <div className="">
                            <img
                              src={`${shokaiCpImg}?v=${this.getTimestamp()}`}
                              alt=""
                              style={{ marginBottom: '1em' }}
                            />
                            <h2
                              className="a-h3"
                              style={{ textAlign: 'center' }}
                            >
                              紹介トクキャンペーン開催中!!
                            </h2>
                          </div>
                        )
                      } else if (this.state.newPlanPopUp) {
                        return (
                          <div>
                            <a
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://aeonmobile.jp/amlp/news_20210812_release/',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <picture>
                                <source
                                  media="(max-width:601px)"
                                  srcSet={newPlanImgSp}
                                ></source>
                                <img
                                  src={`${newPlanImgPc}?v=${this.getTimestamp()}`}
                                  srcSet={`${newPlanImgPc}?v=${this.getTimestamp()}`}
                                  alt=""
                                  style={{ marginBottom: '1em' }}
                                />
                              </picture>
                            </a>
                          </div>
                        )
                      } else if (this.state.limitedCampaignPopUp) {
                        let day = localStorage.getItem('qc')
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  day == 'day1'
                                    ? 'https://aeonmobile.jp/campaign/virtualcinema_01/'
                                    : 'https://aeonmobile.jp/campaign/virtualcinema_01/',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={`${
                                  day == 'day1'
                                    ? limitedCampaignImgDay1
                                    : limitedCampaignImgDay2
                                }`}
                                alt=""
                                style={{ marginBottom: '1em' }}
                              />
                            </a>
                          </div>
                        )
                      } else if (this.state.limitedQuestionnairePt2PopUp) {
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://mmdlabo.post-survey.com/aeonmobileke/',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={`${limitedQuestionnairePt2PcImg}?v=${this.getTimestamp()}`}
                                alt=""
                                style={{ marginBottom: '1em' }}
                                className="a-pc"
                              />
                              <img
                                src={`${limitedQuestionnairePt2SpImg}?v=${this.getTimestamp()}`}
                                alt=""
                                style={{ marginBottom: '1em' }}
                                className="a-sp"
                              />
                            </a>
                          </div>
                        )
                      } else if (this.state.limitedQuestionnairePopUp) {
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://aeonretail.com/item/4550454931338/?utm_source=aeon_mobile&utm_medium=referral&utm_campaign=mobile_top_mypage_H7vP6',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={limitedQuestionnaireImg}
                                alt=""
                                style={{ marginBottom: '1em' }}
                              />
                            </a>
                          </div>
                        )
                      } else if (this.state.limitedNetsuperPopUp) {
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://shop.aeon.com/netsuper/aeonmobile_coupon2',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={limitedNetsuperImg}
                                alt=""
                                style={{ marginBottom: '1em', width: '100%' }}
                              />
                            </a>
                          </div>
                        )
                      } else if (this.state.limitedNetsuperPopUp_2) {
                        return (
                          <div className="">
                            <a
                              className=""
                              href=""
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.preventDefault()
                                var win = window.open(
                                  'https://shop.aeon.com/netsuper/aeonmobile_coupon2?utm_source=aeonmobile&utm_medium=referral&utm_campaign=referral_akn5Rhxx',
                                  '_blank'
                                )
                                win.focus()
                              }}
                            >
                              <img
                                src={limitedNetsuperImg_2}
                                alt=""
                                style={{ marginBottom: '1em', width: '100%' }}
                              />
                            </a>
                          </div>
                        )
                      } else {
                        return (
                          <div className="m-modal_attention">
                            <h2 className="a-h3">
                              現在メールアドレスが登録されていません。
                              <br />
                              まずはメールアドレスをご登録してください。
                            </h2>
                          </div>
                        )
                      }
                    })()}
                    <div
                      className={`m-modal_btngroup ${
                        this.state.maintenancePopUp ||
                        this.state.limitedCampaignPopUp ||
                        this.state.limitedQuestionnairePt2PopUp ||
                        this.state.limitedQuestionnairePopUp ||
                        this.state.limitedNetsuperPopUp ||
                        this.state.limitedNetsuperPopUp_2
                          ? 'limitedCampaignPopUp'
                          : ''
                      }`}
                    >
                      <div
                        className="m-modal_btngroup_item m-btn"
                        id="CloseDialog"
                      >
                        <button
                          className="a-btn-dismiss a-btn-icon-none"
                          type="button"
                        >
                          閉じる
                        </button>
                      </div>
                      {(() => {
                        if (this.state.campaignPopUp) {
                          return (
                            <div className="m-modal_btngroup_item m-btn">
                              <a
                                className="a-btn-submit a-btn-icon-none"
                                href=""
                                onClick={(e) => {
                                  this.goNextDisplay(
                                    e,
                                    '/mypage/campaign/',
                                    this.state.url_data[0].pass_data
                                  )
                                }}
                              >
                                確認する
                              </a>
                            </div>
                          )
                        } else if (this.state.shokaiPopUp) {
                          return (
                            <div className="m-modal_btngroup_item m-btn">
                              <a
                                className="a-btn-submit a-btn-icon-none"
                                href=""
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.preventDefault()
                                  var win = window.open(
                                    'https://aeonmobile.jp/campaign/shokai/',
                                    '_blank'
                                  )
                                  win.focus()
                                }}
                              >
                                詳しくはこちら
                              </a>
                            </div>
                          )
                        } else if (this.state.newPlanPopUp) {
                          return (
                            <div className="m-modal_btngroup_item m-btn">
                              <a
                                className="a-btn-submit a-btn-icon-none"
                                href=""
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.preventDefault()
                                  var win = window.open(
                                    'https://aeonmobile.jp/amlp/news_20210812_release/',
                                    '_blank'
                                  )
                                  win.focus()
                                }}
                              >
                                詳しくはこちら
                              </a>
                            </div>
                          )
                        } else if (
                          this.state.maintenancePopUp ||
                          this.state.limitedCampaignPopUp ||
                          this.state.limitedQuestionnairePt2PopUp ||
                          this.state.limitedQuestionnairePopUp ||
                          this.state.limitedNetsuperPopUp ||
                          this.state.limitedNetsuperPopUp_2
                        ) {
                          return null
                        } else {
                          return (
                            <div className="m-modal_btngroup_item m-btn">
                              <a
                                className="a-btn-submit a-btn-icon-none"
                                href=""
                                onClick={(e) => {
                                  e.preventDefault()
                                  this.props.history.push('/mail/')
                                }}
                              >
                                登録する
                              </a>
                            </div>
                          )
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`l-modal ${
                this.state.cancellationNewPopUp ? 'is-active' : ''
              }`}
            >
              <div className="l-modal_overlay">
                <div
                  style={{ maxWidth: '960px' }}
                  className={`l-modal_content ${
                    this.state.cancellationNewPopUp ? 'is-active' : ''
                  }`}
                >
                  <div className="m-modal">
                    <div className="m-modal_inner">
                      <p>
                        以前お手続きいただいたSIM再発行に伴い、一時的に変更させていただいておりましたお客さまIDを復帰いたしました。
                        <br />
                        以前のお客さまIDにてログインしてご利用ください。
                      </p>
                      <p>
                        ※この処理に伴い、只今ログインいただいたお客さまIDについては解約状態となっております。
                      </p>
                      <div className="m-btn">
                        <button
                          onClick={() => this.closeCheckcancellationModal()}
                          className="a-btn-dismiss a-btn-icon-none"
                          type="button"
                        >
                          閉じる
                        </button>
                      </div>
                    </div>
                  </div>
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
    customerInfo: postReducer.customerInfo,
    iotPlans: postReducer.iotPlans,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCustomerInfo: (newCustomerInfo) =>
      dispatch({
        type: 'customerInfo',
        customerInfo: newCustomerInfo,
      }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mypage)
