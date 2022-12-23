// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

// IMPORT JQUERY
import $ from 'jquery'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'
import {
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'

import ic_integrate_complete from '../../../assets/images/ic_integrate_complete.png'
import imgEA02AC from '../../../assets/images/EA02_ac.svg'

class User_Separate_Complete extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)

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
      contractList: [],
      settingMailAddress: false,
      settingMailView: {
        agreement: null,
        description: null,
        form: null,
        title: null,
        type: 0,
      },
      selectedContract: null,
      token: null,
    }
  }
  // メールアドレス選択
  handleSelectMailAddress(item) {
    $('#mail_address_error').text('')
    this.setState({ selectedContract: item })
  }
  // ID統合後のメールアドレス設定画面表示
  handleIntegratedContractList() {
    let agreement = null
    let description = null
    let form = null
    let title = null
    let type = 0
    let iconAttention = (
      <span
        style={{
          display: 'block',
          marginRight: '8px',
          minWidth: '32px',
          width: '32px',
        }}
      >
        <img src={imgEA02AC} alt="attention" />
      </span>
    )
    let { contractList } = this.state
    let contracts = contractList.filter((item) => {
      return item.mailAddress
    })
    if (contractList.length === contracts.length) {
      // 統合するアカウント全てにメールアドレスが設定されている場合
      // 何もしない
      return
    } else if (!contracts.length) {
      // 統合するアカウントのいずれにもメールアドレスが設定されていない場合
      // agreement API で token 更新
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      title = (
        <h2 className="title">
          {iconAttention}
          <span>
            統合される契約のいずれにもメールアドレスが設定されていません。
          </span>
        </h2>
      )
      description = (
        <p className="description">
          ご連絡先メールアドレスをまとめて設定しますか？
        </p>
      )
      form = (
        <div style={{ marginBottom: '3rem' }}>
          <h3 className="title">設定するメールアドレス</h3>
          <div className="m-field">
            <div className="m-field_control">
              <input
                className="a-input"
                type="email"
                id="mail_address"
                onChange={(e) => {
                  $('#mail_address2_error').text(
                    $('#mail_address_error').text()
                  )
                  $('#mail_address2').addClass('is-error')
                  if ($('#mail_address').val() != '') {
                    $('#mail_address2').removeClass('is-error')
                  }
                }}
                onKeyDown={(e) => {
                  $('#mail_address_error').text('')
                  $('#mail_address').removeClass('is-error')
                  if (e.key == 'Enter')
                    // メールアドレス統合API
                    this.onSend(1)
                }}
              />
              <label className="m-field_label a-label" htmlFor="email1">
                メールアドレス
              </label>
            </div>
            <div className="m-field_error a-error" id="mail_address_error" />
          </div>
          <div className="m-field">
            <div className="m-field_control">
              <input
                className="a-input"
                type="email"
                id="mail_address2"
                onKeyDown={(e) => {
                  $('#mail_address_error').text('')
                  $('#mail_address2_error').text('')
                  $('#mail_address').removeClass('is-error')
                  $('#mail_address2').removeClass('is-error')
                  if (e.key == 'Enter')
                    // メールアドレス統合API
                    this.onSend(1)
                }}
              />
              <label className="m-field_label a-label" htmlFor="email2">
                メールアドレス（確認）
              </label>
            </div>
            <div className="m-field_error a-error" id="mail_address2_error" />
          </div>
        </div>
      )
      type = 1
    } else if (contracts.length === 1) {
      // 統合するアカウントの中で、メールアドレスが設定されている契約が1つのみの場合
      title = (
        <h2 className="title">
          {iconAttention}
          <span>
            統合される契約の中で、ご連絡先メールアドレスが設定されていないご契約があります。
          </span>
        </h2>
      )
      description = (
        <p className="description">
          以下の登録済みメールアドレスを設定されていないご契約にもご連絡先として設定しますか？
        </p>
      )
      let ids = contractList.map((item) => {
        if (!item.mailAddress) {
          return <dd>{item.customerId}</dd>
        }
      })
      let numbers = contractList.map((item) => {
        if (!item.mailAddress) {
          if (item.tel) {
            return <dd>{item.tel}</dd>
          } else {
            return <dd>登録無し</dd>
          }
        }
      })
      agreement = (
        <div className="container-titleSub">
          <h3 className="titleSub">設定されていないご契約</h3>
          <div className="dl-box-agreement">
            <dl>
              <dt>お客さまID</dt>
              {ids}
            </dl>
            <dl>
              <dt>ご契約電話番号</dt>
              {numbers}
            </dl>
          </div>
        </div>
      )
      form = (
        <div className="container-titleSub">
          <h3 className="titleSub">設定するメールアドレス</h3>
          <div className="m-field" style={{ textAlign: 'left' }}>
            <div className="m-field_control-check">
              <label htmlFor="selectMail1">
                <input
                  checked={true}
                  className="a-input-radio"
                  type="radio"
                  name="selectMail"
                  id="selectMail1"
                />
                <span>{contracts[0].mailAddress}</span>
              </label>
            </div>
          </div>
        </div>
      )
      this.handleSelectMailAddress(contracts[0])
    } else {
      // 統合するアカウントの中で、メールアドレスが設定されている契約が複数の場合
      title = (
        <h2 className="title">
          {iconAttention}
          <span>
            統合される契約の中で、ご連絡先メールアドレスが設定されていないご契約があります。
          </span>
        </h2>
      )
      description = (
        <p className="description">
          いずれかの契約と同じメールアドレスの設定をご希望の場合、こちらで設定ください。
        </p>
      )
      contracts = _.uniqBy(contracts, 'mailAddress')
      let radios = contracts.map((item, index) => {
        return (
          <div className="m-field_control-check" key={index}>
            <label htmlFor={`selectMail${index}`}>
              <input
                className="a-input-radio"
                type="radio"
                name="selectMail"
                id={`selectMail${index}`}
                onChange={() => this.handleSelectMailAddress(item)}
              />
              <span>{item.mailAddress}</span>
            </label>
          </div>
        )
      })
      form = (
        <div>
          <h3 className="title">設定するメールアドレス</h3>
          <div className="m-field" style={{ textAlign: 'left' }}>
            {radios}
            <div className="m-field_error a-error" id="mail_address_error" />
          </div>
        </div>
      )
    }
    this.setState({
      settingMailView: {
        agreement,
        description,
        form,
        title,
        type,
      },
      settingMailAddress: true,
    })
  }

  handleConnect(type) {
    var params = {}
    let ids = null
    let { contractList } = this.state
    switch (type) {
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        params = {
          customerId: window.customerId,
          customerInfoGetFlg: '1',
          sessionNoUseFlg: '',
          tokenFlg: '1',
          simGetFlg: '',
          lineKeyObject: '',
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        params = {
          mailFlag: '1',
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS:
        // mail address validate
        if (!$('#mail_address').val()) {
          $('#mail_address').addClass('is-error')
          $('#mail_address_error').text('メールアドレスは必須です')
          return
        } else if (!$('#mail_address2').val()) {
          $('#mail_address2').addClass('is-error')
          $('#mail_address2_error').text('メールアドレス（確認）は必須です')
          return
        } else if ($('#mail_address').val() != $('#mail_address2').val()) {
          $('#mail_address').addClass('is-error')
          $('#mail_address2').addClass('is-error')
          $('#mail_address2_error').text('メールアドレスが一致しません')
          return
        }
        ids = contractList
          .map((item) => {
            return item.customerId
          })
          .filter((item) => item !== window.customerId)
        ids = ids.join()
        params = {
          mail_address: $('#mail_address').val(),
          login_use: '0',
          password: '',
          add_customerId: ids,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_INTEGRATE_MAIL:
        if (!this.state.selectedContract) {
          $('#mail_address_error').text('メールアドレスを選択してください')
          return
        }
        ids = contractList
          .map((item) => {
            if (
              !item.mailAddress &&
              item.mailAddress != this.state.selectedContract.mailAddress
            ) {
              return item.customerId
            }
          })
          .filter((item) => item)
        ids = ids.join()
        params = {
          customerId: ids,
          mail_address: this.state.selectedContract.mailAddress,
          token: this.state.token,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        break
    }
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_AGREEMENT_DATA:
          if (data.data && data.data.token) {
            // token更新
            this.setState({ token: data.data.token })
          }
          break
        case Const.CONNECT_TYPE_CONTRACT_LIST:
          if (
            data.data &&
            data.data.contractList &&
            data.data.contractList.length
          ) {
            // contractList更新
            // token更新
            this.setState({
              contractList: data.data.contractList,
              token: data.data.token,
            })
          }
          this.handleIntegratedContractList()
          break
        case Const.CONNECT_TYPE_INTEGRATE_MAIL:
          if (data.data.result === 'OK') {
            // 完了画面へ遷移
            this.headerUrlHandler('/mypage/mail/integrate/complete')
          }
          break
        case Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS:
          if (data.data.result === 'OK') {
            // メール送信完了画面へ遷移
            this.props.history.push('/mail/auth')
          }
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      var values = []
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
    }
  }

  onSend(type) {
    switch (type) {
      case 0:
        // メールアドレス統合API
        this.handleConnect(Const.CONNECT_TYPE_INTEGRATE_MAIL)
        break
      case 1:
        // メールアドレス変更キー発行API
        this.handleConnect(Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS)
        break
      default:
        break
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_SEPARATE_COMPLETE
    // 契約一覧取得
    this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
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
                    <li className="m-breadcrumb_item">ログイン統合完了</li>
                  </ol>
                  <h1 className="a-h1">ログイン統合完了</h1>
                  <div className="m-form">
                    <div className="a-ta-center a-mb-50">
                      <img
                        src={ic_integrate_complete}
                        alt=""
                        style={{ width: '76', height: '72' }}
                      />
                      <h2 style={{ marginTop: 40 }}>
                        ログインの統合が完了しました。
                      </h2>
                    </div>
                    {(() => {
                      if (this.state.settingMailAddress) {
                        return (
                          <div className="container-mail-select a-mb-50">
                            {this.state.settingMailView.title}
                            {this.state.settingMailView.description}
                            {this.state.settingMailView.agreement}
                            {this.state.settingMailView.form}
                            <div className="m-modal_btngroup">
                              <div className="m-modal_btngroup_item m-btn">
                                <button
                                  className="a-btn-dismiss a-btn-icon-none"
                                  type="button"
                                  onClick={(e) => this.goNextDisplay(e, '/')}
                                >
                                  設定しない
                                </button>
                              </div>
                              <div className="m-modal_btngroup_item m-btn">
                                <button
                                  className="a-btn-submit a-btn-icon-none"
                                  type="button"
                                  onClick={(e) => {
                                    this.onSend(this.state.settingMailView.type)
                                  }}
                                >
                                  設定する
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })()}

                    <div className="m-form_section">
                      <p className="m-btn">
                        <a
                          className="a-btn"
                          href=""
                          onClick={(e) =>
                            this.goNextDisplay(e, '/mypage/user/list/')
                          }
                        >
                          契約一覧へ
                        </a>
                      </p>
                      <p className="m-btn">
                        <a
                          className="a-btn"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/')}
                        >
                          トップページへ
                        </a>
                      </p>
                    </div>
                  </div>
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

export default connect(mapStateToProps)(User_Separate_Complete)
