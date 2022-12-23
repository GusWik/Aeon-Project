import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'
import Dialog from '../../../modules/Dialog.js'

import ComponentBase from '../../ComponentBase.js'

import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

class News_Detail extends ComponentBase {
  constructor(props) {
    super(props)
    console.log(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    let noticeId
    if (props.match.params.noticeId) {
      noticeId = props.match.params.noticeId
    } else {
      noticeId =
        props.history.location.state !== undefined
          ? props.history.location.state.noticeId
          : ''
    }
    this.state = {
      noticeId,
      notice_data: {},
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
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_NEWS_DETAIL
    if (this.state.noticeId === 0 || this.state.noticeId) {
      this.handleConnect(Const.CONNECT_TYPE_NOTICE_DETAIL_DATA)
    }
  }

  handleConnect(type) {
    var params = {}
    this.setState({ loading_state: true })

    if (type === Const.CONNECT_TYPE_NOTICE_DETAIL_DATA) {
      params = {
        noticeId: this.state.noticeId,
      }
    }

    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_NOTICE_DETAIL_DATA: {
          this.setState({ notice_data: data.data })
          document.title = data.data.title
          $('.m-news_body').html(this.state.notice_data.noticeText)
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

  dataFixingHandler(type, index) {
    var TempReturn = ' '
    switch (type) {
      case 'date':
        TempReturn = this.state.notice_data.date
        break
      case 'title':
        TempReturn = this.state.notice_data.title
        break
      case 'noticeText':
        TempReturn = this.state.notice_data.noticeText
        break
      default:
        TempReturn = ' '
    }
    return TempReturn
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

  // NEXT画面に遷移する
  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/news/') {
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
    // this.News_head = this.state.notice_data.map((item, key) => (
    //   <div key={"tr" + key} />
    // ));
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
                  {(() => {
                    if (localStorage.getItem('isLoggedIn') === '1') {
                      return (
                        <ol className="m-breadcrumb">
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) => this.goNextDisplay(e, '/')}
                            >
                              TOP
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) =>
                                this.goNextDisplay(e, '/mypage/news/')
                              }
                            >
                              お知らせ一覧
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            {this.dataFixingHandler('title', 0)}
                          </li>
                        </ol>
                      )
                    } else {
                      return (
                        <ol className="m-breadcrumb">
                          <li className="m-breadcrumb_item">
                            <a
                              href=""
                              onClick={(e) => this.goNextDisplay(e, '/login/')}
                            >
                              ログイン
                            </a>
                          </li>
                          <li className="m-breadcrumb_item">
                            {this.dataFixingHandler('title', 0)}
                          </li>
                        </ol>
                      )
                    }
                  })()}
                  <h1 className="a-h1">{this.dataFixingHandler('title', 0)}</h1>
                  <div className="m-news">
                    <div className="m-news_header">
                      <time className="m-news_time" dateTime="2018-10-17">
                        {this.dataFixingHandler('date', 0)}
                      </time>
                      <h2 className="a-h3">
                        {this.dataFixingHandler('title', 0)}
                      </h2>
                    </div>
                    <div className="m-news_body">
                      {(() => {
                        /* if(this.dataFixingHandler("noticeText", 0) !== undefined){
                          return(
                            <div>
                            {this.dataFixingHandler("noticeText", 0)}
                            </div>
                          );
                        }else{
                          return(
                            <div>
                            {this.dataFixingHandler("noticeText", 0)}
                            </div>
                          );
                        } */
                      })()}
                      {/* <p>{this.dataFixingHandler("noteceText",key)}</p> */}
                    </div>
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

export default connect(mapStateToProps)(News_Detail)
