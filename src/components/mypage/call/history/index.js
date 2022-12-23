import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import Pager from '../../../../modules/Pager.js'
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'


import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'


import '../../../assets/css/common.css'

class Call_History extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.ShowMonthdata = this.ShowMonthdata.bind(this)

    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)

    this.state = {
      loading_state: false,
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
      api_data: [],
      table_date: [],
      final_page: 4,
      selected_page_id: 1,
      selected_page_value: 1,
      state_lock: true,
      month: '',

      pagination: {
        allPageNum: 0,
        nowPageNo: 0,
        callback: this.pageNoChangeHandler,
      },

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
    document.title = Const.TITLE_MYPAGE_CALL_HISTORY

    // Set m_tab btn active
    $('.m-tab_nav_btn').click(function () {
      if ($(this).hasClass('is-active') === false) {
        $('.m-tab_nav_btn').removeClass('is-active')
        $(this).addClass('is-active')
      }
    })
    var params = Const.CONNECT_TYPE_CALL_LOG_DATA

    var today = new Date()

    var yaer = today.getFullYear()
    var month = today.getMonth() + 1
    var nowMonth = yaer + (month >= 10 ? '' + month : '0' + month)

    this.handleConnect(params, 1, nowMonth)
  }

  // 通信処理
  handleConnect(type, page, month) {
    // Correct  this when api is fixed...
    var params = {}
    this.setState({ loading_state: true })

    if (type === Const.CONNECT_TYPE_CALL_LOG_DATA) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
        month: month, // '201812',//month,
        perNum: 10,
        pageNo: page,
      }
    }
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_CALL_LOG_DATA: {
          console.log(data.data)
          this.setState({ api_data: data.data })
          console.log('apidata::', this.state.api_data)

          this.setState({ month: data.data.month })
          this.setState({ table_date: data.data.callArray })
          // 最大ページ数
          this.setState({ final_page: data.data.pageNum })
          // 現在のページ数
          this.setState({ selected_page_id: data.data.pageNo })

          var pagination_copy = this.state.pagination
          pagination_copy.allPageNum = parseInt(data.data.pageNum)
          pagination_copy.nowPageNo = parseInt(data.data.pageNo)

          this.setState({ pagination: pagination_copy })
          console.log('pagination_copy :: ', pagination_copy)

          /* console.log("%c---------------HI---------------","background: green");
          console.log(this.state.api_data[0].sumDuration);
          console.log("%c---------------HI---------------","background: green"); */
          break
        }
        default: {
          break
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

  pageNoChangeHandler(id) {

    var params = Const.CONNECT_TYPE_CALL_LOG_DATA
    let month = this.state.month.replace('/', '')
    this.handleConnect(params, id, month)
  }

  dataFixingHandler(type, index) {
    var TempReturn = ' '
    var d = ''
    var time_data = []
    var seconds_data = []

    if (type === 'month') {
      d = this.state.month
      time_data = d.split('/')
      return (TempReturn = time_data[0] + '年' + time_data[1] + '月ご利用分')
    } else if (type === 'sumDuration') {
      d = this.state.api_data.sumDuration
      if (d) {
        time_data = d.toString().split(':')
        seconds_data = time_data[2].split('.')
        return (TempReturn =
          time_data[0] + '時間' + time_data[1] + '分' + seconds_data[0] + '秒')
      }
    }

    if (this.state.table_date.length > 0) {
      switch (type) {
        case 'duration':
          d = this.state.table_date[index].duration
          time_data = d.split(':')
          seconds_data = time_data[2].split('.')
          TempReturn =
            time_data[0] + '時間' + time_data[1] + '分' + seconds_data[0] + '秒'
          break
        case 'startTime':
          d = this.state.table_date[index].startTime
          time_data = d.split(':')
          seconds_data = time_data[2].split('.')
          TempReturn =
            time_data[0] + '時' + time_data[1] + '分' + seconds_data[0] + '秒'
          break
        case 'destination':
          TempReturn = this.state.table_date[index].destination
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  pagePrevious() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var last_val = parseInt($('#page_4').html())
    var prev_now_page_id = now_page_id - 1

    if (now_page_id > 1) {
      this.pageNoChangeHandler(prev_now_page_id)
    }
  }

  pageNext() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var last_val = parseInt($('#page_4').html())
    var next_now_page_id = now_page_id + 1

    if (this.state.table_date.length !== 1) {
      this.pageNoChangeHandler(next_now_page_id)
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

  ShowMonthdata(e, type) {
    e.preventDefault()
    var params = Const.CONNECT_TYPE_CALL_LOG_DATA

    switch (type) {
      case 'thisMonth': {
        var today = new Date()
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        var nowMonth = year + (month >= 10 ? '' + month : '0' + month)

        this.handleConnect(params, 1, nowMonth)
        break
      }

      case 'previousMonth': {
        var today = moment()
        today.subtract(1, 'months')
        var month = today.month() + 1
        var year = today.year()
        var nowMonth = year + (month >= 10 ? '' + month : '0' + month)

        this.handleConnect(params, 1, nowMonth)
        break
      }

      case 'lastMonth': {
        var today = moment()
        today.subtract(2, 'months')
        var month = today.month() + 1
        var year = today.year()
        var nowMonth = year + (month >= 10 ? '' + month : '0' + month)

        this.handleConnect(params, 1, nowMonth)
        break
      }
      default: {
        break
      }
    }
  }

  render() {
    this.items = this.state.table_date.map((item, key) => (
      <tr key={'tr' + key}>
        <td className="m-history_date">
          {item.date}
          <span className="a-fs-md">
            {this.dataFixingHandler('startTime', key)}
          </span>
        </td>
        <td>
          <dl className="m-history_dl">
            <dt className="a-sp">通話先</dt>
            <dd className="a-fw-bold">{item.callee}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-history_dl">
            <dt className="a-sp">通話時間</dt>
            <dd className="a-fw-bold">
              {this.dataFixingHandler('duration', key)}
            </dd>
          </dl>
        </td>
        <td>
          <dl className="m-history_dl">
            <dt className="a-sp">通話種別</dt>
            <dd className="a-fw-bold">
              {this.dataFixingHandler('destination', key)}
            </dd>
          </dl>
        </td>
      </tr>
    ))
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
                            '/mypage/call/usage/',
                            this.state.lineInfo[0]
                          )
                        }
                      >
                        通話料明細
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">通話履歴</li>
                  </ol>
                  <h1 className="a-h1">通話履歴</h1>

                  <div className="t-inner_wide">
                    <h2 className="a-h3 a-mb-5 a-fs-pc-30">
                      {' '}
                      {this.dataFixingHandler('month')}
                    </h2>
                    <h3 className="a-h4 a-fs-pc-26">
                      <span className="a-fw-normal">電話番号：</span>
                      <span>{this.state.lineInfo[0].lineNo}</span>
                    </h3>
                    <div className="m-tab">
                      <ul className="m-tab_nav">
                        <li className="m-tab_nav_item">
                          <a
                            className="m-tab_nav_btn is-active"
                            href=""
                            id="thisMonth"
                            onClick={(e) => this.ShowMonthdata(e, 'thisMonth')}
                          >
                            当月
                          </a>
                        </li>
                        <li className="m-tab_nav_item">
                          <a
                            className="m-tab_nav_btn"
                            href=""
                            id="previousMonth"
                            onClick={(e) =>
                              this.ShowMonthdata(e, 'previousMonth')
                            }
                          >
                            前月
                          </a>
                        </li>
                        <li className="m-tab_nav_item">
                          <a
                            className="m-tab_nav_btn"
                            href=""
                            id="LastMonth"
                            onClick={(e) => this.ShowMonthdata(e, 'lastMonth')}
                          >
                            前々月
                          </a>
                        </li>
                      </ul>

                      <div className="m-tab_body is-active" id="t1">
                        <div className="m-box-bg a-ta-center">
                          <div className="m-box_body">
                            <p className="m-box_historytotal a-fs-lg">
                              通話時間合計
                              <span className="a-fs-xl a-fs-pc-26 a-fw-bold">
                                {this.dataFixingHandler('sumDuration')}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* if have call log data */}
                        {(() => {
                          if (
                            this.state.table_date &&
                            this.state.table_date.length > 0
                          ) {
                            return (
                              <div>
                                <table className="m-history">
                                  <colgroup>
                                    <col />
                                    <col className="a-wd-22" />
                                    <col className="a-wd-22" />
                                    <col className="a-wd-22" />
                                  </colgroup>
                                  <thead className="a-pc">
                                    <tr>
                                      <th>開始時間</th>
                                      <th>通話先</th>
                                      <th>通話時間</th>
                                      <th>通話種別</th>
                                    </tr>
                                  </thead>
                                  <tbody>{this.items}</tbody>
                                </table>
                              </div>
                            )
                          } else {
                            // if there is no call log data
                            return (
                              <div
                                className="t-inner_full"
                                style={{ 'text-align': 'center' }}
                              >
                                <h2 className="a-h3 a-mb-5 a-fs-pc-30">
                                  通話履歴がありません
                                </h2>
                              </div>
                            )
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {this.state.table_date && this.state.table_date.length > 0 ? (
                    <Pager {...this.state.pagination} key="pager1" />
                  ) : null}

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

export default connect(mapStateToProps)(Call_History)
