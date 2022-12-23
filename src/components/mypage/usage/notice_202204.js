import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'
import Dialog from '../../../modules/Dialog.js'
import NoticeImage202204 from '../../assets/images/notice_image_202204.png'

import ComponentBase from '../../ComponentBase.js'

import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

class Usage_Notice_202204 extends ComponentBase {
  constructor(props) {
    super(props)
    console.log(props)

    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    let noticeId
    if (props.match.params.noticeId) {
      noticeId = props.match.params.noticeId
    } else {
      noticeId =
        props.history.location.state !== undefined
          ? props.history.location.state.noticeId
          : ''
    }
    this.state = {
      noticeId,
      notice_data: {},
      loading_state: false,

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
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = '3月度請求金額の誤りと料金調整について'
    this.setState({
      notice_data: {
        date: '2022/04/15',
        title: document.title,
        noticeText:
          '<p>2022年3月度のご利用料金請求にあたり、以下に該当するお客さまにおきまして請求金額に誤りがあることが判明いたしました。<br />該当するお客さまにはご迷惑をおかけし、誠に申し訳ございません。<br />尚、同月内で料金調整をさせていただきますので、実際の請求金額（合計額）は正しい金額となります。</p><p>また、一部のお客さまにおきましては、料金調整の際に消費税分の減額がされていない方、および本来調整額が計上されるべきところ計上されていない方がいらっしゃいました。（下記1. および4.に該当する方）<br />こちらに該当する場合、ご利用のクレジットカードにより、以下の状態となる場合がございます。<br />・一時的に誤った金額のご請求が計上される場合がございます<br />・クレジットの請求を取り消し・再計上するため、イオンモバイルの請求、取り消しが複数行に渡る場合がございます<br />また、一時的にご利用明細が誤った金額で表示されますが、今月中に正しい明細に訂正されます。</p><p><b>該当のお客さま及び誤りの内容について</b></p><ol><li><p>3月中にオプションサービスをお申し込み(新規契約含む)いただいた一部のお客さま<br />無料期間の終了日が実際よりも早く終了した形として判定され、一部請求が計上されておりました。<br />本来あるべき無料期間に合わせ、料金を調整しております。</p></li><li><p>オンラインで回線をお申し込み、ご契約いただいた一部のお客さま<br />SIM手数料について二重に請求が計上されている状態となっておりました。<br />お申し込みに合わせた形で料金を調整しております。</p></li><li><p>エントリーコードを利用しお申し込みいただいたお客さま<br />エントリーコードを利用しお申し込みいただいたお客さまにおいて、1回線目のSIM手数料が計上されている状態となっておりました。<br />エントリーコード利用分（1回線分）のSIM手数料について、料金を調整しております。</p></li><li><p>2月他社へお乗り換え（MNP転出）された一部のお客さま<br />2月度に他社へお乗り換え（MNP転出）された一部のお客さまにおいて、解約済みの一部サービスのご利用料金が計上されておりました。<br />こちらについて、解約済みのサービスについて、料金を調整しております。</p></li></ol><p><b>マイページでの料金明細について</b></p><img src="/images/notice_image_202204.png" /><p>マイページでの料金明細には、誤った金額と調整額が上記の画像のようにそれぞれ記載されます。<br />請求金額の合計は正しい金額となっておりますので、ご理解のほど、何卒よろしくお願いいたします。</p>',
      },
    })
    setTimeout(() => {
      $('.m-news_body').html(this.state.notice_data.noticeText)
    }, 0)
  }

  // NEXT画面に遷移する
  goNextDisplay(e, url, params) {
    e.preventDefault()
  }

  dataFixingHandler(type, index) {
    var TempReturn = ' '
    switch (type) {
      case 'date':
        TempReturn = this.state.notice_data.date
        break
      case 'title':
        TempReturn = this.state.notice_data.title
        break
      case 'noticeText':
        TempReturn = this.state.notice_data.noticeText
        break
      default:
        TempReturn = ' '
    }
    return TempReturn
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mypage/sim/user')
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

  render() {
    // this.News_head = this.state.notice_data.map((item, key) => (
    //   <div key={"tr" + key} />
    // ));
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
                  {(() => {
                    if (localStorage.getItem('isLoggedIn') === '1') {
                      return (
                        <ol className="m-breadcrumb">
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) => this.goNextDisplay(e, '/')}
                            >
                              TOP
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) => {
                                e.preventDefault()
                                this.headerUrlHandler(
                                  '/mypage/usage/',
                                  this.state.url_data[0].pass_data
                                )
                              }}
                            >
                              ご利用明細一覧
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            {this.dataFixingHandler('title', 0)}
                          </li>
                        </ol>
                      )
                    } else {
                      return (
                        <ol className="m-breadcrumb">
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) => this.goNextDisplay(e, '/login/')}
                            >
                              ログイン
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            {this.dataFixingHandler('title', 0)}
                          </li>
                        </ol>
                      )
                    }
                  })()}
                  <h1 className="a-h1">{this.dataFixingHandler('title', 0)}</h1>
                  <div className="m-news">
                    <div className="m-news_header">
                      <time className="m-news_time" dateTime="2018-10-17">
                        {this.dataFixingHandler('date', 0)}
                      </time>
                      <h2 className="a-h3">
                        {this.dataFixingHandler('title', 0)}
                      </h2>
                    </div>
                    <div className="m-news_body">
                      {(() => {
                        /* if(this.dataFixingHandler("noticeText", 0) !== undefined){
                          return(
                            <div>
                            {this.dataFixingHandler("noticeText", 0)}
                            </div>
                          );
                        }else{
                          return(
                            <div>
                            {this.dataFixingHandler("noticeText", 0)}
                            </div>
                          );
                        } */
                      })()}
                      {/* <p>{this.dataFixingHandler("noteceText",key)}</p> */}
                    </div>
                  </div>
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

export default connect(mapStateToProps)(Usage_Notice_202204)
