import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Validations from '../../../Validations'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

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
  getAgreementData,
} from '../../../../actions/ArsActions'
import {
  formatTelNumber,
  sameName,
  sameAddress,
} from '../../../../actions/Methods'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

import icon_help from '../../../../modules/images/icon_q.png'

import SelectList from '../../../form/SelectList'
import MessageArea from '../../../form/MessageArea'

//register定数
const API_ENDPOINT = ''
const ARS002_A006 = '/api/v1/ars/address'

class Change_Name extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleChangeSex = this.handleChangeSex.bind(this)
    this.selectUserTab = []
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
      defaultName: {
        lastName: '',
        firstName: '',
        lastNameKana: '',
        firstNameKana: '',
      },
      isSkipStep2: false,
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
          gender: 1,
          birthday: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          tel: ['', '', ''],
          zipCode: '',
        },
      },
      formState_default: {
        customerInfo: {
          lastName: '',
          firstName: '',
          lastNameKana: '',
          firstNameKana: '',
          mail1: '',
          gender: 1,
          birthday: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          tel: ['', '', ''],
          zipCode: '',
        },
      },
      imageInfo: {
        certificateNumber: '',
        certificateTypeCode: '',
        imageDataList: [],
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
    document.title = Const.TITLE_MYPAGE_CHANGE_NAME
    //this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)

    if (window.customerId === undefined) {
      console.log(window.customerId)
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
      this.getInformation()
    }
    console.log('applyNumber' + this.state.applyNumber)

    if (this.state.applyNumber.length == 0) {
      const applyNumber = await getApplyNumber()
      this.setState({ applyNumber })
    }
  }
  handleConnect(type) {
    console.log(type)
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
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

  async getInformation() {
    const { customerInfo: param, mailAddress } = await getAgreementData(
      window.customerId,
      true
    )
    const {
      customerInfoType,
      customerInfo: paramsAplly,
      imageInfo,
    } = await getApplyInfo(this.state.applyNumber)

    let isApplyInfo = false
    if (customerInfoType.includes('304')) {
      isApplyInfo = true
      this.setState({ imageInfo })
    }

    const phoneNumber = isApplyInfo
      ? paramsAplly.tel
        ? paramsAplly.tel.split('-')
        : ''
      : formatTelNumber(param.phoneNumber)

    const phoneNumber_default = formatTelNumber(param.phoneNumber)

    const defaultName = {
      lastName: param.userNameSei,
      firstName: param.userNameMei,
      lastNameKana: param.userNameKanaSei,
      firstNameKana: param.userNameKanaMei,
    }

    const address1 = isApplyInfo
      ? paramsAplly.address1
        ? paramsAplly.address1
        : ''
      : param.address1
      ? param.address1
      : ''
    const address2 = isApplyInfo
      ? paramsAplly.address2
        ? paramsAplly.address2
        : ''
      : param.address2
      ? param.address2
      : ''
    const address3 = isApplyInfo
      ? paramsAplly.address3
        ? paramsAplly.address3
        : ''
      : param.address3
      ? param.address3
      : ''
    const address4 = isApplyInfo
      ? paramsAplly.address4
        ? paramsAplly.address4
        : ''
      : param.address4
      ? param.address4
      : ''
    const address5 = isApplyInfo
      ? paramsAplly.address5
        ? paramsAplly.address5
        : ''
      : param.address5
      ? param.address5
      : ''
    const address6 = isApplyInfo
      ? paramsAplly.address6
        ? paramsAplly.address6
        : ''
      : param.address6
      ? param.address6
      : ''

    const formState = {
      customerInfo: {
        lastName: isApplyInfo ? paramsAplly.lastName : param.userNameSei,
        firstName: isApplyInfo ? paramsAplly.firstName : param.userNameMei,
        lastNameKana: isApplyInfo
          ? paramsAplly.lastNameKana
          : param.userNameKanaSei,
        firstNameKana: isApplyInfo
          ? paramsAplly.firstNameKana
          : param.userNameKanaMei,
        gender: isApplyInfo ? Number(paramsAplly.gender) : Number(param.gender),
        birthday: isApplyInfo ? paramsAplly.birthday : param.birthday,
        zipCode: isApplyInfo
          ? paramsAplly.zipCode.split('-').join('')
          : param.postCode.split('-').join(''),
        address1,
        address2,
        address3,
        address4,
        address5,
        address6,
        mail1: mailAddress,
        tel: [...phoneNumber],
      },
    }

    const formState_default = {
      customerInfo: {
        lastName: param.userNameSei,
        firstName: param.userNameMei,
        lastNameKana: param.userNameKanaSei,
        firstNameKana: param.userNameKanaMei,
        gender: Number(param.gender),
        birthday: param.birthday,
        zipCode: param.postCode.split('-').join(''),
        address1: param.address1 ? param.address1 : '',
        address2: param.address2 ? param.address2 : '',
        address3: param.address3 ? param.address3 : '',
        address4: param.address4 ? param.address4 : '',
        address5: param.address5 ? param.address5 : '',
        address6: param.address6 ? param.address6 : '',
        mail1: mailAddress,
        tel: [...phoneNumber_default],
      },
    }
    console.log(formState.customerInfo.lastName)

    this.setState({ formState, formState_default, defaultName })
  }

  async handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    console.log(type)
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        this.getInformation()
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION
      var dialogs_copy = [...this.state.dialogs_error]
      var values = []

      if (type === 'auth_errors') {
        // dialogs_copy[0].title = data.code
        // values[0] = { text: data.message }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        // dialogs_copy[0].title = data.name
        // values[0] = { text: data.response.response.error_detail.error_message }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        // dialogs_copy[0].title = data.name
        // values[0] = { text: data }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
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
    console.log(formState.customerInfo.tel)
    console.log(this.state.formState_default.customerInfo.tel)

    this.setState({ formState })
  }

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする

    let customerInfo = _.cloneDeep(this.state.formState.customerInfo)

    customerInfo.tel = customerInfo.tel.join('-')
    customerInfo.mobileTel = ''

    const customerInfoType = this.state.isSkipStep2 ? '304' : '303,304'

    const body = {
      applyNumber: this.state.applyNumber,
      receptionKbn: '4',
      receptionistKbn: '2',
      customerId: window.customerId,
      customerInfo,
      customerInfoType,
      commitFlag: 0,
      receptionStoreCode: '',
      receptionistCode: '',
      receptionistName: '',
      agencyCode: '',
      incentiveCode: '',
      joinRoute: '',
      token,
      imageInfo: this.state.imageInfo,
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

  handleChangeSex(item) {
    let formState = this.state.formState
    formState.customerInfo.gender = item.value
    // 利用者分更新
    this.selectUserTab.map((_item) => {
      _item.current.syncUserInfo('gender', item.value)
    })
    this.setState({ formState })
  }

  formatTelNumber(value) {
    const region = 'JP'
    const util = PhoneNumberUtil.getInstance()
    // 番号と地域を設定
    const number = util.parseAndKeepRawInput(value, region)
    // 電話番号の有効性チェック
    if (!util.isValidNumberForRegion(number, region)) {
      return ['', '', '']
    }
    // ハイフン付きの形式→配列に
    return util.format(number, PhoneNumberFormat.NATIONAL).split('-')
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

    fetch(API_ENDPOINT + ARS002_A006, params)
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
    //法人のとき必須を外す
    const isGender =
      this.state.formState.customerInfo.gender == 3 ? true : false

    //法人以外
    let validate01 = this.validateForm(
      'ARS002-A008',
      'customerInfo.lastName',
      required
    )
    let validate02 = this.validateForm(
      'ARS002-A008',
      'customerInfo.firstName',
      !isGender && required
    )
    let validate03 = this.validateForm(
      'ARS002-A008',
      'customerInfo.lastNameKana',
      required
    )
    let validate04 = this.validateForm(
      'ARS002-A008',
      'customerInfo.firstNameKana',
      !isGender && required
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

    //法人のみ
    /* let validate27 = this.validateForm(
      'ARS002-A008',
      'customerInfo.departmentName'
    )

    let validate28 = this.validateForm(
      'ARS002-A008',
      'customerInfo.chargeName',
      isGender && required
    ) */

    /* let isValidCorporation = true
    if (isGender) {
      isValidCorporation = validate27 && validate28
    } */
    //let isValidCustomerAge = this.validateCustomerAge()
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
      validate15
      //isValidCustomerAge
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

  // 西暦 => 和暦
  wareki(year) {
    var eras = [
      { year: 2018, name: '令和' },
      { year: 1988, name: '平成' },
      { year: 1925, name: '昭和' },
      { year: 1911, name: '大正' },
      { year: 1867, name: '明治' },
    ]
    for (var i in eras) {
      var era = eras[i]
      var baseYear = era.year
      var eraName = era.name

      if (year > baseYear) {
        var eraYear = year - baseYear

        if (eraYear === 1) {
          return eraName + '元年'
        }

        return eraName + eraYear + '年'
      }
    }
    return null
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
    } else if (url === '/mypage/change/name/step2') {
      const params = {
        applyNumber: this.state.applyNumber,
        defaultName: this.state.defaultName,
      }
      console.log('passdate::', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/change/name/confirm') {
      const params = {
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
    const isSameName = sameName(
      this.state.formState.customerInfo,
      this.state.formState_default.customerInfo
    )
    const isSameAddress = sameAddress(
      this.state.formState.customerInfo,
      this.state.formState_default.customerInfo
    )
    const isSameTell =
      this.state.formState.customerInfo.tel.join('-') ==
      this.state.formState_default.customerInfo.tel.join('-')
        ? true
        : false
    const isGender =
      this.state.formState.customerInfo.gender ==
      this.state.formState_default.customerInfo.gender
        ? true
        : false

    const isSkipStep2 =
      isSameName && isGender && (false == isSameAddress || false == isSameTell)
        ? true
        : false

    this.setState({ isSkipStep2 })

    if (this.state.applyNumber) {
      const token = await getToken(this.state.applyNumber)
      console.log('token' + token)
      const update = await this.updateApplyInfo(token)
      if (update && update.result === 'OK') {
        if (isSkipStep2) {
          this.goNextDisplay(null, '/mypage/change/name/confirm')
        } else {
          this.goNextDisplay(null, '/mypage/change/name/step2')
        }
      }

      return
    }
  }

  render() {
    const isCorporation =
      this.state.formState.customerInfo.gender == 3 ? true : false
    return (
      <React.Fragment>
        <div className="t-wrapper">
          <Header
            isExistStatus={this.props.isExistStatus}
            {...this.state.url_data[0]}
          />
          <main className="t-main">
            <div className="ui container">
              <h1 className="headTitle">お客さま契約情報変更申請</h1>

              <div className="ui form">
                <h2 className="headSubTitle">
                  変更する情報を入力して「次へ」をご選択ください。
                </h2>
                <div>
                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      {isCorporation ? 'ご契約法人名' : 'ご契約者さま氏名'}
                    </div>
                    <div className="formInput">
                      {isCorporation ? (
                        <React.Fragment>
                          <ul className="inlineFormArea">
                            <li>
                              <input
                                id="customerInfo.lastName"
                                onBlur={(e) => {
                                  this.validateForm(
                                    'ARS002-A008',
                                    'customerInfo.lastName'
                                  )
                                }}
                                onChange={(e) =>
                                  this.handleChangeInput(
                                    e,
                                    'customerInfo.lastName'
                                  )
                                }
                                placeholder="法人名"
                                type="text"
                                value={
                                  this.state.formState.customerInfo.lastName
                                }
                                //disabled={this.props.isAddressError}
                              />
                            </li>
                          </ul>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
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
                                  this.handleChangeInput(
                                    e,
                                    'customerInfo.lastName'
                                  )
                                }
                                placeholder="姓"
                                type="text"
                                value={
                                  this.state.formState.customerInfo.lastName
                                }
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
                                value={
                                  this.state.formState.customerInfo.firstName
                                }
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
                        </React.Fragment>
                      )}

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
                        {isCorporation && (
                          <p
                            className="noteText"
                            style={{
                              marginBottom: '0',
                              padding: '0',
                              textIndent: '0',
                            }}
                          >
                            会社の種類（株式会社・有限会社・合同会社など）も『(株)』など略さずご入力ください。
                            <br />
                            フリガナについても「カブシキガイシャ」など略さずご入力ください。
                          </p>
                        )}
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
                      {isCorporation ? (
                        <React.Fragment>
                          <span className="icon-required">必須</span>
                          ご契約法人名
                          <span className="textFormat">（フリガナ）</span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <span className="icon-required">必須</span>
                          ご契約者さま氏名
                          <span className="textFormat">（カタカナ）</span>
                        </React.Fragment>
                      )}
                    </div>
                    {isCorporation ? (
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
                              placeholder="ホウジンメイ"
                              type="text"
                              value={
                                this.state.formState.customerInfo.lastNameKana
                              }
                            />
                          </li>
                        </ul>
                        <MessageArea
                          error={this.state.error}
                          param={'customerInfo.lastNameKana'}
                        />
                      </div>
                    ) : (
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
                    )}
                  </div>
                  <div className="fotmItem">
                    <div className="formTitle">
                      <span className="icon-required">必須</span>
                      {isCorporation ? '契約種別' : '性別'}
                    </div>
                    <div className="formInput">
                      <SelectList
                        type={3}
                        options={
                          isCorporation
                            ? [{ key: 3, value: 3, text: '法人' }]
                            : this.state.genderOptions
                        }
                        onChange={this.handleChangeSex}
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
                      {isCorporation ? '会社所在地' : 'お住まい'}
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
                        SIMカードは下記に入力された
                        {isCorporation ? '会社所在地' : 'お住まい'}
                        にお届けします。
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
                        {isCorporation && (
                          <p
                            className="noteText"
                            style={{ padding: '0', textIndent: '0' }}
                          >
                            ※会社所在地がお届け先となります。
                          </p>
                        )}
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
                          `/mypage/change/name/step2`,
                          params
                        ) */
                      } else {
                        // エラー発生箇所の一番目の要素へスクロール
                      }
                    }}
                    className="formbtn next"
                    disabled={
                      JSON.stringify(this.state.formState) ==
                      JSON.stringify(this.state.formState_default)
                    }
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

export default connect(mapStateToProps)(Change_Name)
