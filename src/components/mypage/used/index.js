import React from 'react'
import { connect } from 'react-redux'

// CSS
import '../../assets/css/common.css'

// IMPORT DIALOG
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

// BASIC ITEMS
import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const'
import Charts from '../../../modules/Charts'

// API CONNECTIONS
import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

class Used extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.setDataOfTheGraph = this.setDataOfTheGraph.bind(this)
    this.dateCrop = this.dateCrop.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      user_nick_name: '',
      api_data: [],
      dataUseArray: [],
      dataUse30day: [],
      data_speed: 0,
      charts: [
        {
          data: [],
          Y_value: [0, 20], // max value of y-axis
          Y_lable: 'GB', // topic of y-axis
          X_lable: '日', // topic of x-axis
          width: 1000,
          height: 200,
        },
      ],
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
    document.title = Const.TITLE_MYPAGE_USED
    this.handleConnect(Const.CONNECT_TYPE_USE_DATA_LIST)
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  // 通信処理
  handleConnect(type) {
    console.log('type :: ' + type)
    // FIXING INPUT PARAMETERS
    var params = {}
    if (type === Const.CONNECT_TYPE_USE_DATA_LIST) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
      params = {
        lineKeyObject: this.state.lineInfo[0].lineKeyObject,
        lineNo: this.state.lineInfo[0].lineNo,
        lineDiv: this.state.lineInfo[0].lineDiv,
      }
    }

    // プログレス表示
    this.setState({ loading_state: true })
    // 通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  setDataOfTheGraph(x, resize = false) {
    var data_speed = 'lowSpeedGB'
    if (this.state.data_speed === 1) {
      data_speed = 'highSpeedGB'
    } else {
      data_speed = 'lowSpeedGB'
    }
    var graph_data = []
    let item = {}

    /* for(var j=0; j<=31; j++){
                        item = {GB : "0.00"};
                        var nmber_x = "0";
                        // if (j<10){
                        //     nmber_x = nmber_x + j;
                        // }else{
                        //     nmber_x = j;
                        // }

                        if (j < 10 ){
                            item.name = "0"+j;
                        } else {
                            item.name = j;
                        }

                        if(resize){
                            switch (j) {
                                case 10:
                                    item.name = 10;
                                    break;
                                case 20:
                                    item.name = 20;
                                    break;
                                case 30:
                                    item.name = 30;
                                    break;
                                default :
                                    item.name = "";

                            }
                        }

                        if(j === 0 || j === 31){
                            item = {};
                        }
                        graph_data.push(item);
                        for(var i=0; i<x.length; i++){
                            if (this.dateCrop(x[i].date)== j){
                                graph_data[j].GB = x[i][data_speed];
                                // graph_data[j].GB = i;
                            }
                        }
                    } */

    item = {}
    graph_data.push(item)
    for (var j = x.length - 1; j > -1; j--) {
      item = { GB: x[j][data_speed] }
      var d = x[j].date
      var time_data = d.split('/')
      item.name = time_data[2]
      graph_data.push(item)
    }

    item = {}
    graph_data.push(item)

    var chart_details = this.state.charts
    chart_details[0].data = graph_data
    this.setState({ charts: chart_details })
  }

  updateDimensions() {
    var width = window.innerWidth * 0.9
    var chart_details = this.state.charts
    if (width > 1000) width = 1000
    chart_details[0].width = width === 0 ? chart_details[0].width : width
    this.setState({ charts: chart_details })
  }

  dateCrop(d) {
    var time_data = d.split('/')
    return time_data[2]
  }

  dataFixingHandler(type, index, sub_index) {
    if (
      this.state.api_data[type] !== undefined &&
      this.state.api_data[type] !== null
    ) {
      var TempReturn = ' '
      var d = ''
      var time_data = []
      var seconds_data = []
      var data_speed = this.state.data_speed
      switch (type) {
        case 'dataUseArray':
          if (data_speed === 1) {
            if (sub_index === 'GB') {
              TempReturn = this.state.api_data.dataUseArray[index].highSpeedGB
            } else {
              TempReturn = this.state.api_data.dataUseArray[index].highSpeedMB
            }
          } else {
            if (sub_index === 'GB') {
              TempReturn = this.state.api_data.dataUseArray[index].lowSpeedGB
            } else {
              TempReturn = this.state.api_data.dataUseArray[index].lowSpeedMB
            }
          }
          break
        case 'dataUse30day':
          if (data_speed === 1) {
            if (sub_index === 'GB') {
              TempReturn = this.state.api_data.dataUse30day.highSpeedGB
            } else {
              TempReturn = this.state.api_data.dataUse30day.highSpeedMB
            }
          } else {
            if (sub_index === 'GB') {
              TempReturn = this.state.api_data.dataUse30day.lowSpeedGB
            } else {
              TempReturn = this.state.api_data.dataUse30day.lowSpeedMB
            }
          }
          break
        case 'date':
          d = this.state.api_data.dataUseArray[index].date
          time_data = d.split('/')
          TempReturn = time_data[2] + '日'
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }

  convartDate(d, key) {
    let month = ''
    let date = new Date(d)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    var time_data = d.split('/')
    if (key == 0 || lastDay.getDate() == date.getDate())
      month = time_data[1] + '月'
    if (month) {
      return (
        <div>
          <span style={{ width: '40px', display: 'inline-block' }}>
            {month}
          </span>
          <span>{time_data[2] + '日'}</span>
        </div>
      )
    } else {
      return (
        <div>
          <span style={{ width: '40px', display: 'inline-block' }} />
          <span>{time_data[2] + '日'}</span>
        </div>
      )
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    // IF NO ERROR IN CONNECTION
    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_USE_DATA_LIST) {
        this.setState({ api_data: data.data })
        this.setState({ dataUseArray: data.data.dataUseArray })
        console.log('sachin 1', data.data)
        this.setState({ data_speed: 1 })
        this.setState({ dataUse30day: data.data.dataUse30day })
        this.setDataOfTheGraph(data.data.dataUseArray)
      } else if (type === Const.CONNECT_TYPE_SIM_DATA) {
        this.setState({ user_nick_name: data.data.nickName })
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
    const custom_style = {
      background: 'white',
    }

    this.items = this.state.dataUseArray.map((item, key) => (
      <tr key={'table_row_' + key}>
        <th style={{ minWidth: '100px' }}>
          {this.convartDate(item.date, key)}
        </th>
        <td className="a-fw-bold">
          {this.dataFixingHandler('dataUseArray', key, 'GB')}
          <span className="a-nowrap">GB</span>
        </td>
        <td className="a-weak" style={{ minWidth: '120px' }}>
          ({this.dataFixingHandler('dataUseArray', key, 'MB')}
          <span className="a-nowrap">MB</span>)
        </td>
      </tr>
    ))

    this.header = (
      <tr key={'table_top_1'}>
        <th style={{ minWidth: '100px' }}>過去30日分の合計</th>
        <td className="a-fw-bold">
          {this.dataFixingHandler('dataUse30day', null, 'GB')}
          <span className="a-nowrap">GB</span>
        </td>
        <td className="a-weak" style={{ minWidth: '120px' }}>
          ({this.dataFixingHandler('dataUse30day', null, 'MB')}
          <span className="a-nowrap">MB</span>)
        </td>
      </tr>
    )

    this.chart = <Charts {...this.state.charts[0]} key="chart0" />
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
                    <li className="m-breadcrumb_item">過去30日分の使用量</li>
                  </ol>
                  <h1 className="a-h1">過去30日分の使用量</h1>
                  <div className="t-inner_wide">
                    <div className="m-box-bg a-ta-center">
                      <div className="m-box_body">
                        <h2 className="a-h3">
                          {this.state.user_nick_name}
                          <br />
                          {'（電話番号：' +
                            (this.props.history.location.state !== undefined
                              ? this.props.history.location.state.lineNo
                              : '') +
                            '）'}
                        </h2>
                      </div>
                    </div>
                    <div className="m-graph" id="graph_cover">
                      {this.chart}
                    </div>
                    <table className="a-table a-table-between">
                      <colgroup>
                        <col />
                        <col className="a-wd-35 a-wd-pc-15" />
                        <col claclassNamess="a-wd-35 a-wd-pc-15" />
                      </colgroup>
                      <tbody>
                        {this.header}
                        {this.items}
                      </tbody>
                    </table>
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

export default connect(mapStateToProps)(Used)
