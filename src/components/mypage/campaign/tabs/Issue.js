import React, { Component } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'

import * as Const from '../../../../Const'
import Dialog from '../../../../modules/Dialog.js'
import CampaignTicket from '../../../../modules/CampaignTicket'

// css
import '../../../assets/css/common.css'

class CampaignTabsIssue extends Component {
  constructor(props) {
    super(props)

    this.goNextDisplay = props.goNextDisplay.bind(this)
    this.onCreateTicket = props.onCreateTicket.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)

    this.state = {
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '本当に発行しますか？',
          values: [{ text: '本当に発行しますか？' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel',
              value: 'いいえ',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'はい',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },

        {
          id: 2,
          type: Const.DIALOG_THREE,
          title: 'ご確認ください',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel',
              value: 'キャンセル',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: () =>
                this.callbackDialog(
                  Const.EVENT_CLICK_BUTTON,
                  'dialog_time_check_confirm_cancel'
                ),
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: () =>
                this.callbackDialog(
                  Const.EVENT_CLICK_BUTTON,
                  'dialog_time_check_confirm_ok'
                ),
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
          modalTop: '-20px',
        },
      ],
      selectedTiket: { code: '', date: '' },
    }
  }

  componentDidMount() {
    const _this = this
    $('.t-modal_overlay').click(function () {
      _this.setState({
        selectedTiket: {
          code: '',
          date: '',
        },
      })
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('#modal_customer.t-modal_content').removeClass('is-active')
    })

    this.setState({ modalTop: `-${$('#modal_id').height() / 2}px` })
  }

  callbackDialog(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          let dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
          let dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          // 操作対象契約切替API
          this.onCreateTicket()
          break
        }
        case 'dialog_status_change_0': {
          let dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        default: {
          break
        }
      }
    }
  }

  copyClipboard(e) {
    let { code, date } = this.state.selectedTiket
    const url = 'https://' + window.location.host + '/register/new/agreement'
    const copyText = `イオンモバイル紹介チケット
紹介コード： ${code}
有効期限： ${date}
${url}`

    if (window.clipboardData) {
      window.clipboardData.setData('Text', copyText)
      return true
    } else if (navigator.clipboard) {
      return navigator.clipboard.writeText(copyText).then(
        () => {
          alert('クリップボードにコピーしました')
        },
        () => {
          alert('コピーに失敗しました')
        }
      )
    } else {
      return false
    }
  }
  async share(e) {
    if (!window.navigator.share) {
      alert('ご利用のブラウザでは共有できません。')
      return
    }

    try {
      let { code, date } = this.state.selectedTiket
      const url = 'https://' + window.location.host + '/register/new/agreement'
      const copyText = `イオンモバイル紹介チケット
紹介コード： ${code}
有効期限： ${date}
${url}`

      await window.navigator.share({
        title: 'イオンモバイル紹介チケット',
        text: copyText,
      })
      alert('共有が完了しました。')
    } catch (e) {
      console.log(e.message)
    }
  }

  isPrintDisabled(ticketCode) {
    let printList = localStorage.getItem('printList')
    if (printList) {
      const obj = JSON.parse(printList)

      if (obj.includes(ticketCode)) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  returnTicketList() {
    let lists = this.props.ticketList.map((item) => {
      return (
        <li className="c-issue_list_item" key={item.ticketCode}>
          <CampaignTicket
            id="print"
            code={item.ticketCode}
            date={item.limitDate}
          />
          <div className="c-issue_item_buttons_wrap">
            <div className="c-issue_item_buttons">
              <button
                className="a-btn-submit a-pc "
                onClick={(e) => {
                  this.setState({
                    selectedTiket: {
                      code: item.ticketCode,
                      date: item.limitDate,
                    },
                  })
                  $('.t-modal').addClass('is-active')
                  $('.t-modal_content').addClass('is-active')
                }}
              >
                紹介チケットを
                <br />
                コピーする
              </button>
              <button
                className="a-btn-submit a-sp"
                onClick={(e) => {
                  this.setState({
                    selectedTiket: {
                      code: item.ticketCode,
                      date: item.limitDate,
                    },
                  })
                  $('.t-modal').addClass('is-active')
                  $('.t-modal_content').addClass('is-active')
                }}
              >
                紹介チケットを
                <br />
                シェアする
              </button>
              <button
                className="a-btn-submit"
                onClick={(e) => {
                  this.goNextDisplay(e, '/mypage/campaign/print/', {
                    code: item.ticketCode,
                    date: item.limitDate,
                  })
                }}
                disabled={this.isPrintDisabled(item.ticketCode)}
              >
                紹介チケットを
                <br />
                印刷する
              </button>
            </div>
          </div>
        </li>
      )
    })

    return (
      <div className="c-issue_content_list">
        <h5 className="c-issue_list_title">発行済み紹介チケット一覧</h5>
        <div className="c-issue_list_item_wrap">
          <ul className="a-list">{lists}</ul>

          <p>
            ※紹介チケットの発行日にかかわらず、上記の有効期間内に紹介コードをご登録いただいたご契約の成立をもって特典の対象となります（ご紹介特典の条件を満たしていない場合は特典を進呈いたしません）。
          </p>
        </div>
      </div>
    )
  }

  render() {
    let count = this.props.ticketList.reduce((prev, item) => {
      const todate = moment()
      let createDate = moment(item.createDate)
      return prev + (todate.isSame(createDate, 'month') ? 1 : 0)
    }, 0)

    let totalCount = Math.max(5 - Number(count), 0)

    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
          }
        })}
        <div>
          <p className="c-issue_text">
            <span className="l-issue">説明</span>
            <br />
            <b>
              紹介チケットでイオンモバイルをご紹介いただくと、
              <br />
              音声プラン・シェアプランのご契約で3,000WAONポイント＆1GBクーポンプレゼント。
              <br />
              詳しくは
              <a
                href="https://aeonmobile.jp/campaign/shokai/"
                target="_blank"
                rel="noopener noreferrer"
                className="a-link"
              >
                コチラ
              </a>
            </b>
          </p>
          <p className="c-issue_text">
            ※お相手の方が、下記の紹介チケットを利用して契約された場合に特典の対象となります。
            <br />
            ※ご紹介の対象となるのは、はじめのご契約1回限りで、過去にご契約があったお客さまや、現在ご利用中のお客さまをご紹介いただいても特典の対象とはなりません。
            <br />
            ※ご自身を紹介することはできません。
            <br />
            ※お相手の方には1,000WAONポイントと1GBクーポンを進呈いたします。
            <br />
            ※データプランをご契約の場合は、1GBクーポンのみ進呈いたします。
            <br />
            ※法人のお客さまのご契約は対象外です。
            <br />
            ※WAONポイントはお相手の方のご利用開始の翌々月末日までに進呈します。WAONカードを登録される時点で、特典の対象となる契約を解約されている場合、ご利用料金等に未納がある場合、その他何らかの事情で強制停止となっている場合は、登録申請いただけません。
          </p>
          <p className="c-issue_text">
            <b>
              <span className="l-issue">使用方法</span>
              <br />
              &#9312;下記の「紹介チケットを発行する」から、紹介チケットを発行します。
              <br />
              &#9313;お相手の方に紹介チケット（紹介コード）を送ります。
              <br />
              &#9314;お相手の方にご契約のお申込み時に紹介コードを登録いただきます。
              <br />
              詳しくは
              <a
                href="https://aeonmobile.jp/campaign/shokai/"
                target="_blank"
                rel="noopener noreferrer"
                className="a-link"
              >
                コチラ
              </a>
            </b>
          </p>
          <p className="c-issue_text">
            ※ご契約のお客さま1契約につき毎月最大5枚まで発行できます。
            <br />
            ※紹介チケット1枚で、1契約をご紹介いただけます（1枚で複数の契約をご紹介いただくことはできません）。
            <br />
            ※LINEやメール、メモなどでお相手の方に紹介チケットに記載の紹介コード（11桁の英数字）をお伝えください。
            <br />
            ※発行済みの紹介チケットの有効期限は、発行月の翌月末日までです。
          </p>
        </div>
        <div className="c-issue_content">
          <div className="c-issue_content_add_wrap">
            今月の発行可能枚数
            <div className="c-issue_count">
              <b>{totalCount}</b>/5
            </div>
            <div className="c-issue_add_button_wrap">
              <button
                onClick={(e) =>
                  this.callbackDialog(
                    Const.EVENT_CLICK_BUTTON,
                    'dialog_status_change_0'
                  )
                }
                className="c-issue_add_button a-btn-radius-plus"
                disabled={totalCount == 0}
              >
                紹介チケットを発行する
              </button>
            </div>
          </div>

          {(() => {
            if (this.props.ticketList && this.props.ticketList.length > 0) {
              return this.returnTicketList()
            }
          })()}
        </div>

        <div className="t-modal" style={{ position: 'fixed' }}>
          <div className="t-modal_overlay" />
          <div
            className="t-modal_content kaiyaku"
            id="modal_id"
            style={{
              top: '50%',
              marginTop: this.state.modalTop,
            }}
          >
            <div className="m-modal">
              <div className="m-modal_inner">
                <h2 className="a-h3  a-primary a-ta-center">紹介チケット</h2>
                <p>
                  こちらの内容をイオンモバイルご契約即日お渡し店舗のスタッフにご提示の上
                  イオンモバイルを新規ご契約で後日1GBクーポンをプレゼント！
                </p>
                <CampaignTicket
                  id="print_2"
                  code={this.state.selectedTiket.code}
                  date={this.state.selectedTiket.date}
                />
                <div className="m-flex-between not-sp">
                  <div className="a-fs-sm  w-ticket_print_notis">
                    <span>
                      ※MNP転入をご希望のお客さまはMNP予約番号をご持参ください。
                      <br />
                      ※当シートは商品のご予約を承るシートではございません。
                      <br />
                      ※契約混雑状況によっては、お時間を頂戴する場合もございます。
                    </span>
                  </div>

                  <p className="m-btn">
                    <button
                      onClick={(e) => this.copyClipboard(e)}
                      className="a-pc a-btn-radius-copy"
                      type="button"
                    >
                      内容をコピー
                    </button>

                    <button
                      onClick={(e) => this.share(e)}
                      className="a-sp a-btn-radius-share mt-10"
                      type="button"
                    >
                      内容を共有
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default CampaignTabsIssue
