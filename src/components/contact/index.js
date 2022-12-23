// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../assets/css/common.css'

// import image
import logoImage from '../assets/images/logo.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../ComponentBase'

// IMPORT CONST FILE
import * as Const from '../../Const.js'

// IMPORT MODULES
import Dialog from '../../modules/Dialog.js'
import Header from '../../modules/Header.js'

import { dispatchGetConnections } from '../../actions/PostActions.js'
import { dispatchPostConnections } from '../../actions/PostActions.js'
import { setConnectionCB } from '../../actions/PostActions.js'

const optionsArray = [
  [
    '0702010001',
    '0702010002',
    '0702010003',
    '0702010004',
    '0702010005',
    '0702010006',
    '0702010007',
    '0702010015',
    '0702010028',
    '0702010029',
    '0702010030',
    '0702010031',
    '0702010032',
    '0702010033',
    '0702010034',
    '0702010036',
  ],
  ['0702010024', '0702010025', '0702010027'],
]

class Contact extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      customerID: '',
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

      lineInfo: [
        {
          lineDiv: '',
          lineNo: '',
          lineKeyObject: '',
        },
      ],

      fromPage:
        props.history.location.state !== undefined
          ? props.history.location.state.frompage
          : '',
      mailAddress: '',
      loginMailAddressFlg: 0,
      loginYahooFlg: 0,
      loginGoogleFlg: 0,
      customerInfo: {
        userName: '',
        userNameKana: '',
        postCode: '',
        address: '',
        phoneNumber: '',
      },
      simInfo: [
        {
          ICCID: '',
          lineNo: '',
          // 追加されるはず。
          nickName: '',
        },
      ],
      option: [],
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
    }
  }

  handleConnect(type) {
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_OPTIONAGREEMENT:
        params = {
          customerId: window.customerId,
          lineKeyObject: localStorage.getItem(Const.LINEKEYOBJECT),
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
      var params
      if (data.data.length > 0) {
        params = data.data[0]
      } else {
        params = data.data
      }
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        this.setState({ customer_id: data.data.customerId })
        window.customerId = data.data.customerId
        this.handleConnect(Const.CONNECT_TYPE_OPTIONAGREEMENT)
      }
      if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        this.setState({ customerID: params.customerID })
        this.setState({ mailAddress: params.mailAddress })
        this.setState({ loginMailAddressFlg: params.loginMailAddressFlg })
        this.setState({ loginYahooFlg: params.loginYahooFlg })
        this.setState({ loginGoogleFlg: params.loginGoogleFlg })
        this.setState({ customerInfo: params.customerInfo })
        this.handleConnect(Const.CONNECT_TYPE_OPTIONAGREEMENT)
      } else if (type === Const.CONNECT_TYPE_OPTIONAGREEMENT) {
        this.setState({ option: params.option })
      }
    } else if (status === Const.CONNECT_ERROR) {
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

  dataFixingHandler(type, index) {
    if (this.state.option.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'name':
          TempReturn = this.state.option[index].name
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  // RETURN CONTACT AREA
  returnContactArea(type) {
    let isOptionEnabled = false
    let optionArea = null
    if (!this.state.option.length) return
    this.state.option.map((item) => {
      if (optionsArray[type].includes(item.id) && item.status == 1) {
        isOptionEnabled = true
      }
    })
    if (isOptionEnabled) {
      if (type == 0) {
        // イオンスマホ電話サポート
        optionArea = (
          <div>
            <hr className="a-hr a-hr-full" />
            <h2 className="a-h2">有料オプションサービスご契約のお客さま専用</h2>
            <div className="m-customer">
              <dl>
                <dt className="a-h3 a-mb-5">イオンスマホ電話サポート</dt>
                <dd>
                  <a className="a-link-tel" href="tel:0120-826-926">
                    0120-826-926
                  </a>
                </dd>
              </dl>
              <p>
                【受付時間】
                <br />
                09:00-20:00（年中無休）
              </p>
            </div>
            <p>
              イオンモバイルオプションサービス「安心パック」「安心保証」「電話サポート」にご加入の有料会員さま向けのお問い合わせ窓口です。
            </p>
            <p>
              当該のオプションサービスに加入されていないお客さまはご利用いただけません。
            </p>
          </div>
        )
      } else {
        // イオンモバイル持ちこみ保証受付センター
        let isArea0 = this.returnContactArea(0)
        optionArea = (
          <div>
            <hr className="a-hr a-hr-full" />
            <h2
              className="a-h2"
              style={{ display: isArea0 ? 'none' : 'block' }}
            >
              有料オプションサービスご契約のお客さま専用
            </h2>
            <div className="m-customer">
              <dl>
                <dt className="a-h3 a-mb-5">
                  イオンモバイル持ちこみ保証受付センター
                </dt>
                <dd>
                  <a className="a-link-tel" href="tel:0120-966-356">
                    0120-966-356
                  </a>
                </dd>
              </dl>
              <p>
                【受付時間】
                <br />
                09:00-20:00（年中無休）
              </p>
            </div>
            <p>
              イオンモバイルオプションサービス「持ち込み保証」にご加入の有料会員さま向けのお問い合わせ窓口です。
            </p>
            <p>
              登録されている端末が故障した際のサービスお申込み専用窓口のため、当該のオプションサービスに加入されていないお客さまはご利用いただけません。
            </p>
          </div>
        )
      }
    }
    return optionArea
  }

  componentDidMount() {
    this.goTop()
    // if(window.customerId === undefined) return;
    console.log('window::', window.customerId)
    document.title = Const.TITLE_CONTACT
    if (window.customerId !== '' && window.customerId !== undefined) {
      this.handleConnect(Const.CONNECT_TYPE_OPTIONAGREEMENT)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    }

    $('#modal_customer,#Inquire').click(function () {
      /* $(".t-modal").addClass("is-active");
      $(".t-modal_content").addClass("is-active");
      $(".t-modal_content").css("top", "319.8px"); */
    })

    $('.t-modal_overlay').click(function () {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
    })

    // if redirect from mypage/sim change
    if (this.state.fromPage === 'fromSimChange') {
      var lineInfo_copy = [...this.state.lineInfo]
      lineInfo_copy[0].lineDiv =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.lineDiv
          : ''
      lineInfo_copy[0].lineKeyObject =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.lineKeyObject
          : ''
      lineInfo_copy[0].lineNo =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.lineNo
          : ''
      this.setState({ lineInfo: lineInfo_copy })
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

  goNextDisplay(e, url, params) {
    e.preventDefault()

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/forgot/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/login/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/sim/change/':
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

  popUp(e) {
    e.preventDefault()
    $('.t-modal').addClass('is-active')
    $('.t-modal_content').addClass('is-active')

    // popup position fixing..
    // $(".t-modal_content").css("top", "50%");
    // $(".t-modal_content").css("left", "50%");
    // $(".t-modal_content").css("transform", "translate(-50%, -50%)");
    // //position fixing while scrolling.....
    //  $(".t-modal_content").css("position", "fixed");
  }

  goToLink(e) {
    e.preventDefault()
    window.open(
      'https://shop.aeondigitalworld.com/shop/contents2/A116/contactagree.aspx'
    )
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

  render() {
    if (window.customerId) {
      this.headerHideShow = (
        <Header
          isExistStatus={this.props.isExistStatus}
          {...this.state.url_data[0]}
        />
      )
    } else {
      this.headerHideShow = (
        <header className="t-header">
          <div className="t-header_inner">
            <div className="t-header_logo">
              <a className="t-header_logo_link" href="/">
                <img src={logoImage} alt="AEON MOBILE" />
              </a>
            </div>
          </div>
        </header>
      )
    }
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
            {this.headerHideShow}
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <ol className="m-breadcrumb">
                    <li className="m-breadcrumb_item">
                      {this.state.fromPage === 'fromForgot' ? (
                        <a
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/forgot/')}
                        >
                          パスワードをお忘れのお客さま
                        </a>
                      ) : this.state.fromPage === 'fromLogin' ? (
                        <a
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/login/')}
                        >
                          ログイン
                        </a>
                      ) : this.state.fromPage === 'fromMypage' ? (
                        <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                          TOP
                        </a>
                      ) : this.state.fromPage === 'fromSimChange' ? (
                        <a
                          href=""
                          onClick={(e) =>
                            this.goNextDisplay(
                              e,
                              '/mypage/sim/change/',
                              this.state.lineInfo[0]
                            )
                          }
                        >
                          SIMカードの停止・再開
                        </a>
                      ) : !window.customerId ? (
                        <a
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/login/')}
                        >
                          ログイン
                        </a>
                      ) : (
                        <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                          TOP
                        </a>
                      )}
                    </li>
                    <li className="m-breadcrumb_item">お問い合わせ</li>
                  </ol>
                  <h1 className="a-h1">お問い合わせ</h1>
                  <div className="m-form">
                    <h2 className="a-h2">ご契約内容に関するお問い合わせ</h2>
                    <div className="m-customer">
                      <dl>
                        <dt className="a-h3 a-mb-5">
                          イオンモバイルお客さまセンター
                        </dt>
                        <dd>
                          <a className="a-link-tel" href="tel:0120-025-260">
                            0120-025-260
                          </a>
                        </dd>
                      </dl>
                      <p>
                        【受付時間】
                        <br />
                        10:30-19:30（年中無休）
                      </p>
                      <p>※ご契約のご本人さまからのお問い合わせが必須です。</p>
                    </div>
                    <p>
                      ご契約内容以外のお問い合わせは下記のお問い合わせフォームからでもお問い合わせいただけます。
                    </p>
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn-submit"
                          href=""
                          onClick={(e) => {
                            this.goToLink(e)
                          }}
                          id="Inquire"
                        >
                          お問い合わせフォーム
                        </a>
                      </p>
                    </div>
                    <div className="m-form_section">
                      <p>
                        ※選択されると「イオンデジタルワールド」サイトのお問い合わせフォームに移動します。
                      </p>
                      <p style={{ textIndent: '-1em', paddingLeft: '1em' }}>
                        ※ご契約内容に関するお問い合わせにはお答えできません。
                        <br />
                        その場合は、上記のイオンモバイルお客さまセンターをご利用ください。
                      </p>
                    </div>
                    <div>
                      {this.returnContactArea(0)}
                      {this.returnContactArea(1)}
                      {this.info_logged}
                    </div>

                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          onClick={() => {
                            this.props.history.push('/login')
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
            <div className="t-modal">
              <div className="t-modal_overlay" />
              <div
                className="t-modal_content"
                style={{
                  top: '50%',
                  left: '50%',
                  position: 'fixed',
                  transform: 'translate(-50%,-50%)',
                }}
              >
                <div className="m-customer">
                  <h2 className="m-customer_ttl a-h3">
                    イオンモバイルお客さまセンター
                  </h2>
                  <p>
                    <a className="a-link-tel" href="tel:0120-025-260">
                      0120-025-260
                    </a>
                  </p>
                  <p>
                    ＜受付時間＞
                    <br />
                    10時30分〜19時30分（年中無休）
                  </p>
                </div>
              </div>
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

export default connect(mapStateToProps)(Contact)
