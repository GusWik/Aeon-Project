import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/Button.css'

//定数定義読み込み
import * as Const from '../Const.js'

class Button extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleClickBtn = this.handleClickBtn.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      value: props.value,
      classname: props.classname,
      disabled: props.disabled,
      state: props.state,
      callback: props.callback,
    }
  }

  //クリックされたとき
  handleClickBtn() {
    this.state.callback(Const.EVENT_CLICK_BUTTON, this.state.id)
  }

  //画面描画
  render() {
    return (
      <React.Fragment>
        <div
          className={this.state.classname}
          id={this.state.id}
          onClick={(e) => this.handleClickBtn(e)}
        >
          {this.state.value}
        </div>
      </React.Fragment>
    )
  }
}

Button.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  classname: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  state: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default Button
