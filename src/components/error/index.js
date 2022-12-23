import React from 'react'
import { connect } from 'react-redux'

//css
import '../assets/css/common.css'

//images
import logoImage from '../assets/images/logo.png'

import * as Const from '../../Const.js'
import ComponentBase from '../ComponentBase.js'

import { awaitPostMessage } from '../../actions/PostActions.js'

class Error extends ComponentBase {
  constructor(props) {
    super(props)

    var key = ''
    var headline = ''
    var description = ''

    if (props.location.search !== null) {
      key = props.location.search.substring(3)
    }
    if (props.location.state) {
      if (props.location.state.headline) {
        headline = props.location.state.headline
      }
      if (props.location.state.description) {
        description = props.location.state.description
      }
    }

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.state = {
      type: key,
      headline: headline,
      description: description,
    }
  }

  handleConnect(type) {}

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
  }

  componentDidMount() {
    this.goTop()
    //if(window.customerId === undefined) return;
    if (document.title === '') {
      document.title = Const.TITLE_ERROR
    }
    // ログインエラー検知用
    if (this.state.type === '5') {
      awaitPostMessage('login_fail')
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div className="t-wrapper">
            <header className="t-header">
              <div className="t-header_inner">
                <div className="t-header_logo">
                  <a className="t-header_logo_link" href="/">
                    <img src={logoImage} alt="AEON MOBILE" />
                  </a>
                </div>
              </div>
            </header>
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <h1 className="a-h1">エラー</h1>
                  {(() => {
                    if (this.state.type === '1') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">
                              システムエラーが発生しました。
                            </h2>
                            <p>
                              お手数ですが、トップページから再度操作してください。
                            </p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '2') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">
                              現在、データの取得ができない為、画面の表示ができません。
                            </h2>
                            <p>
                              お手数ですが、しばらく時間をおいてから再度お試しください。
                            </p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '3') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            {this.state.headline ? (
                              <h2 className="a-h3">{this.state.headline}</h2>
                            ) : null}
                            {this.state.description ? (
                              <p>{this.state.description}</p>
                            ) : null}
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '4') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">ログイン連携エラー</h2>
                            <p>他のログイン方法の登録に失敗しました</p>
                            <p>既に登録済みの場合もエラーになります</p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '5') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">ログインエラー</h2>
                            <p>ソーシャルIDでのログインに失敗しました。</p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '6') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">
                              マイページ解約を行うことができません
                            </h2>
                            <p>
                              すでに全ての回線が解約もしくは解約手続き中のためこの操作は行えません
                            </p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '7') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">
                              マイページ解約を行うことができません
                            </h2>
                            <p>
                              契約中の回線全てが予約番号取得中のためこの操作は行えません
                            </p>
                          </div>
                        </div>
                      )
                    } else if (this.state.type === '8') {
                      return (
                        <div className="m-box">
                          <div className="m-box_body">
                            <h2 className="a-h3">
                              マイページ解約を行うことができません
                            </h2>
                            <p>
                              お客さまのご契約内容では、マイページからの解約を承ることができません。
                              <br />
                              お手数ではございますが、お客さまセンターまでお問い合わせください。
                            </p>
                          </div>
                        </div>
                      )
                    }
                  })()}
                  <p className="m-btn">
                    <a className="a-btn-dismiss" href="/">
                      TOPへ
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

export default connect(mapStateToProps)(Error)
