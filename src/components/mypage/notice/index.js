import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import $ from 'jquery'
import FileSaver from 'file-saver'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const.js'
import Pager from '../../../modules/Pager.js'

import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

class Notice extends ComponentBase {
  constructor(props) {
    super(props)

    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)

    this.state = {
      notice_data: {},
      notice_log_data: [],
      table_data: [],
      final_page: 4,
      loading_state: false,
      selected_page_id: 1,
      selected_page_value: 1,
      state_lock: true,
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
      pagination: {
        allPageNum: 0,
        nowPageNo: 0,
        callback: this.pageNoChangeHandler,
      },
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
      downloadedLog: null,
    }

    Notice.PropTypes = {
      location: ReactRouterPropTypes.location.isRequired,
      history: ReactRouterPropTypes.history.isRequired,
      route: ReactRouterPropTypes.route.isRequired,
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
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_NOTICE

    this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_DATA, 0)
  }

  handleConnect(type, page) {
    var params = {}
    this.setState({ loading_state: true })

    if (type === Const.CONNECT_TYPE_NOTIFICATION_DATA) {
      params = {
        customerId: window.customerId,
      }
    } else if (type === Const.CONNECT_TYPE_NOTIFICATION_LOG_DATA) {
      params = {
        customerId: window.customerId,
        pageNum: 10,
        pageNo: page,
      }
    } else if (type === Const.CONNECT_TYPE_DOWNLOAD_NOTIFICATION_LOG_DATA) {
      params = {
        customerId: window.customerId,
        id: page,
      }
    }

    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    switch (type) {
      case Const.CONNECT_TYPE_NOTIFICATION_DATA: {
        this.setState({ notice_data: data.data })

        if (this.state.notice_data.status === '1') {
          $('#notice1').prop('checked', true)
        } else {
          $('#notice2').prop('checked', true)
        }

        this.handleConnect(Const.CONNECT_TYPE_NOTIFICATION_LOG_DATA, 1)
        break
      }
      case Const.CONNECT_TYPE_NOTIFICATION_LOG_DATA: {
        this.setState({ notice_log_data: data.data })
        this.setState({ table_data: data.data.history })
        this.setState({ final_page: data.data.allPageNo })

        this.setState({ selected_page_id: data.data.pageNo })
        var pagination_copy = this.state.pagination
        pagination_copy.allPageNum = parseInt(data.data.allPageNo)
        pagination_copy.nowPageNo = parseInt(data.data.pageNo)

        this.setState({ pagination: pagination_copy })
        break
      }
      case Const.CONNECT_TYPE_DOWNLOAD_NOTIFICATION_LOG_DATA: {
        const PDF = Buffer.from(data.data.PDF, 'base64')
        let blob = new Blob([PDF], { type: 'application/pdf' })
        let title = this.state.downloadedLog.title
        FileSaver.saveAs(blob, `${title}.pdf`)
        break
      }
      default: {
        break
      }
    }
  }

  pageNoChangeHandler(id) {
    var params = Const.CONNECT_TYPE_NOTIFICATION_LOG_DATA

    this.handleConnect(params, id)
  }

  dataFixingHandler(type, index) {
    if (this.state.table_data.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'datetime':
          var selectedDateTime = this.state.table_data[index].datetime
          var splitarray = new Array()
          splitarray = selectedDateTime.split(' ')
          TempReturn = splitarray[0]

          var i = 0
          var tmpLength = TempReturn.length
          for (i; i < tmpLength; i++) {
            TempReturn = TempReturn.replace('-', '/')
          }
          //  TempReturn = splitarray[0];
          break
        case 'title':
          TempReturn = this.state.table_data[index].title
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else if (this.state.notice_data.length > 0) {
      switch (type) {
        case 'status':
          TempReturn = this.state.notice_data[index].status
          break
        default:
          TempReturn = ' '
      }
    } else {
      return ' '
    }
  }

  pagePrevious() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var prev_now_page_id = now_page_id - 1

    if (now_page_id > 1) {
      this.pageNoChangeHandler(prev_now_page_id)
    }
  }

  pageNext() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var next_now_page_id = now_page_id + 1

    if (this.state.table_date.length !== 1) {
      this.pageNoChangeHandler(next_now_page_id)
    }
  }

  // NEXT画面に遷移する
  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/mypage/notice/change') {
      var status = 1
      if ($('#notice1:checked').val()) {
        status = 1
      } else if ($('#notice2:checked').val()) {
        status = 2
      }
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.status = status
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  // ダウンロードデータをPDF保存する
  downloadLog(e, item) {
    e.preventDefault()
    this.setState({ downloadedLog: item })
    this.handleConnect(
      Const.CONNECT_TYPE_DOWNLOAD_NOTIFICATION_LOG_DATA,
      item.id
    )
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
  disableLine() {
    $('#diableLine').hide()
  }

  render() {
    $('#diableLine').show()
    this.items = this.state.table_data.map((item, key) => (
      <div key={'tr' + key}>
        <li className="m-news_item">
          <a
            className="m-news_link"
            href=""
            onClick={(e) => this.downloadLog(e, item)}
          >
            <time className="m-news_time" dateTime="2018-09-27">
              {this.dataFixingHandler('datetime', key)}
            </time>
            <div className="m-news_excerpt">
              {this.dataFixingHandler('title', key)}
            </div>
          </a>
        </li>
      </div>
    ))
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} />
          } else {
            return <React.Fragment />
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
                    <li className="m-breadcrumb_item">完了通知</li>
                  </ol>
                  <h1 className="a-h1 a-mb-0">完了通知</h1>
                  <div className="t-inner_full">
                    <div className="m-news">
                      <ul className="m-news_list" id="diableLine">
                        {/* {this.items} */}
                        {this.items.length > 0
                          ? this.items
                          : this.disableLine()}
                      </ul>
                    </div>
                  </div>
                  <Pager {...this.state.pagination} key="pager1" />
                  <div className="m-news">
                    <div className="m-guide_media_body">
                      <p style={{ color: '#b50080' }}>
                        過去２年分の完了通知がご確認いただけます。
                      </p>
                      <p
                        className="a-fs-sm"
                        style={{ paddingLeft: '1.3em', textIndent: '-1.3em' }}
                      >
                        ※&nbsp;２年を超過した完了通知は表示されなくなりますので、
                        必要に応じてお客さまにてダウンロードまたは印刷して保管をお願いします。
                      </p>
                      <p
                        className="a-fs-sm"
                        style={{ paddingLeft: '1.3em', textIndent: '-1.3em' }}
                      >
                        ※&nbsp;完了通知の閲覧サービス開始前の、2019年9月4日以前の完了通知はご確認いただけません。
                      </p>
                    </div>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div className="m-form">
                    <h2 className="a-h2">各種完了通知書の受け取り方法</h2>
                    <p>
                      各種完了通知書の受け取り方法を「郵送」または「メールで通知」から選ぶことができます。
                    </p>
                    <div className="m-form_section">
                      <div className="m-field">
                        <div className="m-field_control-check">
                          <label
                            htmlFor="notice1"
                            style={{ cursor: 'default' }}
                          >
                            <input
                              className="a-input-radio"
                              type="radio"
                              name="notice"
                              id="notice1"
                              disabled={this.state.notice_data.status == 2}
                            />
                            <span>郵送</span>
                          </label>
                        </div>
                        <div className="m-field_control-check">
                          <label
                            htmlFor="notice2"
                            style={{ cursor: 'default' }}
                          >
                            <input
                              className="a-input-radio"
                              type="radio"
                              name="notice"
                              id="notice2"
                              disabled={this.state.notice_data.status == 1}
                            />
                            <span>メールで通知</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">
                          <a
                            className="a-btn"
                            href=""
                            onClick={(e) =>
                              this.goNextDisplay(
                                e,
                                '/mypage/notice/change',
                                this.state.notice_data
                              )
                            }
                          >
                            受け取り方法を変更する
                          </a>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            onClick={() => {
                              this.props.history.push('/login')
                            }}
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

export default connect(mapStateToProps)(Notice)
