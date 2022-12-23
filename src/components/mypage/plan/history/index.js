// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

// IMPORT MODULES
import Pager from '../../../../modules/Pager.js'
import Header from '../../../../modules/Header.js'

class Plan_History extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataHistoryHandler = this.dataHistoryHandler.bind(this)
    this.before_after_empty_fixing = this.before_after_empty_fixing.bind(this)

    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      api_data: [],
      planChangeHistory: [],
      // LINE INFO
      lineInfo: [
        {
          lineDiv:
            props.history.location.state !== undefined
              ? props.history.location.state.lineDiv
              : '',
          lineKeyObject:
            props.history.location.state !== undefined
              ? props.history.location.state.lineKeyObject
              : '',
        },
      ],
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
    this.setState({ planChangeHistory: data.data.planChangeHistory })
    this.setState({ final_page: data.data.allPageNo })

    this.setState({ selected_page_id: data.data.pageNo })
    var pagination_copy = this.state.pagination
    pagination_copy.allPageNum = parseInt(data.data.allPageNo)
    pagination_copy.nowPageNo = parseInt(data.data.pageNo)

    this.setState({ pagination: pagination_copy })
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_OPERATE
    var params = {
      lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      lineDiv: this.state.lineInfo[0].lineDiv,
      perNum: 10,
      pageNo: 1,
    }
    this.handleConnect(Const.CONNECT_TYPE_PLAN, params)
  }

  pageNoChangeHandler(id) {
    var params = {
      lineKeyObject: this.state.lineInfo[0].lineKeyObject,
      lineDiv: this.state.lineInfo[0].lineDiv,
      perNum: 10,
      pageNo: id,
    }
    this.handleConnect(Const.CONNECT_TYPE_PLAN, params)
  }

  dataHistoryHandler(type, index) {
    if (this.state.planChangeHistory.length > 0) {
      var TempReturn = ' '
      var d = ''
      var time_data = []
      var seconds_data = []
      switch (type) {
        case 'datetime':
          TempReturn = this.state.planChangeHistory[index].mousikomiDate
          break
        case 'datetime_formatted':
          d = this.state.planChangeHistory[index].mousikomiDate
          time_data = d.split(':')
          seconds_data = time_data[2].split('.')
          TempReturn =
            time_data[0] + '時' + time_data[1] + '分' + seconds_data[0] + '秒'
          TempReturn = d
          break
        case 'status':
          var temp = this.state.planChangeHistory[index].status
          switch (temp) {
            case '01':
              if (this.state.planChangeHistory[index].mousikomi_type == '02') {
                TempReturn = '取消依頼中'
              } else {
                TempReturn = '申請依頼中'
              }
              break
            case '02':
              TempReturn = '取消完了'
              break
            case '03':
              TempReturn = '申請依頼中'
              break
            case '04':
              TempReturn = '申請完了'
              break
            case '05':
              TempReturn = '申請失敗'
              break
            case '06':
              TempReturn = '取消完了'
              break
            case '07':
              TempReturn = '取消失敗'
              break
            case '08':
              TempReturn = '反映済み'
              break
            case '09':
              TempReturn = '反映失敗'
              break
            case '10':
              TempReturn = '反映中'
              break
            default:
              break
          }
          break
        case 'targetMonth':
          var year = this.state.planChangeHistory[index].targetMonth.substring(
            0,
            4
          )
          var month = this.state.planChangeHistory[index].targetMonth.substring(
            4
          )
          var day = '01'
          TempReturn = year + '/' + month + '/' + day
          break
        case 'before':
          TempReturn = this.state.planChangeHistory[index].nowserviceName
          break
        case 'after':
          TempReturn = this.state.planChangeHistory[index].changeserviceName
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
    if (
      this.state.planChangeHistory[key].changeserviceName ||
      this.state.planChangeHistory[key].nowserviceName
    ) {
      return (
        <div className="m-operate_changes-arrow">
          <dl className="m-operate_dl-before">
            <dt className="a-sp">変更前</dt>
            <dd>{this.dataHistoryHandler('before', key)}</dd>
          </dl>
          <dl className="m-operate_dl-after">
            <dt className="a-sp">変更後</dt>
            <dd>{this.dataHistoryHandler('after', key)}</dd>
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

  renderHistory() {
    let items = this.state.planChangeHistory.length ? (
      this.state.planChangeHistory.map((item, key) => (
        <tr key={'tr' + key}>
          <td className="m-operate_date">
            <span className="a-sp">
              {this.dataHistoryHandler('datetime', key)}
            </span>
            <span className="a-pc">
              {this.dataHistoryHandler('datetime_formatted', key)}
            </span>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">プラン適用日</dt>
              <dd>{this.dataHistoryHandler('targetMonth', key)}</dd>
            </dl>
          </td>
          <td>
            <dl className="m-operate_dl">
              <dt className="a-sp">状態</dt>
              <dd>{this.dataHistoryHandler('status', key)}</dd>
            </dl>
          </td>
          <td>{this.before_after_empty_fixing(key)}</td>
        </tr>
      ))
    ) : (
      <td colSpan="3">
        <div style={{ padding: '2rem' }}>プラン変更履歴はありません。</div>
      </td>
    )
    return items
  }

  render() {
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
                  <h1 className="a-h1">プラン変更履歴一覧</h1>
                  <div className="t-inner_wide">
                    <table className="m-operate">
                      <colgroup>
                        <col />
                        <col />
                        <col />
                        <col className="a-wd-45" />
                      </colgroup>
                      <thead className="a-pc">
                        <tr>
                          <th>受付日時</th>
                          <th>プラン適用日</th>
                          <th>状態</th>
                          <th>
                            <div className="m-operate_changes">
                              <span className="m-operate_changes_before">
                                変更前
                              </span>
                              <span className="m-operate_changes_after">
                                変更後
                              </span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="m-operate_tbody">
                        {this.renderHistory()}
                      </tbody>
                    </table>
                  </div>

                  <Pager {...this.state.pagination} key="pager1" />

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

export default connect(mapStateToProps)(Plan_History)
