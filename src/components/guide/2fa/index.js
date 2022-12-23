// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT IMAGES
import GuidePic_37_sp from '../../assets/images/guide_pic_37_sp.png'
import GuidePic_37_pc from '../../assets/images/guide_pic_37_pc.png'
import GuidePic_38_sp from '../../assets/images/guide_pic_38_sp.png'
import GuidePic_38_pc from '../../assets/images/guide_pic_38_pc.png'
import GuidePic_39_sp from '../../assets/images/guide_pic_39_sp.png'
import GuidePic_39_pc from '../../assets/images/guide_pic_39_pc.png'
import GuidePic_40_sp from '../../assets/images/guide_pic_40_sp.png'
import GuidePic_40_pc from '../../assets/images/guide_pic_40_pc.png'
import GuidePic_41_sp from '../../assets/images/guide_pic_41_sp.png'
import GuidePic_41_pc from '../../assets/images/guide_pic_41_pc.png'
import GuidePic_42_sp from '../../assets/images/guide_pic_42_sp.png'
import GuidePic_42_pc from '../../assets/images/guide_pic_42_pc.png'
import GuidePic_43_sp from '../../assets/images/guide_pic_43_sp.png'
import GuidePic_43_pc from '../../assets/images/guide_pic_43_pc.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Guide_2fa extends ComponentBase {
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
  }

  goNextDisplay(e, url, params, lineNo) {
    e.preventDefault()
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/merge_data') {
      if (lineNo) {
        params.anchorName = lineNo
      }
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
                    <li className="m-breadcrumb_item">
                      <a
                        href=""
                        onClick={(e) => this.goNextDisplay(e, '/guide/')}
                      >
                        マイページご利用方法
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">２段階認証について</li>
                  </ol>
                  <h1 className="a-h1 a-mb-pc-25">２段階認証について</h1>
                  <div className="t-inner_wide">
                    <div className="m-guide">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          &#9315;２段階認証の設定方法について
                        </h2>
                        <h3 className="a-h4">
                          データ回線での認証に関しては、２段階認証（Google
                          Authenticator）による認証コードの払い出しが必要です。
                        </h3>
                      </div>
                      <div className="m-guide_body" />
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9315; - 1</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ID統合の手続きの前に、統合先アカウント（お客さまID【B】）による認証コードの払い出しが必要です。
                            </p>
                            <p>
                              まずは、統合先アカウント（お客さまID【B】）のお客さまマイページへログイン頂き、「お客さま情報（ログイン設定）」を選択下さい。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_37_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_37_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">
                          &#9315; - 2{' '}
                          <span className="a-pc">
                            ※ここからは、スマートフォンで実施頂くとスムーズです。
                          </span>
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              「お客さま情報（ログイン設定）」ページの下部にある「◎お客さまID統合時の２段階認証設定について（データ〔SMSなし〕回線契約専用）」を確認下さい。
                            </p>
                            <ol className="a-list-decimal upper-alpha">
                              <li>
                                Google
                                Authenticatorアプリがインストールされている場合は、「Google
                                Authenticator連携はこちら」をタップ（クリック）し、「&#9313;
                                - 4」にお進み下さい。
                                <a
                                  className="m-guide_link_box"
                                  href=""
                                  onClick={(e) =>
                                    this.goNextDisplay(
                                      e,
                                      '/guide/merge_data',
                                      {},
                                      '#a4'
                                    )
                                  }
                                >
                                  <span className="m-guide_emp">
                                    &#9313; - 4
                                  </span>
                                  に進む
                                </a>
                              </li>
                              <li>
                                同アプリがインストールされていない場合は、アイコンからアプリをダウンロードの上、インストールしてください。
                              </li>
                            </ol>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_38_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_38_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9315; - 3</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              Google
                              Authenticatorアプリをインストールいただくとスマートフォンのホーム画面もしくはアプリ一覧に、以下のようなアイコンが表示されます。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_39_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_39_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9315; - 4</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              Google
                              Authenticatorアプリのインストール完了後、統合先アカウント（お客さまID【B】）のお客さまマイページへログインし、「お客さま情報（ログイン設定）」の下部にある「Google
                              Authenticator連携はこちらから」をタップ（クリック）いただき、「開く」を選択します。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_40_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_40_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                        <div
                          className="m-guide_media"
                          style={{ paddingTop: '40px' }}
                        >
                          <div className="m-guide_media_body">
                            <p>
                              ※ダイアログが表示されない場合は、アプリのダウンロードが完了していない可能性がありますので、アプリがダウンロード出来ているかご確認ください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_41_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_41_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9315; - 5</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>Google Authenticatorが立ち上がります。</p>
                            <ol className="a-list-decimal upper-alpha">
                              <li>
                                iPhoneの場合は、【トークン「お客さまのID」を追加しますか？】と表示されるので、「はい」を選択します。
                              </li>
                              <li>
                                Androidの場合は、【キーを保存】と表示されるので、「OK」を選択します。
                              </li>
                            </ol>
                            <p className="a-pc">
                              ※PCでマイページにログインしている場合は表示されているQRコードを、Google
                              Authenticatorを起動して「バーコード読み取り」で読み込んでください
                            </p>
                            <p className="a-pc">
                              ※「Google
                              Authenticator連携はこちらから」を表示する毎に発行されるコードが変りますので、必ず最後に表示した登録コードをご利用ください
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_42_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_42_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9315; - 6</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ６桁の認証コードが表示されます。
                              <br />
                              認証コードの下に統合先アカウント（お客さまID【B】）のお客さまIDが表示されますので、間違いないかご確認ください。
                            </p>
                            <p>
                              ※６桁の認証コードは、一定時間で更新されますので、時間内に、「
                              <span className="m-guide_emp">&#9313; - 3</span>
                              」での案内の通り、認証コードを入力の認証手続きを完了下さい。
                            </p>
                            <ol className="a-list-decimal">
                              <li>認証コード</li>
                              <li>お客さまのID</li>
                              <li>有効期限の残り時間</li>
                            </ol>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_43_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_43_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="m-btn" style={{ marginTop: '2em' }}>
                    <a
                      className="a-btn-dismiss"
                      onClick={() => {
                        this.props.history.push('/guide/')
                      }}
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

export default connect(mapStateToProps)(Guide_2fa)
