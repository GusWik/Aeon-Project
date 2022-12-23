// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

// IMPORT MODULES
import Pager from '../../../modules/Pager.js'
import Header from '../../../modules/Header.js'

import icon_help from '../../../modules/images/icon_q.png'

class Operate extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.before_after_empty_fixing = this.before_after_empty_fixing.bind(this)

    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      api_data: [],
      table_data: [],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
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
      operateModal: false,
    }
  }

  handleConnect(type, data) {
    var params = data
    this.setState({ loading_state: true })
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    this.setState({ api_data: data.data })
    this.setState({ table_data: data.data.history })
    this.setState({ final_page: data.data.allPageNo })
    console.log(this.state.table_data)

    this.setState({ selected_page_id: data.data.pageNo })
    var pagination_copy = this.state.pagination
    pagination_copy.allPageNum = parseInt(data.data.allPageNo)
    pagination_copy.nowPageNo = parseInt(data.data.pageNo)

    this.setState({ pagination: pagination_copy })
    console.log('pagination_copy :: ', pagination_copy)
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_OPERATE
    var params = {
      customerId: window.customerId,
      perNum: 10,
      pageNo: 1,
    }
    this.handleConnect(Const.CONNECT_TYPE_MYPAGE_LOG_DATA, params)
  }

  pageNoChangeHandler(id) {
    var params = {
      customerId: window.customerId,
      perNum: 10,
      pageNo: id,
    }
    this.handleConnect(Const.CONNECT_TYPE_MYPAGE_LOG_DATA, params)
  }

  dataFixingHandler(type, index) {
    if (this.state.table_data.length > 0) {
      var TempReturn = ' '
      var d = ''
      var time_data = []
      var seconds_data = []
      switch (type) {
        case 'datetime_formatted':
          d = this.state.table_data[index].datetime
          time_data = d.split(':')
          seconds_data = time_data[2].split('.')
          TempReturn =
            time_data[0] + '時' + time_data[1] + '分' + seconds_data[0] + '秒'
          break
        case 'datetime':
          TempReturn = this.state.table_data[index].datetime
          break
        case 'detail':
          TempReturn = this.state.table_data[index].detail
          break
        case 'status':
          var _class = this.state.table_data[index].class
          var temp = this.state.table_data[index].status

          console.log(_class, temp)
          switch (_class) {
            case '91':
            case '90':
            case '13':
              if (temp === '1') {
                TempReturn = '申込'
              }
              break
            default:
              if (temp === '0') {
                TempReturn = 'お手続き中'
              } else if (temp === '1') {
                TempReturn = 'お手続き完了'
              } else if (temp === '6') {
                TempReturn = 'エラー'
              } else if (temp === '7') {
                TempReturn = 'キャンセル'
              } else if (temp === '8') {
                TempReturn = 'プラン変更失敗'
              } else if (temp === '9') {
                TempReturn = 'プラン取消受付完了'
              }
              break
          }
          break
        case 'before':
          TempReturn = this.state.table_data[index].before
          break
        case 'after':
          TempReturn = this.state.table_data[index].after
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  before_after_empty_fixing(key) {
    if (this.state.table_data[key].before || this.state.table_data[key].after) {
      return (
        <div className="m-operate_changes-arrow">
          <dl className="m-operate_dl-after">
            <dt className="a-sp">変更後</dt>
            <dd
              className="a-sp"
              style={{ paddingRight: '0.5rem', textAlign: 'right' }}
            >
              {this.dataFixingHandler('after', key)}
            </dd>
            <dd className="a-pc" style={{ textAlign: 'center' }}>
              {this.dataFixingHandler('after', key)}
            </dd>
          </dl>
        </div>
      )
    } else {
      return ''
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

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  render() {
    this.items = this.state.table_data.map((item, key) => (
      <tr key={'tr' + key}>
        <td className="m-operate_date">
          <span className="a-sp">
            {this.dataFixingHandler('datetime', key)}
          </span>
          <span className="a-pc">
            {this.dataFixingHandler('datetime_formatted', key)}
          </span>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">変更内容</dt>
            <dd>{this.dataFixingHandler('detail', key)}</dd>
          </dl>
        </td>
        <td>
          <dl className="m-operate_dl">
            <dt className="a-sp">状態</dt>
            <dd>{this.dataFixingHandler('status', key)}</dd>
          </dl>
        </td>
        <td>{this.before_after_empty_fixing(key)}</td>
      </tr>
    ))

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
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">マイページ操作履歴</li>
                  </ol>
                  <h1 className="a-h1">マイページ操作履歴</h1>
                  <div>
                    <p
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        onClick={() => {
                          this.setState({ operateModal: true })
                        }}
                      >
                        <img
                          src={icon_help}
                          style={{
                            marginRight: '0.2em',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '12px',
                            textDecoration: 'underline',
                          }}
                        >
                          状態について
                        </span>
                      </button>
                    </p>
                  </div>
                  <div className="t-inner_wide">
                    {(() => {
                      if (this.items.length) {
                        return (
                          <table className="m-operate">
                            <colgroup>
                              <col />
                              <col />
                              <col />
                              <col />
                            </colgroup>
                            <thead className="a-pc">
                              <tr>
                                <th>受付日時</th>
                                <th>変更内容</th>
                                <th>状態</th>
                                <th>
                                  <div className="m-operate_changes">
                                    <span className="m-operate_changes_after">
                                      変更後
                                    </span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="m-operate_tbody">
                              {this.items}
                            </tbody>
                          </table>
                        )
                      } else {
                        return (
                          <p style={{ textAlign: 'center' }}>
                            表示出来る操作履歴がありません
                          </p>
                        )
                      }
                    })()}
                  </div>

                  <Pager {...this.state.pagination} key="pager1" />

                  <p className="m-btn">
                    <a
                      className="a-btn"
                      href=""
                      onClick={(e) => this.goNextDisplay(e, '/')}
                    >
                      トップページへ
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

        {this.state.operateModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ operateModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  状態について
                </h3>
              </div>
              <div style={{ marginTop: '40px' }}>
                <table className="operateTable">
                  <thead>
                    <tr>
                      <th>状態</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>手続き中</th>
                      <td>お手続き中です。</td>
                    </tr>
                    <tr>
                      <th>エラー</th>
                      <td>
                        何らかの理由によりお申し込みが正常に完了しておりません。再度お申し込みをお願いいたします。
                      </td>
                    </tr>
                    <tr>
                      <th>キャンセル</th>
                      <td>お手続きをキャンセルしました。</td>
                    </tr>
                    <tr>
                      <th>手続き完了</th>
                      <td>お手続き完了です。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p
                  style={{
                    margin: '30px 0 0',
                    fontSize: '14px',
                    lineHeight: 1.8,
                  }}
                >
                  ※プラン切り替えの適用は手続完了日の翌月となります。
                  <br />
                  ※かけ放題オプションの切り替え（かけ放題種別の変更）は、手続き完了日の翌月となります。
                  <br />
                  ※手続き完了日が月末付近の場合は、適用が翌々月になる場合がございます。
                </p>
              </div>
            </div>
          </div>
        )}
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

export default connect(mapStateToProps)(Operate)
