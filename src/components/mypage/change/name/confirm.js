import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

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
} from '../../../../actions/ArsActions'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

class Change_Name_Confirm extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.submitNotification = this.submitNotification.bind(this)
    this.submitUpdateData = this.submitUpdateData.bind(this)

    this.state = {
      loading_state: false,
      mailAddress: '',
      receptModal: false, // isCheckSameName用モーダル
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
    }
  }
  async componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_CHANGE_NAME
    if (window.customerId === undefined) return
    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
    }
    const formState = await getApplyInfo(this.state.applyNumber)
    const { mailAddress } = await getAgreementData(window.customerId)
    const notice_status = mailAddress.length > 0 ? '2' : '1'
    this.setState({ formState, notice_status, mailAddress })
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
        this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
      } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
        this.setState({ notification: data.data })
        //this.setState({ notice_status: data.data.status })
        //
      } else if (type === Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
        //通知設定の更新
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

  handleChangeNotification(e, notice_status) {
    this.setState({ notice_status })
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

  submitNotification() {
    if (this.state.notice_status !== this.state.notification.status) {
      this.handleConnect(Const.CONNECT_TYPE_INSERT_NOTIFICATION)
      console.log('更新')
    }

    this.goNextDisplay(null, '/mypage/user/')
  }

  async submitUpdateData() {
    const token = await getToken(this.state.applyNumber)
    await this.updateApplyInfo(token)
    /* const formState = this.state.formState
    console.log(formState.customerInfo.mail1)
    formState.customerInfo.mail1 = ''
    this.setState({ formState }) */

    if (this.state.notification.status === '1') {
      this.setState({ receptModal: true })
    } else {
      this.goNextDisplay(null, '/mypage/user/')
    }

    /* const params={
      this.state.formState
    } */
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
      case '106':
        certificateName = '現在事項証明書'
        break
      case '107':
        certificateName = '履歴事項証明書'
        break
      case '108':
        certificateName = '印鑑証明書'
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

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする

    let body = _.cloneDeep(this.state.formState)
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

  render() {
    const { formState } = this.state
    //console.log(formState.imageInfo.certificateNumber)
    const certificateName = this.handleCertificateName(
      formState.imageInfo.certificateTypeCode
    )
    console.log(certificateName)
    const imageDataList = this.contractImageDataList().map((item) => {
      return (
        <div className="thumbnailBlock" key={item.imageId}>
          <img src={'/pg/getImage?id=' + item.imageId} alt="" />
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
                <h1 className="a-h1">お客さま契約情報変更申請</h1>
                <div className="form_content">
                  <p className="a-h2">変更内容をご確認ください。</p>
                  <hr className="a-hr a-hr-full" />
                  <div>
                    <table className="form_table">
                      <tr>
                        <th>
                          {formState.customerInfo.gender === 3
                            ? 'ご契約法人名'
                            : 'ご契約者さま氏名'}
                        </th>
                        <td>
                          {formState.customerInfo.lastName}
                          {formState.customerInfo.firstName}
                        </td>
                      </tr>
                      <tr>
                        <th>
                          {formState.customerInfo.gender === 3
                            ? 'ご契約法人名'
                            : 'ご契約者さま氏名'}
                          （カタカナ）
                        </th>
                        <td>
                          {formState.customerInfo.lastNameKana}
                          {formState.customerInfo.firstNameKana}
                        </td>
                      </tr>
                      {formState.customerInfo.gender !== 3 && (
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
                      )}
                      <tr>
                        <th>
                          {formState.customerInfo.gender === 3
                            ? '住所'
                            : 'お住まい'}
                        </th>
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
                      {this.contractImageDataList().length > 0 && (
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
                      )}
                      {certificateName.lenght > 0 && (
                        <tr>
                          <th>本人確認書類</th>
                          <td>{certificateName}</td>
                        </tr>
                      )}
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
                        onChange={(e) => this.handleChangeNotification(e, '1')}
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
                        onChange={(e) => this.handleChangeNotification(e, '2')}
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

export default connect(mapStateToProps)(Change_Name_Confirm)
