import React from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/TextBox.css'

//定数定義読み込み
import * as Const from '../Const.js'

//各種モジュールを読み込み
import ValidateTextBox from './ValidateTextBox.js'

class TextBox extends ValidateTextBox {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      type: props.type,
      value: props.value,
      placeholder: props.placeholder,
      classname: props.classname,
      defaultclassname: props.classname,
      length: props.length,
      disabled: props.disabled,
      validate_id: props.validate_id,
      validate: props.validate,
      state: props.state,
      validatestate: props.validatestate,
      callback: props.callback,
      initialize: false,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {}

  // フォーカスされたとき
  handleFocus(event) {
    this.setState({ value: document.getElementById(this.state.id).value })
    this.state.callback(Const.EVENT_INPUT_FOCUS, this.state.id, '')
  }

  // 入力されたとき
  handleChange(event) {
    this.state.callback(Const.EVENT_INPUT_CHANGE, this.state.id, '')
    this.setState({ value: event.target.value })
  }

  // フォーカスを外したとき
  handleBlur(event) {
    // 半角validationは、自動変換する
    var targetVal = this.state.value
    for (let i = this.state.validate.length - 1; i >= 0; i--) {
      if (this.state.validate[i] >= 10) {
        targetVal = this.state.value.replace(
          /[Ａ-Ｚａ-ｚ０-９！-～]/g,
          function (tmpStr) {
            return String.fromCharCode(tmpStr.charCodeAt(0) - 0xfee0)
          }
        )
        break
      }
    }
    // バリデートチェックを行う
    var check = true
    for (var i = 0; i < this.state.validate.length; i++) {
      if (this.state.validate[i] < 10) {
        if (this.state.validate[i] === Const.TEXT_VALIDATE_LENGTH_MIN) {
          if (
            super.validate(
              this.state.validate[i],
              targetVal,
              this.state.length[0]
            ) === false
          ) {
            //console.log("Const.TEXT_VALIDATE_LENGTH_MIN :: false :: " + this.state.length[0] + " :: " + this.state.value);
            check = false
            break
          }
        } else if (this.state.validate[i] === Const.TEXT_VALIDATE_LENGTH_MAX) {
          if (
            super.validate(
              this.state.validate[i],
              targetVal,
              this.state.length[1]
            ) === false
          ) {
            //console.log("Const.TEXT_VALIDATE_LENGTH_MAX :: false");
            check = false
            break
          }
        }
      } else if (super.validate(this.state.validate[i], targetVal) === false) {
        //console.log(this.state.validate[i] + " :: false");
        check = false
        break
      }
    }

    // 入力状況に応じて、見た目を変更する
    //console.log("BLUR");
    if (targetVal.length === 0) {
      //console.log("NOINPUT");
      this.setState({
        classname: this.state.defaultclassname + ' noinput',
        value: targetVal,
      })
    } else {
      //console.log("INPUTS");
      this.setState({
        classname: this.state.defaultclassname + ' inputs',
        value: targetVal,
      })
    }

    // バリデート状況を配置元に戻す
    this.state.validatestate = check
    this.state.callback(Const.EVENT_INPUT_BLUR, this.state.id, check)
  }

  //画面描画
  render() {
    var value =
      this.props.state === Const.TEXT_STATUS_INITIALIZE ||
      (this.props.state === Const.TEXT_STATUS_ERROR &&
        this.props.befstate === Const.TEXT_STATUS_INITIALIZE)
        ? this.props.value
        : this.state.value
    var classname =
      this.props.state === Const.TEXT_STATUS_ERROR
        ? this.state.defaultclassname + ' inputerror'
        : this.props.disabled === true
        ? this.state.defaultclassname + ' noinput'
        : value === ''
        ? this.state.defaultclassname + ' noinput'
        : this.state.defaultclassname + ' inputs'

    if (this.props.disabled === false) {
      return (
        <React.Fragment>
          <input
            type={this.state.type}
            id={this.state.id}
            name={this.state.id}
            value={value}
            className={classname}
            placeholder={this.state.placeholder}
            onFocus={(e) => this.handleFocus(e)}
            onChange={(e) => this.handleChange(e)}
            onBlur={(e) => this.handleBlur(e)}
          />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <input
            type={this.state.type}
            id={this.state.id}
            name={this.state.id}
            value={value}
            className={classname}
            placeholder={this.state.placeholder}
            onFocus={(e) => this.handleFocus(e)}
            onChange={(e) => this.handleChange(e)}
            onBlur={(e) => this.handleBlur(e)}
            disabled="disabled"
          />
        </React.Fragment>
      )
    }
  }
}

TextBox.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  classname: PropTypes.string,
  placeholder: PropTypes.string,
  length: PropTypes.array,
  disabled: PropTypes.bool.isRequired,
  validate_id: PropTypes.string,
  validate: PropTypes.array,
  state: PropTypes.number.isRequired,
  validatestate: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default TextBox
