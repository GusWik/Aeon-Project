import fetch from './fetch'
//import * as Const from './Const'
//import '../App.css'
import _ from 'lodash'
import moment from 'moment'

const v = Date.now()
const Const = {
  API_ENDPOINT: '',
  ORDER_PATTERN: `/register/json/planServiceId?v=${v}`,
  VERSION: `/register/json/version?v=${v}`,
  CAMPAIGN: `/register/json/campaign?v=${v}`,
  ERROR_ATTRIBUTE: `/register/json/attribute?v=${v}`,
  ERROR_MESSAGES: `/register/json/messages?v=${v}`,
  ERROR_PATTERN: `/register/json/errorPattern?v=${v}`,
  CHECK_SHAREADD_OPTIONSERVICEID: `/register/json/checkShareAddOptionServiceId`,
}

export default class Validations {
  static errorAttribute
  static campaign
  static errorMessages
  static errorPattern
  static orderPattern
  static version
  static checkShareAddOptionServiceId

  static initialize() {
    Validations.getVersion()
    Validations.getCampaign()
    Validations.getOrderPattern()
    Validations.getErrorAttribute()
    Validations.getErrorMessages()
    Validations.getErrorPattern()
    Validations.getCheckShareAddOptionServiceId()
  }
  // DW注文経由のチェック
  static isOrderPattern(type, params) {
    let orderPattern = Validations.orderPattern
    if (!orderPattern) return false
    orderPattern = orderPattern[type]
    switch (type) {
      case 'sim':
        let setModelId = params.setModelId
        let simJanCode = params.simJanCode
        return (
          orderPattern.setModelId === setModelId &&
          orderPattern.simJanCode.indexOf(simJanCode) !== -1
        )
      default:
        return false
    }
  }
  // 値の有効チェック
  static isValid(value) {
    return value !== '' && value !== null && value !== undefined
  }
  static validationCheck(context, apiName, key, required) {
    let formState
    if (key.startsWith('aeonPeople.')) {
      formState = context.state
    } else {
      formState = context.state.formState
    }

    let value = Validations.returnValueByKey(key, context, formState)
    let attribute = Validations.errorAttribute[apiName][key]

    //法人用 エラー項目名を変換
    if (key == 'customerInfo.lastName' && formState.customerInfo.gender === 3) {
      attribute = 'ご契約法人名'
    } else if (
      key == 'customerInfo.lastNameKana' &&
      formState.customerInfo.gender === 3
    ) {
      attribute = 'ご契約法人名（フリガナ）'
    } else if (
      key == 'customerInfo.zipCode' &&
      formState.customerInfo.gender === 3
    ) {
      attribute = '会社所在地の郵便番号'
    }

    if (required && !Validations.isValid(value)) {
      // 必須
      let message
      switch (key) {
        case 'simList.mnpNameKind':
          message =
            '転入元の名義とご契約者の名義について、いずれかを選択してください'
          break
        case 'simList.receptionKbn':
          message = 'MNPのご利用について、いずれかを選択してください'
          break
        case 'planServiceId':
          message = '基本データ容量を選択してください'
          break
        case 'simList.simSize':
          message = 'SIMサイズを選択してください'
          break
        default:
          message = attribute + 'は必須です'
          break
      }
      return {
        result: 'NG',
        attribute,
        error: 'required',
        message,
      }
    } else if (!value) {
      return {
        result: 'OK',
      }
    }

    let errorPattern = _.find(Validations.errorPattern[apiName], { key })
    if (errorPattern) {
      let error
      let errorMessages = JSON.stringify(Validations.errorMessages)
      errorMessages = JSON.parse(errorMessages)
      let pattern
      Object.keys(errorPattern).map((_key) => {
        var param = errorPattern[_key]
        switch (_key) {
          case 'enum':
            let isIncluded
            param.map((item) => {
              if (value == item) {
                isIncluded = true
              }
            })
            if (!isIncluded) {
              error = _key
            }
            break
          case 'fixedlength':
            // 文字数固定長
            if (parseInt(param) !== value.length) {
              error = _key
              pattern = parseInt(param)
            }
            break
          case 'maxlength':
            // 文字数超過
            if (parseInt(param) < value.length) {
              error = _key
              pattern = parseInt(param)
            }
            break
          case 'minlength':
            // 文字数不足
            if (value.length < parseInt(param)) {
              error = _key
              pattern = parseInt(param)
            }
            break
          case 'pattern':
            // 文字列パターン
            let regexp = new RegExp(param)
            let match = value.toString().match(regexp)
            if (!match) {
              error = _key
            }
            break
          case 'message':
            // 設定されたカスタムメッセージでデフォルトのエラーメッセージを更新
            Object.keys(param).map((__key) => {
              let newMessage = param[__key]
              errorMessages[__key] = newMessage
            })
            break
          default:
            break
        }
      })
      let result = { result: error ? 'NG' : 'OK' }

      if (error) {
        let message = errorMessages[error]
          .replace('{attribute}', attribute)
          .replace('{pattern}', pattern)
        result.attribute = attribute
        result.error = error
        result.message = message
      } else {
        // 姓名のバリデーションは別で記述
        if (
          key == 'simList.lastName' ||
          key == 'simList.firstName' ||
          key == 'simList.lastNameKana' ||
          key == 'simList.firstNameKana' ||
          key == 'simList.mnpLastName' ||
          key == 'simList.mnpFirstName' ||
          key == 'simList.mnpLastNameKana' ||
          key == 'simList.mnpFirstNameKana' ||
          key == 'customerInfo.lastName' ||
          key == 'customerInfo.firstName' ||
          key == 'customerInfo.lastNameKana' ||
          key == 'customerInfo.firstNameKana'
        ) {
          let coutlast, coutfirst, countTotal, message

          //姓名
          if (
            key == 'customerInfo.lastName' ||
            key == 'customerInfo.firstName'
          ) {
            coutlast =
              key == 'customerInfo.lastName'
                ? value
                : formState.customerInfo.lastName
            coutfirst =
              key == 'customerInfo.firstName'
                ? value
                : formState.customerInfo.firstName
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              if (formState.customerInfo.gender == 3) {
                message = '法人名は24文字以下で登録してください'
              } else {
                message = '姓名あわせて24文字以下で登録してください'
              }
            } else {
              error = 'OK'
            }

            //セイメイ
          } else if (
            key == 'customerInfo.lastNameKana' ||
            key == 'customerInfo.firstNameKana'
          ) {
            coutlast =
              key == 'customerInfo.lastNameKana'
                ? value
                : formState.customerInfo.lastNameKana
            coutfirst =
              key == 'customerInfo.firstNameKana'
                ? value
                : formState.customerInfo.firstNameKana
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              if (formState.customerInfo.gender == 3) {
                message = 'ホウジンメイは24文字以下で登録してください'
              } else {
                message = 'セイメイあわせて24文字以下で登録してください'
              }
            } else {
              error = 'OK'
            }
          } else if (
            key == 'simList.mnpLastName' ||
            key == 'simList.mnpFirstName'
          ) {
            coutlast =
              key == 'simList.mnpLastName'
                ? value
                : Validations.returnValueByKey(
                    'simList.mnpLastName',
                    context,
                    formState
                  )
            coutfirst =
              key == 'simList.mnpFirstName'
                ? value
                : Validations.returnValueByKey(
                    'simList.mnpFirstName',
                    context,
                    formState
                  )
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              message = '姓名あわせて24文字以下で登録してください'
            } else {
              error = 'OK'
            }

            //セイメイ
          } else if (
            key == 'simList.mnpLastNameKana' ||
            key == 'simList.mnpFirstNameKana'
          ) {
            coutlast =
              key == 'simList.mnpLastNameKana'
                ? value
                : Validations.returnValueByKey(
                    'simList.mnpLastNameKana',
                    context,
                    formState
                  )
            coutfirst =
              key == 'simList.mnpFirstNameKana'
                ? value
                : Validations.returnValueByKey(
                    'simList.mnpFirstNameKana',
                    context,
                    formState
                  )
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              message = 'セイメイあわせて24文字以下で登録してください'
            } else {
              error = 'OK'
            }
            //利用者のバリデーション追加
          } else if (key == 'simList.lastName' || key == 'simList.firstName') {
            coutlast =
              key == 'simList.lastName'
                ? value
                : Validations.returnValueByKey(
                    'simList.lastName',
                    context,
                    formState
                  )
            coutfirst =
              key == 'simList.firstName'
                ? value
                : Validations.returnValueByKey(
                    'simList.firstName',
                    context,
                    formState
                  )
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              message = '姓名あわせて24文字以下で登録してください'
            } else {
              error = 'OK'
            }

            //セイメイ
          } else if (
            key == 'simList.lastNameKana' ||
            key == 'simList.firstNameKana'
          ) {
            coutlast =
              key == 'simList.lastNameKana'
                ? value
                : Validations.returnValueByKey(
                    'simList.lastNameKana',
                    context,
                    formState
                  )
            coutfirst =
              key == 'simList.firstNameKana'
                ? value
                : Validations.returnValueByKey(
                    'simList.firstNameKana',
                    context,
                    formState
                  )
            countTotal = Number(coutlast.length) + Number(coutfirst.length)
            if (countTotal > 24) {
              error = 'NG'
              message = 'セイメイあわせて24文字以下で登録してください'
            } else {
              error = 'OK'
            }
          }

          result = { result: error }
          if (error) {
            result.attribute = attribute
            result.error = error
            result.message = message
          }
        }

        //未来日かどうか
        if (key == 'simList.birthday') {
          console.log(value, moment(value).isAfter(moment(), 'date'))
          if (moment(value).isAfter(moment(), 'date')) {
            error = 'NG'
            result = { result: error }
            if (error) {
              result.attribute = attribute
              result.error = error
              result.message = '生年月日を正しく選択してください'
            }
          }
        }
      }

      return result
    }
  }
  static getOrderPattern() {
    if (Validations.orderPattern) {
      // 取得済みならそのまま返却
      return Validations.orderPattern
    }

    fetch(Const.API_ENDPOINT + Const.ORDER_PATTERN)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.orderPattern = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.orderPattern
      })
  }
  static getVersion() {
    if (Validations.version) {
      // 取得済みならそのまま返却
      return Validations.version
    }
    fetch(Const.API_ENDPOINT + Const.VERSION)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.version = resJson.version
          let v = localStorage.getItem('v')
          if (!v || v < Validations.version) {
            localStorage.setItem('v', Validations.version)
            if (v < Validations.version) {
              window.location.reload()
            }
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.version
      })
  }

  static getCampaign() {
    if (Validations.campaign) {
      // 取得済みならそのまま返却
      return Validations.campaign
    }
    fetch(Const.API_ENDPOINT + Const.CAMPAIGN)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.campaign = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.campaign
      })
  }
  static getErrorAttribute() {
    if (Validations.errorAttribute) {
      // 取得済みならそのまま返却
      return Validations.errorAttribute
    }
    fetch(Const.API_ENDPOINT + Const.ERROR_ATTRIBUTE)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.errorAttribute = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.errorAttribute
      })
  }
  static getErrorMessages() {
    if (Validations.errorMessages) {
      // 取得済みならそのまま返却
      return Validations.errorMessages
    }
    fetch(Const.API_ENDPOINT + Const.ERROR_MESSAGES)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.errorMessages = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.errorMessages
      })
  }
  static getErrorPattern() {
    if (Validations.errorPattern) {
      // 取得済みならそのまま返却
      return Validations.errorPattern
    }

    fetch(Const.API_ENDPOINT + Const.ERROR_PATTERN)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.errorPattern = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.errorPattern
      })
  }
  static getCheckShareAddOptionServiceId() {
    if (Validations.checkShareAddOptionServiceId) {
      // 取得済みならそのまま返却
      return Validations.checkShareAddOptionServiceId
    }
    fetch(Const.API_ENDPOINT + Const.CHECK_SHAREADD_OPTIONSERVICEID)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson) {
          Validations.checkShareAddOptionServiceId = resJson
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        return Validations.checkShareAddOptionServiceId
      })
  }
  static returnValueByKey(key, context, formState) {
    let value
    switch (key) {
      case 'customerId':
        value = formState[key]
        break
      case 'entryCode':
        value = formState[key].join('')
        break
      case 'password':
        value = formState[key]
        break
      case 'planServiceId':
        value = formState[key]
        break
      case 'customerInfo.tel':
        value = formState.customerInfo.tel.join('')
        break
      case 'customerInfo.waonNumber':
        value = formState.customerInfo.waonNumber.join('')
        break
      case 'aeonPeople.tel':
        value = formState.aeonPeople.tel.join('')
        break
      case 'simList.birthday':
        value = formState.simList[context.state.index].birthday.join('')
        break
      case 'simList.mnpBirthday':
        value = formState.simList[context.state.index].mnpBirthday.join('')
        break
      case 'simList.mnpTel':
        value = formState.simList[context.state.index].mnpTel.join('')
        break
      case 'simList.mnpReserveNumber':
        value = formState.simList[context.state.index].mnpReserveNumber.join('')
        break
      case 'simList.tel':
        value = formState.simList[context.state.index].tel.join('')
        break
      default:
        if (key.startsWith('customerInfo.')) {
          key = key.substring(13)
          value = formState.customerInfo[key]
        } else if (key.startsWith('simList.')) {
          key = key.substring(8)
          if (context.state.index == undefined) {
            value = formState.simList[0][key]
          } else {
            value = formState.simList[context.state.index][key]
          }
        } else if (key.startsWith('imageInfo.')) {
          key = key.substring(10)
          value = formState.imageInfo[key]
        } else if (key.startsWith('aeonPeople.')) {
          key = key.substring(11)
          value = formState.aeonPeople[key]
        } else {
          value = formState[key]
        }
        break
    }

    return value
  }
}
