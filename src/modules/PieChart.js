import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Doughnut } from 'react-chartjs-2'
//CSS読み込み
import './css/Charts.css'

class PieCharts extends Component {
  constructor(props) {
    super(props)

    //Data form main page
    this.state = {
      chartData: this.props.chartData,
      options: {
        tooltips: {
          enabled: false,
        },
        animation: {
          animateScale: false,
        },

        responsive: true,
        maintainAspectRatio: false,

        // cutoutPercentage: 30,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 20,
            fontColor: 'red',
            padding: 0,
            boxWidth: 20,
          },
        },

        layout: {
          width: 1000,
          height: 1000,
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },

        elements: {
          arc: {
            borderWidth: 2,
            backgroundColor: '#FFFFFF',
            hoverBorderColor: '#FFFFFF',
          },
        },
      },
    }
  }

  //画面描画
  render() {
    return (
      <React.Fragment>
        <Doughnut
          data={this.state.chartData}
          options={this.state.options}
          className="donghnut"
        />
      </React.Fragment>
    )
  }
}

PieCharts.propTypes = {
  data: PropTypes.array,
  Y_value: PropTypes.array,
  Y_lable: PropTypes.string,
  X_lable: PropTypes.string,
}

export default PieCharts
