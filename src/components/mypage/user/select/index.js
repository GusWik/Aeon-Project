// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT IMAGES

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// images
import logoImage from '../../../assets/images/logo.png'

// 通信用のモジュールを読み込み
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'
import {
  getmypageid,
  getAgreementData,
} from '../../../../actions/ArsActions.js'
import { getPathName, redirectPlanPage } from '../../../../actions/Methods.js'

const URL_MYPAGE_PLAN = '/mypage/plan/'

class User_Select extends ComponentBase {
  constructor(props) {
    super(props)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

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
          },
          dispatch: props.dispatch,
        },
      ],
      dialogs_error: [
        {
          id: 0,
          type: Const.DIALOG_GENERIC_ERROR,
          title: '',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialogError,
              interval: null,
            },
          ],
          callback: this.callbackDialogError,
          state: false,
        },
      ],
      contractList:
        props.history.location.state !== undefined &&
        props.history.location.state.contractList
          ? props.history.location.state.contractList
          : [],
      redirect_url:
        props.history.location.state !== undefined &&
        props.history.location.state.redirect_url
          ? props.history.location.state.redirect_url
          : '',
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/login')
          break
      }
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_SELECT
    if (!this.state.contractList.length) {
      this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}

    switch (type) {
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_LOGOUT:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_CHANGE_CONTRACT:
        params = {
          customerId: this.state.customerId,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        // json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_CONTRACT_LIST:
          if (
            data.data &&
            data.data.contractList &&
            data.data.contractList.length
          ) {
            if (data.data.contractList.length > 1) {
              // contractList更新
              this.setState({ contractList: data.data.contractList })
            } else {
              //リダイレクト処理を入れる
              console.log('リダイレクト処理')
              if (this.state.redirect_url) {
                const path = getPathName(this.state.redirect_url)
                if (path === URL_MYPAGE_PLAN) {
                  redirectPlanPage(this.props)
                  return
                } else {
                  location.href = this.state.redirect_url
                  return
                }
              }
              // トップ画面へ
              this.props.history.push({
                pathname: '/mypage',
                state: { customer_id: this.state.customerId },
              })
            }
          }
          break
        case Const.CONNECT_TYPE_LOGOUT:
          delete window.customerId
          this.props.history.push('/login/')
          break
        case Const.CONNECT_TYPE_CHANGE_CONTRACT:
          // トップ画面へ
          //リダイレクト処理を入れる
          console.log('リダイレクト処理')
          if (this.state.redirect_url) {
            const path = getPathName(this.state.redirect_url)
            if (path === URL_MYPAGE_PLAN) {
              redirectPlanPage(this.props)
              return
            } else {
              location.href = this.state.redirect_url
              return
            }
          }
          this.props.history.push({
            pathname: '/mypage',
            state: { customer_id: this.state.customerId },
          })
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      var values = []
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
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

  returnLineCount(item) {
    return item.lineCount || '-'
  }

  items(data) {
    let trs = data.map((item, key) => (
      <tr style={{ padding: '1rem 0' }} key={key}>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">ご契約者名</dt>
            <dd>{`${item.contractorLastName} ${item.contractorFirstName}`}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">プラン名</dt>
            <dd>{item.planName}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">回線数</dt>
            <dd>{this.returnLineCount(item)}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">ご契約回線番号1</dt>
            <dd>{item.tel}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp" />
            <dd style={{ flex: 1 }}>
              <button
                className="a-btn-submit"
                style={{ width: '100px', padding: '6px' }}
                id=""
                type="button"
                onClick={(e) => this.onLogin(item)}
              >
                選択
              </button>
            </dd>
          </dl>
        </td>
      </tr>
    ))
    return trs
  }

  logout() {
    localStorage.removeItem('customerId')
    localStorage.removeItem('lineInfoNum')
    localStorage.removeItem('lineKeyObject')
    this.handleConnect(Const.CONNECT_TYPE_LOGOUT)
  }

  onLogin(item) {
    // 操作対象契約切替API
    this.setState(
      { customerId: item.customerId },
      function () {
        this.handleConnect(Const.CONNECT_TYPE_CHANGE_CONTRACT)
      }.bind(this)
    )
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
                  <h1 className="a-h1">契約選択</h1>
                  <div className="m-news">
                    <div className="m-news_body">
                      <p>ご覧になるご契約を選択してください。</p>
                    </div>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div className="m-form_section">
                    <table className="m-operate">
                      <colgroup>
                        <col />
                        <col />
                        <col />
                      </colgroup>
                      <thead className="a-pc">
                        <tr>
                          <th>ご契約者名</th>
                          <th>プラン名</th>
                          <th>回線数</th>
                          <th>ご契約回線番号1</th>
                          <th style={{ minWidth: '120px' }} />
                        </tr>
                      </thead>
                      <tbody className="m-operate_tbody">
                        {this.items(this.state.contractList)}
                      </tbody>
                    </table>
                  </div>
                  <p className="m-btn">
                    <a
                      className="a-btn-dismiss"
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.logout()
                      }}
                    >
                      ログアウト
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

export default connect(mapStateToProps)(User_Select)
