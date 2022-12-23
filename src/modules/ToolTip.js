import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './css/ToolTip.css'
import * as Const from '../Const.js'

/**
 * ToolTip表示用のコンポーネント.
 */
class ToolTip extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleClickBtn = this.handleClickBtn.bind(this)

    //ツールチップの種別判断
    var type = 'error'
    var classname_split = props.classname.split(' ')
    for (var num = 0; num < classname_split.length; num++) {
      if (classname_split[num] === 'tooltipwhite') {
        type = 'hint'
        break
      }
    }

    //入力情報設定
    this.state = {
      id: props.id,
      baseid: props.baseid,
      type: type,
      value: props.value,
      state: props.state,
      classname: props.classname,
      callback: props.callback,
      left: 0,
      top: 0,
    }
  }

  //ベースとなる部品のleft、topを取得する
  getBaseSize() {
    var base = document.getElementById(this.state.baseid)
    var rect = base.getBoundingClientRect()

    var me = document.getElementById(this.state.id)
    var merect = me.getBoundingClientRect()

    //console.log("rect.left :: " + rect.left);
    //console.log("rect.top  :: " + rect.top);
    //console.log("rect.width :: " + rect.width);
    //console.log("rect.height  :: " + rect.height);
    //console.log("window.pageXOffset :: " + window.pageXOffset);
    //console.log("window.pageYOffset  :: " + window.pageYOffset);
    if (this.state.type === 'error') {
      return {
        left: rect.left + window.pageXOffset + rect.width / 2.0,
        top: rect.top + window.pageYOffset - rect.height / 2.0 - 8,
      }
    } else {
      return {
        left: rect.left + window.pageXOffset + merect.width / 2.0 - 10,
        top: rect.top + window.pageYOffset - merect.height / 2.0,
      }
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    var size = this.getBaseSize()
    this.setState({ left: size.left })
    this.setState({ top: size.top })
    var interval = setInterval(() => {
      var size = this.getBaseSize()
      this.setState({ left: size.left })
      this.setState({ top: size.top })
      //console.log("size.left :: " + size.left);
      //console.log("size.top  :: " + size.top);
    }, 100)
    this.setState({ interval: interval })
  }

  //コンポーネントが画面から削除されるときに実行されるイベント
  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  handleClickBtn() {
    this.state.callback(Const.TOOLTIP_CLICK_BUTTON, this.state.id)
  }

  //画面描画
  render() {
    var tooltip_style = {
      visibility: this.props.state === true ? 'visible' : 'hidden',
      top: this.state.top,
      left: this.state.left,
    }
    return (
      <React.Fragment>
        <span
          id={this.state.id}
          className={this.state.classname}
          style={tooltip_style}
        >
          {this.state.value.split('<br/>').map(function (m, i) {
            return (
              <p key={'tooltip_value_' + i} className="tooltipTextLine">
                {m}
              </p>
            )
          })}
          <span
            className="tooltipcross"
            onClick={(e) => this.handleClickBtn(e)}
          >
            x
          </span>
        </span>
        <div
          className="tooltiptouch"
          onClick={(e) => this.handleClickBtn(e)}
        ></div>
      </React.Fragment>
    )
  }
}

//ToolTipクラスに対する引数
ToolTip.propTypes = {
  id: PropTypes.string.isRequired,
  baseid: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  state: PropTypes.bool.isRequired,
  classname: PropTypes.string,
  callback: PropTypes.func.isRequired,
}

export default ToolTip
