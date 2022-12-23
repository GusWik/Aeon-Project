// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'
import Dialog from '../../../../modules/Dialog.js'

// IMPORT IMAGES
import PaymentPic01 from '../../../assets/images/payment_pic_01.png'
import PaymentPic02 from '../../../assets/images/payment_pic_02.png'

class Payment_Change extends ComponentBase {
  constructor(props) {
    super(props)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.errApplyNumber = this.errApplyNumber.bind(this)

    this.state = {
      lineKeyObject:
        props.history.location.state !== undefined
          ? props.history.location.state.lineKeyObject
          : '',
      lineDiv:
        props.history.location.state !== undefined
          ? props.history.location.state.lineDiv
          : '',
      lineNo:
        props.history.location.state !== undefined
          ? props.history.location.state.lineNo
          : '',
      startDate:
        props.history.location.state !== undefined
          ? props.history.location.state.date
          : '',
      mailAddress:
        props.history.location.state !== undefined
          ? props.history.location.state.mailAddress
          : '',
      MNPRequestDate: '',
      token: '',
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
      paymentChangeDisabled: {},
      contractStatus: '',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_PAYMENT_CHANGE
    this.getPaymentChangeDisabled()
    this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
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

  goNextDisplay(e, url, params) {
    e.preventDefault()
    this.props.history.push({
      pathname: url,
      state: params,
    })
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
  // ACSページへ遷移
  async transitToACS(e) {
    e.preventDefault()
    // 月末メンテナンス判定
    let now = moment()
    let start = moment(
      `${now.year()}/${now.month() + 1}/26 23:30:00`,
      'YYYY/MM/DD HH:mm:ss'
    )
    let end = moment(
      `${now.year()}/${now.month() + 1}/27 09:30:00`,
      'YYYY/MM/DD HH:mm:ss'
    )
    if (now.isSameOrAfter(start) && now.isSameOrBefore(end)) {
      // メンテナンス中表示
      $('.t-modal').addClass('is-active')
      $('.t-modal_content').addClass('is-active')
      let vh = $(window).height()
      let ch = $('#modal_mail').height()
      if (vh && !ch) ch = 300
      let top = (vh - ch) / 2
      $('.t-modal_content').css('top', top).css('position', 'fixed')
      return
    }
    let domain = window.location.origin
    let url = Const.CHCREDIT_API
    let shopId = Const.CHCREDIT_SHOPID
    // [申込番号]MMDDHHII
    const applyNumber = await this.issueApplyNumber()
    if (!applyNumber) {
      return
    }
    const orderId = applyNumber + moment().format('MMDDHHmm').toString()
    // クレジット決済
    var params = {
      proc_id: '07', // 固定
      auth_type: '04', // 固定
      shop_id: shopId,
      order_id: orderId,
      email: 'mail@aeon.aeon', // ダミーアドレス(固定)
      success_url: `${domain}/pg/acsChange/success?applyNumber=${applyNumber}`,
      failure_url: `${domain}/mypage/payment/change/cancel`,
      cancel_url: `${domain}/mypage/payment/change/cancel`,
      teikei_flg: '1',
      convert_flg: '0',
    }
    // formでPOSTリクエスト
    let form = document.createElement('form')
    form.action = url
    form.method = 'POST'
    for (const [key, value] of Object.entries(params)) {
      let q = document.createElement('input')
      q.type = 'hidden'
      q.name = key
      q.value = value
      form.appendChild(q)
    }
    document.body.appendChild(form)
    form.submit()
  }
  // 申込番号発行
  async issueApplyNumber() {
    // applyType 1: 契約 / 3: 変更 / 4: 修正 / 9: その他
    // receptionType 1:接客 / 2:簡易 / 3:EC / 4:タブレット /5:新ARS / 7:新店頭  / 9:無料貸し出し
    let body = {
      applyType: 3,
      receptionType: 5,
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
    $('.t-wrapper').hide()
    $('.loading').show()
    return fetch(Const.ARS_CREATE_APPLY_NUMBER, params)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        console.log(json)
        try {
          if (json && json.data.applyNumber) {
            return json.data.applyNumber
          }
          $('.t-wrapper').show()
          $('.loading').hide()
          this.errApplyNumber()
          return null
        } catch (error) {
          this.errApplyNumber()
          return null
        }
      })
      .catch((err) => {
        $('.t-wrapper').show()
        $('.loading').hide()
        console.log('ConnectError :', err)
        this.errApplyNumber()
        return null
      })
  }

  errApplyNumber() {
    console.log('errApplyNumber')
    var dialogs_copy = [...this.state.dialogs_error]
    var values = []
    dialogs_copy[0].title = 'ご確認ください'
    values[0] = { text: '現在申込処理中の情報変更があります。' }
    dialogs_copy[0].values = values
    dialogs_copy[0].state = true
    this.setState({ dialogs_error: dialogs_copy })
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

  handleConnect(type) {
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        params = {
          customerId: window.customerId,
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
      if (type === Const.CONNECT_TYPE_CONTRACT_LIST) {
        // 契約ステータス(contractStatus)
        let contract = data.data.contractList.filter(
          (item) => item.customerId == window.customerId
        )[0]
        this.setState({
          contractStatus: contract.contractStatus,
        })
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

  render() {
    let opacity =
      this.state.paymentChangeDisabled.status ||
      this.props.paymentError.unchangeableCreditCard == '1'
        ? '0.5'
        : '1.0'
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog2_' + i} />
          } else {
            return <React.Fragment key={'dialog2_fr_' + i} />
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
                      {Const.TITLE_MYPAGE_PAYMENT_CHANGE}
                    </li>
                  </ol>
                  <h1 className="a-h1">{Const.TITLE_MYPAGE_PAYMENT_CHANGE}</h1>
                  <div className="m-form">
                    <p className="a-fw-bold a-mb-30">
                      ご利用料金は、翌月14日ごろにご登録のクレジットカードへ請求いたします。
                      <br />
                      クレジットカードを変更されるお客さまは、下記の注意事項をご確認のうえ
                      <span className="a-primary">
                        「クレジットカードを変更する」
                      </span>
                      から新しいカードを登録してください。
                    </p>
                    <div className="a-mb-30">
                      <h3 className="m-title_h3_am">
                        <span>クレジットカードを変更されるお客さまへ</span>
                      </h3>
                      <ul>
                        <li>
                          <p>
                            <b className="a-primary">
                              毎月10日20時までに変更された場合、当月（前月のご利用分）から新しいクレジットカードに請求
                            </b>
                            （図
                            <span className="a-circle-item">1</span>
                            ）いたします。
                          </p>
                          <p>
                            <img
                              src={PaymentPic01}
                              style={{
                                width: '100%',
                                maxWidth: '380px',
                                backfaceVisibility: 'hidden',
                              }}
                              alt=""
                            />
                          </p>
                        </li>
                        <li>
                          <p>
                            <b className="a-primary">
                              毎月10日20時以降、20日までに変更された場合、当月（前月のご利用分）は以前のクレジットカードに請求
                            </b>
                            （図<span className="a-circle-item">2</span>）し、
                            <b className="a-secondary">
                              翌月（当月のご利用分）から新しいクレジットカードに請求
                            </b>
                            （図<span className="a-circle-item">3</span>
                            ）いたします。
                          </p>
                          <p>
                            <img
                              src={PaymentPic02}
                              style={{
                                width: '100%',
                                maxWidth: '380px',
                                backfaceVisibility: 'hidden',
                              }}
                              alt=""
                            />
                          </p>
                        </li>
                        <li>
                          <p className="a-mb-0">
                            以前のクレジットカードへの請求（図
                            <span className="a-circle-item">2</span>
                            ）が正常に完了しなかった場合に限り、当月21日に新しいカードに再度の請求（図
                            <span className="a-circle-item">4</span>
                            ）を行います。
                          </p>
                          <p className="m-annotation a-mb-0">
                            以前のクレジットカードへの請求が正常に完了した場合、21日の請求は発生しません。
                          </p>
                          <p className="m-annotation">
                            21日時点の再度の請求でも正常に決済が完了しなかった場合は、前月のご利用分について未払いの状態となります。
                          </p>
                        </li>
                        <li>
                          <p>
                            ご利用料金は、ご契約ごとにまとめて請求いたします。シェア音声プランの場合、シェアグループのすべてのSIMカードの料金をまとめて請求いたします。
                          </p>
                        </li>
                        <li>
                          <p>
                            通話料やSMS送信料は、ご利用の翌々月に請求いたします。国際ローミングのご利用など、一部の料金はさらに遅れて請求される場合があります。
                          </p>
                        </li>
                        <li>
                          <p>
                            お客さまの銀行口座からのお引き落とし日は、クレジットカード会社により異なります。
                          </p>
                        </li>
                        <li>
                          <p>
                            端末を24回分割払いで購入された場合、お買い上げの際に利用されたクレジットカードに対し、ご利用料金とは別に請求が発生します。
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="a-ta-center a-mb-30">
                      <p className="a-fw-bold">
                        以上をご確認のうえ
                        <span className="a-primary">
                          「クレジットカードを変更する」
                        </span>
                        から新しいカードを登録してください。
                      </p>
                      <p className="m-btn">
                        <button
                          className="a-btn-submit"
                          style={{
                            fontSize: '2rem',
                            padding: '17px',
                            width: '400px',
                            opacity,
                          }}
                          type="button"
                          onClick={(e) => {
                            if (
                              this.state.paymentChangeDisabled.status ||
                              this.props.paymentError.unchangeableCreditCard ==
                                '1'
                            ) {
                              e.preventDefault()
                              return
                            }
                            this.transitToACS(e)
                          }}
                        >
                          クレジットカードを変更する
                        </button>
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
                          return <p>{ReactHtmlParser(text)}</p>
                        } else {
                          return (
                            <p className="a-primary a-fs-sm">
                              イオンクレジットサービス株式会社の会員課金登録画面に移動します。
                            </p>
                          )
                        }
                      })()}
                    </div>
                    <div className="a-mb-30">
                      <h3 className="m-title_h3_am">
                        <span>ご利用料金に未払いがあるお客さまへ</span>
                      </h3>
                      <ul>
                        <li>
                          <p className="a-primary a-fw-bold a-mb-0">
                            新しいクレジットカードを登録された翌日に、未払いのご利用料金の全部または一部を請求いたします。
                          </p>
                          <p className="m-annotation a-mb-0">
                            ただし、毎月9日～20日にカードを変更された場合は、翌日の請求は発生せず、当月21日に未払いのご利用料金の全部または一部を請求します。
                          </p>
                          <p className="m-annotation a-mb-0">
                            クレジットカードのご利用状況により、未払いのご利用料金のすべての決済が完了しない場合があり、その場合は未払いの状態が続きます。
                          </p>
                          <p className="m-annotation">
                            翌月14日ごろの通常の請求時点で未払いのご利用料金が残っていた場合、未払いのご利用料金をすべて合算して請求いたします。
                          </p>
                        </li>
                        <li>
                          <p>
                            <b className="a-primary">
                              ご利用料金の未払いが継続的に発生した場合、通信サービスのご利用を一時的に停止または終了させていただく場合があります。
                            </b>
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="a-ta-center">
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          onClick={(e) => {
                            e.preventDefault()
                            this.props.history.goBack()
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
          </div>
        </div>
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

export default connect(mapStateToProps)(Payment_Change)
