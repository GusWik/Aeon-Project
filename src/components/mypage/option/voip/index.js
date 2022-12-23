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

class Option_Voip extends ComponentBase {
  constructor(props) {
    super(props)
    console.log('constructor')

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
            optionConfig:
              props.history.location.state !== undefined
                ? props.history.location.state.optionConfig
                : [],
          },
          dispatch: props.dispatch,
        },
      ],
    }
  }

  componentDidMount() {
    console.log('test')
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

  return050Table(optionConfig) {
    let trs = optionConfig.map(function (data, i) {
      let name = ''
      let info = data.info
      switch (data.name) {
        case 'service_code':
          name = 'サービスコード'
          break
        case 'voip_tel_no':
          name = '050番号'
          break
        case 'sip_user_id':
          name = 'ユーザID'
          break
        case 'sip_password':
          name = 'パスワード'
          break
        default:
          break
      }
      return (
        <tr>
          <th>{name}</th>
          <td>
            <div className="m-flex-between">
              <span>{info}</span>
            </div>
          </td>
        </tr>
      )
    })
    return (
      <table className="m-simtable">
        <colgroup>
          <col className="a-wd-35 a-wd-pc-20" />
        </colgroup>
        <tbody>{trs}</tbody>
      </table>
    )
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
                    <li className="m-breadcrumb_item">050かけ放題設定情報</li>
                  </ol>
                  <h1 className="a-h1">050かけ放題設定情報</h1>
                  <div className="m-news">
                    <div className="m-news_body">
                      <p>お客さまの050かけ放題設定情報です。</p>
                      {this.return050Table(
                        this.state.url_data[0].pass_data.optionConfig
                      )}
                    </div>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div className="m-form_section">
                    <p className="a-fw-bold">
                      「初期設定マニュアル（iOS）」
                      <br />
                      <a
                        className="a-primary"
                        style={{ fontWeight: 'normal', textDecoration: 'none' }}
                        href="https://aeonmobile.jp/manual/050setting_ios.pdf"
                        target="_blank"
                      >
                        050setting_ios.pdf
                      </a>
                    </p>
                    <p className="a-fw-bold">
                      「初期設定マニュアル（Android）」
                      <br />
                      <a
                        className="a-primary"
                        style={{ fontWeight: 'normal', textDecoration: 'none' }}
                        href="https://aeonmobile.jp/manual/050setting_android.pdf"
                        target="_blank"
                      >
                        050setting_android.pdf
                      </a>
                    </p>
                    <p className="a-fw-bold">
                      「050かけ放題アプリ操作マニュアル（iOS）」
                      <br />
                      <a
                        className="a-primary"
                        style={{ fontWeight: 'normal', textDecoration: 'none' }}
                        href="https://aeonmobile.jp/manual/050manual_ios.pdf"
                        target="_blank"
                      >
                        050manual_ios.pdf
                      </a>
                    </p>
                    <p className="a-fw-bold">
                      「050かけ放題アプリ操作マニュアル（Android）」
                      <br />
                      <a
                        className="a-primary"
                        style={{ fontWeight: 'normal', textDecoration: 'none' }}
                        href="https://aeonmobile.jp/manual/050manual_android.pdf"
                        target="_blank"
                      >
                        050manual_android.pdf
                      </a>
                    </p>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div
                    className="m-form_section"
                    style={{ marginBottom: '1em' }}
                  >
                    <p>
                      ※こちらに記載の050番号、ユーザーID、パスワードは変更することができません。
                      <br />
                      他人に知られないようにご注意ください。
                    </p>
                    <p>
                      ※ご解約についてはお近くのイオンモバイル取扱い店（商品即日お渡し店舗）
                      <br />
                      もしくはイオンモバイルお客さまセンター（0120-025-260
                      受付時間：10:30-19:30（年中無休））にて解約することができます。
                      <br />
                      ご来店の際は以下の店舗一覧をご確認の上、お越しくださいますようお願い申し上げます。
                      <br />
                      <a
                        className="a-primary"
                        style={{ textDecoration: 'none' }}
                        href="https://aeonmobile.jp/shoplist/"
                        target="_blank"
                      >
                        イオンモバイル取扱い店舗一覧
                      </a>
                    </p>
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

export default connect(mapStateToProps)(Option_Voip)
