// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../assets/css/common.css'

// IMPORT CONST FILE
import * as Const from '../../Const.js'

// IMPORT IMAGES
import GuidePic_01_sp from '../assets/images/guide_pic_01_sp.png'
import GuidePic_01_pc from '../assets/images/guide_pic_01_pc.png'
import GuidePic_02_sp from '../assets/images/guide_pic_02_sp.png'
import GuidePic_02_pc from '../assets/images/guide_pic_02_pc.png'
import GuidePic_03_sp from '../assets/images/guide_pic_03_sp.png'
import GuidePic_03_pc from '../assets/images/guide_pic_03_pc.png'
import GuidePic_04_sp from '../assets/images/guide_pic_04_sp.png'
import GuidePic_04_pc from '../assets/images/guide_pic_04_pc.png'
import GuidePic_05_sp from '../assets/images/guide_pic_05_sp.png'
import GuidePic_05_pc from '../assets/images/guide_pic_05_pc.png'
import GuidePic_06_sp from '../assets/images/guide_pic_06_sp.png'
import GuidePic_06_pc from '../assets/images/guide_pic_06_pc.png'
import GuidePic_07_sp from '../assets/images/guide_pic_07_sp.png?v=201909041100'
import GuidePic_07_pc from '../assets/images/guide_pic_07_pc.png?v=201909041100'
import GuidePic_08_sp from '../assets/images/guide_pic_08_sp.png'
import GuidePic_08_pc from '../assets/images/guide_pic_08_pc.png'
import GuidePic_09_sp from '../assets/images/guide_pic_09_sp.png'
import GuidePic_09_pc from '../assets/images/guide_pic_09_pc.png'
import GuidePic_10_sp from '../assets/images/guide_pic_10_sp.png'
import GuidePic_10_pc from '../assets/images/guide_pic_10_pc.png'
import GuidePic_11_sp from '../assets/images/guide_pic_11_sp.png'
import GuidePic_11_pc from '../assets/images/guide_pic_11_pc.png'
import GuidePic_12_sp from '../assets/images/guide_pic_12_sp.png?v=201909041100'
import GuidePic_12_pc from '../assets/images/guide_pic_12_pc.png?v=201909041100'
import GuidePic_13_sp from '../assets/images/guide_pic_13_sp.png'
import GuidePic_13_pc from '../assets/images/guide_pic_13_pc.png'
import GuidePic_14_sp from '../assets/images/guide_pic_14_sp.png'
import GuidePic_14_pc from '../assets/images/guide_pic_14_pc.png'
import GuidePic_15_sp from '../assets/images/guide_pic_15_sp.png'
import GuidePic_15_pc from '../assets/images/guide_pic_15_pc.png'
import GuidePic_45_sp from '../assets/images/guide_pic_45_sp.png'
import GuidePic_45_pc from '../assets/images/guide_pic_45_pc.png'
import GuidePic_46_sp from '../assets/images/guide_pic_46_sp.png'
import GuidePic_46_pc from '../assets/images/guide_pic_46_pc.png'
import GuidePic_47_sp from '../assets/images/guide_pic_47_sp.png'
import GuidePic_47_pc from '../assets/images/guide_pic_47_pc.png'
import GuidePic_48_sp from '../assets/images/guide_pic_48_sp.png'
import GuidePic_48_pc from '../assets/images/guide_pic_48_pc.png'
import GuidePic_49_sp from '../assets/images/guide_pic_49_sp.png'
import GuidePic_49_pc from '../assets/images/guide_pic_49_pc_358pix.png'
import GuidePic_50_pc from '../assets/images/guide_pic_50_pc.png'
import GuidePic_50_sp from '../assets/images/guide_pic_50_sp.png'
import GuidePic_51_pc from '../assets/images/guide_pic_51_pc.png'
import GuidePic_51_sp from '../assets/images/guide_pic_51_sp.png'
import GuidePic_52_pc from '../assets/images/guide_pic_52_pc.png'
import GuidePic_52_sp from '../assets/images/guide_pic_52_sp.png'
import GuidePic_53_pc from '../assets/images/guide_pic_53_pc.png'
import GuidePic_53_sp from '../assets/images/guide_pic_53_sp.png'
import GuidePic_54_pc from '../assets/images/guide_pic_54_pc.png'
import GuidePic_54_sp from '../assets/images/guide_pic_54_sp.png'
import GuidePic_55_pc from '../assets/images/guide_pic_55_pc.png'
import GuidePic_55_sp from '../assets/images/guide_pic_55_sp.png'
import GuidePic_56_pc from '../assets/images/guide_pic_56_pc.png'
import GuidePic_56_sp from '../assets/images/guide_pic_56_sp.png'
import GuidePic_57_pc from '../assets/images/guide_pic_57_pc.png'
import GuidePic_57_sp from '../assets/images/guide_pic_57_sp.png'
import GuidePic_58_pc from '../assets/images/guide_pic_58_pc.png'
import GuidePic_58_sp from '../assets/images/guide_pic_58_sp.png'
import GuidePic_59_pc from '../assets/images/guide_pic_59_pc.png'
import GuidePic_59_sp from '../assets/images/guide_pic_59_sp.png'
import GuidePic_60_pc from '../assets/images/guide_pic_60_pc.png'
import GuidePic_60_sp from '../assets/images/guide_pic_60_sp.png'
import GuidePic_61_pc from '../assets/images/guide_pic_61_pc.png'
import GuidePic_61_sp from '../assets/images/guide_pic_61_sp.png'
import GuidePic_62_pc from '../assets/images/guide_pic_62_pc.png'
import GuidePic_62_sp from '../assets/images/guide_pic_62_sp.png'
import GuidePic_63_pc from '../assets/images/guide_pic_63_pc.png'
import GuidePic_63_sp from '../assets/images/guide_pic_63_sp.png'
import GuidePic_64_pc from '../assets/images/guide_pic_64_pc.png'
import GuidePic_64_sp from '../assets/images/guide_pic_64_sp.png'
import GuidePic_65_pc from '../assets/images/guide_pic_65_pc.png'
import GuidePic_65_sp from '../assets/images/guide_pic_65_sp.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../ComponentBase.js'

// IMPORT MODULES
import Header from '../../modules/Header.js'

class Guide extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
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
      anchorName:
        props.history.location.state !== undefined
          ? props.history.location.state.anchorName
          : '',
    }
  }

  componentDidMount() {
    this.goTop()
    // if(window.customerId === undefined) return;
    document.title = Const.TITLE_GUIDE
    if (this.state.anchorName) {
      // アンカー指定があれば該当箇所までスクロール
      setTimeout(
        function () {
          this.scrollToItem(this.state.anchorName)
        }.bind(this),
        0
      )
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/merge_voice') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/2fa') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/merge_data') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/separate') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }
  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
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
                    <li className="m-breadcrumb_item">マイページご利用方法</li>
                  </ol>
                  <h1 className="a-h1 a-mb-0 a-mb-pc-25">
                    マイページご利用方法
                  </h1>
                  <div className="t-inner_full">
                    <div className="m-box-border">
                      <ul className="m-anchor">
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a1"
                            onClick={(e) => this.scrollToItem('#a1')}
                          >
                            <span>ログイン方法について</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a2"
                            onClick={(e) => this.scrollToItem('#a2')}
                          >
                            <span>データ通信残容量の見方</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a7"
                            onClick={(e) => this.scrollToItem('#a7')}
                          >
                            <span>
                              タイプ1 SIMの高速データ通信容量の消費について
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a3"
                            onClick={(e) => this.scrollToItem('#a3')}
                          >
                            <span>高速データ通信容量を追加する方法</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a4"
                            onClick={(e) => this.scrollToItem('#a4')}
                          >
                            <span>高速データ通信を切り替える方法</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a5"
                            onClick={(e) => this.scrollToItem('#a5')}
                          >
                            <span>完了通知を受け取る方法</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a6"
                            onClick={(e) => this.scrollToItem('#a6')}
                          >
                            <span>プランを変更する方法</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a13"
                            onClick={(e) => this.scrollToItem('#a13')}
                          >
                            <span>オプションの追加・廃止・変更をする方法</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a14"
                            onClick={(e) => this.scrollToItem('#a14')}
                          >
                            <span>
                              登録情報変更（改姓・改名・電話番号、住所変更・名義変更（譲渡）・継承）申請について
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a15"
                            onClick={(e) => this.scrollToItem('#a15')}
                          >
                            <span>
                              SIMカードの再発行・サイズ変更のお申込み方法
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a16"
                            onClick={(e) => this.scrollToItem('#a16')}
                          >
                            <span>シェア回線の追加契約について</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a8"
                            onClick={(e) => this.scrollToItem('#a8')}
                          >
                            <span>お客さまIDを統合・分離する方法について</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a9"
                            onClick={(e) => this.scrollToItem('#a9')}
                          >
                            <span>
                              ご登録クレジットカードの変更申し込み方法
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a10"
                            onClick={(e) => this.scrollToItem('#a10')}
                          >
                            <span>MNP予約番号の発行方法について</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a11"
                            onClick={(e) => this.scrollToItem('#a11')}
                          >
                            <span>
                              MNP予約番号発行のお申込みにあたっての注意事項
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a12"
                            onClick={(e) => this.scrollToItem('#a12')}
                          >
                            <span>解約のお手続きについて</span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a17"
                            onClick={(e) => this.scrollToItem('#a17')}
                          >
                            <span>マイページ操作履歴について</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="t-inner_wide">
                    <div className="m-guide" id="a1">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          ログイン方法について
                        </h2>
                        <h3 className="a-h4">
                          お客さまIDを都度入力せずに、ログインができます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ログイン画面でお客さまIDを入力し、「お客さまIDを保持する」にチェックを入れ、ログインすると、次回からお客さまIDが入力された状態になります。
                            </p>
                            <p className="a-fs-sm">
                              ※他の端末からログインする場合は、お客さまIDを再度入力する必要があります。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_01_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_01_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">
                          メールアドレスや外部サービス（YahooやFacebook）のIDを使用しログインすることが出来ます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              メールアドレスでログインしたい場合は、メニューの「お客さま情報（ログイン設定）」でメールアドレスを登録し、「このメールアドレスをログインで使用する」にチェックを入れてください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_02_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_02_pc}
                                alt=""
                              />
                            </p>
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_03_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_03_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a2">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          データ通信残容量の見方
                        </h2>
                        <h3 className="a-h4">
                          TOPページのグラフで、当月のデータ通信容量が確認できます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_04_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_04_pc}
                                alt=""
                              />
                            </p>
                          </div>
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li>
                                残りのデータ通信容量を数字で確認できます。
                              </li>
                              <li>
                                当月分の契約データ通信容量を確認できます。
                              </li>
                              <li>
                                データの残り容量を円グラフで確認できます。
                              </li>
                              <li>
                                前月繰越・当月追加のデータ容量がある場合にグラフが表示されます。
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a7">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          タイプ1 SIMの高速データ通信容量の消費について
                        </h2>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_14_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_14_pc}
                                alt=""
                              />
                            </p>
                          </div>
                          <div className="m-guide_media_body">
                            <p>
                              タイプ1 SIMの高速データ通信容量の消費については
                              <br />
                              残容量から0.01GB（10MB）単位でSIMカードに割り当てを行い、ご利用状況に応じ消費されます。
                            </p>
                            <p>
                              そのため残容量表示については0.01GB（10MB）単位で表示が変化いたします。
                            </p>
                            <p>
                              また、状況により、ご利用回線数×0.01GB（10MB）前後の表示誤差がある場合がございます。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a3">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          高速データ通信容量を追加する方法
                        </h2>
                        <h3 className="a-h4">
                          残り高速データ通信容量が少なくなったり、無くなった場合に追加できます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              TOPページの「高速データ通信容量追加」ボタンを押し、注意文章をご確認の上「同意します」にチェックを入れて、「容量を追加する」ボタンを押してください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_05_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_05_pc}
                                alt=""
                              />
                            </p>
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_06_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_06_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a4">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          高速データ通信を切り替える方法
                        </h2>
                        <h3 className="a-h4">
                          高速データ通信を使用しないときに、低速通信に切り替えられます。また、高速通信を使用する際は再度切り替えられます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              TOPページのSIMカードから、高速データ通信の「変更」ボタンを押し、「データ通信速度を切り替える」ボタンを押してください。
                              <br />
                              再開する場合は同じ手順で「データ通信速度を切り替える」ボタンを押してください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_07_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_07_pc}
                                alt=""
                              />
                            </p>
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_08_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_08_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a5">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          完了通知を受け取る方法
                        </h2>
                        <h3 className="a-h4">
                          メールアドレスを登録しておくと、ご利用明細の準備が整った際や、プランの変更、お客さま情報の変更等があった際にメールでご連絡いたします。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              メニューから「完了通知」画面に入り、各種完了通知書の受け取り方法から「メールで通知」を選択し、「受け取り方法を変更する」ボタンを押します。
                              <br />
                              受け取り方法を選択したら、「変更する」ボタンを押してください。
                            </p>
                            <p className="a-fs-sm">
                              ※メールで通知するためには事前にメールアドレスを登録してください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_09_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_09_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a6">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          プランを変更する方法
                        </h2>
                        <h3 className="a-h4">ご利用プランの変更ができます。</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              TOPページの「料金プラン変更手続き」を押してください。
                              <br />
                              プラン一覧から変更したいプランを選び、注意文章に同意の上、「上記内容で申し込む」ボタンを押してください。
                              <br />
                              <br />
                            </p>
                            <p className="a-fs-sm">
                              ※一覧に表示されていないプランへの変更（プランの種別を跨ぐ変更）をご希望の場合は、
                              <a
                                href="#a6_2"
                                onClick={(e) => this.scrollToItem('#a6_2')}
                              >
                                <span className="m-guide_emp">こちら</span>
                              </a>
                              をタップしてご確認ください。
                              <br />
                              <br />
                            </p>
                            <p className="a-fs-sm">
                              ※プラン変更の受付時間について
                              <br />
                              毎月末日の前日18:59までプラン変更が可能です。
                              <br />
                              <br />
                            </p>
                            <p className="a-fs-sm">
                              ※プラン変更の取り消しについて
                              <br />
                              申込日によって取り消し可能日が異なります。
                              <br />
                              ①毎月末日の前々日までに申し込まれた場合、前々日18:59まで取り消しが可能です。
                              <br />
                              ②毎月末日の前日に申し込まれた場合、同日18:59まで取り消しが可能です。
                              <br />
                              <br />
                            </p>
                            <p className="a-fs-sm">
                              ※取り消し日を過ぎた場合は、プラン変更が確定します。
                              <br />
                              プラン変更確定後に改めてプラン変更手続きをされた場合は、翌々月の適用となります。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_10_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_10_pc}
                                alt=""
                              />
                            </p>
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_11_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_11_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 id="a6_2" className="a-h4">
                          一覧に表示されていないプランへの変更（プランの種別を跨ぐ変更）をご希望の場合は
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  「上記以外のプランへの変更をご希望の方はこちら」ボタンを押してください。
                                  <br />
                                  変更したいプランを選び、注意文章に同意の上、「上記内容で申し込む」ボタンを押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_53_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_53_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  音声プランからシェア音声プランなど、プランの種別を跨ぐ変更を含む場合、毎月末日の前日の17:59までプランの変更と取り消しができます。
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  但し、月末日の前々日18:59までに変更を申し込まれた方は、その申し込みが適用される翌月１日までプランの変更ができなくなります。
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※毎月月末の前日18:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※ご利用中のプランにより変更に制限や条件がある場合があります。また、変更をご希望のプランにより、ご利用に条件やお客さま情報を追加でご申告いただく必要がある場合があります。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_54_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_54_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a13">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          オプションを加入・廃止する方法
                        </h2>
                        <h3 className="a-h4">
                          翌月のご利用オプションの追加や廃止ができます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  TOPページのSIMカードから、オプションを加入・廃止したい電話番号を押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_12_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_12_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  選択した電話番号の回線情報が表示されますので、画面下部にある「オプションサービス」の欄にある「変更する」ボタンを押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_55_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_55_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  オプション選択画面で、新たに加入したいオプションを選択したり、廃止したいオプションを選択できます。
                                  <br />
                                  選択が完了したら、「上記内容で申し込む」を押します。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_56_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_56_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <div
                            className="decimal_none"
                            style={{ marginBottom: '1em' }}
                          >
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p className="a-fs-sm">
                                  ※加入中のオプションは、右図のように青色で表示され、「廃止」ボタンが表示されます。{' '}
                                  <br />
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※「廃止」ボタンを押すと、「廃止」ボタンは「キャンセル」ボタンに変わり、「廃止予定」となります。
                                  <br />
                                  廃止を取り消したい場合は、「キャンセル」ボタンを押してください。
                                  <br />
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※追加したいオプションを選択すると右図のように緑色に変わり、「加入予定」となります。
                                  <br />
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※お客さまがご契約・ご利用状況により、追加いただけないオプションがある場合は、右図のようにグレーで「加入不可」と表示されます。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_57_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_57_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </div>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  確認画面で、選択したオプションの確認を行い、「申し込む」を押します。
                                  <br />
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※お申し込みが反映されるまで数日かかる場合がございます。
                                  <br />
                                  また、何らかのエラーによりお申し込みが正常に完了しなかった場合には、ご登録のメールアドレス宛にご連絡しますので、ご確認ください。
                                  <br />
                                  お申し込みの状況については、
                                  <a
                                    href="#a17"
                                    onClick={(e) => this.scrollToItem('#a17')}
                                  >
                                    <span className="m-guide_emp">
                                      マイページ操作履歴
                                    </span>
                                  </a>
                                  よりご確認頂けます。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_58_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_58_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                        <ol className="a-list">
                          <li style={{ marginBottom: '1em' }}>
                            <h3 className="a-h4" style={{ marginBottom: 0 }}>
                              〈かけ放題オプションをご利用のお客さまへ〉
                            </h3>
                            <p>
                              ※いずれかのかけ放題オプションをご利用中で、別のかけ放題オプションへの変更、または廃止をお申し込みの場合は、変更・廃止のお申し込み日にかかわらず当月中はご利用中のかけ放題オプションが継続します。
                            </p>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <p className="a-fs-sm">
                              ※別のかけ放題オプションへの変更をお申し込みの場合は、翌月1日から新しいかけ放題サービスに切換ります。
                            </p>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <p className="a-fs-sm">
                              ※毎月末日の前日の18:59まで、かけ放題オプションの追加・廃止のお申し込みが可能です。
                              <br />
                              但し、月末日の前々日18:59までに追加・廃止を申し込まれた方は、その申し込みが適用される翌月１日までかけ放題オプションの追加・廃止ができなくなります。
                            </p>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <p className="a-fs-sm">
                              ※毎月末日の前日19:00以降のかけ放題オプションの追加・廃止のお申し込みについては、翌々月の適用となりますのでご注意ください。
                            </p>
                          </li>
                          <li>
                            <h3 className="a-h4" style={{ marginBottom: 0 }}>
                              〈その他のオプションをご利用のお客さまへ〉
                            </h3>
                            <p className="a-fs-sm">
                              ※毎月末日の前日の18:59まで、オプションの追加・廃止のお申し込みが可能です。
                              <br />
                              ※毎月末日の前日19:00以降のオプションの追加・廃止のお申し込みについては、翌々月の適用となりますのでご注意ください。
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a14">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          登録情報変更（改姓・改名・電話番号、住所変更・名義変更（譲渡）・承継）お申し込み
                        </h2>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  メニューの「お客さま情報（ログイン設定）」から「お客さま情報/ログイン設定」画面に行き、お客さま情報の「変更を申請する」ボタンを押します。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_59_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_59_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  変更のお申し込みを行いたい項目を選択し、それぞれの入力フォームからお申し込みを行なってください。
                                </p>
                                <p className="a-fs-sm">
                                  ※お申し込みが反映されるまで数日かかる場合がございます。
                                  <br />
                                  また、何らかのエラーによりお申し込みが正常に完了しなかった場合には、ご登録のメールアドレス宛にご連絡しますので、ご確認ください。
                                  <br />
                                  お申し込みの状況については、
                                  <a
                                    href="#a17"
                                    onClick={(e) => this.scrollToItem('#a17')}
                                  >
                                    <span className="m-guide_emp">
                                      マイページ操作履歴
                                    </span>
                                  </a>
                                  よりご確認頂けます。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_60_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_60_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a15">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          SIMカードの再発行・サイズ変更のお申し込み方法
                        </h2>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  TOPページのSIMカードから、SIMカードの再発行、サイズ変更を行いたい電話番号を押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_12_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_12_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  選択した電話番号の回線情報が表示されますので、画面中央部にある「SIM」の欄にある「SIMカード再発行・サイズ変更」ボタンを押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_61_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_61_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  注意事項に同意し、希望のSIMサイズを選択してください。
                                  <br />
                                  <span style={{ color: '#b50080' }}>
                                    配送先の住所に間違いがないか必ず確認し、
                                    <span className="m-guide_number">4</span>
                                    「申し込む」お押してください。
                                  </span>
                                </p>
                                <div style={{ marginLeft: '-25px' }}>
                                  <div className="m-box-important">
                                    <h4 className="m-box-important_label">
                                      重要
                                    </h4>
                                    <p>
                                      ※SIMカードは現在のご契約住所（表示されている住所）にお届けします。法令の定めにより、ご契約住所以外へのお届け・転送はできません。現在のご住所と異なる住所が表示されている場合は、必ず先に住所変更をしてからあらためてお申し込みください。
                                      <br />
                                      <br />
                                    </p>
                                  </div>
                                  <p className="a-fs-sm">
                                    ※住所変更のお申し込み方法については、
                                    <a
                                      href="#a14"
                                      onClick={(e) => this.scrollToItem('#a14')}
                                    >
                                      <span className="m-guide_emp">
                                        こちら
                                      </span>
                                    </a>
                                    をご確認ください。
                                    <br />
                                    <br />
                                  </p>
                                  <p className="a-fs-sm">
                                    ※お申し込みが反映されるまで数日かかる場合がございます。
                                    <br />
                                    また、何らかのエラーによりお申し込みが正常に完了しなかった場合には、ご登録のメールアドレス宛にご連絡しますので、ご確認ください。
                                    <br />
                                    お申し込みの状況については、
                                    <a
                                      href="#a17"
                                      onClick={(e) => this.scrollToItem('#a17')}
                                    >
                                      <span className="m-guide_emp">
                                        マイページ操作履歴
                                      </span>
                                    </a>
                                    よりご確認頂けます。
                                  </p>
                                </div>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_62_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_62_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a16">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          シェア回線の追加契約について
                        </h2>
                        <h3 className="a-h4">
                          シェアプランをご利用中の場合、シェア回線の追加をお申し込みいただけます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li>
                                <p>
                                  ご契約中のプランがシェアプランの場合、トップページに「シェア回線を追加する」ボタンが表示されます。
                                  このボタンを押して、お手続きにお進みください。
                                  <br />
                                  <br />
                                </p>
                                <p className="a-fs-sm">
                                  ※シェアプラン以外をご契約中の場合、先にシェアプランへの変更をお申し込みください。そのお申し込みが適用される翌月1日以降に、シェア回線の追加のお申し込みが可能となります。
                                  <br />
                                  プラン変更については
                                  <a
                                    href="#a6"
                                    onClick={(e) => this.scrollToItem('#a6')}
                                  >
                                    <span className="m-guide_emp">こちら</span>
                                  </a>
                                  をご確認ください。
                                </p>
                              </li>
                            </ol>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_63_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_63_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a8">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          お客さまIDを統合・分離する方法について
                        </h2>
                        <h3 className="a-h4">
                          複数回線をご契約のお客さまは、お客さまIDのログイン統合をしておくことで、1回のログインで複数のお客さま情報を切り替えて確認できます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_15_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_15_pc}
                                alt=""
                              />
                            </p>
                          </div>
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li style={{ marginBottom: '1em' }}>
                                音声・シェア音声・SMS付きデータ回線（お客さまID【B】）をお客さまID【A】に統合する方法は
                                <a
                                  href=""
                                  onClick={(e) =>
                                    this.goNextDisplay(e, '/guide/merge_voice')
                                  }
                                >
                                  <span className="m-guide_emp">こちら</span>
                                </a>
                                をタップして確認してください
                              </li>
                              <li style={{ marginBottom: '1em' }}>
                                <p>
                                  データ回線（お客さまID【B】）をお客さまID【A】に統合する方法は
                                  <a
                                    href=""
                                    onClick={(e) =>
                                      this.goNextDisplay(e, '/guide/merge_data')
                                    }
                                  >
                                    <span className="m-guide_emp">こちら</span>
                                  </a>
                                  をタップして確認してください
                                </p>
                                <p>
                                  ※データ回線を統合される方は事前準備が必要となります
                                </p>
                                <a
                                  className="m-guide_link_box"
                                  href=""
                                  onClick={(e) =>
                                    this.goNextDisplay(e, '/guide/2fa')
                                  }
                                >
                                  事前に準備する方法は
                                  <span className="m-guide_emp">こちら</span>
                                  をタップして確認してください
                                </a>
                              </li>
                              <li>
                                統合したログインIDを分離する方法は
                                <a
                                  href=""
                                  onClick={(e) =>
                                    this.goNextDisplay(e, '/guide/separate')
                                  }
                                >
                                  <span className="m-guide_emp">こちら</span>
                                </a>
                                をタップして確認してください
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a9">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          ご登録クレジットカードの変更申し込み方法
                        </h2>
                        <h3 className="a-h4">
                          現在ご登録頂いているクレジットカード情報の変更申し込みが出来ます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li>
                                メニューの「お客さま情報（ログイン設定）」からお支払い方法の変更の「クレジットカード変更手続き」をタップします。
                                <br />
                                ※クレジットカード情報を登録する外部サイトが開きます。
                                <br />
                                ※毎月10日20時までに変更申し込みを完了すると前月分の利用料金の引き落としに間に合いますが、毎月10日20時以降の変更に関しましては、翌月からの変更になる場合がございます。
                              </li>
                            </ol>
                            <div className="m-box-important">
                              <h4 className="m-box-important_label">重要</h4>
                              <p>
                                カードの有効期限切れやそれ以外の理由でクレジットカードからご利用料金の引き落としができなかった場合には、マイページのトップページに決済エラーが表示されますので、クレジットカードの変更申し込みからお手続きをお願いします。
                                <br />
                                お手続き後、決済エラーが解消するまでに最大15日程度お時間がかかる場合がございます。
                                <br />
                                尚、クレジットカードの変更、ご登録いただきましても、決済日にご利用料金のお支払いが頂けなかった場合、決済エラーが継続いたします。その場合、あらためて別のクレジットカードへの変更手続きをお願いいたします。
                              </p>
                            </div>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_45_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_45_pc}
                                alt=""
                              />
                            </p>
                            <div style={{ fontSize: '1.4rem' }}>
                              <p
                                style={{
                                  fontWeight: 'bold',
                                  marginBottom: '10px',
                                }}
                              >
                                ※ご注意
                              </p>
                              <p>
                                毎月 26日23:30 ～ 27日9:30
                                の間はシステムメンテナンスのため、ご利用いただけません。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a10">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          MNP予約番号を発行する方法
                        </h2>
                        <h3 className="a-h4">
                          イオンモバイルから他社さまへ転出する際に、MNP（携帯電話番号ポータビリティ）転出をご希望の場合には、MNP予約番号が必要になります。MNP予約番号は、マイページから発行のお申し込みができます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  マイページのトップページから、MNP転出を行う電話番号をクリックします。
                                </p>
                                <p className="a-fs-sm">
                                  ※シェアプランをご契約の方は、SIMカードに複数の回線が表示されますので、MNP転出を行う該当の電話番号をクリックしてください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_46_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_46_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  選択した電話番号の回線情報が表示されますので、画面下部にある「MNP予約番号発行申込」ボタンを押してください。
                                </p>
                                <div className="a-fs-sm">
                                  ※以下に該当する方は、MNP予約番号の発行申込が行えませんので、ご注意ください。
                                  <ul>
                                    <li>強制停止中</li>
                                    <li>解約申請中</li>
                                    <li>未払いがある方</li>
                                    <li>シェア回線追加中の方</li>
                                  </ul>
                                </div>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_47_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_47_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  MNP予約番号発行申込に関する注意事項が表示されますので、内容をご確認の上、画面下部にある「MNP注意事項について同意します」にチェックを入れ、「MNP予約番号発行を申し込む」を押してください。
                                </p>
                                <p className="a-fs-sm">
                                  ※発行されたMNP予約番号の確認は、マイページの「MNP予約番号発行申込」欄に記載されますので、お客さまご自身でご確認下さい。
                                </p>
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_48_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_49_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_49_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_48_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a11">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          MNP予約番号発行のお申込みにあたっての注意事項
                        </h2>
                        <h3 className="a-h4">MNP転出をご希望のお客さまへ</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li style={{ marginBottom: '1em' }}>
                                <p>
                                  MNP予約番号は、当日8時00分までの申請で、同日23時00分に発行され、当該日（発行日）を含む15日間が有効期限です。
                                </p>
                                <ul>
                                  <li>
                                    当日8時00分以降の申請は、翌日23時00分に発行されます。
                                  </li>
                                  <li>
                                    NTTドコモまたはauのシステムメンテナンスなどにより発行が遅れる場合があります。
                                  </li>
                                  <li>
                                    MNPの手続きが混雑した場合、発行が2～3日後にずれ込むことがあります。
                                  </li>
                                </ul>
                              </li>
                              <li style={{ marginBottom: '1em' }}>
                                <p>
                                  発行されたMNP予約番号の確認は、マイページの「MNP予約番号発行申込み」欄に記載されますので、お客さまご自身でご確認下さい。また、予約番号発行後に、ご登録いただいたメールアドレスもしくはご契約の電話番号宛にSMSで送信させていただきます。
                                </p>
                              </li>
                              <li>
                                <p>
                                  お申し込み後のキャンセルはできません。
                                  <br />
                                  MNP予約番号が発行された場合でも、15日以内にMNP転出されなかった場合、MNP予約番号は自動的に無効となります。
                                </p>
                              </li>
                              <li>
                                <p>
                                  MNP予約番号の発行申請後は、MNP予約番号の有効期限翌日まで、以下がお手続きいただけませんのでご注意下さい。
                                </p>
                                <ol>
                                  <li>プラン変更手続き</li>
                                  <li>情報変更手続き</li>
                                  <li>解約手続き</li>
                                  <li>MNP予約番号の再発行</li>
                                  <li>
                                    かけ放題サービスの変更手続き（例：5分かけ放題からフルかけ放題への変更）
                                  </li>
                                  <li>SIMカードの再発行・サイズ変更</li>
                                </ol>
                              </li>
                              <li>
                                <p>
                                  かけ放題サービスの変更手続きを申請されている状態で、MNP転出予約を申請された場合、かけ放題サービスの翌月変更手続きが無効となります。MNP転出されない場合でも、翌月のかけ放題サービスの変更は適用されず、翌々月からの適用となりますので、ご注意下さい。
                                </p>
                              </li>
                              <li>
                                <p>
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
                                </p>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">
                          シェア音声プランをご契約のお客さまへ
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ol className="a-list-decimal">
                              <li style={{ marginBottom: '1em' }}>
                                シェア音声プランご契約で複数のSIMカードをご利用のお客さまにつきましては、申込みいただいた電話番号をMNP転出された場合でも、他の回線が残っているため、シェア音声プランは継続されます。そのため、自動的には、シェア音声プランは解約されません。
                              </li>
                              <li style={{ marginBottom: '1em' }}>
                                シェア音声プラン自体の解約をご希望の場合は、お手数をおかけしますが、MNP転出後に、お客さまご自身で解約手続きを行っていただきますようお願いします。解約手続きは、イオンモバイルお客さまセンターもしくは店頭にてお申込みいただけます。
                              </li>
                              <li style={{ marginBottom: '1em' }}>
                                （音声単独プランへ変更をご検討、ご希望されるお客さまへ）MNP転出日やその他シェア内の解約回線の関係上、プラン変更が翌々月になる場合がございます。
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a12">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          解約のお手続きについて
                        </h2>
                        <h3 className="a-h4">
                          マイページから解約のお手続きができます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  メニューの「お客さま情報（ログイン設定）」から解約のお申し込みの「解約手続き」をタップします。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_50_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_50_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  解約手続きの画面で、ご契約中の回線が表示されますので、解約する回線を選択し、注意事項をご一読頂き、それぞれの項目に対して「確認しました」にチェックを入れ、「解約を申し込む」をクリックします。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_51_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_51_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  解約すると解約のキャンセルが出来ない為
                                  <br />
                                  最後に最終確認画面が表示されます。
                                  <br />
                                  最終確認画面に、解約対象のいずれかのお電話番号を入力し、「解約を申し込む」をクリックするとお申し込みが完了となります。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_52_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_52_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    <div className="m-guide" id="a17">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          マイページ操作履歴について
                        </h2>
                        <h3 className="a-h4">
                          マイページの操作や各種お申し込みの履歴や状態が確認できます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <ol className="a-list-decimal">
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p className="a-sp">
                                  メニューの「マイページ操作履歴」を押します。
                                </p>
                                <p className="a-pc">
                                  トップページの下方にある「マイページ操作履歴」を押してください。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_64_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_64_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                          <li style={{ marginBottom: '1em' }}>
                            <div className="m-guide_media">
                              <div className="m-guide_media_body">
                                <p>
                                  マイページで行った操作履歴の一覧が表示されます。
                                </p>
                                <p className="a-fs-sm">
                                  ※「状態」が「エラー」となっているものについては、何らかの理由によりお申し込みが正常に完了しておりません。
                                  <br />
                                  ご登録のメールアドレス宛にお申し込み状況をご連絡させていただいておりますので、内容をご確認のうえあらためてお申し込みをお願いいたします。
                                </p>
                              </div>
                              <div className="m-guide_media_pic">
                                <p>
                                  <img
                                    className="a-sp"
                                    src={GuidePic_65_sp}
                                    alt=""
                                  />
                                  <img
                                    className="a-pc"
                                    src={GuidePic_65_pc}
                                    alt=""
                                  />
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
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

export default connect(mapStateToProps)(Guide)
