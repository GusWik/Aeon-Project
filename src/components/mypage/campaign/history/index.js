import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

// IMPORT IMAGES
import imageWaonHelpPC01 from '../../../assets/images/waon_help_pc_01.png'
import imageWaonHelpPC02 from '../../../assets/images/waon_help_pc_02.png'
import imageWaonHelpSP01 from '../../../assets/images/waon_help_sp_01.png'
import imageWaonHelpSP02 from '../../../assets/images/waon_help_sp_02.png'

// 通信用のモジュールを読み込み
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'

// css
import '../../../assets/css/common.css'

class CampaignHistory extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
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
      api_data: [],
      table_date: [],
      state_lock: true,
      month: '',

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
      campaignList: [],
      waonDownloadNoticeModal: false,
      waonHelpModal: false,
      waonAddPointHistoryList: [],
      activeTabNumber:
        props.history.location.state !== undefined
          ? Number(props.history.location.state.type) - 1
          : 1,
      selectedType:
        props.history.location.state !== undefined
          ? props.history.location.state.type
          : '2',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_CAMPAIGN_HISTORY
    // Set m_tab btn active
    $('.m-tab_nav_btn').click(function () {
      if ($(this).hasClass('is-active') === false) {
        $('.m-tab_nav_btn').removeClass('is-active')
        $(this).addClass('is-active')
      }
    })
    $('.t-header_menu_btn').click(function () {
      $('.t-wrapper').addClass('is-drawer-open')
    })
    $('.t-header_drawer_close_btn').click(function () {
      $('.t-wrapper').removeClass('is-drawer-open')
    })
    this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    this.setState({ loading_state: true })
    // 一覧取得API
    if (type === Const.CONNECT_TYPE_CAMPAIGN) {
      // キャンペーンマスタ取得API
      params = {
        // WAON付与
        campaignType: '2',
      }
    } else if (type === Const.CONNECT_TYPE_WAON) {
      // WAONポイント付与情報取得API
      if (window.customerId) {
        // 1:未受取 / 2:受取処理中 / 3:受取済み / 4:受取エラー
        params = {
          customerId: window.customerId,
          displayStatusList: ['2', '3'],
        }
      } else {
        // customerId再取得
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(Const.CONNECT_TYPE_MYPAGEID))
        return
      }
    }
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_MYPAGEID: {
          window.customerId = data.data.customerId
          this.setState({ customerId: data.data.customerId })
          this.handleConnect(Const.CONNECT_TYPE_CAMPAIGN)
          break
        }
        case Const.CONNECT_TYPE_CAMPAIGN: {
          // キャンペーンマスタ取得API
          let campaignList = data.data.campaignList
          this.setState({ campaignList })
          this.handleConnect(Const.CONNECT_TYPE_WAON)
          break
        }
        case Const.CONNECT_TYPE_WAON: {
          let waonAddPointHistoryList = data.data.waonAddPointHistoryList
          waonAddPointHistoryList = waonAddPointHistoryList.map((item) => {
            if (
              item.waonExchangeRequestDate &&
              item.displayStatus &&
              item.displayStatus.status === '3'
            ) {
              let expireDate = this.returnDownloadExpireDate(
                item.waonExchangeRequestDate
              )
              item.expireDate = expireDate
            }
            return item
          })
          this.setState({ waonAddPointHistoryList })
          break
        }
        default: {
          break
        }
      }
    } else if (status === Const.CONNECT_ERROR) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        // ログイン画面へリダイレクト
        this.props.history.push('/login/')
        return
      }
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data.response.response.error_detail.error_message }
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
      }
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/login/')
          break
      }
    }
  }

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    switch (url) {
      case '/mypage/campaign/':
        //selectedType
        var _params = this.state.url_data[0].pass_data
        if (this.state.selectedType && this.state.selectedType != '') {
          _params['type'] = this.state.selectedType
        }

        this.props.history.push({
          pathname: url,
          state: _params,
        })
        break
      case '/':
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
  returnDownloadExpireDate(date) {
    // 登録申請完了日4月1日～9月30日の場合、ダウンロード期間、翌年3月31日まで
    // 登録申請完了日10月1日～翌年3月31日の場合、ダウンロード期間、翌年9月30日まで
    let downloadExpireDate
    date = moment(date)
    let year = date.year()
    let date0101 = moment([year, 1, 1])
    let date0331 = moment([year, 2, 31, 23, 59, 59])
    let date0401 = moment([year, 3, 1])
    let date0930 = moment([year, 8, 30, 23, 59, 59])
    if (date.isSameOrAfter(date0401) && date.isSameOrBefore(date0930)) {
      // 翌年3月31日まで
      downloadExpireDate = moment([year + 1, 2, 31])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    } else if (date.isSameOrAfter(date0101) && date.isSameOrBefore(date0331)) {
      // 当年9月30日まで
      downloadExpireDate = moment([year, 8, 30])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    } else {
      // 翌年9月30日まで
      downloadExpireDate = moment([year + 1, 8, 30])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    }
    return downloadExpireDate
  }

  renderWaonAddPointHistoryList() {
    let _List = this.state.waonAddPointHistoryList
    if (this.state.selectedType) {
      _List = _List.filter(
        (item) => item.campaignType === this.state.selectedType.toString()
      )
    }
    let list = _List.map((item, index) => {
      let waonExchangeStartDate = moment(item.waonExchangeStartDate).format(
        'YYYY年M月D日'
      )
      let waonExchangeEndDate = moment(item.waonExchangeEndDate).format(
        'YYYY年M月D日'
      )
      let status = ''
      if (item.displayStatus && item.displayStatus.status) {
        switch (item.displayStatus.status) {
          case '1':
            status = '未申請'
            break
          case '2':
            if (this.state.selectedType == 3) {
              status = '交換済み'
            } else {
              status = 'お手続き中'
            }

            break
          case '3':
            status = '登録申請済み'
            break
          case '4':
            status = '受取エラー'
            break
          case '5':
            status = '非表示'
            break
          default:
            break
        }
      }
      let campaign = this.state.campaignList.filter((li) => {
        return li.campaignId === item.campaignId
      })
      let campaignDescription = campaign[0] ? campaign[0].description : ''
      campaignDescription = ReactHtmlParser(campaignDescription)
      let campaignMethod = campaign[0] ? campaign[0].method : ''
      campaignMethod = ReactHtmlParser(campaignMethod)
      let disabled = false
      let disabledMessage = (
        <p style={{ marginBottom: '0' }}>
          お支払いの状況に問題があるためお受け取りいただけません。
          <br />
          恐れ入りますが、イオンモバイルお客さまセンターまでお問い合わせください。
        </p>
      )
      if (item.judgeResult) {
        disabled =
          item.judgeResult.removed === '1' ||
          item.judgeResult.forcedStoppage === '1' ||
          item.judgeResult.unpaid === '1'
        if (item.judgeResult.removed === '1') {
          disabledMessage = (
            <p style={{ marginBottom: '0' }}>
              お申し込み頂いた特典・クーポンは、特典対象となったご契約をすでに解約頂いているため、お受け取りいただけません。
            </p>
          )
        }
      }
      let select = (
        <li className="campaignItem history">
          <div className="wrapper">
            {/* a-pc */}
            <div className="overview a-pc">
              <div className="heading">
                <div className="left">
                  <table>
                    <tr>
                      <th>登録申請期間</th>
                      <td className="date">
                        ：{waonExchangeStartDate}〜{waonExchangeEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>企画名</th>
                      <td className="date">：{item.campaignName}</td>
                    </tr>
                  </table>
                </div>
                <div className="status history">{status}</div>
              </div>

              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">説明</span>
                </p>
                {campaignDescription}
              </div>
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">受け取り方法</span>
                </p>
                {campaignMethod}
              </div>
            </div>
            {/* a-sp */}
            <div className="overview a-sp first">
              <div className="heading">
                <div
                  className="status history a-sp"
                  style={{ textAlign: 'right' }}
                >
                  {status}
                </div>
                <div className="left">
                  <table className="a-sp">
                    <tr>
                      <th>登録申請期間：</th>
                      <td className="date">
                        {waonExchangeStartDate}〜{waonExchangeEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>企画名：</th>
                      <td className="date">{item.campaignName}</td>
                    </tr>
                  </table>
                </div>
              </div>
              {() => {
                if (this.state.selectedType != 3) {
                  return (
                    <div className="point">
                      <div>付与ポイント：</div>
                      <div>
                        <span>{item.waonAddAmount}</span>ポイント
                      </div>
                    </div>
                  )
                }
              }}

              {(() => {
                if (item.waonCardNumber) {
                  let waonCardNumber = item.waonCardNumber.match(/.{4}/g)
                  waonCardNumber = waonCardNumber.join('-')
                  return (
                    <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                      WAONカード：{waonCardNumber}
                    </div>
                  )
                }
              })()}
              {(() => {
                if (item.expireDate) {
                  return (
                    <div style={{ padding: '0.5rem 0' }}>
                      <p
                        style={{
                          color: '#b50080',
                          fontWeight: 'bold',
                          marginBottom: '0.5rem',
                        }}
                      >
                        ダウンロード期限：
                        <br />
                        {item.expireDate}まで
                      </p>
                      <p style={{ fontSize: '1.5rem' }}>
                        ※この履歴は、ダウンロード期限終了まで表示されます。
                      </p>
                    </div>
                  )
                }
              })()}
            </div>
            {/* a-sp */}
            <div className="overview a-sp">
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">説明</span>
                </p>
                {campaignDescription}
              </div>
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">受け取り方法</span>
                </p>
                {campaignMethod}
              </div>
            </div>
            {/* a-pc */}
            <div
              className={`footArea a-pc ${
                item.waonCardNumber || item.expireDate ? 'split' : ''
              }`}
            >
              <div>
                {(() => {
                  if (disabled) {
                    return (
                      <div className="attention">
                        <span className="iconAttention" />
                        {disabledMessage}
                      </div>
                    )
                  }
                })()}
                {(() => {
                  if (item.waonCardNumber) {
                    let waonCardNumber = item.waonCardNumber.match(/.{4}/g)
                    waonCardNumber = waonCardNumber.join('-')
                    return (
                      <div style={{ padding: '0.5rem 0' }}>
                        WAONカード：{waonCardNumber}
                      </div>
                    )
                  }
                })()}
                {(() => {
                  if (item.expireDate) {
                    return (
                      <div style={{ padding: '0.5rem 0' }}>
                        <p
                          style={{
                            color: '#b50080',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                          }}
                        >
                          ダウンロード期限：{item.expireDate}まで
                        </p>
                        <p style={{ fontSize: '1.5rem', margin: '0' }}>
                          ※この履歴は、ダウンロード期限終了まで表示されます。
                        </p>
                      </div>
                    )
                  }
                })()}
              </div>
              {() => {
                if (this.state.selectedType != 3) {
                  return (
                    <div className="point">
                      <div>付与ポイント：</div>
                      <div>
                        <span>{item.waonAddAmount}</span>ポイント
                      </div>
                    </div>
                  )
                }
              }}
            </div>
            {/* a-sp */}
            {(() => {
              if (disabled) {
                return (
                  <div className="footArea a-sp">
                    <div className="attention">
                      <span className="iconAttention" />
                      {disabledMessage}
                    </div>
                  </div>
                )
              }
            })()}
          </div>
        </li>
      )
      return select
    })
    return <ul style={{ padding: '0' }}>{list}</ul>
  }
  returnWaonHelpModal() {
    return (
      <div className="t-modal is-active">
        <div className="t-modal_overlay" />
        <div
          className="t-modal_content waonHelpModal is-active"
          id="modal_mail"
          style={{ top: '5%', position: 'fixed' }}
        >
          <div className="m-modal" style={{ backgroundColor: '#F7F7F7' }}>
            <h4 className="waonHelpTitle">
              WAONカードの登録とポイントのご利用方法
            </h4>
            <div className="m-modal_inner waonHelp first">
              <div className="waonHelpWrapper">
                <div className="step">STEP1</div>
                <div>
                  <h5 className="text">クーポン・特典を選択します。</h5>
                  <div className="description">
                    <div className="imageWrap">
                      <img
                        className="image a-pc"
                        src={imageWaonHelpPC01}
                        alt="imageWaonHelpPC01"
                      />
                      <img
                        className="image a-sp"
                        src={imageWaonHelpSP01}
                        alt="imageWaonHelpSP01"
                      />
                    </div>
                    <div className="text">
                      <p>
                        ◎WAONポイントを受け取りたい特典にチェックを入れて、
                        <br />
                        「チェックしたクーポン・特典を受け取る」を選択します。
                      </p>
                      <p>
                        ◎対象のクーポン・特典に記載の登録申請期間内に限り選択できます。
                        <br />
                        登録申請期間を超えたクーポン・特典は失効します。
                      </p>
                      <p>
                        ◎複数のクーポン・特典がある場合、複数選択することでWAONカードをまとめて登録できます。
                        <br />
                        異なるWAONカードを登録する場合は、クーポン・特典ごとにWAONカードを指定してください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-modal_inner waonHelp">
              <div className="waonHelpWrapper">
                <div className="step">STEP2</div>
                <div>
                  <h5 className="text">WAONカードの番号を登録します。</h5>
                  <div className="description">
                    <div className="imageWrap">
                      <img
                        className="image a-pc"
                        src={imageWaonHelpPC02}
                        alt="imageWaonHelpPC02"
                      />
                      <img
                        className="image a-sp"
                        src={imageWaonHelpSP02}
                        alt="imageWaonHelpSP02"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-modal_inner waonHelp">
              <div className="waonHelpWrapper">
                <div className="step">STEP3</div>
                <div>
                  <h5 className="text">
                    お近くのWAONステーションなどから
                    <br />
                    ダウンロードしてご利用ください。
                  </h5>
                  <div className="description">
                    <div className="text">
                      <p>
                        ◎WAONステーションはイオン各店にございます。
                        <br />
                        WAONステーション設置店舗やダウンロードの方法などの詳細は
                        <a
                          className="notice"
                          href="https://www.waon.net/terminal/"
                          target="_blank"
                        >
                          こちら
                        </a>
                        をご確認ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner waonHelp"
              style={{ borderBottom: 'none' }}
            >
              <div className="waonHelpWrapper">
                <div>
                  <div className="description">
                    <div className="text">
                      <p className="notice">
                        ※&nbsp;ダウンロード期限までにダウンロードされなかったWAONポイントは失効します。
                      </p>
                      <p className="notice">
                        ※&nbsp;WAONカードの番号を誤って登録された場合、WAONポイントはお受け取りいただけません。
                      </p>
                      <p className="notice">
                        ※&nbsp;失効したWAONポイントはいかなる場合も再付与はできませんので、十分ご確認ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner"
              style={{ padding: '1.0rem 2.0rem 3.0rem' }}
            >
              <div className="m-modal_btngroup">
                <div
                  className="m-modal_btngroup_item m-btn"
                  style={{ width: '100%' }}
                >
                  <button
                    className="a-btn-dismiss a-btn-icon-none"
                    type="button"
                    onClick={(e) => this.showWaonHelpModal(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  returnWaonDownloadNoticeModal() {
    return (
      <div className="t-modal is-active">
        <div className="t-modal_overlay" />
        <div
          className="t-modal_content waonHelpModal is-active"
          id="modal_mail"
          style={{ top: 'calc(50% - 200px)', position: 'fixed' }}
        >
          <div className="m-modal" style={{ backgroundColor: '#F7F7F7' }}>
            <h4 className="waonHelpTitle" style={{ textAlign: 'left' }}>
              WAONポイントのダウンロード期限の表示について
            </h4>
            <div className="m-modal_inner waonHelp">
              <div className="waonHelpWrapper">
                <div className="description">
                  <div>
                    <p>
                      毎年9月30日ならびに3月31日に対象のクーポン・特典を登録申請いただく場合、申請時間によっては、お客さまマイページに表示されるダウンロード期限が、正しく表示されない場合（半年短く表示される）がございます。
                    </p>
                    <p>
                      尚、正しいダウンロード期限は、WAONステーションにてご確認いただけます。
                    </p>
                    <p>
                      お手数をお掛けしますが、WAONステーションにてご確認いただきますようお願いいたします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner"
              style={{ padding: '1.0rem 2.0rem 3.0rem' }}
            >
              <div className="m-modal_btngroup">
                <div
                  className="m-modal_btngroup_item m-btn"
                  style={{ width: '100%' }}
                >
                  <button
                    className="a-btn-dismiss a-btn-icon-none"
                    type="button"
                    onClick={(e) => this.showWaonDownloadNoticeModal(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  showWaonHelpModal(flag) {
    this.setState({ waonHelpModal: flag })
  }
  showWaonDownloadNoticeModal(flag) {
    this.setState({ waonDownloadNoticeModal: flag })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
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
                      <a
                        href=""
                        onClick={(e) =>
                          this.goNextDisplay(e, '/mypage/campaign/')
                        }
                      >
                        {Const.TITLE_MYPAGE_CAMPAIGN}
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">
                      {Const.TITLE_MYPAGE_CAMPAIGN_HISTORY}
                    </li>
                  </ol>
                  <h1 className="a-h1">
                    {Const.TITLE_MYPAGE_CAMPAIGN_HISTORY}
                  </h1>
                  <div className="t-inner_wide">
                    <a
                      className="link_help"
                      onClick={(e) => this.showWaonHelpModal(true)}
                    >
                      <span>WAONカードの登録とポイントのご利用方法</span>
                      <span className="icon" />
                    </a>
                    <a
                      className="link_help"
                      onClick={(e) => this.showWaonDownloadNoticeModal(true)}
                    >
                      <span>WAONポイントのダウンロード期限の表示について</span>
                      <span className="icon" />
                    </a>

                    <div className="t-inner_wide">
                      <div className="t-tabs_wrap">
                        <div className="t-tabs_button_wrap">
                          <button
                            className={`t-tabs_button ${
                              this.state.activeTabNumber == 1 && 'active'
                            }`}
                            onClick={() =>
                              this.setState({
                                activeTabNumber: 1,
                                selectedType: 2,
                              })
                            }
                          >
                            WAONポイント特典
                          </button>
                          <button
                            className={`t-tabs_button ${
                              this.state.activeTabNumber == 2 && 'active'
                            }`}
                            onClick={() =>
                              this.setState({
                                activeTabNumber: 2,
                                selectedType: 3,
                              })
                            }
                          >
                            1GBクーポン特典
                          </button>
                        </div>
                        <div className="t-tabs_content_wrap">
                          {this.renderWaonAddPointHistoryList()}
                        </div>
                      </div>
                    </div>

                    <p className="m-btn">
                      <a
                        className="a-btn-dismiss a-pc"
                        onClick={(e) =>
                          this.goNextDisplay(e, '/mypage/campaign/')
                        }
                        style={{ width: '360px' }}
                      >
                        紹介チケット・クーポン・特典に戻る
                      </a>
                      <a
                        className="a-btn-dismiss a-sp"
                        onClick={(e) =>
                          this.goNextDisplay(e, '/mypage/campaign/')
                        }
                        style={{ width: '260px' }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>
                          紹介チケット・クーポン・特典に
                        </span>
                        <br />
                        戻る
                      </a>
                    </p>
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
            {(() => {
              if (this.state.waonHelpModal) {
                return this.returnWaonHelpModal()
              }
            })()}
            {(() => {
              if (this.state.waonDownloadNoticeModal) {
                return this.returnWaonDownloadNoticeModal()
              }
            })()}
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

export default connect(mapStateToProps)(CampaignHistory)
