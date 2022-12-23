import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/UploadFile.css'

//画像読み込み
import closeImage from './images/close.png'

//定数定義読み込み
import * as Const from '../Const.js'

//モジュール読み込み
import TextLink from './TextLink.js'

class UploadFile extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.triggerEvent = this.triggerEvent.bind(this)

    //入力情報設定
    this.state = {
      id: props.id,
      type: props.type,
      accept: props.accept === undefined ? '*' : props.accept,
      textid: props.id + '_text',
      deleteid: props.id + '_delete',
      value: props.value,
      initializevalue: props.initializevalue,
      initializefullvalue: props.initializefullvalue,
      classname: props.classname,
      defaultclassname: props.classname,
      disabled: props.disabled,
      state: props.state,
      validate_id: props.validate_id,
      validatestate: props.state,
      callback: props.callback,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    if (
      this.props.state === Const.UPLOAD_STATUS_INITIALIZE &&
      this.props.initializevalue !== ''
    ) {
      document.getElementById(this.state.deleteid).style.display =
        'inline-block'
    }
  }

  //クリックされたとき
  handleClick() {
    //console.log("UploadFile Click");
    //if (this.props.state === Const.UPLOAD_STATUS_INITIALIZE) {
    //    document.getElementById(this.state.id).value = "";
    //    this.state.callback(Const.UPLOAD_CHANGE, this.state.id, "");
    //    document.getElementById(this.state.deleteid).style.display="inline-block";
    //}
    if (this.props.state === Const.UPLOAD_STATUS_ERROR) {
      document.getElementById(this.state.id).value = ''
      this.state.callback(Const.UPLOAD_CHANGE, this.state.id, '')
      document.getElementById(this.state.deleteid).style.display = 'none'
    }
    this.triggerEvent(document.getElementById(this.state.id), 'click')
  }

  //トリガーイベント いずれ共通関数として外出し予定
  triggerEvent(element, event) {
    try {
      var triggerevent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
      var cb = element
      cb.dispatchEvent(triggerevent)
    } catch (e) {
      try {
        element.click()
      } catch (e2) {}
    }
  }

  //削除ボタンがクリックされたとき
  handleDeleteClick() {
    document.getElementById(this.state.id).value = ''
    this.state.callback(Const.UPLOAD_CHANGE, this.state.id, '')
    document.getElementById(this.state.deleteid).style.display = 'none'
  }

  //値が変わった時
  handleChange() {
    var file = null
    var value = ''
    var fileInput = document.getElementById(this.state.id)
    var files = fileInput.files
    if (files !== null && files.length !== 0) {
      file = files[0]
      var name_split = files[0].name.split('\\')
      value = name_split[name_split.length - 1]
      document.getElementById(this.state.deleteid).style.display =
        'inline-block'
      this.state.callback(Const.UPLOAD_CHANGE, this.state.id, value, file)
    }
    //else {
    //    document.getElementById(this.state.deleteid).style.display="none";
    //}
  }

  //画面描画
  render() {
    var textvalue =
      this.props.state === Const.UPLOAD_STATUS_INITIALIZE
        ? this.props.initializevalue
        : this.props.value
    var closebutton
    try {
      closebutton =
        this.props.state === Const.UPLOAD_STATUS_INITIALIZE &&
        this.props.initializevalue !== ''
          ? { display: 'inline-block' }
          : this.props.state === Const.UPLOAD_STATUS_INITIALIZE
          ? { display: 'none' }
          : {
              display: document.getElementById(this.state.deleteid).style
                .display,
            }
    } catch (e) {
      closebutton = { display: 'none' }
    }
    if (this.props.disabled === true) {
      closebutton = { display: 'none' }
      return (
        <React.Fragment>
          <div className="uploadcover">
            <div className="uploadbutton uploadButton_disabled">参照</div>
            <input
              type="text"
              className="uploaddata"
              id={this.state.textid}
              value={textvalue}
              disabled
            />
            <input
              type="file"
              className="uploadhidden"
              name={this.state.id}
              id={this.state.id}
              accept={this.state.accept}
            />
            <div
              id={this.state.deleteid}
              className="uploadclosebutton"
              style={closebutton}
            >
              <img
                src={closeImage}
                alt="削除"
                onClick={(e) => this.handleDeleteClick(e)}
              />
            </div>
          </div>
        </React.Fragment>
      )
    } else if (
      this.props.state === Const.UPLOAD_STATUS_INITIALIZE &&
      this.props.initializevalue !== ''
    ) {
      var linkid = this.props.id + '_link'
      return (
        <React.Fragment>
          <div className="uploadcover">
            <div className="uploadbutton" onClick={(e) => this.handleClick(e)}>
              参照
            </div>
            <div className="uploaddata uploadlink">
              <TextLink id={linkid} value={this.props.initializefullvalue} />
            </div>
            <input
              type="file"
              className="uploadhidden"
              name={this.state.id}
              id={this.state.id}
              accept={this.state.accept}
              onChange={(e) => this.handleChange(e)}
            />
            <div
              id={this.state.deleteid}
              className="uploadclosebutton"
              style={closebutton}
            >
              <img
                src={closeImage}
                alt="削除"
                onClick={(e) => this.handleDeleteClick(e)}
              />
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <div className="uploadcover">
            <div className="uploadbutton" onClick={(e) => this.handleClick(e)}>
              参照
            </div>
            <input
              type="text"
              className="uploaddata"
              id={this.state.textid}
              value={textvalue}
              disabled
            />
            <input
              type="file"
              className="uploadhidden"
              name={this.state.id}
              id={this.state.id}
              accept={this.state.accept}
              onChange={(e) => this.handleChange(e)}
            />
            <div
              id={this.state.deleteid}
              className="uploadclosebutton"
              style={closebutton}
            >
              <img
                src={closeImage}
                alt="削除"
                onClick={(e) => this.handleDeleteClick(e)}
              />
            </div>
          </div>
        </React.Fragment>
      )
    }
  }
}

UploadFile.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  initializevalue: PropTypes.string,
  initializefullvalue: PropTypes.string,
  classname: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  state: PropTypes.number.isRequired,
  validate_id: PropTypes.string,
  validatestate: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
}

export default UploadFile
