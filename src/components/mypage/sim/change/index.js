import React from 'react'
import { connect } from 'react-redux'

import '../../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'

// import dialogs
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Sim_change extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      simStatus: '',
      token: '',
      user_nick_name: '',
      lineInfo: [
        {
          lineDiv:
            props.history.location.state !== undefined
              ? props.history.location.state.lineDiv
              : '',
          lineNo:
            props.history.location.state !== undefined
              ? props.history.location.state.lineNo
              : '',
          lineKeyObject:
            props.history.location.state !== undefined
              ? props.history.location.state.lineKeyObject
              : '',
        },
      ],
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          body: '',
          remarks: '',
          values: [
            {
              text: (
                <p>
                  SIMカードを再開します。
                  <br />
                  よろしいですか？
                </p>
              ),
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel',
              value: 'キャンセル',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
          key: 'dialog_bx',
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
      isStop: false,
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    // プログレス表示
    this.setState({ loading_state: true })
    if (type === Const.CONNECT_TYPE_SIM_STATUS) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    } else if (type === Const.CONNECT_TYPE_CHANGE_SIM) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
        simStatusDiv: this.state.simStatus === '1' ? '0' : '1',
        token: this.state.token,
      }
    } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    }
    // 通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // console.log("json_data");
    // console.log(data);
    if (type === Const.CONNECT_TYPE_SIM_STATUS) {
      var d = data.data
      this.setState({ lineNo: d.lineNo })
      this.setState({ simStatus: d.simStatus })
      this.setState({ token: d.token })
    } else if (type === Const.CONNECT_TYPE_CHANGE_SIM) {
      var d = data.data
      if (d.result === 'OK') {
        // TODO: This part need to fix after api updated following should be uncommented. remove other parts
        // this.handleConnect(Const.CONNECT_TYPE_SIM_STATUS);
        if (this.state.simStatus === '0') {
          this.setState({ simStatus: '1' })
        } else {
          this.setState({ simStatus: '0' })
        }
        this.handleConnect(Const.CONNECT_TYPE_SIM_STATUS)
        this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
      }
    } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
      // this.setState({user_nick_name: data.data.nickName});
      this.setState({
        user_nick_name: data.data.nickName,
        isStop: data.data.stopFlg == 1,
      })
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SIM_CHANGE

    this.handleConnect(Const.CONNECT_TYPE_SIM_STATUS)
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
  }

  toggle_dialog_box() {
    var dialogs_copy = [...this.state.dialogs]

    if (this.state.simStatus === '0') {
      dialogs_copy[0].values = [
        {
          text: (
            <p>
              SIMカードを再開します。
              <br />
              よろしいですか？
            </p>
          ),
        },
      ]
    } else {
      dialogs_copy[0].values = [
        {
          text: (
            <p>
              SIMカードを停止します。
              <br />
              よろしいですか？
            </p>
          ),
        },
      ]
    }
    console.log('dialogs_copy[0].values :: ', dialogs_copy[0].values)
    dialogs_copy[0].state = true
    this.setState({ dialogs: dialogs_copy })
  }

  callbackDialog(type, id) {
    var is_check = true
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 't-modal_overlay': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          this.handleConnect(Const.CONNECT_TYPE_CHANGE_SIM)
          break
        }
        default: {
          break
        }
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
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/contact/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.frompage = 'fromSimChange'
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
    // CHECKING SIM STATE AND CHANGING
    // 0 : STOP  -  1: USE

    if (this.state.simStatus === '0') {
      this.simStatus = (
        <table className="m-status a-table-between m-status-disabled">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th">SIMカード：</th>
              <td className="m-status_td">
                <span>停止中</span>
              </td>
            </tr>
            <tr>
              <th>変更手数料</th>
              <td className="a-fw-bold">無料</td>
            </tr>
          </tbody>
        </table>
      )
    } else {
      this.simStatus = (
        <table className="m-status a-table-between">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th">SIMカード：</th>
              <td className="m-status_td">
                <span>利用中</span>
              </td>
            </tr>
            <tr>
              <th>変更手数料</th>
              <td className="a-fw-bold">無料</td>
            </tr>
          </tbody>
        </table>
      )
    }

    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} />
          } else {
            return <React.Fragment key="react_fragment" />
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
                      {' '}
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">SIMカードの停止・再開</li>
                  </ol>
                  <h1 className="a-h1">SIMカードの停止・再開</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            {this.state.user_nick_name}
                            <br />
                            （電話番号：{this.state.lineNo}）
                          </h2>
                        </div>
                      </div>
                      {this.simStatus}
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p className="a-fw-bold">
                        表示中のSIMカードを一時的に停止し、音声通話・SMS・データを一時的に使用できない状態にする機能です。
                      </p>
                      <p>※停止後もマイページから使用を再開できます。</p>
                      <p>
                        停止できる機能は、ご契約いただいているSIMカードの種別により異なります。
                      </p>
                    </div>
                    <div className="m-form_section">
                      <p>
                        ※メールアドレスをご登録頂いていないお客さまは、お手数ですが
                        <span className="a-primary">
                          イオンモバイルお客さまセンター
                        </span>
                        までお問い合わせください。
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn-radius-arrow"
                          href=""
                          onClick={(e) =>
                            this.goNextDisplay(
                              e,
                              '/contact/',
                              this.state.lineInfo[0]
                            )
                          }
                        >
                          各種お問い合わせは
                          <wbr />
                          こちら
                        </a>
                      </p>
                    </div>
                    <hr className="a-hr a-hr-full" />
                    <div className="m-form_section">
                      <p>
                        反映までに時間がかかる場合や、翌日以降の処理となる場合がございます。
                      </p>
                      <p>
                        「SIMタイプ１（au網）」および「SIMタイプ２(docomo網）」のSMS機能は停止されません（SMSをご利用された場合は料金が発生いたします）。
                      </p>
                      <p>停止期間中も各プランの月額料金は発生いたします。</p>
                      <p>
                        停止をお申込みいただいてから、反映までに発生した通話やSMSなどの従量料金はご請求をさせていただきます。
                      </p>
                      <p>
                        機器のメンテナンスなどにより、お申込みいただけない場合がございます。
                      </p>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p
                          className="m-btn"
                          style={{
                            display: this.state.isStop ? 'none' : 'flex',
                          }}
                        >
                          {this.state.simStatus === '0' ? (
                            <button
                              className="a-btn-submit"
                              type="button"
                              onClick={this.toggle_dialog_box}
                            >
                              SIMカードを再開する
                            </button>
                          ) : null}
                          {this.state.simStatus === '1' ? (
                            <button
                              className="a-btn-submit"
                              type="button"
                              onClick={this.toggle_dialog_box}
                            >
                              SIMカードを停止する
                            </button>
                          ) : null}
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

export default connect(mapStateToProps)(Sim_change)
