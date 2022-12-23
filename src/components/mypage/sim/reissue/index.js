import React from 'react'
import { connect } from 'react-redux'

import '../../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'

// import dialogs
import Header from '../../../../modules/Header.js'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

class Sim_Reissue extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    //this.callbackDialog = this.callbackDialog.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeAccept = this.handleChangeAccept.bind(this)

    this.state = {
      is_accept: false,
      mailAddress:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.mailAddress
          : '',
      iccid:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.iccid
          : '',
      simType:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simType
          : '',
      simKind:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simKind
          : '',
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

  // 通信処理
  handleConnect(type) {
    var params = {}
    // プログレス表示
    this.setState({ loading_state: true })

    // 通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // console.log("json_data");
    // console.log(data);
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SIM_REISSUE
    console.log(this.state.lineInfo[0])
    //this.handleConnect(Const.CONNECT_TYPE_SIM_STATUS)
    //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
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
    console.log(url)
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/sim/reissue/select/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      params.iccid = this.state.iccid
      params.simType = this.state.simType
      params.simKind = this.state.simKind
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  handleChangeAccept(e) {
    const value = !this.state.is_accept
    this.setState({ is_accept: value })
  }

  render() {
    // CHECKING SIM STATE AND CHANGING
    // 0 : STOP  -  1: USE

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
                      {' '}
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">
                      SIMカード再発行・サイズ変更
                    </li>
                  </ol>
                  <h1 className="a-h1">SIMカード再発行・サイズ変更</h1>
                  <div className="m-form">
                    <p>内容をご確認ください。</p>
                    <div className="m-box">
                      <div className="m-box_body">
                        <h3 className="a-h3">
                          SIMカード再発行・サイズ変更お手続き
                        </h3>
                        <p>
                          ・再発行又は、サイズ変更と同時に、ご契約種別の変更をすることはできません。
                          <br />
                          ・事務手数料３，３００円(税込)を後日請求させていただきます。
                          <br />
                          ・SIMカードの再発行又はサイズ変更は、ご契約住所にお届けとなります。
                          <br />
                          ※ヤマト便で配送となります
                          <br />
                          ・お申込み日よりお届けまで４～５日程かかる場合がございます。(配送日の指定は承ることができません）。
                          <br />
                          ・お届けまでの間、ご利用いただいております電話番号は不通になり、ご利用できません。
                          <br />
                          ・申込み後の差し止め（キャンセル）はいかなる理由であってもお受けできません。
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="input_checkbox">
                        <input
                          type="checkbox"
                          checked={this.state.is_accept}
                          onChange={this.handleChangeAccept}
                        />
                        <span className="input_checkbox_label">
                          同意します。
                        </span>
                      </label>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p
                          className="m-btn"
                          style={{
                            display: this.state.isStop ? 'none' : 'flex',
                          }}
                        >
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={(e) =>
                              this.goNextDisplay(
                                e,
                                '/mypage/sim/reissue/select/',
                                this.state.lineInfo[0]
                              )
                            }
                            disabled={!this.state.is_accept}
                          >
                            お手続きへ進む
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

export default connect(mapStateToProps)(Sim_Reissue)
