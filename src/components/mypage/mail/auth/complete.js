import React from 'react'
import { connect } from 'react-redux'

// css
import '../../../assets/css/common.css'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'
import Header from '../../../../modules/Header.js'

// 通信用のモジュールを読み込み
import { dispatchGetConnections } from '../../../../actions/PostActions.js'
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Mail_auth_complete extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    var key = props.location.search.substring(3)

    this.state = {
      settingKey: key,
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

  handleConnect(type) {
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      // AMM00003 API Run
      case Const.CONNECT_TYPE_CHANGEMAILADDRESS:
        params = {
          settingKey: this.state.settingKey,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (type === Const.CONNECT_TYPE_MYPAGEID) {
      if (
        status === Const.CONNECT_SUCCESS &&
        data.data &&
        data.data.customerId
      ) {
        window.customerId = data.data.customerId
        this.handleConnect(Const.CONNECT_TYPE_CHANGEMAILADDRESS)
      } else {
        // ログイン画面へ遷移させる（ログイン完了でメールアドレス更新処理を実行する）
        let s = window.location.search
        if (s) {
          s = window.location.href
          localStorage.setItem('mailAuthComplete', s)
          this.props.history.push({
            pathname: '/login',
            state: { mailAuthComplete: true },
          })
        } else {
          this.props.history.push('/login')
        }
      }
    } else if (type === Const.CONNECT_TYPE_CHANGEMAILADDRESS) {
      if (status === Const.CONNECT_SUCCESS) {
        if (data.data.result === 'OK') {
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
          localStorage.setItem(
            'changeMailHistory',
            JSON.stringify(changeMailHistory)
          )
        } else {
          this.props.history.push('/login')
        }
      } else {
        this.props.history.push('/error?e=1')
        document.title = Const.TITLE_ERROR
      }
    } else {
      this.props.history.push('/error?e=1')
      document.title = Const.TITLE_ERROR
    }
  }

  componentDidMount() {
    this.goTop()
    // if(window.customerId === undefined) return;
    document.title = Const.TITLE_MYPAGE_MAIL_AUTH_COMPLETE
    if (window.performance) {
      if (performance.navigation.type == 1) {
        if (window.customerId === undefined) return
      } else {
        this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
      }
    } else {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
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
                      <a href="/mypage/mail/">メールアドレス変更</a>
                    </li>
                    <li className="m-breadcrumb_item">完了</li>
                  </ol>
                  <h1 className="a-h1">メールアドレス変更完了</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      メールアドレスの変更が完了致しました。
                    </h2>
                    <p>※変更反映まで数分かかります。</p>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="m-btn">
                        <a className="a-btn" href="/mypage/user/">
                          ログイン設定画面に戻る
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

export default connect(mapStateToProps)(Mail_auth_complete)
