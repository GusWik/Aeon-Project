import React, { Component } from 'react'
import PropTypes from 'prop-types'

//CSS読み込み
import './css/TextLink.css'

//定数定義読み込み
import * as Const from '../Const.js'

class TextLink extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //入力情報設定
    this.state = {
      id: props.id,
      value: props.value,
    }
  }

  //画面描画
  render() {
    if (!(this.props.value === null || this.props.value === '')) {
      var value_filename = this.props.value.split('/')
      value_filename = value_filename[value_filename.length - 1].split('?')[0]

      var download_filename = Const.DOMAIN_RESOURCE + this.props.value

      return (
        <React.Fragment>
          <a
            id={this.state.id}
            href={download_filename}
            download={value_filename}
            className="textLink"
            onClick={(e) => {
              e.preventDefault()
              window.open(download_filename, '_blank')
            }}
          >
            {value_filename}
          </a>
        </React.Fragment>
      )
    } else {
      return <React.Fragment>-</React.Fragment>
    }
  }
}

TextLink.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
}

export default TextLink
