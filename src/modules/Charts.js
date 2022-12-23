import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

//CSS読み込み
import './css/Charts.css'

//定数定義読み込み
import * as Const from '../Const.js'

class Charts extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //Data form main page
    this.state = {
      data: props.data, //main value set
      Y_value: props.Y_value, // max value of y-axis
      Y_lable: props.Y_lable, // topic of y-axis
      X_lable: props.X_lable, // topic of x-axis
      width: props.width,
      height: props.height,
    }
  }

  //画面描画
  render() {
    var Y_lable = this.state.Y_lable
    var X_lable = this.state.X_lable
    return (
      <React.Fragment>
        <div style={{ position: 'relative', left: '-20px' }}>
          <LineChart
            width={this.props.width + 20}
            height={this.props.height}
            data={this.props.data}
            margin={{ top: 30, right: 25, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              label={{ value: X_lable, position: 'right', dy: 0 }}
            />
            <YAxis
              type="number"
              label={{ value: Y_lable, position: 'insideRight', dy: -90 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            {/* <Tooltip/> */}
            {/* <Legend /> */}
            <Line
              type="linear"
              dataKey="GB"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </React.Fragment>
    )
  }
}

Charts.propTypes = {
  data: PropTypes.array,
  Y_value: PropTypes.array,
  Y_lable: PropTypes.string,
  X_lable: PropTypes.string,
}

export default Charts
