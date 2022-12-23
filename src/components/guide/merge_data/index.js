// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT IMAGES
import GuidePic_24_sp from '../../assets/images/guide_pic_24_sp.png'
import GuidePic_24_pc from '../../assets/images/guide_pic_24_pc.png'
import GuidePic_25_sp from '../../assets/images/guide_pic_25_sp.png'
import GuidePic_26_sp from '../../assets/images/guide_pic_26_sp.png'
import GuidePic_26_pc from '../../assets/images/guide_pic_26_pc.png'
import GuidePic_27_sp from '../../assets/images/guide_pic_27_sp.png'
import GuidePic_27_pc from '../../assets/images/guide_pic_27_pc.png'
import GuidePic_28_sp from '../../assets/images/guide_pic_28_sp.png'
import GuidePic_28_pc from '../../assets/images/guide_pic_28_pc.png'
import GuidePic_29_sp from '../../assets/images/guide_pic_29_sp.png'
import GuidePic_29_pc from '../../assets/images/guide_pic_29_pc.png'
import GuidePic_30_sp from '../../assets/images/guide_pic_30_sp.png'
import GuidePic_30_pc from '../../assets/images/guide_pic_30_pc.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Guide_Merge_Data extends ComponentBase {
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
    } else if (url === '/guide/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/separate') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/guide/2fa') {
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
                    <li className="m-breadcrumb_item">
                      お客さまIDの統合方法について
                    </li>
                  </ol>
                  <h1 className="a-h1 a-mb-pc-25">
                    お客さまIDの統合方法について
                  </h1>
                  <div className="t-inner_wide">
                    <div className="m-guide">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          &#9313;ID統合方法について：
                          <br />
                          データ回線（お客さまID【B】）をお客さまID【A】に統合する方
                        </h2>
                        <h3 className="a-h4">
                          複数の契約を一つのIDとパスワードで管理出来ます。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              統合先（お客さまID【B】）での認証が必要となります。
                              <br />
                              事前に統合先アカウント（お客さまID【B】）のお客さまマイページへログイン頂き、「お客さま情報（ログイン設定）」より、２段階認証（Google
                              Authenticator)にて、認証コードの払い出しが必要です。
                            </p>
                            <p>
                              <a
                                className="m-guide_link"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(e, '/guide/2fa')
                                }
                              >
                                ２段階認証の設定方法はこちら
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9313; - 1</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              契約一覧から、「お客さまIDを統合する」をクリックする。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_24_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_24_pc}
                                alt=""
                              />
                            </p>
                            <p className="a-sp">
                              <img src={GuidePic_25_sp} alt="" />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9313; - 2</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              現在ログインしているご契約（お客さまID【A】）に対して、統合したいご契約（お客さまID【B】）のお客さまIDとパスワードを入力し、確認ボタンをクリックする。
                            </p>
                            <p>
                              ※２段階認証（Google
                              Authenticator）の設定がまだの方は、設定が必要です。
                            </p>
                            <p>
                              <a
                                className="m-guide_link"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(e, '/guide/2fa')
                                }
                              >
                                ２段階認証の設定方法はこちら
                              </a>
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_26_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_26_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9313; - 3</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ダイアログが表示されるので、下記の通り、２段階認証（Google
                              Authenticator）で生成された６桁のコードを入力し、「認証する」ボタンをタップ（クリック）します。
                            </p>
                            <p>
                              <a
                                className="m-guide_link"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(e, '/guide/2fa')
                                }
                              >
                                ２段階認証の設定方法はこちら
                              </a>
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_27_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_27_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div id="a4" className="m-guide_header">
                        <h3 className="a-h4">&#9313; - 4</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              統合が完了すると、統合完了の画面が表示されるので、「契約一覧へ」をクリックし、統合された状態を確認してください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_28_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_28_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9313; - 5</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              契約一覧に統合したご契約が追加されたことを確認します。
                              <br />
                              こちらで、契約の切り替えや分離ができます。
                            </p>
                            <p>
                              <a
                                className="m-guide_link"
                                href=""
                                onClick={(e) =>
                                  this.goNextDisplay(e, '/guide/separate')
                                }
                              >
                                分離についてはこちら
                              </a>
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_29_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_29_pc}
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
                              閲覧中に、ご契約情報を切り替える場合は、ヘッダーメニューの「契約一覧」から切り替えることができます。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_30_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_30_pc}
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

export default connect(mapStateToProps)(Guide_Merge_Data)
