import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Const from '../Const.js'
import Button from './Button.js'
import $ from 'jquery'

/**
 * ダイアログ表示用のコンポーネント.
 */
class CampaignTicket extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)
  }

  //画面描画
  render() {
    let { code, date } = this.props
    return (
      <div className="c-ticket_wrap">
        <div className="h-ticket_item_wrap">
          <div className="h-ticket_item_label">TICKET</div>
          <h3 className="h-ticket_title">イオンモバイル紹介チケット</h3>
        </div>
        <dl className="c-ticket_item_wrap">
          <dt className="c-ticket_item_name">紹介コード</dt>
          <dd className="c-ticket_item_text">{code}</dd>
        </dl>
        <dl className="c-ticket_item_wrap">
          <dt className="c-ticket_item_name">有効期限</dt>
          <dd className="c-ticket_item_text">{date}</dd>
        </dl>
      </div>
    )
  }
}

//Dialogクラスに対する引数
CampaignTicket.propTypes = {
  id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}

export default CampaignTicket
