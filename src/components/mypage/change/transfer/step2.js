import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Validations from '../../../Validations'
import ImageEditWindow from '../../../form/ImageEditWindow'

// css
import '../../../assets/css/common.css'

// IMPORT ACTION FILES
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'
import { getToken, getApplyInfo } from '../../../../actions/ArsActions'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

import iconImageSelect from '../../../../modules/images/icon_image_select.png'
import iconRemove from '../../../../modules/images/remove.png'
import imgHoken01 from '../../../../modules/images/hoken_01.png'
import imgHoken02 from '../../../../modules/images/hoken_02.png'

import MessageArea from '../../../form/MessageArea'

const certificateOptions = [
  { key: '01', value: '100', text: '運転免許証(免許証番号)' },
  { key: '02', value: '101', text: '健康保険被保険者証' },
  { key: '03', value: '102', text: '日本国発行パスポート(旅券番号)' },
  { key: '04', value: '103', text: '在留カード(番号)' },
  { key: '05', value: '104', text: '障碍者手帳(番号)' },
  // { key: '06', value: '105', text: '登記簿謄(抄)本・印鑑証明書(会社法人等番号)' },
  { key: '07', value: '200', text: 'マイナンバーカードのため入力不可' },
  { key: '08', value: '201', text: '住民基本台帳カードのため番号無し' },
  { key: '09', value: '900', text: 'その他' },
]
const corporationCertificateOptions = [
  { key: '01', value: '106', text: '現在事項証明書' },
  { key: '02', value: '107', text: '履歴事項証明書' },
  { key: '03', value: '108', text: '印鑑証明書' },
]

//register定数
const IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png']

class Change_Transfer_Step2 extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)

    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeCertificateType = this.handleChangeCertificateType.bind(
      this
    )
    this.checkVerified = this.checkVerified.bind(this)
    this.fileChange = this.fileChange.bind(this)
    this.handleChangeVerified = this.handleChangeVerified.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      modal: false,
      imageResetModal: false,
      cautionModal: false,
      editMaskModal: false,
      registNameModal: false,
      receptModal: false, // isCheckSameName用モーダル
      changeUser: false,
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      nextCertificateType: '',
      isVerified: false,
      verified: [false, false, false],
      passData: [
        {
          customerInfoGetFlg: '',
          tokenFlg: '1',
          simGetFlg: '1',
          sessionNoUseFlg: '',
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
      applyNumber:
        props.history.location.state !== undefined
          ? props.history.location.state.applyNumber
          : '',
      formState: {
        customerInfo: {
          lastName: '',
          firstName: '',
          lastNameKana: '',
          firstNameKana: '',
          gender: 1,
          mail1: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          tel: ['', '', ''],
          zipCode: '',
        },
        imageInfo: {
          certificateNumber: '',
          certificateTypeCode: '',
          imageDataList: [],
        },
      },
      error: {
        'imageInfo.certificateTypeCode': {},
        'imageInfo.certificateNumber': {},
        'imageInfo.imageDataList': {},
      },
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

      sharePlanFlag:
        props.history.location.state !== undefined
          ? props.history.location.state.sharePlanFlag
          : '',
    }
  }
  async componentDidMount() {
    this.goTop()
    //if (window.customerId === undefined) return
    await Validations.initialize()
    document.title = Const.TITLE_MYPAGE_CHANGE_TRANSFER
    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      console.log(this.state.formState)
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
      //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    }
    const formState = await getApplyInfo(this.state.applyNumber)
    this.setState({ formState })
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

          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(dispatchPostConnections(type, params))
        }
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
      /* case Const.CONNECT_TYPE_SIM_DATA:
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }

        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break */
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        //this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        const params = data.data

        if (params.lineInfo.length) {
          this.setState({ lineInfo: params.lineInfo })
          this.setState({ simInfo: params.lineInfo[0].simInfo })
          /* this.setState({
            simInfo: params.lineInfo[this.state.lineInfoNum].simInfo,
          }) */
        }
        console.log(this.state.simInfo)
        console.log(this.state.simInfo[0].name)
        console.log(this.state.simInfo[0].removeDate)
        console.log(this.state.simInfo[0].ICCID)

        //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        //通知設定取得
        this.setState({ notification: data.data })
        this.setState({ notice_status: data.data.status })
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        //通知設定の更新
        const params = data.data
        console.log(params)
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        //console.log(data.data)
        //this.setState({ user_nick_name: data.data.nickName })
        //break
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

  contractImageDataList() {
    return _.filter(
      this.state.formState.imageInfo.imageDataList,
      (item) => item.imageType !== 3
    )
  }
  handleChangeCertificateType(e) {
    let value = e.target.value

    const formState = this.state.formState
    if (
      this.state.formState.imageInfo.certificateTypeCode &&
      this.state.formState.imageInfo.certificateTypeCode !== value &&
      this.contractImageDataList().length
    ) {
      // 種別が選択済み && 種別が変更された && 画像がアップロード済み の場合、リセット確認のダイアログを表示する
      this.setState({ imageResetModal: true, nextCertificateType: value })
      return
    }
    this.state.formState.imageInfo.certificateTypeCode = value
    this.setState({ formState })

    var verified = this.state.verified
    console.log('verified', verified)
    if (value === '101') {
      if (
        this.state.formState.customerInfo.gender == 3 &&
        verified.length < 8
      ) {
        verified.push(false, false)
      } else if (verified.length < 5) {
        verified.push(false, false)
      }
    } else {
      if (
        this.state.formState.customerInfo.gender == 3 &&
        verified.length >= 8
      ) {
        verified.splice(5, 2)
      } else if (verified.length >= 5) {
        verified.splice(3, 2)
      }
    }
    this.setState({ verified: verified })
    //this.checkVerified()
  }

  checkVerified() {
    let isVerified = true
    this.state.verified.forEach((item) => {
      if (item == false) {
        isVerified = false
      }
    })

    this.setState({ isVerified: isVerified })

    //仕様要確認
    /* const customerFlg =
      this.props.type === 'add' ||
      this.props.formState.isShareModify ||
      this.state.verified.indexOf(false) === -1
    const userFlg = []
    this.selectImageTab.forEach((item) => {
      const isVerified = item.current.isVerified()
      userFlg.push(isVerified)
    })
    this.setState({ isVerified: customerFlg && userFlg.indexOf(false) === -1 }) */
  }

  handleChangeInput(e, key) {
    const formState = this.state.formState
    switch (key) {
      case 'certificateNumber':
        formState.imageInfo[key] = this.toHalfWidth(e.target.value)
        break
      default:
        formState.imageInfo[key] = e.target.value
        break
    }
    this.setState({ formState })
  }

  handleChangeVerified(e, index) {
    const verified = this.state.verified
    verified[index] = !verified[index]
    this.setState({ verified })
    this.checkVerified()
  }

  // 画像ファイルの追加
  fileChange(e) {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 5000000) {
        // size error
        this.setState({
          cautionText:
            '画像ファイルは5MB以下のものをアップロードしてください。',
          cautionModal: true,
        })
      } else {
        const imageType = e.target.files[0].type
        if (IMAGE_TYPES.indexOf(imageType) !== -1) {
          const reader = new FileReader()
          const image = new Image()

          reader.onload = function (f) {
            // マスク編集ポップアップを表示
            if (this.state.formState.imageInfo.certificateTypeCode === '101') {
              var imageData = f.target.result
              image.src = f.target.result
              image.onload = function () {
                const selectedImageSize = {
                  width: image.width,
                  height: image.height,
                }
                this.setState({
                  editMaskModal: true,
                  selectedImageSize,
                  selectedImageData: imageData,
                })
              }.bind(this)
            } else {
              // API
              this.fileUpload(f.target.result, imageType)
            }
          }.bind(this)
          reader.readAsDataURL(e.target.files[0])
        } else {
          // type error
          this.setState({
            cautionText:
              'アップロードする画像ファイルはgif、jpg、pngのいずれかを選択してください。',
            cautionModal: true,
          })
        }
      }
    }
  }

  fileUpload(imageFile, imageType) {
    const _imageFile = imageFile.replace(`data:${imageType};base64,`, '')

    const body = {
      imageFile: _imageFile,
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
    fetch(Const.ARS_SAVE_IMAGE, params)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        console.log(resJson)
        //this.props.handleResJson(resJson)
        if (resJson && resJson.data.imageId) {
          let formState = _.cloneDeep(this.state.formState)
          formState.imageInfo.imageDataList.push({
            imageId: resJson.data.imageId,
            imageType: 1, // 固定
          })
          this.setState({ formState })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // 画像ファイルの削除
  fileRemove(imageId) {
    const { formState } = this.state
    const newList = formState.imageInfo.imageDataList.filter(
      (n) => n.imageId !== imageId
    )
    formState.imageInfo.imageDataList = newList
    this.setState({ formState })
  }

  validateForm(apiName, key, required) {
    const validation = Validations.validationCheck(this, apiName, key, required)
    const error = this.state.error
    error[key] = validation
    this.setState({ error })
    return error[key].result === 'OK'
  }

  validateAllForm() {
    const { formState } = this.state
    let validate01 = true
    let validate02 = true
    if (this.props.type !== 'add' && !formState.isShareModify) {
      validate01 = this.validateForm(
        'ARS002-A008',
        'imageInfo.certificateTypeCode',
        true
      )
      validate02 = this.validateForm(
        'ARS002-A008',
        'imageInfo.certificateNumber',
        true
      )
      if (
        formState.imageInfo.certificateTypeCode === '101' ||
        formState.imageInfo.certificateTypeCode === '200' ||
        formState.imageInfo.certificateTypeCode === '201'
      ) {
        validate02 = true
      }
    }
    let validate03 = true
    if (this.props.type !== 'add' && !formState.isShareModify) {
      validate03 = this.contractImageDataList().length > 0
    }
    const error = this.state.error
    if (!validate03) {
      error['imageInfo.imageDataList'] = {
        result: 'NG',
        attribute: 'attribute',
        error: 'error',
        message: '送信する画像ファイルを選択してください',
      }
    } else {
      error['imageInfo.imageDataList'] = { result: 'OK' }
    }

    return validate01 && validate02 && validate03
  }

  toHalfWidth(input) {
    return input.replace(/[！-～]/g, function (input) {
      return String.fromCharCode(input.charCodeAt(0) - 0xfee0)
    })
  }

  handleChangeNotification(e, notice_status) {
    this.setState({ notice_status })
  }

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()
    if (url === '/mypage/change/transfer/confirm') {
      const params = {
        lineInfo: this.state.lineInfo,
        simInfo: this.state.simInfo,
        applyNumber: this.state.applyNumber,
        sharePlanFlag: this.state.sharePlanFlag,
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

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする
    console.log(this.state.changeUser)
    let body = _.cloneDeep(this.state.formState)

    body.imageInfo = this.state.formState.imageInfo
    body.applyNumber = this.state.applyNumber
    body.token = token

    if (this.state.changeUser) {
      const simList = [
        {
          iccid: this.state.simInfo[0].ICCID,
          changeUserInfo: 1,
        },
      ]
      body.simList = simList
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

    console.log(body)

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

  async handleSubmitSend() {
    if (this.state.applyNumber) {
      const token = await getToken(this.state.applyNumber)

      const update = await this.updateApplyInfo(token)

      if (update && update.result === 'OK') {
        this.goNextDisplay(null, '/mypage/change/transfer/confirm')
      }
    }
  }

  render() {
    const { formState } = this.state

    const disabledImageListNum =
      this.state.formState.customerInfo.gender == 3 ? 49 : 3

    const imageDataList = this.contractImageDataList().map((item) => {
      return (
        <div className="thumbnailBlock" key={item.imageId}>
          <img src={'/pg/getImage?id=' + item.imageId} alt="" />
          <button circular onClick={() => this.fileRemove(item.imageId)}>
            <img
              src={iconRemove}
              alt=""
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
          </button>
        </div>
      )
    })

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
                  本人確認書類をアップロードしてください。
                </h2>
                <React.Fragment>
                  <p>
                    証明書番号の種類、証明書番号を入力してください。
                    <br />
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => {
                        this.setState({ modal: true })
                      }}
                    >
                      証明書番号とは？
                    </a>
                  </p>
                  <p className="noteText" style={{ marginBottom: 0 }}>
                    ※ご入力いただいた契約者さま氏名、生年月日、お住まいと、のちほどアップロードいただく本人確認書類に記載されている内容が一致しない場合は、お申し込みをお受けできません
                  </p>
                </React.Fragment>
                <div className="ui_fields">
                  <div className="ui_field">
                    <div className="ui_select">
                      <select onChange={this.handleChangeCertificateType}>
                        <option value="">
                          アップロードする本人確認書類を選択
                        </option>
                        {certificateOptions.map((item) => {
                          const selected =
                            item.value ==
                              this.state.formState.imageInfo
                                .certificateTypeCode &&
                            this.state.formState.imageInfo
                              .certificateTypeCode == item.value
                          return (
                            <option
                              key={item.key}
                              selected={selected}
                              value={item.value}
                            >
                              {item.text}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="ui_field">
                    {(() => {
                      if (
                        this.state.formState.imageInfo.certificateTypeCode !==
                          '101' &&
                        this.state.formState.imageInfo.certificateTypeCode !==
                          '200' &&
                        this.state.formState.imageInfo.certificateTypeCode !==
                          '201'
                      ) {
                        return (
                          <div className="ui_input">
                            <input
                              id="certificateNumber"
                              type="text"
                              placeholder="証明書番号"
                              maxLength="20"
                              onChange={(e) =>
                                this.handleChangeInput(e, 'certificateNumber')
                              }
                              value={
                                this.state.formState.imageInfo.certificateNumber
                              }
                            />
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
                <MessageArea
                  error={this.state.error}
                  param="imageInfo.certificateTypeCode"
                />
                {(() => {
                  if (
                    this.state.formState.imageInfo.certificateTypeCode !==
                      '101' &&
                    this.state.formState.imageInfo.certificateTypeCode !==
                      '200' &&
                    this.state.formState.imageInfo.certificateTypeCode !== '201'
                  ) {
                    return (
                      <MessageArea
                        error={this.state.error}
                        param="imageInfo.certificateNumber"
                      />
                    )
                  }
                })()}

                {(() => {
                  if (
                    this.state.formState.imageInfo.certificateTypeCode === '101'
                  ) {
                    return (
                      <div
                        className="ContentArea ContentAreaColor-confirm"
                        style={{ fontWeight: 'bold', margin: '0' }}
                      >
                        <ul
                          style={{
                            color: '#512713',
                            fontSize: '13px',
                            listStyle: 'disc',
                            marginBottom: '14px',
                            paddingLeft: '14px',
                          }}
                        >
                          <li>
                            <p
                              style={{
                                marginBottom: 0,
                              }}
                            >
                              下図を参照して
                              <span style={{ color: '#ba0080' }}>
                                健康保険被保険者証に記載の保険者番号、記号・番号・枝番・二次元コードをマスク
                              </span>
                              してください。
                            </p>
                          </li>
                          <li>
                            <p style={{ marginBottom: 0, color: '#ba0080' }}>
                              保険者番号・記号・番号・枝番・二次元コード以外はマスクしないでください。
                            </p>
                          </li>
                          <li>
                            <p
                              style={{
                                marginBottom: 0,
                              }}
                            >
                              <span style={{ color: '#ba0080' }}>
                                補助書類が必要
                              </span>
                              です。（被保険者証のみではお申し込みいただけません）
                              <a
                                className="blank"
                                href="https://aeonmobile.jp/support/verify/"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                詳しくはこちら
                              </a>
                            </p>
                          </li>
                          <li>
                            <p
                              style={{
                                marginBottom: 0,
                              }}
                            >
                              画像は一例です。保険者により被保険者証の書式は異なります。
                            </p>
                          </li>
                        </ul>
                        <div className="cardImageArea">
                          <div>
                            <p style={{ color: '#512713' }}>マスク前イメージ</p>
                            <img src={imgHoken01} alt="" />
                          </div>
                          <div>
                            <p style={{ color: '#512713' }}>マスク後イメージ</p>
                            <img src={imgHoken02} alt="" />
                          </div>
                        </div>
                      </div>
                    )
                  } else if (
                    this.state.formState.imageInfo.certificateTypeCode === '102'
                  ) {
                    return (
                      <div
                        className="ContentArea ContentAreaColor-confirm"
                        style={{ margin: '0' }}
                      >
                        <p
                          className="noteText"
                          style={{
                            color: '#ba0080',
                            fontWeight: 'bold',
                            marginTop: '0',
                          }}
                        >
                          ※所持人記入欄がないパスポートを本人確認書類とする場合は住所を確認できる補助書類が必要です。
                          <a
                            className="blank"
                            href="https://aeonmobile.jp/support/verify/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            詳しくはこちら
                          </a>
                        </p>
                      </div>
                    )
                  }
                })()}
                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <button
                    className="imageSelectButton"
                    disabled={
                      this.contractImageDataList().length > disabledImageListNum
                    }
                    onClick={() => {
                      // 証明書番号の種類が選択されているかチェック
                      const error = this.state.error
                      if (!this.state.formState.imageInfo.certificateTypeCode) {
                        // お選びください表示
                        error['imageInfo.imageDataList'] = {
                          result: 'NG',
                          attribute: 'attribute',
                          error: 'error',
                          message: '先に証明書の種類をお選びください',
                        }
                        this.setState({ error })
                        return
                      } else {
                        // エラー表示解除
                        error['imageInfo.imageDataList'] = {
                          result: 'OK',
                        }
                        this.setState({ error })
                      }
                      this.fileInputRef.click()
                    }}
                  >
                    <img
                      src={iconImageSelect}
                      alt="imageSelect"
                      style={{ width: '43px', height: '34px' }}
                    />
                    <span>本人確認書類を選択する</span>
                  </button>
                  <input
                    id="fileInputCustomerImage"
                    ref={(input) => {
                      this.fileInputRef = input
                    }}
                    type="file"
                    hidden
                    onClick={(e) => {
                      // valueを初期化する
                      e.target.value = ''
                      // 5枚以上はアップロード不可 法人の場合は50枚以上
                      if (
                        this.contractImageDataList().length >
                        disabledImageListNum
                      ) {
                        e.preventDefault()
                      }
                    }}
                    onChange={this.fileChange}
                  />
                </div>
                <MessageArea
                  error={this.state.error}
                  param="imageInfo.imageDataList"
                />
                <div
                  style={{
                    display: this.contractImageDataList().length
                      ? 'flex'
                      : 'none',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    padding: '16px',
                  }}
                >
                  {imageDataList}
                </div>
                <p
                  className="noteText"
                  style={{ padding: '0', textIndent: '0' }}
                >
                  ※画像ファイルは
                  {this.state.formState.customerInfo.gender == 3 ? '50' : '4'}
                  枚までアップロード可能です。
                  <br />
                  ※アップロード可能な画像ファイルのサイズは1枚あたり5MBまでです。
                  <br />
                  ※アップロード可能な画像種別はjpg、pngです。
                </p>
                <p style={{ color: '#ba0080', marginBottom: 0 }}>
                  ※お申込み時点で有効期限内の本人確認書類の画像をご用意ください。
                </p>
                <p
                  className="indentText"
                  style={{ color: '#ba0080', margin: 0 }}
                >
                  ※本人確認書類の画像が不鮮明、影や反射で一部が読み取れない、見切れがある場合はお申込みは不備になります。
                </p>
                <p
                  className="indentText"
                  style={{ color: '#ba0080', marginTop: 0 }}
                >
                  ※本人確認書類原本を撮影したカラー画像をご用意ください。コピ―を撮影・スクリーンショット・加工されていると判断される画像は不備になります。
                </p>
                <p
                  className="indentText"
                  style={{ color: '#ba0080', marginTop: 0 }}
                >
                  ※臓器提供箇所に情報を記載いただいている場合、お客様ご自身で付箋などで隠して頂いたき、撮影頂くようお願いいたします。
                </p>

                <div className="ContentArea ContentAreaColor-confirm">
                  <p>
                    お客さま情報入力ページで入力いただいた内容とあっているかご確認ください
                  </p>

                  <h2 className="Heading3">＜入力済みお客さま情報＞</h2>
                  <div className="fotmItem">
                    <div className="formTitle">
                      {formState.customerInfo.gender == 3
                        ? 'ご契約法人名'
                        : '契約者氏名'}
                    </div>
                    <div className="formInput">
                      {`${formState.customerInfo.lastName} ${formState.customerInfo.firstName}`}
                    </div>
                  </div>
                  {formState.customerInfo.gender == 3 && (
                    <div className="fotmItem">
                      <div className="formTitle">担当者名</div>
                      <div className="formInput">
                        {formState.customerInfo.chargeName}
                      </div>
                    </div>
                  )}
                  {/* <div className="fotmItem">
                    <div className="formTitle">
                      {formState.customerInfo.gender === 3
                        ? '担当者生年月日'
                        : '生年月日'}
                    </div>
                    <div className="formInput">
                      {`${formState.customerInfo.birthday[0]}年 ${formState.customerInfo.birthday[1]}月 ${formState.customerInfo.birthday[2]}日`}
                    </div>
                  </div> */}
                  <div className="fotmItem">
                    <div className="formTitle">住所</div>
                    <div className="formInput">
                      {`${formState.customerInfo.address1} ${formState.customerInfo.address2} ${formState.customerInfo.address3} ${formState.customerInfo.address4} ${formState.customerInfo.address5} ${formState.customerInfo.address6}`}
                    </div>
                  </div>
                </div>

                <h4>内容の確認</h4>
                <p>
                  アップロードいただいた
                  {formState.customerInfo.gender == 3 ? '' : '本人'}
                  確認書類に記載されている氏名・住所・生年月日が現氏名・住所・生年月日になっているかどうかご確認ください
                </p>
                <ul
                  style={{
                    paddingLeft: 0,
                    listStyle: 'none',
                  }}
                >
                  {formState.customerInfo.gender == 3 && (
                    <React.Fragment>
                      <li>
                        <label className="ui_checkbox">
                          <input
                            type="checkbox"
                            value={this.state.verified[3]}
                            onChange={(e) => this.handleChangeVerified(e, 3)}
                          />
                          <span className="ui_checkbox_label">
                            登記簿謄(抄)本（現在（履歴）事項証明書）または印鑑証明書をアップロードした
                          </span>
                        </label>
                      </li>
                      <li>
                        <label className="ui_checkbox">
                          <input
                            type="checkbox"
                            value={this.state.verified[4]}
                            onChange={(e) => this.handleChangeVerified(e, 4)}
                          />
                          <span className="ui_checkbox_label">
                            名刺または社員証をアップロードした
                          </span>
                        </label>
                      </li>
                      <li>
                        <label className="ui_checkbox">
                          <input
                            type="checkbox"
                            value={this.state.verified[5]}
                            onChange={(e) => this.handleChangeVerified(e, 5)}
                          />
                          <span className="ui_checkbox_label">
                            担当者の本人確認書類をアップロードした
                          </span>
                        </label>
                      </li>
                    </React.Fragment>
                  )}
                  <li>
                    <li>
                      <label className="ui_checkbox">
                        <input
                          id="checkbox_address"
                          type="checkbox"
                          value={this.state.verified[0]}
                          onChange={(e) => this.handleChangeVerified(e, 0)}
                        />
                        <span className="ui_checkbox_label">住所は正しい</span>
                      </label>
                    </li>
                  </li>
                  <li>
                    <label className="ui_checkbox">
                      <input
                        id="checkbox_name"
                        type="checkbox"
                        value={this.state.verified[1]}
                        onChange={(e) => this.handleChangeVerified(e, 1)}
                      />
                      <span className="ui_checkbox_label">氏名は正しい</span>
                    </label>
                  </li>
                  <li>
                    <label className="ui_checkbox">
                      <input
                        id="checkbox_birthday"
                        type="checkbox"
                        value={this.state.verified[2]}
                        onChange={(e) => this.handleChangeVerified(e, 2)}
                      />
                      <span className="ui_checkbox_label">
                        生年月日は正しい
                      </span>
                    </label>
                  </li>
                  {formState.imageInfo.certificateTypeCode === '101' && (
                    <React.Fragment>
                      <li>
                        <label className="ui_checkbox">
                          <input
                            id="checkbox_mask"
                            label="健康保険証をマスクした"
                            type="checkbox"
                            value={
                              formState.customerInfo.gender == 3
                                ? this.state.verified[6]
                                : this.state.verified[3]
                            }
                            onChange={(e) =>
                              this.handleChangeVerified(
                                e,
                                formState.customerInfo.gender == 3 ? 6 : 3
                              )
                            }
                          />
                          <span className="ui_checkbox_label">
                            健康保険証をマスクした
                          </span>
                        </label>
                      </li>
                      <li>
                        <label className="ui_checkbox">
                          <input
                            id="checkbox_upload"
                            label="補助書類をアップロードした"
                            type="checkbox"
                            value={
                              formState.customerInfo.gender == 3
                                ? this.state.verified[7]
                                : this.state.verified[4]
                            }
                            onChange={(e) =>
                              this.handleChangeVerified(
                                e,
                                formState.customerInfo.gender == 3 ? 7 : 4
                              )
                            }
                          />
                          <span className="ui_checkbox_label">
                            補助書類をアップロードした
                          </span>
                        </label>
                      </li>
                    </React.Fragment>
                  )}
                  <div className="formbtnFlex">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.history.goBack()
                      }}
                      className="formbtn return"
                    >
                      戻る
                    </button>
                    <button
                      id="transit_to_acs"
                      onClick={(e) => {
                        if (this.validateAllForm()) {
                          /*  this.goNextDisplay(e, '/mypage/change/transfer/confirm') */
                          this.handleSubmitSend()
                        } else {
                          // エラー発生箇所の一番目の要素へスクロール
                        }
                      }}
                      className="formbtn next"
                      disabled={!this.state.isVerified}
                    >
                      確認
                    </button>
                  </div>
                </ul>
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
        {this.state.imageResetModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <h3>
                  証明書番号の種類が異なる画像が既にアップロードされています。
                </h3>
                <p>アップロードした画像を削除してもよろしいですか？</p>
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setState({
                      imageResetModal: false,
                      nextCertificateType: '',
                    })
                  }}
                >
                  キャンセル
                </button>
                <button
                  className="Button"
                  onClick={(e) => {
                    const { formState } = this.state
                    _.remove(
                      formState.imageInfo.imageDataList,
                      (item) => item.imageType !== 3
                    )
                    //formState.imageInfo.deleteImageDataList = 1 // 店タブ用に用意したもののため必要ない？
                    this.setState({ formState, imageResetModal: false })
                    this.handleChangeCertificateType(null, {
                      value: this.state.nextCertificateType,
                    })
                    //this.props.updateApplyNumber('update')
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.cautionModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <p>{this.state.cautionText}</p>
              </div>
              <div className="ulModal_actions">
                <button
                  className="ulModal_button"
                  onClick={() => {
                    this.setState({ cautionModal: false })
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.modal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div
                className="ulModal_content"
                style={{
                  fontSize: '14px',
                  borderBottom: '1px solid rgba(34,36,38,.15)',
                }}
              >
                <h3>証明書番号とは</h3>
              </div>
              <div className="ulModal_content">
                <p>本人確認書類に記載されている、各種番号をご入力ください。</p>
                <ul className="ulModal_list">
                  <li>
                    <p style={{ marginBottom: '0' }}>運転免許証</p>
                    <p>免許証番号（12桁）</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>健康保険被保険者証</p>
                    <p>番号無し</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>日本国発行パスポート</p>
                    <p>旅券番号</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>在留カード</p>
                    <p>在留カード番号</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>障碍者手帳</p>
                    <p>番号</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>マイナンバーカード</p>
                    <p>番号無し</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>住民基本台帳カード</p>
                    <p>番号無し</p>
                  </li>
                  <li>
                    <p style={{ marginBottom: '0' }}>その他</p>
                    <p>書類記載の番号</p>
                  </li>
                </ul>
              </div>
              <div className="ulModal_actions">
                <button
                  className="ulModal_button"
                  onClick={() => {
                    this.setState({ modal: false })
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.editMaskModal && (
          <ImageEditWindow
            close={() => this.setState({ editMaskModal: false })}
            uploadImage={(imageData, imageType) => {
              this.setState({ editMaskModal: false })
              this.fileUpload(imageData, imageType)
            }}
            selectedImageData={this.state.selectedImageData}
            selectedImageSize={this.state.selectedImageSize}
          />
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

export default connect(mapStateToProps)(Change_Transfer_Step2)
