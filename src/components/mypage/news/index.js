import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const'
import Pager from '../../../modules/Pager.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'
import Dialog from '../../../modules/Dialog.js'

import ComponentBase from '../../ComponentBase.js'

import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

class News extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      api_data: [],
      table_data: [],
      final_page: 4,
      loading_state: false,
      selected_page_id: 1,
      selected_page_value: 1,
      state_lock: true,
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
    document.title = Const.TITLE_MYPAGE_NEWS

    var params = Const.CONNECT_TYPE_NOTICE_LIST_DATA
    this.handleConnect(params, 1)

    // for hide impo and normal noticess
    this.impo_Counter = 0
    this.normal_Counter = 0

    // checkAll important data count
    this.important_dataCount = 0
  }

  handleConnect(type, page) {
    var params = {}
    this.setState({ loading_state: true })
    // change when api fixed...
    if (type === Const.CONNECT_TYPE_NOTICE_LIST_DATA) {
      params = {
        perNum: '10',
        pageNo: page.toString(),
      }
    }
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_NOTICE_LIST_DATA: {
          console.log('data.data.noticeArray', data.data.noticeArray)
          this.setState({ api_data: data.data })
          this.setState({ table_data: data.data.noticeArray })
          this.setState({ final_page: data.data.allPageNo })
          this.setState({ selected_page_id: data.data.pageNo })

          var pagination_copy = this.state.pagination
          pagination_copy.allPageNum = parseInt(data.data.allPageNo)
          pagination_copy.nowPageNo = parseInt(data.data.pageNo)

          this.setState({ pagination: pagination_copy })
          console.log('pagination_copy :: ', pagination_copy)
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

  pageNoChangeHandler(id) {
    var params = Const.CONNECT_TYPE_NOTICE_LIST_DATA
    this.handleConnect(params, id)
  }

  dataFixingHandler(type, index) {
    if (this.state.table_data.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'importantFlg':
          TempReturn = this.state.table_data[index].importantFlg
          break
        case 'date':
          TempReturn = this.state.table_data[index].date
          break
        case 'title':
          TempReturn = this.state.table_data[index].title
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

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mypage')
          break
      }
    }
  }

  // NEXT画面に遷移する
  goNextDisplay(e, url, params) {
    e.preventDefault()
    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/news/detail/':
        // NEED TO SEND THE CUSTOMER ID
        url = url + params.noticeId
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

  NewsHandler(type) {
    if (type === 'important') {
      $('#impo_news').hide()
      return null
    }

    if (type === 'normal') {
      $('#normal_news').hide()
      return null
    }
  }

  // if have news...
  NewsShowHandler(type) {
    if (type === 'important') {
      this.impo_Counter = 1
    }

    if (type === 'normal') {
      this.normal_Counter = 1
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
    this.Notice = this.state.table_data.map((Notice, key) => (
      <div key={'tr' + key}>
        {this.dataFixingHandler('importantFlg', key) === 0 ? (
          <li className="m-news_item">
            <a
              className="m-news_link"
              href=""
              onClick={(e) =>
                this.goNextDisplay(e, '/mypage/news/detail/', Notice)
              }
            >
              {this.NewsShowHandler('normal')} {/* checking normal news>0 */}
              <time className="m-news_time" dateTime="2018-10-17">
                {this.dataFixingHandler('date', key)}
              </time>
              <div className="m-news_excerpt">
                {this.dataFixingHandler('title', key)}
              </div>
            </a>
          </li>
        ) : (
          this.NewsHandler('normal')
        )}
      </div>
    ))

    this.ImpoNotice = this.state.table_data.map((ImpoNotice, key) => {
      if (this.dataFixingHandler('importantFlg', key) === 1) {
        this.important_dataCount++
        return (
          <li className="m-news_item-important">
            <a
              className="m-news_link-important"
              href=""
              onClick={(e) =>
                this.goNextDisplay(e, '/mypage/news/detail/', ImpoNotice)
              }
            >
              <div className="m-news_label">
                <span className="a-label-important">重要</span>
              </div>
              <div key={'tr' + key}>
                {this.dataFixingHandler('importantFlg', key) === 1 ? (
                  <div>
                    <div className="m-news_excerpt">
                      {this.NewsShowHandler('important')}{' '}
                      {/* checking Important news>0 */}
                      {this.dataFixingHandler('title', key)}
                    </div>
                  </div>
                ) : (
                  this.NewsHandler('important')
                )}
              </div>
            </a>
          </li>
        )
      }
    })

    if (this.impo_Counter === 1) {
      $('#impo_news').show()
    }

    // if imporatntnews=10 hide normal news
    if (this.important_dataCount >= 10) {
      $('#normal_news').hide()
      this.important_dataCount = 0
    } else {
      // Atleast one normal news
      if (this.normal_Counter === 1) {
        $('#normal_news').show()
      }
      this.important_dataCount = 0
    }

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
                    <li className="m-breadcrumb_item">お知らせ一覧</li>
                  </ol>
                  <h1 className="a-h1 a-mb-0">お知らせ一覧</h1>

                  {/* if there is no data */}
                  {this.state.table_data.length > 0 ? (
                    <div>
                      <div className="t-inner_full">
                        <div className="m-news">
                          <ul className="m-news_list" id="impo_news">
                            {this.ImpoNotice}
                          </ul>
                          <ul
                            className="m-news_list"
                            style={{
                              borderTop: 'none',
                            }}
                          >
                            <div className="m-news_label" id="normal_news">
                              <span className="a-label-news"> お知らせ</span>
                            </div>
                            {this.Notice}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="t-inner_full">
                      <div className="m-news">
                        <p className="m-news_message">お知らせはありません。</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Pager {...this.state.pagination} key="pager1" />

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

export default connect(mapStateToProps)(News)
