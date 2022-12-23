import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import _ from 'lodash'

import '../../assets/css/common.css'

// 各種モジュールを読み込み
import ComponentBase from '../../ComponentBase.js'

import { dispatchPostConnections } from '../../../actions/PostActions.js'
import { setConnectionCB } from '../../../actions/PostActions.js'

import * as Const from '../../../Const.js'

// import dialog
import Dialog from '../../../modules/Dialog.js'
import Header from '../../../modules/Header.js'

class Mailx extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleChangeMailFlag = this.handleChangeMailFlag.bind(this)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.checkBox = this.checkBox.bind(this)
    this.handleChangeMailListConfirm = this.handleChangeMailListConfirm.bind(
      this
    )

    console.log(
      'props.history.location.state :: ',
      props.history.location.state
    )

    this.state = {
      customer_id:
        props.history.location.state !== undefined
          ? props.history.location.state.customer_id
          : '',
      mailAddress:
        props.history.location.state !== undefined
          ? props.history.location.state.mailAddress
          : '',
      loginMailAddressFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.loginMailAddressFlg
          : '',
      initialPassChangeFlg:
        props.history.location.state !== undefined
          ? props.history.location.state.initialPassChangeFlg
          : '',
      token:
        props.history.location.state !== undefined
          ? props.history.location.state.token
          : '',

      // 変更用メールアドレス
      changeMailAddress: '',
      password: '',

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
      changeMailFlag: false,
      contractList: [],
      settingMailAddress: false,
      settingMailView: {
        agreement: null,
      },
      add_customerId: [],
      isPageLoaded: false,
    }
  }
  handleChangeMailFlag(flag) {
    this.setState({ changeMailFlag: flag })
  }

  handleConnect(type) {
    var params = {}
    this.setState({ loading_state: true })
    switch (type) {
      case Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS:
        params = {
          mail_address: $('#mail_address').val() || this.state.mailAddress,
          login_use: $('#apply').is(':checked') === true ? '1' : '0',
          password: $('#password').val(),
          token: this.state.token,
        }
        if (this.state.add_customerId.length) {
          // 複数契約の変更
          params.add_customerId = this.state.add_customerId.join()
        }
        // mail addrees match validate
        if ($('#mail_address').val() != $('#mail_address2').val()) {
          $('#mail_address').addClass('is-error')
          $('#mail_address2').addClass('is-error')
          $('#mail_address2_error').text('メールアドレスが一致しません')
          // password  match validate
          if ($('#apply').is(':checked') === true) {
            if ($('#password').val() != $('#password2').val()) {
              $('#password').addClass('is-error')
              $('#password2').addClass('is-error')
              $('#password2_error').text('パスワードが一致しません。')
              return
            }
          }
          return
        } else if ($('#apply').is(':checked') === true) {
          if ($('#password').val() != $('#password2').val()) {
            $('#password').addClass('is-error')
            $('#password2').addClass('is-error')
            $('#password2_error').text('パスワードが一致しません。')
            return
          }
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
      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }
  // ID統合後のメールアドレス設定画面表示
  handleIntegratedContractList() {
    let agreement = null
    let { contractList } = this.state
    let items = contractList
      .map((item, index) => {
        if (item.customerId === window.customerId) {
          return false
        }
        let mailAddress = item.mailAddress ? (
          <span style={{ color: '#B50080' }}>{item.mailAddress}</span>
        ) : (
          '未設定'
        )
        let loginMailAddressFlag =
          item.loginMailAddressFlag == '1' ? (
            <span style={{ color: '#B50080' }}>設定中</span>
          ) : (
            '未設定'
          )
        return (
          <tr
            key={index}
            className={
              item.customerId === window.customerId
                ? 'list-contracts-selected'
                : ''
            }
          >
            <td className="list-contracts-name arrow">
              <div className="name-contents">
                <dl className="">
                  <dt className="a-sp" style={{ width: '100%' }}>
                    お客さまID :
                  </dt>
                  <dd style={{ wordBreak: 'keep-all' }}>{item.customerId}</dd>
                </dl>
              </div>
            </td>
            <td>
              <dl>
                <dt className="a-sp">メールアドレス :</dt>
                <dd style={{ fontWeight: 'bold', wordBreak: 'keep-all' }}>
                  {mailAddress}
                </dd>
              </dl>
            </td>
            <td>
              <dl>
                <dt className="a-sp">メールアドレスログイン :</dt>
                <dd style={{ fontWeight: 'bold', wordBreak: 'keep-all' }}>
                  {loginMailAddressFlag}
                </dd>
              </dl>
            </td>
          </tr>
        )
      })
      .filter((item) => item)
    agreement = (
      <div className="container-titleSub">
        <h3 className="titleSub">その他のご契約とメールアドレス設定状況</h3>
        <div className="">
          <table className="list-contracts-table">
            <colgroup>
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="a-pc">
              <tr>
                <th>お客さまID</th>
                <th>メールアドレス</th>
                <th>メールアドレスログイン</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      </div>
    )
    this.setState({
      settingMailView: {
        agreement,
      },
      settingMailAddress: true,
    })
  }

  handleConnectChange(type, data, status, token) {
    if (token) {
      if (type !== Const.CONNECT_TYPE_CONTRACT_LIST) {
        this.setState({ token })
      }
    }
    if (status === Const.CONNECT_SUCCESS) {
      var params
      if (data.data.length > 0) {
        params = data.data[0]
      } else {
        params = data.data
      }
      switch (type) {
        case Const.CONNECT_TYPE_CHECK_MAIL_ADDRESS:
          if (params.result === 'OK') {
            // params.token
            this.handleConnect(Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS)
          }
          break
        case Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS:
          if (params.result === 'OK') {
            let url = `/mypage/mail/auth`
            this.props.history.push({
              pathname: url,
              state: params,
            })
          }
          break
        case Const.CONNECT_TYPE_CONTRACT_LIST:
          if (params && params.contractList && params.contractList.length > 1) {
            // contractList更新
            // token更新
            this.setState({
              contractList: params.contractList,
            })
            this.handleIntegratedContractList()
          }

          this.setState({ isPageLoaded: true })
          break

        default:
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        var values = []
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_MAIL

    // this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA);

    // check password chnge or not
    if (this.state.loginMailAddressFlg === 1) {
      $('#apply').prop('checked', true)
    } else {
      $('#apply').prop('checked', false)
    }

    this.checkBox()

    $('#mail_address').on('change', function () {
      $('#mail_address2_error').text($('#mail_address_error').text())
      $('#mail_address2').addClass('is-error')
      if ($('#mail_address').val() != '') {
        $('#mail_address2').removeClass('is-error')
      }
    })

    $('#mail_address').on('input', function () {
      $('#mail_address_error').text('')
      // $('#mail_address2_error').text("");
      $('#mail_address').removeClass('is-error')
      // $('#mail_address2').removeClass("is-error");
    })

    $('#mail_address2').on('input', function () {
      $('#mail_address_error').text('')
      $('#mail_address2_error').text('')
      $('#mail_address').removeClass('is-error')
      $('#mail_address2').removeClass('is-error')
    })

    $('#password').on('change', function () {
      $('#password2_error').text($('#password_error').text())
      $('#password2').addClass('is-error')
      if ($('#password').val() != '') {
        $('#password2').removeClass('is-error')
      }
    })

    $('#password').on('input', function () {
      $('#password_error').text('')
      // $('#password2_error').text("");
      $('#password').removeClass('is-error')
      // $('#password2').removeClass("is-error");
    })

    $('#password2').on('input', function () {
      $('#password_error').text('')
      $('#password2_error').text('')
      $('#password').removeClass('is-error')
      $('#password2').removeClass('is-error')
    })
    // 契約一覧取得
    this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
  }

  checkBox() {
    console.log('fla:', this.state.initialPassChangeFlg)

    if ($('#apply').is(':checked')) {
      if (this.state.initialPassChangeFlg === '1') {
        $('#pwrd.m-form_section').show()
      } else {
        $('#pwrd.m-form_section').hide()
      }
      $('#password').val('')
      $('#password2').val('')
    } else {
      $('#pwrd.m-form_section').hide()
      $('#password_error').text('')
      $('#password2_error').text('')
      $('#password').removeClass('is-error')
      $('#password2').removeClass('is-error')
      $('#pwrd.m-form_section').hide()
      // $('#password').val("");
      // $('#password2').val("");
    }
  }

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          this.setState({ dialogs_error: dialogs_copy })
          this.props.history.push('/mypage')
          break
      }
    }
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
  showConfirmModal(flag) {
    if (flag) {
      $('.t-modal').addClass('is-active')
      $('.t-modal_content').addClass('is-active')
      let top = '5%'
      $('.t-modal_content').css('top', top).css('position', 'fixed')
    } else {
      $('.t-modal').removeClass('is-active')
      $('.t-modal_content').removeClass('is-active')
      $('.t-modal_content').animate({ scrollTop: 0 }, 0, 'swing')
    }
  }
  handleChangeMailListConfirm(customerId) {
    let { add_customerId } = this.state
    if ($(`#apply${customerId}`).is(':checked') === true) {
      // メールアドレス変更対象に追加
      add_customerId.push(customerId)
    } else {
      _.pull(add_customerId, customerId)
    }
    this.setState({ add_customerId })
  }
  isIntegratable() {
    let { contractList } = this.state
    let selectedContract = _.find(contractList, {
      customerId: window.customerId,
    })
    let items = contractList.filter((item) => {
      // 選択中の契約以外で、選択中の契約とメールアドレスが同じ or メールアドレスが未設定
      return (
        item.customerId !== selectedContract.customerId &&
        (!item.mailAddress || item.mailAddress === selectedContract.mailAddress)
      )
    })
    return contractList.length > 1 && items.length
  }
  returnConfirmModal() {
    let { contractList } = this.state
    let selectedContract = _.find(contractList, {
      customerId: window.customerId,
    })
    let items = contractList
      .map((item, index) => {
        // 選択中の契約以外で、選択中の契約とメールアドレスが同じ or メールアドレスが未設定の場合のみの選択リスト
        if (
          item.customerId === selectedContract.customerId ||
          (item.mailAddress &&
            item.mailAddress !== selectedContract.mailAddress)
        ) {
          return false
        }
        let mailAddress = item.mailAddress ? (
          <span style={{ color: '#B50080' }}>{item.mailAddress}</span>
        ) : (
          '未設定'
        )
        let loginMailAddressFlag =
          item.loginMailAddressFlag == '1' ? (
            <span style={{ color: '#B50080' }}>設定中</span>
          ) : (
            '未設定'
          )
        return (
          <tr key={index}>
            <td className="a-pc">
              <div className="m-field_control-check">
                <label htmlFor={`apply${item.customerId}`}>
                  <input
                    className="a-input-checkbox"
                    type="checkbox"
                    id={`apply${item.customerId}`}
                    onClick={(e) =>
                      this.handleChangeMailListConfirm(item.customerId)
                    }
                  />
                  <span className="a-weak" style={{ paddingLeft: '2.9rem' }} />
                </label>
              </div>
            </td>
            <td
              className="list-contracts-name arrow"
              style={{ borderTop: '1px solid #afafaf' }}
            >
              <div
                className="name-contents"
                style={{ alignItems: 'center', display: 'flex' }}
              >
                <div
                  className="m-field_control-check a-sp"
                  style={{ marginRight: '2rem', paddingLeft: '1rem' }}
                >
                  <label htmlFor={`apply${item.customerId}-sp`}>
                    <input
                      className="a-input-checkbox"
                      type="checkbox"
                      id={`apply${item.customerId}-sp`}
                      onClick={(e) =>
                        this.handleChangeMailListConfirm(item.customerId)
                      }
                    />
                    <span
                      className="a-weak"
                      style={{
                        backgroundColor: '#FFFFFF',
                        paddingLeft: '2.9rem',
                      }}
                    />
                  </label>
                </div>
                <dl className="">
                  <dt className="a-sp" style={{ width: '100%' }}>
                    お客さまID :
                  </dt>
                  <dd style={{ wordBreak: 'keep-all' }}>{item.customerId}</dd>
                </dl>
              </div>
            </td>
            <td>
              <dl>
                <dt className="a-sp">メールアドレス :</dt>
                <dd
                  style={{
                    fontWeight: 'bold',
                    wordBreak: 'keep-all',
                  }}
                >
                  {mailAddress}
                </dd>
              </dl>
            </td>
            <td>
              <dl>
                <dt className="a-sp">メールアドレスログイン :</dt>
                <dd
                  style={{
                    fontWeight: 'bold',
                    wordBreak: 'keep-all',
                  }}
                >
                  {loginMailAddressFlag}
                </dd>
              </dl>
            </td>
          </tr>
        )
      })
      .filter((item) => item)
    let agreement = (
      <div className="container-titleSub">
        <div className="">
          <table className="list-contracts-table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="a-pc">
              <tr>
                <th />
                <th>お客さまID</th>
                <th>メールアドレス</th>
                <th>メールアドレスログイン</th>
              </tr>
            </thead>
            <tbody>{items}</tbody>
          </table>
        </div>
      </div>
    )
    return (
      <div className="t-modal">
        <div className="t-modal_overlay" />
        <div className="t-modal_content" id="modal_mail">
          <div className="m-modal" style={{ backgroundColor: '#F7F7F7' }}>
            <div className="m-modal_inner waonNumber">
              <h3 className="titleSub">メールアドレス変更確認</h3>
              <p>
                他の同じメールアドレスか未設定の契約の連絡先アドレスにも変更内容を適用する場合は、以下にチェックしてください。
              </p>
              <div>{agreement}</div>
            </div>
            <div
              className="m-modal_inner"
              style={{ padding: '1.0rem 2.0rem 3.0rem' }}
            >
              <div className="m-modal_btngroup">
                <div className="m-modal_btngroup_item m-btn">
                  <button
                    className="a-btn-dismiss a-btn-icon-none"
                    type="button"
                    onClick={(e) => this.showConfirmModal(false)}
                  >
                    キャンセル
                  </button>
                </div>
                <div className="m-modal_btngroup_item m-btn">
                  <a
                    className="a-btn-submit a-btn-icon-none"
                    href=""
                    onClick={(e) => {
                      e.preventDefault()
                      this.handleConnect(Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS)
                    }}
                  >
                    送信する
                  </a>
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
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
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
                      メールアドレスの登録・変更
                    </li>
                  </ol>
                  <h1 className="a-h1">メールアドレスの登録・変更</h1>
                  <div className="m-form">
                    <h2 className="a-h2">
                      登録するメールアドレスを入力して「送信する」をご選択ください。
                    </h2>
                    <ul className="a-list">
                      <li>‣ 登録できるメールアドレスは128文字以内です。</li>
                      <li>
                        ‣
                        迷惑メールなどの対策で受信アドレスを制限されている場合は、「aeonmobile.jp」からのメールを許可してください。
                      </li>
                      <li>
                        ‣
                        「送信する」を選択後、sys_aeonmobilemypage@aeonmobile.jp
                        から確認のメールが入力されたメールアドレスに届きますので、届いたメールに記載のURLを選択して登録を完了してください。
                      </li>
                    </ul>
                    <p>※変更反映まで数分かかります。</p>
                    <div className="t-inner_wide">
                      <div className="m-box-bg">
                        <div className="m-box_body">
                          <h3 className="a-h4 a-mb-5">現在のメールアドレス</h3>
                          <p className="a-fw-bold">
                            {this.state.mailAddress
                              ? this.state.mailAddress
                              : '未設定'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      if (this.state.settingMailAddress) {
                        return (
                          <div className="container-mail-select a-mb-50">
                            {this.state.settingMailView.agreement}
                          </div>
                        )
                      }
                    })()}
                    <div className="m-form_section">
                      {(() => {
                        // メールアドレスを変更する/しない
                        if (this.state.mailAddress) {
                          return (
                            <div className="m-form_section">
                              <div className="m-field">
                                <div className="m-field_control-check">
                                  <label htmlFor="changeMail1">
                                    <input
                                      checked={!this.state.changeMailFlag}
                                      className="a-input-radio"
                                      type="radio"
                                      name="changeMail"
                                      id="changeMail1"
                                      onChange={() =>
                                        this.handleChangeMailFlag(false)
                                      }
                                    />
                                    <span>メールアドレスを変更しない</span>
                                  </label>
                                </div>
                                <div className="m-field_control-check">
                                  <label htmlFor="changeMail2">
                                    <input
                                      checked={this.state.changeMailFlag}
                                      className="a-input-radio"
                                      type="radio"
                                      name="changeMail"
                                      id="changeMail2"
                                      onChange={() =>
                                        this.handleChangeMailFlag(true)
                                      }
                                    />
                                    <span>メールアドレスを変更する</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      })()}
                      {(() => {
                        // 新しいメールアドレス入力欄
                        if (
                          (this.state.mailAddress &&
                            this.state.changeMailFlag) ||
                          !this.state.mailAddress
                        ) {
                          return (
                            <div>
                              <div className="m-field">
                                <div className="m-field_control">
                                  <input
                                    className="a-input"
                                    type="email"
                                    id="mail_address"
                                    onKeyDown={(e) => {
                                      if (e.keyCode == '13')
                                        this.handleConnect(
                                          Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                        )
                                    }}
                                  />
                                  <label
                                    className="m-field_label a-label"
                                    htmlFor="email1"
                                  >
                                    新しいメールアドレス
                                  </label>
                                </div>
                                <div
                                  className="m-field_error a-error"
                                  id="mail_address_error"
                                />
                              </div>
                              <div className="m-field">
                                <div className="m-field_control">
                                  <input
                                    className="a-input"
                                    type="email"
                                    id="mail_address2"
                                    onKeyDown={(e) => {
                                      if (e.keyCode == '13')
                                        this.handleConnect(
                                          Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                        )
                                    }}
                                  />
                                  <label
                                    className="m-field_label a-label"
                                    htmlFor="email2"
                                  >
                                    新しいメールアドレス（再入力）
                                  </label>
                                </div>
                                <div
                                  className="m-field_error a-error"
                                  id="mail_address2_error"
                                />
                              </div>
                            </div>
                          )
                        }
                      })()}
                      <div className="m-field">
                        <div className="m-field_control-check">
                          <label htmlFor="apply">
                            <input
                              className="a-input-checkbox"
                              type="checkbox"
                              id="apply"
                              onClick={(e) => this.checkBox()}
                            />
                            <span className="a-weak">
                              このメールアドレスをログインで使用する
                              <br />
                            </span>
                          </label>
                        </div>
                      </div>
                      <p>
                        （こちらにチェックを入れると登録完了後にメールアドレスでログインできるようになります）
                      </p>
                    </div>
                    <div className="m-form_section" id="pwrd">
                      <hr className="a-hr a-hr-full" />
                      <h2 className="a-h2">
                        登録したメールアドレスをログインで使用する場合はパスワード変更が必要です。
                      </h2>
                      <p>
                        ご希望のパスワードを
                        <br />
                        <span className="a-primary">
                          ・英大文字と英小文字を含む
                          <br />
                          ・数字を含む
                          <br />
                          ・８文字以上、２０文字以内
                        </span>
                        <br />
                        で設定してください。
                      </p>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="password"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="password"
                          >
                            パスワード
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="password_error"
                        />
                      </div>
                      <div className="m-field">
                        <div className="m-field_control">
                          <input
                            className="a-input"
                            type="password"
                            id="password2"
                            onKeyDown={(e) => {
                              if (e.keyCode == '13')
                                this.handleConnect(
                                  Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                )
                            }}
                          />
                          <label
                            className="m-field_label a-label"
                            htmlFor="password2"
                          >
                            パスワード再入力
                          </label>
                        </div>
                        <div
                          className="m-field_error a-error"
                          id="password2_error"
                        />
                      </div>
                    </div>
                    {this.state.isPageLoaded && (
                      <div className="m-form_section">
                        <div className="m-btn-group">
                          <p className="m-btn">
                            <button
                              className="a-btn-submit"
                              onClick={(e) => {
                                if (this.isIntegratable()) {
                                  this.showConfirmModal(true)
                                } else {
                                  this.handleConnect(
                                    Const.CONNECT_TYPE_CREATE_MAIL_ADDRESS
                                  )
                                }
                              }}
                              type="button"
                              disabled={this.state.token == ''}
                            >
                              送信する
                            </button>
                          </p>
                          <p className="m-btn">
                            <a
                              className="a-btn-dismiss"
                              onClick={() => {
                                this.props.history.push('/mypage/user')
                              }}
                            >
                              戻る
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
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
            {this.returnConfirmModal()}
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

export default connect(mapStateToProps)(Mailx)
