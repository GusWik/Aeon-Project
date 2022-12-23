import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/RadioButton.css'

//定数定義読み込み
import * as Const from '../Const.js'

class RadioButton extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleChange = this.handleChange.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      coverid: props.id + '_cover',
      group: props.group,
      name: props.name,
      value: props.value,
      text: props.text,
      classname: props.classname,
      coverclassname: 'radios ' + props.coverclassname,
      checked: props.checked,
      defaultclassname: props.classname,
      disabled: props.disabled,
      state: props.state,
      validatestate: props.state,
      callback: props.callback,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    if (this.props.checked) {
      document.getElementById(this.state.id).checked = true
    } else {
      document.getElementById(this.state.id).checked = false
    }
  }

  //値が変わった時
  handleChange() {
    this.state.callback(Const.RADIO_CHANGE, this.state.id, this.state.group)
  }

  //画面描画
  render() {
    var classname =
      this.props.state === Const.RADIO_STATUS_ERROR
        ? this.state.defaultclassname + ' radioserror'
        : this.props.checked === true
        ? this.state.defaultclassname + ' radiosselect'
        : this.state.classname
    var coverclassname =
      this.props.checked === true
        ? this.state.coverclassname + ' radiosselect'
        : this.state.coverclassname
    return (
      <React.Fragment>
        {(() => {
          if (this.props.checked === true) {
            return (
              <React.Fragment>
                <div
                  className={coverclassname}
                  id={this.state.coverid}
                  onClick={(e) => this.handleChange(e)}
                >
                  <div className="radiocover"></div>
                  <div className="radiocoversub"></div>
                  <input
                    id={this.state.id}
                    type="radio"
                    className={classname}
                    name={this.state.name}
                    value={this.state.value}
                  />
                  &nbsp;{this.state.text}
                </div>
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment>
                <div
                  className={coverclassname}
                  id={this.state.coverid}
                  onClick={(e) => this.handleChange(e)}
                >
                  <div className="radiocover"></div>
                  <input
                    id={this.state.id}
                    type="radio"
                    className={classname}
                    name={this.state.name}
                    value={this.state.value}
                  />
                  &nbsp;{this.state.text}
                </div>
              </React.Fragment>
            )
          }
        })()}
      </React.Fragment>
    )
  }
}

RadioButton.propTypes = {
  id: PropTypes.string,
  group: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.number,
  text: PropTypes.string,
  classname: PropTypes.string,
  coverclassname: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  validatestate: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default RadioButton
