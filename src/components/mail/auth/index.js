import React from 'react'
import { connect } from 'react-redux'

//css
import '../../assets/css/common.css'
//images
import logoImage from '../../assets/images/logo.png'

import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

class MailX_auth extends ComponentBase {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MAIL_AUTH
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
                </div>{' '}
              </div>
            </header>
            <main className="t-main">
              <div className="t-container">
                <div className="t-inner">
                  <h1 className="a-h1">メール送信完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      ご本人確認用のURLを記載したメールをお送りしました。
                    </h2>
                    <p>
                      ※メール受信設定をされている場合は、「aeonmobile.jp」からのメールを許可してください。
                    </p>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a className="a-btn" href="/login/">
                          ログインページへ
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

export default connect(mapStateToProps)(MailX_auth)
