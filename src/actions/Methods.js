import moment from 'moment'
import _ from 'lodash'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

import { getmypageid, getAgreementData } from './ArsActions.js'

const URL_MYPAGE_PLAN = '/mypage/plan/'

export const getPathName = (path) => {
  return path
    .replace(/\\/g, '/')
    .replace(/^[^/]*\/\/[^/]*/, '')
    .replace(/[?#].*?$/, '')
}

export const wareki = (year) => {
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

const planSelect = [
  {
    key: '01',
    select: ['03'],
    select_kind: ['11', '13'],
    select_app: ['a01', 'a03'],
  },
  {
    key: '02',
    select: [],
    select_kind: ['12'],
    select_app: ['a02'],
  },
  {
    key: '03',
    select: ['01'],
    select_kind: ['11', '13'],
    select_app: ['a01', 'a03'],
  },
  {
    key: '11',
    select: ['01', '03'],
    select_kind: ['13'],
    select_app: ['a01', 'a03'],
  },
  {
    key: '12',
    select: ['02'],
    select_kind: [],
    select_app: ['a02'],
  },
  {
    key: '13',
    select: ['01', '03'],
    select_kind: ['11'],
    select_app: ['a01', 'a03'],
  },
  {
    key: 'a01',
    select: ['01', '03'],
    select_kind: ['11', '13'],
    select_app: ['a03'],
  },
  {
    key: 'a02',
    select: ['02'],
    select_kind: ['12'],
    select_app: [],
  },
  {
    key: 'a03',
    select: ['01', '03'],
    select_kind: ['11', '13'],
    select_app: ['a01'],
  },
]

//音声プラン
const voice_plan_ids = ['01', '11', 'a03']
//シェアプラン
const share_plan_ids = ['03', '13', 'a03']

// 現在のplanNumから選択できる別プランを取得
export const getPlanList = (
  planNum,
  isAppuser,
  isKind,
  simType,
  isMulti = false
) => {
  if (!planNum) {
    return []
  }
  const selectItems = planSelect.find((item) => item.key === planNum)
  let plan_list = selectItems.select
  if (isAppuser) {
    plan_list = [...plan_list, ...selectItems.select_app]
  }
  if (isKind) {
    if ((planNum == '02' || planNum === 'a02') && simType === '2') {
      //plan_list = [...plan_list, ...selectItems.select_kind]
    } else {
      plan_list = [...plan_list, ...selectItems.select_kind]
    }
  }
  // シェアプランで2回線以上の場合 音声プランを除く
  if (share_plan_ids.includes(planNum) && isMulti) {
    plan_list = plan_list.filter(
      (item) => false == voice_plan_ids.includes(item)
    )
  }
  console.log(plan_list)
  return plan_list
}

// 解約状態の回線を除いたsimInfoの配列を返す
export const getSimInfoEnable = (simInfo) => {
  const today = moment()
  const simInfo_enable = simInfo.filter(
    (item) =>
      false ==
      (item.removeDate.length > 0 && moment(item.removeDate).isBefore(today))
  )
  return simInfo_enable
}

export const formatTelNumber = (value) => {
  if (!value) {
    return ['', '', '']
  }
  const region = 'JP'
  const util = PhoneNumberUtil.getInstance()
  // 番号と地域を設定
  const number = util.parseAndKeepRawInput(value, region)
  // 電話番号の有効性チェック
  if (!util.isValidNumberForRegion(number, region)) {
    return ['', '', '']
  }
  // ハイフン付きの形式→配列に
  return util.format(number, PhoneNumberFormat.NATIONAL).split('-')
}

//URIチェック
export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}

export const redirectPlanPage = async (props) => {
  const { customerId } = await getmypageid()
  const { lineInfo } = await getAgreementData(customerId)
  window.customerId = customerId
  let params = lineInfo[0]
  params.customer_id = customerId
  params.redirectApp = true
  localStorage.setItem('isLoggedIn', '1')
  console.log('passdate::', params)
  props.history.push({
    pathname: URL_MYPAGE_PLAN,
    state: params,
  })
}

// checkLimited optionをSIM毎にグループ化
export const groupBySimOptions = (options) => {
  const result = _.groupBy(options, 'iccid')
  let simList = []
  Object.keys(result).forEach((key) => {
    const list = result[key]
    const cancelOptionServiceId = list.map((item) => item.optionServiceId)

    simList.push({
      iccid: key,
      optionServiceId: [],
      otherOptionServiceId: [],
      cancelOptionServiceId,
    })
  })
  return simList
}

export const sameName = (newCustomerInfo, oldCustomerInfo) => {
  if (
    newCustomerInfo.firstName === oldCustomerInfo.firstName &&
    newCustomerInfo.lastName === oldCustomerInfo.lastName &&
    newCustomerInfo.firstNameKana === oldCustomerInfo.firstNameKana &&
    newCustomerInfo.lastNameKana === oldCustomerInfo.lastNameKana
  ) {
    return true
  } else {
    return false
  }
}

export const sameAddress = (newCustomerInfo, oldCustomerInfo) => {
  if (
    newCustomerInfo.address1 === oldCustomerInfo.address1 &&
    newCustomerInfo.address2 === oldCustomerInfo.address2 &&
    newCustomerInfo.address3 === oldCustomerInfo.address3 &&
    newCustomerInfo.address4 === oldCustomerInfo.address4 &&
    newCustomerInfo.address5 === oldCustomerInfo.address5 &&
    newCustomerInfo.address6 === oldCustomerInfo.address6 &&
    newCustomerInfo.zipCode === oldCustomerInfo.zipCode
  ) {
    return true
  } else {
    return false
  }
}

// カタカナ→ひらがな
export const changeKana = (str) => {
  const response = str
    ? str.replace(/[\u30A2-\u30F3]/g, (m) =>
        String.fromCharCode(m.charCodeAt(0) - 96)
      )
    : ''
  return response
}

// 7桁数値にハイフンをつける
export const formatZip = (str) => {
  const response =
    str && str.length === 7
      ? str.slice(0, 3) + '-' + str.slice(3, str.length)
      : str
  return response
}

// 文字列からハイフンを除く
export const removehyphen = (str) => {
  return str ? str.replace(/-/g, '') : str
}

// agreementのsimInfoからICCID一致を取り出す
export const getSimDetail = (number, simInfo) => {
  const result = simInfo.find((item) => item.ICCID === number)
  console.log(result)
  return result
}

// simInfoからsimKindを取得
export const getSimKind = (simInfo) => {
  console.log(simInfo)
  console.log(simInfo[0].simType)
  let simKind = ''
  if (
    simInfo.length > 1 ||
    simInfo[0].simType == '1' ||
    simInfo[0].simType == '4'
  ) {
    // シェア or 音声
    simKind = '04'
  } else if (simInfo[0].simType == '2') {
    // SMS
    simKind = '02'
  } else {
    // データ
    simKind = '01'
  }
  console.log(simKind)
  return simKind
}

// ARS共通関数
export const toHalfWidth = (input) => {
  return input.replace(/[！-～]/g, function (input) {
    return String.fromCharCode(input.charCodeAt(0) - 0xfee0)
  })
}
