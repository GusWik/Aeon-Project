// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT IMAGES
import ic_app_denwa from '../../assets/images/ic_app_denwa.png?v=201909041100'
import btn_app_store from '../../assets/images/btn_app_store.png'
import btn_google_play from '../../assets/images/btn_google_play.png'
import ic_app_switch from '../../assets/images/ic_app_switch.png'
import option_ifilter from '../../assets/images/option_ifilter.png'
import ic_app_smamori from '../../assets/images/ic_app_smamori.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Option extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
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
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_OPTION
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
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
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
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">アプリ／オプション</li>
                  </ol>
                  <h1 className="a-h1">アプリ／オプション</h1>
                  <div className="t-inner_wide">
                    <h2 className="a-h2-line">アプリ</h2>
                    <div className="m-box-border">
                      <h3 className="m-box-border_header">イオンでんわ</h3>
                      <div className="m-box-border_body">
                        <div className="m-box-border_inner">
                          <div className="m-media-app">
                            <div className="m-media_pic">
                              <a
                                href="https://aeonmobile.jp/plan/aeondenwa/"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img src={ic_app_denwa} alt="" />
                              </a>
                            </div>
                            <div className="m-media_body">
                              <p>
                                イオンモバイル公式アプリ｢
                                <a
                                  className="a-primary"
                                  href="https://aeonmobile.jp/plan/aeondenwa/"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  イオンでんわ
                                </a>
                                ｣を利用することで、
                                <br className="a-pc" />
                                国内通話が一律税込11円/30秒でご利用いただけます。
                                <br />
                                また、イオンでんわで発信可能な指定の「国際通話サービス提供国・地域」に限り、30秒につき10円（非課税）でご利用いただけます。
                              </p>
                              <div className="m-media_full">
                                <div className="m-box-important">
                                  <h4 className="m-box-important_label">
                                    重要
                                  </h4>
                                  <p>
                                    タイプ１au回線にて、「イオンでんわ5分かけ放題」「イオンでんわ10分かけ放題」「やさしい10分かけ放題」をご契約中のお客さまは「イオンでんわ」を利用して音声通話を発信してください。
                                    <br />
                                    標準の通話アプリを利用して発信された場合、通常の通話料金が請求されます。
                                  </p>
                                </div>
                                <p className="a-ta-right">
                                  <a
                                    className="a-btn-blank"
                                    href="https://aeonmobile.jp/plan/aeondenwa/"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    詳細はこちら
                                  </a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="m-app">
                          <h4 className="m-app_ttl">
                            イオンでんわアプリのダウンロード
                          </h4>
                          <ul className="m-app_btn">
                            <li className="m-app_btn_item">
                              <a
                                href="https://itunes.apple.com/jp/app/aeondenwa/id1206723487?mt=8"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img
                                  src={btn_app_store}
                                  alt="App Storeからダウンロード"
                                />
                              </a>
                            </li>
                            <li className="m-app_btn_item">
                              <a
                                href="https://play.google.com/store/apps/details?id=jp.aeonretail.aeondenwa"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img
                                  src={btn_google_play}
                                  alt="Google Playで手に入れよう"
                                />
                              </a>
                            </li>
                          </ul>
                          <p>
                            ※アプリ対象端末:iOS8.0以上、Android4.0以上の音声通話機能がある端末
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="m-box-border">
                      <h3 className="m-box-border_header">
                        イオンモバイル速度切り替え
                      </h3>
                      <div className="m-box-border_body">
                        <div className="m-box-border_inner">
                          <div className="m-media-app">
                            <div className="m-media_pic">
                              <a
                                href="https://aeonmobile.jp/plan/data-switch-app/"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img src={ic_app_switch} alt="" />
                              </a>
                            </div>
                            <div className="m-media_body">
                              <p>
                                マイページへのログイン不要で、簡単に高速通信のON/OFFが可能！
                                <br />「
                                <a
                                  className="a-primary"
                                  href="https://aeonmobile.jp/plan/data-switch-app/"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  イオンモバイル速度切り替え
                                </a>
                                」を利用することで、
                                <br />
                                簡単に通信速度の高速・低速を切り替えることが可能です！
                              </p>
                              <p className="a-ta-right">
                                <a
                                  className="a-btn-blank"
                                  href="https://aeonmobile.jp/plan/data-switch-app/"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  詳細はこちら
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="m-app">
                          <h4 className="m-app_ttl">
                            速度切り替えアプリのダウンロード
                          </h4>
                          <ul className="m-app_btn">
                            <li className="m-app_btn_item">
                              <a
                                href="https://itunes.apple.com/jp/app//id1266263581?mt=8"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img
                                  src={btn_app_store}
                                  alt="App Storeからダウンロード"
                                />
                              </a>
                            </li>
                            <li className="m-app_btn_item">
                              <a
                                href="https://play.google.com/store/apps/details?id=jp.aeon.retail.mobile.app.dataswitch"
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <img
                                  src={btn_google_play}
                                  alt="Google Playで手に入れよう"
                                />
                              </a>
                            </li>
                          </ul>
                          <p>
                            ※アプリ対象端末:iOS9.0以上、Android
                            4.4.4以降を搭載したスマートフォン。
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="a-hr-primary a-hr-full a-sp" />
                    <h2 className="a-h2-line">オプション</h2>
                    <div className="m-option">
                      <div className="m-option_item">
                        <p>
                          イオンモバイルは豊富なオプションサービスをご用意しております。
                          <br />
                          ご契約者さまによるお申し込みは「ご契約即日お渡し店舗の窓口」もしくは「お客さま」センターへのお電話」にてお受け付けしております。
                        </p>

                        <p>
                          詳しくは
                          <a
                            className="a-link"
                            href="https://aeonmobile.jp/"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            イオンモバイルのホームページ
                          </a>
                          をご覧ください。
                        </p>
                      </div>
                      <div className="m-option_item">
                        <dl className="m-option_dl">
                          <dt>＜店舗一覧＞</dt>
                          <dd>
                            <a
                              className="m-option_url"
                              href="https://aeonmobile.jp/shoplist/"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              https://aeonmobile.jp/shoplist/
                            </a>
                          </dd>
                          <dt>＜お客さまセンター＞</dt>
                          <dd>
                            &nbsp;
                            <a className="m-option_tel" href="tel:0120-025-260">
                              0120-025-260
                            </a>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="m-box-border">
                      <h3 className="m-box-border_header">
                        イオンスマホ安心保証のサービス拡充について
                      </h3>
                      <div className="m-box-border_body">
                        <div className="m-box-border_inner">
                          <p>
                            2018年3月1日より、「イオンスマホ安心保証」の保証期間を、従来の3年間から永年に変更いたしました。
                            <br />
                            同日以降にお申込みのお客さまは、新しい保証期間が自動的に適用されます。
                            <br />
                            2018年2月28日までにご契約されたお客さまで新サービスへ切り替えを希望される方は、オプション変更のお申込みをお願い申し上げます。
                          </p>
                          <p className="a-ta-right">
                            <a
                              className="a-btn-blank"
                              href=""
                              onClick={(e) =>
                                this.goNextDisplay(e, '/mypage/option/service')
                              }
                            >
                              詳細はこちら
                            </a>
                          </p>
                        </div>
                      </div>
                      <h3 className="m-box-border_header">
                        オプションサービス「アプリ超ホーダイ」、「子どもパック」、「iフィルター」をご契約されたお客さまへ
                      </h3>
                      <div className="m-box-border_body">
                        <div className="m-box-border_inner">
                          <div className="m-optionservice">
                            <p className="m-optionservice_ifilter">
                              <img src={option_ifilter} alt="" />
                            </p>
                            <p className="m-optionservice_smamori">
                              <img src={ic_app_smamori} alt="" />
                            </p>
                          </div>
                          <p>
                            当該オプションにはフィルタリングサービスが含まれます。
                            <br />
                            ※「アプリ超ホーダイ」、「子どもパック」には「スマモリ」というフィルタリングサービスアプリが含まれます。
                          </p>
                          <p>ご利用の際には以下注意事項にご留意ください。</p>
                          <ol className="a-list">
                            <li>
                              1)
                              フィルタリングサービスはリスクを完全に除去するものではなく、保護者による利用状況の把握及び利用の管理が必要です。
                            </li>
                            <li>
                              2)
                              OSバージョンアップ等により、フィルタリングサービスが有効化されず、正しく機能されない場合やフィルタリングアプリをアンインストールできてしまう場合もございますので、保護者による利用状況の把握及び利用の管理が必要です。
                            </li>
                            <li>
                              3)
                              ご利用されるスマートフォンによっては、フィルタリングアプリをアンインストールできてしまう場合もございますので、保護者による利用状況の把握及び利用の管理が必要です。
                            </li>
                          </ol>
                        </div>
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

export default connect(mapStateToProps)(Option)
