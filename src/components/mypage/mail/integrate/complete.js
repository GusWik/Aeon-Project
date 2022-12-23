import React from 'react'
import { connect } from 'react-redux'

// css
import '../../../assets/css/common.css'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

class Mail_integrate_complete extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
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
    document.title = Const.TITLE_MYPAGE_MAIL_INTEGRATE_COMPLETE
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
                      <a href="/">TOP</a>
                    </li>
                    <li className="m-breadcrumb_item">
                      メールアドレス統合完了
                    </li>
                  </ol>
                  <h1 className="a-h1">メールアドレス統合完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      メールアドレスの統合が完了致しました。
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a className="a-btn" href="/mypage/user/list/">
                          契約一覧に戻る
                        </a>
                      </p>
                      <p className="m-btn">
                        <a className="a-btn" href="/">
                          トップページに戻る
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
              <a href="" data-scroll>
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

export default connect(mapStateToProps)(Mail_integrate_complete)
