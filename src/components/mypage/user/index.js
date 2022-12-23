import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import ReactHtmlParser from 'react-html-parser'
import moment from 'moment'
import _ from 'lodash'

// IMPORT CSS FILES
import '../../assets/css/common.css'

// IMPORT COMPONENTBASE FILE
import ComponentBase from '../../ComponentBase.js'

// IMPORT ACTION FILES
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'
import {
  //getAppInfo,
  getApplyEntryInfo,
  getApplyInfo,
  getApplyNumber,
  getAgreementData,
  getChangingPlanMst,
  getSimData,
  getService,
  getToken,
  getOptionList,
  updateApplyInfoParam,
} from '../../../actions/ArsActions.js'
import {
  changeKana,
  formatZip,
  removehyphen,
  getSimDetail,
  getSimKind,
} from '../../../actions/Methods.js'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'
import SocialLogin from '../../../modules/SocialLogin.js'

import btnAppStore from '../../assets/images/btn_app_store.png'
import btnGooglePlay from '../../assets/images/btn_google_play.png'
import linkImgCredit from '../../assets/images/aeonCredit_1000x350_20221202.jpg'
import optionArrowDown from '../../../modules/images/option_arrow_down.png'

import icon_help from '../../../modules/images/icon_q.png'
import option from '../option'
//import { apply } from 'core-js/fn/reflect'
//import service from '../option/service'

// setTimeout処理
var st

class User extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogConfirm = this.callbackDialogConfirm.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.socialLoginHandler = this.socialLoginHandler.bind(this)
    this.handleChangeOption = this.handleChangeOption.bind(this)
    this.submitNotification = this.submitNotification.bind(this)

    this.SocialLink = new SocialLogin(props)

    this.state = {
      planModal: false,
      optionModal: false,
      mailAddress: '',
      loginMailAddressFlg: 0,
      initialPassChangeFlg: '',
      loginYahooFlg: 0,
      loginGoogleFlg: 0,
      loginFacebookFlg: 0,
      secretKey: '',
      receptModal: false,
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '',
          sessionNoUseFlg: '1',
          token: '',
        },
      ],
      customerInfo: [
        {
          userName: '',
          userNameKana: '',
          postCode: '',
          address: '',
          phoneNumber: '',
        },
      ],
      loading_state: false,
      // FOR DIALOG CONFIRM
      dialogs_confirm: [
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
              callback: this.callbackDialogConfirm,
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: '解除する',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialogConfirm,
              interval: null,
            },
          ],
          callback: this.callbackDialogConfirm,
          state: false,
        },
      ],
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
      lineInfo: [
        {
          lineDiv: '',
          lineKeyObject: '',
          planName: '',
          removeStatus: '',
        },
      ],
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
      changeMailHistory: false,
      login_method: '',
      contractStatus: '',
      paymentChangeDisabled: {},
      changeModal_status: false, //変更用モーダル
      is_enable_email: false, //email登録
      emailModal_flag: false, //email確認モーダルフラグ
      changeStatus: false, //変更フラグ
      changeCommitTime: '',
      changeCustomerInfo: {}, //変更後情報
      simType: '',
      simKind: '',
      option_data: [], //加入済オプション
      options: [], //加入可能オプション一覧
      options_list: [], //加入可能オプション一覧(フラット配列)
      options_cancel: [], //廃止予定リスト
      options_cancel_default: [], //強制廃止予定リスト
      options_default: [], //初期選択項目
      options_selected: [], //変更後項目
      progressApplyNumber: '', //名義変更進行中時のApplyNumber
      changeSimList: [], //変更後Simリスト
      disabledModal: false, //解約中、変更中用モーダル
      selectedPlan: '', //変更予定プランID
      planMst: [],
      isADFSLogined: false,
      btnDisabled: true,
      applyInfo: [],
      editingIccid: '',
      helpState: [],
      helpModal: false,
      helpTitle: '',
      helpDescription: '',
      helpComment: '',
    }
  }

  handleConnect(type) {
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      // api AMM00005 - agreement
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        params = {
          customerInfoGetFlg: this.state.passData[0].customerInfoGetFlg,
          tokenFlg: this.state.passData[0].tokenFlg,
          simGetFlg: this.state.passData[0].simGetFlg,
          sessionNoUseFlg: this.state.passData[0].sessionNoUseFlg,
          customerId: window.customerId,
          lineKeyObject: '',
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
      case Const.CONNECT_TYPE_REMOVE_LOGIN:
        params = {
          login_method: this.state.login_method,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_SIM_DATA:
        /*
        params = {
          lineKeyObject: this.state.lineInfo[0].lineKeyObject,
          lineDiv: this.state.lineInfo[0].lineDiv,
          lineNo: this.state.lineInfo[0].simInfo[0].lineNo,
        } 
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params)) */
        break
      case Const.CONNECT_TYPE_NOTIFICATION_DATA:
        params = {
          customerId: window.customerId,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_INSERT_NOTIFICATION:
        params = {
          customerId: window.customerId,
          status: this.state.notice_status,
          token: this.state.notification.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        this.getChangeStatus()
        this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
        this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
        this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
        this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        var params = data.data

        // 完了通知用
        const mailAddress = data.data.mailAddress
        const notice_status = mailAddress.length > 0 ? '2' : '1'
        this.setState({ notice_status, mailAddress })

        this.setState({ customerID: params.customerID })
        this.setState({ mailAddress: params.mailAddress })
        this.setState({ initialPassChangeFlg: params.initialPassChangeFlg })
        this.setState({
          loginMailAddressFlg: parseInt(params.loginMailAddressFlg),
        })
        this.setState({ loginYahooFlg: parseInt(params.loginYahooFlg) })
        this.setState({ loginGoogleFlg: parseInt(params.loginGoogleFlg) })
        this.setState({ loginFacebookFlg: parseInt(params.loginFacebookFlg) })
        this.setState({ customerInfo: params.customerInfo })
        this.setState({ secretKey: params.secretKey })
        this.setState({ lineInfo: params.lineInfo })
        console.log(params)
        var passData_copy = [...this.state.passData]
        passData_copy[0].token = params.token
        // メールアドレス変更の時刻を見て表示切替を実施
        this.switchMailStatus()

        if (params.mailAddress) {
          const email_domail = params.mailAddress.substr(
            params.mailAddress.indexOf('@') + 1
          )
          // ※下記が空かどうかで判別 ****@aeon.aeonも空扱いにする
          if (email_domail !== 'aeon.aeon') {
            this.setState({ is_enable_email: true })
          }
        }
      } else if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
        // 契約ステータス(contractStatus)
        let contract = data.data.contractList.filter(
          (item) => item.customerId == window.customerId
        )[0]
        this.setState({
          contractStatus: contract.contractStatus,
        })
      } else if (type === Const.CONNECT_TYPE_REMOVE_LOGIN) {
        this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
        this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        /* const option_data = data.data.optionArray.filter(
          (u) => u.status === '1'
        )
        console.log(option_data)
        this.setState({ option_data })

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

        console.log(simType, simKind)

        this.setState({ simType, simKind }) */
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        this.setState({
          notification: data.data,
          //notice_status: data.data.status,
        })
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        //通知設定の更新
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION
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
      } else {
        this.props.history.push('/login')
      }
    }
  }

  async componentDidMount() {
    this.goTop()

    document.title = Const.TITLE_MYPAGE_USER

    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
      this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
      this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
      this.getChangeStatus()
    }
    this.getPaymentChangeDisabled()
    $('.t-modal_overlay').click(function () {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('#modal_customer.t-modal_content').removeClass('is-active')
    })
  }
  componentWillUnmount() {
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
              this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
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

  callbackDialogConfirm(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[0].state = false
          this.setState({ dialogs_confirm: dialogs_copy })
          break
        }
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[0].state = false
          this.setState({ dialogs_confirm: dialogs_copy })
          // 解除処理
          this.handleConnect(Const.CONNECT_TYPE_REMOVE_LOGIN)
          break
      }
    }
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

  async goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/mypage/mail/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      params.loginMailAddressFlg = this.state.loginMailAddressFlg
      params.initialPassChangeFlg = this.state.initialPassChangeFlg
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/operate/password/') {
      // let params = {};
      // NEED TO SEND THE CUSTOMER ID

      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/user/ga/') {
      this.props.history.push({
        pathname: url,
        state: {
          token: this.state.token,
        },
      })
    } else if (url === '/mypage/user/cancellation/procedure/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (
      url === '/mypage/change/name' ||
      url === '/mypage/change/transfer' ||
      url === '/mypage/change/inherit'
    ) {
      const applyNumber = await getApplyNumber()
      const params = {
        applyNumber,
      }
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/') {
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/operate/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      console.log('/mypage/operate/ :: ', params)
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

  socialLoginHandler(e, type) {
    e.preventDefault()
    let token = this.state.passData[0].token
    var dialogs_copy = [...this.state.dialogs_confirm]
    var values = []
    switch (type) {
      case 'facebook':
        if (this.state.loginFacebookFlg === 0) {
          this.SocialLink.handleConnect('/pg/facebook/regist?token=' + token)
        } else {
          values[0] = {
            text: (
              <p>
                Facebookでのログイン連携を解除します。
                <br />
                よろしいですか？
              </p>
            ),
          }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            login_method: '31',
          })
        }
        break
      case 'google':
        if (this.state.loginGoogleFlg === 0) {
          this.SocialLink.handleConnect('/pg/google/regist?token=' + token)
        } else {
          values[0] = {
            text: (
              <p>
                Googleでのログイン連携を解除します。
                <br />
                よろしいですか？
              </p>
            ),
          }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            login_method: '32',
          })
        }
        break
      case 'yahoo':
        if (this.state.loginYahooFlg === 0) {
          this.SocialLink.handleConnect('/pg/yahoo/regist?token=' + token)
        } else {
          values[0] = {
            text: (
              <p>
                Yahooでのログイン連携を解除します。
                <br />
                よろしいですか？
              </p>
            ),
          }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            login_method: '30',
          })
        }
        break
      case 'mail':
        if (this.state.loginMailAddressFlg === 0) {
          this.goNextDisplay(e, '/mypage/mail/', this.state.passData[0])
        } else {
          values[0] = {
            text: (
              <p>
                メールアドレスでのログイン連携を解除します。
                <br />
                よろしいですか？
              </p>
            ),
          }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            login_method: '20',
          })
        }
        break
    }
  }
  // お支払い方法の変更リンク
  returnChangePaymentMethod() {
    if (this.props.paymentError.unchangeableCreditCard == '0') {
      if (
        this.state.contractStatus === 'sent' ||
        this.state.contractStatus === 'forcedStopping' ||
        this.state.contractStatus.startsWith('remove')
      ) {
        // 変更可能
        // 通常 or 強制停止ステータス
        let opacity = this.state.paymentChangeDisabled.status ? '0.5' : '1.0'
        return (
          <div style={{ paddingRight: '4rem' }}>
            <div className="t-inner_wide">
              <h3 className="a-fw-normal a-mb-10">◎お支払い方法の変更</h3>
            </div>
            <p>
              <a
                href=""
                onClick={(e) => {
                  if (this.state.paymentChangeDisabled.status) {
                    e.preventDefault()
                    return
                  }
                  this.goNextDisplay(e, '/mypage/payment/change')
                }}
                style={{ color: '#B50080', opacity }}
              >
                クレジットカード変更手続き
              </a>
            </p>
          </div>
        )
      } else {
        // その他処理中
        return (
          <div>
            <div className="t-inner_wide">
              <h3 className="a-fw-normal a-mb-10">◎お支払い方法の変更</h3>
            </div>
            <p
              style={{
                color: '#b50080',
                maxWidth: '330px',
              }}
            >
              現在お客さまがお申込みの他のお手続きが完了するまで、お支払い方法の変更をお受けできません。
              <br />
              恐れ入りますが、お手続きが完了するまで、今しばらくお待ちください。
            </p>
          </div>
        )
      }
    } else {
      // 変更不可
      return (
        <div>
          <div className="t-inner_wide">
            <h3 className="a-fw-normal a-mb-10">◎お支払い方法の変更</h3>
          </div>
          <p
            style={{
              color: '#b50080',
              maxWidth: '330px',
            }}
          >
            お客さまにおかれましては、マイページによるお支払い方法の変更はお受けできません。
            <br />
            お支払い方法についての案内書面を送付させていただいておりますので、お手数をおかけしますが、内容をご確認のうえ、お手続きをお願いします。
          </p>
        </div>
      )
    }
  }
  getPaymentChangeDisabled() {
    fetch(
      `${Const.CONNECT_TYPE_PAYMENT_CHANGE_DISABLED}?v=${this.getTimestamp()}`,
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
        this.setState({
          paymentChangeDisabled: json || {},
        })
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  isPracticableCancel() {
    var flg = true
    var msg =
      'イオンモバイル通信契約、もしくは契約内の一部回線の解約をお申し込みいただけます。'

    //未収がある場合 errorCode が 0000以外
    if (
      this.props.paymentError &&
      this.props.paymentError.errorCode !== '0000' &&
      this.props.paymentError.unchangeableCreditCard == '0'
    ) {
      flg = false
      msg = 'お支払いエラーのため、解約のお手続きを行うことができません。'
      return { flg: flg, msg: msg }
    }

    //console.log('unpaidFlag', this.state.customerInfo.unpaidFlag)

    //強制停止中の回線がある場合 契約情報取得APIのunpaidFlag（未納フラグ）が1
    if (this.state.customerInfo.unpaidFlag == 1) {
      flg = false
      msg = '強制停止中のため、解約のお手続きを行うことができません。'
      return { flg: flg, msg: msg }
    }

    //解約手続き中
    //console.log(this.state.customerInfo)
    let cancelContract = localStorage.getItem('cancelContract')
    if (
      this.state.customerInfo.cancelRequestDate != '' ||
      cancelContract == '1'
    ) {
      flg = false
      msg = '解約手続き中ため、解約のお手続きを行うことができません。'
      return { flg: flg, msg: msg }
    }

    //シェア追加処理中の場合 契約一覧取得APIの契約ステータスがsent以外
    if (this.state.contractStatus !== 'sent') {
      flg = false
      msg = 'その他のお手続き中のため、解約のお手続きを行うことができません。'
      return { flg: flg, msg: msg }
    }

    let l_Corp = localStorage.getItem('l_Corp')
    //console.log(`大口法人: `, l_Corp)
    // 1:大口法人 0 それ以外
    if (l_Corp && l_Corp == '1') {
      flg = false
      msg = `お客さまのご契約内容では、マイページからの解約を承ることができません。<br>
      お手数ではございますが、お客さまセンターまでお問い合わせください。`
      return { flg: flg, msg: msg }
    }

    return { flg: flg, msg: msg }
  }

  async modalHandler() {
    this.setState({
      changeModal_status: true,
    })

    const emailModal_flag = this.state.is_enable_email ? false : true

    this.setState({
      emailModal_flag,
    })
  }

  async getChangeStatus() {
    const { result, customerInfo, commitTime } = await getApplyEntryInfo(
      window.customerId,
      '303,304,601,602'
    )
    const progressApplyNumber = localStorage.getItem('progressApplyNumber')
    this.setState({ progressApplyNumber })
    console.log(result)
    // 変更中
    if (result === 'OK') {
      this.setState({
        changeStatus: true,
        changeCustomerInfo: customerInfo,
        changeCommitTime: commitTime,
      })
    } else if (progressApplyNumber) {
      // 変更途中
      const { lineInfo } = await getAgreementData(window.customerId)
      const simInfo = lineInfo[0].simInfo

      await this.getHelps()

      this.setState({ lineInfo, simInfo })

      var applyInfo = await getApplyInfo(progressApplyNumber)
      applyInfo.simList = applyInfo.simList.map((item) => {
        return {
          iccid: item.iccid,
          optionServiceId: item.optionServiceId,
          otherOptionServiceId: item.otherOptionServiceId,
          cancelOptionServiceId: item.cancelOptionServiceId,
        }
      })

      const {
        customerInfo: changeCustomerInfo,
        planServiceId: selectedPlan,
        simList: changeSimList,
      } = applyInfo

      this.setState({
        applyInfo,
        changeCustomerInfo,
        selectedPlan,
        changeSimList,
      })

      const { planKind } = await getService(lineInfo[0].serviceId)
      const limitedType = ('00' + planKind).slice(-2)

      const simKind = getSimKind(this.state.simInfo)

      const params = {
        lineKeyObject: lineInfo[0].lineKeyObject,
        lineDiv: lineInfo[0].lineDiv,
        gender: changeCustomerInfo.gender,
        simKind,
        //appFlag: this.state.isADFSLogined ? '1' : '0',
        limitedType,
      }

      const { plan: planMst } = await getChangingPlanMst(params)

      this.setState({ planMst })
    }
  }

  checkAge(item) {
    let isValid = false
    if (item.ageLowerLimit === '' && item.ageUpperLimit === '') return isValid

    if (this.state.customerInfo.birthday) {
      const birthday0 = moment(this.state.customerInfo.birthday).format('YYYY')
      const birthday1 = moment(this.state.customerInfo.birthday).format('MM')
      const birthday2 = moment(this.state.customerInfo.birthday).format('DD')

      const birthday = moment([birthday0, parseInt(birthday1) - 1, birthday2])

      const now = moment()
      if (
        item.ageLowerLimit !== '' &&
        now.diff(birthday, 'years') < item.ageLowerLimit
      ) {
        isValid = true
      }
      if (
        item.ageUpperLimit !== '' &&
        now.diff(birthday, 'years') > item.ageUpperLimit
      ) {
        isValid = true
      }
    }
    return isValid
  }

  // 除外オプションの対象が有効になっているかをチェック
  checkExclusive(option) {
    const array = option.exclusiveOptionServiceIdList

    let isIncluded = false
    let options_cancel = this.state.options_cancel
    const optionServiceId = [...this.state.options_selected].filter(
      (optionId) => {
        return options_cancel.indexOf(optionId) == -1
      }
    )

    /* const otherOptionServiceId =
      formState.simList[this.state.index].otherOptionServiceId */
    // 除外オプションの対象が有効になっている場合は選択できないようにする
    optionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
        }
      })
    })
    /* otherOptionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
        }
      })
    }) */

    return isIncluded
  }

  // 必須オプションの対象が有効になっているかをチェック
  checkInclusive(option) {
    const array = option.inclusiveOptionServiceIdList
    if (!array.length) {
      return true
    }

    const id = option.optionServiceId
    let isIncluded = false
    const optionServiceId = this.state.options_selected

    // 必須オプションの対象が有効になっている場合のみ選択できるようにする
    const filter = _.filter(this.state.inclusiveOptionList, { target: id })
    optionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
          // チェック状態を記録
          if (!filter.length) {
            const inclusiveOptionList = this.state.inclusiveOptionList
            inclusiveOptionList.push({
              id: _item,
              target: id,
            })
            this.setState({ inclusiveOptionList })
          }
        }
      })
    })

    return isIncluded
  }

  isChecked(item_id) {
    const result = this.state.options_selected.includes(item_id)
    return result
  }
  isJoin(item_id) {
    const result = this.state.options_default.includes(item_id)
    return result
  }

  isCancel(id) {
    return this.state.options_cancel.includes(id)
  }
  isCancelDefault(id) {
    return this.state.options_cancel_default.includes(id)
  }
  isDisabled(item) {
    const exclusive = this.checkExclusive(item)
    //const inclusive = this.checkInclusive(item)
    const validAge = this.checkAge(item)
    //return exclusive || !inclusive || validAge
    return exclusive || validAge
  }

  //オプションチェック
  handleChangeOption(e) {
    const id = e.target.value
    console.log(id)
    const isJoinState = this.isJoin(id)

    if (isJoinState) return //加入不可
    let options_selected = this.state.options_selected
    const result = this.state.options_selected.includes(id)
    if (result) {
      options_selected = this.state.options_selected.filter((n) => n !== id)
    } else {
      options_selected.push(id)
    }
    options_selected.sort()

    console.log(options_selected)
    this.setState({ options_selected })
  }

  //オプション廃止・キャンセル
  handleAdolition(id) {
    const result = this.state.options_cancel.includes(id)
    let options_cancel = this.state.options_cancel
    if (result) {
      options_cancel = this.state.options_cancel.filter((n) => n !== id)
    } else {
      options_cancel.push(id)
    }
    console.log(options_cancel)
    this.setState({ options_cancel })
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

  // プランモーダル プラン選択時
  handleChangePlan(e) {
    console.log(e.target.value)
    const selectedPlan = e.target.value
    this.setState({ selectedPlan })
  }
  // プラン更新
  submitPlanChange() {
    let applyInfo = _.cloneDeep(this.state.applyInfo)
    applyInfo.planServiceId = this.state.selectedPlan
    console.log(applyInfo)
    this.setState({ applyInfo, planModal: false })
    //this.state.applyInfo.planServiceId
  }

  // オプション変更
  async handleChangeOptionModal(simDetail) {
    //editingIccid
    this.setState({ editingIccid: simDetail.ICCID })
    console.log(this.state.lineInfo[0].lineKeyObject)
    console.log(this.state.lineInfo[0].lineDiv)

    const sim_body = {
      lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      lineDiv: this.state.lineInfo[0].lineDiv,
      lineNo: simDetail.lineNo,
    }
    const simData = await getSimData(sim_body)
    var option_data = simData.optionArray.filter((u) => u.status === '1')
    const applyInfo = _.cloneDeep(this.state.applyInfo)
    const simIndex = applyInfo.simList.findIndex((item) => {
      console.log(item)
      return item.iccid === this.state.editingIccid
    })
    this.setState({ option_data })
    console.log(option_data)

    let simType = ''
    if (this.state.lineInfo[0].lineDiv === '1' && simData.type === 'D') {
      simType = '01'
    } else if (this.state.lineInfo[0].lineDiv === '1' && simData.type === 'K') {
      simType = '03'
    } else if (this.state.lineInfo[0].lineDiv === '2' && simData.type === 'D') {
      simType = '02'
    }

    let simKind = ''
    switch (simData.simType) {
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
    let option_body = {
      procType: 2,
      receptionistKbn: 2,
      simType,
      sharePlanFlag: this.state.customerInfo.sharePlanFlag,
      simKind,
      gender: this.state.customerInfo.gender,
      specifyPeriodFlag: 1,
    }

    //JANは、現在保証系オプションに加入している場合のみ設定
    let insuranceOptionIds = Const.INSURANCE_OPTIONS_A.concat(
      Const.INSURANCE_OPTIONS_B
    )
    let insuranceOptionsJoined = option_data
      .map((opt) => opt.optionId)
      .filter((optionId) => {
        return insuranceOptionIds.indexOf(optionId) != -1
      })
    let insuranceOptionsJoinedTypeA = option_data
      .map((opt) => opt.optionId)
      .filter((optionId) => {
        return Const.INSURANCE_OPTIONS_A.indexOf(optionId) != -1
      })

    if (simData.modelJanCode.length > 0 &&
      Const.SIM_JAN_CODES.indexOf(simData.modelJanCode) == -1) {
      option_body.janCode = simData.modelJanCode.length > 0
    }

    //加入済みオプションは必ず取得（保証系以外）
    var additionalOptionIds = option_data
      .map((op) => {
        return op.optionId
      })
      .filter((id) => insuranceOptionIds.indexOf(id) == -1)
    if (insuranceOptionsJoined.length > 0) {
      additionalOptionIds = additionalOptionIds.concat(insuranceOptionsJoined)
    }
    option_body.addOptionId = additionalOptionIds.join(',')

    const { categoryList: options } = await getOptionList(option_body)

    console.log(options)

    if (options.length > 0) {
      var optionsArray = []
      options.forEach((list,index) => {
        var newList = {
          categoryId: list.categoryId
        }
        newList.optionList = list.optionList.filter((v) => {
          return insuranceOptionsJoined.indexOf(v.optionServiceId) != -1 //加入済み保証系オプション
            || (Const.INSURANCE_OPTIONS_A.indexOf(v.optionServiceId) != -1 && insuranceOptionsJoinedTypeA.length > 0) //安心保証系加入済み、かつ安心保証系オプション
            || insuranceOptionIds.indexOf(v.optionServiceId) == -1 //保証系以外
        })
        optionsArray[index] = newList
      })

      const options_list = optionsArray
        .map((category) => {
          return category.optionList
        })
        .flat()
      this.setState({ options:optionsArray, options_list })
    }

    const {
      optionServiceId,
      otherOptionServiceId,
    } = this.state.applyInfo.simList.find(
      (item) => item.iccid === simDetail.ICCID
    )
    if (optionServiceId.length > 0 || otherOptionServiceId.length > 0) {
      //すでに選択済みであればそちらを使う
      const options_selected = optionServiceId.concat(otherOptionServiceId)
      options_selected.sort()
      this.setState({
        options_selected,
        options_default: [...options_selected],
      })
    } else if (option_data.length > 0) {
      var options_selected = option_data.map((item) => {
        return item.optionId
      })
      options_selected.sort()
      this.setState({
        options_selected,
        options_default: [...options_selected],
      })
    }

    const { cancelOptionServiceId } = this.state.applyInfo.simList.find(
      (item) => item.iccid === simDetail.ICCID
    )
    if (cancelOptionServiceId.length > 0) {
      this.setState({
        options_cancel: [...cancelOptionServiceId],
        options_cancel_default: [...cancelOptionServiceId],
      })
    }
    this.setState({
      optionModal: true,
    })
  }

  async hadnleSubmitOption() {
    let applyInfo = _.cloneDeep(this.state.applyInfo)

    let optionServiceId = this.state.options_selected.filter(
      (element) => element === '0702000004' || element === '0702000005'
    )
    // 追加するサービスID(音声オプション)
    optionServiceId = optionServiceId.filter(
      (element) => !this.state.options_default.includes(element)
    )

    let otherOptionServiceId = this.state.options_selected.filter(
      (element) =>
        false == (element === '0702000004' || element === '0702000005')
    )
    // 追加するサービスID(音声オプション以外)
    otherOptionServiceId = otherOptionServiceId.filter(
      (element) => !this.state.options_default.includes(element)
    )

    //追加するオプションすべて（キャンセル分除く）
    const all_add_options = this.state.options_selected.filter(
      (element) => !this.state.options_default.includes(element)
    )

    // 050オプション
    const options_050 = all_add_options.filter(
      (element) => element === '0702010013'
    )
    const options_not_050 = all_add_options.filter(
      (element) => element !== '0702010013'
    )

    let customerInfoType_list = applyInfo.customerInfoType.split(',')

    if (options_050.length > 0 && options_not_050.length > 0) {
      if (!customerInfoType_list.includes('306')) {
        customerInfoType_list.push('306')
      }
      if (!customerInfoType_list.includes('901')) {
        customerInfoType_list.push('901')
      }
    } else if (options_050.length > 0) {
      if (!customerInfoType_list.includes('901')) {
        customerInfoType_list.push('901')
      }
    } else {
      if (!customerInfoType_list.includes('306')) {
        customerInfoType_list.push('306')
      }
    }

    applyInfo.customerInfoType = customerInfoType_list.join(',')

    const simIndex = applyInfo.simList.findIndex((item) => {
      console.log(item)
      return item.iccid === this.state.editingIccid
    })
    if (simIndex !== -1) {
      var simList = applyInfo.simList
      let simParam = {
        iccid: applyInfo.simList[simIndex].iccid,
        optionServiceId,
        otherOptionServiceId,
        cancelOptionServiceId: this.state.options_cancel,
      }
      simList[simIndex] = simParam
      applyInfo.simList = simList
    }

    console.log(applyInfo)
    console.log(applyInfo.simList)
    this.setState({ applyInfo, optionModal: false })
  }

  // 更新を申請する
  async handleUpdate() {
    let body = _.cloneDeep(this.state.applyInfo)
    const token = await getToken(this.state.progressApplyNumber)
    body.token = token
    body.commitFlag = 1
    console.log(body)
    await updateApplyInfoParam(body, this.state.progressApplyNumber)
    localStorage.removeItem('progressApplyNumber')

    //郵送設定
    if (this.state.notification.status === '1') {
      this.setState({ receptModal: true })
      return
    }

    console.log('完了')
    location.reload()
  }

  // 通知モーダル
  async submitNotification() {
    if (this.state.notice_status !== this.state.notification.status) {
      this.handleConnect(Const.CONNECT_TYPE_INSERT_NOTIFICATION)
      console.log('更新')
    }
    this.setState({ receptModal: false })
    location.reload()
  }

  getHelps() {
    fetch(Const.OPTION_HELP)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        if (resJson.optionHelpList) {
          const { helpState } = this.state
          helpState.optionHelpList = resJson.optionHelpList
          this.setState({
            helpState,
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // ヘルプモーダルを表示
  openHelpModal(help) {
    const helpTitle = help.optionName
    const helpDescription = help.description.split('\n').map((i, index) => {
      return (
        <p key={index} style={{ margin: '0' }}>
          {i}
        </p>
      )
    })
    const helpComment = help.comment.split('\n').map((i, index) => {
      return (
        <p key={index} style={{ margin: '0' }}>
          {i}
        </p>
      )
    })
    this.setState({ helpModal: true, helpTitle, helpDescription, helpComment })
  }

  // ヘルプボタン描画
  returnHelpBtn(optionServiceId) {
    const { helpState } = this.state
    if (!helpState.optionHelpList) {
      return null
    }
    const help = helpState.optionHelpList.filter((item) => {
      return item.optionServiceId === optionServiceId
    })
    if (help[0]) {
      return (
        <div className="option_table_help">
          <a
            href="javascript:void(0)"
            onClick={() => this.openHelpModal(help[0])}
          >
            <img src={icon_help} alt="help" width="16" />
          </a>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const selectedPlan_data = this.state.planMst.find((item) => {
      return item.planId == this.state.applyInfo.planServiceId
    })
    this.item = this.state.planMst.map((item) => (
      <option
        value={item.planId}
        key={item.planId}
        selected={this.state.applyInfo.planServiceId == item.planId}
      >
        {item.planName}
      </option>
    ))
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
          }
        })}
        {this.state.dialogs_confirm.map(function (data, i) {
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
                    <li className="m-breadcrumb_item">
                      お客さま情報／ログイン設定
                    </li>
                  </ol>
                  <h1 className="a-h1">お客さま情報／ログイン設定</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      お客さまの契約情報とログイン設定です。
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section t-inner_wide">
                      <h3 className="a-h3 a-fw-normal a-mb-10">
                        ◎お客さま情報
                      </h3>
                      <table className="a-table">
                        <tbody>
                          <tr>
                            <th>ご契約者名</th>
                            <td id="userName">
                              {this.state.customerInfo.userName}
                            </td>
                          </tr>
                          <tr>
                            <th>ご契約者名かな</th>
                            <td id="userNameKana">
                              {this.state.customerInfo.userNameKana}
                            </td>
                          </tr>
                          <tr>
                            <th>郵便番号</th>
                            <td id="postCode">
                              {this.state.customerInfo.postCode}
                            </td>
                          </tr>
                          <tr>
                            <th>住所</th>
                            <td id="address">
                              {this.state.customerInfo.address}
                              {/* <br /> */}
                            </td>
                          </tr>
                          <tr>
                            <th>連絡先電話番号</th>
                            <td id="phoneNumber">
                              {this.state.customerInfo.phoneNumber}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <div>
                        {this.state.changeModal_status &&
                          // emailが有効な場合
                          (!this.state.emailModal_flag ? (
                            <div className="xl-modal is-active">
                              <div className="xl-modal_content">
                                <p className="xl-modal_title">
                                  変更内容を選んでください
                                </p>
                                <div className="xl-modal_flex">
                                  <a
                                    className="xl-modal_flex_item xl-modal_flex_box"
                                    onClick={(e) => {
                                      this.goNextDisplay(
                                        e,
                                        '/mypage/change/name'
                                      )
                                    }}
                                  >
                                    <p className="xl-modal_flex_box_title">
                                      <span>
                                        改姓・改名・住所変更・ お電話番号
                                      </span>
                                      の変更手続きをご希望の方はこちらからお進みください。
                                    </p>
                                  </a>
                                  <p className="xl-modal_flex_text is-sp">
                                    改姓・改名を含むお手続きには、１つの本人確認書類の中で変更前と変更後のお名前が記載された書類のアップロードが必要です。
                                  </p>
                                  <a
                                    className="xl-modal_flex_item xl-modal_flex_box"
                                    onClick={(e) => {
                                      this.goNextDisplay(
                                        e,
                                        '/mypage/change/transfer'
                                      )
                                    }}
                                  >
                                    <p className="xl-modal_flex_box_title">
                                      <span>名義変更（利用権譲渡）</span>
                                      のお手続きをご希望の方はこちらからお進みください
                                    </p>
                                  </a>
                                  <p className="xl-modal_flex_text is-sp">
                                    お手続きには、1回線あたり3,300円（税込）の手数料が発生いたします。
                                    <br />
                                    また、変更後の回線ご名義の方の本人確認書類のアップロードが必要です。
                                  </p>
                                  <a
                                    className="xl-modal_flex_item xl-modal_flex_box"
                                    onClick={(e) => {
                                      this.goNextDisplay(
                                        e,
                                        '/mypage/change/inherit'
                                      )
                                    }}
                                  >
                                    <p className="xl-modal_flex_box_title">
                                      <span>
                                        承継（逝去されたご契約者さまのご契約をご家族の方が引き継ぐ）
                                      </span>
                                      のお手続をご希望の方はこちらからお進みください。
                                    </p>
                                  </a>
                                  <p className="xl-modal_flex_text is-sp">
                                    以下の書類のアップロードが必要です。
                                    <br />
                                    １、相続関係が記載された戸籍謄本（コピーでも有効）※発行から3か月以内のもの
                                    <br />
                                    ２、死亡診断書または葬儀の案内（コピーでも有効）
                                    <br />
                                    ※１の戸籍謄本に契約されていたお客さまの死亡事実が記載されている場合は不要。
                                    <br />
                                    ３、承継されるお客さま（ご家族さま）の本人確認書類
                                  </p>
                                </div>
                                <div className="is-pc">
                                  <div className="xl-modal_flex">
                                    <div className="xl-modal_flex_item">
                                      <p className="xl-modal_flex_text">
                                        改姓・改名を含むお手続きには、１つの本人確認書類の中で変更前と変更後のお名前が記載された書類のアップロードが必要です。
                                      </p>
                                    </div>
                                    <div className="xl-modal_flex_item">
                                      <p className="xl-modal_flex_text">
                                        お手続きには、1回線あたり3,300円（税込）の手数料が発生いたします。
                                        <br />
                                        また、変更後の回線ご名義の方の本人確認書類のアップロードが必要です。
                                      </p>
                                    </div>
                                    <div className="xl-modal_flex_item">
                                      <p className="xl-modal_flex_text">
                                        以下の書類のアップロードが必要です。
                                        <br />
                                        １、相続関係が記載された戸籍謄本（コピーでも有効）※発行から3か月以内のもの
                                        <br />
                                        ２、死亡診断書または葬儀の案内（コピーでも有効）
                                        <br />
                                        ※１の戸籍謄本に契約されていたお客さまの死亡事実が記載されている場合は不要。
                                        <br />
                                        ３、承継されるお客さま（ご家族さま）の本人確認書類
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="xl-modal_overlay"
                                onClick={() =>
                                  this.setState({
                                    changeModal_status: false,
                                  })
                                }
                              ></div>
                            </div>
                          ) : (
                            <div className="xl-modal is-active">
                              <div className="xl-modal_content">
                                <p className="xl-modal_title">
                                  メールアドレス登録のお願い
                                </p>
                                <p className="xl-modal_desc">
                                  メールアドレスの登録が完了しておりません。
                                  <br />
                                  各種お手続きを行う際に、お手続きの申し込み完了やお手続き処理の完了について、メールでお知らせしております。この機会にメールアドレスのご登録をお願い致します。
                                </p>
                                <div className="xl-modal_btns">
                                  <button
                                    className="xl-modal_btn border"
                                    onClick={() =>
                                      this.setState({
                                        emailModal_flag: false,
                                      })
                                    }
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
                                    changeModal_status: false,
                                  })
                                }
                              ></div>
                            </div>
                          ))}
                      </div>
                      {this.state.changeStatus ||
                      this.state.progressApplyNumber ? (
                        <React.Fragment>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={optionArrowDown}
                                alt="arrow"
                                width={48}
                              />
                            </div>
                            <div className="m-form_section t-inner_wide">
                              <h3 className="a-h3 a-fw-normal a-mb-10">
                                以下情報へ変更予定です。
                              </h3>
                              <table className="a-table">
                                <tbody>
                                  <tr>
                                    <th>ご契約者名</th>
                                    <td id="userName">
                                      {this.state.changeCustomerInfo.lastName}　
                                      {this.state.changeCustomerInfo.firstName}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>ご契約者名かな</th>
                                    <td id="userNameKana">
                                      {changeKana(
                                        this.state.changeCustomerInfo
                                          .lastNameKana
                                      )}
                                      　
                                      {changeKana(
                                        this.state.changeCustomerInfo
                                          .firstNameKana
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>郵便番号</th>
                                    <td id="postCode">
                                      {formatZip(
                                        this.state.changeCustomerInfo.zipCode
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>住所</th>
                                    <td id="address">
                                      {this.state.changeCustomerInfo.address1}
                                      {this.state.changeCustomerInfo.address2}
                                      {this.state.changeCustomerInfo.address3}
                                      {this.state.changeCustomerInfo.address4}
                                      {this.state.changeCustomerInfo.address5}
                                      {this.state.changeCustomerInfo.address6}
                                      {/* <br /> */}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>連絡先電話番号</th>
                                    <td id="phoneNumber">
                                      {removehyphen(
                                        this.state.changeCustomerInfo.tel
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="flex-end">
                                お手続きお申し込み日時：
                                {this.state.progressApplyNumber
                                  ? '- - -'
                                  : moment(this.state.changeCommitTime).format(
                                      'YYYY年M月D日H:mm'
                                    )}
                              </div>
                              <div
                                className="flex-end"
                                style={{
                                  fontSize: '1.4rem',
                                }}
                              >
                                お手続き状況につきましては、「
                                <a
                                  href=""
                                  style={{ color: '#B50080' }}
                                  onClick={(e) =>
                                    this.goNextDisplay(
                                      e,
                                      '/mypage/operate/',
                                      this.state.passData[0]
                                    )
                                  }
                                >
                                  マイページ操作履歴
                                </a>
                                」をご確認ください。
                              </div>
                              <div
                                className="flex-end"
                                style={{
                                  fontSize: '1.4rem',
                                }}
                              >
                                ※通知書の受け取り方法に「メールで通知」を指定されている場合、お手続き完了後に完了メールを送信いたします。
                              </div>
                            </div>
                          </div>
                          {this.state.progressApplyNumber && (
                            <React.Fragment>
                              <div
                                style={{
                                  marginTop: '24px',
                                  marginBottom: '82px',
                                }}
                              >
                                <div className="changeBox">
                                  <p
                                    style={{
                                      color: '#b50080',
                                      fontSize: '20px',
                                      lineHeight: '1.7',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    まだ、お手続きが完了しておりません。
                                    <br />
                                    プランとオプションの変更内容をご確認の上、「変更を申請する」ボタンでお手続きを完了してください。
                                  </p>
                                  <div>
                                    <div style={{ marginTop: '24px' }}>
                                      <div
                                        style={{
                                          padding: '16px 0',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <p
                                          style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            lineHeight: '1.7',
                                          }}
                                        >
                                          ◎料金プラン
                                        </p>
                                        <button
                                          className="changeBox_btn"
                                          onClick={() => {
                                            this.setState({ planModal: true })
                                          }}
                                        >
                                          変更する
                                        </button>
                                      </div>
                                      {this.state.selectedPlan && (
                                        <div className="changeBox_plan">
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: '16px',
                                              lineHeight: '1.5',
                                            }}
                                          >
                                            申請中プラン
                                          </p>
                                          <p
                                            style={{
                                              margin: 0,
                                              fontSize: '16px',
                                              lineHeight: '1.5',
                                              fontWeight: 'bold',
                                            }}
                                          >
                                            {selectedPlan_data &&
                                              selectedPlan_data.planName}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ marginTop: '40px' }}>
                                      <p
                                        style={{
                                          margin: 0,
                                          fontSize: '20px',
                                          lineHeight: '1.7',
                                        }}
                                      >
                                        ◎オプション
                                      </p>
                                      <div>
                                        {this.state.changeSimList.map(
                                          (item) => {
                                            const simDetail = getSimDetail(
                                              item.iccid,
                                              this.state.simInfo
                                            )
                                            return (
                                              <div
                                                style={{
                                                  padding: '16px 0',
                                                  display: 'flex',
                                                  justifyContent:
                                                    'space-between',
                                                  alignItems: 'center',
                                                  borderBottom:
                                                    '1px #707070 solid',
                                                }}
                                                key={item.iccid}
                                              >
                                                <p
                                                  style={{
                                                    margin: 0,
                                                  }}
                                                >
                                                  {simDetail.lineNo}
                                                </p>
                                                <button
                                                  className="changeBox_btn"
                                                  onClick={() => {
                                                    this.handleChangeOptionModal(
                                                      simDetail
                                                    )
                                                  }}
                                                >
                                                  変更する
                                                </button>
                                              </div>
                                            )
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    marginTop: '40px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <button
                                    className="formbtn next"
                                    onClick={() => {
                                      this.handleUpdate()
                                    }}
                                  >
                                    更新を申請する
                                  </button>
                                </div>
                                <div
                                  style={{
                                    marginTop: '16px',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    style={{
                                      fontSize: '16px',
                                      lineHeight: '1.7',
                                      textDecoration: 'underline',
                                    }}
                                    onClick={(e) => {
                                      localStorage.removeItem(
                                        'progressApplyNumber'
                                      )
                                      location.reload()
                                    }}
                                  >
                                    名義変更（利用権譲渡）・承継手続きをキャンセルする
                                  </button>
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      ) : (
                        <div>
                          {this.isAddFlag() || this.isCancelFlag() ? (
                            <div className="flex-end">
                              <button
                                className="c-btn is-disabled"
                                onClick={() => {
                                  this.setState({ disabledModal: true })
                                }}
                              >
                                変更を申請する
                              </button>
                            </div>
                          ) : (
                            <div className="flex-end">
                              <button
                                className="c-btn"
                                onClick={() => this.modalHandler()}
                              >
                                変更を申請する
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="m-form_section t-inner_wide">
                      <h3 className="a-fw-normal a-mb-10">◎ログイン設定</h3>
                    </div>
                    <p>メールアドレスとパスワードの変更ができます。</p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">お客さまID</span>
                          </div>
                          <div className="m-field_body">
                            <p className="a-fs-lg a-weak">
                              {window.customerId}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">
                              メールアドレス
                              <br className="a-sp" />
                              {(() => {
                                if (this.state.loginMailAddressFlg === 1) {
                                  return (
                                    <span className="a-fs-sm a-fw-normal">
                                      （ログインで使用中）
                                    </span>
                                  )
                                }
                              })()}
                            </span>
                            <span className="m-btn">
                              <a
                                className="a-btn-change"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(
                                    e,
                                    '/mypage/mail/',
                                    this.state.passData[0]
                                  )
                                }
                              >
                                変更する
                              </a>
                            </span>
                          </div>
                          <div className="m-field_body">
                            {(() => {
                              if (this.state.changeMailHistory) {
                                return (
                                  <p
                                    className="a-fs-lg a-weak"
                                    style={{
                                      color: '#b50080',
                                      fontSize: '1.6rem',
                                    }}
                                  >
                                    変更中（しばらくお待ちください）
                                  </p>
                                )
                              } else if (this.state.mailAddress) {
                                return (
                                  <p className="a-fs-lg a-weak">
                                    {this.state.mailAddress}
                                  </p>
                                )
                              } else {
                                return <p className="a-fs-lg a-weak">未設定</p>
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">パスワード</span>
                            <span className="m-btn">
                              <a
                                className="a-btn-change"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(
                                    e,
                                    '/mypage/operate/password/',
                                    this.state.passData[0]
                                  )
                                }
                              >
                                変更する
                              </a>
                            </span>
                          </div>
                          <div className="m-field_body">
                            <p className="a-fs-lg a-weak">非表示</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="changePaymentInformation">
                      {this.returnChangePaymentMethod()}
                      <div className="notice">
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                          ※ご注意
                        </p>
                        <p>
                          毎月 26日23:30 ～ 27日9:30
                          の間はシステムメンテナンスのため、ご利用いただけません。
                        </p>
                        {(() => {
                          if (this.state.paymentChangeDisabled.status) {
                            let text = this.state.paymentChangeDisabled.text
                              .replace(
                                '{startAt}',
                                this.state.paymentChangeDisabled.startAt
                              )
                              .replace(
                                '{endAt}',
                                this.state.paymentChangeDisabled.endAt
                              )
                            return ReactHtmlParser(text)
                          }
                        })()}
                        {(() => {
                          if (
                            this.state.paymentChangeDisabled.exception &&
                            this.state.paymentChangeDisabled.exception.status
                          ) {
                            let text = this.state.paymentChangeDisabled.exception.text
                              .replace(
                                '{startAt}',
                                this.state.paymentChangeDisabled.exception
                                  .startAt
                              )
                              .replace(
                                '{endAt}',
                                this.state.paymentChangeDisabled.exception.endAt
                              )
                            return ReactHtmlParser(text)
                          }
                        })()}
                      </div>
                    </div>
                    <p>
                      <a
                        href="https://www.aeon.co.jp/campaign/lp/aeoncardwaon_aeonrmb/?dpd=1445&cmp=32209&agr=21000030&ad=22000121%EF%BC%89"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <img
                          src={linkImgCredit}
                          alt="クレジットカードのお申し込み"
                        />
                      </a>
                    </p>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section t-inner_wide">
                      <h3 className="a-fw-normal a-mb-10">◎解約のお申し込み</h3>
                      <p
                        style={{ marginBottom: '20px' }}
                        dangerouslySetInnerHTML={{
                          __html: this.isPracticableCancel().msg,
                        }}
                      ></p>

                      <p className="m-btn">
                        <a
                          className="a-fs-md"
                          href=""
                          onClick={(e) => {
                            if (this.isPracticableCancel().flg) {
                              this.goNextDisplay(
                                e,
                                '/mypage/user/cancellation/procedure/',
                                {
                                  type: '01',
                                  value: {},
                                }
                              )
                            } else {
                              e.preventDefault()
                              return false
                            }
                          }}
                          style={
                            this.isPracticableCancel().flg
                              ? { color: '#b50080' }
                              : { textDecoration: 'none' }
                          }
                        >
                          解約手続き
                        </a>
                      </p>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section t-inner_wide">
                      <h3 className="a-fw-normal a-mb-10">◎他のログイン方法</h3>
                    </div>
                    <p>
                      メールアドレスログインや外部サービスアカウント（Yahoo、Facebook、Google）でのログインの設定ができます。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">メールアドレス</span>
                            <span className="a-label">
                              {' '}
                              {this.state.loginMailAddressFlg === 0 ? (
                                <div> 無効 </div>
                              ) : (
                                <div className="a-primary"> 有効 </div>
                              )}
                            </span>
                          </div>
                          <div className="m-field_body">
                            <p className="m-btn">
                              <a
                                className="a-btn-logo-email a-fs-md a-fs-pc-14"
                                href=""
                                onClick={(e) =>
                                  this.socialLoginHandler(e, 'mail')
                                }
                              >
                                <span
                                  className="a-ic-email"
                                  aria-label="メールアドレス"
                                  role="img"
                                />
                                {this.state.loginMailAddressFlg === 0 ? (
                                  <div>
                                    メールアドレスでログインできるようにする
                                  </div>
                                ) : (
                                  <div>
                                    メールアドレスログイン
                                    <br />
                                    設定を解除する
                                  </div>
                                )}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">YahooID</span>
                            <span className="a-label">
                              {' '}
                              {this.state.loginYahooFlg === 0 ? (
                                <div> 無効 </div>
                              ) : (
                                <div className="a-primary"> 有効 </div>
                              )}
                            </span>
                          </div>
                          <div className="m-field_body">
                            <p className="m-btn">
                              <a
                                className={`a-btn-logo-yahoo a-fs-md a-fs-pc-14${
                                  this.state.loginYahooFlg === 0
                                    ? ''
                                    : ' a-btn-dismiss cancel'
                                }`}
                                href=""
                                onClick={(e) =>
                                  this.socialLoginHandler(e, 'yahoo')
                                }
                              >
                                <span
                                  className="a-ic-yahoo"
                                  aria-label="Y!"
                                  role="img"
                                />
                                {this.state.loginYahooFlg === 0 ? (
                                  <div>
                                    Yahooで
                                    <br />
                                    ログインできるようにする
                                  </div>
                                ) : (
                                  <div>連携を解除する</div>
                                )}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">FacebookID</span>
                            <span className="a-label">
                              {' '}
                              {this.state.loginFacebookFlg === 0 ? (
                                <div> 無効 </div>
                              ) : (
                                <div className="a-primary"> 有効 </div>
                              )}
                            </span>
                          </div>
                          <div className="m-field_body">
                            <p className="m-btn">
                              <a
                                className={`a-btn-logo-facebook a-fs-md a-fs-pc-14${
                                  this.state.loginFacebookFlg === 0
                                    ? ''
                                    : ' a-btn-dismiss cancel'
                                }`}
                                href=""
                                onClick={(e) =>
                                  this.socialLoginHandler(e, 'facebook')
                                }
                              >
                                <span
                                  className="a-ic-facebook"
                                  aria-label="Facebook"
                                  role="img"
                                />
                                {this.state.loginFacebookFlg === 0 ? (
                                  <div>
                                    Facebookで
                                    <br />
                                    ログインできるようにする
                                  </div>
                                ) : (
                                  <div>連携を解除する</div>
                                )}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-field_header">
                            <span className="a-label">GoogleID</span>
                            <span className="a-label">
                              {' '}
                              {this.state.loginGoogleFlg === 0 ? (
                                <div> 無効 </div>
                              ) : (
                                <div className="a-primary"> 有効 </div>
                              )}
                            </span>
                          </div>
                          <div className="m-field_body">
                            <p className="m-btn">
                              <a
                                className={`a-btn-logo-google a-fs-md a-fs-pc-14${
                                  this.state.loginGoogleFlg === 0
                                    ? ''
                                    : ' a-btn-dismiss cancel'
                                }`}
                                href=""
                                onClick={(e) =>
                                  this.socialLoginHandler(e, 'google')
                                }
                              >
                                <span
                                  className="a-ic-google"
                                  aria-label="Google"
                                  role="img"
                                />
                                {this.state.loginGoogleFlg === 0 ? (
                                  <div>
                                    Googleで
                                    <br />
                                    ログインできるようにする
                                  </div>
                                ) : (
                                  <div>連携を解除する</div>
                                )}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section t-inner_wide">
                      <h3 className="a-fw-normal a-mb-10">
                        ◎お客さまID統合時の2段階認証設定について(データ〔SMSなし〕回線契約専用)
                      </h3>
                    </div>
                    <p>
                      ①Google認証アプリ（Google
                      Authenticator）をインストールします。
                      <br />
                      &emsp;※以下のリンクよりアプリをダウンロードの上、インストールいただけます。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_edit">
                          <div className="m-app" style={{ marginTop: '4rem' }}>
                            <h4 className="m-app_ttl">
                              Google Authenticatorアプリのダウンロード
                            </h4>
                            <ul className="m-app_btn">
                              <li className="m-app_btn_item">
                                <a
                                  href="https://apps.apple.com/jp/app/google-authenticator/id388497605"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <img
                                    src={btnAppStore}
                                    alt="App Storeからダウンロード"
                                  />
                                </a>
                              </li>
                              <li className="m-app_btn_item">
                                <a
                                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <img
                                    src={btnGooglePlay}
                                    alt="Google Playで手に入れよう"
                                  />
                                </a>
                              </li>
                            </ul>
                            <p>
                              ※アプリ対象端末:iOS9.0以上、Android
                              4.4.4以降を搭載したスマートフォン。
                            </p>
                          </div>
                          <div className="m-field_body">
                            <p>
                              ②アプリのインストール後、認証コードを払い出します。
                              <br />
                              認証コードの払い出しは、Google
                              Authenticatorアプリをインストール後、以下の「
                              Google
                              Authenticator連携はこちら」をタップ（クリック）下さい。
                            </p>
                            <p className="m-btn">
                              <a
                                className="a-fs-md a-fs-pc-14"
                                href=""
                                onClick={(e) => {
                                  this.goNextDisplay(e, '/mypage/user/ga/')
                                }}
                                style={{ color: '#b50080' }}
                              >
                                Google Authenticator連携はこちらから
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
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
              <div className="t-modal_content">
                <div className="m-modal">
                  <div
                    className="m-modal_inner"
                    style={{ textAlign: 'center' }}
                  >
                    <p>
                      只今システムメンテナンス中です。
                      <br />
                      恐れ入りますが終了後、ご利用ください。
                      <br />
                      何卒ご理解の程、お願い申し上げます。
                    </p>
                    <p style={{ fontSize: '1.4rem' }}>
                      毎月 26日23:30 ～ 27日9:30
                      の間はシステムメンテナンスのため、ご利用いただけません。
                    </p>
                    <p className="m-btn">
                      <button
                        className="a-btn-dismiss"
                        type="button"
                        onClick={() => {
                          $('.t-modal').removeClass('is-active')
                          $('.t-modal_content').removeClass('is-active')
                          $('#modal_customer.t-modal_content').removeClass(
                            'is-active'
                          )
                        }}
                      >
                        閉じる
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.optionModal && (
          <div className="ulModal">
            <div className="ulModal_main" style={{ overflow: 'auto' }}>
              <div className="ulModal_content">
                <p className="a-h1">オプションのご変更</p>
                <div className="m-form">
                  <p style={{ marginBottom: '1.5em' }}>
                    加入したいオプションを選択してください。
                  </p>
                  <div className="option_box">
                    <ul>
                      <li>
                        ・
                        <img
                          src={icon_help}
                          style={{
                            marginRight: '0.2em',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                        からオプションサービスの詳細がご覧頂けます。
                      </li>
                      <li>
                        ・加入中のオプションを止める場合は、廃止ボタンを押して下さい。
                      </li>
                      <li>
                        ・他のオプションを選んでいる場合に、加入不可となるオプションがあります。
                      </li>
                    </ul>
                  </div>
                  {this.state.options &&
                    this.state.options.map((category) => {
                      return (
                        <div className="option_table" key={category.categoryId}>
                          {category.optionList.map((item) => {
                            const id = item.optionServiceId
                            const isChecked = this.isChecked(id)
                            // 加入中
                            const isJoin = this.isJoin(id)
                            // 加入不可
                            const isDisabled = this.isDisabled(item)
                            // 廃止予定
                            const isCancel = this.isCancel(id)
                            // 強制廃止
                            const isCancelDefault = this.isCancelDefault(id)

                            let className = 'option_table_item'
                            let msg = ''

                            if (isDisabled) {
                              className = 'option_table_item disable'
                              msg = '加入不可'
                            } else if (isJoin && !isCancel) {
                              className = 'option_table_item join'
                              msg = '加入中'
                            } else if (isCancel) {
                              className = 'option_table_item abolition'
                              msg = '廃止予定'
                            } else if (isChecked) {
                              className = 'option_table_item entry'
                              msg = '加入予定'
                            }
                            return (
                              <div className={className} key={id}>
                                <div className="option_table_main">
                                  <label className="option_table_checkbox">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      value={id}
                                      onChange={this.handleChangeOption}
                                    />
                                    <span className="option_table_check_label">
                                      <span>{item.optionName}</span>
                                      <span className="option_table_price">
                                        {'税込み' + item.price + '円'}
                                      </span>
                                    </span>
                                  </label>
                                  {(item.optionName ===
                                    'イオンモバイルセキュリティPlus' ||
                                    item.optionName === 'Filii') && (
                                    <span className="option_txt_free">
                                      ※初月無料
                                    </span>
                                  )}

                                  {item.optionName ===
                                    'イオンモバイルセキュリティPlus' && (
                                    <a href="" className="option_txt_note">
                                      イオンモバイルセキュリティPlusのご利用注意事項について
                                    </a>
                                  )}
                                </div>
                                {this.returnHelpBtn(item.optionServiceId)}
                                <div className="option_table_msg">{msg}</div>
                                <div className="option_table_status">
                                  {isJoin && !isCancelDefault && (
                                    <button
                                      onClick={() => this.handleAdolition(id)}
                                      disabled={isCancelDefault}
                                    >
                                      {isCancel ? 'キャンセル' : '廃止'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}

                  <p
                    style={{
                      marginBottom: '25px',
                      fontsize: '14px',
                      lineHeight: '1.4',
                    }}
                  >
                    「イオンでんわ」と「イオンでんわフルかけ放題」「イオンでんわ10分かけ放題」「イオンでんわ5分かけ放題」「やさしい10分かけ放題」は、プレフィックスサービスを利用した音声通話サービスです。
                    <br />
                    専用の「イオンでんわアプリ」から発信いただくか、プレフィックス番号を用いて発信いただく必要があります。
                    <br />
                    ※NTTドコモ回線のみ、国際通話と一部の例外番号を除き自動的にプレフィックス番号が適用されます
                    <br />
                    <br />
                    「050かけ放題」はインターネット回線（IP電話）を利用した定額通話サービスです。
                    <br />
                    ご利用には専用のアプリが必須です。
                  </p>
                </div>
              </div>

              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ optionModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.hadnleSubmitOption()}
                  disabled={
                    JSON.stringify(this.state.options_default) ===
                      JSON.stringify(this.state.options_selected) &&
                    this.state.options_cancel.length == 0
                  }
                >
                  上記内容で申し込む
                </button>
              </div>
            </div>
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
                  {this.isAddFlag() && '・シェア追加中のため申し込みできません'}
                  {this.isCancelFlag() &&
                    '・解約処理中のため申し込みできません'}
                </h2>
              </div>
            </div>
          </div>
        )}
        {this.state.planModal && (
          <div className="ulModal">
            <div className="ulModal_main" style={{ overflow: 'auto' }}>
              <div className="ulModal_content">
                <p className="a-h1">料金プランのご変更</p>
                <div className="m-form">
                  <div className="t-inner_wide">
                    <p className="a-h3 a-fw-normal a-mb-5">
                      ◎ご利用中の料金プラン
                    </p>
                    <div className="m-box-bg a-ta-center">
                      <p className="a-h3">{this.state.lineInfo[0].planName}</p>
                    </div>
                  </div>
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
                  <div className="t-inner_wide">
                    <p className="a-h3 a-fw-normal a-mb-5">◎プラン一覧</p>
                    <div className="m-field">
                      <select
                        className="a-select"
                        id="planId"
                        onChange={(e) => this.handleChangePlan(e)}
                      >
                        <option value="">
                          変更後のプランをお選びください。
                        </option>
                        {this.item}
                      </select>
                    </div>
                    <div className="m-box">
                      <div className="m-box_body">
                        <p className="a-h3">ご確認ください</p>
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
                          <li>
                            お申込み内容、「ご確認ください」をご確認いただき
                            <span className="a-primary">
                              「同意します」にチェック
                            </span>
                            を入れてお申し込みください。
                          </li>
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
                            checked={!this.state.btnDisabled}
                            onClick={() =>
                              this.setState({
                                btnDisabled: !this.state.btnDisabled,
                              })
                            }
                          />
                          <span className="a-weak">同意します</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ planModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  disabled={!this.state.selectedPlan || this.state.btnDisabled}
                  onClick={() => {
                    this.submitPlanChange()
                  }}
                >
                  更新する
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.receptModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div
                className="ulModal_content"
                style={{
                  borderBottom: '1px solid rgba(34,36,38,.15)',
                }}
              >
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  各種完了通知書のお受け取り方法について
                </h3>
                <p
                  style={{
                    fontSize: '20px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                  }}
                >
                  現在、各種完了通知書のお受け取り方法が「郵送」になっております。
                  <br />
                  「メールで通知」に変更すると、発行されたらすぐにメールで通知が受け取れるので
                  大変便利です。
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.8',
                  }}
                >
                  ※お電話又は店頭にて、同日中に複数回の情報変更をお申込みされた場合、郵政にて通知書を送付させていただく場合がございます。
                  <br />
                  ※お手続き完了とお手続きに不備があった場合には通知書の受け取り方法に関わらずメールで状況のみお知らせ致します。
                  <br />
                  ※設定した受け取り方法は、今後のすべての完了通知書に適用されます。
                  {this.state.mailAddress.length == 0 && (
                    <small>
                      <br />
                      ※メールで通知を受け取る場合、
                      <a
                        href="#"
                        onClick={() =>
                          this.headerUrlHandler(
                            '/mypage/user/',
                            this.state.url_data[0].pass_data
                          )
                        }
                      >
                        メールアドレスの設定
                      </a>
                      をお願いいたします
                    </small>
                  )}
                </p>
              </div>
              <div className="ulModal_content">
                <div>
                  <div className="ulModal_check">
                    <label className="ui_radio">
                      <input
                        type="radio"
                        name="notification"
                        value="1"
                        onChange={() => this.setState({ notice_status: '1' })}
                        checked={this.state.notice_status === '1'}
                      />
                      <span className="ui_radio_label">郵送</span>
                    </label>
                  </div>
                  <div className="ulModal_check">
                    <label className="ui_radio">
                      <input
                        type="radio"
                        name="notification"
                        value="2"
                        onChange={() => this.setState({ notice_status: '2' })}
                        checked={this.state.notice_status === '2'}
                        disabled={this.state.mailAddress.length == 0}
                      />
                      <span className="ui_radio_label">メールで通知</span>
                    </label>
                  </div>
                </div>
                {this.state.mailAddress.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.8',
                      }}
                    >
                      ※変更まで数分かかります。
                    </p>
                    <p
                      style={{
                        marginTop: '24px',
                        fontSize: '20px',
                        lineHeight: '1.7',
                        fontWeight: 'bold',
                      }}
                    >
                      受取先のメールアドレス
                    </p>
                    <div
                      style={{
                        padding: '29px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '14px',
                        backgroundColor: '#E0E0E0',
                        border: '1px #707070 solid',
                      }}
                    >
                      <p
                        style={{
                          margin: '0',
                          fontSize: '20px',
                          lineHeight: '1.7',
                          fontWeight: 'bold',
                        }}
                      >
                        {this.state.mailAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ receptModal: false })}
                >
                  閉じる
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  更新する
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.helpModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p
                  style={{
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={icon_help}
                    alt="help"
                    width="16"
                    style={{ marginRight: '0.75rem' }}
                  />
                  {this.state.helpTitle}
                </p>
              </div>
              <div
                className="ulModal_content"
                style={{ fontSize: '1.68rem', lineHeight: 1.6 }}
              >
                {this.state.helpDescription}
              </div>
              <div
                className="ulModal_content"
                style={{
                  color: '#000000',
                  fontSize: '1.4rem',
                  lineHeight: 1.4,
                }}
              >
                {this.state.helpComment}
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setState({ helpModal: false })
                  }}
                >
                  閉じる
                </button>
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
    url: postReducer.url,
    parameters: postReducer.parameters,
    type: postReducer.type,
    paymentError: postReducer.paymentError,
  }
}

export default connect(mapStateToProps)(User)
