import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../assets/css/common.css'

import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

class Usage extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      api_data: [],
      details_data: [],
      detail_data: [],
      loading_state: false,
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
    }
  }

  handleConnect(type) {
    var params = {}
    if (type === Const.CONNECT_TYPE_CREDIT_DETAIL_DATA) {
      params = {
        customerId: window.customerId,
      }
    }
    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      console.log('json_data')
      console.log(data)

      this.setState({ api_data: data.data })
      this.setState({ details_data: data.data.details })
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
    this.handleConnect(Const.CONNECT_TYPE_CREDIT_DETAIL_DATA)
    document.title = Const.TITLE_MYPAGE_USAGE
  }

  taxHandler(data, tax, key) {
    let amount = 0
    if (data && data.length) {
      let subtotal = data.filter((item) => {
        return item.rate == tax
      })
      if (subtotal.length) {
        amount = subtotal[0][key]
      }
    }
    return amount
  }

  dataFixingHandler(type, index, sub_index) {
    if (this.state.details_data.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'month':
          var fl_month = this.state.details_data[index].month
          TempReturn = fl_month.slice(0, 4) + '年' + fl_month.slice(4) + '月分'

          break
        case 'amount':
          {
            let amount = this.state.details_data[index].amount
              ? this.state.details_data[index].amount
              : 0
            let subtotal = this.state.details_data[index].subtotal
              ? this.state.details_data[index].subtotal
              : []
            let tax10 = subtotal.filter((item) => {
              return item.rate == 10
            })
            let tax8 = subtotal.filter((item) => {
              return item.rate == 8
            })
            let tax0 = subtotal.filter((item) => {
              return item.rate == 0
            })
            TempReturn = (
              <table style={{ width: '100%' }}>
                <tr>
                  <th>合計</th>
                  <td colSpan="2" style={{ textAlign: 'right' }}>
                    税込 {amount} 円
                  </td>
                </tr>
                {tax10.length ? (
                  <tr style={{ fontWeight: 'normal' }}>
                    <th>消費税10%対象</th>
                    <td style={{ textAlign: 'right' }}>
                      {this.taxHandler(subtotal, '10', 'total') + '円'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {'(消費税 ' +
                        this.taxHandler(subtotal, '10', 'tax') +
                        '円)'}
                    </td>
                  </tr>
                ) : null}
                {tax8.length ? (
                  <tr style={{ fontWeight: 'normal' }}>
                    <th>消費税8%対象</th>
                    <td style={{ textAlign: 'right' }}>
                      {this.taxHandler(subtotal, '8', 'total') + '円'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {'(消費税 ' +
                        this.taxHandler(subtotal, '8', 'tax') +
                        '円)'}
                    </td>
                  </tr>
                ) : null}
                {tax0.length ? (
                  <tr style={{ fontWeight: 'normal' }}>
                    <th>非課税対象</th>
                    <td style={{ textAlign: 'right' }}>
                      {this.taxHandler(subtotal, '0', 'total') + '円'}
                    </td>
                  </tr>
                ) : null}
              </table>
            )
          }
          break
        case 'service':
          TempReturn = this.state.details_data[index].detail[sub_index].service
          break
        case 'tax':
          TempReturn = this.state.details_data[index].detail[sub_index].tax
            ? this.state.details_data[index].detail[sub_index].tax
            : 0
          break
        case 'nonTaxPrice':
          TempReturn = this.state.details_data[index].detail[sub_index]
            .nonTaxPrice
            ? this.state.details_data[index].detail[sub_index].nonTaxPrice +
              '円'
            : '0円'
          break
        case 'rate':
          if (
            this.state.details_data[index].detail[sub_index].rate &&
            this.state.details_data[index].detail[sub_index].rate != 0
          ) {
            TempReturn = `(${this.state.details_data[index].detail[sub_index].rate}%) ${this.state.details_data[index].detail[sub_index].tax}円`
          } else {
            TempReturn = '(非課税)'
          }
          break
        case 'price':
          TempReturn =
            this.state.details_data[index].detail[sub_index].price + '円'
          break
        case 'remarks':
          TempReturn = this.state.details_data[index].detail[sub_index].remarks
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
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

  slidingButton(key) {
    $('#sliding_' + key).slideToggle()

    if ($('#sliding_btn_' + key).hasClass('is-active') === true) {
      $('#sliding_btn_' + key).removeClass('is-active')
    } else {
      $('#sliding_btn_' + key).addClass('is-active')
    }
  }

  slideClose(key) {
    $('#sliding_btn_close' + key).slideToggle()
  }

  render() {
    this.temp_val = ''
    this.temp_mp = (index, key) =>
      (this.temp_val = index.map((index, key2) => (
        <tbody key={key2}>
          <tr className="a-sp">
            <th>{this.dataFixingHandler('service', key, key2)}</th>
            <td style={{ fontWeight: 'normal' }}>
              {this.dataFixingHandler('nonTaxPrice', key, key2)}
              <br />
              {this.dataFixingHandler('rate', key, key2)}
              <br />
              <span style={{ fontWeight: 'bold' }}>
                {this.dataFixingHandler('price', key, key2)}
              </span>
            </td>
          </tr>
          <tr className="a-pc">
            <th>{this.dataFixingHandler('service', key, key2)}</th>
            <td style={{ fontWeight: 'normal' }}>
              {this.dataFixingHandler('nonTaxPrice', key, key2)}
            </td>
            <td style={{ fontWeight: 'normal' }}>
              {this.dataFixingHandler('rate', key, key2)}
            </td>
            <td>{this.dataFixingHandler('price', key, key2)}</td>
          </tr>
          {this.state.details_data[key].detail[key2].remarks ? (
            <tr>
              <td className="a-table-detail_note a-fs-sm" colSpan="2">
                {this.dataFixingHandler('remarks', key, key2)}
              </td>
            </tr>
          ) : null}
        </tbody>
      )))

    this.Usage_details = this.state.details_data.map((index, key) => (
      <div className="m-charge_item" key={'tr' + key}>
        <div className="m-charge_header">
          <h2 className="a-h3">{this.dataFixingHandler('month', key)}</h2>
          <dl className="m-charge_desc-between">
            <dt>ご利用金額合計</dt>
            <dd className="a-fw-bold">
              {this.dataFixingHandler('amount', key)}
            </dd>
          </dl>
        </div>
        <div className="m-charge_control">
          <button
            className="m-charge_control_btn"
            type="button"
            data-accordion-target={'a' + key}
            onClick={() => this.slidingButton(key)}
            id={'sliding_btn_' + key}
          >
            <span>明細</span>
          </button>
        </div>

        <div className="m-charge_body-accordion" id={'sliding_' + key}>
          <table className="a-table-detail-bg">
            <tbody>
              <tr className="a-sp">
                <th />
                <td
                  colSpan="3"
                  style={{ fontWeight: 'normal', textAlign: 'right' }}
                >
                  税抜本体価格
                  <br />
                  (税率)消費税額
                  <br />
                  税込価格
                </td>
              </tr>
              <tr className="a-pc">
                <th />
                <td style={{ fontWeight: 'normal' }}>税抜本体価格</td>
                <td style={{ fontWeight: 'normal' }}>(税率)消費税額</td>
                <td style={{ fontWeight: 'normal' }}>税込価格</td>
              </tr>
            </tbody>
            {this.temp_mp(index.detail, key)}
          </table>
          <div className="m-charge_control">
            <button
              className="m-charge_control_btn"
              type="button"
              data-accordion-target={'a' + key}
              onClick={() => this.slidingButton(key)}
              id={'sliding_btn_close' + key}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    ))

    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog2_' + i} />
          } else {
            return <React.Fragment key={'dialog2_fr_' + i} />
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
                    <li className="m-breadcrumb_item">ご利用明細一覧</li>
                  </ol>
                  <h1 className="a-h1">ご利用明細一覧</h1>

                  <div className="t-inner_wide">
                    <p>
                      ※通話料など利用料金は前々月にご利用頂いた分の料金になります。
                    </p>
                    <div className="m-charge">{this.Usage_details}</div>
                  </div>
                  <p className="m-btn" style={{ marginBottom: '3.5rem' }}>
                    <a
                      className="a-btn-dismiss"
                      onClick={() => {
                        this.props.history.push('/login')
                      }}
                    >
                      戻る
                    </a>
                  </p>
                  <div style={{ maxWidth: '470px', margin: '0 auto' }}>
                    <p>※ご利用明細は毎月15日に表示の更新を実施いたします。</p>
                    <p>■表示されている期間について</p>
                    <p>
                      ・月初～14日
                      <br />
                      <span style={{ marginLeft: '1.6rem' }}>
                        閲覧日を基準とし、1～15か月前までの明細が表示されます
                      </span>
                    </p>
                    <p>
                      ・15日～月末
                      <br />
                      <span style={{ marginLeft: '1.6rem' }}>
                        閲覧日を基準とし、当月～14か月前までの明細が表示されます
                      </span>
                    </p>
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

export default connect(mapStateToProps)(Usage)
