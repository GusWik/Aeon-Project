import $ from 'jquery'
import { fetch as fetchPolyfill } from 'whatwg-fetch'
// 定数定義読み込み
import * as Const from '../Const.js'

const originalFetch = window.fetch || fetchPolyfill

const fetch = (...args) => {
  return originalFetch(...args)
}

const FETCH_TIMEOUT = 30000

// 関数
var callback = null
var isLoading = false
export function setConnectionCB(callback_work) {
  callback = callback_work
}

export function getLoadingFlag() {
  return isLoading
}

// 通信処理入口
export function dispatchPostConnections(url, params, show, pathname) {
  if (isLoading === false) {
    isLoading = true
    if (!show) {
      $('.t-wrapper').hide()
      $('.loading').show()
    }
  }
  // イベントをdispatch
  return (dispatch, getState) => {
    // 通信処理本体をdispatch
    return dispatch(postConnection(url, params, pathname))
  }
}

export function dispatchGetConnections(url) {
  if (isLoading === false) {
    isLoading = true
    $('.t-wrapper').hide()
    $('.loading').show()
  }
  // イベントをdispatch
  return (dispatch, getState) => {
    // 通信処理本体をdispatch
    return dispatch(getConnection(url))
  }
}

// 通信処理入口
export function dispatchFileUploadConnections(url, params) {
  // イベントをdispatch
  return (dispatch, getState) => {
    // 通信処理本体をdispatch
    return dispatch(fileUploadConnection(url, params))
  }
}

// 郵便番号用通信処理入口
export function dispatchAddressConnections(url) {
  // イベントをdispatch
  return (dispatch, getState) => {
    // 通信処理本体をdispatch
    return dispatch(addressConnection(url))
  }
}

// クレジット通信処理入口
export function dispatchcreditConnections(url, params) {
  // イベントをdispatch
  return (dispatch, getState) => {
    // 通信処理本体をdispatch
    return dispatch(creditConnection(url, params))
  }
}

// アプリ用・postMessage処理
export function awaitPostMessage(data) {
  let ua = window.navigator.userAgent
  let isDataswitchApp = ua.includes('dataswitchApp')
  if (isDataswitchApp) {
    var pm = function () {
      // window.ReactNativeWebViewの有効チェック
      if (window.ReactNativeWebView) {
        clearInterval(check)
        window.ReactNativeWebView.postMessage(data)
      }
    }
    var check = setInterval(pm, 100)
  }
}

// 通信処理本体
function postConnection(url, params, pathname) {
  return (dispatch) => {
    // リクエストパラメータ生成
    dispatch(requestParams(url, params))
    var status = 0
    var didTimeOut = false

    // FetchAPIで通信を行う
    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('Request timed out'))
      }, FETCH_TIMEOUT)

      fetch(Const.DOMAIN + url, {
        body: JSON.stringify(params),
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          accept: 'application/json',
          'content-type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
      })
        .then((response) => {
          status = response.status
          // Clear the timeout as cleanup
          clearTimeout(timeout)
          if (!didTimeOut) {
            return response.json()
          }
        })
        .then((json) => {
          if (isLoading === true) {
            isLoading = false
            $('.t-wrapper').show()
            $('.loading').hide()
          }
          // 通信結果をdispatch
          if (status === 200) {
            // API成功時
            let token =
              json.data && json.data.token ? json.data.token : undefined
            if (pathname) {
              let nowPathName = window.location.pathname
              if (
                pathname == '/' ||
                pathname == '/mypage' ||
                pathname == '/mypage/'
              ) {
                if (
                  nowPathName != '/' &&
                  nowPathName != '/mypage' &&
                  nowPathName != '/mypage/'
                ) {
                  return
                }
              }
            }
            if (
              url == Const.CONNECT_TYPE_REQUESTMNP &&
              window.location.pathname.includes(
                'mypage/user/cancellation/procedure'
              )
            ) {
              callback(url, json, Const.CONNECT_SUCCESS, token, params)
            } else {
              callback(url, json, Const.CONNECT_SUCCESS, token)
            }
            return dispatch(receiveParams(json, Const.CONNECT_SUCCESS))
          } else if (status === 403) {
            // 認証エラー
            authErrors(json)
          } else if (status === 422) {
            // リクエスト内容不正（Validationエラー）
            validationErrors(json)
          } else if (status === 500) {
            // システムエラー
            noBodyError()
          } else if (status === 520) {
            // 外部APIエラー時
            apiError(json)
          } else if (status === 530) {
            // DBエラー（接続エラー）
            noBodyError()
          } else if (status === 540) {
            // DBエラー（クエリエラー）
            noBodyError()
          }
        })
        .catch((err) => {
          console.log('ConnectError :', err)
          // Rejection already happened with setTimeout
          if (didTimeOut) return
          // 通信結果（エラー）をdispatch
          callback(url, '', Const.CONNECT_ERROR)
          return dispatch(receiveParams('', Const.CONNECT_ERROR))
        })
    }).catch(function (err) {
      // Error: response error, request timeout or runtime error
      transitToErrorScreen()
    })
  }
}

function transitToErrorScreen(error) {
  window.location.href = '/error?e=2'
}

// 通信処理本体
function getConnection(url) {
  return (dispatch) => {
    // リクエストパラメータ生成
    // dispatch(requestParams(url, null));
    var domain = Const.DOMAIN
    var didTimeOut = false

    if (url === '/pg/facebook/login') {
      domain = ''
    } else if (url === '/pg/google/login') {
      domain = ''
    } else if (url === '/pg/yahoo/login') {
      domain = ''
    }

    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('Request timed out'))
      }, FETCH_TIMEOUT)

      fetch(domain + url, {
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
          // Clear the timeout as cleanup
          clearTimeout(timeout)
          if (!didTimeOut) {
            return response.json()
          }
          if (url == '/auth/mypageId') {
            if (isLoading === true) {
              isLoading = false
              $('.t-wrapper').show()
              $('.loading').hide()
            }
          }
        })
        .then((json) => {
          if (isLoading === true) {
            isLoading = false
            $('.t-wrapper').show()
            $('.loading').hide()
          }
          // 通信結果をdispatch
          let token = json.data && json.data.token ? json.data.token : undefined
          callback(url, json, Const.CONNECT_SUCCESS, token)
          return dispatch(receiveParams(json, Const.CONNECT_SUCCESS))
        })
        .catch((err) => {
          console.log('ConnectError :', err)
          if (url == '/auth/mypageId') {
            if (isLoading === true) {
              isLoading = false
              $('.t-wrapper').show()
              $('.loading').hide()
            }
          }
          // Rejection already happened with setTimeout
          if (didTimeOut) return
          // 通信結果（エラー）をdispatch
          callback(url, '', Const.CONNECT_ERROR)
          return dispatch(receiveParams('', Const.CONNECT_ERROR))
        })
    }).catch(function (err) {
      // Error: response error, request timeout or runtime error
      transitToErrorScreen(err)
    })
  }
}

// 通信処理本体
function creditConnection(url, params) {
  return (dispatch) => {
    // リクエストパラメータ生成
    dispatch(requestParams(url, params))

    var status = 0
    var didTimeOut = false

    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('Request timed out'))
      }, FETCH_TIMEOUT)

      fetch(url, {
        body: JSON.stringify(params),
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          accept: 'application/json',
          'content-type': 'application/json',
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
      })
        .then((response) => {
          // Clear the timeout as cleanup
          clearTimeout(timeout)
          if (!didTimeOut) {
            return response.json()
          }
        })
        .then((json) => {
          // 通信結果をdispatch
          let token = json.data && json.data.token ? json.data.token : undefined
          callback(url, json, Const.CONNECT_SUCCESS, token)
          return dispatch(receiveParams(json, Const.CONNECT_SUCCESS))
        })
        .catch((err) => {
          console.log('ConnectError :', err)
          // Rejection already happened with setTimeout
          if (didTimeOut) return
          // 通信結果（エラー）をdispatch
          callback(url, '', Const.CONNECT_ERROR)
          return dispatch(receiveParams('', Const.CONNECT_ERROR))
        })
    }).catch(function (err) {
      // Error: response error, request timeout or runtime error
      transitToErrorScreen()
    })
  }
}

function authErrors(json) {
  var auth_err = json.auth_errors
  let token = json.data && json.data.token ? json.data.token : undefined
  callback('auth_errors', auth_err, Const.CONNECT_ERROR, token)
}
function validationErrors(json) {
  console.log('json', json)
  var validation_error = json.validation_errors

  let token = json.data && json.data.token ? json.data.token : undefined
  callback('validation_errors', validation_error, Const.CONNECT_ERROR, token)

  for (var key in validation_error) {
    console.log(key)
    console.log(validation_error[key])
    let exists = false
    if (key.indexOf('.') !== -1) {
      var key2 = key.split('.')[1]
      if ($('#' + key2)) {
        exists = true
      }
      $('#' + key2 + '_error')
        .text(validation_error[key])
        .change()
      $('#' + key2)
        .addClass('is-error')
        .change()
    } else {
      if ($('#' + key)) {
        exists = true
      }
      $('#' + key + '_error')
        .text(validation_error[key])
        .change()
      $('#' + key)
        .addClass('is-error')
        .change()
    }
    if (!exists) {
      // その他のバリデーションエラー表示
      $('#commonErrorModal').addClass('is-active')
      $('#t-modal_content').addClass('is-active')
      $('#t-modal-errorMessage').text(validation_error[key]).change()
    }
  }
  // return json;
}
function apiError(json) {
  var api_error = json.api_error
  let token = json.data && json.data.token ? json.data.token : undefined
  callback('api_error', api_error, Const.CONNECT_ERROR, token)
}

function noBodyError() {
  callback('no_body_error', 'エラーが発生しました。', Const.CONNECT_ERROR)
}

// 通信処理本体（ファイルアップロード）
function fileUploadConnection(url, params) {
  return (dispatch) => {
    // リクエストパラメータ生成
    dispatch(requestParams(url, params))
    var didTimeOut = false

    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('Request timed out'))
      }, FETCH_TIMEOUT)

      fetch(Const.DOMAIN + url, {
        method: 'POST',
        body: params,
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => {
          // Clear the timeout as cleanup
          clearTimeout(timeout)
          if (!didTimeOut) {
            return response.json()
          }
        })
        .then((json) => {
          // 通信結果をdispatch
          let token = json.data && json.data.token ? json.data.token : undefined
          callback(url, json, Const.CONNECT_SUCCESS, token)
          return dispatch(receiveParams(json, Const.CONNECT_SUCCESS))
        })
        .catch((err) => {
          // Rejection already happened with setTimeout
          if (didTimeOut) return
          // 通信結果（エラー）をdispatch
          callback(url, '', Const.CONNECT_ERROR)
          return dispatch(receiveParams('', Const.CONNECT_ERROR))
        })
    }).catch(function (err) {
      // Error: response error, request timeout or runtime error
      transitToErrorScreen()
    })
  }
}

// 住所取得用の通信処理本体
function addressConnection(url) {
  return (dispatch) => {
    // リクエストパラメータ生成
    dispatch(requestParams(url))
    var didTimeOut = false

    return new Promise(function (resolve, reject) {
      const timeout = setTimeout(function () {
        didTimeOut = true
        reject(new Error('Request timed out'))
      }, FETCH_TIMEOUT)

      fetch(url)
        .then((response) => {
          // Clear the timeout as cleanup
          clearTimeout(timeout)
          if (!didTimeOut) {
            return response.json()
          }
        })
        .then((json) => {
          // 通信結果をdispatch
          let token = json.data && json.data.token ? json.data.token : undefined
          callback(url, json, Const.CONNECT_SUCCESS, token)
          return dispatch(receiveParams(json, Const.CONNECT_SUCCESS))
        })
        .catch((err) => {
          // Rejection already happened with setTimeout
          if (didTimeOut) return
          // 通信結果（エラー）をdispatch
          callback(url, '', Const.CONNECT_ERROR)
          return dispatch(receiveParams('', Const.CONNECT_ERROR))
        })
    }).catch(function (err) {
      // Error: response error, request timeout or runtime error
      transitToErrorScreen()
    })
  }
}

// リクエストパラメータ
function requestParams(url, parameters) {
  return {
    type: Const.CONNECT_START,
    url: url,
    parameters: parameters,
  }
}

// レスポンスパラメータ
function receiveParams(json, type) {
  if (json.length === '') {
    return {
      type: type,
      parameters: [],
    }
  }

  return {
    type: type,
    parameters: json,
  }
}
