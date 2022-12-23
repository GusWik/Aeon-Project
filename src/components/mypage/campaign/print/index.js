import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import Dialog from '../../../../modules/Dialog.js'
import CampaignTicket from '../../../../modules/CampaignTicket'

// css
import '../../../assets/css/common.css'

class CampaignTicketPrint extends ComponentBase {
  constructor(props) {
    super(props)

    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
      loading_state: false,
      dialogs_error: [
        {
          id: 0,
          type: Const.DIALOG_GENERIC_ERROR,
          title: '',
          values: [{ text: '' }],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialogError,
              interval: null,
            },
          ],
          callback: this.callbackDialogError,
          state: false,
        },
      ],
      url_data: [
        {
          callback: this.headerUrlHandler,
          pass_data: {
            customer_id:
              props.history.location.state !== undefined
                ? props.history.location.state.customer_id
                : '',
            lineKeyObject:
              props.history.location.state !== undefined
                ? props.history.location.state.lineKeyObject
                : '',
            lineDiv:
              props.history.location.state !== undefined
                ? props.history.location.state.lineDiv
                : '',
          },
          dispatch: props.dispatch,
        },
      ],

      code:
        props.history.location.state !== undefined
          ? props.history.location.state.code
          : '',
      date:
        props.history.location.state !== undefined
          ? props.history.location.state.date
          : '',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_CAMPAIGN

    if (
      !this.props.location.state ||
      this.props.location.state.code == '' ||
      !this.props.location.state.code
    ) {
      this.props.history.push('/')
    }

    //一度でも開いたらローカルストレージに保存する
    let printList = localStorage.getItem('printList')
    let obj
    if (printList) {
      obj = JSON.parse(printList)

      if (!obj.includes(this.props.location.state.code)) {
        obj.push(this.props.location.state.code)
      }
    } else {
      obj = []
      obj.push(this.props.location.state.code)
    }
    let json = JSON.stringify(obj, undefined, 1)
    localStorage.setItem('printList', json)
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          break
      }
    }
  }

  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      default:
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
        <div className="t-wrapper w-ticket_print">
          <main className="t-main">
            <div className="t-container">
              <div className="t-inner">
                <h1 className="a-primary a-h2 a-fs-xl a-ta-center">
                  紹介チケット
                </h1>
                <p className="a-ta-center a-mb-30">
                  こちらの内容をイオンモバイルご契約即日お渡し店舗のスタッフにご提示の上
                  <br />
                  イオンモバイルを新規ご契約で後日1GBクーポンをプレゼント！
                  <br />
                  ※本印刷ページは1度しか表示できません。
                  <br />
                  ご注意ください。
                </p>
                <div className="t-inner_wide w-ticket_print_content">
                  <div>
                    <CampaignTicket
                      id="print"
                      code={this.state.code}
                      date={this.state.date}
                    />
                    <div className="a-fs-sm  w-ticket_print_notis">
                      <span>
                        ※MNP転入をご希望のお客さまはMNP予約番号をご持参ください。
                        <br />
                        ※当シートは商品のご予約を承るシートではございません。
                        <br />
                        ※契約混雑状況によっては、お時間を頂戴する場合もございます。
                      </span>
                    </div>
                  </div>
                </div>
                <p className="m-btn p-none ">
                  <button
                    className="a-btn-submit"
                    onClick={(e) => {
                      try {
                        window.print()
                      } catch (e) {
                        alert(e.message)
                      }
                    }}
                  >
                    印刷する
                  </button>
                </p>

                <p className="p-none a-ta-center a-fs-sm">
                  ※印刷ボタンから印刷できない場合は、ご使用のブラウザの印刷ボタン（印刷機能）を利用してください
                </p>

                <p className="m-btn p-none ">
                  <a
                    className="a-btn-dismiss"
                    onClick={(e) =>
                      this.goNextDisplay(
                        e,
                        '/mypage/campaign/',
                        this.state.url_data[0].pass_data
                      )
                    }
                  >
                    戻る
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
  }
}

export default connect(mapStateToProps)(CampaignTicketPrint)
