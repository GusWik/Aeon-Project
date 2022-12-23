import React from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import $ from 'jquery'

import '../assets/css/common.css'

import logoImage from '../assets/images/logo.png'
import pic_id_01 from '../assets/images/pic_id_01.png'

// 定数定義読み込み
import * as Const from '../../Const.js'

// 各種モジュールを読み込み
import ComponentBase from '../ComponentBase.js'
import Dialog from '../../modules/Dialog.js'
import SocialLogin from '../../modules/SocialLogin.js'
import ValidateTextBox from '../../modules/ValidateTextBox.js'

// 通信用のモジュールを読み込み
import {
  awaitPostMessage,
  dispatchGetConnections,
} from '../../actions/PostActions.js'
import { dispatchPostConnections } from '../../actions/PostActions.js'
import { setConnectionCB } from '../../actions/PostActions.js'
import {
  getPathName,
  isValidUrl,
  redirectPlanPage,
} from '../../actions/Methods.js'

const URL_MYPAGE_PLAN = '/mypage/plan/'

class Login extends ComponentBase {
  constructor(props) {
    super(props)

    // 各コールバック関数をバインド
    this.callbackDialog = this.callbackDialog.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.callbackText = this.callbackText.bind(this)
    this.callbackToolTip = this.callbackToolTip.bind(this)
    this.callbackTwitter = this.callbackTwitter.bind(this)

    // 通信関数をバインド
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.goNextDisplay = this.goNextDisplay.bind(this)

    this.SocialLink = new SocialLogin(props)

    // Loginコンポーネントのメンバ変数定義
    this.state = {
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      url_data: [
        {
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

      // ダイアログ定義
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_ONE,
          title: 'お客さまIDとパスワードについて',
          values: [
            {
              text: (
                <p>
                  お客さまIDとパスワードは、ご契約時にお渡しの
                  <span className="a-primary">お申し込み完了通知書</span>
                  に記載されています。
                </p>
              ),
            },
            {
              text: (
                <p>
                  <img src={pic_id_01} />
                </p>
              ),
            },
            { text: <p>お申し込み完了通知書をご参照の上、ご入力ください。</p> },
            {
              text: (
                <p>
                  お申し込み完了通知書を無くしてしまったお客さまは、
                  <span className="a-primary">
                    イオンモバイルお客さまセンターへ
                  </span>
                  お問い合わせください。
                  <br />
                  お問い合わせは
                  <a
                    href=""
                    id="modal_customer"
                    onClick={(e) => {
                      e.preventDefault()
                      this.callbackDialog(
                        Const.EVENT_CLICK_BUTTON,
                        'modal_customer',
                        ''
                      )
                    }}
                  >
                    こちら
                  </a>
                  。
                </p>
              ),
            },
          ],
          otherTitle: 'イオンモバイルお客さまセンター',
          others: [
            {
              text: (
                <p>
                  <a className="a-link-tel" href="tel:0120-025-260">
                    0120-025-260
                  </a>
                </p>
              ),
            },
            {
              text: (
                <p>
                  ＜受付時間＞
                  <br />
                  10時30分〜19時30分（年中無休）
                </p>
              ),
            },
          ],
          button: [
            {
              id: 'dialog_button_close',
              value: '閉じる',
              classname: 'a-btn-dismiss',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
        },
      ],
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
      // 入力枠（テキストボックス）定義
      textboxes: [
        {
          id: 'e_mail',
          type: Const.TEXT_TYPE_TEXT,
          value: '',
          classname: 'inputshape inputLogin',
          placeholder: 'メールアドレス',
          length: [1, 100],
          disabled: false,
          validate_id: 'e_e_mail',
          validate: [
            Const.TEXT_VALIDATE_LENGTH_MIN,
            Const.TEXT_VALIDATE_LENGTH_MAX,
            Const.TEXT_VALIDATE_KIND_MAIL,
          ],
          state: Const.TEXT_STATUS_INITIALIZE,
          validatestate: false,
          callback: this.callbackText,
        },
        {
          id: 'password',
          type: Const.TEXT_TYPE_PASSWORD,
          value: '',
          classname: 'inputshape inputLogin',
          placeholder: 'パスワード',
          length: [8, 20],
          disabled: false,
          validate_id: 'e_password',
          validate: [
            Const.TEXT_VALIDATE_LENGTH_MIN,
            Const.TEXT_VALIDATE_LENGTH_MAX,
            Const.TEXT_VALIDATE_KIND_PASSWORD,
          ],
          state: Const.TEXT_STATUS_INITIALIZE,
          validatestate: false,
          callback: this.callbackText,
        },
      ],
      // ボタン定義
      button: [
        {
          id: 'button_login',
          value: 'ログイン',
          classname: 'buttonshape buttongrean buttonfull',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_registration_user',
          value: '新規会員登録',
          classname: '',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_back',
          value: 'トップに戻る',
          classname: '',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_back_2',
          value: 'トップに戻る',
          classname: '',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_twitter_login',
          value: 'Twitter',
          classname: 'buttonshape twitter buttonfull',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_fb_login',
          value: 'Facebook',
          classname: 'buttonshape facebook buttonfull',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_google_login',
          value: 'Google+',
          classname: 'buttonshape google buttonfull',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
        {
          id: 'button_reissue_password',
          value: 'メールアドレス・パスワードを忘れた方',
          classname: 'registrationButtonLink',
          disabled: false,
          state: true,
          callback: this.callbackDialog,
          interval: null,
        },
      ],
      // ツールチップ
      tooltips: [
        {
          id: 'tooltips_error',
          baseid: 'button_login',
          value: '入力内容にエラーがあります',
          state: false,
          classname: 'tooltipstyle tooltipred errortooltips',
          callback: this.callbackToolTip,
        },
      ],
      // プログレス表現の表示状況
      loading_state: false,
      isDataswitchApp: false,
      isMailAuthCompleteFail: false,
      redirect_url: '',
      client_id: '',
      oauthClientId: [],
      url_params: '',
    }

    // ヒストリ
    Login.PropTypes = {
      location: ReactRouterPropTypes.location.isRequired,
      history: ReactRouterPropTypes.history.isRequired,
    }
  }

  // テキスト入力枠関連のコールバック
  callbackText(type, id, params) {
    if (type === Const.EVENT_INPUT_BLUR) {
      super.saveTextValidate(id, params)
    } else if (type === Const.EVENT_INPUT_CHANGE) {
      super.changeTextState(id, params)
    } else if (type === Const.EVENT_INPUT_FOCUS) {
      super.changeTextState(id, params)
    }
  }

  // ダイアログ関連のコールバック
  callbackDialog(type, id) {
    // console.log("callbackDialog " + id);

    var is_check = true
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'button_login': {
          // ログインボタン押下時
          // バリデートが発生していないかどうかのチェック
          // テキストボックス
          // if (super.checkTextValidate() === false) {
          //     is_check = false;
          // }

          // if (is_check === false) {
          //     var tooltips_copy;
          //     tooltips_copy = [...this.state.tooltips];
          //     tooltips_copy[0].state = true;
          //     this.setState({tooltips: tooltips_copy});
          //     return;
          // }

          // プログレス表示
          // this.setState({loading_state: true});

          // バリデートが全てOKの場合、通信を行う
          // this.handleConnect(Const.CONNECT_TYPE_LOGIN);

          break
        }
        case 'button_registration_user': {
          // 次の画面へ遷移
          // this.props.history.push('/RegisterNewMember');
          break
        }
        case 'button_back': {
          // 次の画面へ遷移
          // this.props.history.push('/Top');
          break
        }
        case 'button_back_2': {
          // 次の画面へ遷移
          // this.props.history.push('/Top');
          break
        }
        case 'button_back_img': {
          // 次の画面へ遷移
          // this.props.history.push('/Top');
          break
        }
        case 'dialog_button_1': {
          // var dialogs_copy = [...this.state.dialogs];
          // dialogs_copy[0].state = false;
          // this.setState({dialogs: dialogs_copy});
          break
        }

        case 'button_twitter_login': {
          // プログレス表示
          // this.setState({loading_state: true});
          // this.onTwitterLogin();

          break
        }
        case 'button_fb_login': {
          // プログレス表示

          // this.onFacebookLogin();

          break
        }
        case 'button_google_login': {
          // プログレス表示
          // TODO:ダイアログ閉じられたときのイベントはどこで受けるのか

          // this.onGoogleLogin();

          break
        }
        case 'button_reissue_password': {
          // パスワード再発行画面へ遷移
          // this.props.history.push('/ReissuePassword');
          break
        }
        case 'a-link': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'modal_customer': {
          if ($('#modal_id.t-modal_content').hasClass('is-active') === true) {
            $('#modal_id.t-modal_content').removeClass('is-active')
          }
          $('#modal_customer.t-modal_content').addClass('is-active')
          $('#modal_customer.t-modal_content').css('top', '319.8px')
          break
        }
        case 'dialog_button_close': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'modal_overlay': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        default: {
          break
        }
      }
    }
  }

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

  socialLoginHandler(e, type) {
    e.preventDefault()
    console.log('Social Login')
    switch (type) {
      case 'facebook':
        this.SocialLink.handleConnect('/pg/facebook/login')
        break
      case 'google':
        this.SocialLink.handleConnect('/pg/google/login')
        break
      case 'yahoo':
        this.SocialLink.handleConnect('/pg/yahoo/login')
        break
    }
  }

  // ToolTip
  callbackToolTip(type, id) {
    // console.log("callbackToolTip :: " + type + " :: " + id);
    var tooltips_copy
    if (id === 'tooltips_error') {
      tooltips_copy = [...this.state.tooltips]
      tooltips_copy[0].state = false
      this.setState({ tooltips: tooltips_copy })
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}

    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_LOGIN:
        var customer_id = $('#customer_id').val()
        var password = $('#password').val()
        var validateBase = new ValidateTextBox()
        var ischeckID = true
        var ischeckIDValidation = true
        var ischeckPW = true

        // validate customerId type
        if (
          validateBase.validate(
            Const.TEXT_VALIDATE_KIND_CUSTOMERID,
            customer_id
          ) === false
        )
          ischeckIDValidation = false

        // validate password type
        if (
          validateBase.validate(
            Const.TEXT_VALIDATE_LENGTH_MIN,
            customer_id,
            1
          ) === false
        )
          ischeckID = false

        // validate password type
        if (
          validateBase.validate(Const.TEXT_VALIDATE_LENGTH_MIN, password, 1) ===
          false
        )
          ischeckPW = false

        if (!ischeckIDValidation || !ischeckID || !ischeckPW) {
          if (!ischeckIDValidation) {
            $('#customer_id').addClass('is-error')
            $('#customer_id_error').text(
              'お客さまIDは半角数字のみ、もしくはメールアドレス形式でご入力ください'
            )
          }
          if (!ischeckID) {
            $('#customer_id').addClass('is-error')
            $('#customer_id_error').text('お客さまIDを入力してください')
          }
          if (!ischeckPW) {
            $('#password').addClass('is-error')
            $('#password_error').text('パスワードを入力してください')
          }
          return
        }
        params = {
          login_type: 'customer',
          customer: {
            customer_id: $('#customer_id').val(),
            password: $('#password').val(),
          },
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        // json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_MYPAGEID:
          console.log(data)

          if (data.data && data.data.customerId) {
            localStorage.setItem('reload', true)

            // ログイン済みユーザー用リダイレクト処理
            const path = getPathName(this.state.redirect_url)
            if (path === URL_MYPAGE_PLAN) {
              redirectPlanPage(this.props)
              return
            } else {
              this.props.history.push({
                pathname: '/mypage',
                state: { customer_id: data.data.customerId },
              })
            }
          } else {
            localStorage.removeItem('customerId')
            localStorage.removeItem('lineInfoNum')
            localStorage.removeItem('lineKeyObject')
            if (data.auth_errors) {
              let isMailAuthCompleteFail =
                this.props.history.location.state &&
                this.props.history.location.state.mailAuthComplete
              this.setState({ isMailAuthCompleteFail })
              var dialogs_copy = [...this.state.dialogs_error]
              dialogs_copy[0].title = data.code
              var values = []
              if (isMailAuthCompleteFail) {
                dialogs_copy[0].title = 'ご確認ください'
                values[0] = {
                  text: (
                    <p style={{ lineHeight: '1.8' }}>
                      メールアドレス登録・変更のお手続きはあと少しで完了します。
                      <br />
                      OKボタンを押してメッセージを閉じた後、操作していたアカウントでログインしていただくことで完了となります。
                    </p>
                  ),
                }
                dialogs_copy[0].values = values
                dialogs_copy[0].state = true
                this.setState({ dialogs_error: dialogs_copy })
              } else {
                localStorage.removeItem('mailAuthComplete')
              }
            }
          }

          break

        case Const.CONNECT_TYPE_CONTRACT_LIST:
          if (
            data.data &&
            data.data.contractList &&
            data.data.contractList.length
          ) {
            if (data.data.contractList.length > 1) {
              localStorage.setItem('reload', true)
              // 複数契約が紐づいているアカウントの場合、契約一覧へ遷移する

              //redirect_urlを確認
              let redirect_url = ''
              if (
                this.state.redirect_url &&
                isValidUrl(this.state.redirect_url)
              ) {
                redirect_url = this.state.redirect_url
              }
              this.props.history.push({
                pathname: '/mypage/user/select',
                state: {
                  customer_id: $('#customer_id').val(),
                  contractList: data.data.contractList,
                  redirect_url,
                },
              })
            } else {
              //redirect_urlを確認
              if (
                this.state.redirect_url &&
                isValidUrl(this.state.redirect_url)
              ) {
                // /mypage/plan/edit/ の場合のみ別処理
                const path = getPathName(this.state.redirect_url)
                if (path === URL_MYPAGE_PLAN) {
                  redirectPlanPage(this.props)
                  return
                } else {
                  location.href = this.state.redirect_url
                  return
                }
              }
              // トップ画面へ
              localStorage.setItem('reload', true)

              this.props.history.push({
                pathname: '/mypage',
                state: { customer_id: $('#customer_id').val() },
              })
            }
          } else {
            //redirect_urlを確認
            if (
              this.state.redirect_url &&
              isValidUrl(this.state.redirect_url)
            ) {
              // /mypage/plan/edit/ の場合のみ別処理
              const path = getPathName(this.state.redirect_url)
              if (path === URL_MYPAGE_PLAN) {
                redirectPlanPage(this.props)
                return
              } else {
                location.href = this.state.redirect_url
                return
              }
            }
            // トップ画面へ
            localStorage.setItem('reload', true)
            this.props.history.push({
              pathname: '/mypage',
              state: { customer_id: $('#customer_id').val() },
            })
          }
          break
        case Const.CONNECT_TYPE_LOGIN:
          {
            if ($('#remember:checked').val()) {
              localStorage.setItem(Const.CUSTOMERID, $('#customer_id').val())
            } else {
              localStorage.setItem(Const.CUSTOMERID, '')
            }
            if (this.state.isMailAuthCompleteFail) {
              localStorage.setItem('isMailAuthCompleteFail', true)
            }
            //リダイレクト処理
            const isRedirect = this.redirectUriCheck()
            if (isRedirect) {
              const path = getPathName(this.state.redirect_url)
              // /mypage/plan/edit/ の場合のみ別処理
              if (path === URL_MYPAGE_PLAN) {
                redirectPlanPage(this.props)
                return
              } else {
                console.log('リダイレクト処理')
                location.href = this.state.redirect_url
                return
              }
            }

            // 契約一覧取得API
            this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
          }
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        let isMailAuthCompleteFail =
          this.props.history.location.state &&
          this.props.history.location.state.mailAuthComplete
        this.setState({ isMailAuthCompleteFail })
        dialogs_copy[0].title = data.code
        var values = []
        if (isMailAuthCompleteFail) {
          values[0] = { text: 'ログインして処理を完了してください' }
        } else {
          values[0] = { text: data.message }
        }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
        // ログインエラー検知用
        awaitPostMessage('login_fail')
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

  // コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    localStorage.setItem('isLoggedIn', '0')
    localStorage.removeItem('progressApplyNumber')

    const url = new URL(window.location.href)
    const params = url.searchParams
    const client_id = params.get('client_id')
    const redirect_url = params.get('redirect_url')

    if (client_id) {
      this.setState({ client_id })
    }
    if (redirect_url) {
      this.setState({ redirect_url })
    }

    this.get_oauthClientId()

    if (url.search.length > 0) {
      console.log(url.search)
      this.setState({ url_params: url.search })
    }

    this.goTop()
    // if(window.customerId === undefined) return;
    this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    // 200
    // this.handleConnect("agreement.json");
    // バリデーションエラー用
    // this.handleConnect("agreement2.json");
    // authエラー用
    // this.handleConnect("agreement3.json");
    // apiエラー用
    // this.handleConnect("agreement4.json");

    document.title = Const.TITLE_LOGIN

    // FBapi読み込み
    /* window.fbAsyncInit = function() {
        window.FB.init({
            appId      :Const.SNS_APIKEY_FACEBOOK,
            cookie     : true,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v3.1' // use graph api version 3.1
        });
    };

    // onload GooglePlatformLibrary = gapiオブジェクト生成
    function gAsyncInit() {
        window.gapi.load('auth2', function(){window.gapi.auth2.init({ clientId: Const.SNS_APIKEY_GOOGLE });});
    }

    // Load the SDK asynchronously
    function load_async(id, src, onload) {
        var js, fjs = document.getElementsByTagName('script')[0];
        if (document.getElementById(id)) return;
        js = document.createElement('script');
        js.id = id;
        js.src = src;
        js.onload = onload;
        fjs.parentNode.insertBefore(js, fjs);
    }
    load_async('facebook-jssdk', 'https://connect.facebook.net/en_US/sdk.js', undefined);
    load_async('google-jsapi', 'https://apis.google.com/js/platform.js', gAsyncInit);
    */

    $('#a1').click(function () {
      $('#a1_target').slideToggle()
      if ($(this).hasClass('is-active') === true) {
        $('#a1').removeClass('is-active')
        localStorage.setItem('value', '0')
      } else {
        $('#a1').addClass('is-active')
        localStorage.setItem('value', '1')
      }
    })

    // login method slideing, browser closed......
    //    localStorage.clear();
    var value = localStorage.getItem('value')
    console.log('D::' + value)
    if (value == '1') {
      $('#a1').addClass('is-active')
      $('#a1_target').slideToggle()
    } else {
      $('#a1').removeClass('is-active')
    }

    $('#password').on('input', function (event) {
      $('#password').removeClass('is-error')
      $('#password_error').text('')
    })

    $('#customer_id').on('input', function (event) {
      $('#customer_id').removeClass('is-error')
      $('#customer_id_error').text('')
    })

    var customerId = localStorage.getItem(Const.CUSTOMERID)
    // customerIdが保持されていたらチェック状態に切り替える
    if (customerId) {
      $('#remember').prop('checked', true)
      $('#customer_id').val(customerId)
    }

    let ua = window.navigator.userAgent
    let isDataswitchApp = ua.includes('dataswitchApp')
    this.setState({ isDataswitchApp })
  }

  onLogin() {
    this.handleConnect(Const.CONNECT_TYPE_LOGIN)
  }

  /* Facebookログインボタン */
  onFacebookLogin() {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          window.FB.api(
            '/me',
            { fields: 'first_name,last_name,email' },
            (response) => {
              console.log(response)
              var params = {
                sns_name: 'facebook',
                sns_account_id: response.id,
                e_mail: response.email,
                name: response.first_name,
                surname: response.last_name,
              }
              // CB関数を登録する
              var dialogs_copy = [...this.state.dialogs]
              dialogs_copy[0].body = 'Facebookログインに失敗しました'
              dialogs_copy[0].state = false
              this.setState({ dialogs: dialogs_copy })
              setConnectionCB(this.handleConnectChange)
              // 通信URLと、パラメータを渡す
              this.props.dispatch(
                dispatchPostConnections('user/login_sns', params)
              )
            }
          )
        } else {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].body = 'Facebookログインに失敗しました'
          dialogs_copy[0].state = true
          this.setState({ dialogs: dialogs_copy })
        }
        // rerequestがない場合、一度emailを拒否して連携してしまうと再度連携を行うにはfacebookでの操作が必要となる。
      },
      { scope: 'email', auth_type: 'rerequest' }
    )
  }

  /* Googleログインボタン */
  onGoogleLogin() {
    var g = window.gapi.auth2.getAuthInstance()
    // googleアカウントでサインイン後 -> DB登録＆ログイン＆ダッシュボードへ
    // windowを閉じた場合に
    g.signIn().then(() => {
      var dialogs_copy
      if (g.isSignedIn.get()) {
        var profile = g.currentUser.get().getBasicProfile()
        var params = {
          sns_name: 'google',
          sns_account_id: g.currentUser.get().getId(),
          e_mail: profile.getEmail(),
          name: profile.getGivenName(),
          surname: profile.getFamilyName(),
        }
        // CB関数を登録する
        dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].body = 'Googleログインに失敗しました'
        dialogs_copy[0].state = false
        this.setState({ dialogs: dialogs_copy })
        setConnectionCB(this.handleConnectChange)
        // 通信URLと、パラメータを渡す
        this.props.dispatch(dispatchPostConnections('user/login_sns', params))
      } else {
        dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].body = 'Googleログインに失敗しました'
        dialogs_copy[0].state = true
        this.setState({ dialogs: dialogs_copy })
      }
    })
  }

  /* twitterログインボタン */
  onTwitterLogin() {
    // CB関数を登録する
    setConnectionCB(this.callbackTwitter)
    // 通信URLと、パラメータを渡す
    this.props.dispatch(dispatchPostConnections('sns/twitterOauth', []))
  }

  callbackTwitter(type, data, status) {
    var success = data.success
    if (status === Const.CONNECT_SUCCESS && success === true) {
      // 次の画面へ遷移
      // console.log(data);
      console.log(data.data)
      window.location = data.data.oauth_url
    } else if (status === Const.CONNECT_ERROR || success === false) {
      // プログレス非表示
      this.setState({ loading_state: false })

      // エラーダイアログを表示
      var dialogs_copy = [...this.state.dialogs]
      dialogs_copy[0].body = 'Twitterのログインに失敗しました'
      dialogs_copy[0].state = true
      this.setState({ dialogs: dialogs_copy })
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/contact/') {
      let params = {}
      params.frompage = 'fromLogin'
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  // リダイレクト確認(JSON include処理を除く)
  redirectUriCheck() {
    if (!(this.state.client_id && this.state.redirect_url)) {
      return false
    }

    const includeClient_id = this.includeClient_id(this.state.client_id)
    const enableUri = isValidUrl(this.state.redirect_url)

    if (
      this.state.client_id &&
      this.state.redirect_url &&
      includeClient_id &&
      enableUri //urlの形
    ) {
      return true
    } else {
      return false
    }
  }

  get_oauthClientId() {
    fetch(Const.CONNECT_TYPE_OAUTH_CLIENT_ID, {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (!json || json.length <= 0) return false
        this.setState({ oauthClientId: json.oauthClientId })
        console.log(json.oauthClientId)
      })
      .catch((err) => {
        console.log('ConnectError :', err)
      })
  }

  includeClient_id(client_id) {
    if (!this.state.oauthClientId || this.state.oauthClientId.length <= 0)
      return false
    const enableClient_id = this.state.oauthClientId.includes(client_id)
    return enableClient_id
  }

  // 画面レイアウト
  render() {
    // バリデート表現のON/OFF定義
    var e_e_mail_style = {
      display:
        this.state.textboxes[0].state === Const.TEXT_STATUS_ERROR
          ? 'block'
          : 'none',
    }
    var e_password_style = {
      display:
        this.state.textboxes[1].state === Const.TEXT_STATUS_ERROR
          ? 'block'
          : 'none',
    }
    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
        {this.state.dialogs_error.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog_' + i} />
          } else {
            return <React.Fragment key={'fragment_' + i} />
          }
        })}
        <div className="t-wrapper">
          <main className="t-main">
            <div className="t-container">
              <div className="t-inner">
                <h1 className="a-h1-logo">
                  <img src={logoImage} alt="AEON MOBILE" />
                  マイページログイン
                </h1>
                <div className="m-form">
                  <h2 className="a-h3">お客さまIDでのログイン</h2>
                  <div className="m-form_section">
                    <div className="m-field">
                      <div className="m-field_control">
                        <input
                          className="a-input"
                          type="text"
                          id="customer_id"
                          onKeyDown={(e) => {
                            if (e.keyCode == '13') this.onLogin()
                          }}
                          tabIndex="1"
                        />
                        <label className="m-field_label a-label" htmlFor="id">
                          お客さまID
                        </label>
                        <div className="m-field_modal">
                          <a
                            href=""
                            id="modal_id"
                            onClick={(e) => {
                              e.preventDefault()
                              this.callbackDialog(
                                Const.EVENT_CLICK_BUTTON,
                                'a-link',
                                ''
                              )
                            }}
                          >
                            お客さまIDとは？
                          </a>
                        </div>
                      </div>
                      <div
                        className="m-field_error a-error"
                        id="customer_id_error"
                      />
                    </div>
                    <div className="m-field">
                      <div className="m-field_control">
                        <input
                          className="a-input"
                          type="password"
                          id="password"
                          onKeyDown={(e) => {
                            if (e.keyCode == '13') this.onLogin()
                          }}
                          tabIndex="1"
                          autoComplete="off"
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
                      <div className="m-field_control-check">
                        <label htmlFor="remember">
                          <input
                            className="a-input-checkbox"
                            type="checkbox"
                            id="remember"
                          />
                          <span className="a-weak">お客さまIDを保持する</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="m-form_section">
                    <p className="m-btn">
                      <button
                        className="a-btn-submit"
                        id="btn_login"
                        type="button"
                        onClick={(e) => this.onLogin()}
                      >
                        ログイン
                      </button>
                    </p>
                    <p>
                      <a className="a-link-arrow" href="/forgot/">
                        パスワードをお忘れのお客さま
                      </a>
                    </p>
                    <p>
                      ６回以上ログインに失敗するとロックされ一定時間ご利用ができなくなりますのでご注意ください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="t-container-bg">
              <div className="t-inner">
                <div className="m-form">
                  <div className="m-auth">
                    <div id="a1" className="m-auth_header">
                      <h2 className="a-h3">他のログイン方法でログインする</h2>
                      <ul className="m-auth_logo">
                        <li>
                          <span
                            className="a-ic-email"
                            aria-label="メールアドレス"
                            role="img"
                          />
                        </li>
                        <li>
                          <span
                            className="a-ic-yahoo"
                            aria-label="Y!"
                            role="img"
                          />
                        </li>
                        <li>
                          <span
                            className="a-ic-facebook"
                            aria-label="Facebook"
                            role="img"
                          />
                        </li>
                        <li>
                          <span
                            className="a-ic-google"
                            aria-label="Google"
                            role="img"
                          />
                        </li>
                      </ul>
                      <p className="a-fs-sm">
                        他のログイン方法を設定していない方は、ご利用できません。
                      </p>
                    </div>
                    <div id="a1_target" className="m-auth_body">
                      <h3 className="a-h4 a-mb-5">
                        他のログイン方法を設定済みのお客さま
                      </h3>
                      <ul className="m-auth_btn">
                        <li>
                          <a
                            className="a-btn-logo-email"
                            href={`/login/mail${this.state.url_params}`}
                          >
                            <span
                              className="a-ic-email"
                              aria-label="メールアドレス"
                              role="img"
                            />
                            メールアドレス
                          </a>
                        </li>
                        <li>
                          <a
                            className="a-btn-logo-yahoo"
                            id="btn_y_login"
                            href="/pg/yahoo/login"
                          >
                            <span
                              className="a-ic-yahoo"
                              aria-label="Y!"
                              role="img"
                            />
                            Yahooでログイン
                          </a>
                        </li>
                        <li>
                          <a
                            className="a-btn-logo-facebook"
                            id="btn_fb_login"
                            href="/pg/facebook/login"
                          >
                            <span
                              className="a-ic-facebook"
                              aria-label="Facebook"
                              role="img"
                            />
                            Facebookでログイン
                          </a>
                        </li>
                        <li>
                          <a
                            className="a-btn-logo-google"
                            id="btn_g_login"
                            href="/pg/google/login"
                          >
                            <span
                              className="a-ic-google"
                              aria-label="Google"
                              role="img"
                            />
                            Googleでログイン
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!this.state.isDataswitchApp ? (
              <div className="t-container">
                <div className="t-inner">
                  <div className="m-footer">
                    <div className="m-footer_item">
                      <h2 className="m-footer_ttl">お問い合わせ</h2>
                      <p className="m-btn">
                        <a
                          className="a-btn-radius-arrow"
                          href=""
                          onClick={(e) => this.goNextDisplay(e, '/contact/')}
                        >
                          各種お問い合わせは
                          <wbr />
                          こちら
                        </a>
                      </p>
                    </div>
                    <div className="m-footer_item">
                      <h2 className="m-footer_ttl">AEON MOBILE公式サイト</h2>
                      <p className="m-btn">
                        <a
                          className="a-btn-official"
                          href="https://aeonmobile.jp/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <img src={logoImage} alt="AEON MOBILE公式サイト" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
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

export default connect(mapStateToProps)(Login)
