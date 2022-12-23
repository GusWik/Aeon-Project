import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

import Dialog from '../../../../modules/Dialog.js'

// css
import '../../../assets/css/common.css'

import ComponentBase from '../../../ComponentBase.js'

// IMPORT DIALOG
import Header from '../../../../modules/Header.js'

// 通信用のモジュールを読み込み
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

import * as Const from '../../../../Const'

class Call_Usage extends ComponentBase {
  constructor(props) {
    super(props)

    console.log(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.toggle_display = this.toggle_display.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      api_data: [],
      lineInfo: [
        {
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
      ],
      // FOR DIALOG ERROR
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
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_CALL_USAGE
    $('.m-charge_header-accordion').click(function () {
      $(this).parent().find('.m-charge_body-accordion').slideToggle()
      if ($(this).hasClass('is-active') === true) {
        $(this)
          .parent()
          .find('.m-charge_header-accordion')
          .removeClass('is-active')
      } else {
        $(this)
          .parent()
          .find('.m-charge_header-accordion')
          .addClass('is-active')
      }
    })

    this.handleConnect(Const.CONNECT_TYPE_CHARGE_DETAIL_DATA)
  }

  // SET PARAMETERS
  handleConnect(type) {
    this.setState({ loading_state: true })
    var params = {}
    switch (type) {
      // api AMM000018 - chargeDetail
      case Const.CONNECT_TYPE_CHARGE_DETAIL_DATA:
        params = {
          lineKeyObject: this.state.lineInfo[0].lineKeyObject,
          lineDiv: this.state.lineInfo[0].lineDiv,
          lineNo: this.state.lineInfo[0].lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_CHARGE_DETAIL_DATA) {
        this.setState({ api_data: data.data.resultArray })
      }
    }
    // IF ERROR IN CONNECTION
    else if (status === Const.CONNECT_ERROR) {
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

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  dataFixingHandler(type, index, sub_index) {
    if (this.state.api_data.length > 0) {
      var TempReturn = ' '
      var d = ''
      var time_data = []
      var seconds_data = []
      switch (type) {
        case 'month':
          d = this.state.api_data[index].month
          time_data = d.split('/')
          if (time_data[1].startsWith('0')) time_data[1] = time_data[1].slice(1)
          TempReturn = time_data[0] + '年' + time_data[1] + '月分 '
          break

        case 'sumCharge':
          TempReturn = this.numberWithCommas(
            this.state.api_data[index].sumCharge
          )
          break

        case 'charge':
          if (this.state.api_data[index].chargeArray.length > 0) {
            TempReturn = this.state.api_data[index].chargeArray.map((item) => {
              let charge = `税込 ${this.numberWithCommas(item.charge)} 円`
              if (item.class === 2) {
                charge = `${this.numberWithCommas(item.charge)} 円（非課税）`
              } else if (item.class === 3) {
                charge = `${this.numberWithCommas(item.charge)} 円（免税）`
              }
              return (
                <tr>
                  <th>{item.code}</th>
                  <td>{charge}</td>
                </tr>
              )
            })
          }
          break

        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  toggle_display(id, track) {
    $('#' + id).slideToggle()
    $(track).toggleClass('is-active')
  }

  // CHECK SERVER ERROR
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
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
    }
  }

  render() {
    this.items = this.state.api_data.map((item, key) => {
      let padding = key > 0 ? '0 1rem 0 0' : 0
      return (
        <div className="m-charge_item" key={'m-charge_item_x_' + key}>
          {this.state.api_data[key].chargeArray.length > 0 ? (
            // if api data > 0
            <div>
              <div className="m-charge_header">
                <h2 className="a-h3">
                  {this.dataFixingHandler('month', key, 0)}
                </h2>
                <dl className="m-charge_desc">
                  <dt>電話番号：</dt>
                  <dd className="a-fw-bold">{this.state.lineInfo[0].lineNo}</dd>
                </dl>
              </div>
              <div
                className={
                  key > 0
                    ? 'm-charge_body m-charge_header-accordion'
                    : 'm-charge_header'
                }
                id={'traker_' + key}
                onClick={() => {
                  key > 0
                    ? this.toggle_display('sub_item_' + key, '#traker_' + key)
                    : ''
                }}
                style={{ borderTop: '1px solid #afafaf' }}
              >
                <table className="a-table-detail">
                  <tbody>
                    <tr>
                      <th
                        className="a-fs-lg"
                        style={{ border: 'none', padding: 0 }}
                      >
                        ご利用合計
                      </th>
                      <td
                        className="a-fs-xl"
                        style={{ border: 'none', padding }}
                      >
                        税込 {this.dataFixingHandler('sumCharge', key, 0)} 円
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                className={
                  key > 0 ? 'm-charge_body-accordion' : 'm-charge_body'
                }
                id={'sub_item_' + key}
              >
                <table className="a-table-detail">
                  <tbody>{this.dataFixingHandler('charge', key)}</tbody>
                </table>
              </div>
            </div>
          ) : (
            //  if api data 0 then
            <div>
              <div className="m-charge_header">
                <h2 className="a-h3">
                  {this.dataFixingHandler('month', key, 0)}
                </h2>
                <dl className="m-charge_desc">
                  <dt>電話番号：</dt>
                  <dd className="a-fw-bold">{this.state.lineInfo[0].lineNo}</dd>
                </dl>
              </div>
              <div className="m-charge_body">
                <table className="a-table-detail">
                  <tbody>
                    <tr>
                      <th className="a-fs-lg">ご利用合計</th>
                      <td className="a-fs-xl">税込 0 円</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )
    })

    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
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
                    <li className="m-breadcrumb_item">通話料明細</li>
                  </ol>
                  <h1 className="a-h1">通話料明細</h1>
                  <div className="t-inner_wide">
                    <div className="m-charge">{this.items}</div>
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

export default connect(mapStateToProps)(Call_Usage)
