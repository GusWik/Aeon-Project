import React, { Component } from 'react'
import PropTypes from 'prop-types'

//定数定義読み込み
import * as Const from '../Const.js'

class Pager extends Component {
  //コンストラクタ
  constructor(props) {
    super(props)

    //各コールバック関数を登録
    this.handleClickBtn = this.handleClickBtn.bind(this)

    //入力情報設定
    this.state = {
      allPageNum: props.allPageNum,
      nowPageNo: props.nowPageNo,
      callback: props.callback,
    }
  }
  //クリックされたとき
  handleClickBtn(page) {
    this.state.callback(page)
  }

  pagePrevious() {
    var now_page_id = parseInt(this.props.nowPageNo)
    var prev_now_page_id = now_page_id - 1

    if (1 < now_page_id) {
      this.state.callback(prev_now_page_id)
    }
  }

  pageNext() {
    var now_page_id = parseInt(this.props.nowPageNo)
    var next_now_page_id = now_page_id + 1

    if (this.props.allPageNum >= next_now_page_id) {
      this.state.callback(next_now_page_id)
    }
  }

  //画面描画
  render() {
    var pagination = []
    var isleft = true
    var isright = true
    if (this.props.nowPageNo !== 0) {
      if (!(0 < this.props.allPageNum)) {
        return false
      }

      if (this.props.allPageNum < 5) {
        var check = false

        for (var i = 1; i <= this.props.allPageNum; i++) {
          pagination[pagination.length] = {
            page: 0,
            is_actve: false,
            cb: this.handleClickBtn,
          }

          if (this.props.nowPageNo <= 4) {
            pagination[pagination.length - 1].page = i
            if (i === this.props.nowPageNo) {
              pagination[pagination.length - 1].is_active = true
            }
            check = true
          } else if (this.props.allPageNum - 2 <= this.props.nowPageNo) {
            check = true
          }
        }

        if (!check) {
          //現在のページを真ん中にする //Make the current page in the middle
          pagination[0].page = this.props.nowPageNo - 2
          pagination[1].page = this.props.nowPageNo - 1
          pagination[2].page = this.props.nowPageNo
          pagination[2].is_active = true
          pagination[3].page = this.props.nowPageNo + 1
          pagination[4].page = this.props.nowPageNo + 2
        } else if (this.props.allPageNum - 2 <= this.props.nowPageNo) {
          //最後のページが表示されている場合の処理  //Processing when the last page is displayed
          //4=5ページ分-1                        // 4 = 5 pages min -1
          // for(var i = (pagination.length - 1) ; i > -1; i--){
          //     pagination[i].page = this.props.allPageNum - (5 - (i + 1));
          //     if((this.props.allPageNum - (5 - (i + 1))) === this.props.nowPageNo){
          //         pagination[i].is_active = true;
          //      }
          // }
        }

        //disable <> when less than 5 pgs
        // if(this.props.allPageNum<5){
        //     isleft=false;
        //     isright=true;
        //         if(this.props.nowPageNo==this.props.allPageNum){
        //             isright=false;
        //         }
        //         if(this.props.nowPageNo > 1){
        //             isleft=true;
        //         }
        // }

        if (this.props.nowPageNo === 1) {
          isleft = false
        }
        if (this.props.nowPageNo === this.props.allPageNum) {
          isright = false
        }
      } else {
        var check = false
        //最後のページが表示されている場合の処理
        for (var i = 1; i <= 5; i++) {
          pagination[pagination.length] = {
            page: 0,
            is_actve: false,
            cb: this.handleClickBtn,
          }

          if (this.props.nowPageNo < 3) {
            pagination[pagination.length - 1].page = i
            if (i === this.props.nowPageNo) {
              pagination[pagination.length - 1].is_active = true
            }
            check = true
          } else if (this.props.allPageNum - 2 <= this.props.nowPageNo) {
            check = true
          }
        }

        if (!check) {
          //現在のページを真ん中にする //Make the current page in the middle
          pagination[0].page = this.props.nowPageNo - 2
          pagination[1].page = this.props.nowPageNo - 1
          pagination[2].page = this.props.nowPageNo
          pagination[2].is_active = true
          pagination[3].page = this.props.nowPageNo + 1
          pagination[4].page = this.props.nowPageNo + 2
        } else if (this.props.allPageNum - 2 <= this.props.nowPageNo) {
          //最後のページが表示されている場合の処理  //Processing when the last page is displayed
          //4=5ページ分-1                        // 4 = 5 pages min -1
          for (var i = pagination.length - 1; i > -1; i--) {
            pagination[i].page = this.props.allPageNum - (5 - (i + 1))
            if (
              this.props.allPageNum - (5 - (i + 1)) ===
              this.props.nowPageNo
            ) {
              pagination[i].is_active = true
            }
          }
        }

        if (this.props.nowPageNo === 1) {
          isleft = false
        }
        if (this.props.nowPageNo === this.props.allPageNum) {
          isright = false
        }
      }

      console.log('this.props.nowPageNo :: ', this.props.nowPageNo)
      console.log('this.props.allPageNum :: ', this.props.allPageNum)
    }

    var leftStyle = {
      display: isleft === true ? 'block' : 'none',
    }
    var rightStyle = {
      display: isright === true ? 'block' : 'none',
    }

    return (
      <React.Fragment>
        <ul className="m-pagination">
          <li className="m-pagination_item">
            <a
              className="m-pagination_prev"
              href="javascript:void(0);"
              id="page_prv"
              style={leftStyle}
              onClick={() => this.pagePrevious()}
            >
              <span>前へ</span>
            </a>
          </li>
          {pagination.map(function (m, i) {
            return (
              <li className="m-pagination_item" key={'page_' + i}>
                <a
                  className={
                    'm-pagination_link track_page' +
                    (m.is_active === true ? ' is-active' : '')
                  }
                  href="javascript:void(0);"
                  id={'page_' + m.page}
                  onClick={() => m.cb(m.page)}
                >
                  {m.page}
                </a>
              </li>
            )
          })}
          <li className="m-pagination_item">
            <a
              className="m-pagination_next track_page"
              href="javascript:void(0);"
              id="page_next"
              style={rightStyle}
              onClick={() => this.pageNext()}
            >
              <span>次へ</span>
            </a>
          </li>
        </ul>
      </React.Fragment>
    )
  }
}

Pager.propTypes = {
  allPageNum: PropTypes.number,
  nowPageNo: PropTypes.number.isRequired,
  callback: PropTypes.func.isRequired,
}

export default Pager
