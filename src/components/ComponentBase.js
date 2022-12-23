import React, { Component } from 'react'
import $ from 'jquery'

//定数定義読み込み
import * as Const from '../Const.js'

class ComponentBase extends Component {
  //テキスト入力枠のフォーカスロスト時
  //バリデート結果保持及び、ステータス変更
  saveTextValidate(id, params) {
    //バリデート結果を保持する
    for (var i = 0; i < this.state.textboxes.length; i++) {
      if (this.state.textboxes[i].id === id) {
        var textboxes_copy = [...this.state.textboxes]
        textboxes_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        textboxes_copy[i].state = Const.TEXT_STATUS_NORMAL
        textboxes_copy[i].validatestate = params
        this.setState({ textboxes: textboxes_copy })
      }
    }
  }

  //テキスト入力枠の変更時
  //ステータスを初期状態から入力中状態へ変更
  changeTextState(id, params) {
    var textboxes_copy
    for (var i = 0; i < this.state.textboxes.length; i++) {
      if (
        this.state.textboxes[i].id === id &&
        this.state.textboxes[i].state === Const.TEXT_STATUS_INITIALIZE
      ) {
        textboxes_copy = [...this.state.textboxes]
        textboxes_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        textboxes_copy[i].state = Const.TEXT_STATUS_NORMAL
        this.setState({ textboxes: textboxes_copy })
      } else if (
        this.state.textboxes[i].id === id &&
        this.state.textboxes[i].state === Const.TEXT_STATUS_ERROR &&
        this.state.textboxes[i].befstate === Const.TEXT_STATUS_INITIALIZE
      ) {
        textboxes_copy = [...this.state.textboxes]
        textboxes_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        this.setState({ textboxes: textboxes_copy })
      }
    }
  }

  //テキスト入力枠でバリデートが発生しているかどうか
  //disabled状態のものは、バリデートチェックを行わない
  checkTextValidate() {
    //バリデートが発生していないかどうかのチェック
    //テキストボックス
    var is_check = true
    var textboxes_copy = [...this.state.textboxes]
    for (var i = 0; i < textboxes_copy.length; i++) {
      if (
        textboxes_copy[i].validatestate === false &&
        textboxes_copy[i].disabled !== true
      ) {
        textboxes_copy[i].befstate = textboxes_copy[i].state
        textboxes_copy[i].state = Const.TEXT_STATUS_ERROR
        is_check = false
      }
    }
    this.setState({ textboxes: textboxes_copy })
    return is_check
  }

  //テキスト入力枠のフォーカスロスト時
  //バリデート結果保持及び、ステータス変更
  saveTextAreaValidate(id, params) {
    //バリデート結果を保持する
    for (var i = 0; i < this.state.textareas.length; i++) {
      if (this.state.textareas[i].id === id) {
        var textareas_copy = [...this.state.textareas]
        textareas_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        textareas_copy[i].state = Const.TEXT_STATUS_NORMAL
        textareas_copy[i].validatestate = params
        this.setState({ textareas: textareas_copy })
      }
    }
  }

  //テキスト入力枠の変更時
  //ステータスを初期状態から入力中状態へ変更
  changeTextAreaState(id, params) {
    var textareas_copy
    for (var i = 0; i < this.state.textareas.length; i++) {
      if (
        this.state.textareas[i].id === id &&
        this.state.textareas[i].state === Const.TEXT_STATUS_INITIALIZE
      ) {
        textareas_copy = [...this.state.textareas]
        textareas_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        textareas_copy[i].state = Const.TEXT_STATUS_NORMAL
        this.setState({ textareas: textareas_copy })
      } else if (
        this.state.textareas[i].id === id &&
        this.state.textareas[i].state === Const.TEXT_STATUS_ERROR &&
        this.state.textareas[i].befstate === Const.TEXT_STATUS_INITIALIZE
      ) {
        textareas_copy = [...this.state.textareas]
        textareas_copy[i].befstate = Const.TEXT_STATUS_NORMAL
        this.setState({ textareas: textareas_copy })
      }
    }
  }

  //テキスト入力枠でバリデートが発生しているかどうか
  //disabled状態のものは、バリデートチェックを行わない
  checkTextAreaValidate() {
    //バリデートが発生していないかどうかのチェック
    //テキストボックス
    var is_check = true
    var textareas_copy = [...this.state.textareas]
    for (var i = 0; i < textareas_copy.length; i++) {
      if (
        textareas_copy[i].validatestate === false &&
        textareas_copy[i].disabled !== true
      ) {
        textareas_copy[i].befstate = textareas_copy[i].state
        textareas_copy[i].state = Const.TEXT_STATUS_ERROR
        is_check = false
      }
    }
    this.setState({ textareas: textareas_copy })
    return is_check
  }

  //セレクトボックスのバリデートチェック
  //リストの一番最初の場合はエラー
  checkSelectBoxValidate() {
    var is_check = true
    var selectboxes_copy = [...this.state.selectboxes]
    for (var i = 0; i < selectboxes_copy.length; i++) {
      if (
        selectboxes_copy[i].validatestate === false &&
        selectboxes_copy[i].disabled !== true
      ) {
        selectboxes_copy[i].state = Const.SELECT_STATUS_ERROR
        is_check = false
      }
    }
    this.setState({ selectboxes: selectboxes_copy })
    return is_check
  }

  //チェックボックスのバリデートチェック
  //同一グループ内で1つもチェックがなければエラー（判定済み）
  checkCheckBoxValidate() {
    var is_check = true
    var checkboxes_copy = [...this.state.checkboxes]
    for (var i = 0; i < checkboxes_copy.length; i++) {
      for (var j = 0; j < checkboxes_copy[i].length; j++) {
        if (
          checkboxes_copy[i][j].validatestate === false &&
          checkboxes_copy[i][j].type !== Const.CHECKBOX_TYPE_NO_VALIDATE
        ) {
          checkboxes_copy[i][j].state = Const.CHECKBOX_STATUS_ERROR
          is_check = false
        }
      }
    }
    return is_check
  }

  //アップロードのバリデートチェック
  //disabled状態のものは、バリデートチェックを行わない
  checkUploadFileValidate() {
    var is_check = true
    var uploadfiles_copy = [...this.state.uploadfiles]
    for (var i = 0; i < uploadfiles_copy.length; i++) {
      if (
        uploadfiles_copy[i].validatestate === false &&
        uploadfiles_copy[i].disabled === false
      ) {
        uploadfiles_copy[i].state = Const.UPLOAD_STATUS_ERROR
        is_check = false
      }
    }
    return is_check
  }

  // セレクトボックス関連のコールバック
  // value : CHANGEの場合には、選択されたindex
  //         INITIALIZEの場合には、初期配列が設定されている
  saveSelectBoxValidate(num, value) {
    var selectboxes_copy = [...this.state.selectboxes]
    selectboxes_copy[num].state = Const.SELECT_STATUS_NORMAL
    if (value === 0) {
      selectboxes_copy[num].validatestate = false
    } else {
      selectboxes_copy[num].validatestate = true
    }
    this.setState({ selectboxes: selectboxes_copy })
  }

  //ラジオボタン関連のCB
  saveRadioBoxChecked(id, group) {
    var radios_copy = [...this.state.radios]
    for (var num = 0; num < radios_copy[group].length; num++) {
      if (radios_copy[group][num].id === id) {
        radios_copy[group][num].checked = true
      } else {
        radios_copy[group][num].checked = false
      }
    }
    this.setState({ radios: radios_copy })
  }

  //チェックボックス関連のCB
  saveCheckBoxChecked(id, group, value) {
    var num
    var checkboxes_copy = [...this.state.checkboxes]
    for (num = 0; num < checkboxes_copy[group].length; num++) {
      if (checkboxes_copy[group][num].id === id) {
        checkboxes_copy[group][num].checked = value
      }
    }

    //グループ内のチェックが1つも存在しなければエラー
    var validate = false
    for (num = 0; num < checkboxes_copy[group].length; num++) {
      if (checkboxes_copy[group][num].checked === true) {
        validate = true
        break
      }
    }
    for (num = 0; num < checkboxes_copy[group].length; num++) {
      checkboxes_copy[group][num].validatestate = validate
      checkboxes_copy[group][num].state = Const.CHECKBOX_STATUS_NORMAL
    }
    this.setState({ checkboxes: checkboxes_copy })
  }

  //セレクトボックスのテキストを取得
  getTextSelectBox(id, zero) {
    var obj = document.getElementById(id)
    var idx = obj.selectedIndex
    var val = obj.options[idx].value
    var txt = obj.options[idx].text
    return { value: val, text: txt }
  }

  //ラジオボタンのテキストを取得
  getTextRadioButton(index) {
    var ret = {}
    for (var num = 0; num < this.state.radios[index].length; num++) {
      if (this.state.radios[index][num].checked === true) {
        var text = this.state.radios[index][num].text
        var value = this.state.radios[index][num].value
        ret = { value: value, text: text }
        break
      }
    }
    return ret
  }

  //アップロード関連のCB
  saveFileUpload(id, value, file) {
    //バリデート結果を保持する
    var num
    var flg
    for (var i = 0; i < this.state.uploadfiles.length; i++) {
      if (this.state.uploadfiles[i].id === id) {
        var uploadfiles_copy = [...this.state.uploadfiles]
        var c_upload_array_copy = [...this.state.c_upload_array]
        if (value === '') {
          if (uploadfiles_copy[i].initializevalue === '') {
            //console.log("Const.UPLOAD_STATUS_INITIALIZE");
            uploadfiles_copy[i].state = Const.UPLOAD_STATUS_INITIALIZE
          } else {
            //console.log("Const.UPLOAD_STATUS_REMOVE");
            uploadfiles_copy[i].state = Const.UPLOAD_STATUS_REMOVE
          }
          if (uploadfiles_copy[i].type !== Const.UPLOAD_TYPE_NO_VALIDATE) {
            uploadfiles_copy[i].validatestate = false
          }

          flg = false
          for (num = 0; num < c_upload_array_copy.length; num++) {
            if (c_upload_array_copy[num].id === id) {
              c_upload_array_copy[num].value = null
              flg = true
              break
            }
          }
          if (flg === false) {
            c_upload_array_copy[c_upload_array_copy.length] = {
              id: id,
              value: null,
            }
          }
        } else {
          //console.log("Const.UPLOAD_STATUS_CHANGE");
          uploadfiles_copy[i].state = Const.UPLOAD_STATUS_CHANGE
          uploadfiles_copy[i].validatestate = true

          flg = false
          for (num = 0; num < c_upload_array_copy.length; num++) {
            if (c_upload_array_copy[num].id === id) {
              c_upload_array_copy[num].value = file
              flg = true
              break
            }
          }
          if (flg === false) {
            c_upload_array_copy[c_upload_array_copy.length] = {
              id: id,
              value: file,
            }
          }
        }
        uploadfiles_copy[i].value = value
        this.setState({ uploadfiles: uploadfiles_copy })
        this.setState({ c_upload_array: c_upload_array_copy })
        break
      }
    }
  }

  //汎用エラーダイアログ表示、非表示
  showGenericErrorDialog() {
    var dialogs_copy = this.state.errordialog
    dialogs_copy.state = true
    this.setState({ errordialog: dialogs_copy })
  }
  hideGenericErrorDialog() {
    var dialogs_copy = this.state.errordialog
    dialogs_copy.state = false
    this.setState({ errordialog: dialogs_copy })
  }

  //タイムスタンプ取得
  getTimestamp() {
    // Dateオブジェクトを作成
    var date = new Date()

    // UNIXタイムスタンプを取得する (ミリ秒単位)
    var a = date.getTime()

    // UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
    var b = Math.floor(a / 1000)

    return b
  }

  //0埋め
  zeroSetting(value, num) {
    var value_str = String(value)
    for (; value_str.length < num; ) {
      value_str = '0' + value_str
    }
    return value_str
  }

  //数値カンマ区切り
  formatMoney(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  }

  //ファイル名取得
  getFileName(value) {
    if (value === null) return ''
    value = value.split('/')
    value = value[value.length - 1].split('?')[0]
    return value
  }

  //郵便番号用のテキスト整形
  addressSetting(value) {
    return value.substring(0, 3) + '-' + value.substring(3, 7)
  }

  //配列の重複削除
  uniqueObjectArray(objArray, propName) {
    var storage = {}
    var uniqueObjArray = []
    var i, value

    for (i = 0; i < objArray.length; i++) {
      value = objArray[i][propName]
      if (!(value in storage)) {
        storage[value] = true
        uniqueObjArray.push(objArray[i])
      }
    }
    return uniqueObjArray
  }

  //特定のデータを除外する
  deleteObjectArray(objArray, propName, deleteValue) {
    var storage = {}
    var uniqueObjArray = []
    var i, value

    for (i = 0; i < objArray.length; i++) {
      value = objArray[i][propName]
      if (value !== deleteValue) {
        storage[value] = true
        uniqueObjArray.push(objArray[i])
      }
    }
    return uniqueObjArray
  }

  //画面最上部へスクロール
  goTop() {
    setTimeout(() => {
      try {
        window.scroll(0, 0)
      } catch (e) {
        window.scrollTop = 0
      }
    }, 1)
  }

  //画面最下部へスクロール
  goBottom() {
    setTimeout(() => {
      var a = document.documentElement
      var y = a.scrollHeight - a.clientHeight
      try {
        window.scroll(0, y)
      } catch (e) {
        window.scrollTop = y
      }
    }, 1)
  }

  goBack(e, history) {
    e.preventDefault()
    history.goBack()
  }

  //年月から日の数を求める
  //うるう年も計算
  setMaxDay(year, month, day) {
    setTimeout(() => {
      var year_num = Number(document.getElementById(year.id).value)
      var month_num = Number(document.getElementById(month.id).value)
      var day_num = Number(document.getElementById(day.id).value)
      var day_count = day.value.length - 1
      var date
      var changeindex = -1

      if (year_num === -1 || month_num === -1) {
        year_num = 1970
        month_num = 1
      }

      if (month_num === 12) {
        date = new Date(year_num + 1, 0, 1, 0, 0)
      } else {
        date = new Date(year_num, month_num, 1, 0, 0)
      }
      date.setDate(date.getDate() - 1)

      if (date.getDate() !== day_count) {
        var selectboxes_copy = [...this.state.selectboxes]
        for (var num = 0; num < selectboxes_copy.length; num++) {
          if (selectboxes_copy[num].id === day.id) {
            var values = []
            var value_one = {}
            value_one.id = -1
            value_one.value = '日'
            values[values.length] = value_one

            for (var num2 = 1; num2 <= date.getDate(); num2++) {
              value_one = {}
              value_one.id = num2
              value_one.value = num2
              values[values.length] = value_one
            }

            selectboxes_copy[num].value = values
            this.setState({ selectboxes: selectboxes_copy })
            changeindex = num
            break
          }
        }

        setTimeout(() => {
          var obj = document.getElementById(day.id)
          for (var num = 0; num < obj.options.length; num++) {
            if (Number(obj.options[num].value) === Number(day_num)) {
              obj.options[num].selected = true
              var selectboxes_copy = [...this.state.selectboxes]
              selectboxes_copy[changeindex].validatestate = true
              this.setState({ selectboxes: selectboxes_copy })
              break
            }
          }
        }, 1)
      }
    }, 1)
  }

  //年月日の範囲設定が正しいかどうかのチェック
  checkCorrectBetweenDay(year, month, day, year2, month2, day2) {
    var year_num = Number(document.getElementById(year.id).value)
    var month_num = Number(document.getElementById(month.id).value)
    var day_num = Number(document.getElementById(day.id).value)
    var bef_day =
      this.zeroSetting(year_num, 4) +
      this.zeroSetting(month_num, 2) +
      this.zeroSetting(day_num, 2)

    var year_num2 = Number(document.getElementById(year2.id).value)
    var month_num2 = Number(document.getElementById(month2.id).value)
    var day_num2 = Number(document.getElementById(day2.id).value)
    var aft_day =
      this.zeroSetting(year_num2, 4) +
      this.zeroSetting(month_num2, 2) +
      this.zeroSetting(day_num2, 2)

    //console.log(bef_day);
    //console.log(aft_day);

    if (bef_day > aft_day) return false
    return true
  }

  //ログインチェック
  isLogin() {
    var userid = localStorage.getItem(Const.CUSTOMERID)
    if (
      userid === null ||
      userid === undefined ||
      userid === -1 ||
      userid === '-1'
    ) {
      return false
    }
    /*var hashcode = localStorage.getItem("hashcode");
        if (hashcode === null || hashcode === undefined || hashcode === -1 || hashcode === "-1") {
            return false;
        }*/
    return true
  }

  //ログアウト
  logout() {
    localStorage.setItem('user_id', -1)
    localStorage.setItem('hashcode', '')
    if (this.state !== null && this.state.dashboard !== undefined) {
      this.state.dashboard(
        Const.DASHBOARD_MOVE_FRAME,
        Const.DASHBOARD_MOVE_TYPE_TOP
      )
    } else {
      this.props.history.push('/Top')
    }
    // this.parent.history.push('/Top');
  }

  //メールアドレス未登録PUを表示したかどうか
  getOneTimePopUp() {
    var flg = localStorage.getItem(Const.ONETIMEID)
    if (flg === null || flg === undefined || flg === -1 || flg === '-1') {
      return false
    }
    return true
  }
  setOneTimePopUp() {
    localStorage.setItem(Const.ONETIMEID, 1)
  }

  scrollToTop(e) {
    e.preventDefault()
    $('html, body').animate({ scrollTop: 0 }, 300, 'swing')
  }

  scrollToItem(x) {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $(x).offset().top,
      },
      300,
      'swing'
    )
  }

  //画面レイアウト
  render() {
    return <React.Fragment></React.Fragment>
  }
}

export default ComponentBase
