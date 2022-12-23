import { combineReducers } from 'redux'

// 定数定義読み込み
import * as Const from '../Const.js'

// 各パラメーター初期値
const initialState = {
  url: '',
  parameters: [],
  status: 0,
  campaign: null,
  paymentError: {
    errorCode: '0000',
    unchangeableCreditCard: '0',
  },
  customerInfo: {},
  iotPlans: {
    plans: [],
    zeroPlans: [],
  },
}

// Reducer定義
// 各アクション発生時のstate更新を行う
// state更新後、それぞれのViewで所持するstateが更新される
function postReducer(state = initialState, action) {
  switch (action.type) {
    case 'campaign':
      return Object.assign({}, state, {
        campaign: action.campaign,
      })
    case 'paymentError':
      return Object.assign({}, state, {
        paymentError: action.paymentError,
      })
    case Const.CONNECT_START:
      return Object.assign({}, state, {
        url: action.url,
        parameters: action.parameters,
        type: action.type,
      })
    case Const.CONNECT_SUCCESS:
      if (action.parameters.data && action.parameters.data.success === true) {
        return Object.assign({}, state, {
          url: action.url,
          parameters: action.parameters,
          type: action.type,
        })
      } else {
        return Object.assign({}, state, {
          url: action.url,
          parameters: action.parameters,
          type: Const.CONNECT_ERROR,
        })
      }
    case Const.CONNECT_ERROR:
      return Object.assign({}, state, {
        url: action.url,
        parameters: action.parameters,
        type: action.type,
      })
    case 'customerInfo':
      return Object.assign({}, state, {
        customerInfo: action.customerInfo,
      })
    case 'iotPlans':
      return Object.assign({}, state, {
        iotPlans: action.iotPlans,
      })
    default:
      return state
  }
}

const PostReducer = combineReducers({
  postReducer,
})

export default PostReducer
