// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Plan_edit_complete extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    // this.handleConnectChange = this.handleConnectChange.bind(this)
    this.state = {
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
      passData: [
        {
          customerInfoGetFlg: '1',
          tokenFlg: '1',
          simGetFlg: '',
          sessionNoUseFlg: '1',
          token: '',
        },
      ],
      customer_id:
        props.history.location.state !== undefined
          ? props.history.location.state.customer_id
          : window.customerId,
      customerInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.customerInfo
          : '',
      lineInfo: 
        props.history.location.state !== undefined
          ? props.history.location.state.lineInfo
          : '',
      simInfo: 
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : '',
    }
  }

  // handleConnect(type) {
  //   var params = {}
  //   this.setState({ loading_state: true })
  //   switch (type) {
  //     case Const.CONNECT_TYPE_AGREEMENT_DATA:
  //       {
  //         params = {
  //           customerId: this.state.url_data[0].pass_data.customer_id,
  //           customerInfoGetFlg: '1',
  //           sessionNoUseFlg: '1',
  //           tokenFlg: '1',
  //           simGetFlg: '',
  //           lineKeyObject: '',
  //         }
  //         console.log('comp_agreement', params)
  //         setConnectionCB(this.handleConnectChange)
  //         this.props.dispatch(
  //           dispatchPostConnections(type, params, false, '/mypage')
  //         )
  //       }
  //       break
  //   }
  // }
  // handleConnectChange(type, data, status, token) {
  //   if (token && type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
  //     this.setState({ token })
  //   }
  //   // IF NO ERROR IN CONNECTION
  //   if (status === Const.CONNECT_SUCCESS) {
  //     //console.log(type, data.data, status, token)
  //     var params
  //     if (data.data && data.data.length > 0) {
  //       params = data.data[0]
  //     } else {
  //       params = data.data
  //     }
  //     // RUN ONLY IF DATA IS AVAILABLE
  //     if (data) {
  //       if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
  //         try {
  //           debugger
  //           if (params.lineInfo.length) {
  //             this.setState({ lineInfo: params.lineInfo })
  //           }

  //           setTimeout(() => {
  //             if (this.state.mailAddress === '') {
  //               this.oneTimePopUp()
  //             }
  //           }, 1)
  //         } catch (e) {
  //           console.log('error: ', e)
  //         } finally {
  //           this.setState({ loading_state_extra: false })
  //         }
  //       }
  //     }
  //   }
  // }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_PLAN_COMPLETE
    console.log(this.state.customer_id)
    debugger
    // this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA, 'customerInfo')
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

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/plan/':
        params.customer_id = this.state.customer_id
        params.simInfo = this.state.simInfo
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      default:
        params.customer_id = this.state.customer_id
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
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
                        ?????????????????????????????????
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">??????</li>
                  </ol>
                  <h1 className="a-h1">???????????????????????????</h1>
                  <div className="m-form">
                    <h2 className="a-h2">???????????????????????????????????????????????????</h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <span>?????????????????????????????????????????????
                        <a
                          href=""
                          style={{ color: '#B50080' }}
                          onClick={(e) =>
                            this.goNextDisplay(
                              e,
                              '/mypage/operate/',
                              this.state.passData[0]
                            )
                          }
                        >
                          ???????????????????????????
                        </a>
                        ??????????????????????????????<br />
                        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</span>
                      <p className="m-btn">
                        <a
                          className="a-btn-dismiss"
                          href=""
                          onClick={(e) =>
                            this.goNextDisplay(
                              e,
                              '/mypage/plan/',
                              this.state.lineInfo[0]
                            )
                          }
                        >
                          ??????
                        </a>
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/')}
                        >
                          ?????????????????????
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

export default connect(mapStateToProps)(Plan_edit_complete)
