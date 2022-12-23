import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'
import _ from 'lodash'
import html2canvas from 'html2canvas'
import domtoimage from 'dom-to-image'

import Validations from '../../Validations'

// css
import '../../assets/css/common.css'

import * as Const from '../../../Const'
import icon_help from '../../../modules/images/icon_q.png'
import option_arrow_down from '../../../modules/images/option_arrow_down.png'

// IMPORT MODULES
import Header from '../../../modules/Header.js'
import Dialog from '../../../modules/Dialog.js'

import ComponentBase from '../../ComponentBase.js'

import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../actions/PostActions.js'

import {
  getmypageid,
  getAgreementData,
  getAppInfo,
} from '../../../actions/ArsActions'

import { toHalfWidth } from '../../../actions/Methods'

import MessageArea from '../../form/MessageArea'

const relationshipOptions = [
  { key: 0, value: '本人', text: '本人' },
  { key: 1, value: '父', text: '父' },
  { key: 2, value: '母', text: '母' },
  { key: 3, value: '妻', text: '妻' },
  { key: 4, value: '夫', text: '夫' },
  { key: 5, value: '子', text: '子' },
  { key: 6, value: '祖父', text: '祖父' },
  { key: 7, value: '祖母', text: '祖母' },
  { key: 8, value: '孫', text: '孫' },
  { key: 9, value: 'その他', text: 'その他' },
]

class News extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.pageNoChangeHandler = this.pageNoChangeHandler.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.pagePrevious = this.pagePrevious.bind(this)
    this.pageNext = this.pageNext.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.handleChangeRelationship = this.handleChangeRelationship.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)

    this.state = {
      api_data: [],
      table_data: [],
      final_page: 4,
      loading_state: false,
      selected_page_id: 1,
      selected_page_value: 1,
      applicationModal: false,
      checkModal: false,
      receptModal: false,
      planModal: false,
      optionModal: false,
      confirmModal: false,
      confirmOptionModal: false,
      newOptionModal: false,
      finishModal: false,
      planAppModal: false,
      operateModal: false,
      helpModal: false,
      aboutJisModal: false,
      pagination: {
        allPageNum: 0,
        nowPageNo: 0,
        callback: this.pageNoChangeHandler,
      },
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
      lineInfo: [
        {
          lineDiv: '',
          lineKeyObject: '',
          planName: '',
          removeStatus: '',
        },
      ],
      lineInfoNum: 0,
      isADFSLogined: false,
      aeonPeopleFlag: 0,
      aeonPeople: {},
      imageInfo: {
        certificateNumber: '',
        certificateTypeCode: '',
        imageDataList: [],
      },
      error: {
        'aeonPeople.employeeNumber': {},
        'aeonPeople.lastName': {},
        'aeonPeople.firstName': {},
        'aeonPeople.lastNameKana': {},
        'aeonPeople.firstNameKana': {},
        'aeonPeople.companyName': {},
        'aeonPeople.companyCode': {},
        'aeonPeople.departmentName': {},
        'aeonPeople.position': {},
        'aeonPeople.tel': {},
        'aeonPeople.relationship': {},
        'aeonPeople.signature': {},
      },
    }
  }

  async componentDidMount() {
    this.goTop()
    await Validations.initialize()
    document.title = Const.TITLE_MYPAGE_NEWS

    if (window.customerId === undefined) {
      this.handleConnect(Const.CONNECT_TYPE_MYPAGEID)
    } else {
      this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
    }
    const { customerId } = await getmypageid()
    const agreementData = await getAgreementData(customerId)
    console.log(agreementData)
    const lineInfoNum = localStorage.getItem('lineInfoNum')
    if (lineInfoNum) {
      this.setState({ lineInfoNum })
    }
    const { result } = await getAppInfo()
    console.log(result)
    if (result !== 'NG' && result.user_id) {
      $('.t-main').addClass('isADFSLogined')
      $('.t-header').addClass('isADFSLogined')
      const aeonPeople = {
        employeeNumber: result.user_id,
        lastName: result.sei,
        firstName: result.mei,
        lastNameKana: '',
        firstNameKana: '',
        companyName: result.company,
        companyCode: result.company_code,
        departmentName: result.department,
        position: result.title,
        tel: [],
        relationship: 0,
      }
      console.log(this.state.aeonPeople.companyCode)
      //let imageInfo = _.cloneDeep(this.state.imageInfo)
      //imageInfo.certificateNumber = ''
      //imageInfo.certificateTypeCode = ''

      this.setState({ isADFSLogined: true, aeonPeople, aeonPeopleFlag: 1 })
    }
  }

  handleConnect(type) {
    var params = {}
    this.setState({ loading_state: true })
    // change when api fixed...
    switch (type) {
      case Const.CONNECT_TYPE_MYPAGEID:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(type))
        break
      case Const.CONNECT_TYPE_AGREEMENT_DATA:
        {
          const lineKeyObject = localStorage.getItem('lineKeyObject')
          params = {
            customerId: window.customerId,
            customerInfoGetFlg: '',
            sessionNoUseFlg: '',
            tokenFlg: '1',
            simGetFlg: '1',
            planChangeFlg: '1',
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

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      const params = data.data
      if (type === Const.CONNECT_TYPE_MYPAGEID) {
        window.customerId = data.data.customerId

        this.handleConnect(Const.CONNECT_TYPE_AGREEMENT_DATA)
      } else if (type === Const.CONNECT_TYPE_AGREEMENT_DATA) {
        if (params.lineInfo.length) {
          console.log(params.lineInfo)
          this.setState({ lineInfo: params.lineInfo })
        }
      }
    }
  }

  pageNoChangeHandler(id) {
    var params = Const.CONNECT_TYPE_NOTICE_LIST_DATA
    this.handleConnect(params, id)
  }

  dataFixingHandler(type, index) {
    if (this.state.table_data.length > 0) {
      var TempReturn = ' '
      switch (type) {
        case 'importantFlg':
          TempReturn = this.state.table_data[index].importantFlg
          break
        case 'date':
          TempReturn = this.state.table_data[index].date
          break
        case 'title':
          TempReturn = this.state.table_data[index].title
          break

        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return ' '
    }
  }
  pagePrevious() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var prev_now_page_id = now_page_id - 1
    if (now_page_id > 1) {
      this.pageNoChangeHandler(prev_now_page_id)
    }
  }

  pageNext() {
    var now_page_id = parseInt(this.state.selected_page_id)
    var next_now_page_id = now_page_id + 1
    if (this.state.table_date.length !== 1) {
      this.pageNoChangeHandler(next_now_page_id)
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

  // NEXT画面に遷移する
  goNextDisplay(e, url, params) {
    e.preventDefault()
    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/plan/':
        // NEED TO SEND THE CUSTOMER ID
        //params.customer_id = window.customerId
        //params.lineKeyObject = this.state.lineInfo[0].lineKeyObject
        //params.lineDiv = this.state.lineInfo[0].lineDiv
        params.redirectApp = true
        console.log(this.state.lineInfo)
        console.log('passdate::', params)
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/plan/edit/':
        // NEED TO SEND THE CUSTOMER ID
        params.customer_id = window.customerId
        params.lineKeyObject = this.state.lineInfo[0].lineKeyObject
        params.lineDiv = this.state.lineInfo[0].lineDiv
        params.redirectApp = true
        console.log('passdate::', params)
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

  NewsHandler(type) {
    if (type === 'important') {
      $('#impo_news').hide()
      return null
    }

    if (type === 'normal') {
      $('#normal_news').hide()
      return null
    }
  }

  // if have news...
  NewsShowHandler(type) {
    if (type === 'important') {
      this.impo_Counter = 1
    }

    if (type === 'normal') {
      this.normal_Counter = 1
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

  handleChangeRelationship(e) {
    const value = e.target.value
    this.setAPPValue('relationship', value)
  }

  validateForm(apiName, key, required) {
    let validation = Validations.validationCheck(this, apiName, key, required)

    let error = this.state.error
    error[key] = validation
    this.setState({ error })
    return error[key].result === 'OK'
  }

  setAPPValue(key, value, index) {
    const aeonPeople = _.cloneDeep(this.state.aeonPeople)
    switch (key) {
      case 'employeeNumber':
        aeonPeople[key] = toHalfWidth(value)
        break
      case 'companyCode':
        aeonPeople[key] = toHalfWidth(value)
        break
      case 'tel':
        aeonPeople.tel[index] = toHalfWidth(value)
        const telLength = aeonPeople.tel.join('').length
        // 桁数チェック（11桁以下）
        if (telLength <= 11) {
          aeonPeople[key][index] = toHalfWidth(value)
        }
        break
      default:
        console.log(aeonPeople[key])
        aeonPeople[key] = value
        break
    }
    this.setState({ aeonPeople })
  }

  handleChangeInput(e, key, index) {
    if (key.startsWith('aeonPeople.')) {
      console.log('aeonPeople')
      key = key.substring(11)
      this.setAPPValue(key, e.target.value, index)
      return
    }
  }

  validateTelOnBlur(appFlag) {
    if (appFlag) {
      if (
        this.state.aeonPeople.tel[0] &&
        this.state.aeonPeople.tel[1] &&
        this.state.aeonPeople.tel[2]
      ) {
        this.validateForm('ARS002-A008', 'aeonPeople.tel')
      }
    } else {
      if (
        this.state.formState.customerInfo.tel[0] &&
        this.state.formState.customerInfo.tel[1] &&
        this.state.formState.customerInfo.tel[2]
      ) {
        this.validateForm('ARS002-A008', 'customerInfo.tel')
      }
    }
  }

  validateAPPForm() {
    // APP用のバリデーション
    /*
    let appImage = _.find(
      this.state.formState.imageInfo.imageDataList,
      (item) => item.imageType === 3
    )
    if (
      this.state.formState.customerInfo.aeonPeopleFlag === 0 ||
      (this.state.formState.customerInfo.aeonPeopleFlag === 1 && appImage)
    ) {
      return true
    } */
    let validation01 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.employeeNumber',
      true
    )
    let validation02 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.lastName',
      true
    )
    let validation03 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.firstName',
      true
    )
    let validation04 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.lastNameKana',
      true
    )
    let validation05 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.firstNameKana',
      true
    )
    let validation06 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.companyName',
      true
    )
    let validation07 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.companyCode',
      true
    )
    let validation08 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.departmentName',
      true
    )
    let validation09 = this.validateForm(
      'ARS002-A008',
      'aeonPeople.position',
      true
    )
    let validation10 = this.validateForm('ARS002-A008', 'aeonPeople.tel', true)
    return (
      validation01 &&
      validation02 &&
      validation03 &&
      validation04 &&
      validation05 &&
      validation06 &&
      validation07 &&
      validation08 &&
      validation09 &&
      validation10
    )
  }

  validateAllForm() {
    // 一度エラーメッセージ表示になっている要素は非表示に
    let _e = this.state.error
    Object.keys(_e).map((key) => {
      _e[key] = { result: 'OK' }
    })
    this.setState({ error: _e })

    const isValidAPP = this.validateAPPForm() // APP用のバリデーション 必要?
    return isValidAPP
  }

  async canvesAppForm() {
    const node = document.getElementById('appForm')
    if (node) {
      let options = {}
      let scrollY = window.scrollY || window.pageYOffset
      let width = node.clientWidth
      let height = node.clientHeight
      let userAgent = window.navigator.userAgent.toLowerCase()
      if (
        userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1
      ) {
        // IE11
        options = {
          x: 0,
          scrollX: 0,
          scrollY: -scrollY - 50,
          width,
          height: height * 1.5,
          windowWidth: width,
        }
        await html2canvas(node, options).then(async (canvas) => {
          await this.fileUpload(canvas, 'canvas')
        })
      } else if (
        userAgent.indexOf('iphone') != -1 ||
        userAgent.indexOf('ipad') != -1 ||
        (userAgent.indexOf('mozilla') != -1 &&
          userAgent.indexOf('mobile') != -1)
      ) {
        // iPhone or iPad
        await domtoimage.toPng(node).then(
          async function (dataUrl) {
            await this.fileUpload(dataUrl, 'url')
          }.bind(this)
        )
      } else {
        // その他
        options = {
          scrollX: 0,
          scrollY: -scrollY,
        }
        await html2canvas(node, options).then(async (canvas) => {
          await this.fileUpload(canvas, 'canvas')
        })
      }
    }
    console.log('end')
  }

  async handleSubmit() {
    await this.canvesAppForm()
    console.log('end2')
  }

  fileUpload(url, type) {
    if (type === 'canvas') {
      url = url.toDataURL('image/png')
    }
    const imageFile = url.replace(`data:image/png;base64,`, '')
    const body = {
      imageFile,
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
    return fetch(Const.ARS_SAVE_IMAGE, params)
      .then((res) => {
        if (!res.ok) {
          //this.props.handleResJson()
        }
        return res.json()
      })
      .then((resJson) => {
        if (resJson && resJson.data.imageId) {
          let imageInfo = _.cloneDeep(this.state.imageInfo)
          imageInfo.imageDataList.push({
            imageId: resJson.data.imageId,
            imageType: 3, // 固定
          })
          this.setState({ imageInfo })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  render() {
    this.Notice = this.state.table_data.map((Notice, key) => (
      <div key={'tr' + key}>
        {this.dataFixingHandler('importantFlg', key) === 0 ? (
          <li className="m-news_item">
            <a
              className="m-news_link"
              href=""
              onClick={(e) =>
                this.goNextDisplay(e, '/mypage/news/detail/', Notice)
              }
            >
              {this.NewsShowHandler('normal')} {/* checking normal news>0 */}
              <time className="m-news_time" dateTime="2018-10-17">
                {this.dataFixingHandler('date', key)}
              </time>
              <div className="m-news_excerpt">
                {this.dataFixingHandler('title', key)}
              </div>
            </a>
          </li>
        ) : (
          this.NewsHandler('normal')
        )}
      </div>
    ))

    this.ImpoNotice = this.state.table_data.map((ImpoNotice, key) => {
      if (this.dataFixingHandler('importantFlg', key) === 1) {
        this.important_dataCount++
        return (
          <li className="m-news_item-important">
            <a
              className="m-news_link-important"
              href=""
              onClick={(e) =>
                this.goNextDisplay(e, '/mypage/news/detail/', ImpoNotice)
              }
            >
              <div className="m-news_label">
                <span className="a-label-important">重要</span>
              </div>
              <div key={'tr' + key}>
                {this.dataFixingHandler('importantFlg', key) === 1 ? (
                  <div>
                    <div className="m-news_excerpt">
                      {this.NewsShowHandler('important')}{' '}
                      {/* checking Important news>0 */}
                      {this.dataFixingHandler('title', key)}
                    </div>
                  </div>
                ) : (
                  this.NewsHandler('important')
                )}
              </div>
            </a>
          </li>
        )
      }
    })

    if (this.impo_Counter === 1) {
      $('#impo_news').show()
    }

    // if imporatntnews=10 hide normal news
    if (this.important_dataCount >= 10) {
      $('#normal_news').hide()
      this.important_dataCount = 0
    } else {
      // Atleast one normal news
      if (this.normal_Counter === 1) {
        $('#normal_news').show()
      }
      this.important_dataCount = 0
    }

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
                    <li className="m-breadcrumb_item">オプション選択</li>
                  </ol>
                  <h1 className="a-h1">お知らせ一覧</h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            SIM名称
                            <br />
                            （電話番号：000-0000-0000)
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
                    <div className="option_table">
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
                          <button>
                            <img src={icon_help} />
                          </button>
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
                          <button>
                            <img src={icon_help} />
                          </button>
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
                          <button>
                            <img src={icon_help} />
                          </button>
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
                          <button>
                            <img src={icon_help} />
                          </button>
                        </div>
                        <div className="option_table_msg">廃止予定</div>
                        <div className="option_table_status">
                          <button>キャンセル</button>
                        </div>
                      </div>
                    </div>
                    <p
                      style={{
                        marginBottom: '25px',
                        fontSize: '14px',
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
                    <div className="m-btn-group">
                      <p
                        className="m-btn"
                        style={{
                          display: this.state.isStop ? 'none' : 'flex',
                        }}
                      >
                        <button className="a-btn-submit" type="button">
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

                  <div>
                    <label className="circle_radio">
                      <input
                        type="radio"
                        checked={true}
                        /* onChange={this.handleChangeAddress} */
                        value="1"
                      />
                      <span className="circle_radio_label">
                        音声プランから選択する
                      </span>
                    </label>
                  </div>

                  <div>
                    <button
                      onClick={(e) => {
                        this.goNextDisplay(
                          e,
                          '/mypage/plan/',
                          this.state.lineInfo[this.state.lineInfoNum]
                        )
                      }}
                    >
                      プラン遷移
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        this.goNextDisplay(
                          e,
                          '/mypage/plan/edit/',
                          this.state.lineInfo[this.state.lineInfoNum]
                        )
                      }}
                    >
                      プランエディット遷移
                    </button>
                  </div>
                </div>

                {this.state.aeonPeopleFlag == 1 && (
                  <div
                    className="ui container"
                    style={{ padding: '10px', backgroundColor: '#fff' }}
                  >
                    <h1 className="headTitle">従業員情報入力</h1>
                    <div className="ui form">
                      <div id="appForm" style={{ paddingBottom: '1rem' }}>
                        <div style={{ margin: '1rem' }}>
                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              社員番号
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.employeeNumber"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.employeeNumber'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.employeeNumber'
                                      )
                                    }
                                    placeholder="0105H000000"
                                    type="text"
                                    value={this.state.aeonPeople.employeeNumber}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                    //disabled={this.props.isAddressError}
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.employeeNumber'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              従業員名
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.lastName"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.lastName'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.lastName'
                                      )
                                    }
                                    placeholder="姓"
                                    type="text"
                                    value={this.state.aeonPeople.lastName}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                    //disabled={this.props.isAddressError}
                                  />
                                </li>
                                <li>
                                  <input
                                    id="aeonPeople.firstName"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.firstName'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.firstName'
                                      )
                                    }
                                    placeholder="名"
                                    type="text"
                                    value={this.state.aeonPeople.firstName}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                    //disabled={this.props.isAddressError}
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.lastName'}
                              />
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.firstName'}
                              />

                              <div id="appFormNotes">
                                <p
                                  className="noteText"
                                  style={{
                                    marginBottom: '0',
                                    padding: '0',
                                    textIndent: '0',
                                  }}
                                >
                                  髙や﨑などの異字体・ローマ数字などは名前及び住所の入力にご利用いただけません。
                                </p>
                                <p
                                  className="noteText"
                                  style={{
                                    marginBottom: '0',
                                    padding: '0',
                                    textIndent: '0',
                                  }}
                                >
                                  ご利用できない文字が含まれる場合は恐れ入りますが、新字体・カタカナ又は数字などにて入力ください。
                                </p>
                                <p
                                  className="noteText"
                                  style={{
                                    display: 'table',
                                    marginBottom: '0',
                                    paddingLeft: '0',
                                    textIndent: '0',
                                  }}
                                >
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => {
                                      this.setState({ aboutJisModal: true })
                                    }}
                                    style={{ display: 'table-cell' }}
                                  >
                                    ご利用いただけない文字について
                                  </a>
                                  <img
                                    src={icon_help}
                                    style={{ display: 'table-cell' }}
                                    alt="help"
                                    width="16"
                                  />
                                </p>
                                <p
                                  className="noteText"
                                  style={{ marginBottom: 0 }}
                                >
                                  ※ご利用できない文字が含まれる場合を除き、画像をアップロードされる本人確認書類と同じ漢字をご入力ください。
                                </p>
                                <p className="noteText">
                                  ※漢字が環境依存文字の場合は常用漢字をご入力ください。
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              従業員名
                              <span className="textFormat">（カタカナ）</span>
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.lastNameKana"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.lastNameKana'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.lastNameKana'
                                      )
                                    }
                                    placeholder="セイ"
                                    type="text"
                                    value={this.state.aeonPeople.lastNameKana}
                                  />
                                </li>
                                <li>
                                  <input
                                    id="aeonPeople.firstNameKana"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.firstNameKana'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.firstNameKana'
                                      )
                                    }
                                    placeholder="メイ"
                                    type="text"
                                    value={this.state.aeonPeople.firstNameKana}
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.lastNameKana'}
                              />
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.firstNameKana'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              会社名（正式名称）
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.companyName"
                                    maxLength="100"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.companyName'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.companyName'
                                      )
                                    }
                                    placeholder="イオンリテール株式会社"
                                    type="text"
                                    value={this.state.aeonPeople.companyName}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.companyName'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              会社コード
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.companyCode"
                                    maxLength="100"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.companyCode'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.companyCode'
                                      )
                                    }
                                    placeholder="0105"
                                    type="text"
                                    value={this.state.aeonPeople.companyCode}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.companyCode'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              所属名（正式名称）
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.departmentName"
                                    maxLength="100"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.departmentName'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.departmentName'
                                      )
                                    }
                                    placeholder="住居余暇・H＆BC本部アプライアンス商品部イオンモバイルユニット システム統括G"
                                    type="text"
                                    value={this.state.aeonPeople.departmentName}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.departmentName'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              役職、担当等
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.position"
                                    maxLength="100"
                                    onBlur={(e) =>
                                      this.validateForm(
                                        'ARS002-A008',
                                        'aeonPeople.position'
                                      )
                                    }
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.position'
                                      )
                                    }
                                    placeholder="商品部〇〇担当"
                                    type="text"
                                    value={this.state.aeonPeople.position}
                                    style={{ backgroundColor: '#e5e5e5' }}
                                    readOnly
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.position'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              所属部署電話番号
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <input
                                    id="aeonPeople.position"
                                    maxLength="4"
                                    onBlur={(e) => this.validateTelOnBlur(1)}
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.tel',
                                        0
                                      )
                                    }
                                    placeholder="090"
                                    type="tel"
                                    value={this.state.aeonPeople.tel[0]}
                                  />
                                </li>
                                <li>
                                  <input
                                    id="aeonPeople.position"
                                    maxLength="4"
                                    onBlur={(e) => this.validateTelOnBlur(1)}
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.tel',
                                        1
                                      )
                                    }
                                    placeholder="1234"
                                    type="tel"
                                    value={this.state.aeonPeople.tel[1]}
                                  />
                                </li>
                                <li>
                                  <input
                                    id="aeonPeople.position"
                                    maxLength="4"
                                    onBlur={(e) => this.validateTelOnBlur(1)}
                                    onChange={(e) =>
                                      this.handleChangeInput(
                                        e,
                                        'aeonPeople.tel',
                                        2
                                      )
                                    }
                                    placeholder="5678"
                                    type="tel"
                                    value={this.state.aeonPeople.tel[2]}
                                  />
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                param={'aeonPeople.tel'}
                              />
                            </div>
                          </div>

                          <div className="fotmItem">
                            <div className="formTitle">
                              <span className="icon-required">必須</span>
                              従業員との関係
                            </div>
                            <div className="formInput">
                              <ul className="inlineFormArea">
                                <li>
                                  <select
                                    onChange={this.handleChangeRelationship}
                                    style={{ width: '224px' }}
                                  >
                                    {relationshipOptions.map((item) => {
                                      const selected =
                                        this.state.aeonPeople.relationship ==
                                        item.key
                                          ? true
                                          : false

                                      return (
                                        <option
                                          key={item.key}
                                          value={item.value}
                                          selected={selected}
                                        >
                                          {item.text}
                                        </option>
                                      )
                                    })}
                                  </select>
                                </li>
                              </ul>
                              <MessageArea
                                error={this.state.error}
                                index={this.state.index}
                                param={'aeonPeople.relationship'}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="formbtnFlex">
                      <button
                        onClick={async () => {
                          this.headerUrlHandler('/mypage/user/')
                        }}
                        className="formbtn return"
                      >
                        戻る
                      </button>
                      <button
                        onClick={async () => {
                          if (this.validateAllForm(true)) {
                            //成功

                            this.handleSubmit()
                            /* const params = {
                          formState: this.state.formState,
                          applyNumber: applyNumber,
                        }
                        this.headerUrlHandler(
                          `/mypage/change/transfer/step2`,
                          params
                        ) */
                          } else {
                            // エラー発生箇所の一番目の要素へスクロール
                          }
                        }}
                        className="formbtn next"
                        /* disabled={
                      JSON.stringify(this.state.formState) ==
                      JSON.stringify(this.state.formState_default)
                    } */
                      >
                        次へ進む
                      </button>
                    </div>
                  </div>
                )}
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

        {this.state.checkModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <h3
                  style={{
                    textAlign: 'center',
                    fontSize: '25px',
                    lineHeight: '1.48',
                  }}
                >
                  オプション「イオンでんわ5分かけ放題」、加入不可となるため、
                  <br />
                  チェックが外れますがよろしいですか？
                </h3>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  /* onClick={() => this.setState({ receptModal: false })} */
                >
                  いいえ
                </button>
                <button
                  className="formbtn next"
                  /* onClick={() => this.submitNotification()} */
                >
                  はい
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.applicationModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <h3
                  style={{
                    fontSize: '30px',
                    textAlign: 'center',
                    lineHeight: '1.23',
                  }}
                >
                  オプションのご変更
                </h3>
              </div>
              <div className="ulModal_content">
                <div className="m-box-bg a-ta-center">
                  <div className="m-box_body">
                    <p className="a-h3">
                      SIM名称
                      <br />
                      （電話番号：000-0000-0000)
                    </p>
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: '25px',
                    lineHeight: '1.48',
                    fontWeight: 'bold',
                  }}
                >
                  オプション追加・廃止手続き
                </h3>
                <div className="option_modal_box">
                  <h4>契約中のオプション</h4>
                  <div className="option_modal_list">
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>165円</span>
                      </dd>
                      <dd className="option_modal_list_icon">
                        <span>廃止</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンでんわフルかけ放題
                      </dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>1650円</span>
                      </dd>
                      <dd className="option_modal_list_icon">
                        <span>新規</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">税込　　165円</dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">税込　　165円</dd>
                    </dl>
                  </div>
                </div>
                <div className="option_modal_box_arrow">
                  <img src={option_arrow_down} style={{ width: '67px' }} />
                </div>
                <div className="option_modal_box option_modal_box_red">
                  <h4>契約後のオプション</h4>
                  <div className="option_modal_list">
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>165円</span>
                      </dd>
                      <dd className="option_modal_list_icon">
                        <span>廃止</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンでんわフルかけ放題
                      </dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>1650円</span>
                      </dd>
                      <dd className="option_modal_list_icon">
                        <span>新規</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">税込　　165円</dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">
                        イオンスマホセキュリティ
                      </dt>
                      <dd className="option_modal_list_price">税込　　165円</dd>
                    </dl>
                  </div>
                </div>
                <p>
                  注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項注意事項。
                </p>
              </div>

              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ applicationModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  /* onClick={() => this.submitNotification()} */
                >
                  申し込む
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.receptModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div
                className="ulModal_content"
                style={{
                  borderBottom: '1px solid rgba(34,36,38,.15)',
                }}
              >
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  各種完了通知書のお受け取り方法について
                </h3>
                <p
                  style={{
                    fontSize: '20px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                  }}
                >
                  現在、各種完了通知書のお受け取り方法が「郵送」になっております。
                  <br />
                  「メールで通知」に変更すると、発行されたらすぐにメールで通知が受け取れるので
                  大変便利です。
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.8',
                  }}
                >
                  ※お電話又は店頭にて、同日中に複数回の情報変更をお申込みされた場合、郵政にて通知書を送付させていただく場合がございます。
                  <br />
                  ※お手続き完了とお手続きに不備があった場合には通知書の受け取り方法に関わらずメールで状況のみお知らせ致します。
                  <br />
                  ※設定した受け取り方法は、今後のすべての完了通知書に適用されます。
                </p>
              </div>
              <div className="ulModal_content">
                <div>
                  <div className="ulModal_check">
                    <label className="ui_radio">
                      <input
                        type="radio"
                        name="notification"
                        value="1"
                        onChange={(e) => this.handleChangeNotification(e, '1')}
                        checked={this.state.notice_status === '1'}
                      />
                      <span className="ui_radio_label">郵送</span>
                    </label>
                  </div>
                  <div className="ulModal_check">
                    <label className="ui_radio">
                      <input
                        type="radio"
                        name="notification"
                        value="2"
                        onChange={(e) => this.handleChangeNotification(e, '2')}
                        checked={this.state.notice_status === '2'}
                      />
                      <span className="ui_radio_label">メールで通知</span>
                    </label>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.8',
                  }}
                >
                  ※変更まで数分かかります。
                </p>
                <p
                  style={{
                    marginTop: '24px',
                    fontSize: '20px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                  }}
                >
                  受取先のメールアドレス
                </p>
                <div
                  style={{
                    padding: '29px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '14px',
                    backgroundColor: '#E0E0E0',
                    border: '1px #707070 solid',
                  }}
                >
                  <p
                    style={{
                      margin: '0',
                      fontSize: '20px',
                      lineHeight: '1.7',
                      fontWeight: 'bold',
                    }}
                  >
                    {this.state.mailAddress}
                  </p>
                </div>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ receptModal: false })}
                >
                  閉じる
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  更新する
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.planModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <p className="a-h1">料金プランのご変更</p>
                <div className="m-form">
                  <div className="t-inner_wide">
                    <p className="a-h3 a-fw-normal a-mb-5">
                      ◎ご利用中の料金プラン
                    </p>
                    <div className="m-box-bg a-ta-center">
                      <p className="a-h3">データ２GBプラン 税込748円</p>
                    </div>
                  </div>
                  <div className="m-form_section">
                    <p>
                      月々のご利用プラン（高速データ通信の容量）のご変更のお申込みができます。
                    </p>
                    <ul className="a-list">
                      <li>‣ プラン変更手数料は無料です。</li>
                      <li>
                        ‣「音声プラン→データプラン」「音声プラン→シェア音声プラン」など、契約種別をまたぐ変更はできません。
                      </li>
                      <li>
                        ‣
                        ご契約のプランにより、こちらから変更できるプランに制限がある場合がございます。
                        <br />
                        （表示されたプラン以外に変更をご希望の場合は、イオンモバイルお客さまセンターまでお問い合わせください）
                      </li>
                    </ul>
                  </div>
                  <hr className="a-hr a-hr-full" />
                  <div className="t-inner_wide">
                    <p className="a-h3 a-fw-normal a-mb-5">◎プラン一覧</p>
                    <div className="m-field">
                      <select className="a-select">
                        <option>変更後のプランをお選びください。</option>
                      </select>
                    </div>
                    <div className="m-box">
                      <div className="m-box_body">
                        <p className="a-h3">ご確認ください</p>
                        <ul className="a-list-border">
                          <li>
                            毎月末日の前日18:59までプランの変更と取消が可能です。
                            <br />
                            但し、月末日の前々日18:59までにプランの変更を申し込まれた方は、その申込が適用される翌月1日までプランの変更ができなくなります。
                          </li>
                          <li>
                            毎月月末の前日19:00以降のプラン変更については、翌々月の適用となりますので、ご注意ください。
                          </li>
                          <li>
                            システムメンテナンス日は、お申込みいただけません。
                          </li>
                          <li>
                            ご利用料金のお支払いが確認できていないお客さまは、プラン変更のお申込みをお受けしかねる場合がございます。
                          </li>
                          <li>
                            お申込み内容、「ご確認ください」をご確認いただき
                            <span className="a-primary">
                              「同意します」にチェック
                            </span>
                            を入れてお申し込みください。
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="m-form_section">
                    <div className="m-field">
                      <div className="m-field_control-check">
                        <label htmlFor="agreement">
                          <input
                            className="a-input-checkbox"
                            type="checkbox"
                            id="agreement"
                            data-agreement-target="submit"
                            onClick={() =>
                              this.setState({
                                btnDisabled: !this.state.btnDisabled,
                              })
                            }
                          />
                          <span className="a-weak">同意します</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ planModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  更新する
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.optionModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <p className="a-h1">オプションのご変更</p>
                <div className="m-form">
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
                  <div className="option_table">
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
                        <button>
                          <img src={icon_help} />
                        </button>
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
                        <button>
                          <img src={icon_help} />
                        </button>
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
                        <button>
                          <img src={icon_help} />
                        </button>
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
                        <button>
                          <img src={icon_help} />
                        </button>
                      </div>
                      <div className="option_table_msg">廃止予定</div>
                      <div className="option_table_status">
                        <button>キャンセル</button>
                      </div>
                    </div>
                  </div>
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
                </div>
              </div>

              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ optionModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  上記内容で申し込む
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.confirmModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_content">
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    fontWeight: 'bold',
                  }}
                >
                  名義変更（利用権譲渡）もしくは承継に伴い、現在選択中のプランとオプションが選択できなくなります。
                </h3>
                <p>
                  ※プランの変更とオプションの変更が完了するまでは、申し込みは完了しておりませんので、ご注意ください。
                </p>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '41px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ confirmModal: false })}
                >
                  戻る
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  プラン変更へ進む
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.confirmOptionModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ confirmOptionModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    marginBottom: '0',
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  以下のオプションが加入不可となるため、
                  <br />
                  解除されますがよろしいですか？
                </h3>

                <div className="option_modal_box" style={{ marginTop: '24px' }}>
                  <h4>契約中のオプション</h4>
                  <div className="option_modal_list">
                    <dl>
                      <dt className="option_modal_list_title">aa</dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>111円</span>
                      </dd>
                      <dd className="option_modal_list_icon"></dd>
                    </dl>
                    <dl>
                      <dt className="option_modal_list_title">aa</dt>
                      <dd className="option_modal_list_price">
                        <span>税込</span>
                        <span>111円</span>
                      </dd>
                      <dd className="option_modal_list_icon"></dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '24px',
                }}
              >
                <button
                  className="formbtn return"
                  onClick={() => this.setState({ confirmOptionModal: false })}
                >
                  いいえ
                </button>
                <button
                  className="formbtn next"
                  onClick={() => this.submitNotification()}
                >
                  はい
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.newOptionModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ newOptionModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  以下のオプションが加入不可となるため、
                  <br />
                  解除されますがよろしいですか？
                </h3>
              </div>
              <div>
                <div>
                  <div className="newOption_box">
                    新たなオプションを加入する方は
                    <br />
                    こちらからお進みください
                  </div>
                  <div className="newOption_box">お手続きを完了する</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.finishModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ finishModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '25px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  名義変更、プラン変更、オプション変更お手続きを受け付けました。
                </h3>
              </div>
              <div
                className="formbtnFlex"
                style={{
                  marginTop: '10px',
                  paddingBottom: '0',
                }}
              >
                <button
                  className="formbtn next"
                  onClick={() => this.handleFinish()}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {this.state.planAppModal && (
          <div className="l-modal is-active">
            <div className="l-modal_overlay">
              <div
                style={{ maxWidth: '960px' }}
                className="l-modal_content is-active"
              >
                <div className="m-modal">
                  <div className="m-modal_inner">
                    <p>APP認証エラーのためAPPプランへの変更はできません</p>
                    <div className="m-btn">
                      <button
                        onClick={() => this.setState({ planAppModal: false })}
                        className="a-btn-dismiss a-btn-icon-none"
                        type="button"
                      >
                        閉じる
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.operateModal && (
          <div className="ulModal">
            <div
              className="ulModal_main"
              style={{ padding: '48px', boxSizing: 'border-box' }}
            >
              <button
                className="ulModal_close"
                onClick={() => this.setState({ operateModal: false })}
              >
                閉じる
              </button>
              <div>
                <h3
                  style={{
                    fontSize: '30px',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  状態について
                </h3>
              </div>
              <div style={{ marginTop: '40px' }}>
                <table className="operateTable">
                  <thead>
                    <tr>
                      <th>状態</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>手続き中</th>
                      <td>お手続き中です。</td>
                    </tr>
                    <tr>
                      <th>不備</th>
                      <td>
                        お申込み内容に不備があり、お手続きが完了していません。再度お申込みをお願いします。
                      </td>
                    </tr>
                    <tr>
                      <th>キャンセル</th>
                      <td>お手続きをキャンセルしました。</td>
                    </tr>
                    <tr>
                      <th>手続き完了</th>
                      <td>お手続き完了です。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <p
                  style={{
                    margin: '30px 0 0',
                    fontSize: '14px',
                    lineHeight: 1.8,
                  }}
                >
                  ※プラン切り替えの適用は手続完了日の翌月となります。
                  <br />
                  ※かけ放題オプションの切り替え（かけ放題種別の変更）は、手続き完了日の翌月となります。
                  <br />
                  ※手続き完了日が月末付近の場合は、適用が翌々月になる場合がございます。
                </p>
              </div>
            </div>
          </div>
        )}

        {this.state.helpModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p>
                  <img
                    src={icon_help}
                    alt="help"
                    width="16"
                    style={{ marginRight: '0.75rem' }}
                  />
                  イオンモバイルセキュリティPlus
                </p>
              </div>
              <div className="ulModal_content">
                <div className="contentsWrapper" style={{ paddingBottom: '0' }}>
                  aaa
                </div>
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
        {this.state.aboutJisModal && (
          <div className="ulModal">
            <div className="ulModal_main">
              <div className="ulModal_header">
                <p>ご利用いただけない文字について</p>
              </div>
              <div className="ulModal_content">
                <h3 style={{ fontSize: '1.8rem' }}>■漢字</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  髙や﨑など、JIS規格第１水準及び第２水準に含まれない漢字
                </p>
                <h3 style={{ fontSize: '1.8rem' }}>■数字</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  ①などの丸付き数字、Ⅲなどのローマ数字
                </p>
                <h3 style={{ fontSize: '1.8rem' }}>■その他</h3>
                <p style={{ fontSize: '1.68rem' }}>
                  カタカナ(半角)、一部の記号など
                </p>
              </div>
              <div className="ulModal_actions">
                <button
                  className="Button"
                  onClick={() => {
                    this.setState({ aboutJisModal: false })
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

export default connect(mapStateToProps)(News)
