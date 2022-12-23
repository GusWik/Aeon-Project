import React from 'react'
import { connect } from 'react-redux'

import '../../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import {
  getToken,
  getApplyNumber,
  getAgreementData,
} from '../../../../actions/ArsActions'

// import dialogs
import Header from '../../../../modules/Header.js'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Sim_Confirm extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    //this.callbackDialog = this.callbackDialog.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeAccept = this.handleChangeAccept.bind(this)
    this.submitNotification = this.submitNotification.bind(this)

    this.state = {
      is_accept: false,
      sim_number: '0',
      simSize:
        props.history.location.state !== undefined
          ? props.history.location.state.simSize
          : '0',
      applyNumber: '',
      notice_status: '1',
      notification: {
        status: '',
        token: '',
      },
      token: '',
      receptModal: false,
      mailAddress: '',
      iccid:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.iccid
          : '',
      simType:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simType
          : '',
      simKind:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simKind
          : '',
      lineInfo: [
        {
          lineDiv:
            props.history.location.state !== undefined
              ? props.history.location.state.lineDiv
              : '',
          lineNo:
            props.history.location.state !== undefined
              ? props.history.location.state.lineNo
              : '',
          lineKeyObject:
            props.history.location.state !== undefined
              ? props.history.location.state.lineKeyObject
              : '',
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
      customerInfo: {},
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    // プログレス表示
    this.setState({ loading_state: true })
    switch (type) {
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')

          params = {
            customerInfoGetFlg: '1',
            tokenFlg: '1',
            simGetFlg: '1',
            token: '1',
            sessionNoUseFlg: '',
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

      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }

    // 通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // console.log("json_data");
    // console.log(data);
    if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      const customerInfo = data.data.customerInfo
      const mailAddress = data.data.mailAddress
      const notice_status = mailAddress.length > 0 ? '2' : '1'
      this.setState({ customerInfo, notice_status, mailAddress })
    } else if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
      this.setState({ notification: data.data })
      //this.setState({ notice_status: data.data.status })
      //
    } else if (type == Const.CONNECT_TYPE_INSERT_NOTIFICATION) {
      //
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SIM_REISSUE
    console.log(this.state.lineInfo[0])
    this.setState({ sim_number: this.state.lineInfo[0].lineDiv })
    this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
    this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA)
    //this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
    //this.handleConnect(Const.CONNECT_TYPE_SIM_STATUS)
    //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
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
    } else if (url === '/mypage/sim/reissue/comfirm/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = window.customerId
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/sim/') {
      // NEED TO SEND THE CUSTOMER ID
      const params = this.state.lineInfo[0]
      params.customer_id = window.customerId
      params.mailAddress = this.state.mailAddress
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  handleChangeAccept(e) {
    const value = !this.state.is_accept
    this.setState({ is_accept: value })
  }

  updateApplyInfo(token) {
    // API
    // 遷移時に取得したapplyNumberをセットする

    const body = {
      applyNumber: this.state.applyNumber,
      commitFlag: 1,
      receptionKbn: 4,
      receptionistKbn: 2,
      customerId: window.customerId,
      simList: [
        {
          iccid: this.state.iccid,
          simType: this.state.simType,
          simKind: this.state.simKind,
          simSize: this.state.simSize,
        },
      ],
      customerInfoType: '801',
      receptionStoreCode: '',
      receptionistCode: '',
      receptionistName: '',
      agencyCode: '',
      incentiveCode: '',
      joinRoute: '',
      token,
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

  submitNotification() {
    if (this.state.notice_status !== this.state.notification.status) {
      this.handleConnect(Const.CONNECT_TYPE_INSERT_NOTIFICATION)
      console.log('更新')
    }
    this.goNextDisplay(null, '/mypage/sim/')
  }

  async handleSubmit() {
    const applyNumber = await getApplyNumber()
    if (applyNumber) {
      const token = await getToken(applyNumber)
      this.setState({ applyNumber })
      //更新
      await this.updateApplyInfo(token)

      if (this.state.notification.status === '1') {
        this.setState({ receptModal: true })
      } else {
        this.goNextDisplay(null, '/mypage/sim/')
      }
    }
  }

  handleChangeNotification(e, notice_status) {
    this.setState({ notice_status })
  }

  simName() {
    let name = ''
    switch (this.state.simSize) {
      case '01':
        name = '標準SIM'
        break
      case '02':
        name = 'microSIM'
        break
      case '03':
        name = 'nanoSIM'
        break
      case '04':
        name = 'マルチSIM'
        break
      default:
        break
    }
    return name
  }

  render() {
    // CHECKING SIM STATE AND CHANGING
    // 0 : STOP  -  1: USE

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
                      {' '}
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">
                      SIMカード再発行・サイズ変更
                    </li>
                  </ol>
                  <h1 className="a-h1">SIMカード再発行・サイズ変更</h1>
                  <div className="m-form">
                    <p>申し込み内容をご確認ください。</p>
                    <div>
                      <table
                        style={{
                          width: '100%',
                          border: '1px solid #afafaf',
                          borderRadius: '4px',
                        }}
                      >
                        <tr
                          style={{
                            borderBottom: '1px solid #afafaf',
                          }}
                        >
                          <th style={{ padding: '4px' }}>ご希望のSIMサイズ</th>
                          <td style={{ padding: '4px' }}>{this.simName()}</td>
                        </tr>
                        <tr>
                          <th style={{ padding: '4px' }}>配送先住所</th>
                          <td style={{ padding: '4px' }}>
                            〒{this.state.customerInfo.postCode}
                            <br />
                            {this.state.customerInfo.address}
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div>
                      <label className="input_checkbox">
                        <input
                          type="checkbox"
                          checked={this.state.is_accept}
                          onChange={this.handleChangeAccept}
                        />
                        <span className="input_checkbox_label">
                          SIMサイズ、配送先住所に間違いありません。
                        </span>
                      </label>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p
                          className="m-btn"
                          style={{
                            display: this.state.isStop ? 'none' : 'flex',
                          }}
                        >
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={() => {
                              this.handleSubmit()
                            }}
                            disabled={!this.state.is_accept}
                          >
                            申し込む
                          </button>
                        </p>
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

export default connect(mapStateToProps)(Sim_Confirm)
