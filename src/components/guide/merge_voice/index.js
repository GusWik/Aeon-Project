// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT IMAGES
import GuidePic_16_sp from '../../assets/images/guide_pic_16_pc.png'
import GuidePic_16_pc from '../../assets/images/guide_pic_16_sp.png'
import GuidePic_17_pc from '../../assets/images/guide_pic_17_sp.png'
import GuidePic_18_sp from '../../assets/images/guide_pic_18_pc.png'
import GuidePic_18_pc from '../../assets/images/guide_pic_18_sp.png'
import GuidePic_19_sp from '../../assets/images/guide_pic_19_pc.png'
import GuidePic_19_pc from '../../assets/images/guide_pic_19_sp.png'
import GuidePic_20_sp from '../../assets/images/guide_pic_20_pc.png'
import GuidePic_20_pc from '../../assets/images/guide_pic_20_sp.png'
import GuidePic_21_sp from '../../assets/images/guide_pic_21_pc.png'
import GuidePic_21_pc from '../../assets/images/guide_pic_21_sp.png'
import GuidePic_22_sp from '../../assets/images/guide_pic_22_pc.png'
import GuidePic_22_pc from '../../assets/images/guide_pic_22_sp.png'
import GuidePic_23_sp from '../../assets/images/guide_pic_23_pc.png'
import GuidePic_23_pc from '../../assets/images/guide_pic_23_sp.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Guide_Merge_Voice extends ComponentBase {
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
                          &#9312;ID統合方法について：
                          <br />
                          音声・シェア音声・SMS付きデータ回線（お客さまID【B】）をお客さまID【A】に統合する方
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
                              音声・シェア音声・SMS付きデータ回線（お客さまID【B】）をお客さまID【A】に統合する場合、統合先（お客さまID【B】）の電話番号へSMSにて認証コードが送信されます。
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 1</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              契約一覧から、「お客さまIDを統合する」をクリックします。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_16_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_16_sp}
                                alt=""
                              />
                            </p>
                            <p className="a-sp">
                              <img src={GuidePic_17_pc} alt="" />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 2</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              現在ログインしているご契約（お客さまID【A】）に対して、統合したいご契約（お客さまID【B】）のお客さまIDとパスワードを入力し、確認ボタンをクリックします。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_18_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_18_sp}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 3</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ダイアログが表示されるので、お電話番号を確認し、送信するボタンをクリックします。
                            </p>
                            <p>
                              ※データ回線のご契約の方は、先に統合したいご契約（お客さまID【B】）の２段階認証（Google　Authenticator）の設定をお願いします。
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
                                src={GuidePic_19_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_19_sp}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 4</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              &#9312; - 3
                              で確認した電話番号に、SMSにて認証コードが届きますので、認証コードを確認の上、認証コードを入力し、「認証する」ボタンをタップ（クリック）します。
                            </p>
                            <p>
                              ※認証コードの有効期限は5分です
                              <br />
                              期限切れの場合再度やり直してください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_20_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_20_sp}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 5</h3>
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
                                src={GuidePic_21_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_21_sp}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9312; - 6</h3>
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
                                src={GuidePic_22_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_22_sp}
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
                              ID統合後、マイページにログインすると、契約選択画面が表示され、どちらのご契約情報を閲覧するか選択することになります。
                            </p>
                            <p>
                              閲覧中に、ご契約情報を切り替える場合は、ヘッダーメニューの「契約一覧」から切り替えることができます。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_23_pc}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_23_sp}
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

export default connect(mapStateToProps)(Guide_Merge_Voice)
