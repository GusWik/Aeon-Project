import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './css/Loading.css'
import loadingImage from './images/loader100.gif'

/**
 * ローディング表示用のコンポーネント.
 */
class Loading extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //入力情報設定
    this.state = {
      loading_state: props.loading_state,
      base_w: 0,
      base_h: 0,
      cover_l: 0,
      cover_t: 0,
    }
  }

  //ウィンドウの幅高を取得する
  getWindowSize() {
    var w = window
    var d = document
    var e = d.documentElement
    var g = d.getElementsByTagName('body')[0]
    var width = w.innerWidth || e.clientWidth || g.clientWidth
    var height = w.innerHeight || e.clientHeight || g.clientHeight
    return {
      w: width,
      h: height,
    }
  }

  //ダイアログの幅高を取得する
  getDialogSize() {
    var d = document.getElementById('loading_img')
    var w = d.width
    var h = d.height
    return {
      w: w,
      h: h,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    var size = this.getWindowSize()

    var size_w = parseInt(size.w + 1, 10)
    size_w += size_w % 2

    var size_h = parseInt(size.h + 1, 10)
    size_h += size_h % 2

    this.setState({ base_w: size_w })
    this.setState({ base_h: size_h })
    this.setState({ cover_t: size_h / 2.0 - 50 })

    var interval = setInterval(() => {
      var size = this.getWindowSize()

      var size_w = parseInt(size.w + 1, 10)
      size_w += size_w % 2

      var size_h = parseInt(size.h + 1, 10)
      size_h += size_h % 2

      this.setState({ base_w: size_w })
      this.setState({ base_h: size_h })
      this.setState({ cover_t: size_h / 2.0 - 50 })
    }, 100)
    this.setState({ interval: interval })
  }
  //コンポーネントが画面から削除されるときに実行されるイベント
  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  //画面描画
  render() {
    var baseStyle = {
      display: this.props.loading_state === true ? 'block' : 'none',
    }
    var innerStyle = {
      width: this.state.base_w,
      height: this.state.base_h,
    }
    var imgStyle = {
      marginTop: this.state.cover_t,
    }
    return (
      <React.Fragment>
        <div className="loading" style={baseStyle}>
          <div id="loading_inner" style={innerStyle}>
            <div className="loading_img_cover" style={imgStyle}>
              <img
                className="loading_img"
                id="loading_img"
                src={loadingImage}
                alt="ローディング中..."
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

//Dialogクラスに対する引数
Loading.propTypes = {
  loading_state: PropTypes.bool.isRequired,
}

export default Loading
