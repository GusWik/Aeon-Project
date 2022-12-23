import React, { Component } from 'react'

//定数定義読み込み
import * as Const from '../Const.js'

class ValidateTextBox extends Component {
  // バリデートチェック
  // true : OK
  // false : NG
  validate(type, text, num) {
    var validate = ''
    switch (type) {
      //数値
      case Const.TEXT_VALIDATE_KIND_NUMBER:
        validate = /^[0-9]+$/g
        if (text.match(validate)) {
          return true
        }
        break
      //半角英字
      case Const.TEXT_VALIDATE_KIND_ALPHA:
        validate = /^[a-zA-Z]+$/g
        if (text.match(validate)) {
          return true
        }
        break
      //半角英数(大文字と小文字含む)
      case Const.TEXT_VALIDATE_KIND_ALPHA_U_L:
        validate = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]*$/
        if (text.match(validate)) {
          return true
        }
        break
      //半角英数
      case Const.TEXT_VALIDATE_KIND_NUMBER_ALPHA:
        validate = /^[a-zA-Z0-9]+$/g
        if (text.match(validate)) {
          return true
        }
        break
      //ASCII
      case Const.TEXT_VALIDATE_KIND_ASCII:
        validate = /^[\x00-\x7F]*$/
        if (text.match(validate)) {
          return true
        }
        break
      //メールアドレス
      case Const.TEXT_VALIDATE_KIND_MAIL:
        validate = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        if (text.match(validate)) {
          return true
        }
        break
      //お客さまID（半角数字のみ、もしくはメールアドレス）
      case Const.TEXT_VALIDATE_KIND_CUSTOMERID:
        // /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,20}$/i
        validate = /(^[0-9]+$|^[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+$)/
        if (text.match(validate)) {
          return true
        }
        break
      //パスワード（半角英数の組み合わせ）
      case Const.TEXT_VALIDATE_KIND_PASSWORD:
        // /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,20}$/i
        validate = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]*$/i
        if (text.match(validate)) {
          return true
        }
        break
      //最低文字数
      case Const.TEXT_VALIDATE_LENGTH_MIN:
        if (text.length >= num) {
          return true
        }
        break
      //最大文字数
      case Const.TEXT_VALIDATE_LENGTH_MAX:
        if (text.length <= num) {
          return true
        }
        break
      default:
        break
    }
    return false
  }

  //画面描画
  render() {
    return <React.Fragment></React.Fragment>
  }
}

export default ValidateTextBox
