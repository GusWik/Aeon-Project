import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import '../../../assets/css/common.css'

import icon_help from '../../../../modules/images/icon_q.png'

// 各種モジュールを読み込み
import ComponentBase from '../../../ComponentBase.js'
import * as Const from '../../../../Const'
import * as ConstJson from '../../../../components/mypage/change/Const.js'

// import dialogs
import Header from '../../../../modules/Header.js'

import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'
import {
  getToken,
  getApplyInfo,
  getSimData,
} from '../../../../actions/ArsActions'
import { getSimInfoEnable } from '../../../../actions/Methods'
class Sim_Options extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    //this.callbackDialog = this.callbackDialog.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeAccept = this.handleChangeAccept.bind(this)
    this.handleChangeOption = this.handleChangeOption.bind(this)
    this.openHelpModal = this.openHelpModal.bind(this)

    this.state = {
      is_accept: false,
      loading_state: false,
      user_nick_name: '',
      iccid: '',
      modelJanCode:
        props.history.location.state !== undefined
          ? props.history.location.state.modelJanCode
          : '',
      user_age: '',
      options: [], //加入可能オプション一覧
      options_list: [], //加入可能オプション一覧(フラット配列)
      options_cancel: [], //廃止予定リスト
      helpState: [],
      helpModal: false,
      helpTitle: '',
      helpDescription: '',
      helpComment: '',
      isLoading: false,
      applyNumber:
        props.history.location.state !== undefined
          ? props.history.location.state.applyNumber
          : '',
      options_default: [], //初期選択項目
      options_selected: [], //変更後項目
      requiredUpload: false, //証明書アップロード
      simInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.simInfo
          : [],
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      simInfo_enable: [],
      mailAddress:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.mailAddress
          : '',
      simType:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simType
          : '',
      simKind:
        this.props.history.location.state !== undefined
          ? this.props.history.location.state.simKind
          : '',
      lineInfo: {
        lineKeyObject:
          props.history.location.state !== undefined
            ? props.history.location.state.lineKeyObject
            : '',
        lineNo:
          props.history.location.state !== undefined
            ? props.history.location.state.lineNo
            : '',
        lineDiv:
          props.history.location.state !== undefined
            ? props.history.location.state.lineDiv
            : '',
      },
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
      customerInfo:
        props.history.location.state !== undefined
          ? props.history.location.state.customerInfo
          : '',
    }
  }

  // 通信処理
  handleConnect(type) {
    var params = {}
    // プログレス表示
    this.setState({ loading_state: true })
    switch (type) {
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            customerInfoGetFlg: '1',
            tokenFlg: '1',
            simGetFlg: '',
            sessionNoUseFlg: '1',
            customerId: window.customerId,
            lineKeyObject: lineKeyObject || '',
          }

          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(dispatchPostConnections(type, params))
        }
        break

      default:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })

    if (status === Const.CONNECT_SUCCESS) {
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        const customerInfo = data.data.customerInfo
        console.log(customerInfo)
        this.setState({ customerInfo })
      }
    } else if (status === Const.CONNECT_ERROR) {
      // IF ERROR IN CONNECTION

      if (type === 'auth_errors') {
        // dialogs_copy[0].title = data.code
        // values[0] = { text: data.message }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        // dialogs_copy[0].title = data.name
        // values[0] = { text: data.response.response.error_detail.error_message }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        // dialogs_copy[0].title = data.name
        // values[0] = { text: data }
        // dialogs_copy[0].values = values
        // dialogs_copy[0].state = true
        // this.setState({ dialogs_error: dialogs_copy })
      } else {
        //this.props.history.push('/login')
      }
    }
  }

  async componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_SIM_OPTION

    //this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)

    const params = {
      lineKeyObject: this.state.lineInfo.lineKeyObject,
      lineDiv: this.state.lineInfo.lineDiv,
      lineNo: this.state.lineInfo.lineNo,
    }
    const { nickName, ICCID, optionArray } = await getSimData(params)

    const { customerInfoType, simList } = await getApplyInfo(
      this.state.applyNumber
    )

    let isApplyInfo = false
    if (customerInfoType.includes('306') || customerInfoType.includes('901')) {
      isApplyInfo = true
      //const { optionServiceId, otherOptionServiceId } = simList[0]
      //const options_selected = optionServiceId.concat(otherOptionServiceId)
      //console.log(simList[0].optionServiceId)
      //console.log(options_selected)
    }
    //加入済オプションのみ
    const option_data = optionArray.filter((u) => u.status === '1')
    this.setState({
      user_nick_name: nickName,
      iccid: ICCID,
    })

    const options_default = option_data.map((item) => {
      return item.optionId
    })
    options_default.sort()
    this.setState({
      options_default: [...options_default],
    })

    if (isApplyInfo) {
      const {
        allOptionServiceId,
        cancelOptionServiceId: options_cancel,
      } = simList[0]
      //const options_selected = optionServiceId.concat(otherOptionServiceId)
      const options_selected = allOptionServiceId.split(',')
      this.setState({
        options_selected,
        options_cancel,
      })
    } else if (option_data.length > 0) {
      this.setState({
        options_selected: [...options_default],
      })
    }

    const options = await this.getOptions()
    await this.getHelps()

    if (options.length > 0) {
      const options_list = options
        .map((category) => {
          return category.optionList
        })
        .flat()
      this.setState({ options, options_list })
    }

    // 解約状態の回線を除いた配列
    const simInfo_enable = getSimInfoEnable(this.state.simInfo)
    this.setState({ simInfo_enable })
  }

  getOptions() {
    let body = {
      procType: 2,
      receptionistKbn: 2,
      simType: this.state.simType,
      sharePlanFlag: this.state.customerInfo.sharePlanFlag,
      simKind: this.state.simKind,
      gender: this.state.customerInfo.gender,
      specifyPeriodFlag: 1,
    }

    //JANは、現在保証系オプションに加入している場合のみ設定
    let insuranceOptionIds = Const.INSURANCE_OPTIONS_A.concat(
      Const.INSURANCE_OPTIONS_B
    )

    let insuranceOptionsJoined = this.state.options_default.filter((id) => {
      return insuranceOptionIds.indexOf(id) != -1
    })
    let insuranceOptionsJoinedTypeA = this.state.options_default.filter((id) => {
      return Const.INSURANCE_OPTIONS_A.indexOf(id) != -1
    })

    if (
      this.state.modelJanCode.length > 0 &&
      Const.SIM_JAN_CODES.indexOf(this.state.modelJanCode) == -1
    ) {
      body.janCode = this.state.modelJanCode
    }

    //加入済みオプションは必ず取得（保証系以外）
    var additionalOptionIds = this.state.options_default.filter(
      (id) => insuranceOptionIds.indexOf(id) == -1
    )
    if (insuranceOptionsJoined.length > 0) {
      additionalOptionIds = additionalOptionIds.concat(insuranceOptionsJoined)
    }
    body.addOptionId = additionalOptionIds.join(',')

    console.log(body)
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
        return res.json()
      })
      .then((json) => {
        if (json && json.data.categoryList) {
          json.data.categoryList.forEach((list,index) => {
            var newList = {
              categoryId: list.categoryId
            }
            newList.optionList = list.optionList.filter((v) => {
              return insuranceOptionsJoined.indexOf(v.optionServiceId) != -1 //加入済み保証系オプション
                || (Const.INSURANCE_OPTIONS_A.indexOf(v.optionServiceId) != -1 && insuranceOptionsJoinedTypeA.length > 0) //安心保証系加入済み、かつ安心保証系オプション
                || insuranceOptionIds.indexOf(v.optionServiceId) == -1 //保証系以外
            })
            json.data.categoryList[index] = newList
          })
          return json.data.categoryList
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  getHelps() {
    fetch(Const.OPTION_HELP)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        if (resJson.optionHelpList) {
          const { helpState } = this.state
          helpState.optionHelpList = resJson.optionHelpList
          this.setState({
            helpState,
            isLoading: false,
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  isDisabled(item) {
    const exclusive = this.checkExclusive(item)
    //const inclusive = this.checkInclusive(item)
    const validAge = this.checkAge(item)
    //return exclusive || !inclusive || validAge
    /* console.log(item)
    console.log(exclusive)
    console.log(validAge)
    // 0702010007 イオンスマホ電話サポート イオンスマホ安心パック(600)
    if (exclusive) {
      console.log(this.state.options_selected)
    }

    console.log('============') */
    return exclusive || validAge
  }

  isJoin(item_id) {
    const result = this.state.options_default.includes(item_id)
    return result
  }
  isChecked(item_id) {
    const result = this.state.options_selected.includes(item_id)
    return result
  }

  checkAge(item) {
    let isValid = false
    if (item.ageLowerLimit === '' && item.ageUpperLimit === '') return isValid

    if (this.state.customerInfo.birthday) {
      const birthday0 = moment(this.state.customerInfo.birthday).format('YYYY')
      const birthday1 = moment(this.state.customerInfo.birthday).format('MM')
      const birthday2 = moment(this.state.customerInfo.birthday).format('DD')

      const birthday = moment([birthday0, parseInt(birthday1) - 1, birthday2])

      const now = moment()
      if (
        item.ageLowerLimit !== '' &&
        now.diff(birthday, 'years') < item.ageLowerLimit
      ) {
        isValid = true
      }
      if (
        item.ageUpperLimit !== '' &&
        now.diff(birthday, 'years') > item.ageUpperLimit
      ) {
        isValid = true
      }
    }
    return isValid
  }

  // 除外オプションの対象が有効になっているかをチェック
  checkExclusive(option) {
    const array = option.exclusiveOptionServiceIdList

    let isIncluded = false
    let options_cancel = this.state.options_cancel
    const optionServiceId = [...this.state.options_selected].filter(
      (optionId) => {
        return options_cancel.indexOf(optionId) == -1
      }
    )
    /* const otherOptionServiceId =
      formState.simList[this.state.index].otherOptionServiceId */
    // 除外オプションの対象が有効になっている場合は選択できないようにする
    optionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
        }
      })
    })
    /* otherOptionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
        }
      })
    }) */

    return isIncluded
  }

  // 必須オプションの対象が有効になっているかをチェック
  checkInclusive(option) {
    const array = option.inclusiveOptionServiceIdList
    if (!array.length) {
      return true
    }

    const id = option.optionServiceId
    let isIncluded = false
    const optionServiceId = this.state.options_selected

    // 必須オプションの対象が有効になっている場合のみ選択できるようにする
    const filter = _.filter(this.state.inclusiveOptionList, { target: id })
    optionServiceId.map((item) => {
      array.map((_item) => {
        if (_item === item) {
          isIncluded = true
          // チェック状態を記録
          if (!filter.length) {
            const inclusiveOptionList = this.state.inclusiveOptionList
            inclusiveOptionList.push({
              id: _item,
              target: id,
            })
            this.setState({ inclusiveOptionList })
          }
        }
      })
    })

    return isIncluded
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
    if (e !== null) e.preventDefault()
    console.log(url)
    if (url === '/') {
      // WHEN PARAMS IS NOT DEFINED USE THIS
      let params = {}
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/sim/reissue/select/') {
      // NEED TO SEND THE CUSTOMER ID
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      params.iccid = this.state.iccid
      params.simType = this.state.simType
      params.lineInfo = this.state.lineInfo
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (url === '/mypage/sim/') {
      const params = this.state.lineInfo
      params.customer_id = this.state.url_data[0].pass_data.customer_id
      params.mailAddress = this.state.mailAddress
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else if (
      url === '/mypage/sim/options/step2' ||
      url === '/mypage/sim/options/confirm'
    ) {
      params.applyNumber = this.state.applyNumber
      params.options_default = this.state.options_default
      params.options_list = this.state.options_list
      params.user_nick_name = this.state.user_nick_name
      console.log('passvalue :: ', params)
      this.props.history.push({
        pathname: url,
        state: params,
      })
    }
  }

  handleChangeAccept(e) {
    const value = !this.state.is_accept
    this.setState({ is_accept: value })
  }

  handleChangeOption(e) {
    const id = e.target.value
    const isJoin = this.isJoin(id)
    if (isJoin) return //加入不可
    let options_selected = this.state.options_selected
    const result = this.state.options_selected.includes(id)
    if (result) {
      options_selected = this.state.options_selected.filter((n) => n !== id)
    } else {
      options_selected.push(id)
    }
    options_selected.sort()

    console.log(options_selected)
    this.setState({ options_selected })
  }

  handleAdolition(id) {
    const result = this.state.options_cancel.includes(id)
    let options_cancel = this.state.options_cancel
    if (result) {
      options_cancel = this.state.options_cancel.filter((n) => n !== id)
    } else {
      options_cancel.push(id)
    }
    console.log(options_cancel)
    this.setState({ options_cancel })
  }

  isCancel(id) {
    return this.state.options_cancel.includes(id)
  }

  isNew(id) {
    return !this.state.options_default.includes(id)
  }

  getOptionItem(id) {
    //console.log(id)
    //console.log(this.state.options_list)
    return this.state.options_list.find((n) => n.optionServiceId === id)
  }

  updateApplyInfo(token) {
    let optionServiceId = this.state.options_selected.filter(
      (element) => element === '0702000004' || element === '0702000005'
    )
    // 追加するサービスID(音声オプション)
    optionServiceId = optionServiceId.filter(
      (element) => !this.state.options_default.includes(element)
    )

    let otherOptionServiceId = this.state.options_selected.filter(
      (element) =>
        false == (element === '0702000004' || element === '0702000005')
    )
    // 追加するサービスID(音声オプション以外)
    otherOptionServiceId = otherOptionServiceId.filter(
      (element) => !this.state.options_default.includes(element)
    )

    //追加するオプションすべて（キャンセル分除く）
    const all_add_options = this.state.options_selected.filter(
      (element) => !this.state.options_default.includes(element)
    )

    // 050オプション
    const options_050 = all_add_options.filter(
      (element) => element === '0702010013'
    )
    const options_not_050 = all_add_options.filter(
      (element) => element !== '0702010013'
    )

    let customerInfoType = '306'
    if (options_050.length > 0 && options_not_050.length > 0) {
      customerInfoType = '306,901'
    } else if (options_050.length > 0) {
      customerInfoType = '901'
    }

    if (
      options_050.length > 0 &&
      (this.state.simKind === '01' || this.state.simKind === '02') &&
      this.state.simInfo_enable.length <= 1
    ) {
      console.log('該当')
      this.setState({ requiredUpload: true })
    }

    const body = {
      applyNumber: this.state.applyNumber,
      commitFlag: 0,
      receptionKbn: 4,
      receptionistKbn: 2,
      customerId: window.customerId,
      customerInfoType,
      token,
      receptionStoreCode: '',
      receptionistCode: '',
      receptionistName: '',
      agencyCode: '',
      incentiveCode: '',
      joinRoute: '',
      simList: [
        {
          iccid: this.state.iccid,
          optionServiceId,
          otherOptionServiceId,
          cancelOptionServiceId: this.state.options_cancel,
        },
      ],
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

  //申し込む
  async hadnleSubmit() {
    console.log(this.state.applyNumber)
    if (this.state.applyNumber) {
      const token = await getToken(this.state.applyNumber)
      await this.updateApplyInfo(token)

      if (this.state.requiredUpload) {
        this.goNextDisplay(
          null,
          '/mypage/sim/options/step2',
          this.state.lineInfo
        )
      } else {
        this.goNextDisplay(
          null,
          '/mypage/sim/options/confirm',
          this.state.lineInfo
        )
      }
    }
  }

  // ヘルプモーダルを表示
  openHelpModal(help) {
    const helpTitle = help.optionName
    const helpDescription = help.description.split('\n').map((i, index) => {
      return (
        <p key={index} style={{ margin: '0' }}>
          {i}
        </p>
      )
    })
    const helpComment = help.comment.split('\n').map((i, index) => {
      return (
        <p key={index} style={{ margin: '0' }}>
          {i}
        </p>
      )
    })
    this.setState({ helpModal: true, helpTitle, helpDescription, helpComment })
  }

  // ヘルプボタン描画
  returnHelpBtn(optionServiceId) {
    const { helpState } = this.state
    if (!helpState.optionHelpList) {
      return null
    }
    const help = helpState.optionHelpList.filter((item) => {
      return item.optionServiceId === optionServiceId
    })
    if (help[0]) {
      return (
        <div className="option_table_help">
          <a
            href="javascript:void(0)"
            onClick={() => this.openHelpModal(help[0])}
          >
            <img src={icon_help} alt="help" width="16" />
          </a>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    // CHECKING SIM STATE AND CHANGING
    // 0 : STOP  -  1: USE

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
                      {' '}
                      <a href="" onClick={(e) => this.goNextDisplay(e, '/')}>
                        TOP
                      </a>
                    </li>
                    <li className="m-breadcrumb_item">加入オプション選択</li>
                  </ol>
                  <h1 className="a-h1">オプション選択</h1>
                  <div className="m-form">
                    <p>内容をご確認ください。</p>
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            {this.state.user_nick_name}
                            <br />
                            {'（電話番号：' + this.state.lineInfo.lineNo + '）'}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <p style={{ marginBottom: '1.5em' }}>
                      加入したいオプションを選択してください。
                    </p>
                    <div className="option_box">
                      <ul>
                        <li>
                          ・
                          <img
                            src={icon_help}
                            style={{
                              marginRight: '0.2em',
                              display: 'inline-block',
                              verticalAlign: 'middle',
                            }}
                          />
                          からオプションサービスの詳細がご覧頂けます。
                        </li>
                        <li>
                          ・加入中のオプションを止める場合は、廃止ボタンを押して下さい。
                        </li>
                        <li>
                          ・他のオプションを選んでいる場合に、加入不可となるオプションがあります。
                        </li>
                      </ul>
                    </div>
                    {this.state.options &&
                      this.state.options.map((category) => {
                        return (
                          <div
                            className="option_table"
                            key={category.categoryId}
                          >
                            {category.optionList.map((item) => {
                              const id = item.optionServiceId
                              const isChecked = this.isChecked(id)
                              // 加入中
                              const isJoin = this.isJoin(id)
                              // 加入不可
                              const isDisabled = this.isDisabled(item)
                              // 廃止予定
                              const isCancel = this.isCancel(id)

                              let className = 'option_table_item'
                              let msg = ''

                              if (isDisabled) {
                                className = 'option_table_item disable'
                                msg = '加入不可'
                              } else if (isJoin && !isCancel) {
                                className = 'option_table_item join'
                                msg = '加入中'
                              } else if (isCancel) {
                                className = 'option_table_item abolition'
                                msg = '廃止予定'
                              } else if (isChecked) {
                                className = 'option_table_item entry'
                                msg = '加入予定'
                              }
                              return (
                                <div className={className} key={id}>
                                  <div className="option_table_main">
                                    <label className="option_table_checkbox">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        value={id}
                                        onChange={this.handleChangeOption}
                                      />
                                      <span className="option_table_check_label">
                                        <span>{item.optionName}</span>
                                        <span className="option_table_price">
                                          {'税込み' + item.price + '円'}
                                        </span>
                                      </span>
                                    </label>
                                    {(item.optionName ===
                                      'イオンモバイルセキュリティPlus' ||
                                      item.optionName === 'Filii') && (
                                      <span className="option_txt_free">
                                        ※初月無料
                                      </span>
                                    )}

                                    {item.optionName ===
                                      'イオンモバイルセキュリティPlus' && (
                                      <a href="" className="option_txt_note">
                                        イオンモバイルセキュリティPlusのご利用注意事項について
                                      </a>
                                    )}
                                  </div>
                                  {this.returnHelpBtn(item.optionServiceId)}
                                  <div className="option_table_msg">{msg}</div>
                                  <div className="option_table_status">
                                    {isJoin && (
                                      <button
                                        onClick={() => this.handleAdolition(id)}
                                      >
                                        {isCancel ? 'キャンセル' : '廃止'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    {/* <div className="option_table">
                      <div className="option_table_item disable">
                        <div className="option_table_main">
                          <label className="option_table_checkbox">
                            <input type="checkbox" />
                            <span className="option_table_check_label">
                              <span>イオンモバイルセキュリティPlus</span>
                              <span className="option_table_price">
                                税込220円
                              </span>
                            </span>
                          </label>
                          <span className="option_txt_free">※初月無料</span>
                          <a href="" className="option_txt_note">
                            イオンモバイルセキュリティPlusのご利用注意事項について
                          </a>
                        </div>
                        <div className="option_table_help">
                          <img src={icon_help} />
                        </div>
                        <div className="option_table_msg">加入不可</div>
                        <div className="option_table_status"></div>
                      </div>
                      <div className="option_table_item join">
                        <div className="option_table_main">
                          <label className="option_table_checkbox">
                            <input type="checkbox" />
                            <span className="option_table_check_label">
                              <span>イオンスマホ電話サポート</span>
                              <span className="option_table_price">
                                税込330円
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="option_table_help">
                          <img src={icon_help} />
                        </div>
                        <div className="option_table_msg">加入中</div>
                        <div className="option_table_status"></div>
                      </div>
                      <div className="option_table_item entry">
                        <div className="option_table_main">
                          <label className="option_table_checkbox">
                            <input type="checkbox" />
                            <span className="option_table_check_label">
                              <span>イオンスマホ電話サポート</span>
                              <span className="option_table_price">
                                税込330円
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="option_table_help">
                          <img src={icon_help} />
                        </div>
                        <div className="option_table_msg">加入予定</div>
                        <div className="option_table_status"></div>
                      </div>
                      <div className="option_table_item abolition">
                        <div className="option_table_main">
                          <label className="option_table_checkbox">
                            <input type="checkbox" />
                            <span className="option_table_check_label">
                              <span>イオンスマホ電話サポート</span>
                              <span className="option_table_price">
                                税込330円
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="option_table_help">
                          <img src={icon_help} />
                        </div>
                        <div className="option_table_msg">廃止予定</div>
                        <div className="option_table_status">
                          <button>キャンセル</button>
                        </div>
                      </div>
                    </div> */}
                    <p
                      style={{
                        marginBottom: '25px',
                        fontsize: '14px',
                        lineHeight: '1.4',
                      }}
                    >
                      「イオンでんわ」と「イオンでんわフルかけ放題」「イオンでんわ10分かけ放題」「イオンでんわ5分かけ放題」「やさしい10分かけ放題」は、プレフィックスサービスを利用した音声通話サービスです。
                      <br />
                      専用の「イオンでんわアプリ」から発信いただくか、プレフィックス番号を用いて発信いただく必要があります。
                      <br />
                      ※NTTドコモ回線のみ、国際通話と一部の例外番号を除き自動的にプレフィックス番号が適用されます
                      <br />
                      <br />
                      「050かけ放題」はインターネット回線（IP電話）を利用した定額通話サービスです。
                      <br />
                      ご利用には専用のアプリが必須です。
                    </p>

                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p
                          className="m-btn"
                          style={{
                            display: this.state.isStop ? 'none' : 'flex',
                          }}
                        >
                          <button
                            className="a-btn-submit"
                            type="button"
                            onClick={() => {
                              this.hadnleSubmit()
                            }}
                            disabled={
                              JSON.stringify(this.state.options_default) ===
                                JSON.stringify(this.state.options_selected) &&
                              this.state.options_cancel.length == 0
                            }
                          >
                            上記内容で申し込む
                          </button>
                        </p>
                        <p className="m-btn">
                          <a
                            className="a-btn-dismiss"
                            href="javascript:history.back();"
                          >
                            戻る
                          </a>
                        </p>
                      </div>
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
        {this.state.helpModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p
                  style={{
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={icon_help}
                    alt="help"
                    width="16"
                    style={{ marginRight: '0.75rem' }}
                  />
                  {this.state.helpTitle}
                </p>
              </div>
              <div
                className="ulModal_content"
                style={{ fontSize: '1.68rem', lineHeight: 1.6 }}
              >
                {this.state.helpDescription}
              </div>
              <div
                className="ulModal_content"
                style={{
                  color: '#000000',
                  fontSize: '1.4rem',
                  lineHeight: 1.4,
                }}
              >
                {this.state.helpComment}
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setState({ helpModal: false })
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
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

export default connect(mapStateToProps)(Sim_Options)
