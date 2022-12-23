// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT IMAGES

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'

class Option_Service extends ComponentBase {
  constructor(props) {
    super(props)

    this.headerUrlHandler = this.headerUrlHandler.bind(this)

    this.state = {
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      url_data: [
        {
          callback: this.headerUrlHandler,
          pass_data: {
            customer_id:
              props.history.location.state !== undefined
                ? props.history.location.state.customer_id
                : '',
          },
          dispatch: props.dispatch,
        },
      ],
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_OPTION
  }

  // HANDLE THE HEADER LINKS
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
        <div>
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
                      <a href="/mypage/option/">アプリ／オプション</a>
                    </li>
                    <li className="m-breadcrumb_item">
                      イオンスマホ安心保証のサービス拡充について
                    </li>
                  </ol>
                  <h1 className="a-h1">
                    イオンスマホ安心保証のサービス拡充について
                  </h1>
                  <div className="m-news">
                    <div className="m-news_body">
                      <p>
                        2018年3月1日より、「イオンスマホ安心保証」の保証期間を、従来の3年間から永年に変更いたしました。
                        <br />
                        同日以降にお申込みのお客さまは、新しい保証期間が自動的に適用されます。
                        <br />
                        2018年2月28日までにご契約されたお客さまで新サービスへ切り替えを希望される方は、下記のいずれかの方法でオプション変更のお申込みをお願い申し上げます。
                      </p>
                      <p>
                        ■お申込み方法（いずれかの方法でお願いいたします）
                        <br />
                        1.全国のイオンモバイル取扱店（ご契約即日お渡し店舗）にご来店いただきお手続き
                        <br />
                        　店舗一覧はこちら
                        <a
                          href="https://aeonmobile.jp/shoplist/"
                          target="_blank"
                          className="a-link"
                        >
                          https://aeonmobile.jp/shoplist/
                        </a>
                      </p>
                      <p>
                        2.イオンモバイルお客さまセンターへのお電話によるお手続き
                        <br />
                        <a href="tel:0120-025-260">0120-025-260</a>{' '}
                        【受付時間】10:30-19:30(年中無休)
                      </p>
                      <p>
                        ■注意事項
                        <br />
                        ・ご契約されているご本人さまによるお手続きが必要です。
                        <br />
                        ・現在加入されている安心保証の保証期間内に変更をお申込みください（満期後の延長・変更のお手続きはできません）
                        <br />
                        ・変更後のサービスは、お客さまからオプション解約のお申込みが無い限り、保証および課金が継続いたします。
                        <br />
                        ・オプションの変更・追加・解約などの翌月適用には、適用開始前月末日の前日までのご申請が必要です。
                        <br />
                        ・サービスを加入しているイオンモバイル回線を解約された時点で、保証サービスは終了となります。
                      </p>
                      <p>
                        本件につきましてご不明な点がございましたら、下記までお問合せください。
                        <br />
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
              <a href="" onClick={(e) => this.scrollToTop(e)}>
                TOP
              </a>
            </div>
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

export default connect(mapStateToProps)(Option_Service)
