import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Validations from '../../../Validations'
import moment from 'moment'

// css
import '../../../assets/css/common.css'

// IMPORT ACTION FILES
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'
import {
  getToken,
  getApplyNumber,
  getApplyInfo,
} from '../../../../actions/ArsActions'
import { wareki, groupBySimOptions } from '../../../../actions/Methods'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

import icon_help from '../../../../modules/images/icon_q.png'

import SelectList from '../../../form/SelectList'
import MessageArea from '../../../form/MessageArea'

class Change_Transfer extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleChangeGender = this.handleChangeGender.bind(this)
    this.selectUserTab = []
    this.handleChangeYear = this.handleChangeYear.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
    this.handleChangeDay = this.handleChangeDay.bind(this)
    this.searchAddress = this.searchAddress.bind(this)
    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      aboutJisModal: false,
      checkMnpNameModal: false, // isCheckSameName用モーダル
      selectAddressModal: false,
      applyNumber:
        props.history.location.state !== undefined
          ? props.history.location.state.applyNumber
          : '',
      sharePlanFlag: '',
      customerYears: [],
      months: [],
      days: [],
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '1',
          sessionNoUseFlg: '',
        },
      ],
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
      genderOptions: [
        { key: 1, value: 1, text: '男性' },
        { key: 2, value: 2, text: '女性' },
      ],
      addressInfo: [],
      selectedAddressIndex: 0,
      formState: {
        customerInfo: {
          lastName: '',
          firstName: '',
          lastNameKana: '',
          firstNameKana: '',
          mail1: '',
          gender: '',
          birthday: [],
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          tel: ['', '', ''],
          zipCode: '',
          imageInfo: {
            certificateNumber: '',
            certificateTypeCode: '',
            imageDataList: [],
          },
        },
      },
      error: {
        campaignCode: {},
        couponCode: {},
        customerId: {},
        entryCode: {},
        password: {},
        'customerInfo.lastName': {},
        'customerInfo.firstName': {},
        'customerInfo.lastNameKana': {},
        'customerInfo.firstNameKana': {},
        'customerInfo.departmentName': {},
        'customerInfo.chargeName': {},
        'customerInfo.tel': {},
        'customerInfo.mobileTel': {},
        'customerInfo.mail1': {},
        'customerInfo.mail1Confirm': {},
        'customerInfo.password': {},
        'customerInfo.passwordConfirm': {},
        'customerInfo.zipCode': {},
        'customerInfo.address1': {},
        'customerInfo.address2': {},
        'customerInfo.address3': {},
        'customerInfo.address4': {},
        'customerInfo.address5': {},
        'customerInfo.address6': {},
        'customerInfo.gender': {},
        'customerInfo.birthday': {},
        'customerInfo.attentionCustomerFlag': {},
        'customerInfo.paymentMethod': {},
        'customerInfo.waonNumber': {},
        loginForm: {},
        verified: {},
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

  async componentDidMount() {
    this.goTop()
    await Validations.initialize()
    document.title = Const.TITLE_MYPAGE_CHANGE_TRANSFER
    //this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      console.log(this.state.lineInfo)
      //this.handleConnect('test')
      //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    }

    if (this.state.applyNumber.length == 0) {
      const applyNumber = await getApplyNumber()
      this.setState({ applyNumber })
    }

    this.setInitDate()
    this.setDateList()
  }

  handleConnect(type) {
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            customerInfoGetFlg: this.state.passData[0].customerInfoGetFlg,
            tokenFlg: this.state.passData[0].tokenFlg,
            simGetFlg: this.state.passData[0].simGetFlg,
            sessionNoUseFlg: this.state.passData[0].sessionNoUseFlg,
            customerId: window.customerId,
            lineKeyObject: lineKeyObject || '',
          }
          console.log(this.state.passData[0])

          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(dispatchPostConnections(type, params))
        }
        break

      case Const.CONNECT_TYPE_SIM_DATA:
        /* 
        params = {
          lineKeyObject: this.state.lineInfo[0].lineKeyObject,
          lineNo: this.state.lineInfo[0].lineNo,
          lineDiv: this.state.lineInfo[0].lineDiv,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
         */
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    console.log(type)
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        const param = data.data.customerInfo

        this.setState({ sharePlanFlag: param.sharePlanFlag })
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION
      if (type === 'auth_errors') {
        //
      } else if (type === 'api_error') {
        //
      } else if (type === 'no_body_error') {
        //
      } else {
        this.props.history.push('/login')
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

  async setInitDate() {
    console.log(this.state.applyNumber)
    if (this.state.applyNumber) {
      let { customerInfo } = await getApplyInfo(this.state.applyNumber)
      console.log(customerInfo)
      const birthday = ['1980', '01', '01']
      if (customerInfo.birthday) {
        birthday[0] = moment(customerInfo.birthday).format('YYYY')
        birthday[1] = moment(customerInfo.birthday).format('MM')
        birthday[2] = moment(customerInfo.birthday).format('DD')
        console.log(birthday)
      }

      const phoneNumber =
        customerInfo.tel.length > 0 ? customerInfo.tel.split('-') : ''
      console.log(phoneNumber)

      customerInfo.birthday = [...birthday]
      customerInfo.zipCode = customerInfo.zipCode ? customerInfo.zipCode : ''
      customerInfo.address1 = customerInfo.address1 ? customerInfo.address1 : ''
      customerInfo.address2 = customerInfo.address2 ? customerInfo.address2 : ''
      customerInfo.address3 = customerInfo.address3 ? customerInfo.address3 : ''
      customerInfo.address4 = customerInfo.address4 ? customerInfo.address4 : ''
      customerInfo.address5 = customerInfo.address5 ? customerInfo.address5 : ''
      customerInfo.address6 = customerInfo.address6 ? customerInfo.address6 : ''
      customerInfo.tel = [...phoneNumber]

      console.log(customerInfo)

      const formState = {
        customerInfo,
      }

      this.setState({ formState })
    }

    //this.setState({ applyNumber })
  }

  handleChangeYear(e) {
    const value = e.target.value
    let formState = _.cloneDeep(this.state.formState)
    formState.customerInfo.birthday[0] = value
    this.setState({ formState })
    this.validateCustomerAge()
  }
  handleChangeMonth(e) {
    const value = e.target.value
    let formState = _.cloneDeep(this.state.formState)
    formState.customerInfo.birthday[1] = value
    this.setState({ formState })
    this.validateCustomerAge()
  }
  handleChangeDay(e) {
    const value = e.target.value
    let formState = _.cloneDeep(this.state.formState)
    formState.customerInfo.birthday[2] = value
    this.setState({ formState })
    this.validateCustomerAge()
  }

  setDateList() {
    let i
    let customerYears = []
    let months = []
    let days = []
    let thisYear = moment().year()
    let age = 17

    for (i = thisYear - 100; i < thisYear - age; i++) {
      customerYears.push({ key: i, value: i, text: i })
    }
    for (i = 1; i < 13; i++) {
      months.push({ key: i, value: ('00' + i).slice(-2), text: i })
    }
    for (i = 1; i < 32; i++) {
      days.push({ key: i, value: ('00' + i).slice(-2), text: i })
    }
    this.setState({ customerYears, months, days })
  }

  handleChangeInput(e, key, index) {
    /* if (key.startsWith('aeonPeople.')) {
      console.log('aeonPeople')
      key = key.substring(11)
      this.setAPPValue(key, e.target.value, index)
      return
    } */
    let formState = this.state.formState

    switch (key) {
      case 'entryCode':
        if (this.state.isEntryCodeCheckStatus !== 'verifying') {
          formState[key][index] = this.toHalfWidth(e.target.value)
        }
        if (
          formState[key][0].length === 4 &&
          formState[key][1].length === 4 &&
          formState[key][2].length === 4 &&
          formState[key][3].length === 4
        ) {
          // バリデーションOKでAPIチェック
          let entryCodeValidation = this.validateForm(
            'ARS002-A008',
            'entryCode',
            true
          )
          if (
            entryCodeValidation &&
            this.state.isEntryCodeCheckStatus !== 'verifying'
          ) {
            // チェックAPI
            this.setState({ isEntryCodeCheckStatus: 'verifying' })
            this.checkEntryCodeStatus()
          } else if (!entryCodeValidation) {
            this.setState({ isEntryCodeCheckStatus: 'invalid' })
          }
        }
        break
      case 'campaignCode':
        formState[key] = this.toHalfWidth(e.target.value)
        break
      case 'couponCode':
        if (this.state.isCouponCodeCheckStatus !== 'verifying') {
          formState[key] = this.toHalfWidth(e.target.value)
        }
        if (formState[key].length === 11) {
          // バリデーションOKでAPIチェック
          let couponCodeValidation = this.validateForm(
            'ARS002-A008',
            'couponCode',
            true
          )
          if (
            couponCodeValidation &&
            this.state.isCouponCodeCheckStatus !== 'verifying'
          ) {
            // チェックAPI
            this.setState({ isCouponCodeCheckStatus: 'verifying' })
            this.checkCouponCodeStatus()
          } else if (!couponCodeValidation) {
            this.setState({ isCouponCodeCheckStatus: 'invalid' })
          }
        }
        break
      case 'customerInfo.birthday':
        key = key.substring(13)
        formState.customerInfo[key][index] = e.target.value
        // 利用者分更新
        this.selectUserTab.map((item) => {
          item.current.syncUserInfo(key, e.target.value, index)
        })
        break
      case 'customerId':
        formState[key] = this.toHalfWidth(e.target.value)
        break
      case 'password':
        formState[key] = this.toHalfWidth(e.target.value)
        break
      case 'customerInfo.tel':
        key = key.substring(13)
        let tel = JSON.parse(JSON.stringify(formState.customerInfo[key]))
        tel[index] = this.toHalfWidth(e.target.value)
        let telLength = tel.join('').length
        // 桁数チェック（11桁以下）
        if (telLength <= 11) {
          formState.customerInfo[key][index] = this.toHalfWidth(e.target.value)
          // 利用者分更新
          this.selectUserTab.map((item) => {
            item.current.syncUserInfo(
              key,
              this.toHalfWidth(e.target.value),
              index
            )
          })
        }
        break
      case 'customerInfo.waonNumber':
        key = key.substring(13)
        formState.customerInfo[key][index] = this.toHalfWidth(e.target.value)
        break
      case 'customerInfo.mail1Confirm':
        this.setState({ mail1Confirm: this.toHalfWidth(e.target.value) })
        break
      case 'customerInfo.passwordConfirm':
        this.setState({ passwordConfirm: this.toHalfWidth(e.target.value) })
        formState.params.passwordConfirm = this.toHalfWidth(e.target.value)
        break
      case 'customerInfo.zipCode':
        key = key.substring(13)
        let regex = /^[0-9]*$/
        let zipCode = this.toHalfWidth(e.target.value)
        if (zipCode.match(regex) && zipCode.length < 8) {
          formState.customerInfo[key] = zipCode
          // 利用者分更新
          this.selectUserTab.map((item) => {
            item.current.syncUserInfo(key, zipCode)
          })
        }
        break
      default:
        key = key.substring(13)
        formState.customerInfo[key] = e.target.value
        if (
          key === 'address1' ||
          key === 'address2' ||
          key === 'address3' ||
          key === 'address4' ||
          key === 'address5' ||
          key === 'address6' ||
          key === 'lastName' ||
          key === 'firstName' ||
          key === 'lastNameKana' ||
          key === 'firstNameKana' ||
          key === 'gender'
        ) {
          // 利用者分更新
          /* this.selectUserTab.map((item) => {
            item.current.syncUserInfo(key, e.target.value)
          }) */
        }
        break
    }
    console.log(formState)
    this.setState({ formState })
  }

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする

    let customerInfo = _.cloneDeep(this.state.formState.customerInfo)

    customerInfo.tel = customerInfo.tel.join('-')
    customerInfo.mobileTel = ''
    customerInfo.birthday = customerInfo.birthday.join('')

    const body = {
      applyNumber: this.state.applyNumber,
      receptionKbn: '4',
      receptionistKbn: '2',
      customerId: window.customerId,
      customerInfo,
      customerInfoType: '601',
      commitFlag: 0,
      receptionStoreCode: '',
      receptionistCode: '',
      receptionistName: '',
      agencyCode: '',
      incentiveCode: '',
      joinRoute: '',
      token,
      imageInfo: {
        certificateNumber: '',
        certificateTypeCode: '',
        imageDataList: [],
      },
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

  handleChangeAddress(e) {
    const value = Number(e.target.value)
    this.setState({ selectedAddressIndex: value })
  }

  validateForm(apiName, key, required) {
    let validation = Validations.validationCheck(this, apiName, key, required)

    let error = this.state.error
    error[key] = validation
    this.setState({ error })
    return error[key].result === 'OK'
  }

  isCheckSameName() {
    // 要確認
    /* let { formState } = this.state
    let _lastName = formState.customerInfo.lastName
    let _firstName = formState.customerInfo.firstName
    let _lastNameKana = formState.customerInfo.lastNameKana
    let _firstNameKana = formState.customerInfo.firstNameKana
    this.state.formState.simList.map((item) => {
      if (item.mnpNameKind == 3) {
        //契約者名義とMNP移転元名義
        if (
          _lastName === item.mnpLastName &&
          _firstName === item.mnpFirstName &&
          _lastNameKana === item.mnpLastNameKana &&
          _firstNameKana === item.mnpFirstNameKana
        ) {
          this.setState({ checkMnpNameModal: true })
        }
      } else if (item.mnpNameKind == 2) {
        //契約者名義と利用者名義を比較
        if (
          _lastName === item.lastName &&
          _firstName === item.firstName &&
          _lastNameKana === item.lastNameKana &&
          _firstNameKana === item.firstNameKana
        ) {
          this.setState({ checkMnpNameModal: true })
        }
      }
    }) */
  }

  handleChangeGender(item) {
    let formState = this.state.formState
    formState.customerInfo.gender = item.value
    // 利用者分更新
    this.selectUserTab.map((_item) => {
      _item.current.syncUserInfo('gender', item.value)
    })
    this.setState({ formState })
  }

  // 住所1 ~ 住所3に郵便番号検索結果を適用
  setAddressInfo(addressInfo) {
    console.log(addressInfo)
    let { formState } = this.state
    // customerInfo
    if (addressInfo.prefecture) {
      formState.customerInfo.address1 = addressInfo.prefecture
    }
    if (addressInfo.city) {
      formState.customerInfo.address2 = addressInfo.city
    }
    if (addressInfo.town) {
      formState.customerInfo.address3 = addressInfo.town
    }
    // simList
    /* formState.simList.map((item, index) => {
      if (addressInfo.prefecture) {
        item.address1 = addressInfo.prefecture
      }
      if (addressInfo.city) {
        item.address2 = addressInfo.city
      }
      if (addressInfo.town) {
        item.address3 = addressInfo.town
      }
    }) */
    console.log(formState)
    this.setState({ formState })
  }
  // 郵便番号検索
  searchAddress(e) {
    // API
    let body = {
      zipCode: this.state.formState.customerInfo.zipCode,
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

    fetch(Const.ARS_ADDRESS, params)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        console.log(resJson)
        //this.props.handleResJson(resJson)
        if (resJson && resJson.data && resJson.data.addressInfo) {
          let addressInfo = resJson.data.addressInfo
          if (Array.isArray(addressInfo)) {
            if (addressInfo.length > 1) {
              // 検索結果が2件以上
              this.showAddressOptions(addressInfo)
            } else {
              // 検索結果が1件のみ
              this.setAddressInfo(addressInfo[0])
            }
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  validateCustomerAge() {
    let isValid = false
    let now = moment()
    let target = this.state.formState.customerInfo
    let birthday = moment([
      target.birthday[0],
      parseInt(target.birthday[1]) - 1,
      target.birthday[2],
    ])
    let error = this.state.error
    let diff = now.diff(birthday, 'years')
    let coup = 18
    if (isNaN(diff)) {
      // エラー表示
      error['customerInfo.birthday'] = {
        result: 'NG',
        attribute: 'attribute',
        error: 'error',
        message: 'ご契約者さま生年月日が正しくありません',
      }
    } else if (diff < coup) {
      // エラー表示
      error['customerInfo.birthday'] = {
        result: 'NG',
        attribute: 'attribute',
        error: 'error',
        message: 'ご契約者さま生年月日は' + coup + '歳以上でご入力ください',
      }
    } else {
      isValid = true
      error['customerInfo.birthday'] = { result: 'OK' }
    }
    this.setState({ error })
    return isValid
  }

  // 郵便番号検索結果の選択ポップアップを表示
  showAddressOptions(addressInfo) {
    this.setState({
      addressInfo,
      selectedAddressIndex: 0,
      selectAddressModal: true,
    })
  }

  validateAllForm(required) {
    // 一度エラーメッセージ表示になっている要素は非表示に
    let _e = this.state.error
    Object.keys(_e).map((key) => {
      _e[key] = { result: 'OK' }
    })
    this.setState({ error: _e })

    //法人以外
    let validate01 = this.validateForm(
      'ARS002-A008',
      'customerInfo.lastName',
      required
    )
    let validate02 = this.validateForm(
      'ARS002-A008',
      'customerInfo.firstName',
      required
    )
    let validate03 = this.validateForm(
      'ARS002-A008',
      'customerInfo.lastNameKana',
      required
    )
    let validate04 = this.validateForm(
      'ARS002-A008',
      'customerInfo.firstNameKana',
      required
    )
    let validate05 = this.validateForm(
      'ARS002-A008',
      'customerInfo.tel',
      required
    )
    let validate06 = this.validateForm('ARS002-A008', 'customerInfo.mobileTel')

    let validate08 = this.validateForm(
      'ARS002-A008',
      'customerInfo.zipCode',
      required
    )
    let validate09 = this.validateForm(
      'ARS002-A008',
      'customerInfo.address1',
      required
    )
    let validate10 = this.validateForm(
      'ARS002-A008',
      'customerInfo.address2',
      required
    )
    let validate11 = this.validateForm(
      'ARS002-A008',
      'customerInfo.address3',
      required
    )
    let validate12 = this.validateForm(
      'ARS002-A008',
      'customerInfo.address4',
      required
    )
    let validate13 = this.validateForm('ARS002-A008', 'customerInfo.address5')
    let validate14 = this.validateForm('ARS002-A008', 'customerInfo.address6')
    let validate15 = this.validateForm(
      'ARS002-A008',
      'customerInfo.gender',
      required
    )

    const isValidCustomerAge = this.validateCustomerAge()
    //let isValidAPP = this.validateAPPForm() // APP用のバリデーション 必要?

    return (
      validate01 &&
      validate02 &&
      validate03 &&
      validate04 &&
      validate05 &&
      validate06 &&
      validate08 &&
      validate09 &&
      validate10 &&
      validate11 &&
      validate12 &&
      validate13 &&
      validate14 &&
      validate15 &&
      isValidCustomerAge
      //isValidAPP
    )
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

  returnAddressOptions() {
    let options = this.state.addressInfo.map((item, index) => {
      let label = (
        <span className="ui_checked_label">
          {item.prefecture}
          {item.city}
          {item.town}
        </span>
      )
      return (
        <div className="field" key={index}>
          <label className="ui_checked">
            <input
              type="radio"
              checked={this.state.selectedAddressIndex === index}
              onChange={this.handleChangeAddress}
              value={index}
            />
            {label}
          </label>
        </div>
      )
    })
    return <div className="ui_form_group">{options}</div>
  }

  toHalfWidth(input) {
    return input.replace(/[！-～]/g, function (input) {
      return String.fromCharCode(input.charCodeAt(0) - 0xfee0)
    })
  }

  //申し込み番号エラー時
  errApplyNumber() {
    /* console.log('errApplyNumber')
    var dialogs_copy = [...this.state.dialogs_error]
    var values = []
    dialogs_copy[0].title = 'ご確認ください'
    values[0] = { text: '現在申込処理中の情報変更があります。' }
    dialogs_copy[0].values = values
    dialogs_copy[0].state = true
    this.setState({ dialogs_error: dialogs_copy }) */
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()
    console.log(url)
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/change/transfer/step2') {
      const params = {
        sharePlanFlag: this.state.sharePlanFlag,
        applyNumber: this.state.applyNumber,
      }
      console.log('passdate::', params)
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

  async handleSubmit() {
    if (this.state.applyNumber) {
      const token = await getToken(this.state.applyNumber)

      const update = await this.updateApplyInfo(token)

      if (update && update.result === 'OK') {
        this.goNextDisplay(null, '/mypage/change/transfer/step2')
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="t-wrapper">
          <Header
            isExistStatus={this.props.isExistStatus}
            {...this.state.url_data[0]}
          />
          <main className="t-main">
            <div className="ui container">
              <h1 className="headTitle">名義変更(利用権譲渡)</h1>
              <p>
                お手続きには1回線(税込)の手数料が発生します。ご利用料金からの引き落としとなります。
              </p>
              <div className="ui form">
                <h2 className="headSubTitle">
                  変更する情報を入力して「次へ」をご選択ください。
                </h2>
                <div>
                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      ご契約者さま氏名
                    </div>
                    <div className="formInput">
                      <ul className="inlineFormArea">
                        <li>
                          <input
                            id="customerInfo.lastName"
                            onBlur={(e) => {
                              this.isCheckSameName()
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.lastName'
                              )
                            }}
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.lastName')
                            }
                            placeholder="姓"
                            type="text"
                            value={this.state.formState.customerInfo.lastName}
                            //disabled={this.props.isAddressError}
                          />
                        </li>
                        <li>
                          <input
                            id="customerInfo.firstName"
                            maxLength="50"
                            onBlur={(e) => {
                              this.isCheckSameName()
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.firstName'
                              )
                            }}
                            onChange={(e) =>
                              this.handleChangeInput(
                                e,
                                'customerInfo.firstName'
                              )
                            }
                            placeholder="名"
                            type="text"
                            value={this.state.formState.customerInfo.firstName}
                            //value={formState.customerInfo.firstName}
                            //disabled={this.props.isAddressError}
                          />
                        </li>
                      </ul>
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.lastName'}
                      />
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.firstName'}
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
                        <p className="noteText" style={{ marginBottom: 0 }}>
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
                      ご契約者さま氏名
                      <span className="textFormat">（カタカナ）</span>
                    </div>
                    <div className="formInput">
                      <ul className="inlineFormArea">
                        <li>
                          <input
                            id="customerInfo.lastNameKana"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.lastNameKana'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(
                                e,
                                'customerInfo.lastNameKana'
                              )
                            }
                            placeholder="セイ"
                            type="text"
                            value={
                              this.state.formState.customerInfo.lastNameKana
                            }
                          />
                        </li>
                        <li>
                          <input
                            id="customerInfo.firstNameKana"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.firstNameKana'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(
                                e,
                                'customerInfo.firstNameKana'
                              )
                            }
                            placeholder="メイ"
                            type="text"
                            value={
                              this.state.formState.customerInfo.firstNameKana
                            }
                          />
                        </li>
                      </ul>
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.lastNameKana'}
                      />
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.firstNameKana'}
                      />
                    </div>
                  </div>

                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      性別
                    </div>
                    <div className="formInput">
                      <SelectList
                        type={3}
                        options={this.state.genderOptions}
                        onChange={this.handleChangeGender}
                        selected={this.state.formState.customerInfo.gender}
                        //disabled={this.props.isAddressError}
                      />
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.gender'}
                      />
                    </div>
                  </div>

                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      生年月日
                    </div>
                    <div className="formInput">
                      <ul className="inlineFormArea">
                        <li>
                          <select onChange={this.handleChangeYear}>
                            {this.state.customerYears.map((item) => {
                              const selected =
                                this.state.formState.customerInfo.birthday[0] ==
                                item.key
                                  ? true
                                  : false
                              const w = wareki(item.key)
                              return (
                                <option
                                  key={item.key}
                                  value={item.value}
                                  selected={selected}
                                >{`${w} / ${item.key}年`}</option>
                              )
                            })}
                          </select>
                        </li>
                        <li>
                          <select onChange={this.handleChangeMonth}>
                            {this.state.months.map((item) => {
                              const selected =
                                this.state.formState.customerInfo.birthday[1] ==
                                item.key
                                  ? true
                                  : false
                              return (
                                <option
                                  key={item.key}
                                  value={item.value}
                                  selected={selected}
                                >
                                  {item.text}月
                                </option>
                              )
                            })}
                          </select>
                        </li>
                        <li>
                          <select onChange={this.handleChangeDay}>
                            {this.state.days.map((item) => {
                              const selected =
                                this.state.formState.customerInfo.birthday[2] ==
                                item.key
                                  ? true
                                  : false
                              return (
                                <option
                                  key={item.key}
                                  value={item.value}
                                  selected={selected}
                                >
                                  {item.text}日
                                </option>
                              )
                            })}
                          </select>
                        </li>
                      </ul>
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.birthday'}
                      />
                    </div>
                  </div>

                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      お住まい
                    </div>
                    <div className="formInput">
                      <div className="fields">
                        <div className="field">
                          <div className="ui input">
                            <input
                              id="customerInfo.zipCode"
                              maxLength="7"
                              onBlur={(e) =>
                                this.validateForm(
                                  'ARS002-A008',
                                  'customerInfo.zipCode'
                                )
                              }
                              onChange={(e) =>
                                this.handleChangeInput(
                                  e,
                                  'customerInfo.zipCode'
                                )
                              }
                              placeholder="郵便番号（例）2610023"
                              type="text"
                              value={this.state.formState.customerInfo.zipCode}
                            />
                          </div>
                        </div>
                        <button
                          className="ui disabled button Button"
                          disabled={
                            this.state.formState.customerInfo.zipCode.length !==
                            7
                          }
                          onClick={this.searchAddress}
                          style={{
                            padding: '0.8em',
                            marginBottom: '1rem',
                          }}
                        >
                          郵便番号検索
                        </button>
                      </div>
                      <p style={{ color: '#ba0080' }}>
                        SIMカードは下記に入力されたお住まいにお届けします。
                        <br />
                        法令により、お住まい以外へのお届けや転送はできません。
                      </p>
                      {/* <p className="noteText">
                        ※画像をアップロードされる本人確認書類と同じ住所をご入力ください。本人確認書類の住所と内容や表記に相違がある場合、お申込みは不備になります。
                      </p> */}
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address1"
                            className=""
                            maxLength="15"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address1'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address1')
                            }
                            placeholder="都道府県（例）千葉県"
                            style={{ opacity: '1', paddingRight: '3rem' }}
                            type="text"
                            value={this.state.formState.customerInfo.address1}
                            disabled
                          />
                          <span className="icon-required requiredTag">
                            必須
                          </span>
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address1'}
                        />
                      </div>
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address2"
                            className=""
                            maxLength="80"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address2'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address2')
                            }
                            placeholder="市町村（例）千葉市美浜区"
                            style={{ opacity: '1', paddingRight: '3rem' }}
                            type="text"
                            value={this.state.formState.customerInfo.address2}
                            disabled
                          />
                          <span className="icon-required requiredTag">
                            必須
                          </span>
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address2'}
                        />
                      </div>
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address3"
                            className=""
                            maxLength="80"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address3'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address3')
                            }
                            placeholder="町域"
                            style={{ opacity: '1', paddingRight: '3rem' }}
                            type="text"
                            value={this.state.formState.customerInfo.address3}
                            disabled
                          />
                          <span className="icon-required requiredTag">
                            必須
                          </span>
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address3'}
                        />
                      </div>
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address4"
                            className=""
                            maxLength="80"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address4'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address4')
                            }
                            placeholder="番地等（例）0-0-0"
                            style={{ paddingRight: '3rem' }}
                            type="text"
                            value={this.state.formState.customerInfo.address4}
                          />
                          <span className="icon-required requiredTag">
                            必須
                          </span>
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address4'}
                        />
                      </div>
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address5"
                            className=""
                            maxLength="64"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address5'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address5')
                            }
                            placeholder="建物名（例）〇〇〇ビル"
                            type="text"
                            value={this.state.formState.customerInfo.address5}
                          />
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address5'}
                        />
                      </div>
                      <div className="field" style={{ marginTop: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="customerInfo.address6"
                            className=""
                            maxLength="10"
                            onBlur={(e) =>
                              this.validateForm(
                                'ARS002-A008',
                                'customerInfo.address6'
                              )
                            }
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.address6')
                            }
                            placeholder="部屋番号（例）201"
                            type="text"
                            value={this.state.formState.customerInfo.address6}
                          />
                        </div>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.address6'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      連絡先電話番号
                    </div>
                    <div className="formInput">
                      <ul
                        className="formnumberList spaceBottom-1"
                        id="customerInfo.tel"
                      >
                        <li>
                          <input
                            className="inputHalfWidth"
                            id="customerInfo.tel.0"
                            maxLength="4"
                            onBlur={(e) => this.validateTelOnBlur()}
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.tel', 0)
                            }
                            placeholder="090"
                            type="tel"
                            value={
                              this.state.formState.customerInfo.tel
                                ? this.state.formState.customerInfo.tel[0]
                                : ''
                            }
                          />
                        </li>
                        <li>
                          <input
                            className="inputHalfWidth"
                            id="customerInfo.tel.1"
                            maxLength="4"
                            onBlur={(e) => this.validateTelOnBlur()}
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.tel', 1)
                            }
                            placeholder="1234"
                            type="tel"
                            value={
                              this.state.formState.customerInfo.tel
                                ? this.state.formState.customerInfo.tel[1]
                                : ''
                            }
                          />
                        </li>
                        <li>
                          <input
                            className="inputHalfWidth"
                            id="customerInfo.tel.2"
                            maxLength="4"
                            onBlur={(e) => this.validateTelOnBlur()}
                            onChange={(e) =>
                              this.handleChangeInput(e, 'customerInfo.tel', 2)
                            }
                            placeholder="5678"
                            type="tel"
                            value={
                              this.state.formState.customerInfo.tel
                                ? this.state.formState.customerInfo.tel[2]
                                : ''
                            }
                          />
                        </li>
                      </ul>
                      <MessageArea
                        error={this.state.error}
                        param={'customerInfo.tel'}
                      />
                    </div>
                  </div>
                </div>
                <div className="formbtnFlex">
                  <button
                    onClick={async () => {
                      this.headerUrlHandler('/mypage/user/')
                    }}
                    className="formbtn return"
                  >
                    戻る
                  </button>
                  <button
                    onClick={async () => {
                      if (this.validateAllForm(true)) {
                        //成功

                        this.handleSubmit()
                        /* const params = {
                          formState: this.state.formState,
                          applyNumber: applyNumber,
                        }
                        this.headerUrlHandler(
                          `/mypage/change/transfer/step2`,
                          params
                        ) */
                      } else {
                        // エラー発生箇所の一番目の要素へスクロール
                      }
                    }}
                    className="formbtn next"
                    /* disabled={
                      JSON.stringify(this.state.formState) ==
                      JSON.stringify(this.state.formState_default)
                    } */
                  >
                    次へ進む
                  </button>
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
        {this.state.selectAddressModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p>住所を選択してください。</p>
              </div>
              <div className="ulModal_content">
                <div className="contentsWrapper" style={{ paddingBottom: '0' }}>
                  {this.returnAddressOptions()}
                </div>
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setAddressInfo(
                      this.state.addressInfo[this.state.selectedAddressIndex]
                    )
                    this.setState({ selectAddressModal: false })
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.checkMnpNameModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p>※ご確認ください</p>
              </div>
              <div className="ulModal_content">
                <div className="contentsWrapper" style={{ paddingBottom: '0' }}>
                  転入元の名義と同一の名義のようですが、お間違い無いですか？
                </div>
              </div>
              <div className="ulModal_actions">
                <button
                  className="ulModal_button"
                  onClick={() => {
                    this.setState({ checkMnpNameModal: false })
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.aboutJisModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div
                className="ulModal_content"
                style={{
                  borderBottom: '1px solid rgba(34,36,38,.15)',
                }}
              >
                <h3>ご利用いただけない文字について</h3>
              </div>
              <div className="ulModal_content">
                <h3>■漢字</h3>
                <p>髙や﨑など、JIS規格第１水準及び第２水準に含まれない漢字</p>
                <h3>■数字</h3>
                <p>①などの丸付き数字、Ⅲなどのローマ数字</p>
                <h3>■その他</h3>
                <p>カタカナ(半角)、一部の記号など</p>
              </div>
              <div className="ulModal_actions">
                <button
                  className="ulModal_button"
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
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
  }
}

export default connect(mapStateToProps)(Change_Transfer)
