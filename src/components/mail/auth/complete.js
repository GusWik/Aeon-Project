import React from 'react'
import { connect } from 'react-redux'

//css
import '../../assets/css/common.css'

//images
import logoImage from '../../assets/images/logo.png'

//各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

class Mail_Complete extends ComponentBase {
  constructor(props) {
    super(props)

    // Loginコンポーネントのメンバ変数定義
    this.state = {
      //プログレス表現の表示状況
      loading_state: false,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MAIL_AUTH_COMPLETE
    // メールアドレス変更の時刻をtimeStampで記録
    let timeStamp = Math.round(new Date().getTime() / 1000)
    let changeMailHistory = localStorage.getItem('changeMailHistory')
    if (changeMailHistory) {
      changeMailHistory = JSON.parse(changeMailHistory)
      changeMailHistory.push({
        customerId: window.customerId,
        time: timeStamp,
      })
    } else {
      changeMailHistory = [
        {
          customerId: window.customerId,
          time: timeStamp,
        },
      ]
    }
    localStorage.setItem('changeMailHistory', JSON.stringify(changeMailHistory))
  }

  //画面レイアウト
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
                  <h1 className="a-h1">本人確認完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      メールアドレスの登録が完了いたしました。
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a className="a-btn" href="/">
                          トップページへ戻る
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

export default connect(mapStateToProps)(Mail_Complete)
