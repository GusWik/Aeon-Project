// IMPORT REACT
import React from 'react'
import { connect } from 'react-redux'

// IMPORT COMMON CSS
import '../../../assets/css/common.css'

// IMPORT IMAGES

// IMPORT COMPONENT BASE
import ComponentBase from '../../../ComponentBase.js'

// IMPORT CONST FILE
import * as Const from '../../../../Const.js'

// IMPORT MODULES
import Header from '../../../../modules/Header.js'
import Dialog from '../../../../modules/Dialog.js'

// 通信用のモジュールを読み込み
import {
  dispatchGetConnections,
  dispatchPostConnections,
  setConnectionCB,
} from '../../../../actions/PostActions.js'

class User_List extends ComponentBase {
  constructor(props) {
    super(props)
    this.handleConnectChange = this.handleConnectChange.bind(this)
    this.headerUrlHandler = this.headerUrlHandler.bind(this)
    this.callbackDialog = this.callbackDialog.bind(this)

    this.state = {
      // URL_DATA IF FOR HEADER COMMON PROPERTIES
      contractList:
        props.history.location.state !== undefined &&
        props.history.location.state.contractList
          ? props.history.location.state.contractList
          : [],
      customerId:
        props.history.location.state !== undefined
          ? props.history.location.state.customer_id
          : '',
      token:
        props.history.location.state !== undefined &&
        props.history.location.state.token
          ? props.history.location.state.token
          : '',
      url_data: [
        {
          callback: this.headerUrlHandler,
          pass_data: {
            customer_id:
              props.history.location.state !== undefined
                ? props.history.location.state.customer_id
                : '',
            optionConfig:
              props.history.location.state !== undefined
                ? props.history.location.state.optionConfig
                : [],
          },
          dispatch: props.dispatch,
        },
      ],
      dialogs: [
        {
          id: 0,
          type: Const.DIALOG_THREE,
          title: '',
          values: [{ text: '' }],
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
        },
      ],
    }
  }

  componentDidMount() {
    this.goTop()
    document.title = Const.TITLE_MYPAGE_USER_LIST

    // check customerId
    if (!window.customerId) {
      setConnectionCB(this.handleConnectChange)
      this.props.dispatch(dispatchGetConnections(Const.CONNECT_TYPE_MYPAGEID))
    }

    // 契約一覧取得
    this.handleConnect(Const.CONNECT_TYPE_CONTRACT_LIST)
  }

  // 通信処理
  handleConnect(type) {
    var params = {}

    switch (type) {
      case Const.CONNECT_TYPE_CONTRACT_LIST:
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      case Const.CONNECT_TYPE_CHANGE_CONTRACT:
        params = {
          customerId: this.state.customerId,
        }
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
      default:
        // json
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchPostConnections(type, params))
        break
    }
  }

  // 通信処理の結果
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      switch (type) {
        case Const.CONNECT_TYPE_CONTRACT_LIST:
          if (
            data.data &&
            data.data.contractList &&
            data.data.contractList.length
          ) {
            // contractList更新
            // token更新
            this.setState({
              contractList: data.data.contractList,
              token: data.data.token,
            })
          }
          break
        case Const.CONNECT_TYPE_CHANGE_CONTRACT:
          // トップ画面へ
          window.customerId = this.state.customerId
          this.props.history.push({
            pathname: '/mypage',
            state: { customer_id: this.state.customerId },
          })
          break
        case Const.CONNECT_TYPE_MYPAGEID:
          this.setState({ customerId: data.data.customerId })
          window.customerId = data.data.customerId
          break
      }
    } else if (status === Const.CONNECT_ERROR) {
      var dialogs_copy = [...this.state.dialogs_error]
      var values = []
      if (type === 'auth_errors') {
        dialogs_copy[0].title = data.code
        values[0] = { text: data.message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'api_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data.response.response.error_detail.error_message }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      } else if (type === 'no_body_error') {
        dialogs_copy[0].title = data.name
        values[0] = { text: data }
        dialogs_copy[0].values = values
        dialogs_copy[0].state = true
        this.setState({ dialogs_error: dialogs_copy })
      }
    }
  }

  goNextDisplay(e, url, params) {
    e.preventDefault()
    if (url === '/guide/#a8') {
      this.props.history.push({
        pathname: url,
        state: params,
      })
    } else {
      this.props.history.push({
        pathname: url,
        state: params,
      })
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
  returnPlanName(item) {
    if (item.planName) {
      return item.planName
    } else {
      if (
        (item.contractStatus == 'beforeRegistration' &&
          item.warehouseStatus == 'cancel') ||
        (item.contractStatus == 'cancel' && item.warehouseStatus == 'cancel')
      ) {
        // キャンセル
        return <span style={{ color: '#B50080' }}>お申し込みキャンセル</span>
      } else if (
        item.contractStatus == 'verified' &&
        item.warehouseStatus == 'invalidCheckEC'
      ) {
        // 申し込み内容不備
        return <span style={{ color: '#B50080' }}>お申し込み内容不備</span>
      }
    }
  }

  returnLineCount(item) {
    return item.lineCount || '-'
  }

  items(data) {
    let trs = data.map((item, key) => (
      <tr
        className={
          item.customerId === window.customerId ? 'list-contracts-selected' : ''
        }
        key={key}
      >
        <td className="list-contracts-name arrow">
          <div className="name-contents">
            <dl className="">
              <dt className="a-sp" style={{ width: '100%' }}>
                ご契約者名 :
              </dt>
              <dd
                style={{ wordBreak: 'keep-all' }}
              >{`${item.contractorLastName} ${item.contractorFirstName}`}</dd>
            </dl>
            <div className="a-sp right-contents" style={{ minWidth: '115px' }}>
              {(() => {
                if (item.customerId === window.customerId) {
                  return <span>選択中</span>
                } else if (
                  (item.contractStatus == 'beforeRegistration' &&
                    item.warehouseStatus == 'cancel') ||
                  (item.contractStatus == 'cancel' &&
                    item.warehouseStatus == 'cancel')
                ) {
                  // キャンセル
                  return (
                    <button
                      className="switching"
                      disabled
                      style={{ opacity: '0.5' }}
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 0, item)}
                    >
                      切り替え
                    </button>
                  )
                } else {
                  return (
                    <button
                      className="switching"
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 0, item)}
                    >
                      切り替え
                    </button>
                  )
                }
              })()}
            </div>
          </div>
        </td>
        <td>
          <dl>
            <dt className="a-sp">お客さまID</dt>
            <dd style={{ wordBreak: 'keep-all' }}>{item.customerId}</dd>
          </dl>
        </td>
        <td>
          <dl>
            <dt className="a-sp">プラン名</dt>
            <dd>{this.returnPlanName(item)}</dd>
          </dl>
        </td>
        <td>
          <dl>
            <dt className="a-sp">回線数</dt>
            <dd>{this.returnLineCount(item)}</dd>
          </dl>
        </td>
        <td>
          <dl>
            <dt className="a-sp">ご契約回線番号1</dt>
            <dd style={{ wordBreak: 'keep-all' }}>{item.tel}</dd>
          </dl>
        </td>
        <td className="list-contracts-status">
          <div style={{ flex: 1, width: '100%', textAlign: 'center' }}>
            {(() => {
              if (item.customerId === window.customerId) {
                return <span>選択中</span>
              } else if (
                (item.contractStatus == 'beforeRegistration' &&
                  item.warehouseStatus == 'cancel') ||
                (item.contractStatus == 'cancel' &&
                  item.warehouseStatus == 'cancel')
              ) {
                // キャンセル
                return (
                  <div style={{ display: 'flex' }}>
                    <button
                      className="switching a-pc"
                      disabled
                      style={{ opacity: '0.5' }}
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 0, item)}
                    >
                      切り替え
                    </button>
                    <button
                      className="separation"
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 1, item)}
                    >
                      分離
                    </button>
                  </div>
                )
              } else {
                return (
                  <div style={{ display: 'flex' }}>
                    <button
                      className="switching a-pc"
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 0, item)}
                    >
                      切り替え
                    </button>
                    <button
                      className="separation"
                      id=""
                      type="button"
                      onClick={(e) => this.onLogin(e, 1, item)}
                    >
                      分離
                    </button>
                  </div>
                )
              }
            })()}
          </div>
        </td>
      </tr>
    ))
    return trs
  }

  onLogin(e, type, item) {
    switch (type) {
      case 0:
        // 切り替え 確認ダイアログ表示
        e.preventDefault()
        // alert('開通する')
        var dialogs_copy = [...this.state.dialogs]
        dialogs_copy[0].title = 'SIMの開通'
        var values = []
        values[0] = {
          text: (
            <div>
              <p style={{ textAlign: 'center' }}>
                以下のご契約に表示を切り替えますか？
              </p>
              <table style={{ width: '100%', textAlign: 'left' }}>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#F7F7F7',
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                      wordBreak: 'keep-all',
                    }}
                  >
                    ご契約者名
                  </th>
                  <td
                    style={{
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >{`${item.contractorLastName} ${item.contractorFirstName}`}</td>
                </tr>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#F7F7F7',
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                      wordBreak: 'keep-all',
                    }}
                  >
                    お客さまID
                  </th>
                  <td
                    style={{
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >{`${item.customerId}`}</td>
                </tr>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#F7F7F7',
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                      wordBreak: 'keep-all',
                    }}
                  >
                    プラン名
                  </th>
                  <td
                    style={{
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >
                    {this.returnPlanName(item)}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#F7F7F7',
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >
                    回線数
                  </th>
                  <td
                    style={{
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >
                    {this.returnLineCount(item)}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{
                      backgroundColor: '#F7F7F7',
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >
                    ご契約回線番号1
                  </th>
                  <td
                    style={{
                      padding: '1rem',
                      borderWidth: '1px',
                      borderColor: '#707070',
                      borderStyle: 'solid',
                    }}
                  >{`${item.tel}`}</td>
                </tr>
              </table>
            </div>
          ),
        }
        var button = dialogs_copy[0].button
        button[1].value = '切り替える'
        dialogs_copy[0].values = values
        dialogs_copy[0].button = button
        dialogs_copy[0].state = true
        this.setState({
          customerId: item.customerId,
          dialogs: dialogs_copy,
        })
        break
      case 1:
        // 分離用画面へ遷移
        e.preventDefault()
        this.props.history.push({
          pathname: '/mypage/user/separate/',
          state: {
            item,
            token: this.state.token,
          },
        })
        break
      default:
        break
    }
  }

  callbackDialog(type, id) {
    if (type === Const.EVENT_CLICK_BUTTON) {
      switch (id) {
        case 'dialog_button_cancel': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          break
        }
        case 'dialog_button_ok': {
          var dialogs_copy = [...this.state.dialogs]
          dialogs_copy[0].state = false
          this.setState({ dialogs: dialogs_copy })
          // 操作対象契約切替API
          this.handleConnect(Const.CONNECT_TYPE_CHANGE_CONTRACT)
          break
        }
        default: {
          break
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.dialogs.map(function (data, i) {
          if (data.state === true) {
            return <Dialog {...data} key={'dialog' + i} />
          } else {
            return <React.Fragment key={'Fragment' + i} />
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
                  <h1 className="a-h1">契約一覧</h1>
                  <p>ご契約の表示切り替え、統合、分離が行えます。</p>
                  <h3 className="a-h3 a-fw-normal a-mb-10 a-pc">◎ご契約一覧</h3>
                  <div className="">
                    <table className="list-contracts-table">
                      <colgroup>
                        <col />
                        <col />
                        <col />
                      </colgroup>
                      <thead className="a-pc">
                        <tr>
                          <th>ご契約者名</th>
                          <th>お客さまID</th>
                          <th>プラン名</th>
                          <th>回線数</th>
                          <th>ご契約回線番号1</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>{this.items(this.state.contractList)}</tbody>
                    </table>
                  </div>
                  <p style={{ marginBottom: '2.5rem' }}>
                    <button
                      className="a-btn-radius-plus"
                      onClick={(e) => {
                        // 統合用画面へ遷移
                        e.preventDefault()
                        this.props.history.push({
                          pathname: '/mypage/user/integrate/',
                          state: {
                            token: this.state.token,
                          },
                        })
                      }}
                    >
                      お客さまIDを統合する
                    </button>
                  </p>
                  <p
                    style={{
                      maxWidth: '440px',
                      margin: '0 auto 2.5rem',
                    }}
                  >
                    <a
                      className="m-guide_link_box"
                      href=""
                      onClick={(e) =>
                        this.goNextDisplay(e, '/guide/', { anchorName: '#a8' })
                      }
                    >
                      お客さまIDを統合・分離する方法については
                      <span className="m-guide_emp">こちら</span>
                    </a>
                  </p>
                  <p className="m-btn">
                    <a
                      className="a-btn-dismiss"
                      onClick={() => {
                        this.props.history.push('/login')
                      }}
                    >
                      戻る
                    </a>
                  </p>
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

export default connect(mapStateToProps)(User_List)
