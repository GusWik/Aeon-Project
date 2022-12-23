import React, { Component } from 'react'
import logoImage from './images/logo.png'
import $ from 'jquery'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
import { connect } from 'react-redux'
import moment from 'moment'

import * as Const from '../Const.js'

import {
  dispatchGetConnections,
  setConnectionCB,
} from '../actions/PostActions.js'

const originalFetch = window.fetch || fetchPolyfill
const fetch = (...args) => {
  return originalFetch(...args)
}

class Header extends Component {
  constructor(props) {
    super(props)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      callback: this.props.callback,
      pass_data: this.props.pass_data,
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
      isDataswitchApp: false,
    }
  }

  componentDidMount() {
    var name = window.location.pathname

    switch (name) {
      case '/mypage':
        $('#header_top').addClass('is-active')
        break
      case '/mypage/news/':
        $('#header_news').addClass('is-active')
        break
      case '/mypage/usage/':
        $('#header_usage').addClass('is-active')
        break
      case '/mypage/payment/':
        $('#header_payment').addClass('is-active')
        break
      case '/mypage/user/':
        $('#header_user').addClass('is-active')
        $('#header_user_sp').addClass('is-active')
        break
      case '/mypage/notice/':
        $('#header_notice').addClass('is-active')
        break
      case '/mypage/operate/':
        $('#header_operate_sp').addClass('is-active')
        break
      case '/guide/':
        $('#header_guide_sp').addClass('is-active')
        break
      case '/contact/':
        $('#header_contact_sp').addClass('is-active')
        break
    }
    let ua = window.navigator.userAgent
    let isDataswitchApp = ua.includes('dataswitchApp')
    this.setState({ isDataswitchApp })
    if (!this.props.campaign || name == '/mypage') {
      // campaign取得
      if (!window.customerId) {
        // customerId取得
        this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
      } else {
        // WAONキャンペーン取得
        this.handleConnect(Const.CONNECT_TYPE_WAON)
      }
    }
    this.getIotPlans()
  }
  returnAvailableCampaignCount() {
    let count = Array.isArray(this.props.campaign)
      ? this.props.campaign.length
      : 0
    return count
  }

  logout() {
    localStorage.removeItem('customerId')
    localStorage.removeItem('lineInfoNum')
    localStorage.removeItem('lineKeyObject')
    this.handleConnect(Const.CONNECT_TYPE_LOGOUT)
  }

  handleConnect(type) {
    var params = {}
    var method = 'POST'
    var body
    switch (type) {
      // api AMM00005 - agreement
      case Const.CONNECT_TYPE_MYPAGEID:
        method = 'GET'
        break
      // WAONポイント付与情報取得API
      case Const.CONNECT_TYPE_WAON:
        params = {
          customerId: window.customerId,
          displayStatusList: ['1', '4'],
        }
        body = JSON.stringify(params)
        break
      // MYP013-A001 決済エラー通知API
      case Const.CONNECT_TYPE_PAYMENTERROR:
        params = {
          customerId: window.customerId,
        }
        body = JSON.stringify(params)
        break
      case Const.CONNECT_TYPE_LOGOUT:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        return
    }
    fetch(Const.DOMAIN + type, {
      body,
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method,
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (!json.data && type !== Const.CONNECT_TYPE_PAYMENTERROR) {
          return
        }
        switch (type) {
          // api AMM00005 - agreement
          case Const.CONNECT_TYPE_MYPAGEID: {
            if (json.data.customerId) {
              window.customerId = json.data.customerId
              this.handleConnect(Const.CONNECT_TYPE_WAON)
            }
            break
          }
          case Const.CONNECT_TYPE_WAON: {
            let waonAddPointHistoryList = json.data.waonAddPointHistoryList
            let availableCampaignCount = Array.isArray(waonAddPointHistoryList)
              ? waonAddPointHistoryList.length
              : 0
            this.props.updateCampaign(waonAddPointHistoryList)
            // 新料金
            let newPlanMonth = localStorage.getItem('np')
            // 紹介トク
            let today = moment()
            let shokaiCampaignUpdate = localStorage.getItem('scu')
            let shokaiCampaignMonth = localStorage.getItem('sc')
            let thisMonth = today.format('YYMM')
            if (newPlanMonth) {
              // 今月分が表示済みか判定
              //  if (newPlanMonth < thisMonth) {
              //    newPlanMonth = false
              //  }

              localStorage.removeItem('np')
            }

            if (shokaiCampaignMonth) {
              // 今月分が表示済みか判定
              if (shokaiCampaignMonth < thisMonth) {
                shokaiCampaignMonth = false
              }
            }
            if (!shokaiCampaignUpdate) {
              shokaiCampaignMonth = false
              localStorage.setItem('scu', thisMonth)
              localStorage.removeItem('sc')
            }

            //スマホメンテナンス
            let maintenanceCampaignMonth = localStorage.getItem('sm')
            if (maintenanceCampaignMonth) {
              // 今月分が表示済みか判定
              if (maintenanceCampaignMonth < thisMonth) {
                maintenanceCampaignMonth = false
              }
            }

            console.log(maintenanceCampaignMonth)

            // キャンペーン（期間限定）
            //バーチャルシネマ対応

            let limitedCampaignMonth = localStorage.getItem('qc')
            let limitedCampaignTerm = null
            const limitedCampaignNow = moment()
            //掲載日時11/25（金）10:00　～　11/28（月）9:59
            const limitedCampaignStartTime_day1 = moment('2022-11-25 10:00:00')
            const limitedCampaignEndTime_day1 = moment('2022-11-28 09:59:59')
            //掲載日時11/28（月）10:00　～　12/12（月）9:59
            const limitedCampaignStartTime_day2 = moment('2022-11-28 10:00:00')
            const limitedCampaignEndTime_day2 = moment('2022-12-12 09:59:59')

            if (
              limitedCampaignStartTime_day1.valueOf() <=
                limitedCampaignNow.valueOf() &&
              limitedCampaignNow.valueOf() <=
                limitedCampaignEndTime_day1.valueOf()
            ) {
              limitedCampaignTerm = 'day1'
            } else if (
              limitedCampaignStartTime_day2.valueOf() <=
                limitedCampaignNow.valueOf() &&
              limitedCampaignNow.valueOf() <=
                limitedCampaignEndTime_day2.valueOf()
            ) {
              if (limitedCampaignMonth == 'day1') {
                localStorage.removeItem('qc')
                limitedCampaignMonth = null
              }
              limitedCampaignTerm = 'day2'
            } else {
              localStorage.removeItem('qc')
            }

            //アンケート
            let limitedQuestionnairePt2 = localStorage.getItem('lq2')
            let limitedQuestionnairePt2Month = moment().isAfter(
              '2022/10/28 10:00:00'
            )
            localStorage.removeItem('lq2')
            localStorage.removeItem('lq3')

            //イオンスタイル
            let limitedQuestionnaire = localStorage.getItem('lq')
            let limitedQuestionnaireTerm = moment().isAfter(
              '2022/09/30 23:59:59'
            )

            if (limitedQuestionnaire < '2208') {
              localStorage.removeItem('lq')
            }

            //ネットスーパー
            //掲載日時12/1（木）0:00　～　12/31（土）23:59
            const limitedNetsuperNow = moment()
            const limitedNetsuperStartDay = moment('2022-12-01 00:00:00')
            const limitedNetsuperEndDay = moment('2022-12-31 23:59:59')
            let limitedNetsuper = localStorage.getItem('ln')

            //【掲載日時10/1（土）0:00 ～ 10/31（月）23:59】
            const limitedNetsuperNow_2 = moment()
            const limitedNetsuperStartDay_2 = moment('2022-10-01 00:00:00')
            const limitedNetsuperEndDay_2 = moment('2022-10-31 23:59:59')
            let limitedNetsuper_2 = localStorage.getItem('ln_2')

            if (limitedNetsuper < thisMonth) {
              localStorage.removeItem('ln')
            }

            if (limitedNetsuper_2 < thisMonth) {
              localStorage.removeItem('ln_2')
            }

            // 新料金 > クーポン・特典 > 期間限定キャンペーン > 紹介トク の優先順で表示
            if (!limitedQuestionnairePt2 && !limitedQuestionnairePt2Month) {
              this.props.setCampaignPopUp('limitedQuestionnairePt2')
              localStorage.setItem('lq2', thisMonth)
            } else if (!limitedCampaignMonth && limitedCampaignTerm) {
              this.props.setCampaignPopUp('limitedCampaign')
              localStorage.setItem('qc', limitedCampaignTerm)
            } else if (
              this.props.setCampaignPopUp &&
              !limitedNetsuper &&
              limitedNetsuperStartDay.valueOf() <=
                limitedNetsuperNow.valueOf() &&
              limitedNetsuperNow.valueOf() <= limitedNetsuperEndDay.valueOf()
            ) {
              // ネットスーパー
              this.props.setCampaignPopUp('limitedNetsuper')
              localStorage.setItem('ln', thisMonth)
            } else if (
              this.props.setCampaignPopUp &&
              !limitedNetsuper_2 &&
              limitedNetsuperStartDay_2.valueOf() <=
                limitedNetsuperNow_2.valueOf() &&
              limitedNetsuperNow_2.valueOf() <=
                limitedNetsuperEndDay_2.valueOf()
            ) {
              // ネットスーパー ２弾
              this.props.setCampaignPopUp('limitedNetsuper_2')
              localStorage.setItem('ln_2', thisMonth)
            } else if (
              availableCampaignCount > 0 &&
              this.props.setCampaignPopUp
            ) {
              this.props.setCampaignPopUp()
            } else if (
              this.props.setCampaignPopUp &&
              !limitedQuestionnaire &&
              !limitedQuestionnaireTerm
            ) {
              // イオンスタイルオンライン
              this.props.setCampaignPopUp('limitedQuestionnaire')
              localStorage.setItem('lq', thisMonth)
            } else if (
              this.props.setCampaignPopUp &&
              !maintenanceCampaignMonth
            ) {
              console.log('表示')
              // 各月初に1度のみ表示
              this.props.setCampaignPopUp('maintenance')
              localStorage.setItem('sm', thisMonth)
            } else if (this.props.setCampaignPopUp && !shokaiCampaignMonth) {
              // 各月初に1度のみ表示
              this.props.setCampaignPopUp('shokai')
              localStorage.setItem('sc', thisMonth)
            }
            // クレカ決済エラーチェック
            this.handleConnect(Const.CONNECT_TYPE_PAYMENTERROR)
            break
          }
          case Const.CONNECT_TYPE_PAYMENTERROR: {
            this.handlePaymentErrorStatus(json)
            break
          }
        }
      })
  }
  handlePaymentErrorStatus(json) {
    // errorCode
    // 0000:正常、2003:有効期限切れ、左記以外:決済エラー（2000など）
    // unchangeableCreditCard
    // 0:変更可／1:変更不可
    this.props.updatePaymentError(json)
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_LOGOUT:
          delete window.customerId
          this.state.callback('/login/', this.state.pass_data)
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION
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
        values[0] = { text: data.response.error_detail.error_message }
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

  handleClick(e, url, data) {
    e.preventDefault()
    var name = window.location.pathname
    if (name === url) {
      $('.t-wrapper').removeClass('is-drawer-open')
    }
    this.state.callback(url, data)
  }

  getIotPlans() {
    if (this.props.iotPlans.zeroPlans.length) {
      return
    }
    fetch(`${Const.CONNECT_TYPE_IOT_PLANS}?v=${this.getTimestamp()}`, {
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
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.props.updateIotPlans(json)
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  //タイムスタンプ取得
  getTimestamp() {
    var date = new Date()
    var a = date.getTime()
    var b = Math.floor(a / 1000)
    return b
  }

  render() {
    return !this.state.isDataswitchApp ? (
      <React.Fragment>
        <header className="t-header">
          <div className="t-header_inner">
            <div className="t-header_logo">
              <a
                className="t-header_logo_link"
                href=""
                onClick={(e) =>
                  this.handleClick(e, '/mypage', this.state.pass_data)
                }
              >
                <img src={logoImage} alt="AEON MOBILE" />
              </a>
            </div>
            {(() => {
              if (localStorage.getItem('isLoggedIn') === '1') {
                return (
                  <div className="t-header_menu">
                    <button
                      className="t-header_menu_btn"
                      type="button"
                      onClick={(e) => {
                        $('.t-wrapper').addClass('is-drawer-open')
                      }}
                    >
                      <span>メニュー</span>
                    </button>
                    {(() => {
                      if (this.returnAvailableCampaignCount() > 0) {
                        return (
                          <span className="availableCampaignCount">
                            {this.returnAvailableCampaignCount()}
                          </span>
                        )
                      }
                    })()}
                  </div>
                )
              }
            })()}
            {(() => {
              if (localStorage.getItem('isLoggedIn') === '1') {
                return (
                  <div className="t-header_drawer">
                    <nav className="t-header_drawer_inner">
                      <div className="t-header_drawer_header">
                        <div className="t-header_drawer_ttl">MENU</div>
                        <div className="t-header_drawer_close">
                          <button
                            className="t-header_drawer_close_btn"
                            type="button"
                            onClick={(e) => {
                              $('.t-wrapper').removeClass('is-drawer-open')
                            }}
                          >
                            <span>閉じる</span>
                          </button>
                        </div>
                      </div>
                      <ul className="t-header_gnav">
                        <li className="t-header_gnav_item">
                          <a
                            id="header_top"
                            className="t-header_gnav_link"
                            href=""
                            onClick={(e) =>
                              this.handleClick(
                                e,
                                '/mypage',
                                this.state.pass_data
                              )
                            }
                          >
                            TOP
                          </a>
                        </li>
                        <li className="t-header_gnav_item">
                          <a
                            id="header_news"
                            className="t-header_gnav_link"
                            href=""
                            onClick={(e) =>
                              this.handleClick(
                                e,
                                '/mypage/news/',
                                this.state.pass_data
                              )
                            }
                          >
                            お知らせ
                          </a>
                        </li>
                        {(() => {
                          if (this.props.isExistStatus('get')) {
                            return (
                              <li className="t-header_gnav_item">
                                <a
                                  id="header_usage"
                                  className="t-header_gnav_link"
                                  href=""
                                  onClick={(e) =>
                                    this.handleClick(
                                      e,
                                      '/mypage/usage/',
                                      this.state.pass_data
                                    )
                                  }
                                >
                                  ご利用明細
                                </a>
                              </li>
                            )
                          }
                        })()}
                        {(() => {
                          if (this.props.isExistStatus('get', null, 'E99908')) {
                            return (
                              <li className="t-header_gnav_item a-pc">
                                <a
                                  id="header_user"
                                  className="t-header_gnav_link"
                                  href=""
                                  onClick={(e) =>
                                    this.handleClick(
                                      e,
                                      '/mypage/user/',
                                      this.state.pass_data
                                    )
                                  }
                                >
                                  お客さま情報<span>（ログイン設定）</span>
                                </a>
                              </li>
                            )
                          }
                        })()}
                        {(() => {
                          if (this.props.isExistStatus('get')) {
                            return (
                              <li className="t-header_gnav_item">
                                <a
                                  id="header_notice"
                                  className="t-header_gnav_link"
                                  href=""
                                  onClick={(e) =>
                                    this.handleClick(
                                      e,
                                      '/mypage/notice/',
                                      this.state.pass_data
                                    )
                                  }
                                >
                                  完了通知
                                </a>
                              </li>
                            )
                          }
                        })()}
                        <li className="t-header_gnav_item">
                          <a
                            id="header_notice"
                            className="t-header_gnav_link"
                            href=""
                            onClick={(e) =>
                              this.handleClick(
                                e,
                                '/mypage/user/list/',
                                this.state.pass_data
                              )
                            }
                          >
                            契約一覧
                          </a>
                        </li>
                        {(() => {
                          if (this.props.isExistStatus('get')) {
                            return (
                              <li className="t-header_gnav_item a-sp">
                                <a
                                  id="header_notice"
                                  className="t-header_gnav_link"
                                  href=""
                                  onClick={(e) =>
                                    this.handleClick(
                                      e,
                                      '/mypage/campaign/',
                                      this.state.pass_data
                                    )
                                  }
                                >
                                  紹介チケット・クーポン・特典
                                  {(() => {
                                    if (
                                      this.returnAvailableCampaignCount() > 0
                                    ) {
                                      return (
                                        <span className="availableCampaignCount">
                                          {this.returnAvailableCampaignCount()}
                                        </span>
                                      )
                                    }
                                  })()}
                                </a>
                              </li>
                            )
                          }
                        })()}
                      </ul>
                      <div
                        className=""
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <ul className="t-header_subnav">
                          {(() => {
                            if (this.props.isExistStatus('get')) {
                              return (
                                <li className="t-header_subnav_item a-sp">
                                  <a
                                    id="header_user_sp"
                                    className="t-header_subnav_link"
                                    href=""
                                    onClick={(e) =>
                                      this.handleClick(
                                        e,
                                        '/mypage/user/',
                                        this.state.pass_data
                                      )
                                    }
                                  >
                                    お客さま情報<span>（ログイン設定）</span>
                                  </a>
                                </li>
                              )
                            }
                          })()}
                          <li className="t-header_subnav_item a-sp">
                            <a
                              id="header_operate_sp"
                              className="t-header_subnav_link"
                              href=""
                              onClick={(e) =>
                                this.handleClick(
                                  e,
                                  '/mypage/operate/',
                                  this.state.pass_data
                                )
                              }
                            >
                              マイページ操作履歴
                            </a>
                          </li>
                          <li className="t-header_subnav_item a-sp">
                            <a
                              id="header_guide_sp"
                              className="t-header_subnav_link"
                              href=""
                              onClick={(e) =>
                                this.handleClick(
                                  e,
                                  '/guide/',
                                  this.state.pass_data
                                )
                              }
                            >
                              マイページご利用方法
                            </a>
                          </li>
                          <li className="t-header_subnav_item a-sp">
                            <a
                              id="header_contact_sp"
                              className="t-header_subnav_link"
                              href=""
                              onClick={(e) =>
                                this.handleClick(
                                  e,
                                  '/contact/',
                                  this.state.pass_data
                                )
                              }
                            >
                              お問い合わせ
                            </a>
                          </li>
                          <li className="t-header_subnav_item">
                            <a
                              className="t-header_subnav_link"
                              href=""
                              onClick={(e) => {
                                e.preventDefault()
                                this.logout()
                              }}
                            >
                              ログアウト
                            </a>
                          </li>
                          <li className="t-header_guide a-pc">
                            <a
                              className="t-header_guide_btn"
                              href=""
                              onClick={(e) =>
                                this.handleClick(
                                  e,
                                  '/guide/',
                                  this.state.pass_data
                                )
                              }
                            >
                              <span>ヘルプ</span>
                            </a>
                          </li>
                        </ul>
                        <a
                          className="availableCampaignCountWrapper a-pc"
                          href=""
                          onClick={(e) =>
                            this.handleClick(
                              e,
                              '/mypage/campaign/',
                              this.state.pass_data
                            )
                          }
                        >
                          <div className="title">
                            紹介チケット・クーポン・特典
                          </div>
                          {(() => {
                            if (this.returnAvailableCampaignCount() > 0) {
                              return (
                                <span className="availableCampaignCount">
                                  {this.returnAvailableCampaignCount()}
                                </span>
                              )
                            }
                          })()}
                        </a>
                      </div>
                    </nav>
                  </div>
                )
              }
            })()}
            {(() => {
              if (localStorage.getItem('isLoggedIn') === '1') {
                return (
                  <div className="t-header_guide a-sp">
                    <a
                      className="t-header_guide_btn"
                      href=""
                      onClick={(e) =>
                        this.handleClick(e, '/guide/', this.state.pass_data)
                      }
                    >
                      <span>ヘルプ</span>
                    </a>
                  </div>
                )
              }
            })()}
          </div>
        </header>
      </React.Fragment>
    ) : null
  }
}

function mapStateToProps(state) {
  let postReducer = state.PostReducer.postReducer
  return {
    type: postReducer.type,
    campaign: postReducer.campaign,
    iotPlans: postReducer.iotPlans,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateCampaign: (newCampaign) =>
      dispatch({
        type: 'campaign',
        campaign: newCampaign,
      }),
    updatePaymentError: (newPaymentError) =>
      dispatch({
        type: 'paymentError',
        paymentError: newPaymentError,
      }),
    updateIotPlans: (newIotPlans) =>
      dispatch({
        type: 'iotPlans',
        iotPlans: newIotPlans,
      }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
