// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../assets/css/common.css'

// IMPORT CONST FILE
import * as Const from '../../../Const.js'

// IMPORT COMPONENT BASE
import ComponentBase from '../../ComponentBase.js'

// IMPORT MODULES
import Header from '../../../modules/Header.js'

class Guide extends ComponentBase {
  constructor(props) {
    super(props)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.state = {
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
      anchorName:
        props.history.location.state !== undefined
          ? props.history.location.state.anchorName
          : '',
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_GUIDE_MNP
    if (this.state.anchorName) {
      // アンカー指定があれば該当箇所までスクロール
      setTimeout(
        function () {
          this.scrollToItem(this.state.anchorName)
        }.bind(this),
        0
      )
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }
  // HANDLE THE HEADER LINKS
  headerUrlHandler(url, params) {
    this.props.history.push({
      pathname: url,
      state: params,
    })
  }

  slidingButton(type) {
    $('#sliding_' + type).slideToggle()
    if ($('#sliding_btn_' + type).hasClass('is-active') === true) {
      $('#sliding_btn_' + type).removeClass('is-active')
    } else {
      $('#sliding_btn_' + type).addClass('is-active')
    }
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
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">
                      {Const.TITLE_GUIDE_MNP}
                    </li>
                  </ol>
                  <h1 className="a-h1 a-mb-0 a-mb-pc-25">
                    {Const.TITLE_GUIDE_MNP}
                  </h1>
                  <h2 className="a-h3 a-mb-pc-25" style={{ margin: '25px 0' }}>
                    エラーの内容を選択してください。
                  </h2>
                  <div className="t-inner_full">
                    <div className="m-box-border">
                      <ul className="m-anchor">
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a1"
                            onClick={(e) => this.scrollToItem('#a1')}
                          >
                            <span>
                              エラーコード：F140
                              <br />
                              ご入力いただいたMNP予約番号が正しくありませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a2"
                            onClick={(e) => this.scrollToItem('#a2')}
                          >
                            <span>
                              エラーコード：M004
                              <br />
                              ご入力いただいたMNP予約番号の有効期限が不足しているため、お申込みいただけませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a3"
                            onClick={(e) => this.scrollToItem('#a3')}
                          >
                            <span>
                              エラーコード：M010
                              <br />
                              ご入力いただいた契約者名義と転入元名義（氏名、性別、生年月日）が一致しませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a4"
                            onClick={(e) => this.scrollToItem('#a4')}
                          >
                            <span>
                              エラーコード：M011
                              <br />
                              ご入力いただいたMNP予約番号の有効期限が過ぎているため、回線の切り替えを実施できませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a5"
                            onClick={(e) => this.scrollToItem('#a5')}
                          >
                            <span>
                              エラーコード：M012
                              <br />
                              ご入力いただいたMNP予約が転入元で確認できませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a6"
                            onClick={(e) => this.scrollToItem('#a6')}
                          >
                            <span>
                              エラーコード：M013、M014
                              <br />
                              転入元のご契約状況により、MNP転入を行うことができませんでした。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a7"
                            onClick={(e) => this.scrollToItem('#a7')}
                          >
                            <span>
                              エラーコード：M099、X000、X999
                              <br />
                              MNP転入に際しエラーが発生しました。
                            </span>
                          </a>
                        </li>
                        <li className="m-anchor_item">
                          <a
                            className="m-anchor_link"
                            href="#a8"
                            onClick={(e) => this.scrollToItem('#a8')}
                          >
                            <span>
                              その他
                              <br />
                              上記に記載がない場合
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="t-inner_wide">
                    <div className="m-guide" id="a1">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：F140
                        </h2>
                        <h3 className="a-h4">
                          ご入力いただいたMNP予約番号が正しくありませんでした。
                        </h3>
                      </div>
                      <h4
                        className="a-h3"
                        style={{ margin: '25px 0', paddingLeft: '22px' }}
                      >
                        MNP予約情報をご確認ください。
                      </h4>
                      <div className="m-guide_body" style={{ paddingTop: '0' }}>
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ul>
                              <li>MNP予約番号に誤りはありませんか？</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              MNP予約番号の一部に誤りがある可能性があります。転入元から発行されたMNP予約番号をご確認の上、再度お手続きください。お手続き後、新たにSIMカードを配送いたします。
                            </p>
                            <p>
                              <a
                                className="a-link-arrow"
                                href="#a9"
                                onClick={(e) => this.scrollToItem('#a9')}
                              >
                                MNPお手続きの再申込について
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a2">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M004
                        </h2>
                        <h3 className="a-h4">
                          ご入力いただいたMNP予約番号の有効期限が不足しているため、お申込みいただけませんでした。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ul>
                              <li>
                                MNP予約番号の有効期限まで10日以上残った状態でお申込みいただきましたか？
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              お申込みの時点でMNP予約番号の有効期限まで10日以上猶予がある状態でお申込みください。
                              <br />
                              大変お手数ですが、転入元にて再度MNP予約番号をお取りいただき、再度お手続きください。お手続き後、新たにSIMカードを配送いたします。
                            </p>
                            <p>
                              <a
                                className="a-link-arrow"
                                href="#a9"
                                onClick={(e) => this.scrollToItem('#a9')}
                              >
                                MNPお手続きの再申込について
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a3">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M010
                        </h2>
                        <h3 className="a-h4">
                          ご入力いただいた契約者名義と転入元名義（氏名、性別、生年月日）が一致しませんでした。
                        </h3>
                      </div>
                      <h4
                        className="a-h3"
                        style={{ margin: '25px 0', paddingLeft: '22px' }}
                      >
                        MNP予約情報をご確認ください。
                      </h4>
                      <div className="m-guide_body" style={{ paddingTop: '0' }}>
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ul>
                              <li>
                                ご契約者氏名と転入元のご契約者氏名は一致していますか？
                              </li>
                              <li>
                                ご契約者性別と転入元のご契約者性別は一致していますか？
                              </li>
                              <li>
                                ご契約者生年月日と転入元のご契約者生年月日は一致していますか？
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              転入元にご確認いただき、お申込み（ご契約者名義）と異なる点がある場合は転入元にて事前にご変更の上、再度お手続きください。お手続き後、新たにSIMカードを配送いたします。
                            </p>
                            <p>
                              <a
                                className="a-link-arrow"
                                href="#a9"
                                onClick={(e) => this.scrollToItem('#a9')}
                              >
                                MNPお手続きの再申込について
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a4">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M011
                        </h2>
                        <h3 className="a-h4">
                          ご入力いただいたMNP予約番号の有効期限が過ぎているため、回線の切り替えを実施できませんでした。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              お申込みの時点でMNP予約番号の有効期限まで10日以上猶予がある状態でお申込みください。
                              <br />
                              大変お手数ですが、転入元にて再度MNP予約番号をお取りいただき、再度お手続きください。お手続き後、新たにSIMカードを配送いたします。
                            </p>
                            <p>
                              <a
                                className="a-link-arrow"
                                href="#a9"
                                onClick={(e) => this.scrollToItem('#a9')}
                              >
                                MNPお手続きの再申込について
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a5">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M012
                        </h2>
                        <h3 className="a-h4">
                          ご入力いただいたMNP予約が転入元で確認できませんでした。
                        </h3>
                      </div>
                      <h4
                        className="a-h3"
                        style={{ margin: '25px 0', paddingLeft: '22px' }}
                      >
                        MNP予約情報をご確認ください。
                      </h4>
                      <div className="m-guide_body" style={{ paddingTop: '0' }}>
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <ul>
                              <li>MNP予約番号に誤りはありませんか？</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              MNP予約番号の一部に誤りがある可能性があります。転入元から発行されたMNP予約番号をご確認の上、再度お手続きください。お手続き後、新たにSIMカードを配送いたします。
                            </p>
                            <p>
                              <a
                                className="a-link-arrow"
                                href="#a9"
                                onClick={(e) => this.scrollToItem('#a9')}
                              >
                                MNPお手続きの再申込について
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a6">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M013、M014
                        </h2>
                        <h3 className="a-h4">
                          転入元のご契約状況により、MNP転入を行うことができませんでした。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              転入元のご契約状況により、MNP転入を行うことができませんでした。転入元にお問い合わせください。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a7">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          エラーコード：M099、X000、X999
                        </h2>
                        <h3 className="a-h4">
                          MNP転入に際して、複数のエラーが発生しました。
                        </h3>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              MNP転入に際して、複数のエラーが発生しました。下記のお客さまセンターへお問い合わせください。
                            </p>
                            <p>
                              イオンモバイルお客さまセンター
                              <br />
                              電話：
                              <a
                                className=""
                                href="tel:0120-025-260"
                                onClick={(e) => {
                                  e.preventDefault()
                                }}
                              >
                                0120-025-260
                              </a>
                              <br />
                              営業時間：10：30～19：30
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a8">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">その他</h2>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>
                              その他不明なエラーについては、下記のお客さまセンターへお問い合わせください。
                            </p>
                            <p>
                              イオンモバイルお客さまセンター
                              <br />
                              電話：
                              <a
                                className=""
                                href="tel:0120-025-260"
                                onClick={(e) => {
                                  e.preventDefault()
                                }}
                              >
                                0120-025-260
                              </a>
                              <br />
                              営業時間：10：30～19：30
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="m-guide" id="a9">
                      <div className="m-guide_header">
                        <h2 className="m-guide_ttl a-h3-line">
                          MNPお手続きの再申込について
                        </h2>
                      </div>
                      <div className="m-guide_body">
                        <div className="m-guide_media">
                          <div className="m-guide_media_body">
                            <p>ご希望のプラン</p>
                            <ul
                              style={{
                                listStyle: 'none',
                                marginBottom: '0',
                                padding: '0',
                              }}
                            >
                              <li style={{ marginBottom: '1rem' }}>
                                <div className="m-charge_item">
                                  <div
                                    className="m-charge_control"
                                    style={{
                                      borderTop: 'none',
                                      padding: '0 1.5rem',
                                    }}
                                  >
                                    <button
                                      className="m-charge_control_btn m-anchor_link"
                                      type="button"
                                      data-accordion-target={'a'}
                                      onClick={() => {
                                        this.slidingButton('voice')
                                      }}
                                      id="sliding_btn_voice"
                                      style={{ textAlign: 'left' }}
                                    >
                                      <span>音声プランのお申込みの場合</span>
                                    </button>
                                  </div>
                                  <div
                                    className="m-charge_body-accordion"
                                    id="sliding_voice"
                                  >
                                    <div
                                      style={{
                                        padding: '1.5rem 1.5rem 1.5rem 2rem',
                                      }}
                                    >
                                      今回のお申込みは一旦キャンセルとさせていただきますので、MNP予約番号を再度お取りいただいた上で新規でお申込みください。
                                      <br />
                                      ※端末セットをお申込みの場合は、ご契約お申込みのみキャンセルとなります。
                                      <br />
                                      ご注文確認メールから再度ご契約のお手続きをお願いいたします。
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li style={{ marginBottom: '1rem' }}>
                                <div className="m-charge_item">
                                  <div
                                    className="m-charge_control"
                                    style={{
                                      borderTop: 'none',
                                      padding: '0 1.5rem',
                                    }}
                                  >
                                    <button
                                      className="m-charge_control_btn m-anchor_link"
                                      type="button"
                                      data-accordion-target={'a'}
                                      onClick={() => {
                                        this.slidingButton('share')
                                      }}
                                      id="sliding_btn_share"
                                      style={{ textAlign: 'left' }}
                                    >
                                      <span>シェアプランのお申込みの場合</span>
                                    </button>
                                  </div>
                                  <div
                                    className="m-charge_body-accordion"
                                    id="sliding_share"
                                  >
                                    <div
                                      style={{
                                        padding: '1.5rem 1.5rem 1.5rem 2rem',
                                      }}
                                    >
                                      <ul
                                        style={{
                                          listStyle: 'none',
                                          marginBottom: '0',
                                          padding: '0',
                                        }}
                                      >
                                        <li style={{ marginBottom: '1rem' }}>
                                          <div className="m-charge_item">
                                            <div
                                              className="m-charge_control"
                                              style={{
                                                borderTop: 'none',
                                                padding: '0 1.5rem',
                                              }}
                                            >
                                              <button
                                                className="m-charge_control_btn m-anchor_link"
                                                type="button"
                                                data-accordion-target={'a'}
                                                onClick={() => {
                                                  this.slidingButton('all')
                                                }}
                                                id="sliding_btn_all"
                                                style={{ textAlign: 'left' }}
                                              >
                                                <span>
                                                  お申込みのすべてのMNP回線が転入エラーの場合
                                                </span>
                                              </button>
                                            </div>
                                            <div
                                              className="m-charge_body-accordion"
                                              id="sliding_all"
                                            >
                                              <div
                                                style={{
                                                  padding:
                                                    '1.5rem 1.5rem 1.5rem 2rem',
                                                }}
                                              >
                                                今回のお申込みは一旦キャンセルとさせていただきますので、MNP予約番号を再度お取りいただいた上で新規でお申込みください。
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                        <li style={{ marginBottom: '1rem' }}>
                                          <div className="m-charge_item">
                                            <div
                                              className="m-charge_control"
                                              style={{
                                                borderTop: 'none',
                                                padding: '0 1.5rem',
                                              }}
                                            >
                                              <button
                                                className="m-charge_control_btn m-anchor_link"
                                                type="button"
                                                data-accordion-target={'a'}
                                                onClick={() => {
                                                  this.slidingButton('part')
                                                }}
                                                id="sliding_btn_part"
                                                style={{ textAlign: 'left' }}
                                              >
                                                <span>
                                                  お申込みの一部のMNP回線が転入エラーの場合
                                                </span>
                                              </button>
                                            </div>
                                            <div
                                              className="m-charge_body-accordion"
                                              id="sliding_part"
                                            >
                                              <div
                                                style={{
                                                  padding:
                                                    '1.5rem 1.5rem 1.5rem 2rem',
                                                }}
                                              >
                                                お申込みの他の回線がすべて開通した時点で、開通済みの回線のみでご利用開始となります。
                                                <br />
                                                開通エラーとなった回線につきましては、後日MNP予約番号を再度お取りいただいた上で、イオンモバイル店舗にて追加でお申込みください。
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="m-btn" style={{ marginTop: '2em' }}>
                    <a
                      className="a-btn-dismiss"
                      onClick={() => {
                        this.props.history.push('/login')
                      }}
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

export default connect(mapStateToProps)(Guide)
