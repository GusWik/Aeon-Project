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
  getAgreementData,
  getApplyInfo,
} from '../../../../actions/ArsActions'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

import option_arrow_down from '../../../../modules/images/option_arrow_down.png'

class Sim_Options_Confirm extends ComponentBase {
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
      receptModal: false, // isCheckSameName用モーダル
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      mailAddress: '',
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '',
          sessionNoUseFlg: '1',
          token: '',
        },
      ],
      user_nick_name:
        props.history.location.state !== undefined
          ? props.history.location.state.user_nick_name
          : '',
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
      options_list:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.options_list
          : [], //加入可能オプション一覧(フラット配列)
      options_default:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.options_default
          : [], //初期選択項目
      options_selected: [], //変更後項目
      options_cancel: [], //廃止予定リスト
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
      lineInfo: {
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
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    const formState = await getApplyInfo(this.state.applyNumber)
    this.setState({ formState })

    console.log(formState.simList[0])

    const allOptionServiceId = formState.simList[0].allOptionServiceId.split(
      ','
    )
    const options_cancel = formState.simList[0].cancelOptionServiceId
    //更新
    console.log(allOptionServiceId)
    console.log(options_cancel)

    const { mailAddress } = await getAgreementData(window.customerId)
    const notice_status = mailAddress.length > 0 ? '2' : '1'

    this.setState({
      options_selected: allOptionServiceId,
      options_cancel,
      mailAddress,
      notice_status,
    })
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
      case Const.CONNECT_TYPE_SIM_DATA: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
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
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        this.setState({ user_nick_name: data.data.nickName })
        this.setState({ iccid: data.data.ICCID })
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
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = window.customerId
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/sim/') {
      params = {
        lineKeyObject: this.state.lineInfo.lineKeyObject,
        lineDiv: this.state.lineInfo.lineDiv,
        lineNo: this.state.lineInfo.lineNo,
      }
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

    this.goNextDisplay(null, '/mypage/sim/')
  }

  async submitUpdateData() {
    await this.updateApplyInfo()
    /* const formState = this.state.formState
    console.log(formState.customerInfo.mail1)
    formState.customerInfo.mail1 = ''
    this.setState({ formState }) */

    if (this.state.notification.status === '1') {
      this.setState({ receptModal: true })
    } else {
      this.goNextDisplay(null, '/mypage/sim/')
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
        certificateName = '健康保険証'
        break
      case '201':
        certificateName = '健康保険証'
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
    let body = _.cloneDeep(this.state.formState)
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

  isCancel(id) {
    return this.state.options_cancel.includes(id)
  }

  isNew(id) {
    return !this.state.options_default.includes(id)
  }

  getOptionItem(id) {
    //console.log(id)
    //console.log(this.state.options_list)
    return this.state.options_list.find((n) => n.optionServiceId === id)
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
                  <li className="m-breadcrumb_item">加入オプション選択</li>
                </ol>
                <h1 className="a-h1">オプション選択</h1>
                <div className="m-form">
                  <div className="t-inner_wide">
                    <div className="m-box-bg a-ta-center">
                      <div className="m-box_body">
                        <h2 className="a-h3">
                          {this.state.user_nick_name}
                          <br />
                          {'（電話番号：' + this.state.lineInfo.lineNo + '）'}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: '25px',
                      lineHeight: '1.48',
                      fontWeight: 'bold',
                    }}
                  >
                    オプション追加・廃止手続き
                  </h3>
                  <div className="option_modal_box">
                    <h4>契約中のオプション</h4>
                    <div className="option_modal_list">
                      {this.state.options_default &&
                        this.state.options_default.map((id) => {
                          const item = this.getOptionItem(id)
                          const isCancel = this.isCancel(id)
                          if (item) {
                            return (
                              <dl key={id}>
                                <dt className="option_modal_list_title">
                                  {item.optionName}
                                </dt>
                                <dd className="option_modal_list_price">
                                  <span>税込</span>
                                  <span>{item.price + '円'}</span>
                                </dd>
                                <dd className="option_modal_list_icon">
                                  {isCancel && <span>廃止</span>}
                                </dd>
                              </dl>
                            )
                          }
                        })}
                    </div>
                  </div>
                  <div className="option_modal_box_arrow">
                    <img src={option_arrow_down} style={{ width: '67px' }} />
                  </div>
                  <div className="option_modal_box option_modal_box_red">
                    <h4>契約後のオプション</h4>
                    <div className="option_modal_list">
                      {this.state.options_selected &&
                        this.state.options_selected.map((id) => {
                          const item = this.getOptionItem(id)
                          const isNew = this.isNew(id)
                          const isCancel = this.state.options_cancel.includes(
                            id
                          )
                          if (item && !isCancel) {
                            return (
                              <dl key={id}>
                                <dt className="option_modal_list_title">
                                  {item.optionName}
                                </dt>
                                <dd className="option_modal_list_price">
                                  <span>税込</span>
                                  <span>{item.price + '円'}</span>
                                </dd>
                                <dd className="option_modal_list_icon">
                                  {isNew && <span>新規</span>}
                                </dd>
                              </dl>
                            )
                          }
                        })}
                    </div>
                  </div>
                  {imageDataList.length > 0 && (
                    <React.Fragment>
                      <p className="a-h2">本人確認書類</p>
                      <hr className="a-hr a-hr-full" />
                      <div>
                        <table className="form_table">
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
                      </div>
                    </React.Fragment>
                  )}
                  <p>
                    ●各種オプションへご加入のお客さまへ
                    <br />
                    加入当月は加入日を基準とし、日割りでオプション料金を請求をさせていただきます。
                    <br />
                    ただし、無料期間等が適用されるオプションについてはこの限りではありません。
                    <br />
                    詳しくは各種オプションの詳細をご確認ください。
                    <br />
                    ・申込み後の差し止め（キャンセル）はお受けできません。
                    <br />
                    ・5分かけ放題、10分かけ放題、やさしい10分かけ放題、フルかけ放題へ加入されるお客さま
                    <br />
                    専用のイオンでんわアプリから発信ください。ただし、NTTドコモ回線については国際通話と一部の例外番号を除き自動的にイオンでんわが適用されるため、アプリのご利用は必須ではありません。
                    <br />
                    また、それぞれ加入受付完了日の当日0時に遡って適用いたします。
                    <br />
                    ※法人さまはご加入いただくことができません。
                    <br />
                    ・5分かけ放題、10分かけ放題、やさしい10分かけ放題、フルかけ放題の間でそれぞれ変更のお客さま
                    新しいかけ放題サービスは翌月より適用させていただきます。
                    <br />
                    ・050かけ放題へご加入されるお客さま
                    <br />
                    登録事務手数料（税込み１,１００円）が発生します。また、ご利用には専用のアプリが必要です。
                    <br />
                    ・留守番電話、割り込み電話着信へご加入されるお客さま
                    <br />
                    お申込みから利用可能になるまで、最大4日程度かかります。
                    <br />
                    サービス開始にはお客さまにて専用ダイヤルに発信し、サービスを開始いただく必要がございます。
                    <br />
                    ・イオンスマホセキュリティ、アプリ超ホーダイ、イオンモバイルセキュリティplus、Filiiへご加入されるお客さま
                    <br />
                    Android専用となっており、iOSには対応しておりません。
                    <br />
                    ・イオンスマホセキュリティ、イオンモバイルセキュリティplus、アプリ超ホーダイ、Filii、iフィルター、music.jp、ルナルナビューティー、カラダメディカご加入されるお客さま
                    <br />
                    お申込み完了後、マイページよりIDなどの各種シリアルナンバーをご確認いただけます。
                    <br />
                    ・スマート留守電にご加入されるお客さま
                    <br />
                    アプリの仕様により、転送電話サービスと併用いただくことができません。
                    <br />
                    ・i-フィルターへご加入されるお客さま
                    <br />
                    SIMカードタイプ2の回線ではお申込みいただくことができません。
                    <br />
                    ●各種オプションを廃止されるお客さまへ
                    <br />
                    当月のオプションサービスの料金は、解約のお申し込み日にかかわらず満額をご請求します。
                    <br />
                    ただし、下記のオプションを除き月末までご利用頂けます。
                    <br />
                    （留守番電話、割り込み電話着信、留守番電話、割り込み電話着信、i-フィルター、ルナルナビューティー、music.jp、CARADA健康相談、ライフレンジャー）
                    <br />
                    ・申込み後の差し止め（キャンセル）はお受けできません。
                    <br />
                    ・イオンスマホ安心パック、やさしい安心パック、イオンスマホ安心保証、持ち込み保証を廃止されるお客さま
                    <br />
                    解約後は再加入いただけません。
                    <br />
                    ・5分かけ放題、10分かけ放題、やさしい10分かけ放題、フルかけ放題、留守番電話、割り込み電話着信を廃止されるお客さま
                    <br />
                    廃止当月は他のかけ放題含め再加入頂くことができません。翌月以降より再加入をお申込みいただけます。
                    <br />
                    ・050かけ放題を廃止されるお客さま
                    <br />
                    月末最終日は050かけ放題の廃止はいただけません。
                    <br />
                    ・子どもパック、スマート留守電、イオンスマホセキュリティ、イオンモバ
                    <br />
                    イルセキュリティplus、Filii、i-フィルターを廃止されるお客さま
                    <br />
                    端末上のアプリ内において、アンインストールなどお客さまにて設定解除が必要です。
                    <br />
                    ・留守番電話、スマート留守電を廃止されるお客さま
                    <br />
                    廃止後はサーバー上のメッセージなどは全て再生不可能となります。
                  </p>
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
                      申し込む
                    </button>
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
                  onClick={(e) => this.goNextDisplay(e, '/mypage/sim/')}
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

export default connect(mapStateToProps)(Sim_Options_Confirm)
