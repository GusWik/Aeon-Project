import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as Const from '../Const.js'
import Button from './Button.js'
import $ from 'jquery'

/**
 * ダイアログ表示用のコンポーネント.
 */
class Dialog extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleClickBtn = this.handleClickBtn.bind(this)
    //                              <p>{/*<img src="/asset/img/pic_id_01.png" alt="">*/}</p>
    //                            <p>お申し込み完了通知書をご参照の上、ご入力ください。</p>
    //                          <p>お申し込み完了通知書を無くしてしまったお客さまは、<span className="a-primary">イオンモバイルお客さまセンターへ</span>お問い合わせください。お問い合わせは<a href="#modal_customer" >こちら</a>。</p>,
    //{/*<img src="/asset/img/pic_id_01.png" alt="">*/}
    //入力情報設定
    if (props.type < 100) {
      this.state = {
        id: props.id,
        type: props.type,
        title: props.title,
        body: props.body,
        remarks: props.remarks !== undefined ? props.remarks : '',
        button: props.button,
        callback: props.callback,
        values: props.values,
        otherTitle: props.otherTitle,
        others: props.others,
        state: false,
        base_w: 0,
        base_h: 0,
        cover_id: 'dialog_' + props.id,
        cover_l: 0,
        cover_t: 0,
        interval: null,
      }
    } else {
      if (props.type === Const.DIALOG_GENERIC_ERROR) {
        var button = props.button
        if (button === null) {
          button = [
            {
              id: Const.DIALOG_GENERIC_ERROR_BUTTON,
              value: '戻る',
              classname: 'buttonshape buttondialog buttongray',
              disabled: false,
              state: true,
              callback: props.callback,
              interval: null,
            },
          ]
        }
        //console.log(props);
        this.state = {
          id: props.id,
          type: props.type,
          title:
            props.title !== null &&
            props.title !== undefined &&
            props.title !== '' &&
            isNaN(props.title)
              ? props.title
              : 'エラー',
          values: props.values,
          remarks: props.remarks !== undefined ? props.remarks : '',
          button: button,
          callback: props.callback,
          state: false,
          base_w: 0,
          base_h: 0,
          cover_id: 'dialog_' + props.id,
          cover_l: 0,
          cover_t: 0,
          interval: null,
        }
      }
    }
  }

  //ウィンドウの幅高を取得する
  getWindowSize() {
    var w = window
    var d = document
    var e = d.documentElement
    var g = d.getElementsByTagName('body')[0]
    var width = w.innerWidth || e.clientWidth || g.clientWidth
    var height = w.innerHeight || e.clientHeight || g.clientHeight
    return {
      w: width,
      h: height,
    }
  }

  //ダイアログの幅高を取得する
  getDialogSize() {
    var d = document.getElementById(this.state.cover_id)
    var r = d.getBoundingClientRect()
    var w = r.width
    var h = r.height
    //console.log("cover :: " + w + " :: " + h);
    return {
      w: w,
      h: h,
    }
  }

  //コンポーネントが画面に配置されたときに実行されるイベント
  componentDidMount() {
    var size = this.getWindowSize()

    var size_w = parseInt(size.w + 1, 10)
    size_w += size_w % 2

    var size_h = parseInt(size.h + 1, 10)
    size_h += size_h % 2

    this.setState({ base_w: size_w })
    this.setState({ base_h: size_h })

    var interval = setInterval(() => {
      var size = this.getWindowSize()
      var size_w = parseInt(size.w + 1, 10)
      size_w += size_w % 2
      var size_h = parseInt(size.h + 1, 10)
      size_h += size_h % 2

      var base = this.getDialogSize()
      var base_w = parseInt(base.w + 1, 10)
      base_w += base_w % 2
      var base_h = parseInt(base.h + 1, 10)
      base_h += base_h % 2

      this.setState({ base_w: size_w })
      this.setState({ base_h: size_h })

      this.setState({ cover_l: size_w / 2.0 - base_w / 2.0 })
      this.setState({ cover_t: size_h / 2.0 - base_h / 2.0 })

      //console.log("cover :: " + this.state.cover_l + " :: " + this.state.cover_t);

      this.setState({ state: true })
    }, 100)
    this.setState({ interval: interval })

    $('.t-modal_overlay').click(function () {
      //$('.t-modal').removeClass("is-active");
      //  $('.t-modal_content').removeClass("is-active");
    })
  }

  //コンポーネントが画面から削除されるときに実行されるイベント
  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  // ボタン押下時のイベントハンドラ
  handleClickBtn(event, button_num, id) {
    this.state.callback(Const.EVENT_CLICK_BUTTON, id, button_num)
  }

  //画面描画
  render() {
    var baseStyle = {
      visibility: this.state.state === true ? 'visible' : 'hidden',
      width: this.state.base_w,
      height: this.state.base_h,
    }
    var coverStyle = {
      left: this.state.cover_l,
      top: this.state.cover_t,
    }

    return (
      <React.Fragment>
        {(() => {
          if (this.state.type !== Const.DIALOG_THREE) {
            if (this.state.type === Const.DIALOG_GENERIC_ERROR) {
              return (
                <div id={this.state.cover_id} className="t-modal is-active">
                  <div
                    className="t-modal_overlay"
                    id="modal_overlay"
                    onClick={(e) =>
                      this.handleClickBtn(
                        Const.EVENT_CLICK_BUTTON,
                        '',
                        'modal_overlay'
                      )
                    }
                  ></div>
                  <div
                    className="t-modal_content is-active"
                    id="modal_id"
                    style={{
                      top: '50%',
                      transform: 'translate(-50%,-50%)',
                      position: 'fixed',
                    }}
                  >
                    <div className="m-modal">
                      <div className="m-modal_inner">
                        <h2 className="a-h3">{this.state.title}</h2>
                        {this.state.values.map(function (m, i) {
                          return <div key={'values_' + i}>{m.text}</div>
                        })}
                        <br />
                        <div className="m-btn">
                          <Button
                            {...this.state.button[0]}
                            key={this.state.button[0].id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div id={this.state.cover_id} className="t-modal is-active">
                  <div
                    className="t-modal_overlay"
                    id="modal_overlay"
                    onClick={(e) =>
                      this.handleClickBtn(
                        Const.EVENT_CLICK_BUTTON,
                        '',
                        'modal_overlay'
                      )
                    }
                  ></div>
                  <div
                    className="t-modal_content is-active"
                    id="modal_id"
                    style={{ top: '25px' }}
                  >
                    <div className="m-modal">
                      <div className="m-modal_inner">
                        <h2 className="a-h3">{this.state.title}</h2>
                        {this.state.values.map(function (m, i) {
                          return <div key={'values_' + i}>{m.text}</div>
                        })}
                        <div className="m-btn">
                          <Button
                            {...this.state.button[0]}
                            key={this.state.button[0].id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="t-modal_content"
                    id="modal_customer"
                    style={{
                      top: '50%',
                      left: '50%',
                      position: 'fixed',
                      transform: 'translate(-50%,-50%)',
                    }}
                  >
                    <div className="m-customer">
                      <h2 className="m-customer_ttl a-h3">
                        {this.state.otherTitle}
                      </h2>
                      {this.state.others.map(function (m, i) {
                        return <div key={'others_' + i}>{m.text}</div>
                      })}
                    </div>
                  </div>
                </div>
              )
            }
          } else {
            return (
              <div id={this.state.cover_id} className="t-modal is-active">
                <div
                  className="t-modal_overlay"
                  onClick={(e) =>
                    this.handleClickBtn(
                      Const.EVENT_CLICK_BUTTON,
                      '',
                      't-modal_overlay'
                    )
                  }
                ></div>
                <div
                  className="t-modal_content is-active"
                  id="modal_mail"
                  style={{
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    position: 'fixed',
                  }}
                >
                  <div className="m-modal">
                    <div className="m-modal_inner">
                      <div
                        className="m-modal_attentionx"
                        style={{ textAlign: 'center' }}
                      >
                        {this.state.values.map(function (m, i) {
                          return (
                            <h2 className="a-h3" key={'values_' + i}>
                              {m.text}
                            </h2>
                          )
                        }, this)}
                      </div>
                      <div className="m-modal_btngroup">
                        <div className="m-modal_btngroup_item m-btn">
                          <Button
                            {...this.state.button[0]}
                            key={this.state.button[0].id}
                          />
                        </div>
                        <div className="m-modal_btngroup_item m-btn">
                          <Button
                            {...this.state.button[1]}
                            key={this.state.button[1].id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        })()}
      </React.Fragment>
    )
  }
}

//Dialogクラスに対する引数
Dialog.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  button: PropTypes.array,
  callback: PropTypes.func.isRequired,
  state: PropTypes.bool.isRequired,
}

export default Dialog
