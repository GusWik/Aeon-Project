// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

import Validations from '../../../Validations'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'
import {
  getToken,
  getApplyNumber,
  getAppInfo,
  getService,
} from '../../../../actions/ArsActions'
import {
  getPlanList,
  getSimInfoEnable,
  getSimKind,
  toHalfWidth,
} from '../../../../actions/Methods.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'

import MessageArea from '../../../form/MessageArea'

import icon_help from '../../../../modules/images/icon_q.png'

const relationshipOptions = [
  { key: 0, value: '本人', text: '本人' },
  { key: 1, value: '父', text: '父' },
  { key: 2, value: '母', text: '母' },
  { key: 3, value: '妻', text: '妻' },
  { key: 4, value: '夫', text: '夫' },
  { key: 5, value: '子', text: '子' },
  { key: 6, value: '祖父', text: '祖父' },
  { key: 7, value: '祖母', text: '祖母' },
  { key: 8, value: '孫', text: '孫' },
  { key: 9, value: 'その他', text: 'その他' },
]

const planText = [
  { key: '01', value: '音声プラン' },
  { key: '02', value: 'データプラン' },
  { key: '03', value: 'シェアプラン' },
  { key: '11', value: 'やさしい音声プラン' },
  { key: '12', value: 'やさしいデータプラン' },
  { key: '13', value: 'やさしいシェア音声プラン' },
  { key: 'a01', value: 'APP音声プラン' },
  { key: 'a02', value: 'APPデータプラン' },
  { key: 'a03', value: 'APPシェア音声プラン' },
]
class Plan_edit extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeRelationship = this.handleChangeRelationship.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)

    this.sendApiName = ''

    this.state = {
      planAppModal: false,
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
      mailAddress: '',
      applyNumber: '',
      planKind: '',
      planNum: '',
      customerType: '',
      limitedType: '',
      currentType: '',
      selectedPlan: '',
      appFlag: '',
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      receptModal: false, // isCheckSameName用モーダル
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
      simInfo_enable: [],
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
      customerInfo: {},
      valid_state: false,
      isStop: false,
      mousikomiType: '',
      btnDisabled: true,
      studentDiscountEnds: false,
      nextPlan: null,
      nextPlanName: '',
      redirectApp:
        props.history.location.state !== undefined &&
        props.history.location.state.redirectApp === true
          ? true
          : false,
      isADFSLogined: false,
      isKind: false,
      aboutJisModal: false,
      aeonPeople: {},
      aeonPeopleFlag: 0,
      imageInfo: {
        certificateNumber: '',
        certificateTypeCode: '',
        imageDataList: [],
      },
      error: {
        'aeonPeople.employeeNumber': {},
        'aeonPeople.lastName': {},
        'aeonPeople.firstName': {},
        'aeonPeople.lastNameKana': {},
        'aeonPeople.firstNameKana': {},
        'aeonPeople.companyName': {},
        'aeonPeople.companyCode': {},
        'aeonPeople.departmentName': {},
        'aeonPeople.position': {},
        'aeonPeople.tel': {},
        'aeonPeople.relationship': {},
        'aeonPeople.signature': {},
      },
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
      const simKind = getSimKind(this.state.simInfo)

      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineDiv: this.state.lineInfo[0].lineDiv,
        gender: this.state.customerInfo.gender,
        simKind,
        appFlag: this.state.appFlag,
        limitedType: this.state.limitedType,
      }
    } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerInfoGetFlg: '1',
        tokenFlg: '1',
        simGetFlg: '',
        sessionNoUseFlg: '1',
        customerId: window.customerId,
        lineKeyObject: '',
      }
    } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
      params = {
        customerId: window.customerId,
      }
    } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
      params = {
        customerId: window.customerId,
        status: this.state.notice_status,
        token: this.state.notification.token,
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
    if (token) this.setState({ token })
    this.setState({ loading_state: false })

    if (status === Const.CONNECT_SUCCESS) {
      var params = data.data
      console.log('----data')
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

        // }
        console.log(params.planId)
        this.getPlanNum()
      } else if (type === Const.CONNECT_TYPE_CHANGING_PLAN_MST) {
        this.setState({ selectedPlan: '' })
        this.setState({ planMst: params.plan })
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        const params = data.data
        const mailAddress = data.data.mailAddress
        const notice_status = mailAddress.length > 0 ? '2' : '1'

        this.setState({ customerInfo: params.customerInfo })
        this.setState({ notice_status, mailAddress })
        this.checkKind()

        /* this.setState({
          groupActivateDate: groupActivateDate,
        }) */
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        console.log(data.data)
        this.setState({ notification: data.data })
        //this.setState({ notice_status: data.data.status })
        //
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        //通知設定の更新
      }
    } else if (status === Const.CONNECT_ERROR) {
      //
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
    await Validations.initialize()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_PLAN
    this.handleConnect(Const.CONNECT_TYPE_PLAN)
    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
    this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
    this.checkBox()
    const { result } = await getAppInfo()
    if (result !== 'NG' && result.user_id) {
      $('.t-main').addClass('isADFSLogined')
      $('.t-header').addClass('isADFSLogined')
      const aeonPeople = {
        employeeNumber: result.user_id,
        lastName: result.sei,
        firstName: result.mei,
        lastNameKana: '',
        firstNameKana: '',
        companyName: result.company,
        companyCode: result.company_code,
        departmentName: result.department,
        position: result.title,
        tel: [],
        relationship: 0,
      }

      this.setState({ isADFSLogined: true, aeonPeople, aeonPeopleFlag: 1 })
      console.log(result)
    } else if (this.state.redirectApp) {
      this.setState({ planAppModal: true })
    }

    // 解約状態の回線を除いた配列
    const simInfo_enable = getSimInfoEnable(this.state.simInfo)
    this.setState({ simInfo_enable })
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
    console.log(planNum)
    this.setState({ planNum, customerType })
  }

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする
    let simKind =
      this.state.customerInfo.sharePlanFlag == 1
        ? '04'
        : getSimKind(this.state.simInfo)

    console.log(simKind)
    var simLists = [
      {
        simKind: simKind,
      },
    ]

    let body = {
      applyNumber: this.state.applyNumber,
      commitFlag: 1,
      receptionKbn: 4,
      receptionistKbn: 2,
      customerId: window.customerId,
      planServiceId: this.state.selectedPlan,
      customerInfoType: '305',
      simList: simLists,
      token,
      receptionStoreCode: '',
      receptionistCode: '',
      receptionistName: '',
      agencyCode: '',
      incentiveCode: '',
      joinRoute: '',
    }

    let aeonPeopleFlag =
      this.state.aeonPeopleFlag || this.state.customerInfo.aeonPeopleFlag
        ? 1
        : 0

    const customerInfo = {
      employeeNumber: this.state.aeonPeople.employeeNumber,
      employeeName:
        this.state.aeonPeople.lastName + '　' + this.state.aeonPeople.firstName,
      companyName: this.state.aeonPeople.companyName,
      aeonPeopleFlag: aeonPeopleFlag,
    }

    if (this.state.aeonPeopleFlag == 1) {
      body.imageInfo = this.state.imageInfo
      body.customerInfo = customerInfo
    } else if (aeonPeopleFlag && this.state.appFlag == 1) {
      //すでに従業員の方のプラン変更、かつ変更先もAPP
      body.customerInfo = {
        aeonPeopleFlag: aeonPeopleFlag,
      }
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

    return fetch(Const.ARS_UPDATE_APPLY_INFO, params)
      .then((res) => {
        if (!res.ok) {
          //
        } else {
          return res.json()
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((error) => {
        console.error(error)
      })
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()

    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/mypage/plan/edit/complete/') {
      console.log('遷移')
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = window.customerId
      params.customerInfo = this.state.customerInfo
      params.lineInfo = this.state.lineInfo
      params.simInfo = this.state.simInfo
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

  handleChangeRelationship(e) {
    const value = e.target.value
    this.setAPPValue('relationship', value)
  }

  validateForm(apiName, key, required) {
    let validation = Validations.validationCheck(this, apiName, key, required)

    let error = this.state.error
    error[key] = validation
    this.setState({ error })
    return error[key].result === 'OK'
  }

  setAPPValue(key, value, index) {
    const aeonPeople = _.cloneDeep(this.state.aeonPeople)
    switch (key) {
      case 'employeeNumber':
        aeonPeople[key] = toHalfWidth(value)
        break
      case 'companyCode':
        aeonPeople[key] = toHalfWidth(value)
        break
      case 'tel':
        aeonPeople.tel[index] = toHalfWidth(value)
        const telLength = aeonPeople.tel.join('').length
        // 桁数チェック（11桁以下）
        if (telLength <= 11) {
          aeonPeople[key][index] = toHalfWidth(value)
        }
        break
      default:
        console.log(aeonPeople[key])
        aeonPeople[key] = value
        break
    }
    this.setState({ aeonPeople })
  }

  handleChangeInput(e, key, index) {
    if (key.startsWith('aeonPeople.')) {
      console.log('aeonPeople')
      key = key.substring(11)
      this.setAPPValue(key, e.target.value, index)
      return
    }
  }

  validateTelOnBlur(appFlag) {
    if (appFlag) {
      if (
        this.state.aeonPeople.tel[0] &&
        this.state.aeonPeople.tel[1] &&
        this.state.aeonPeople.tel[2]
      ) {
        this.validateForm('ARS002-A008', 'aeonPeople.tel')
      }
    } else {
      if (
        this.state.formState.customerInfo.tel[0] &&
        this.state.formState.customerInfo.tel[1] &&
        this.state.formState.customerInfo.tel[2]
      ) {
        this.validateForm('ARS002-A008', 'customerInfo.tel')
      }
    }
  }

  validateAPPForm() {
    // APP用のバリデーション
    /*
    let appImage = _.find(
      this.state.formState.imageInfo.imageDataList,
      (item) => item.imageType === 3
    )
    if (
      this.state.formState.customerInfo.aeonPeopleFlag === 0 ||
      (this.state.formState.customerInfo.aeonPeopleFlag === 1 && appImage)
    ) {
      return true
    } */
    let validation01 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.employeeNumber',
      true
    )
    let validation02 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.lastName',
      true
    )
    let validation03 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.firstName',
      true
    )
    let validation04 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.lastNameKana',
      true
    )
    let validation05 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.firstNameKana',
      true
    )
    let validation06 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.companyName',
      true
    )
    let validation07 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.companyCode',
      true
    )
    let validation08 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.departmentName',
      true
    )
    let validation09 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.position',
      true
    )
    let validation10 = this.validateForm('ARS002-A008', 'aeonPeople.tel', true)
    return (
      validation01 &&
      validation02 &&
      validation03 &&
      validation04 &&
      validation05 &&
      validation06 &&
      validation07 &&
      validation08 &&
      validation09 &&
      validation10
    )
  }

  validateAllForm() {
    if (this.state.aeonPeopleFlag == 0) {
      return true
    }
    // 一度エラーメッセージ表示になっている要素は非表示に
    let _e = this.state.error
    Object.keys(_e).map((key) => {
      _e[key] = { result: 'OK' }
    })
    this.setState({ error: _e })

    const isValidAPP = this.validateAPPForm() // APP用のバリデーション 必要?
    return isValidAPP
  }

  handleSelectChange(e, value) {
    console.log(value)
    let appFlag =
      value === 'a01' || value === 'a02' || value === 'a03' ? '1' : '0'
    let limitedType = 0
    if (value === 'a01' || value === 'a02' || value === 'a03') {
      if (value === 'a01') {
        limitedType = '01'
      } else if (value === 'a02') {
        limitedType = '02'
      } else if (value === 'a03') {
        limitedType = '03'
      }
    } else {
      limitedType = value
    }

    this.setState(
      () => {
        return { limitedType, appFlag, currentType: value }
      },
      () => {
        this.handleConnect(Const.CONNECT_TYPE_CHANGING_PLAN_MST)
      }
    )
  }

  selectList() {
    if (!this.state.planNum) {
      return
    }

    const isAppuser = this.state.isADFSLogined || this.state.customerType === 3

    const plan_list = getPlanList(
      this.state.planNum,
      isAppuser,
      this.state.isKind,
      this.state.lineInfo[0].lineDiv,
      this.state.simInfo_enable.length > 1 ? true : false // 1回線以下の場合 isMulti=true
    )

    const items =
      plan_list.length > 0 &&
      plan_list.map((item) => {
        const text = planText.find((ele) => ele.key === item)
        return (
          <div key={item.key}>
            <label className="circle_radio">
              <input
                type="radio"
                checked={this.state.currentType === text.key}
                onChange={(e) => {
                  this.handleSelectChange(e, text.key)
                  /* this.setState({ limitedType: text.key }) */
                  /*  this.handleChangeCategory() */
                }}
                value={text.key}
              />
              <span className="circle_radio_label">{text.value}</span>
            </label>
          </div>
        )
      })
    return items
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

  handleChangePlan(e) {
    console.log(e.target.value)
    const selectedPlan = e.target.value
    this.setState({ selectedPlan })
  }

  fileUpload(url, type) {
    if (type === 'canvas') {
      url = url.toDataURL('image/png')
    }
    const imageFile = url.replace(`data:image/png;base64,`, '')
    const body = {
      imageFile,
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
    return fetch(Const.ARS_SAVE_IMAGE, params)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        if (resJson && resJson.data.imageId) {
          let imageInfo = _.cloneDeep(this.state.imageInfo)
          imageInfo.imageDataList.push({
            imageId: resJson.data.imageId,
            imageType: 3, // 固定
          })
          this.setState({ imageInfo })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async canvesAppForm() {
    const node = document.getElementById('appForm')
    if (node) {
      let options = {}
      let scrollY = window.scrollY || window.pageYOffset
      let width = node.clientWidth
      let height = node.clientHeight
      let userAgent = window.navigator.userAgent.toLowerCase()
      if (
        userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1
      ) {
        // IE11
        options = {
          x: 0,
          scrollX: 0,
          scrollY: -scrollY - 50,
          width,
          height: height * 1.5,
          windowWidth: width,
        }
        await html2canvas(node, options).then(async (canvas) => {
          await this.fileUpload(canvas, 'canvas')
        })
      } else if (
        userAgent.indexOf('iphone') != -1 ||
        userAgent.indexOf('ipad') != -1 ||
        (userAgent.indexOf('mozilla') != -1 &&
          userAgent.indexOf('mobile') != -1)
      ) {
        // iPhone or iPad
        await domtoimage.toPng(node).then(
          async function (dataUrl) {
            await this.fileUpload(dataUrl, 'url')
          }.bind(this)
        )
      } else {
        // その他
        options = {
          scrollX: 0,
          scrollY: -scrollY,
        }
        await html2canvas(node, options).then(async (canvas) => {
          await this.fileUpload(canvas, 'canvas')
        })
      }
    }
    console.log('end')
  }

  async handleSubmit() {
    const applyNumber = await getApplyNumber()
    if (applyNumber) {
      const token = await getToken(applyNumber)
      this.setState({ applyNumber })
      if (this.state.aeonPeopleFlag == 1) {
        await this.canvesAppForm()
      }
      await this.updateApplyInfo(token)

      if (this.state.notification.status === '1') {
        this.setState({ receptModal: true })
      } else {
        this.goNextDisplay(null, '/mypage/plan/edit/complete/')
      }
    }
  }

  async submitNotification() {
    if (this.state.notice_status !== this.state.notification.status) {
      this.handleConnect(Const.CONNECT_TYPE_INSERT_NOTIFICATION)
      console.log('更新')
    }

    //this.goNextDisplay(null, '/')
    console.log('更新２')
    this.goNextDisplay(null, '/mypage/plan/edit/complete/')
  }

  render() {
    this.item = this.state.planMst.map((item) => (
      <option
        value={item.planId}
        key={item.planId}
        selected={this.state.selectedPlan == item.planId}
      >
        {item.planName}
      </option>
    ))

    this.make_a_plan = (
      <li>
        お申込み内容、「ご確認ください」をご確認いただき
        <span className="a-primary">「同意します」にチェック</span>
        を入れてお申し込みください。
      </li>
    )

    return (
      <React.Fragment>
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

                  {this.state.aeonPeopleFlag == 1 && (
                    <div
                      className="ui container"
                      style={{
                        margin: '10px auto',
                        padding: '10px',
                        backgroundColor: '#fff',
                      }}
                    >
                      <h1 className="headTitle">従業員情報入力</h1>
                      <div className="ui form">
                        <div id="appForm" style={{ paddingBottom: '1rem' }}>
                          <div style={{ margin: '1rem' }}>
                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                社員番号
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.employeeNumber"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.employeeNumber'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.employeeNumber'
                                        )
                                      }
                                      placeholder="0105H000000"
                                      type="text"
                                      value={
                                        this.state.aeonPeople.employeeNumber
                                      }
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                      //disabled={this.props.isAddressError}
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.employeeNumber'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                従業員名
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.lastName"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.lastName'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.lastName'
                                        )
                                      }
                                      placeholder="姓"
                                      type="text"
                                      value={this.state.aeonPeople.lastName}
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                      //disabled={this.props.isAddressError}
                                    />
                                  </li>
                                  <li>
                                    <input
                                      id="aeonPeople.firstName"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.firstName'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.firstName'
                                        )
                                      }
                                      placeholder="名"
                                      type="text"
                                      value={this.state.aeonPeople.firstName}
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                      //disabled={this.props.isAddressError}
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.lastName'}
                                />
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.firstName'}
                                />

                                <div id="appFormNotes">
                                  <p
                                    className="noteText"
                                    style={{
                                      marginBottom: '0',
                                      padding: '0',
                                      textIndent: '0',
                                    }}
                                  >
                                    髙や﨑などの異字体・ローマ数字などは名前及び住所の入力にご利用いただけません。
                                  </p>
                                  <p
                                    className="noteText"
                                    style={{
                                      marginBottom: '0',
                                      padding: '0',
                                      textIndent: '0',
                                    }}
                                  >
                                    ご利用できない文字が含まれる場合は恐れ入りますが、新字体・カタカナ又は数字などにて入力ください。
                                  </p>
                                  <p
                                    className="noteText"
                                    style={{
                                      display: 'table',
                                      marginBottom: '0',
                                      paddingLeft: '0',
                                      textIndent: '0',
                                    }}
                                  >
                                    <a
                                      href="javascript:void(0)"
                                      onClick={() => {
                                        this.setState({ aboutJisModal: true })
                                      }}
                                      style={{ display: 'table-cell' }}
                                    >
                                      ご利用いただけない文字について
                                    </a>
                                    <img
                                      src={icon_help}
                                      style={{ display: 'table-cell' }}
                                      alt="help"
                                      width="16"
                                    />
                                  </p>
                                  <p
                                    className="noteText"
                                    style={{ marginBottom: 0 }}
                                  >
                                    ※ご利用できない文字が含まれる場合を除き、画像をアップロードされる本人確認書類と同じ漢字をご入力ください。
                                  </p>
                                  <p className="noteText">
                                    ※漢字が環境依存文字の場合は常用漢字をご入力ください。
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                従業員名
                                <span className="textFormat">（カタカナ）</span>
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.lastNameKana"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.lastNameKana'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.lastNameKana'
                                        )
                                      }
                                      placeholder="セイ"
                                      type="text"
                                      value={this.state.aeonPeople.lastNameKana}
                                    />
                                  </li>
                                  <li>
                                    <input
                                      id="aeonPeople.firstNameKana"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.firstNameKana'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.firstNameKana'
                                        )
                                      }
                                      placeholder="メイ"
                                      type="text"
                                      value={
                                        this.state.aeonPeople.firstNameKana
                                      }
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.lastNameKana'}
                                />
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.firstNameKana'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                会社名（正式名称）
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.companyName"
                                      maxLength="100"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.companyName'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.companyName'
                                        )
                                      }
                                      placeholder="イオンリテール株式会社"
                                      type="text"
                                      value={this.state.aeonPeople.companyName}
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.companyName'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                会社コード
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.companyCode"
                                      maxLength="100"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.companyCode'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.companyCode'
                                        )
                                      }
                                      placeholder="0105"
                                      type="text"
                                      value={this.state.aeonPeople.companyCode}
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.companyCode'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                所属名（正式名称）
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.departmentName"
                                      maxLength="100"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.departmentName'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.departmentName'
                                        )
                                      }
                                      placeholder="住居余暇・H＆BC本部アプライアンス商品部イオンモバイルユニット システム統括G"
                                      type="text"
                                      value={
                                        this.state.aeonPeople.departmentName
                                      }
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.departmentName'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                役職、担当等
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.position"
                                      maxLength="100"
                                      onBlur={(e) =>
                                        this.validateForm(
                                          'ARS002-A008',
                                          'aeonPeople.position'
                                        )
                                      }
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.position'
                                        )
                                      }
                                      placeholder="商品部〇〇担当"
                                      type="text"
                                      value={this.state.aeonPeople.position}
                                      style={{ backgroundColor: '#e5e5e5' }}
                                      readOnly
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.position'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                所属部署電話番号
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <input
                                      id="aeonPeople.position"
                                      maxLength="4"
                                      onBlur={(e) => this.validateTelOnBlur(1)}
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.tel',
                                          0
                                        )
                                      }
                                      placeholder="090"
                                      type="tel"
                                      value={this.state.aeonPeople.tel[0]}
                                    />
                                  </li>
                                  <li>
                                    <input
                                      id="aeonPeople.position"
                                      maxLength="4"
                                      onBlur={(e) => this.validateTelOnBlur(1)}
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.tel',
                                          1
                                        )
                                      }
                                      placeholder="1234"
                                      type="tel"
                                      value={this.state.aeonPeople.tel[1]}
                                    />
                                  </li>
                                  <li>
                                    <input
                                      id="aeonPeople.position"
                                      maxLength="4"
                                      onBlur={(e) => this.validateTelOnBlur(1)}
                                      onChange={(e) =>
                                        this.handleChangeInput(
                                          e,
                                          'aeonPeople.tel',
                                          2
                                        )
                                      }
                                      placeholder="5678"
                                      type="tel"
                                      value={this.state.aeonPeople.tel[2]}
                                    />
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  param={'aeonPeople.tel'}
                                />
                              </div>
                            </div>

                            <div className="fotmItem">
                              <div className="formTitle">
                                <span className="icon-required">必須</span>
                                従業員との関係
                              </div>
                              <div className="formInput">
                                <ul className="inlineFormArea">
                                  <li>
                                    <select
                                      onChange={this.handleChangeRelationship}
                                      style={{ width: '224px' }}
                                    >
                                      {relationshipOptions.map((item) => {
                                        const selected =
                                          this.state.aeonPeople.relationship ==
                                          item.key
                                            ? true
                                            : false

                                        return (
                                          <option
                                            key={item.key}
                                            value={item.value}
                                            selected={selected}
                                          >
                                            {item.text}
                                          </option>
                                        )
                                      })}
                                    </select>
                                  </li>
                                </ul>
                                <MessageArea
                                  error={this.state.error}
                                  index={this.state.index}
                                  param={'aeonPeople.relationship'}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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

                    <div className="t-inner_wide" key="plan_change">
                      {this.selectList()}
                      <h2 className="a-h3 a-fw-normal a-mb-5">◎プラン一覧</h2>
                      <div className="m-field">
                        <select
                          className="a-select"
                          id="planId"
                          onChange={(e) => this.handleChangePlan(e)}
                        >
                          <option
                            value=""
                            selected={this.state.selectedPlan == ''}
                          >
                            変更後のプランをお選びください。
                          </option>
                          {this.item}
                        </select>
                        <div
                          className="m-field_error a-error"
                          id="planId_error"
                        />
                      </div>
                      <div className="m-box">
                        <div className="m-box_body">
                          <h3 className="a-h3">ご確認ください</h3>
                          <ul className="a-list-border">
                            <li>
                              毎月末日の前日17:59までプランの変更と取消が可能です。
                              <br />
                              但し、月末日の前々日18:59までにプランの変更を申し込まれた方は、その申込が適用される翌月1日までプランの変更ができなくなります。
                            </li>
                            <li>
                              毎月月末の前日18:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
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
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control-check">
                          <label htmlFor="agreement">
                            <input
                              className="a-input-checkbox"
                              type="checkbox"
                              id="agreement"
                              /* disabled={!this.isForceStop()} */
                              data-agreement-target="submit"
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
                    <div className="m-form_section">
                      <button
                        className="a-btn-submit"
                        id="submit"
                        type="button"
                        disabled={
                          this.state.btnDisabled ||
                          !this.state.limitedType ||
                          !this.state.selectedPlan
                        }
                        onClick={() => {
                          if (this.validateAllForm(true)) {
                            this.handleSubmit()
                          }
                        }}
                      >
                        上記内容で申し込む
                      </button>
                    </div>

                    <div className="m-form_section">
                      <div className="m-btn-group">
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
                  onClick={(e) =>
                    this.goNextDisplay(e, '/mypage/plan/edit/complete/')
                  }
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
        {this.state.planAppModal && (
          <div className="l-modal is-active">
            <div className="l-modal_overlay">
              <div
                style={{ maxWidth: '960px' }}
                className="l-modal_content is-active"
              >
                <div className="m-modal">
                  <div className="m-modal_inner">
                    <p>APP認証エラーのためAPPプランへの変更はできません</p>
                    <div className="m-btn">
                      <button
                        onClick={() => this.setState({ planAppModal: false })}
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
        )}
        {this.state.aboutJisModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p>ご利用いただけない文字について</p>
              </div>
              <div className="ulModal_content">
                <h3 style={{ fontSize: '1.8rem' }}>■漢字</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  髙や﨑など、JIS規格第１水準及び第２水準に含まれない漢字
                </p>
                <h3 style={{ fontSize: '1.8rem' }}>■数字</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  ①などの丸付き数字、Ⅲなどのローマ数字
                </p>
                <h3 style={{ fontSize: '1.8rem' }}>■その他</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  カタカナ(半角)、一部の記号など
                </p>
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setState({ aboutJisModal: false })
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
    url: state.url,
    parameters: state.parameters,
    type: state.type,
    customerInfo: postReducer.customerInfo,
    iotPlans: postReducer.iotPlans,
    paymentError: postReducer.paymentError,
  }
}

export default connect(mapStateToProps)(Plan_edit)
