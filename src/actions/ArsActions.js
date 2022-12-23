import * as Const from '../Const'

export const getToken = (applyNumber) => {
  const body = {
    applyNumber,
  }
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.ARS_APPLY_NUMBER, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      if (json && json.data.token) {
        return json.data.token
      }
      return null
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getApplyNumber = () => {
  const body = {
    applyType: 3,
    receptionType: 5,
    appFlag: 0,
  }
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }
  return fetch(Const.ARS_CREATE_APPLY_NUMBER, params)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      try {
        if (json && json.data.applyNumber) {
          return json.data.applyNumber
        }
        return null
      } catch (error) {
        return null
      }
    })
    .catch((err) => {
      console.log('ConnectError :', err)
      this.errApplyNumber()
      return null
    })
}

export const getApplyInfo = (applyNumber) => {
  const body = {
    applyNumber,
  }
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.ARS_APPLY_NUMBER, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      if (json && json.data) {
        return json.data
      }
      return null
    })
    .catch((error) => {
      console.error(error)
    })
}

export const updateApplyInfoParam = async (body, applyNumber) => {
  // API
  // 遷移時に取得したapplyNumberをセットする
  const token = await getToken(applyNumber)
  body.token = token

  let params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.ARS_UPDATE_APPLY_INFO, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getApplyEntryInfo = (customerId, customerInfoType) => {
  const body = {
    customerId,
    customerInfoType,
  }
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.ARS_APPLY_ENTRY_INFO, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      if (json && json.data) {
        return json.data
      }
      return null
    })
    .catch((error) => {
      console.error(error)
    })
}

// ADSF認証ユーザー情報取得
export const getAppInfo = () => {
  return fetch(Const.ARS_APP_INFO)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getmypageid = () => {
  return fetch(Const.DOMAIN + Const.CONNECT_TYPE_MYPAGEID)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getAgreementData = (customerId, customerInfo = false) => {
  const lineKeyObject = localStorage.getItem('lineKeyObject')
  const body = {
    customerId,
    customerInfoGetFlg: customerInfo ? '1' : '',
    sessionNoUseFlg: '',
    tokenFlg: '1',
    simGetFlg: '1',
    planChangeFlg: '1',
    lineKeyObject: lineKeyObject || '',
  }

  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }
  return fetch(Const.DOMAIN + Const.CONNECT_TYPE_AGREEMENT_DATA, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

// 料金サービス取得(単体)
export const getService = (planServiceId) => {
  const body = {
    procType: '1',
    planServiceId,
  }
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }
  return fetch(Const.ARS_RATE_PLAN_LIST, params)
    .then((res) => {
      return res.json()
    })
    .then((resJson) => {
      if (resJson && resJson.data.ratePlanList) {
        return resJson.data.ratePlanList[0]
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getChangingPlanMst = (body) => {
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.DOMAIN + Const.CONNECT_TYPE_CHANGING_PLAN_MST, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getSimData = (body) => {
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.DOMAIN + Const.CONNECT_TYPE_SIM_DATA, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}

export const getOptionList = (body) => {
  const params = {
    body: JSON.stringify(body),
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  }

  return fetch(Const.ARS_OPTION_LIST, params)
    .then((res) => {
      if (!res.ok) {
        //
      } else {
        return res.json()
      }
    })
    .then((json) => {
      return json.data
    })
    .catch((error) => {
      console.error(error)
    })
}
