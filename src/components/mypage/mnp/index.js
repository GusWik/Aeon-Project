import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import '../../assets/css/common.css'

// IMPORT DIALOG
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

// 各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'

import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'
import * as Const from '../../../Const.js'

class Mnp extends ComponentBase {
  constructor(props) {
    super(props)

    console.log(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.callbackDialogConfirm = this.callbackDialogConfirm.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

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
      isStop:
        props.history.location.state !== undefined
          ? props.history.location.state.stopFlg == 1
          : false,
      mnpMovingInFlag:
        props.history.location.state !== undefined
          ? props.history.location.state.mnpMovingInFlag
          : '0',
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
      commissionMst: [],
      id: '',
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
              value: 'トップページへ',
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
              value: 'MNP予約番号発行を申込む',
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
        {
          id: 1,
          type: Const.DIALOG_TWO,
          title: 'お申し込みできませんでした。',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],

          button: [
            {
              id: 'dialog_button_cancel_mnpng',
              value: '閉じる',
              classname: 'a-btn-dismiss a-btn-icon-none',
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
      breakDate: ['', ''],
      btnDisabled: true,
      retry: false,
    }
  }

  handleConnect(type) {
    // FIXING INPUT PARAMETERS
    var params = {}
    if (type === Const.CONNECT_TYPE_REQUESTMNP) {
      params = {
        lineKeyObject: this.state.lineKeyObject,
        lineDiv: this.state.lineDiv,
        lineNo: this.state.lineNo,
      }
    } else if (type === Const.CONNECT_TYPE_MNPPORTOUT) {
      const sendType = this.state.mailAddress
        ? $("input[name='sendType']:checked").val()
        : '1'

      params = {
        customerId: window.customerId,
        lineKeyObject: this.state.lineKeyObject,
        lineDiv: this.state.lineDiv,
        lineNo: this.state.lineNo,
        sendType: sendType, //'1:SMS通知 2:メール通知 (default:1)
        token: this.state.token,
      }

      if (this.state.retry) {
        params.convertFlg = '1'
      }
    } else if (type === Const.CONNECT_TYPE_ISSUEORDERID) {
      // yyyy-mm-dd hh:mm:ss
      var nowDate = new Date()
      var year = nowDate.getFullYear()
      var month =
        nowDate.getMonth() + 1 > 9
          ? nowDate.getMonth() + 1
          : '0' + (nowDate.getMonth() + 1)
      var date =
        nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate()
      var hours =
        nowDate.getHours() > 9 ? nowDate.getHours() : '0' + nowDate.getHours()
      var minutes =
        nowDate.getMinutes() > 9
          ? nowDate.getMinutes()
          : '0' + nowDate.getMinutes()
      var seconds =
        nowDate.getSeconds() > 9
          ? nowDate.getSeconds()
          : '0' + nowDate.getSeconds()

      var dateStr =
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      params = {
        customerId: window.customerId,
        lineKeyObject: this.state.lineKeyObject,
        lineDiv: this.state.lineDiv,
        lineNo: this.state.lineNo,
        jobType: '20',
        MNPRequestDate: dateStr,
        token: this.state.token,
      }
    } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
      params = {
        lineKeyObject: this.state.lineKeyObject,
        lineDiv: this.state.lineDiv,
        lineNo: this.state.lineNo,
        tokenFlg: '1',
      }
    }
    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      var _params = data.data
      if (type === Const.CONNECT_TYPE_REQUESTMNP) {
        this.setState({ MNPRequestDate: _params.MNPRequestDate })
        this.setState({ token: _params.token })
        // 一時処理のためコメントアウト
        // this.handleConnect(Const.CONNECT_TYPE_ISSUEORDERID);
        this.handleConnect(Const.CONNECT_TYPE_MNPPORTOUT)
      } else if (type === Const.CONNECT_TYPE_MNPPORTOUT) {
        if (_params.result === 'NG' && _params.convertError === '1') {
          // 変換の確認ダイアログを表示
          var dialogs_copy = [...this.state.dialogs_confirm]
          var values = [
            {
              text: (
                <div style={{ textAlign: 'left' }}>
                  <p>
                    ※MNP転出のため、ご登録のお名前が以下の内容で自動変換されます。あらかじめご了承ください。
                    <br />
                    ※MNP転入先でご登録の際は、以下の内容でご登録をお願いいたします。
                  </p>
                  <p>
                    <table>
                      <tbody>
                        <tr>
                          <th
                            style={{ textAlign: 'right', paddingRight: '8px' }}
                          >
                            氏名:
                          </th>
                          <td>
                            {_params.sei} {_params.mei}
                          </td>
                        </tr>
                        <tr>
                          <th
                            style={{ textAlign: 'right', paddingRight: '8px' }}
                          >
                            フリガナ:
                          </th>
                          <td>
                            {_params.sei_kana} {_params.mei_kana}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </p>
                </div>
              ),
            },
          ]
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            retry: true,
          })
        } else if (_params.result === 'NG') {
          // 変換の確認ダイアログを表示
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[1].state = true
          this.setState({
            dialogs_confirm: dialogs_copy,
            retry: true,
          })
        } else {
          // 完了画面へ遷移
          this.setState({ retry: false })
          this.props.history.push({ pathname: '/mypage/mnp/success' })
        }
      } else if (type === Const.CONNECT_TYPE_ISSUEORDERID) {
        // ローディング表示をセット
        $('.loading').show()
        this.setState({ orderId: _params.orderId })
        var start_date = new Date(this.state.startDate)
        start_date.setDate(start_date.getDate() + 90)

        var commision = _params.mnpTransferFee

        let domain = window.location.origin
        let url = Const.CHCREDIT_API
        let shopId = Const.CHCREDIT_SHOPID

        // クレジット決済
        var params = {
          proc_id: '01', // 固定
          auth_type: '01', // 固定
          dspmode: '01', // 省略可能かも
          shop_id: shopId,
          order_id: _params.orderId,
          total_amount: commision,
          price_amount: '0', // 固定
          tax_amount: '0', // 固定
          shipping_amount: '0', // 固定
          pay_amount: commision,
          point: '0', // 固定
          email: 'test@aeon.co.jp', // ダミーアドレス(固定)
          // owners_flg:"0",
          success_url: domain + '/mypage/mnp/success',
          failure_url: domain + '/mypage/mnp/fail',
          cancel_url: domain + '/mypage/mnp/cancel',
          card_type: '00',
        }

        // パラメーター
        params = `?proc_id=${params.proc_id}&auth_type=${params.auth_type}&dspmode=${params.dspmode}&shop_id=${params.shop_id}&order_id=${params.order_id}&total_amount=${params.total_amount}&price_amount=${params.price_amount}&tax_amount=${params.tax_amount}&shipping_amount=${params.shipping_amount}&pay_amount=${params.pay_amount}&point=${params.point}&email=${params.email}&success_url=${params.success_url}&failure_url=${params.failure_url}&cancel_url=${params.cancel_url}&card_type=${params.card_type}`

        // URLリクエスト
        window.location.href = url + params
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        this.setState({
          startDate: data.data.startDate,
          isStop: data.data.stopFlg == 1,
        })
        this.id_fixing()
      }
    }
    // IF ERROR IN CONNECTION
    else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (data.token) this.setState({ token: data.token })
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = 'お申し込み失敗'
        var values = []
        values[0] = { text: 'MNP転出のお申し込みに失敗しました。' }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'validation_errors') {
        this.props.history.push('/error?e=1')
      }
    }
  }

  dataFixingHandler(type, index) {
    if (this.state.commissionMst.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'name':
          TempReturn = this.state.commissionMst[index].name
          break
        case 'commission':
          TempReturn = this.state.commissionMst[index].commission
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  checkBox() {
    if ($('#agreement').is(':checked')) {
      this.setState({ btnDisabled: false })
    } else {
      this.setState({ btnDisabled: true })
    }
  }

  id_fixing() {
    var start_date = this.state.startDate
      ? new Date(this.state.startDate)
      : new Date()
    var start_dateAfter = this.state.startDate
      ? new Date(this.state.startDate)
      : new Date()
    start_date.setDate(start_date.getDate() + 90)
    start_dateAfter.setDate(start_dateAfter.getDate() + 91)
    let month = start_date.getMonth() + 1
    let monthAfter = start_dateAfter.getMonth() + 1
    let day = start_date.getDate()
    let dayAfter = start_dateAfter.getDate()
    if (month.length < 2) month = '0' + month
    if (monthAfter.length < 2) monthAfter = '0' + monthAfter
    if (day.length < 2) day = '0' + day
    if (dayAfter.length < 2) dayAfter = '0' + dayAfter
    this.setState({
      breakDate: [
        start_date.getFullYear() + '年' + month + '月' + day + '日',
        start_dateAfter.getFullYear() +
          '年' +
          monthAfter +
          '月' +
          dayAfter +
          '日',
      ],
    })
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_MNP
    if (this.state.startDate) {
      this.id_fixing()
    } else {
      this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    }

    var self = this
    $('.a-btn-submit').click(function () {
      self.handleConnect(Const.CONNECT_TYPE_REQUESTMNP)
    })

    console.log('mailAddress', this.state.mailAddress)

    //初期値はSMS
    $('#sendType1').prop('checked', true)
  }

  callbackDialogConfirm(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[0].state = false
          this.setState({
            dialogs_confirm: dialogs_copy,
            retry: false,
          })
          break
        }
        case 'dialog_button_cancel_mnpng': {
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[1].state = false
          this.setState({
            dialogs_confirm: dialogs_copy,
            retry: false,
          })
          break
        }
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_confirm]
          dialogs_copy[0].state = false
          this.setState({ dialogs_confirm: dialogs_copy })
          // MNP転出実行
          this.handleConnect(Const.CONNECT_TYPE_MNPPORTOUT)
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

  goNextDisplay(e, url, params) {
    e.preventDefault()

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break

      case '/mypage/mnp/detail':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
    }
  }

  render() {
    var start_date = this.state.startDate
      ? new Date(this.state.startDate)
      : new Date()
    start_date.setDate(start_date.getDate() + 90)

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
                    <li className="m-breadcrumb_item">MNP転出のお申し込み</li>
                  </ol>
                  <h1 className="a-h1">MNP転出のお申し込み</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            MNP予約番号発行のお申込み
                            <br />
                            （電話番号：{this.state.lineNo}）
                          </h2>
                        </div>
                      </div>
                    </div>
                    <table className="a-table-between">
                      <tbody>
                        <tr>
                          <th>MNP転出手数料</th>
                          <td className="a-fw-bold">無料</td>
                        </tr>
                      </tbody>
                    </table>
                    <hr className="a-hr a-hr-full" />
                    <p className="a-fw-bold">
                      MNP（携帯電話番号ポータビリティ）転出のためのMNP予約番号発行のお申込みを行います。
                    </p>
                    <div className="m-box-important">
                      <h4 className="m-box-important_label">
                        お申込みにあたっての注意事項
                      </h4>
                      <p style={{ fontWeight: 'bold', marginTop: '1em' }}>
                        ■MNP転出をご希望のお客さまへ
                      </p>
                      <ol
                        className="list-circled-number step"
                        style={{ marginBottom: '1em' }}
                      >
                        <li>
                          &#9312;
                          MNP予約番号は、当日8時00分までの申請で、同日23時00分に発行され、当該日（発行日）を含む15日間が有効期限です。
                          <br />
                          ・当日8時00分以降の申請は、翌日23時00分に発行されます。
                          <br />
                          ・NTTドコモまたはauのシステムメンテナンスなどにより発行が遅れる場合があります。
                          <br />
                          ・MNPの手続きが混雑した場合、発行が2～3日後にずれ込むことがあります。
                        </li>
                        <li>
                          &#9313;
                          発行されたMNP予約番号の確認は、マイページの「MNP予約番号発行申込み」欄に記載されますので、お客さまご自身でご確認下さい。また、予約番号発行後に、ご登録いただいたメールアドレスもしくはご契約の電話番号宛にSMSで送信させていただきます。
                        </li>
                        <li>
                          &#9314; お申し込み後のキャンセルはできません。
                          <br />
                          MNP予約番号が発行された場合でも、15日以内にMNP転出されなかった場合、MNP予約番号は自動的に無効となります。
                        </li>
                        <li>
                          &#9315;
                          MNP予約番号の発行申請後は、MNP予約番号の有効期限翌日まで、以下がお手続きいただけませんのでご注意下さい。
                          <ol style={{ paddingLeft: '0' }}>
                            <li style={{ marginBottom: '0' }}>
                              1. プラン変更手続き
                            </li>
                            <li style={{ marginBottom: '0' }}>
                              2. 情報変更手続き
                            </li>
                            <li style={{ marginBottom: '0' }}>3. 解約手続き</li>
                            <li style={{ marginBottom: '0' }}>
                              4. MNP予約番号の再発行
                            </li>
                            <li style={{ marginBottom: '0' }}>
                              5.
                              かけ放題サービスの変更手続き（例：5分かけ放題からフルかけ放題への変更）
                            </li>
                            <li style={{ marginBottom: '0' }}>
                              6. SIMカードの再発行・サイズ変更
                            </li>
                          </ol>
                        </li>
                        <li>
                          &#9316;
                          かけ放題サービスの変更手続きを申請されている状態で、MNP転出予約を申請された場合、かけ放題サービスの翌月変更手続きが無効となります。MNP転出されない場合でも、翌月のかけ放題サービスの変更は適用されず、翌々月からの適用となりますので、ご注意下さい。
                        </li>
                        <li>
                          &#9317;
                          番号ポータビリティ（MNP）は原則、移転元事業者のご契約名義のまま移転先事業者へ加入する制度です。
                          <br />
                          移転先事業者での新規加入手続きの際は、イオンモバイルの契約名義での手続きをお願いします。
                          <br />
                          ただし移転先事業者によってはイオンモバイルでのご契約者のご家族名義による新規加入手続きに対応している場合があります。詳細は移転先事業者にお問い合わせください。
                          <br />
                          MNP転出手続きについて、MNP予約番号は、申請時のお客さま情報にて発行されます。
                          <br />
                          その為、MNP予約番号申請後に、名義変更によりお客さま情報が変更された場合であっても、MNP予約番号に紐づいたお客さま情報は変更されません。
                          <br />
                          MNP転出され、解約となった情報の反映は、転出した日から1週間程度となります。
                        </li>
                      </ol>
                      <p style={{ fontWeight: 'bold' }}>
                        ■シェア音声プランをご契約のお客さまへ
                      </p>
                      <ol className="list-circled-number step">
                        <li>
                          &#9312;
                          シェア音声プランご契約で複数のSIMカードをご利用のお客さまにつきましては、申込みいただいた電話番号をMNP転出された場合でも、他の回線が残っているため、シェア音声プランは継続されます。そのため、自動的には、シェア音声プランは解約されません。
                        </li>
                        <li>
                          &#9313;
                          シェア音声プラン自体の解約をご希望の場合は、お手数をおかけしますが、MNP転出後に、お客さまご自身で解約手続きを行っていただきますようお願いします。解約手続きは、イオンモバイルお客さまセンターもしくは店頭にてお申込みいただけます。
                        </li>
                        <li>
                          &#9314;
                          （音声単独プランへ変更をご検討、ご希望されるお客さまへ）MNP転出日やその他シェア内の解約回線の関係上、プラン変更が翌々月になる場合がございます。
                        </li>
                      </ol>
                    </div>
                    <div className="m-form_section">
                      <div
                        className="m-field"
                        style={{
                          display: this.state.isStop ? 'none' : 'block',
                        }}
                      >
                        <div className="m-field_control-check">
                          <label htmlFor="agreement">
                            <input
                              className="a-input-checkbox"
                              type="checkbox"
                              id="agreement"
                              data-agreement-target="submit"
                              onClick={(e) => this.checkBox()}
                            />
                            <span className="a-weak">
                              MNP注意事項について同意します
                            </span>
                          </label>
                        </div>
                        <hr className="a-hr a-hr-full" />
                        <h2 className="a-h2">
                          MNP予約番号発行完了通知の受け取り方法
                        </h2>
                        <p>
                          MNP予約番号発行完了通知の受け取り方法を「SMSで通知」または「メールで通知」から選ぶことができます。
                          <br />
                          <small>
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
                        </p>
                        <div className="m-form_section">
                          <div className="m-field">
                            <div className="m-field_control-check">
                              <label
                                htmlFor="sendType1"
                                style={{ cursor: 'default' }}
                              >
                                <input
                                  className="a-input-radio"
                                  type="radio"
                                  name="sendType"
                                  value="1"
                                  id="sendType1"
                                />
                                <span>SMSで通知</span>
                              </label>
                            </div>
                            <div className="m-field_control-check">
                              <label
                                htmlFor="sendType2"
                                style={{ cursor: 'default' }}
                              >
                                <input
                                  className="a-input-radio"
                                  type="radio"
                                  name="sendType"
                                  value="2"
                                  id="sendType2"
                                  disabled={
                                    !this.state.mailAddress ||
                                    this.state.mailAddress == ''
                                  }
                                />
                                <span>メールで通知</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p
                          className="m-btn"
                          style={{
                            display: this.state.isStop ? 'none' : 'block',
                          }}
                        >
                          <button
                            className="a-btn-submit"
                            type="button"
                            disabled={this.state.btnDisabled}
                            id="submit"
                          >
                            MNP予約番号発行を申込む
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

export default connect(mapStateToProps)(Mnp)
