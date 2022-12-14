import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const'

// IMPORT MODULES
import Header from '../../../modules/Header.js'
import Dialog from '../../../modules/Dialog.js'

import ComponentBase from '../../ComponentBase.js'

import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

//tab
import CampaignTabsCoupon from './tabs/coupon'
import CampaignTabsWaon from './tabs/waon'
import CampaignTabsIssue from './tabs/Issue'

import loadingImage from '../../../modules/images/loaderTop.gif'

class Campaign extends ComponentBase {
  constructor(props) {
    super(props)

    this.waonTabRef = React.createRef()

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.onCreateTicket = this.onCreateTicket.bind(this)

    this.handleChangeWaonNumber = this.handleChangeWaonNumber.bind(this)
    this.showWaonNumberInputModal = this.showWaonNumberInputModal.bind(this)

    this.state = {
      api_data: [],
      table_data: [],
      loading_state: false,
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
      campaignList: [],
      campaignCouponList: [],
      waonAddPointHistoryList: [],
      waonNumber: ['6900', '', '', ''], // ??????4???(6900)?????????
      waonNumberInputModal: false,
      isWaonNumberError: false,
      waonNumberErrorMessages:
        'WAON???????????????????????????????????????????????????????????????????????????',
      activeTabNumber: 0,
      ticketList: [],
      ticketToken: '',
      isType: '2',
      isUpdate: false,
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_CAMPAIGN
    $('.t-header_menu_btn').click(function () {
      $('.t-wrapper').addClass('is-drawer-open')
    })
    $('.t-header_drawer_close_btn').click(function () {
      $('.t-wrapper').removeClass('is-drawer-open')
    })

    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
  }

  handleConnect(type, obj) {
    var params = {}
    this.setState({ loading_state: true })
    if (type === Const.CONNECT_TYPE_CAMPAIGN) {
      // ?????????????????????????????????API
      params = {
        // WAON??????
        campaignType: this.state.isType,
      }
    } else if (type === Const.CONNECT_TYPE_WAON) {
      // WAON??????????????????????????????API
      if (window.customerId) {
        // 1:????????? / 2:??????????????? / 3:???????????? / 4:??????????????? /5:?????????
        params = {
          customerId: window.customerId,
          displayStatusList: ['1', '4'],
        }
      } else {
        // customerId?????????
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(Const.CONNECT_TYPE_MYPAGEID))
        return
      }
    } else if (type === Const.CONNECT_TYPE_REQUESTWAON) {
      // WAON????????????????????????API
      if (obj) {
        let waonAddIdList = obj.filter((item) => {
          return item.checked
        })
        waonAddIdList = waonAddIdList.map((item) => {
          return item.waonAddId
        })
        params = {
          customerId: window.customerId,
          waonAddIdList,
          waonNumber: this.state.waonNumber.join(''),
          token: this.state.token,
        }
      } else {
        return
      }
    } else if (type === Const.CONNECT_TYPE_CREATE_TICKET) {
      //????????????????????????API
      params = {
        customerId: window.customerId,
        token: this.state.ticketToken,
      }
    } else if (type === Const.CONNECT_TYPE_GET_TICKET_LIST) {
      //??????????????????????????????????????????API
      params = {
        customerId: window.customerId,
      }
    } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerId: window.customerId,
        customerInfoGetFlg: '',
        sessionNoUseFlg: '',
        tokenFlg: '1',
        simGetFlg: '1',
        lineKeyObject: this.props.location.state.lineKeyObject || '',
      }
    }
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_MYPAGEID: {
          window.customerId = data.data.customerId
          this.setState({ customerId: data.data.customerId })
          this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
          break
        }
        case Const.CONNECT_TYPE_CAMPAIGN: {
          // ?????????????????????????????????API

          if (this.state.isType == '2') {
            let campaignList = data.data.campaignList
            this.setState({ campaignList, isType: '3' })
            this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
          } else if (this.state.isType == '3') {
            let campaignCouponList = data.data.campaignList
            this.setState({ campaignCouponList })
            this.handleConnect(Const.CONNECT_TYPE_WAON)
            this.handleConnect(Const.CONNECT_TYPE_GET_TICKET_LIST)
          }

          break
        }
        case Const.CONNECT_TYPE_WAON: {
          let waonAddPointHistoryList = data.data.waonAddPointHistoryList
          this.setState({ waonAddPointHistoryList })
          this.props.updateCampaign(waonAddPointHistoryList)
          if (this.state.isUpdate) {
            this.waonTabRef.current.updateData()
            this.setState({ isUpdate: false })
          }
          if (
            !this.props.location.state ||
            this.props.location.state.lineKeyObject == ''
          ) {
            this.props.history.push('/')
          }

          if ('type' in this.props.location.state) {
            this.setState({
              activeTabNumber: Number(this.props.location.state.type),
            })
          } else {
            this.setState({ activeTabNumber: 2 })
          }

          break
        }
        case Const.CONNECT_TYPE_REQUESTWAON: {
          let fail = false
          let failMessage = [
            '????????????????????????????????????????????????????????????????????????????????????',
            '????????????????????????????????????????????????????????????????????????????????????????????????????????????',
          ]
          let receiveRequested = false
          if (data.data.judgeWaonPointList && data.data.judgeWaonPointList[0]) {
            if (data.data.judgeWaonPointList[0].receiveLimit == '1') {
              fail = true
              failMessage = [
                '???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
                '????????????????????????????????????????????????????????????????????????????????????????????????????????????',
              ]
            }
            if (data.data.judgeWaonPointList[0].receiveRequested == '1') {
              receiveRequested = true
              failMessage = [
                '??????????????????????????????????????????????????????????????????????????????',
              ]
            }
            if (
              data.data.judgeWaonPointList[0].judgeResult &&
              data.data.judgeWaonPointList[0].judgeResult.forcedStoppage == '1'
            ) {
              fail = true
            }
            if (
              data.data.judgeWaonPointList[0].judgeResult &&
              data.data.judgeWaonPointList[0].judgeResult.removed == '1'
            ) {
              fail = true
              failMessage = [
                '?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
              ]
            }
            if (
              data.data.judgeWaonPointList[0].judgeResult &&
              data.data.judgeWaonPointList[0].judgeResult.unpaid == '1'
            ) {
              fail = true
            }
          }
          if (
            data.data.waonNumberCheckResult == 'OK' &&
            (receiveRequested || !fail)
          ) {
            if (this.state.isWaonNumberError) {
              this.setState({ isWaonNumberError: false })
            }
            // ?????????????????????
            this.showWaonNumberInputModal(false, '.a-pc')
            this.showWaonNumberInputModal(false, '.a-sp')
            // ?????????
            this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
            this.setState({ isUpdate: true })
          } else if (
            fail ||
            data.data.waonNumberCheckResult == 'NG' ||
            data.data.waonNumberCheckResult == 'ERROR'
          ) {
            // ??????????????? ??????????????????
            let waonNumberErrorMessages = [
              'WAON???????????????????????????????????????',
              '?????????????????????????????????',
            ]
            if (fail) {
              // ????????????????????? ??????????????????
              waonNumberErrorMessages = failMessage
            } else if (data.data.waonNumberCheckResult == 'ERROR') {
              // ????????????????????? ??????????????????
              waonNumberErrorMessages = [
                '?????????????????????',
                '????????????????????????????????????????????????????????????????????????????????????',
              ]
            }
            waonNumberErrorMessages = waonNumberErrorMessages.map((item, i) => {
              return (
                <p className="errorMessage" key={i}>
                  {item}
                </p>
              )
            })
            this.setState({
              isWaonNumberError: true,
              waonNumberErrorMessages,
            })
            if (data.data.token) {
              this.setState({ token: data.data.token })
            }
            // ????????????????????????????????????????????????????????????
            $(`.t-modal_content.a-pc`).animate({ scrollTop: 0 }, 0, 'swing')
            $(`.t-modal_content.a-sp`).animate({ scrollTop: 0 }, 0, 'swing')
          }
          break
        }
        case Const.CONNECT_TYPE_CREATE_TICKET: {
          //????????????????????????API

          //????????????????????????
          this.handleConnect(Const.CONNECT_TYPE_GET_TICKET_LIST)
          break
        }
        case Const.CONNECT_TYPE_GET_TICKET_LIST: {
          //??????????????????????????????????????????API
          let ticketList = data.data.ticketList
          this.setState({ ticketList, ticketToken: data.data.token })

          break
        }
        case Const.CONNECT_TYPE_AGREEMENT_DATA: {
          //?????????????????????API
          let lineInfoNum = localStorage.getItem('lineInfoNum')
            ? localStorage.getItem('lineInfoNum')
            : 0
          var params = data.data

          console.log('*** ???????????? ***')
          console.log('lineInfoNum', lineInfoNum)
          console.log('params', params)
          console.log('params.lineInfo', params.lineInfo)
          console.log(
            'params.lineInfo[lineInfoNum]',
            params.lineInfo[lineInfoNum]
          )

          if (
            //??????????????????????????????????????????????????????
            params.lineInfo[lineInfoNum] &&
            params.lineInfo[lineInfoNum].simInfo.length > 0
          ) {
            var simInfos = params.lineInfo[lineInfoNum].simInfo

            console.log(params.lineInfo[lineInfoNum].simInfo.length)
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

              console.log(arr.length, simInfos.length)
            }

            if (arr.length == simInfos.length) {
              //TOP???????????????
              this.props.history.push('/')
              return false
            }
          }
          this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
          break
        }

        default: {
          break
        }
      }
    } else if (status === Const.CONNECT_ERROR) {
      console.log('data.waonNumber', data.waonNumber)
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        // ???????????????????????????????????????
        this.props.history.push('/login/')
        return
      }
      if (data.waonNumber) {
        // waonNumber error
        let waonNumberErrorMessages =
          'WAON???????????????????????????????????????????????????????????????????????????'
        if (Array.isArray(data.waonNumber)) {
          waonNumberErrorMessages = data.waonNumber.map((item, i) => {
            return (
              <p className="errorMessage" key={i}>
                {item}
              </p>
            )
          })
        }
        this.setState({
          isWaonNumberError: true,
          waonNumberErrorMessages,
        })
        console.log('waonNumberErrorMessages', waonNumberErrorMessages)
        if (data.token) {
          // token??????
          this.setState({ token: data.token })
        }
        // ????????????????????????????????????????????????????????????
        $(`.t-modal_content.a-pc`).animate({ scrollTop: 0 }, 0, 'swing')
        $(`.t-modal_content.a-sp`).animate({ scrollTop: 0 }, 0, 'swing')
      } else {
        if (type != Const.CONNECT_TYPE_REQUESTWAON) {
          if (type === 'validation_errors') {
            // token???????????????
            // ????????????????????????????????????
            this.props.history.push('/error?e=1')
            document.title = Const.TITLE_ERROR
          } else {
            this.props.history.push('/')
          }
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
          this.props.history.push('/mypage')
          break
      }
    }
  }

  // NEXT?????????????????????
  goNextDisplay(e, url, params) {
    e.preventDefault()
    let _params = this.state.url_data[0].pass_data

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break

      case '/mypage/campaign/history/':
        if (params) {
          _params['type'] = params
        }

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(_params)

        this.props.history.push({
          pathname: url,
          state: _params,
        })
        break
      case '/mypage/campaign/add/':
        // NEED TO SEND THE CUSTOMER ID

        if (params) {
          _params['addId'] = params
        }

        this.props.history.push({
          pathname: url,
          state: _params,
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

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  //??????????????????
  onCreateTicket = (params) => {
    this.handleConnect(Const.CONNECT_TYPE_CREATE_TICKET)
  }

  //??????????????????
  // status 0 ??????????????????????????????  1 ????????????  2 ????????????(MNP???????????????????????????)  3 ??????????????????  4 ??????????????????(?????????????????????)
  checkCancellation(
    removeDate = '',
    cancelDate = '',
    simType,
    cancelRequestDate = ''
  ) {
    const today = moment()

    if (removeDate != '') {
      if (today.isSame(removeDate, 'month')) {
        //???????????? MNP???????????????????????????????????????	removeDate????????????cancelDate??????????????????
        if (
          cancelDate != '' &&
          !moment().endOf('month').isSame(moment(cancelDate), 'day')
        ) {
          return {
            operation_type1: false,
            operation_type2: false,
            msg: '???????????? ',
            status: 5,
          }
        }
        //???????????????(?????????????????????)	removeDate????????????????????????
        return {
          operation_type1: true,
          operation_type2: false,
          msg: '???????????????',
          status: 4,
        }
      } else {
        //???????????? removeDate?????????????????????????????????
        return {
          operation_type1: false,
          operation_type2: false,
          msg: '????????????',
          status: 1,
        }
      }
    } else if (cancelDate != '' && (simType == '1' || simType == '4')) {
      //????????????(MNP???????????????????????????)	simType???1 or 4??????removeDate?????????cancelDate?????????
      return {
        operation_type1: false,
        operation_type2: false,
        msg: '??????????????????',
        status: 2,
      }
    } else if (cancelRequestDate != '') {
      //??????????????????	cancelRequestDate??????????????????removeDate??????
      return {
        operation_type1: true,
        operation_type2: false,
        msg: '??????????????????',
        status: 3,
      }
    } else {
      // ?????????
      return {
        operation_type1: true,
        operation_type2: true,
        msg: '',
        status: 0,
      }
    }
  }

  toHalfWidth(input) {
    return input.replace(/[???-???]/g, function (input) {
      return String.fromCharCode(input.charCodeAt(0) - 0xfee0)
    })
  }

  handleChangeWaonNumber(e, index) {
    console.log(
      'handleChangeWaonNumber',
      e.target.value,
      index,
      this.state.waonNumber
    )
    let waonNumber = this.state.waonNumber
    let length = e.target.value.toString().length
    if (length < 5) {
      waonNumber[index] = this.toHalfWidth(e.target.value)
      this.setState({ waonNumber })
    }
  }

  showWaonNumberInputModal(flag, type) {
    console.log('showWaonNumberInputModal')
    if (flag) {
      if (type === '.a-pc') {
        $(`.t-modal${type}`).addClass('is-active')
        $(`.t-modal_content${type}`).addClass('is-active')
        let top = '5%'
        $(`.t-modal_content${type}`).css('top', top).css('position', 'fixed')
      } else {
        $(`.t-modal${type}`).addClass('is-active')
        $(`.t-modal_content${type}`).addClass('is-active')
        $(`.t-modal_content${type}`).css('position', 'fixed')
      }
    } else {
      $(`.t-modal${type}`).removeClass('is-active')
      $(`.t-modal_content${type}`).removeClass('is-active')
      $(`.t-modal_content${type}`).animate({ scrollTop: 0 }, 0, 'swing')
      // ?????????????????????????????????????????????????????????
      this.setState({
        isWaonNumberError: false,
        waonNumber: ['6900', '', '', ''],
        waonNumberErrorMessages:
          'WAON???????????????????????????????????????????????????????????????????????????',
      })
    }
    this.setState({ waonNumberInputModal: flag })
  }

  onChangeTabs(number) {
    $('#campaign_waon').css('padding-bottom', '0')

    this.setState({ activeTabNumber: number })
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
          <div id="campaign_waon" className="t-wrapper">
            <Header
              isExistStatus={this.props.isExistStatus}
              dispatch={this.props.dispatch}
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
                      {Const.TITLE_MYPAGE_CAMPAIGN}
                    </li>
                  </ol>
                  <h1 className="a-h1">{Const.TITLE_MYPAGE_CAMPAIGN}</h1>

                  <div className="t-inner_full">
                    <div className="t-tabs_wrap">
                      <div className="t-tabs_button_wrap">
                        <button
                          className={`t-tabs_button ${
                            this.state.activeTabNumber == 2 && 'active'
                          }`}
                          onClick={() => this.onChangeTabs(2)}
                        >
                          WAON??????????????????
                        </button>
                        <button
                          className={`t-tabs_button ${
                            this.state.activeTabNumber == 3 && 'active'
                          }`}
                          onClick={() => this.onChangeTabs(3)}
                        >
                          1GB??????????????????
                        </button>
                        <button
                          className={`t-tabs_button ${
                            this.state.activeTabNumber == 1 && 'active'
                          }`}
                          onClick={() => this.onChangeTabs(1)}
                        >
                          ??????????????????
                        </button>
                      </div>
                      <div className="t-tabs_content_wrap">
                        {(() => {
                          if (this.state.activeTabNumber == 1) {
                            return (
                              <CampaignTabsIssue
                                goNextDisplay={this.goNextDisplay}
                                onCreateTicket={this.onCreateTicket}
                                ticketList={this.state.ticketList}
                              />
                            )
                          } else if (this.state.activeTabNumber == 2) {
                            return (
                              <CampaignTabsWaon
                                ref={this.waonTabRef}
                                goNextDisplay={this.goNextDisplay}
                                campaignList={this.state.campaignList}
                                waonAddPointHistoryList={
                                  this.state.waonAddPointHistoryList
                                }
                                waonNumber={this.state.waonNumber}
                                waonNumberInputModal={
                                  this.state.waonNumberInputModal
                                }
                                isWaonNumberError={this.state.isWaonNumberError}
                                waonNumberErrorMessages={
                                  this.state.waonNumberErrorMessages
                                }
                                handleChangeWaonNumber={
                                  this.handleChangeWaonNumber
                                }
                                showWaonNumberInputModal={
                                  this.showWaonNumberInputModal
                                }
                                handleConnect={this.handleConnect}
                              />
                            )
                          } else if (this.state.activeTabNumber == 3) {
                            return (
                              <CampaignTabsCoupon
                                goNextDisplay={this.goNextDisplay}
                                campaignList={this.state.campaignCouponList}
                                waonAddPointHistoryList={
                                  this.state.waonAddPointHistoryList
                                }
                              />
                            )
                          } else {
                            return (
                              <div
                                className=""
                                style={{
                                  margin: '150px 0',
                                  textAlign: 'center',
                                }}
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
                                  alt="?????????????????????..."
                                />
                              </div>
                            )
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="m-btn">
                <a
                  className="a-btn-dismiss"
                  onClick={() => {
                    this.props.history.push('/login')
                  }}
                >
                  ??????
                </a>
              </p>
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
    type: postReducer.type,
    campaign: postReducer.campaign,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateCampaign: (newCampaign) =>
      dispatch({
        type: 'campaign',
        campaign: newCampaign,
      }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaign)
