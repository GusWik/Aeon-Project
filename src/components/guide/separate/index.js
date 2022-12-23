// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT IMAGES
import GuidePic_31_sp from '../../assets/images/guide_pic_31_sp.png'
import GuidePic_31_pc from '../../assets/images/guide_pic_31_pc.png'
import GuidePic_32_sp from '../../assets/images/guide_pic_32_sp.png'
import GuidePic_33_sp from '../../assets/images/guide_pic_33_sp.png'
import GuidePic_33_pc from '../../assets/images/guide_pic_33_pc.png'
import GuidePic_34_sp from '../../assets/images/guide_pic_34_sp.png'
import GuidePic_34_pc from '../../assets/images/guide_pic_34_pc.png'
import GuidePic_35_sp from '../../assets/images/guide_pic_35_sp.png'
import GuidePic_35_pc from '../../assets/images/guide_pic_35_pc.png'
import GuidePic_36_sp from '../../assets/images/guide_pic_36_sp.png'
import GuidePic_36_pc from '../../assets/images/guide_pic_36_pc.png'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Guide_Separate extends ComponentBase {
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
                      お客さまIDの分離方法について
                    </li>
                  </ol>
                  <h1 className="a-h1 a-mb-pc-25">
                    お客さまIDの分離方法について
                  </h1>
                  <div className="t-inner_wide">
                    <div className="m-guide">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          &#9314;ID分離方法について：
                        </h2>
                        <h3 className="a-h4">
                          ２契約以上のアカウントを統合している場合に、IDの分離ができます。
                        </h3>
                      </div>
                      <div className="m-guide_body" />
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9314; - 1</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              契約一覧から、分離するご契約（お客さまID【B】）を選び、「分離」をクリックします。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_31_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_31_pc}
                                alt=""
                              />
                            </p>
                            <p className="a-sp">
                              <img src={GuidePic_32_sp} alt="" />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9314; - 2</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              分離後のご契約（お客さまID【B】）のログインに使用するパスワードを入力し、「分離する」をクリックします。
                            </p>
                            <p>
                              ※入力したパスワードは、分離したご契約（お客さまID【B】）のログインに使用します。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_33_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_33_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9314; - 3</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              ダイアログの内容を確認し、「分離する」をクリックする。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_34_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_34_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9314; - 4</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              分離が完了すると、契約一覧から分離したご契約（お客さまID【B】）が表示されなくなります。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_35_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_35_pc}
                                alt=""
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_header">
                        <h3 className="a-h4">&#9314; - 5</h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              分離したご契約（お客さまID【B】）は、お客さまIDと&#9314;
                              − 2 で設定したパスワードでログインしてください。
                            </p>
                          </div>
                          <div className="m-guide_media_pic">
                            <p>
                              <img
                                className="a-sp"
                                src={GuidePic_36_sp}
                                alt=""
                              />
                              <img
                                className="a-pc"
                                src={GuidePic_36_pc}
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

export default connect(mapStateToProps)(Guide_Separate)
