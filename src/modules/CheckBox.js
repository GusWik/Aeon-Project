import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/CheckBox.css'

//定数定義読み込み
import * as Const from '../Const.js'

class CheckBox extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleChange = this.handleChange.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      type: props.type,
      coverid: props.id + '_cover',
      group: props.group,
      name: props.name,
      value: props.value,
      text: props.text,
      classname: props.classname,
      coverclassname: props.coverclassname,
      checked: props.checked,
      defaultclassname: props.classname,
      disabled: props.disabled,
      state: props.state,
      validate_id: props.validate_id,
      validatestate: props.state,
      callback: props.callback,
    }
  }

  componentDidMount() {
    if (this.props.checked) {
      document.getElementById(this.state.id).checked = true
    } else {
      document.getElementById(this.state.id).checked = false
    }
  }

  //値が変わった時
  handleChange() {
    this.state.callback(
      Const.CHECKBOX_CHANGE,
      this.state.id,
      this.state.group,
      document.getElementById(this.state.id).checked
    )
  }

  //画面描画
  render() {
    if (this.props.disabled === false) {
      return (
        <React.Fragment>
          {(() => {
            return (
              <React.Fragment>
                <span className={this.state.coverclassname}>
                  <label className="checkboxes checkboxesselect">
                    <input
                      type="checkbox"
                      name={this.state.name}
                      value={this.state.value}
                      id={this.state.id}
                      onClick={(e) => this.handleChange(e)}
                    />
                    <span className="checkmark checkboxesselect"></span>
                  </label>
                  <div className="checkboxlabel">{this.state.text}</div>
                </span>
              </React.Fragment>
            )
          })()}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {(() => {
            return (
              <React.Fragment>
                <span className={this.state.coverclassname}>
                  <label className="checkboxes checkboxesselect">
                    <input
                      type="checkbox"
                      name={this.state.name}
                      value={this.state.value}
                      id={this.state.id}
                      onClick={(e) => this.handleChange(e)}
                      disabled="disabled"
                    />
                    <span className="checkmark checkboxesselect"></span>
                  </label>
                  <div className="checkboxlabel">{this.state.text}</div>
                </span>
              </React.Fragment>
            )
          })()}
        </React.Fragment>
      )
    }
  }
}

CheckBox.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  group: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.number,
  text: PropTypes.string,
  classname: PropTypes.string,
  coverclassname: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  validate_id: PropTypes.string,
  validatestate: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default CheckBox
