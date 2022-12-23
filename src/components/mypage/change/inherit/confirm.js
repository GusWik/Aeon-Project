import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
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
  getApplyInfo,
  getAgreementData,
  updateApplyInfoParam,
  getService,
  getChangingPlanMst,
} from '../../../../actions/ArsActions'
import { groupBySimOptions, getSimKind } from '../../../../actions/Methods'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

class Change_Inherit_Confirm extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.submitNotification = this.submitNotification.bind(this)
    this.submitUpdateData = this.submitUpdateData.bind(this)

    this.state = {
      receptModal: false, // isCheckSameName用モーダル
      confirmModal: false, //プランとオプションが選択できなくなります。
      confirmOptionModal: false, //以下のオプションが加入不可となるため、...
      newOptionModal: false, //お手続きはまだ完了しておりません。
      planModal: false,
      finishModal: false,
      btnDisabled: true,
      mailAddress: '',
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      selectedPlan: '',
      planMst: [],
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '',
          sessionNoUseFlg: '1',
          token: '',
        },
      ],
      planName: '',
      planId: '',
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
      lineInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.lineInfo
          : '',
      simInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : [],
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
      sharePlanFlag:
        props.history.location.state !== undefined
          ? props.history.location.state.sharePlanFlag
          : '',
      simType: '',
      simKind: '',
      checkLimited: {},
      isFirstErrors: false, //初回確認エラー有無
    }
  }
  async componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_CHANGE_INHERIT
    if (window.customerId === undefined) return
    this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
    this.handleConnect(Const.CONNECT_TYPE_PLAN)
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    const formState = await getApplyInfo(this.state.applyNumber)
    const { mailAddress } = await getAgreementData(window.customerId)
    const notice_status = mailAddress.length > 0 ? '2' : '1'
    this.setState({ formState, notice_status, mailAddress })
    const checkLimited = formState.checkLimited
    if (checkLimited.plan !== undefined || checkLimited.option !== undefined) {
      this.setState({ isFirstErrors: true })
    }
    // progressApplyNumberを初期化
    localStorage.removeItem('progressApplyNumber')
  }

  async planInit(planServiceId) {
    const { planKind } = await getService(planServiceId)
    const limitedType = ('00' + planKind).slice(-2)

    const simKind = getSimKind(this.state.simInfo)

    const body = {
      lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      lineDiv: this.state.lineInfo[0].lineDiv,
      gender: this.state.formState.customerInfo.gender,
      simKind,
      //appFlag: this.state.appFlag,
      limitedType,
    }

    const { plan: planMst } = await getChangingPlanMst(body)
    this.setState({ planMst })
  }

  handleConnect(type) {
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
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
      case Const.CONNECT_TYPE_PLAN:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            lineKeyObject,
            lineDiv: this.state.lineInfo[0].lineDiv,
            perNum: 3, // 固定
            pageNo: 1, // 固定
          }
          console.log(params)
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_SIM_DATA:
        {
          params = {
            lineKeyObject: this.state.lineInfo[0].lineKeyObject,
            lineDiv: this.state.lineInfo[0].lineDiv,
            lineNo: this.state.lineInfo[0].simInfo[0].lineNo,
          }
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
    this.setState({ loading_state: false })
    if (status === Const.CONNECT_SUCCESS) {
      console.log(type)
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
        this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        this.setState({
          notification: data.data,
          //notice_status: data.data.status,
        })
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        //通知設定の更新
      } else if (type === Const.CONNECT_TYPE_PLAN) {
        const params = data.data
        this.setState({ planName: params.planName, planId: params.planId })
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        const option_data = data.data.optionArray.filter(
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

        this.setState({ simType, simKind })
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION
      this.props.history.push('/login')
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

  goNextDisplay(e, url, params) {
    if (e !== null) e.preventDefault()
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

  //1.変更を申請する
  async submitUpdateData() {
    const { checkLimited } = await getApplyInfo(this.state.applyNumber)
    this.setState({ checkLimited })

    /* const dummy_checkLimited = {
      plan: [
        {
          planServiceId: '0704000522',
          planName: 'やさしいプラン M. (音声6GB)　税込1,188円',
        },
      ],
      option: [
        {
          optionServiceId: '0702010035',
          optionName: 'やさしい安心パック1',
          iccid: '111',
        },
        {
          optionServiceId: '0702010035',
          optionName: 'やさしい安心パック2',
          iccid: '222',
        },
        {
          optionServiceId: '0702010035',
          optionName: 'やさしい安心パック3',
          iccid: '333',
        },
        {
          optionServiceId: '0702010035',
          optionName: 'やさしい安心パック4',
          iccid: '111',
        },
      ],
    } */

    // テスト用
    // const checkLimited = dummy_checkLimited

    console.log(checkLimited)
    if (checkLimited.plan !== undefined || checkLimited.option !== undefined) {
      console.log(checkLimited.plan)
      console.log(checkLimited.option)
      if (checkLimited.plan !== undefined) {
        await this.planInit(checkLimited.plan[0].planServiceId)
      }

      //2.プランエラー処理
      if (checkLimited.plan !== undefined) {
        this.setState({ confirmModal: true })
      } else if (checkLimited.option !== undefined) {
        //3.オプションエラー処理
        this.setState({ confirmOptionModal: true })
      }
    } else {
      if (this.state.isFirstErrors) {
        this.setState({
          newOptionModal: true,
        })
      } else {
        await this.handleUpdate()
      }
    }
  }

  //2.プラン変更リクエスト
  async submitPlanChange() {
    let body = _.cloneDeep(this.state.formState)

    let customerInfoType_list = body.customerInfoType.split(',')
    if (!customerInfoType_list.includes('305')) {
      customerInfoType_list.push('305')
    }
    const customerInfoType = customerInfoType_list.join(',')

    body.planServiceId = this.state.selectedPlan
    body.customerInfoType = customerInfoType

    let simKind =
      this.state.sharePlanFlag == 1
        ? '04'
        : getSimKind(this.state.simInfo)

    console.log(simKind)
    var simLists = [
      {
        simKind: simKind,
      },
    ]
    body.simList = simLists

    console.log(body)
    await updateApplyInfoParam(body, this.state.applyNumber)
    this.setState({ planModal: false, formState: body })
    //3.オプションエラー処理
    if (this.state.checkLimited.option) {
      this.setState({ confirmOptionModal: true })
    } else {
      //確定
      await this.handleUpdate()
    }
  }

  // 3.以下のオプションが加入不可となるため、解除されますがよろしいですか？
  async handleRemoveOptions() {
    let body = _.cloneDeep(this.state.formState)

    let customerInfoType_list = body.customerInfoType.split(',')
    if (!customerInfoType_list.includes('306')) {
      customerInfoType_list.push('306')
    }
    const customerInfoType = customerInfoType_list.join(',')
    const simList = groupBySimOptions(this.state.checkLimited.option)
    console.log(simList)

    body.customerInfoType = customerInfoType
    body.simList = simList

    await updateApplyInfoParam(body, this.state.applyNumber)
    this.setState({
      formState: body,
      confirmOptionModal: false,
      newOptionModal: true,
    })
  }

  // 最後更新
  async handleUpdate() {
    await this.updateApplyInfo()

    //郵送設定
    if (this.state.notification.status === '1') {
      this.setState({ receptModal: true })
    } else {
      this.setState({ finishModal: true })
    }
    console.log('完了')
  }

  // 通知モーダル
  async submitNotification() {
    if (this.state.notice_status !== this.state.notification.status) {
      this.handleConnect(Const.CONNECT_TYPE_INSERT_NOTIFICATION)
      console.log('更新')
    }
    this.setState({ receptModal: false, finishModal: true })
  }

  handleCertificateName(key) {
    let certificateName = ''
    switch (key) {
      case '100':
        certificateName = '運転免許証(免許証番号)'
        break
      case '101':
        certificateName = '健康保険被保険者証'
        break
      case '102':
        certificateName = '日本国発行パスポート(旅券番号)'
        break
      case '103':
        certificateName = '在留カード(番号)'
        break
      case '104':
        certificateName = '障碍者手帳(番号)'
        break
      case '200':
        certificateName = 'マイナンバーカードのため入力不可'
        break
      case '201':
        certificateName = '住民基本台帳カードのため番号無し'
        break
      case '900':
        certificateName = 'その他'
        break
      default:
        break
    }

    return certificateName
  }

  async updateApplyInfo() {
    // API
    // 遷移時に取得したapplyNumberをセットする

    const body = _.cloneDeep(this.state.formState)
    const token = await getToken(this.state.applyNumber)

    body.commitFlag = 1
    body.token = token

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

  handleChangePlan(e) {
    console.log(e.target.value)
    const selectedPlan = e.target.value
    this.setState({ selectedPlan })
  }

  render() {
    const { formState } = this.state
    //console.log(formState.imageInfo.certificateNumber)
    const certificateName = this.handleCertificateName(
      formState.imageInfo.certificateTypeCode
    )

    const imageDataList = this.contractImageDataList().map((item) => {
      return (
        <div className="thumbnailBlock" key={item.imageId}>
          <img src={'/pg/getImage?id=' + item.imageId} alt="" />
        </div>
      )
    })

    this.item = this.state.planMst.map((item) => (
      <option
        value={item.planId}
        key={item.planId}
        selected={this.state.selectedPlan == item.planId}
      >
        {item.planName}
      </option>
    ))
    return (
      <React.Fragment>
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
                    <a
                      href=""
                      onClick={(e) => this.goNextDisplay(e, '/mypage/user/')}
                    >
                      お客様情報/ログイン
                    </a>
                  </li>
                  <li className="m-breadcrumb_item">
                    お客さま契約情報変更申請
                  </li>
                </ol>
                <h1 className="a-h1">名義変更(利用権譲渡)</h1>
                <div className="form_content">
                  <p className="a-h2">変更内容をご確認ください。</p>
                  <hr className="a-hr a-hr-full" />
                  <div>
                    <table className="form_table">
                      <tr>
                        <th>ご契約者さま氏名</th>
                        <td>
                          {formState.customerInfo.lastName}
                          {formState.customerInfo.firstName}
                        </td>
                      </tr>
                      <tr>
                        <th>ご契約者さま氏名（カタカナ）</th>
                        <td>
                          {formState.customerInfo.lastNameKana}
                          {formState.customerInfo.firstNameKana}
                        </td>
                      </tr>
                      <tr>
                        <th>ご契約者さま性別</th>
                        <td>
                          {formState.customerInfo.gender === 1
                            ? '男性'
                            : formState.customerInfo.gender === 2
                            ? '女性'
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <th>生年月日</th>
                        <td>
                          {moment(formState.customerInfo.birthday).format(
                            'YYYY年MM月DD日'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>お住まい</th>
                        <td>
                          {formState.customerInfo.zipCode}
                          {formState.customerInfo.address1}
                          {formState.customerInfo.address2}
                          {formState.customerInfo.address3}
                          {formState.customerInfo.address4}
                          {formState.customerInfo.address5}
                          {formState.customerInfo.address6}
                        </td>
                      </tr>
                      <tr>
                        <th>連絡先電話番号</th>
                        <td>{formState.customerInfo.tel}</td>
                      </tr>
                      <tr>
                        <th>本人確認画像</th>
                        <td>
                          <div
                            style={{
                              display: this.contractImageDataList().length
                                ? 'flex'
                                : 'none',
                              flexWrap: 'wrap',
                              padding: '16px',
                            }}
                          >
                            {imageDataList}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>本人確認書類</th>
                        <td>{certificateName}</td>
                      </tr>
                    </table>

                    <div className="formbtnFlex">
                      <button
                        className="formbtn return"
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.history.goBack()
                        }}
                      >
                        戻る
                      </button>
                      <button
                        className="formbtn next"
                        disabled={!this.state.simKind}
                        onClick={this.submitUpdateData}
                      >
                        変更を申請する
                      </button>
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
                  onClick={(e) => this.goNextDisplay(e, '/mypage/user/')}
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
        {this.state.confirmModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                  }}
                >
                  名義変更（利用権譲渡）もしくは承継に伴い、現在選択中のプランとオプションが選択できなくなります。
                </h3>
                <p>
                  ※プランの変更とオプションの変更が完了するまでは、申し込みは完了しておりませんので、ご注意ください。
                </p>
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
                  onClick={() => this.setState({ confirmModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  onClick={() =>
                    this.setState({ confirmModal: false, planModal: true })
                  }
                >
                  プラン変更へ進む
                </button>
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
                      <p className="a-h3">{this.state.planName}</p>
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
        {this.state.confirmOptionModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ confirmOptionModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    marginBottom: '0',
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  以下のオプションが加入不可となるため、
                  <br />
                  解除されますがよろしいですか？
                </h3>

                <div className="option_modal_box" style={{ marginTop: '24px' }}>
                  <h4>契約中のオプション</h4>
                  <div className="option_modal_list">
                    {this.state.checkLimited.option.map((item) => (
                      <dl key={item.optionServiceId}>
                        <dt className="option_modal_list_title">
                          {item.optionName}
                        </dt>
                        <dd className="option_modal_list_price"></dd>
                        <dd className="option_modal_list_icon"></dd>
                      </dl>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '24px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ confirmOptionModal: false })}
                >
                  いいえ
                </button>
                <button
                  className="formbtn next"
                  onClick={() => {
                    this.handleRemoveOptions()
                  }}
                >
                  はい
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.newOptionModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ newOptionModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  お手続きはまだ完了しておりません。
                </h3>
              </div>
              <div>
                <div>
                  <div
                    className="newOption_box"
                    onClick={(e) => {
                      localStorage.setItem(
                        'progressApplyNumber',
                        this.state.applyNumber
                      )
                      this.goNextDisplay(e, '/mypage/user/')
                    }}
                  >
                    新たなオプションを加入する方は
                    <br />
                    こちらからお進みください
                  </div>
                  <div
                    className="newOption_box"
                    onClick={() => {
                      this.setState({ newOptionModal: false })
                      this.handleUpdate()
                    }}
                  >
                    お手続きを完了する
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.finishModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={(e) => this.goNextDisplay(e, '/mypage/user/')}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  名義変更、プラン変更、オプション変更お手続きを受け付けました。
                </h3>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '0',
                }}
              >
                <button
                  className="formbtn next"
                  onClick={(e) => this.goNextDisplay(e, '/mypage/user/')}
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

export default connect(mapStateToProps)(Change_Inherit_Confirm)
