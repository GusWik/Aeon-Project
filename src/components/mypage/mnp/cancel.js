import React from 'react'
import { connect } from 'react-redux'

import '../../assets/css/common.css'
import Header from '../../../modules/Header.js'

// 各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

class Mnp_cancel extends ComponentBase {
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

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    console.log('this is from the header*******************')
    console.log(params)
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_MNP_CANCEL
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
                      <a href="/mypage/mnp/">MNP転出のお申し込み</a>
                    </li>
                    <li className="m-breadcrumb_item">お申し込みキャンセル</li>
                  </ol>
                  <h1 className="a-h1">お申し込みキャンセル</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      MNP転出のお申し込みをキャンセルしました。
                    </h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a className="a-btn" href="/">
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

export default connect(mapStateToProps)(Mnp_cancel)
