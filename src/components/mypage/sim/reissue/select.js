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

class Sim_Select extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    //this.callbackDialog = this.callbackDialog.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeSim = this.handleChangeSim.bind(this)

    this.state = {
      is_accept: false,
      sim_number: '0',
      simSize: '0',
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
    if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      params = {
        customerId: this.state.customer_id,
        customerInfoGetFlg: '1',
        sessionNoUseFlg: '1',
        tokenFlg: '1',
        simGetFlg: '1',
        lineKeyObject: '',
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
    if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
      //
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SIM_REISSUE
    console.log(this.state.lineInfo[0])
    this.setState({ sim_number: this.state.lineInfo[0].lineDiv })
    //this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
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
    } else if (url === '/mypage/sim/reissue/confirm/') {
      // NEED TO SEND THE CUSTOMER ID
      params.simSize = this.state.simSize
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

  handleChangeSim(e) {
    const value = e.target.value
    console.log(e.target.value)
    this.setState({ simSize: value })
    this.setState({ is_accept: true })
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
                    <p>ご希望のSIMサイズを選択してください。</p>
                    <div></div>

                    <div className="m-form_section">
                      {this.state.sim_number === '1' && (
                        <div>
                          <div>
                            <label className="sim_radio">
                              <input
                                type="radio"
                                value="04"
                                checked={this.state.simSize === '04'}
                                onChange={this.handleChangeSim}
                              />
                              <span className="sim_radio_label sim_multi">
                                <span style={{ fontSize: '18px' }}>
                                  マルチSIM
                                </span>
                                <span style={{ fontSize: '14px' }}>
                                  全てのサイズに対応できるISMカードです。
                                  <br />
                                  ご利用の端末に合わせて、お客様ご自身で切り離してご利用ください。
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                      {this.state.sim_number === '2' && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ width: '32%' }}>
                            <label className="sim_radio">
                              <input
                                type="radio"
                                value="01"
                                checked={this.state.simSize === '01'}
                                onChange={this.handleChangeSim}
                              />
                              <span className="sim_radio_label sim_standard">
                                <span style={{ fontSize: '18px' }}>
                                  標準SIM
                                </span>
                                <span style={{ fontSize: '14px' }}>
                                  (タテ：25mm ヨコ：15mm)
                                </span>
                              </span>
                            </label>
                          </div>
                          <div style={{ width: '32%' }}>
                            <label className="sim_radio">
                              <input
                                type="radio"
                                value="02"
                                checked={this.state.simSize === '02'}
                                onChange={this.handleChangeSim}
                              />
                              <span className="sim_radio_label sim_micro">
                                <span style={{ fontSize: '18px' }}>
                                  microSIM
                                </span>
                                <span style={{ fontSize: '14px' }}>
                                  (タテ：15.0mm ヨコ：12.0mm)
                                </span>
                              </span>
                            </label>
                          </div>
                          <div style={{ width: '32%' }}>
                            <label className="sim_radio">
                              <input
                                type="radio"
                                value="03"
                                checked={this.state.simSize === '03'}
                                onChange={this.handleChangeSim}
                              />
                              <span className="sim_radio_label sim_nano">
                                <span style={{ fontSize: '18px' }}>
                                  nanoSIM
                                </span>
                                <span style={{ fontSize: '14px' }}>
                                  (タテ：12.3mm ヨコ：8.8mm)
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
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
                                '/mypage/sim/reissue/confirm/',
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

export default connect(mapStateToProps)(Sim_Select)
