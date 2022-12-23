// API ENDPOINT
export const API_ENDPOINT = ''
export const API_ENTRYCODE_ENDPOINT =
  window.location.hostname == 'mypage.aeonmobile.jp'
    ? 'https://entrycode.aeonmobile.jp'
    : 'http://mypage-admin-stg.aeon.jusco.co.jp/entrycode'
export const API_ACS_ENDPOINT =
  window.location.hostname === 'mypage.aeonmobile.jp'
    ? 'https://www.payment2.aeon.co.jp/online/arg0000.do'
    : 'https://www-t.payment2.aeon.co.jp/online/arg0000.do'

// API
export const ARS002_A001 = '/api/v1/ars/ratePlanList'
export const ARS002_A002 = '/api/v1/ars/optionList'
export const ARS002_A003 = '/api/v1/ars/phoneModelList'
export const ARS002_A004 = '/pg/settlement/result'
export const ARS002_A005 = '/api/v1/ars/orderInfo'
export const ARS002_A006 = '/api/v1/ars/address'
export const ARS002_A007 = '/api/v1/ars/saveImage'
export const ARS002_A008 = '/api/v1/ars/createApplyNumber'
export const ARS002_A009 = '/api/v1/ars/updateApplyInfo'
export const ARS002_A010 = '/api/v1/ars/applyInfo'
export const ARS018_A001 = '/api/v1/ars/authWaonCard'
export const ARS021_A001 = '/api/v1/ars/judgeCouponCode'
export const ARS029_A002 = '/api/v1/ars/JWT/check' // 追加
export const ARS_GET_APP_INFO = '/api/v1/ars/appInfo'

// API（エントリーコード）
// エントリーコード有効性チェックAPI
export const ARS001_A001 = '/api/v1/sim/isValidEntryCode'

// 契約情報取得API
export const AMM00005 = '/api/v1/data/agreement'

// お客様ID返却API
export const AMM00050 = '/api/v1/auth/mypageId'

// 契約一覧取得API
export const MYP009_A001 = '/api/v1/data/contractList'

// ログインAPI
export const CONNECT_TYPE_LOGIN = '/api/v1/auth/login'

// 通知書受け取り方法取得API
export const CONNECT_TYPE_NOTIFICATION_DATA = '/api/v1/data/notification'

// 設定ファイル
var v = Date.now()
export const CAMPAIGN = `/register/json/campaign?v=${v}`
export const ERROR_ATTRIBUTE = `/register/json/attribute?v=${v}`
export const ERROR_MESSAGES = `/register/json/messages?v=${v}`
export const ERROR_PATTERN = `/register/json/errorPattern?v=${v}`
export const OPTION_HELP = `/register/json/optionHelp?v=${v}`
export const ORDER_PATTERN = `/register/json/orderPattern?v=${v}`
export const PLAN_SERVICE_ID = `/register/json/planServiceId?v=${v}`
export const SIZE_OPTION = `/register/json/sizeOption?v=${v}`
export const VERSION = `/register/json/version?v=${v}`
export const IOT_PLANS = `/register/json/iotPlans?v=${v}`
export const CHECK_SHAREADD_OPTIONSERVICEID = `/register/json/checkShareAddOptionServiceId`

// ACS設定
export const ACS_SHOPID =
  window.location.hostname === 'mypage.aeonmobile.jp' ? 'arbbmypg' : 'testmypg'
// 安心リスト
export const ANSHIN_LIST = [
  '0702010001',
  '0702010002',
  '0702010003',
  '0702010028',
  '0702010029',
  '0702010030',
]

// 青少年チェックオプション
// type = 0: Androidのみ/1: iOSのみ/2: 制限なし
export const FILTERING_LIST = [
  { id: '0702010011', type: 0 },
  { id: '0702010016', type: 2 },
  { id: '0702020223', type: 0 },
]

// ページタイトル
export const TITLE_AGREEMENT =
  'お申し込みの前に｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'
export const TITLE_STEP1 =
  'プラン・オプション選択｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'
export const TITLE_STEP2 =
  'お客さま情報入力｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'
export const TITLE_STEP3 =
  '本人確認証明登録｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'
export const TITLE_CONFIRMATION =
  '申込内容確認｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'
export const TITLE_COMPLETE =
  'お申し込み完了｜業界最安級 イオンの格安スマホ・格安SIM【イオンモバイル】'

// 文言
export const UNAPPLIED_REASON = [
  'イオンリテール株式会社が提供する有償のフィルタリングサービスではなく、別のフィルタリングサービスを利用者に使用させるため',
  '利用者が仕事をしていてフィルタリングサービスを利用することで仕事に支障が出るため',
  '利用者が障がいや病気により、フィルタリングサービスを利用することで日常生活に支障が出るため',
  '契約者が、利用者が有害情報など閲覧しないように利用状況を適切に把握するため',
]
// image mime type
export const IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png']
// ご利用注意事項
export const usageNotesOptions = [
  {
    name: 'イオンモバイルセキュリティPlus',
    optionServiceId: '0702020223',
    usageNotesTitle: 'イオンモバイルセキュリティPlusのご利用注意事項について',
    usageNotesDescription:
      '■ 「Google」アプリには、フィルタリングが機能しないため、「Google」アプリでのインターネット閲覧を禁止いただくために、「イオンモバイルセキュリティPlus」の「アプリロック」で「Google」アプリをロックする必要がございます。\n■ スマートフォンによっては、デフォルトブラウザに対して、フィルタリングが機能しない場合がありますので、「イオンモバイルセキュリティPlus」の「アプリロック」でデフォルトブラウザアプリをロックする必要がございます。\n■ スマートフォンによっては、スマートフォンの「設定」の内容を変更することで、ご利用者による「イオンモバイルセキュリティPlus」アプリのアンインストールが可能となる場合がありますので、常時チャイルドロックをオンにし、「設定」をロックする必要がございます。\n■ スマートフォンによっては、スマートフォンの「設定」⇒「電池」設定で消費電力を抑える「省電力モード」等をオンにした場合、フィルタリングが機能できなくなる場合がございますので、「省電力モード」は、「オフ」に設定する必要がございます。\n■ スマートフォンによっては、スマートフォンの「設定」⇒「電池」設定内の「アプリ起動」でイオンモバイルセキュリティPlusの「バックグラウンドで実行」をオフにすると、イオンモバイルセキュリティPlusアプリが閉じた際に、フィルタリング機能が解除されますので、「バックグラウンドで実行」は常に「オン」に設定する必要がございます。',
    usageNotesComment: '',
  },
  {
    name: 'Filii',
    optionServiceId: '0702020224',
    usageNotesTitle: 'Filiiの注意事項について',
    usageNotesDescription:
      '■ FiliiはAndroidの通知領域に表示されたLINE等のメッセージ内容を読み取り、各種分析を行います。\nそのため、LINE等がスマートフォンのディスプレイに表示された状態で、メッセージを受け取ると通知領域にメッセージが表示されないため、Filiiの分析対象となりませんので、ご注意下さい。\n■ スマートフォンによっては、スマートフォンの「設定」⇒「電池」設定で消費電力を抑える「省電力モード」等をオンにした場合、Filiiが正しく機能しない場合がございますので、「省電力モード」は、「オフ」に設定する必要がございます。\n■ イオンモバイルの「子どもパック」サービスもご利用される場合、「子どもパック」サービスで提供している「Filii Lite」との併用はご利用いただけませんので、「Filii Lite」は、インストールされないようにご注意下さい。',
    usageNotesComment: '',
  },
]

// 西暦 => 和暦
export function wareki(year) {
  var eras = [
    { year: 2018, name: '令和' },
    { year: 1988, name: '平成' },
    { year: 1925, name: '昭和' },
    { year: 1911, name: '大正' },
    { year: 1867, name: '明治' },
  ]
  for (var i in eras) {
    var era = eras[i]
    var baseYear = era.year
    var eraName = era.name

    if (year > baseYear) {
      var eraYear = year - baseYear

      if (eraYear === 1) {
        return eraName + '元年'
      }

      return eraName + eraYear + '年'
    }
  }
  return null
}
// 和暦 => 西暦
export function seireki(warekiYear) {
  var matches = warekiYear.match(
    '^(明治|大正|昭和|平成|令和)([元0-9０-９]+)年$'
  )
  if (matches) {
    var eraName = matches[1]
    var year = parseInt(
      matches[2].replace(/[元０-９]/g, function (match) {
        if (match === '元') {
          return 1
        }
        return String.fromCharCode(match.charCodeAt(0) - 65248)
      })
    )
    if (eraName === '明治') {
      year += 1867
    } else if (eraName === '大正') {
      year += 1911
    } else if (eraName === '昭和') {
      year += 1925
    } else if (eraName === '平成') {
      year += 1988
    } else if (eraName === '令和') {
      year += 2018
    }
    return year + '年'
  }
  return null
}
export function toHalfWidth(input) {
  return input.replace(/[！-～]/g, function (input) {
    return String.fromCharCode(input.charCodeAt(0) - 0xfee0)
  })
}
