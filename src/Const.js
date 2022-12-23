// local or dev
const TARGET = 'dev'

// テキスト入力関連
// テキスト入力イベント種別
export const EVENT_INPUT_BLUR = 1
export const EVENT_INPUT_CHANGE = 2
export const EVENT_INPUT_FOCUS = 3

// テキスト入力のタイプ
export const TEXT_TYPE_TEXT = 'text'
export const TEXT_TYPE_PASSWORD = 'password'

// テキスト入力枠のバリデート
export const TEXT_VALIDATE_LENGTH_MIN = 1
export const TEXT_VALIDATE_LENGTH_MAX = 2

export const TEXT_VALIDATE_KIND_NUMBER = 11
export const TEXT_VALIDATE_KIND_ALPHA = 12
export const TEXT_VALIDATE_KIND_NUMBER_ALPHA = 13
export const TEXT_VALIDATE_KIND_ASCII = 14
export const TEXT_VALIDATE_KIND_MAIL = 15
export const TEXT_VALIDATE_KIND_PASSWORD = 16
export const TEXT_VALIDATE_KIND_ALPHA_U_L = 17

// テキスト入力枠のステータス
export const TEXT_STATUS_INITIALIZE = 1
export const TEXT_STATUS_NORMAL = 2
export const TEXT_STATUS_ERROR = 3
export const TEXT_STATUS_READONLY = 4
export const TEXT_STATUS_HIDDEN = 5

// セレクトボックス入力関連
// セレクトボックスイベント種別
export const SELECT_INITIALIZE = 1
export const SELECT_CHANGE = 2

// セレクトボックスのタイプ
export const SELECT_TYPE_NORMAL = 'normal'
export const SELECT_TYPE_GROUP = 'group' // optgroupを利用する時
export const SELECT_TYPE_YEAR = 'year'
export const SELECT_TYPE_MONTH = 'month'
export const SELECT_TYPE_DAY = 'day'
export const SELECT_TYPE_YEAR_OVER_10 = 'year_over_10'

// セレクト入力枠のステータス
export const SELECT_STATUS_NORMAL = 1
export const SELECT_STATUS_ERROR = 2
export const SELECT_STATUS_READONLY = 3
export const SELECT_STATUS_HIDDEN = 4

// ラジオボタン関連
// ラジオボタンイベント種別
export const RADIO_CHANGE = 1

// ラジオボタンのステータス
export const RADIO_STATUS_INITIALIZE = 1
export const RADIO_STATUS_NORMAL = 2
export const RADIO_STATUS_ERROR = 3

// チェックボックス関連
// チェックボックスイベント種別
export const CHECKBOX_CHANGE = 1

// チェックボックスのタイプ
export const CHECKBOX_TYPE_NORMAL = 'normal'
export const CHECKBOX_TYPE_NO_VALIDATE = 'novalidate'

// チェックボックスのステータス
export const CHECKBOX_STATUS_INITIALIZE = 1
export const CHECKBOX_STATUS_NORMAL = 2
export const CHECKBOX_STATUS_ERROR = 3
export const CHECKBOX_STATUS_READONLY = 4
export const CHECKBOX_STATUS_HIDDEN = 5

// ダイアログ関連
// ダイアログイベント種別
export const EVENT_CLICK_BUTTON = 1

// ダイアログの種類
export const DIALOG_ONE = 1
export const DIALOG_TWO = 2
export const DIALOG_THREE = 3
export const DIALOG_GENERIC_ERROR = 101

// 2ボタン、3ボタン用
export const DIALOG_BUTTON_LEFT = 1
export const DIALOG_BUTTON_MIDDLE = 2
export const DIALOG_BUTTON_RIGHT = 3

// 1ボタン用
export const DIALOG_BUTTON_ONE = 1

// 汎用ダイアログからのCBのID
export const DIALOG_GENERIC_ERROR_BUTTON = 'generic_dialog_button_1'

// ToolTip関連
// ToolTipイベント種別
export const TOOLTIP_CLICK_BUTTON = 1

// アップロード関連
// アップロードのタイプ
export const UPLOAD_TYPE_NORMAL = 'normal'
export const UPLOAD_TYPE_NO_VALIDATE = 'novalidate'

// アップロードのステータス
export const UPLOAD_STATUS_INITIALIZE = 1
export const UPLOAD_STATUS_CHANGE = 2
export const UPLOAD_STATUS_REMOVE = 3
export const UPLOAD_STATUS_HIDDEN = 4
export const UPLOAD_STATUS_ERROR = 5

// アップロードのイベント種別
export const UPLOAD_CHANGE = 1

// ダッシュボード関連
export const DASHBOARD_MOVE_FRAME = 1
export const DASHBOARD_SCROLL_TOP = 2
export const DASHBOARD_SCROLL_BOTTOM = 3
export const DASHBOARD_SAVE_VALUE = 4

export const DASHBOARD_MOVE_TYPE_DASHBOARD = 0
export const DASHBOARD_MOVE_TYPE_INFORMATION_USER = 1
export const DASHBOARD_MOVE_TYPE_REGISTRATION_USER = 2
export const DASHBOARD_MOVE_TYPE_EDIT_USER = 3
export const DASHBOARD_MOVE_TYPE_EDIT_EMAIL = 4
export const DASHBOARD_MOVE_TYPE_EDIT_PASSWORD = 5
export const DASHBOARD_MOVE_TYPE_INFORMATION_PILOT = 11
export const DASHBOARD_MOVE_TYPE_REGISTRATION_PILOT = 12
export const DASHBOARD_MOVE_TYPE_EDIT_PILOT = 13
export const DASHBOARD_MOVE_TYPE_INFORMATION_OWNER = 21
export const DASHBOARD_MOVE_TYPE_REGISTRATION_OWNER = 22
export const DASHBOARD_MOVE_TYPE_EDIT_OWNER = 23
export const DASHBOARD_MOVE_TYPE_TOP = 99

export const TITLE_CONTACT = 'お問い合わせ'

export const TITLE_FORGOT = 'パスワードをお忘れのお客さま'
export const TITLE_FORGOT_COMPLETE = 'メール送信完了'
export const TITLE_FORGOT_RESET = 'パスワード設定'
export const TITLE_FORGOT_RESET_CONFIRM = 'パスワード設定確認'
export const TITLE_FORGOT_RESET_COMPLETE = 'パスワード設定完了'

export const TITLE_GUIDE = 'マイページご利用方法'
export const TITLE_GUIDE_MNP = 'MNP転入エラーについて'

export const TITLE_LOGIN = 'マイページログイン'
export const TITLE_LOGIN_MAIL = 'メールアドレスログイン'

export const TITLE_MAIL = 'メールアドレス登録'
export const TITLE_MAIL_AUTH = 'メール送信完了'
export const TITLE_MAIL_AUTH_COMPLETE = '本人確認完了'

export const TITLE_MYPAGE = 'トップページ'

export const TITLE_MYPAGE_CALL_USAGE = '通話料明細'
export const TITLE_MYPAGE_CALL_HISTORY = '通話履歴'

export const TITLE_MYPAGE_CAMPAIGN = '紹介チケット・クーポン・特典'
export const TITLE_MYPAGE_CAMPAIGN_HISTORY = '登録申請済みのクーポン・特典'

export const TITLE_MYPAGE_MAIL = 'メールアドレスの登録・変更'
export const TITLE_MYPAGE_MAIL_AUTH = 'メール送信完了'
export const TITLE_MYPAGE_MAIL_AUTH_COMPLETE = 'メールアドレス変更完了'
export const TITLE_MYPAGE_MAIL_INTEGRATE_COMPLETE = 'メールアドレス統合完了'

export const TITLE_MYPAGE_MNP = 'MNP転出のお申し込み'
export const TITLE_MYPAGE_MNP_CANCEL = 'お申し込みキャンセル'
export const TITLE_MYPAGE_MNP_FAIL = 'お申し込み失敗'
export const TITLE_MYPAGE_MNP_SUCCESS = 'お申し込み完了'

export const TITLE_MYPAGE_NEWS = 'お知らせ一覧'
export const TITLE_MYPAGE_NEWS_DETAIL = '記事タイトル'

export const TITLE_MYPAGE_NOTICE = '完了通知'
export const TITLE_MYPAGE_NOTICE_CHANGE = '各種完了通知書の受け取り方法変更'
export const TITLE_MYPAGE_NOTICE_COMPLETE =
  '各種完了通知書の受け取り方法変更完了'

export const TITLE_MYPAGE_OPERATE = 'マイページ操作履歴'
export const TITLE_MYPAGE_OPERATE_PASSWORD = 'パスワード変更'
export const TITLE_MYPAGE_OPERATE_PASSWORD_COMPLETE = 'パスワード変更完了'
export const TITLE_MYPAGE_OPERATE_PASSWORD_CONFIRM = 'パスワード変更確認'

export const TITLE_MYPAGE_OPTION = 'アプリ／オプション'

export const TITLE_MYPAGE_PAYMENT_CHANGE = 'お支払いクレジットカードの変更'
export const TITLE_MYPAGE_PAYMENT_CANCEL = '変更申し込みキャンセル'
export const TITLE_MYPAGE_PAYMENT_FAIL = '変更失敗'
export const TITLE_MYPAGE_PAYMENT_SUCCESS = '変更申し込み完了'

export const TITLE_MYPAGE_PLAN = '料金プランのご変更'
export const TITLE_MYPAGE_PLAN_COMPLETE = 'プラン変更申込完了'

export const TITLE_MYPAGE_PLAN_CHANGE = '料金プランのご変更'
export const TITLE_MYPAGE_PLAN_CHANGE_COMPLETE = 'プラン変更申込み取消完了'

export const TITLE_MYPAGE_SIM = '070-1111-1111'
export const TITLE_MYPAGE_SIM_USER = 'SIM名称変更'
export const TITLE_MYPAGE_SIM_CHANGE = 'SIMカードの停止・再開'
export const TITLE_MYPAGE_SIM_REISSUE = 'SIMカードの再発行'
export const TITLE_MYPAGE_SIM_OPTION = 'オプション選択'

export const TITLE_MYPAGE_CHANGE_NAME = 'プラン変更'
export const TITLE_MYPAGE_CHANGE_TRANSFER = '名義変更(利用権譲渡)'
export const TITLE_MYPAGE_CHANGE_INHERIT = '名義変更(承継)'

export const TITLE_MYPAGE_SPEED = 'データ通信容量追加'
export const TITLE_MYPAGE_SPEED_COMPLETE = 'データ通信容量追加完了'
export const TITLE_MYPAGE_SPEED_CHANGE = 'データ通信速度の切り替え'

export const TITLE_MYPAGE_COMMUNICATION_CHANGE = '５G ON/OFF 切り替え'

export const TITLE_MYPAGE_USAGE = 'ご利用明細一覧'
export const TITLE_MYPAGE_USED = '過去30日分の使用量'
export const TITLE_MYPAGE_USER = 'お客さま情報／ログイン設定'
export const TITLE_MYPAGE_USER_GA = 'Google Authenticator登録'
export const TITLE_MYPAGE_USER_INTEGRATE = 'ログイン統合'
export const TITLE_MYPAGE_USER_INTEGRATE_COMPLETE = 'ログイン統合完了'
export const TITLE_MYPAGE_USER_SELECT = '契約選択'
export const TITLE_MYPAGE_USER_SEPARATE = 'ログイン分離'
export const TITLE_MYPAGE_USER_SEPARATE_COMPLETE = 'ログイン分離完了'
export const TITLE_MYPAGE_USER_LIST = '契約一覧'

export const TITLE_MYPAGE_USER_CANCELLATION_PROCEDURE = '解約手続き'

export const TITLE_MAIN =
  '業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'

export const TITLE_ERROR = 'エラー'

export const DASHBOARD_MOVE_FRAME_BACK = 100

// 通信関連
// ドメイン
export const API_URL = 'http://hg5l3cnrutlq.mediar.jp'
export const DOMAIN = '/api/v1'

export const CHCREDIT_API =
  window.location.hostname === 'mypage.aeonmobile.jp'
    ? 'https://www.payment2.aeon.co.jp/online/arg0000.do'
    : 'https://www-t.payment2.aeon.co.jp/online/arg0000.do'
export const CHCREDIT_SHOPID =
  window.location.hostname === 'mypage.aeonmobile.jp' ? 'arbbmypg' : 'testmypg'

// 通信URL
export const CONNECT_TYPE_TOPDATA = '/data/data'
export const CONNECT_TYPE_CALL_LOG_DATA = '/data/callLog'
export const CONNECT_TYPE_NOTICE_LIST_DATA = '/data/noticeList'
export const CONNECT_TYPE_CHARGE_DETAIL_DATA = '/data/chargeDetail'
export const CONNECT_TYPE_NOTICE_DETAIL_DATA = '/data/noticeDetail'
export const CONNECT_TYPE_TOP_DATA = '/data/top'
export const CONNECT_TYPE_NOTIFICATION_DATA = '/data/notification'
export const CONNECT_TYPE_INSERT_NOTIFICATION = '/data/insertNotification'
export const CONNECT_TYPE_NOTIFICATION_LOG_DATA = '/data/notificationLog'
export const CONNECT_TYPE_DOWNLOAD_NOTIFICATION_LOG_DATA =
  '/data/downloadNotificationLog'
export const CONNECT_TYPE_SIM_DATA = '/data/sim'
export const CONNECT_TYPE_LINE_STATUS = '/data/lineStatus'
export const CONNECT_TYPE_CHANGE_LINE_STATUS = '/data/changeLineStatus'
export const CONNECT_TYPE_CREDIT_DETAIL_DATA = '/data/creditDetail'
export const CONNECT_TYPE_USE_DATA_LIST = '/data/useDataList'
export const CONNECT_TYPE_MYPAGE_LOG_DATA = '/data/myPageLog'
export const CONNECT_TYPE_CHANGE_USER_INFO = '/data/changeUserInfo'
export const CONNECT_TYPE_AGREEMENT_DATA = '/data/agreement'
export const CONNECT_TYPE_CHECK_MAIL_ADDRESS = '/data/checkMailAddress'
export const CONNECT_TYPE_CREATE_MAIL_ADDRESS = '/data/createMailAddress'
export const CONNECT_TYPE_CANCEL_PLAN = '/data/cancelPlan'
export const CONNECT_TYPE_CHANGE_PLAN = '/data/changePlan'
export const CONNECT_TYPE_ADD_COUPON = '/data/addCoupon'
export const CONNECT_TYPE_HIGH_SPEED_STATUS = '/data/highspeedStatus'
export const CONNECT_TYPE_CHANGING_PLAN_MST = '/data/changingPlanMst'
export const CONNECT_TYPE_COMMISSION_MST = '/data/commissionMst'
export const CONNECT_TYPE_PLAN = '/data/plan'
export const CONNECT_TYPE_TOP_NOTICE_DATA = '/data/topNotice'
export const CONNECT_TYPE_CHANGE_SIM = '/data/changeSim'
export const CONNECT_TYPE_SIM_STATUS = '/data/simStatus'
export const CONNECT_TYPE_OPTIONAGREEMENT = '/data/optionAgreement'
export const CONNECT_TYPE_ISSUEORDERID = '/data/issueOrderId'
export const CONNECT_TYPE_REQUESTMNP = '/data/requestMnp'
export const CONNECT_TYPE_MNPPORTOUT = '/data/mnpPortOut'
export const CONNECT_TYPE_CHANGEMAILADDRESS = '/data/changeMailAddress'
export const CONNECT_TYPE_CAMPAIGN = '/data/campaign'
export const CONNECT_TYPE_WAON = '/data/waon'
export const CONNECT_TYPE_REQUESTWAON = '/data/requestWaon'
export const CONNECT_TYPE_PAYMENTERROR = '/data/paymentError'
export const CONNECT_TYPE_APPLY_LINE_LIST = '/data/applyLineList'
export const CONNECT_TYPE_REQUEST_ACTIVATE = '/data/requestActivate'
export const CONNECT_TYPE_CONTRACT_LIST = '/data/contractList'
export const CONNECT_TYPE_CHANGE_CONTRACT = '/data/changeContract'
export const CONNECT_TYPE_REQUEST_INTEGRATE_ID = '/auth/requestIntegrateId'
export const CONNECT_TYPE_INTEGRATE_ID = '/auth/integrateId'
export const CONNECT_TYPE_INTEGRATE_MAIL = '/data/integrateMail'
export const CONNECT_TYPE_LOGIN = '/auth/login'
export const CONNECT_TYPE_MYPAGEID = '/auth/mypageId'
export const CONNECT_TYPE_REMOVE_LOGIN = '/auth/removeLogin'
export const CONNECT_TYPE_FORGOT = '/auth/requestPass'
export const CONNECT_TYPE_FORGOT_RESET_CHECK = '/auth/checkPass'
export const CONNECT_TYPE_FORGOT_RESET_COMP = '/auth/compPass'
export const CONNECT_TYPE_CREATE_GA_SECRET_KEY = '/auth/createGaSecretKey'
export const CONNECT_TYPE_ISOLATE_ID = '/auth/isolateId'
export const CONNECT_TYPE_CHANGE_PASS = '/data/changePass'
export const CONNECT_TYPE_LOGOUT = '/auth/logout'
export const CONNECT_TYPE_ERROR_MESSAGES = '/register/json/errorMessages'
export const CONNECT_TYPE_PAYMENT_CHANGE_DISABLED =
  '/register/json/paymentChangeDisabled'
export const CONNECT_TYPE_IOT_PLANS = '/register/json/iotPlans'

//解約
export const CONNECT_TYPE_CANCEL_LINE = '/data/cancelLine'

//5G対応
export const CONNECT_TYPE_GET_5G_STATUS = '/data/get5gStatus'
export const CONNECT_TYPE_CHANGING_5G_STATUS = '/data/change5gStatus'

//紹介クーポン
export const CONNECT_TYPE_CREATE_TICKET = '/ars/createTicket' //紹介チケット発行API
export const CONNECT_TYPE_GET_TICKET_LIST = '/ars/getTicketList' //紹介チケット発行済み一覧取得API
export const CONNECT_TYPE_CHECK_1G_TICKET = '/ars/check1GTicket' //1Gクーポン使用チェックAPI
export const CONNECT_TYPE_USE_1G_TICKET = '/ars/use1GTicket' //1Gクーポン使用API

//期限プラン
export const CONNECT_TYPE_IOT_TIME_LIMITED_PLANS =
  '/register/json/timelimitedPlans'

//解約新規対応古いID一覧
export const CONNECT_TYPE_CANCELLATION_NEW_IDS =
  '/register/json/cancellationNewIds'
// ARS
export const ARS_CREATE_APPLY_NUMBER = '/api/v1/ars/createApplyNumber'
export const ARS_APPLY_NUMBER = '/api/v1/ars/applyInfo'
export const ARS_UPDATE_APPLY_INFO = '/api/v1/ars/updateApplyInfo'
export const ARS_OPTION_LIST = '/api/v1/ars/optionList'
export const ARS_RATE_PLAN_LIST = '/api/v1/ars/ratePlanList'
export const ARS_APPLY_ENTRY_INFO = '/api/v1/ars/applyEntryInfo'
export const ARS_ADDRESS = '/api/v1/ars/address'
export const ARS_SAVE_IMAGE = '/api/v1/ars/saveImage'

// ADFS認証
export const ARS_APP_INFO = '/api/v1/ars/appInfo'

// 郵便番号検索
export const CONNECT_TYPE_ADDRESS = 'https://api.zipaddress.net/?zipcode='

export const APN_IIJ_URL = 'https://aeonmobile.jp/apn/#type1'
export const APN_NCOM_URL = 'https://aeonmobile.jp/apn/#type2'

// 通信ステータス
export const CONNECT_NONE = 0
export const CONNECT_START = 1
export const CONNECT_SUCCESS = 2
export const CONNECT_ERROR = 3

// SNS
export const SNS_APIKEY_FACEBOOK = ''
export const SNS_APIKEY_GOOGLE = ''

// エラーコード
export const CONNECT_CODE_NOLOGIN = 12

// customerId
export const CUSTOMERID = 'customer_id'
export const LINEKEYOBJECT = 'lineKeyObject'
export const LINEDIV = 'lineDiv'

export const ONETIMEID = 'onetime_id'

//期限プラン
export const CONNECT_TYPE_OAUTH_CLIENT_ID = '/register/json/oauthClientId'

//保証系オプション
//安心保証系オプションIDリスト,
export const INSURANCE_OPTIONS_A = [
  '0702010001',
  '0702010002',
  '0702010003',
  '0702010004',
  '0702010005',
  '0702010006',
  '0702010015',
  '0702010028',
  '0702010029',
  '0702010030',
  '0702010031',
  '0702010032',
  '0702010033',
  '0702010034',
  '0702010035',
  '0702010037',
]
//安心保証以外の保証オプションIDリスト,
export const INSURANCE_OPTIONS_B = ['0702010024', '0702010025']

//SIMのみJAN
export const SIM_JAN_CODES = ["4545904002409","4545904002416","4545904002423","4545904002430","2007940471134","2007940471141","2007940471158","2007940471175","2007940471103","2007940471110","2007940471127","2007940487500","2007940487517","2007940487555","2007940487562","2007940487579","2007940487586","2007940514374","2007940514381","2007940514398","2007940514220","2007940514237","2007940514244","2007940514251","2007940514275","2007940514299","2007940514312","2007940514336","2007940514350","2007940514268","2007940514282","2007940514305","2007940514329","2007940514343","2007940514367","4545904003567","2007940524502","2007940528265","2007940528272","4545904003437","2007942238605","2007942238612"]

// 設定ファイル
var v = Date.now()
export const OPTION_HELP = `/register/json/optionHelp?v=${v}`
