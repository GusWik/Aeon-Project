// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT JQUERY
import $, { timers } from 'jquery'
import moment from 'moment'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT ACTION FILES
import { dispatchPostConnections } from '../../../../actions/PostActions.js'
import { setConnectionCB } from '../../../../actions/PostActions.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const'

// IMPORT MODULES
import Dialog from '../../../../modules/Dialog.js'
import Header from '../../../../modules/Header.js'

class Communication_change extends ComponentBase {
  constructor(props) {
    super(props)

    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.dataFixingHandler = this.dataFixingHandler.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)
    this.toggle_dialog_box = this.toggle_dialog_box.bind(this)
    this.callbackDialogError = this.callbackDialogError.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.goNextDisplay = this.goNextDisplay.bind(this)
    this.isDisabledChange = this.isDisabledChange.bind(this)
    this.checklastUpdateTime = this.checklastUpdateTime.bind(this)

    this.state = {
      loading_state: false,
      data_available: false,
      sim_data: {},
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
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
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

      token: '',
      status: '',
      lastChangeDay: '',
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          body: '',
          remarks: '',
          values: [
            {
              text: <p>5Gの設定を変更します。よろしいですか？</p>,
            },
          ],
          otherTitle: '',
          others: [],
          button: [
            {
              id: 'dialog_button_cancel',
              value: 'キャンセル',
              classname: 'a-btn-dismiss a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
            {
              id: 'dialog_button_ok',
              value: 'OK',
              classname: 'a-btn-submit a-btn-icon-none',
              disabled: false,
              state: true,
              callback: this.callbackDialog,
              interval: null,
            },
          ],
          callback: this.callbackDialog,
          state: false,
          key: 'dialog_bx',
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
          close: false,
        },
      ],
    }
  }

  componentDidMount() {
    this.goTop()
    if (window.customerId === undefined) return
    document.title = Const.TITLE_MYPAGE_COMMUNICATION_CHANGE
    this.handleConnect(Const.CONNECT_TYPE_SIM_DATA)
  }

  handleConnect(type) {
    var params = {}
    switch (type) {
      // API AMM000020
      case Const.CONNECT_TYPE_GET_5G_STATUS: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
      case Const.CONNECT_TYPE_SIM_DATA: {
        params = {
          lineKeyObject: this.state.lineInfo.lineKeyObject,
          lineDiv: this.state.lineInfo.lineDiv,
          lineNo: this.state.lineInfo.lineNo,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }

      default: {
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      }
    }

    this.setState({ loading_state: true })
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      var d = data.data
      this.setState({ loading_state: false })
      document.title = Const.TITLE_MYPAGE_COMMUNICATION_CHANGE
      switch (type) {
        //通信取得
        case Const.CONNECT_TYPE_GET_5G_STATUS: {
          //回線番号 lineNo 指定した回線番号(080や090で始まる電話番号）
          //5Gステータス 5gStatus 1:5G ON 0:5G OFF  9:情報取得失敗
          //最終変更日 lastChangeDay 最後に5Gステータス変更をした日
          //トークン token 5Gステータス変更APIで使用するトークン
          this.setState({
            token: d.token,
            status: d['5gStatus'].toString(),
            lastChangeDay: d['lastChangeDay'],
          })
          this.setState({ data_available: true })
          break
        }

        case Const.CONNECT_TYPE_SIM_DATA: {
          this.setState({ sim_data: data.data })
          this.handleConnect(Const.CONNECT_TYPE_GET_5G_STATUS)
          break
        }

        default: {
          break
        }
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        var values = []
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'validation_errors') {
        // token無効エラー
        // システムエラー画面へ遷移
        this.props.history.push('/error?e=1')
        document.title = Const.TITLE_ERROR
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        if (
          data &&
          data.response &&
          data.response.StatusCode &&
          data.response.StatusCode == 480
        ) {
          dialogs_copy[0].title = ''
          var values = []
          values[0] = { text: '短時間での連続での切り替えはできません。' }
          dialogs_copy[0].values = values
          dialogs_copy[0].state = true
          dialogs_copy[0].close = true
          this.setState({ dialogs_error: dialogs_copy })
        } else {
          // システムエラー画面へ遷移
          this.props.history.push('/error?e=1')
          document.title = Const.TITLE_ERROR
        }
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

  callbackDialogError(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_ok':
          var dialogs_copy = [...this.state.dialogs_error]
          dialogs_copy[0].state = false
          if (dialogs_copy[0].close) {
            dialogs_copy[0].close = false
            this.setState({ dialogs_error: dialogs_copy })
          } else {
            this.setState({ dialogs_error: dialogs_copy })
            this.props.history.push('/mypage/')
          }
          break
      }
    }
  }

  dataFixingHandler(type) {
    var TempReturn = ' '
    if (this.state.data_available) {
      switch (type) {
        case 'user_nick_name':
          TempReturn = this.state.sim_data.nickName
          break
        case 'tel':
          TempReturn = '（電話番号：' + this.state.lineInfo.lineNo + '）'
          break
        case 'line_type':
          TempReturn = this.state.sim_data.type
          break
        case 'line_type_name':
          //SIMのタイプ D:ドコモ、K:AU
          var _type = ''
          if (this.state.sim_data.type == 'D') {
            _type = 'NTTドコモ回線'
          } else if (this.state.sim_data.type == 'K') {
            _type = 'au回線'
          }
          //lineDiv 1:IIJ ==タイプ１ 2:ncom ==タイプ２
          if (this.state.lineInfo.lineDiv == '1') {
            TempReturn = '（タイプ1 ' + _type + '）'
          } else if (this.state.lineInfo.lineDiv == '2') {
            TempReturn = '（タイプ2 ' + _type + '）'
          } else {
            TempReturn = ' '
          }
          break
        case 'sim_type':
          //SIM種別 1:音声/2:SMS/3:データ/4:シェア
          if (this.state.sim_data.simType == '1') {
            TempReturn = '音声'
          } else if (this.state.sim_data.simType == '2') {
            TempReturn = 'データSMS'
          } else if (this.state.sim_data.simType == '3') {
            TempReturn = 'データ'
          } else if (this.state.sim_data.simType == '4') {
            TempReturn = '音声'
          } else {
            TempReturn = ' '
          }
          break
        case 'activateDate':
          TempReturn = this.state.sim_data.activateDate
          break
        case '5g_stauts':
          TempReturn = this.state.status
          break

        case '5g_stauts_name':
          //5Gステータス 5gStatus 1:5G ON 0:5G OFF  9:情報取得失敗
          if (this.state.status == '1') {
            TempReturn = 'ON'
          } else if (this.state.status == '0') {
            TempReturn = 'OFF'
          } else {
            TempReturn = null
          }

          break
        case 'lastChangeDay':
          TempReturn = this.state.lastChangeDay
            ? moment(this.state.lastChangeDay)
            : ' '
          break
        default:
          TempReturn = ' '
      }
      return TempReturn
    } else {
      return TempReturn
    }
  }

  toggle_dialog_box(e) {
    e.preventDefault
    this.goNextDisplay(
      e,
      '/mypage/communication/change/confirm',
      this.state.lineInfo
    )
  }

  callbackDialog(type, id) {
    var is_check = true
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 't-modal_overlay': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
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
    e.preventDefault()

    switch (url) {
      case '/':
        this.props.history.push({
          pathname: url,
          state: params,
        })
        break
      case '/mypage/communication/change/confirm':
        params.customer_id = this.state.url_data[0].pass_data.customer_id
        params.lineNo = this.state.lineInfo.lineNo
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

  checklastUpdateTime() {
    let customerId = window.customerId
    let lastUpdateTime = localStorage.getItem('lastUpdateTime')
    if (lastUpdateTime) {
      lastUpdateTime = JSON.parse(lastUpdateTime)

      if (customerId in lastUpdateTime) {
        let targetTime = lastUpdateTime[customerId][this.state.sim_data.ICCID]
        if (targetTime) {
          let timeStamp = moment().unix()

          let diff = timeStamp - Number(targetTime)
          //diff = Math.abs(diff) / (60 * 1000)
          //diff = Math.abs(diff) / 60
          //targetTime
          if (Math.abs(diff) < 60) {
            return false
          }
        }
      }
    }
    return true
  }

  isDisabledChange() {
    //MNP発行が当日だったら押せない
    let today = moment()
    if (Object.keys(this.state.sim_data).length) {
      let activateDate = this.dataFixingHandler('activateDate')
      if (activateDate && activateDate != ' ') {
        let startDate = moment(activateDate).startOf('day')
        let endDate = moment(activateDate).endOf('day').add(0, 'day')
        if (today.isBetween(startDate, endDate, null, '[]')) {
          return true
        }
      }

      //type2は、何回でも切り替えできるように対応
      if (
        this.state.sim_data.type == 'D' &&
        this.state.lineInfo.lineDiv == '2'
      ) {
        if (!this.checklastUpdateTime()) {
          return true
        }
      } else {
        //1日1回制御は、日付が変わった 翌日9時時点
        if (this.dataFixingHandler('lastChangeDay') != ' ') {
          let lastChangeDay = this.dataFixingHandler('lastChangeDay')
          //翌日9時時点
          let nextChangeDay = moment(lastChangeDay)
            .startOf('day')
            .add(1, 'day')
            .add(9, 'hours')

          if (today.isBetween(lastChangeDay, nextChangeDay, null, '[]')) {
            return true
          }
        }
      }
    }

    //20:00〜翌9:00までは切り替えできません
    let startTime = moment().startOf('day').add(9, 'hours')
    let endTime = moment().startOf('day').add(20, 'hours')

    return !today.isBetween(startTime, endTime, null, '[]')
  }
  render() {
    const table_head = {
      background: '#b50080',
      padding: '6.5px 12px',
      padding: '.65rem 1.2rem',
      verticalAlign: 'middle',
    }

    if (this.state.status === '1') {
      //1:5G ON
      this.items = (
        <table className="a-table-between">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th" style={table_head}>
                現在の設定：
              </th>
              <td className="m-status_td" style={table_head}>
                <span>５G {this.dataFixingHandler('5g_stauts_name')}</span>
              </td>
            </tr>
          </tbody>
        </table>
      )

      this.api_button = (
        <button
          className="a-btn-submit"
          type="button"
          disabled={this.isDisabledChange()}
          onClick={this.toggle_dialog_box}
        >
          ５GをOFFにする
        </button>
      )
    } else if (this.state.status == '0') {
      //0:5G OFF
      this.items = (
        <table className="m-status-disabled a-table-between">
          <tbody>
            <tr className="m-status_tr">
              <th className="m-status_th">現在の設定：</th>
              <td className="m-status_td" style={{ verticalAlign: 'middle' }}>
                <span>５G {this.dataFixingHandler('5g_stauts_name')}</span>
              </td>
            </tr>
          </tbody>
        </table>
      )

      this.api_button = (
        <button
          className="a-btn-submit"
          type="button"
          disabled={this.isDisabledChange()}
          onClick={this.toggle_dialog_box}
        >
          ５GをONにする
        </button>
      )
    } else if (this.state.status == '9') {
      this.items = null
      this.checklineType = null
      this.api_button = (
        <button
          className="a-btn-submit"
          type="button"
          disabled={true}
          onClick={this.toggle_dialog_box}
        >
          ５GをONにする
        </button>
      )
    } else {
      this.items = null
      this.checklineType = null
      this.api_button = null
    }

    if (
      this.dataFixingHandler('line_type') == 'D' &&
      this.state.sim_data.simType == '2'
    ) {
      //データSMS（タイプ１・２ NTTドコモ回線）の場合は、
      //グレーアウトで5G ON/OFF切替変更できない仕様
      this.api_button = (
        <button
          className="a-btn-submit a-btn-disabled"
          type="button"
          disabled={true}
          onClick={this.toggle_dialog_box}
        >
          ５GをONにする
        </button>
      )
    }

    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} />
          } else {
            return <React.Fragment key="react_fragment" />
          }
        })}

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
                    <li className="m-breadcrumb_item">
                      {Const.TITLE_MYPAGE_COMMUNICATION_CHANGE}
                    </li>
                  </ol>
                  <h1 className="a-h1">
                    {Const.TITLE_MYPAGE_COMMUNICATION_CHANGE}
                  </h1>
                  <div className="m-form">
                    <div className="t-inner_wide">
                      <div className="m-box-bg a-ta-center">
                        <div className="m-box_body">
                          <h2 className="a-h3">
                            {this.dataFixingHandler('user_nick_name')}
                            <br />
                            {this.dataFixingHandler('tel')}
                            <br />
                            {this.dataFixingHandler('sim_type')}&nbsp;
                            {this.dataFixingHandler('line_type_name')}
                          </h2>
                        </div>
                      </div>

                      {this.items}
                    </div>

                    <div className="m-form_section a-fs-sm">
                      <p className="a-fw-bold">
                        表示中の回線について5G通信のON/OFF切り替えが可能です。
                        <br />
                        切り替えの前に以下の注意点を必ずご確認ください。
                      </p>
                      <div className="m-annotation">
                        5G通信は、5G対応機種でご利用いただく必要があります。
                      </div>
                      {this.state.lineInfo.lineDiv != '2' && (
                        <div className="m-annotation">
                          タイプ１NTTドコモ回線とau回線については、
                          <br />
                          1日に1度だけONからOFFもしくはOFFからONへ切り替え可能です。
                        </div>
                      )}
                      <div className="m-annotation">
                        20:00〜翌9:00までは切り替えできません。
                      </div>
                      <div className="m-annotation">
                        5G通信をご利用中は、3G通信はご利用できません。
                      </div>
                      <div className="m-annotation">
                        NTTドコモ回線のSMS機能付きSIMカードは5G通信をご利用いただけません。
                      </div>
                      <div className="m-annotation">
                        5G通信と4G/LTE通信に切り替えることで、通信速度が改善されるものではございません。
                      </div>
                      <div className="m-annotation">
                        SIMカードのご利用開始当日は切り替えできません。
                      </div>
                      {this.state.lineInfo.lineDiv != '2' && (
                        <div className="m-annotation">
                          MNP予約番号発行をお申込み中の回線については切り替えできません。
                        </div>
                      )}
                      <div className="m-annotation">
                        5G通信のON/OFF切り替え実施後、通信が切り替わるまでお時間がかかる場合があります。
                      </div>
                    </div>
                    <div className="m-form_section">
                      <div className="m-btn-group">
                        <p className="m-btn">{this.api_button}</p>
                        <p className="m-btn">
                          <a className="a-btn-dismiss" href="/">
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

export default connect(mapStateToProps)(Communication_change)
