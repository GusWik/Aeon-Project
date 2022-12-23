import React from 'react'
import { connect } from 'react-redux'

// css
import '../../../assets/css/common.css'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'

// import header
import Header from '../../../../modules/Header.js'

class Mail_auth extends ComponentBase {
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
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_MAIL_AUTH
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

  goNextDisplay(e, url, params) {
    e.preventDefault()

    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/login/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
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
                    <li className="m-breadcrumb_item">メール送信完了</li>
                  </ol>
                  <h1 className="a-h1">メール送信完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      メールアドレスの確認のため、入力されたメールアドレスに確認のメールをお送りしています。
                    </h2>
                    <ul className="a-list">
                      <li>
                        {' '}
                        ‣
                        届いたメールに記載のURLを選択して登録を完了してください。
                        <br />
                        （この手続きが終わるまで、新しいメールアドレスの登録は完了しません）
                      </li>
                      <li>
                        {' '}
                        ‣ 確認用のメールが届かない場合は、以下をご確認ください。
                      </li>
                    </ul>
                    <ul className="a-list">
                      <li>
                        ・ 入力されたメールアドレスが誤っている場合があります。
                      </li>
                      <li>
                        ・
                        メールが迷惑メールフォルダに自動で振り分けられている場合があります。
                      </li>
                      <li>
                        ・
                        迷惑メールなどの対策で受信するメールアドレスを制限されている場合があります。
                        <br />
                        （その場合は「aeonmobile.jp」からのメールを許可してください）
                      </li>
                    </ul>
                    <p>
                      以上をご確認の上、お手数ですが再度メールアドレスの入力からやり直してください。
                    </p>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/login/')}
                        >
                          トップページへ
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

export default connect(mapStateToProps)(Mail_auth)
