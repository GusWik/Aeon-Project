import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/SelectBox.css'

//定数定義読み込み
import * as Const from '../Const.js'

class SelectBox extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleChange = this.handleChange.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      type: props.type,
      value: props.value,
      classname: props.classname + ' selectorsnotfirst',
      defaultclassname: props.classname,
      disabled: props.disabled,
      state: props.state,
      validatestate: props.state,
      callback: props.callback,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    var today = new Date()
    var now_year =
      this.props.max_id > 0 ? this.props.max_id : today.getFullYear()
    var values = []
    var value_one = {}
    var num = -1

    //特別な種別の場合は、配置直後に初期化する
    //console.log("this.state.type :: " + this.state.type);
    if (this.state.type === Const.SELECT_TYPE_YEAR) {
      value_one = {}
      value_one.id = -1
      value_one.value = '年'
      values[values.length] = value_one

      for (
        num = this.props.min_id > 0 ? this.props.min_id : 1900;
        num <= now_year;
        num++
      ) {
        value_one = {}
        value_one.id = num
        value_one.value = num
        values[values.length] = value_one
      }
    } else if (this.state.type === Const.SELECT_TYPE_YEAR_OVER_10) {
      value_one = {}
      value_one.id = -1
      value_one.value = '年'
      values[values.length] = value_one

      for (num = now_year; num <= now_year + 10; num++) {
        value_one = {}
        value_one.id = num
        value_one.value = num
        values[values.length] = value_one
      }
    } else if (this.state.type === Const.SELECT_TYPE_MONTH) {
      value_one = {}
      value_one.id = -1
      value_one.value = '月'
      values[values.length] = value_one

      for (num = 1; num <= 12; num++) {
        value_one = {}
        value_one.id = num
        value_one.value = num
        values[values.length] = value_one
      }
    } else if (this.state.type === Const.SELECT_TYPE_DAY) {
      value_one = {}
      value_one.id = -1
      value_one.value = '日'
      values[values.length] = value_one

      for (num = 1; num <= 31; num++) {
        value_one = {}
        value_one.id = num
        value_one.value = num
        values[values.length] = value_one
      }
    } else {
      //return;
    }

    //console.log(values);
    //this.setState({value: values});
    this.state.callback(Const.SELECT_INITIALIZE, this.state.id, values)
  }

  //値が変わった時
  handleChange() {
    var obj = document.getElementById(this.state.id)
    //if (obj.selectedIndex === 0) {
    //    this.setState({classname: this.state.defaultclassname});
    //}
    //else {
    //    this.setState({classname: this.state.defaultclassname + " selectorsnotfirst"});
    //}

    //console.log("obj.selectedIndex :: " + obj.selectedIndex);
    this.state.callback(Const.SELECT_CHANGE, this.state.id, obj.selectedIndex)
  }

  //画面描画
  render() {
    var obj = document.getElementById(this.state.id)
    var classname =
      this.props.state === Const.SELECT_STATUS_ERROR
        ? this.state.defaultclassname + ' selectorserror'
        : obj !== null && obj.selectedIndex === 0
        ? this.state.defaultclassname
        : this.state.classname
    var default_id = this.props.def_id || -1
    if (this.props.disabled === false) {
      if (this.props.type === Const.SELECT_TYPE_GROUP) {
        return (
          <React.Fragment>
            <select
              className={classname}
              id={this.state.id}
              onChange={(e) => this.handleChange(e)}
            >
              {this.props.value.map(function (data, i) {
                if (data.type === 'nogroup') {
                  return (
                    <option
                      value={data.id}
                      key={data.id}
                      selected={data.id === default_id}
                    >
                      {data.value}
                    </option>
                  )
                } else {
                  return (
                    <optgroup label={data.label} key={i}>
                      {data.value.map(function (data2, j) {
                        return (
                          <option
                            value={data2.id}
                            key={data2.id}
                            selected={data2.id === default_id}
                          >
                            {data2.value}
                          </option>
                        )
                      })}
                    </optgroup>
                  )
                }
              })}
            </select>
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <select
              className={classname}
              id={this.state.id}
              onChange={(e) => this.handleChange(e)}
            >
              {this.props.value.map(function (data, i) {
                return (
                  <option
                    value={data.id}
                    key={data.id}
                    selected={data.id === default_id}
                  >
                    {data.value}
                  </option>
                )
              })}
            </select>
          </React.Fragment>
        )
      }
    } else {
      return (
        <React.Fragment>
          <select
            className={classname}
            id={this.state.id}
            onChange={(e) => this.handleChange(e)}
            disabled="disabled"
          >
            {this.props.value.map(function (data, i) {
              return (
                <option value={data.id} key={data.id}>
                  {data.value}
                </option>
              )
            })}
          </select>
        </React.Fragment>
      )
    }
  }
}

SelectBox.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.array,
  min_id: PropTypes.number,
  max_id: PropTypes.number,
  def_id: PropTypes.number,
  classname: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  validatestate: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default SelectBox
