import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import '../../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const.js'

// import dialogs
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Sim_user extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      lineNo:
        props.history.location.state !== undefined
          ? props.history.location.state.lineNo
          : '',
      userName:
        props.history.location.state !== undefined
          ? props.history.location.state.userName
          : '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',
      lineInfo: {
        lineKeyObject:
          props.history.location.state !== undefined
            ? props.history.location.state.lineKeyObject
            : '',
        lineNo:
          props.history.location.state !== undefined
            ? props.history.location.state.lineNo
            : '',
        lineDiv:
          props.history.location.state !== undefined
            ? props.history.location.state.lineDiv
            : '',
      },
      customerInfo: {
        userName: '',
        userNameKana: '',
        postCode: '',
        address: '',
        phoneNumber: '',
      },
      loading_state: false,
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
      isSp: false,
      ICCID:
        props.history.location.state !== undefined
          ? props.history.location.state.ICCID
          : '',
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    switch (type) {
      case Const.CONNECT_TYPE_CHANGE_USER_INFO:
        params = {
          customerId: window.customerId,
          lineNo: this.state.lineNo,
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          nickName: $('#nickName').val(),
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
      if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        var d = data.data
        this.setState({ customerInfo: d.customerInfo })
        var params = Const.CONNECT_TYPE_SIM_DATA
        this.handleConnect(params)
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        var d = data.data
        this.setState({ lineNo: d.lineNo })
        this.setState({ userName: d.userName })
      } else if (type === Const.CONNECT_TYPE_CHANGE_USER_INFO) {
        var d = data.data
        if (d.result === 'OK') {
          // メールアドレス変更の時刻をtimeStampで記録
          let timeStamp = Math.round(new Date().getTime() / 1000)
          let changeSimNameHistory = localStorage.getItem(
            'changeSimNameHistory'
          )
          if (changeSimNameHistory) {
            changeSimNameHistory = JSON.parse(changeSimNameHistory)
            changeSimNameHistory.push({
              ICCID: this.state.ICCID,
              time: timeStamp,
            })
          } else {
            changeSimNameHistory = [
              {
                ICCID: this.state.ICCID,
                time: timeStamp,
              },
            ]
          }
          localStorage.setItem(
            'changeSimNameHistory',
            JSON.stringify(changeSimNameHistory)
          )
          let path = `/mypage/sim`
          var params = {
            lineNo: this.state.lineNo,
            lineKeyObject: this.state.lineInfo.lineKeyObject,
            lineDiv: this.state.lineInfo.lineDiv,
          }
          this.props.history.push({
            pathname: path,
            state: params,
          })
        }
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    // call agreement data
    // this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA);
    document.title = Const.TITLE_MYPAGE_SIM_USER

    var _w = $(window).width()
    this.setState({ isSp: _w <= 600 })

    var self = this
    $(window).on('load resize', function () {
      var w = $(window).width()
      self.setState({ isSp: w <= 600 })
    })
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mypage/sim/user')
          break
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

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/mypage/sim/') {
      params.mailAddress =
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.mailAddress
          : ''
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/') {
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
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
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
                            '/mypage/sim/',
                            this.state.lineInfo
                          )
                        }
                      >
                        {this.state.lineInfo.lineNo}
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">SIM名称変更</li>
                  </ol>
                  <h1 className="a-h1">SIM名称変更</h1>
                  <div className="m-form">
                    <h2 className="a-h2">SIMに名前をつけることが出来ます。</h2>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control-inline">
                          <span className="a-label">回線番号：</span>
                          <span className="a-fs-xl">
                            {' '}
                            {this.state.lineInfo.lineNo}
                          </span>
                        </div>
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="text"
                            id="nickName"
                            defaultValue={this.state.userName}
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CHANGE_USER_INFO
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="sim"
                          >
                            SIMの名前/ニックネーム
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="nickName_error"
                        />
                      </div>
                    </div>
                    <div className="m-form_section">
                      {(() => {
                        if (this.state.isSp) {
                          return (
                            <div className="m-btn-group">
                              <p className="m-btn">
                                <button
                                  className="a-btn-submit"
                                  onClick={(e) =>
                                    this.handleConnect(
                                      Const.CONNECT_TYPE_CHANGE_USER_INFO
                                    )
                                  }
                                  id="btnsim"
                                  type="button"
                                >
                                  変更する
                                </button>
                              </p>
                              <p>※変更反映まで数分かかります。</p>
                              <p className="m-btn">
                                <a
                                  className="a-btn-dismiss"
                                  href="javascript:history.back();"
                                >
                                  戻る
                                </a>
                              </p>
                            </div>
                          )
                        } else {
                          return (
                            <div>
                              <p>※変更反映まで数分かかります。</p>
                              <div className="m-btn-group">
                                <p className="m-btn">
                                  <button
                                    className="a-btn-submit"
                                    onClick={(e) =>
                                      this.handleConnect(
                                        Const.CONNECT_TYPE_CHANGE_USER_INFO
                                      )
                                    }
                                    id="btnsim"
                                    type="button"
                                  >
                                    変更する
                                  </button>
                                </p>
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
                          )
                        }
                      })()}
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

export default connect(mapStateToProps)(Sim_user)
