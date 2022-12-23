import React from 'react'
import { connect } from 'react-redux'

import * as Const from '../Const.js'

//各種モジュールを読み込み
import ComponentBase from './ComponentBase.js'

import Charts from '../modules/Charts.js'
import PieCharts from '../modules/PieChart.js'
import * as Chart_default from '../modules/Chart_const.js'

//通信用のモジュールを読み込み
import { dispatchPostConnections } from '../actions/PostActions.js'
import { setConnectionCB } from '../actions/PostActions.js'

class Chart_line extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.state = {
      charts: [
        {
          data: [
            //main value set
            { name: '1', GB: 2 },
            { GB: 5 },
            { GB: 3 },
            { GB: 4 },
            { GB: 8 },
            { GB: 5 },
            { GB: 2 },
            { GB: 8 },
            { GB: 7 },
            { name: '10', GB: 4 },
            { GB: 2 },
            { GB: 6 },
            { GB: 5 },
            { GB: 5 },
            { GB: 3 },
            { GB: 5 },
            { GB: 3 },
            { GB: 4 },
            { GB: 1 },
            { name: '20', GB: 5 },
            { GB: 4 },
            { GB: 4 },
            { GB: 6 },
            { GB: 2 },
            { GB: 8 },
            { GB: 5 },
            { GB: 7 },
            { GB: 8 },
            { GB: 3 },
            { name: '30', GB: 2 },
            {},
          ],
          Y_value: [0, 50], // max value of y-axis
          Y_lable: 'GB', // topic of y-axis
          X_lable: '日', // topic of x-axis
          width: 800,
          height: 300,
        },
        {
          chartData: {
            labels: ['', 'ご契約分', '繰越。追加分'],
            datasets: [
              {
                data: [50, 50, 0],
                backgroundColor: ['#FFFFFF', '#FFAFE8', '#B50080'],
                hoverBackgroundColor: ['#FFFFFF', '#FFAFE8', '#B50080'],
                hoverBorderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
                borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
              },
              {
                data: [0, 20, 80],
                backgroundColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                hoverBackgroundColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                hoverBorderColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                borderColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                borderWidth: 1,
              },
              {
                data: [0, 20, 80],
                backgroundColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                hoverBackgroundColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                hoverBorderColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                borderColor: ['#FFFFFF', '#CCCCCC', '#B50080'],
                borderWidth: 1,
              },
              Chart_default.middle_cover,
            ],
          },
        },
      ],
      //プログレス表現の表示状況
      loading_state: false,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    this.handleConnect(Const.CONNECT_TYPE_TOPDATA)
  }

  //通信処理
  handleConnect(type) {
    //console.log("type :: " + type);
    var params = {}
    //プログレス表示
    this.setState({ loading_state: true })
    //通信
    setConnectionCB(this.handleConnectChange)
    this.props.dispatch(dispatchPostConnections(type, params))
  }

  //通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    console.log(data)
  }

  //画面レイアウト
  render() {
    return (
      <React.Fragment>
        <div>
          <div className="chart_test_1">
            <Charts {...this.state.charts[0]} key="chart0" />
          </div>
          <div className="pieChart_test">
            <div className="pieChart_center">
              残り
              <br />
              データ通信な医量
              <br />
              <span className="pieChart_center_val1">5.37</span>GB
              <div className="pieChart_hr"></div>
              <div className="pieChart_center_val2">
                /4<span className="pieChart_center_val_sub1">GB</span>
                <br />
                <span className="pieChart_center_bottom">(当月分)</span>
              </div>
            </div>
            <PieCharts
              {...this.state.charts[1]}
              key="chart1"
              className="pieChart_outer"
            />
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

export default connect(mapStateToProps)(Chart_line)
