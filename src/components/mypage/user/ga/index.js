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

// IMPORT MODULES
import Header from '../../../../modules/Header.js'

// 通信用のモジュールを読み込み
import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'

class User_Ga extends ComponentBase {
  constructor(props) {
    super(props)

    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.state = {
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
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      url_data: [
        {
          callback: this.headerUrlHandler,
          dispatch: props.dispatch,
        },
      ],
      issuer: 'AeonMobile',
      qrCode: '',
      secretKey: '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
    }
    console.log('window.customerId: ', window.customerId)
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/login/')
          break
      }
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_GA
    // GAシークレットキー発行API
    this.handleConnect(Const.CONNECT_TYPE_CREATE_GA_SECRET_KEY)
  }

  // 通信処理
  handleConnect(type) {
    var params = {}

    switch (type) {
      case Const.CONNECT_TYPE_CREATE_GA_SECRET_KEY:
        params = {
          token: this.state.token,
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
        case Const.CONNECT_TYPE_CREATE_GA_SECRET_KEY:
          // 返却値を画像とURLへ反映
          if (data.data.result == 'OK') {
            this.setState({
              secretKey: data.data.secretKey,
              qrCode: data.data.qrCode,
            })
          }
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
                      Google Authenticator登録
                    </li>
                  </ol>
                  <h1 className="a-h1">Google Authenticator登録</h1>
                  <div className="m-news">
                    <div className="m-news_body">
                      <p>
                        以下のQRコードを読み取る、またはURLリンクからGoogle
                        Authenticator登録を完了してください。
                      </p>
                    </div>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div
                    className="m-form_section"
                    style={{ textAlign: 'center' }}
                  >
                    <img src={this.state.qrCode} alt="QRコード" />
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div
                    className="m-form_section"
                    style={{ marginBottom: '1em' }}
                  >
                    <p style={{ textAlign: 'center' }}>
                      <a
                        className="a-primary"
                        style={{ textDecoration: 'none' }}
                        href={`otpauth://totp/${this.state.issuer}:${window.customerId}?secret=${this.state.secretKey}&issuer=${this.state.issuer}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Google Authenticatorを起動
                      </a>
                    </p>
                  </div>
                  <p className="m-btn">
                    <a
                      className="a-btn-dismiss"
                      href="javascript:history.back();"
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

export default connect(mapStateToProps)(User_Ga)
