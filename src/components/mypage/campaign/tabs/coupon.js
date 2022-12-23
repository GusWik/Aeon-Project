import React, { Component } from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import moment from 'moment'
import ReactHtmlParser from 'react-html-parser'

import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import Dialog from '../../../../modules/Dialog.js'

// css
import '../../../assets/css/common.css'

// images
import logoImage from '../../../assets/images/logo.png'

// IMPORT IMAGES
import imageWaonHowToRead01 from '../../../assets/images/waon_howToRead_01.png'
import imageWaonHowToRead02 from '../../../assets/images/waon_howToRead_02.png'
import imageWaonHelpPC01 from '../../../assets/images/waon_help_pc_01.png'
import imageWaonHelpPC02 from '../../../assets/images/waon_help_pc_02.png'
import imageWaonHelpSP01 from '../../../assets/images/waon_help_sp_01.png'
import imageWaonHelpSP02 from '../../../assets/images/waon_help_sp_02.png'

class CampaignTabsCoupon extends Component {
  constructor(props) {
    super(props)

    this.goNextDisplay = props.goNextDisplay.bind(this)

    const couponList = props.waonAddPointHistoryList.filter(
      (item) => item.campaignType === '3'
    )
    //一時金は無視で

    this.state = {
      downloadExpireDate: '',
      waonAddPointHistoryList: couponList,
      waonNumberHelpModal: false,
      waonHelpModal: false,
    }
  }

  componentDidMount() {
    // 登録申請完了日4月1日～9月30日の場合、ダウンロード期間、翌年3月31日まで
    // 登録申請完了日10月1日～翌年3月31日の場合、ダウンロード期間、翌年9月30日まで
    let downloadExpireDate
    let year = moment().year()
    let date0101 = moment([year, 1, 1])
    let date0331 = moment([year, 2, 31, 23, 59, 59])
    let date0401 = moment([year, 3, 1])
    let date0930 = moment([year, 8, 30, 23, 59, 59])
    if (moment().isSameOrAfter(date0401) && moment().isSameOrBefore(date0930)) {
      // 翌年3月31日まで
      downloadExpireDate = moment([year + 1, 2, 31])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    } else if (
      moment().isSameOrAfter(date0101) &&
      moment().isSameOrBefore(date0331)
    ) {
      // 当年9月30日まで
      downloadExpireDate = moment([year, 8, 30])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    } else {
      // 翌年9月30日まで
      downloadExpireDate = moment([year + 1, 8, 30])
        .locale('ja')
        .format('YYYY年M月D日(ddd)')
    }
    this.setState({ downloadExpireDate })
  }

  renderWaonAddPointHistoryList() {
    let list = this.state.waonAddPointHistoryList.map((item, index) => {
      let waonExchangeStartDate = moment(item.waonExchangeStartDate).format(
        'YYYY年M月D日'
      )
      let waonExchangeEndDate = moment(item.waonExchangeEndDate).format(
        'YYYY年M月D日'
      )
      let status = ''
      let errorMessage = ''
      let returnCode = ''
      if (item.displayStatus && item.displayStatus.status) {
        switch (item.displayStatus.status) {
          case '1':
            status = '未使用'
            break
          case '2':
            status = 'お手続き中'
            break
          case '3':
            status = '登録申請済み'
            break
          case '4':
            status = '受取エラー'
            errorMessage = item.displayStatus.errorMessage
            returnCode = item.displayStatus.returnCode
            break
          case '5':
            status = '非表示'
            break
          default:
            break
        }
      }
      let campaign = this.props.campaignList.filter((li) => {
        return li.campaignId === item.campaignId
      })
      let campaignDescription = campaign[0] ? campaign[0].description : ''
      campaignDescription = ReactHtmlParser(campaignDescription)
      let campaignMethod = campaign[0] ? campaign[0].method : ''
      campaignMethod = ReactHtmlParser(campaignMethod)
      let disabled = false
      let disabledMessage = (
        <p style={{ marginBottom: '0' }}>
          お支払いの状況に問題があるためお受け取りいただけません。
          <br />
          恐れ入りますが、イオンモバイルお客さまセンターまでお問い合わせください。
        </p>
      )
      if (item.judgeResult) {
        disabled =
          item.judgeResult.removed === '1' ||
          item.judgeResult.forcedStoppage === '1' ||
          item.judgeResult.unpaid === '1'
        if (item.judgeResult.removed === '1') {
          disabledMessage = (
            <p style={{ marginBottom: '0' }}>
              お申し込み頂いた特典・クーポンは、特典対象となったご契約をすでに解約頂いているため、お受け取りいただけません。
            </p>
          )
        }
      }
      let select = (
        <li className="campaignItem coupon">
          <div className="wrapper">
            {/* a-pc */}
            <div className="overview a-pc">
              <div className="heading">
                <div className="left">
                  <table>
                    <tr>
                      <th>利用可能期間</th>
                      <td className="date">
                        ：{waonExchangeStartDate}〜{waonExchangeEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>企画名</th>
                      <td className="date">：{item.campaignName}</td>
                    </tr>
                  </table>
                </div>
                <div className="status">{status}</div>
              </div>

              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">説明</span>
                </p>
                {campaignDescription}
              </div>
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">使用方法</span>
                </p>
                {campaignMethod}
              </div>
            </div>
            {/* a-sp */}
            <div className="overview a-sp first">
              <div className="heading">
                <div className="status a-sp">{status}</div>
                <div className="left">
                  <table className="a-sp">
                    <tr>
                      <th>利用可能期間：</th>
                      <td className="date">
                        {waonExchangeStartDate}〜{waonExchangeEndDate}
                      </td>
                    </tr>
                    <tr>
                      <th>企画名：</th>
                      <td className="date">{item.campaignName}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div className="point">
                <div>付与：</div>
                <div>
                  <span>{item.waonAddAmount}GB</span>クーポン
                </div>
              </div>
              {(() => {
                if (item.waonCardNumber) {
                  let waonCardNumber = item.waonCardNumber.match(/.{4}/g)
                  waonCardNumber = waonCardNumber.join('-')
                  return (
                    <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                      WAONカード：{waonCardNumber}
                    </div>
                  )
                }
              })()}
              {(() => {
                if (errorMessage && returnCode) {
                  return (
                    <div className="footArea a-sp">
                      <div className="attention" style={{ marginBottom: '0' }}>
                        <span className="iconAttention" />
                        <p style={{ marginBottom: '0' }}>{errorMessage}</p>
                      </div>
                    </div>
                  )
                }
              })()}
            </div>
            {/* a-sp */}
            <div className="overview a-sp">
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">説明</span>
                </p>
                <p>{campaignDescription}</p>
              </div>
              <div className="paragraph">
                <p className="tag">
                  <span className="iconOverview">使用方法</span>
                </p>
                {campaignMethod}
              </div>
            </div>
            {/* a-pc */}
            <div
              className={`footArea a-pc ${item.waonCardNumber ? 'split' : ''}`}
            >
              <div style={{ flex: '1 1 auto' }}>
                {(() => {
                  if (disabled) {
                    return (
                      <div className="attention">
                        <span className="iconAttention" />
                        {disabledMessage}
                      </div>
                    )
                  }
                })()}
                {(() => {
                  if (item.waonCardNumber) {
                    let waonCardNumber = item.waonCardNumber.match(/.{4}/g)
                    waonCardNumber = waonCardNumber.join('-')
                    return (
                      <div style={{ padding: '0.5rem 0' }}>
                        WAONカード：{waonCardNumber}
                      </div>
                    )
                  }
                })()}
                {(() => {
                  if (errorMessage && returnCode) {
                    return (
                      <div className="attention">
                        <span className="iconAttention" />
                        <p style={{ marginBottom: '0' }}>{errorMessage}</p>
                      </div>
                    )
                  }
                })()}

                <p className="a-mb-0">
                  <a
                    className="a-btn-radius-plus applyCampaignBtn"
                    href=""
                    onClick={(e) => {
                      e.preventDefault()
                      this.goNextDisplay(
                        e,
                        '/mypage/campaign/add/',
                        item.waonAddId
                      )
                    }}
                  >
                    <p className="btnTitle">1GBクーポンをつかう</p>
                  </a>
                </p>
              </div>
            </div>
            {/* a-sp */}
            {(() => {
              if (disabled) {
                return (
                  <div className="footArea a-sp">
                    <div className="attention">
                      <span className="iconAttention" />
                      {disabledMessage}
                    </div>
                  </div>
                )
              }
            })()}
          </div>
          <p className=" a-sp" style={{ marginBottom: '0', marginTop: '1rem' }}>
            <a
              className="a-btn-radius-plus applyCampaignBtn"
              href=""
              onClick={(e) => {
                e.preventDefault()
                this.goNextDisplay(e, '/mypage/campaign/add/', item.waonAddId)
              }}
            >
              <p className="btnTitle">1GBクーポンをつかう</p>
            </a>
          </p>
        </li>
      )
      return select
    }, this)
    return <ul style={{ padding: '0' }}>{list}</ul>
  }

  showWaonHelpModal(flag) {
    this.setState({ waonHelpModal: flag })
  }
  showWaonNumberHelpModal(flag) {
    this.setState({ waonNumberHelpModal: flag })
  }

  returnWaonHelpModal() {
    return (
      <div className="t-modal is-active">
        <div className="t-modal_overlay" />
        <div
          className="t-modal_content waonHelpModal is-active"
          id="modal_mail"
          style={{ top: '5%', position: 'fixed' }}
        >
          <div className="m-modal" style={{ backgroundColor: '#F7F7F7' }}>
            <h4 className="waonHelpTitle">
              WAONカードの登録とポイントのご利用方法
            </h4>
            <div className="m-modal_inner waonHelp first">
              <div className="waonHelpWrapper">
                <div className="step">STEP1</div>
                <div>
                  <h5 className="text">クーポン・特典を選択します。</h5>
                  <div className="description">
                    <div className="imageWrap">
                      <img
                        className="image a-pc"
                        src={imageWaonHelpPC01}
                        alt="imageWaonHelpPC01"
                      />
                      <img
                        className="image a-sp"
                        src={imageWaonHelpSP01}
                        alt="imageWaonHelpSP01"
                      />
                    </div>
                    <div className="text">
                      <p>
                        ◎WAONポイントを受け取りたい特典にチェックを入れて、
                        <br />
                        「チェックしたクーポン・特典を受け取る」を選択します。
                      </p>
                      <p>
                        ◎対象のクーポン・特典に記載の登録申請期間内に限り選択できます。
                        <br />
                        登録申請期間を超えたクーポン・特典は失効します。
                      </p>
                      <p>
                        ◎複数のクーポン・特典がある場合、複数選択することでWAONカードをまとめて登録できます。
                        <br />
                        異なるWAONカードを登録する場合は、クーポン・特典ごとにWAONカードを指定してください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-modal_inner waonHelp">
              <div className="waonHelpWrapper">
                <div className="step">STEP2</div>
                <div>
                  <h5 className="text">WAONカードの番号を登録します。</h5>
                  <div className="description">
                    <div className="imageWrap">
                      <img
                        className="image a-pc"
                        src={imageWaonHelpPC02}
                        alt="imageWaonHelpPC02"
                      />
                      <img
                        className="image a-sp"
                        src={imageWaonHelpSP02}
                        alt="imageWaonHelpSP02"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-modal_inner waonHelp">
              <div className="waonHelpWrapper">
                <div className="step">STEP3</div>
                <div>
                  <h5 className="text">
                    お近くのWAONステーションなどから
                    <br />
                    ダウンロードしてご利用ください。
                  </h5>
                  <div className="description">
                    <div className="text">
                      <p>
                        ◎WAONステーションはイオン各店にございます。
                        <br />
                        WAONステーション設置店舗やダウンロードの方法などの詳細は
                        <a
                          className="notice"
                          href="https://www.waon.net/terminal/"
                          target="_blank"
                        >
                          こちら
                        </a>
                        をご確認ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner waonHelp"
              style={{ borderBottom: 'none' }}
            >
              <div className="waonHelpWrapper">
                <div>
                  <div className="description">
                    <div className="text">
                      <p className="notice">
                        ※&nbsp;ダウンロード期限までにダウンロードされなかったWAONポイントは失効します。
                      </p>
                      <p className="notice">
                        ※&nbsp;WAONカードの番号を誤って登録された場合、WAONポイントはお受け取りいただけません。
                      </p>
                      <p className="notice">
                        ※&nbsp;失効したWAONポイントはいかなる場合も再付与はできませんので、十分ご確認ください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner"
              style={{ padding: '1.0rem 2.0rem 3.0rem' }}
            >
              <div className="m-modal_btngroup">
                <div
                  className="m-modal_btngroup_item m-btn"
                  style={{ width: '100%' }}
                >
                  <button
                    className="a-btn-dismiss a-btn-icon-none"
                    type="button"
                    onClick={(e) => this.showWaonHelpModal(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  returnWaonNumberHelpModal() {
    return (
      <div className="t-modal is-active">
        <div className="t-modal_overlay" />
        <div
          className="t-modal_content is-active"
          id="modal_mail"
          style={{ top: '20%', position: 'fixed' }}
        >
          <div className="m-modal" style={{ backgroundColor: '#F7F7F7' }}>
            <div className="m-modal_inner waonNumber">
              <div
                className="help"
                style={{
                  flexDirection: 'column',
                  marginBottom: '0',
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>
                  <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    「WAON番号」の読み方
                  </p>
                  <p style={{ fontWeight: 'bold' }}>●WAON番号が2行の場合</p>
                  <div style={{ display: 'flex', marginBottom: '1em' }}>
                    <p style={{ margin: '0 1rem 0 0' }}>
                      1段目の左から右へ、2段目の左から右の順番にお読みください。
                    </p>
                    <img
                      className="image01"
                      src={imageWaonHowToRead01}
                      style={{
                        margin: '0',
                        maxWidth: '114px',
                        minWidth: '114px',
                        width: '114px',
                      }}
                      alt=""
                    />
                  </div>
                  <p style={{ fontWeight: 'bold' }}>●WAON番号が1行の場合</p>
                  <div style={{ display: 'flex' }}>
                    <p style={{ margin: '0 1rem 0 0' }}>
                      左から右の順番にお読みください。
                    </p>
                    <img
                      className="image02"
                      src={imageWaonHowToRead02}
                      style={{
                        margin: '0',
                        maxWidth: '114px',
                        minWidth: '114px',
                        width: '114px',
                      }}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-modal_inner"
              style={{ padding: '1.0rem 2.0rem 3.0rem' }}
            >
              <div className="m-modal_btngroup">
                <div
                  className="m-modal_btngroup_item m-btn"
                  style={{ width: '100%' }}
                >
                  <button
                    className="a-btn-dismiss a-btn-icon-none"
                    type="button"
                    onClick={(e) => this.showWaonNumberHelpModal(false)}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <p className="a-ta-right" style={{ marginBottom: '1.0rem' }}>
          <a
            className="a-btn-blank link"
            href=""
            onClick={(e) =>
              this.goNextDisplay(e, '/mypage/campaign/history/', '3')
            }
          >
            登録申請履歴を確認する
          </a>
        </p>
        <a className="link_help" onClick={(e) => this.showWaonHelpModal(true)}>
          <span className="icon" />
          <span>WAONカードの登録とポイントのご利用方法</span>
        </a>
        <p style={{ fontSize: '1.5rem', marginBottom: '2.0rem' }}>
          お客さまがご利用いただけるクーポンや特典が表示されます。
          <br />
          ※ お受け取りいただけるクーポンや特典がない場合は表示されません。
          <br />※
          クーポンや特典により、お受け取りにご申請やダウンロードなどのお手続きが必要なものがございます。
        </p>

        {(() => {
          if (this.state.waonAddPointHistoryList.length) {
            return <div>{this.renderWaonAddPointHistoryList()}</div>
          } else {
            return (
              <p style={{ color: '#898989', textAlign: 'center' }}>
                現在ご利用可能なクーポン・特典はありません。
              </p>
            )
          }
        })()}

        {(() => {
          if (this.state.waonNumberHelpModal) {
            return this.returnWaonNumberHelpModal()
          }
        })()}
        {(() => {
          if (this.state.waonHelpModal) {
            return this.returnWaonHelpModal()
          }
        })()}
      </React.Fragment>
    )
  }
}

export default CampaignTabsCoupon
