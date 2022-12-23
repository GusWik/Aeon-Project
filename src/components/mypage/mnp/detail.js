import React from 'react'
import { connect } from 'react-redux'

import '../../assets/css/common.css'

// IMPORT DIALOG
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

//各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'
import * as Const from '../../../Const.js'

class MnpDetail extends ComponentBase {
  constructor(props) {
    super(props)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      id: '',
      // FOR DIALOG ERROR
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
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_MNP
  }

  // CHECK SERVER ERROR
  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/login')
          break
      }
    }
  }

  //HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    console.log('this is from the header*******************')
    console.log(params)
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }
  render() {
    return (
      <React.Fragment>
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
          }
        })}
        <div className="t-wrapper">
          <Header
            isExistStatus={this.props.isExistStatus}
            {...this.state.url_data[0]}
          />
          <main className="t-main">
            <div className="t-container">
              <div className="t-inner">
                <ol className="m-breadcrumb">
                  <li className="m-breadcrumb_item">
                    <a href="/">TOP</a>
                  </li>
                  <li className="m-breadcrumb_item">
                    <a href="/mypage/mnp/">MNP転出のお申し込み</a>
                  </li>
                  <li className="m-breadcrumb_item">
                    【2018年7月1日より】MNP転出手数料改定について
                  </li>
                </ol>
                <h1 className="a-h1">
                  【2018年7月1日より】MNP転出手数料改定について
                </h1>
                <div className="m-news">
                  <div className="m-news_body">
                    <p>
                      平素はイオンモバイルをご利用いただき、誠にありがとうございます。
                      <br />
                      2018年7月1日(日)より、イオンモバイルではMNP転出手数料を下記のとおり改定いたします。
                    </p>
                    <p className="a-fw-bold a-fs-lg">
                      ■2018年7月1日(日)以降にご契約いただいた回線をMNP転出する場合
                      <br />
                      ・MNP転入した回線を転出する場合：
                      <span className="a-primary">3,000円(税抜)</span>
                      <br />
                      <span className="a-fw-normal a-fs-md">
                        　※MNP転入した回線は、期間に関わらず転出手数料は3,000円(税抜)となります。
                        <br />
                      </span>
                      ・契約日より90日以内に転出する場合：
                      <span className="a-primary">15,000円(税抜)</span>
                      <br />
                      ・契約日より91日以降に転出する場合：
                      <span className="a-primary">3,000円(税抜)</span>
                    </p>
                    <p>
                      ■2018年6月30日(土)までにご契約いただいた回線を2018年7月1日(日)以降にMNP転出する場合
                      <br />
                      ・MNP転入した回線を転出する場合　3,000円(税抜)
                      <br />
                      　※MNP転入した回線は、期間に関わらず転出手数料は3,000円となります。
                      <br />
                      ・契約日より90日以内に転出の場合　8,000円(税抜)
                      <br />
                      ・契約日より91日以降に転出の場合　3,000円(税抜)
                    </p>
                    <p>
                      本件につきましてご不明な点がございましたら、下記までお問合せください。
                    </p>
                    <p>
                      ■［イオンモバイルお客さまセンター］
                      <br />
                      TEL：<a href="tel:0120-025-260">0120-025-260</a>
                      　　受付時間：10:30 ~ 19:30（年中無休）
                    </p>
                  </div>
                </div>
                <p className="m-btn">
                  <a
                    className="a-btn-dismiss"
                    href="javascript:history.back();"
                  >
                    戻る
                  </a>
                </p>
              </div>
            </div>
          </main>
          <footer className="t-footer">
            <div className="t-footer_inner">
              <p className="t-footer_copyright">
                &copy; AEON RETAIL CO.,LTD. All rights reserved.
              </p>
            </div>
          </footer>
          <div className="t-pagetop">
            <a href="" data-scroll>
              TOP
            </a>
          </div>
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

export default connect(mapStateToProps)(MnpDetail)
