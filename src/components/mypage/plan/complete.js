// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Plan_complete extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      // LINE INFO
      lineInfo: [
        {
          lineDiv:
            props.history.location.state !== undefined
              ? props.history.location.state.lineDiv
              : '',
          lineKeyObject:
            props.history.location.state !== undefined
              ? props.history.location.state.lineKeyObject
              : '',
        },
      ],
      simInfo: 
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : '',
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
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
    document.title = Const.TITLE_MYPAGE_PLAN_COMPLETE
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
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/plan/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
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
                    <li className="m-breadcrumb_item">
                      <a
                        href=""
                        onClick={(e) =>
                          this.goNextDisplay(
                            e,
                            '/mypage/plan/',
                            this.state.lineInfo[0]
                          )
                        }
                      >
                        プラン確認・変更・取消
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">完了</li>
                  </ol>
                  <h1 className="a-h1">プラン変更申込完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">プラン変更申込みが完了致しました。</h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          href="javascript:history.back();"
                        >
                          戻る
                        </a>
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/')}
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

export default connect(mapStateToProps)(Plan_complete)
