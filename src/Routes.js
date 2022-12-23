import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Charts from './components/Chart_line'
import $ from 'jquery'
import Login from './components/login'
import Contact from './components/contact'
import Forgot from './components/forgot'
import Forgot_Complete from './components/forgot/complete'
import Forgot_Reset from './components/forgot/reset'
import Forgot_Reset_Confirm from './components/forgot/reset/confirm'
import Forgot_Reset_Complete from './components/forgot/reset/complete'
import Guide from './components/guide'
import GuideMnp from './components/guide/mnp'
// 20200316 add
import Guide_Merge_Voice from './components/guide/merge_voice'
import Guide_2fa from './components/guide/2fa'
import Guide_Merge_Data from './components/guide/merge_data'
import Guide_Separate from './components/guide/separate'
// 20200316 add end
import Mail from './components/mail'
import MailX_auth from './components/mail/auth'
import Mail_Complete from './components/mail/auth/complete'

import Call_Usage from './components/mypage/call/usage'
import Call_History from './components/mypage/call/history'
import Campaign from './components/mypage/campaign'
import CampaignHistory from './components/mypage/campaign/history'
import Mnp from './components/mypage/mnp'
import MnpDetail from './components/mypage/mnp/detail'
// 一時処理のためにコメントアウト
// import Mnp_cancel from "./components/mypage/mnp/cancel";
// import Mnp_fail from "./components/mypage/mnp/fail";
import Mnp_success from './components/mypage/mnp/success'
import News from './components/mypage/news'
import News_Detail from './components/mypage/news/detail'
import Notice from './components/mypage/notice'
import Notice_Change from './components/mypage/notice/change'
import Notice_Complete from './components/mypage/notice/complete'
import Operate from './components/mypage/operate'
import Operate_Password from './components/mypage/operate/password'
import Operate_Password_Complete from './components/mypage/operate/password/complete'
import Operate_Password_Confirm from './components/mypage/operate/password/confirm'
import Option from './components/mypage/option'
import Option_Voip from './components/mypage/option/Voip'
import Option_Service from './components/mypage/option/service'
import Payment_Change from './components/mypage/payment/change'
import Payment_Change_Cancel from './components/mypage/payment/change/cancel'
import Payment_Change_Complete from './components/mypage/payment/change/complete'
import Plan from './components/mypage/plan'
import Plan_complete from './components/mypage/plan/complete'
import Plan_change from './components/mypage/plan/change'
import Plan_change_complete from './components/mypage/plan/change/complete'
import Plan_History from './components/mypage/plan/history'

import Plan_edit from './components/mypage/plan/edit'
import Plan_edit_complete from './components/mypage/plan/edit/complete'

import Sim from './components/mypage/sim'
import Sim_Change from './components/mypage/sim/change/'
import Sim_User from './components/mypage/sim/user/'
import Sim_Reissue from './components/mypage/sim/reissue/index'
import Sim_Reissue_Select from './components/mypage/sim/reissue/select'
import Sim_Reissue_Confirm from './components/mypage/sim/reissue/confirm'
import Sim_Options from './components/mypage/sim/options/'
import Sim_Options_Step2 from './components/mypage/sim/options/step2'
import Sim_Options_Confirm from './components/mypage/sim/options/confirm'

//import Test from './components/mypage/test'

import Speed from './components/mypage/speed'
import Speed_complete from './components/mypage/speed/complete'
import Speed_change from './components/mypage/speed/change/'

//5G
import Communication_change from './components/mypage/communication/change/'
import Communication_change_confirm from './components/mypage/communication/change/confirm'

import Usage from './components/mypage/usage'
import Usage_Notice_202204 from './components/mypage/usage/notice_202204'
import Used from './components/mypage/used'
import User from './components/mypage/user'
import User_Ga from './components/mypage/user/ga'
import User_Integrate from './components/mypage/user/integrate'
import User_Integrate_Complete from './components/mypage/user/integrate/complete'
import User_List from './components/mypage/user/list'
import User_Select from './components/mypage/user/select'
import User_Separate from './components/mypage/user/separate'
import User_Separate_Complete from './components/mypage/user/separate/complete'
// 20220110 add
import User_Cancellation_Procedure from './components/mypage/user/cancellation/procedure'
import User_Cancellation_Procedure_Complete from './components/mypage/user/cancellation/procedure/complete'

// 20220817 add
import CampaignTicketAdd from './components/mypage/campaign/add/index'
import CampaignTicketComplete from './components/mypage/campaign/add/complete'
import CampaignTicketPrint from './components/mypage/campaign/print'

import Mypage from './components/mypage'

import Mailx from './components/mypage/mail'
import Mail_auth from './components/mypage/mail/auth'
import Mail_auth_complete from './components/mypage/mail/auth/complete'
import Mail_Integrate_Complete from './components/mypage/mail/integrate/complete'

import Change_Name from './components/mypage/change/name/index'
import Change_Name_Step2 from './components/mypage/change/name/step2'
import Change_Name_Confirm from './components/mypage/change/name/confirm'

import Change_Transfer from './components/mypage/change/transfer/index'
import Change_Transfer_Step2 from './components/mypage/change/transfer/step2'
import Change_Transfer_Confirm from './components/mypage/change/transfer/confirm'

import Change_Inherit from './components/mypage/change/inherit/index'
import Change_Inherit_Step2 from './components/mypage/change/inherit/step2'
import Change_Inherit_Confirm from './components/mypage/change/inherit/confirm'

import Login_Mail from './components/login/mail/index'

import Error_page from './components/error/index'

import AllLoading from './components/AllLoading'

import App from './App'

export class Routes extends Component {
  constructor(props) {
    super(props)
    let isStg = window.location.hostname == 'mypage-stg.aeon.jusco.co.jp'
    this.state = {
      isStg: isStg,
      isExist: [true, true],
    }
    this.isExistStatus = this.isExistStatus.bind(this)
  }
  componentDidMount() {
    $('#t-modal_overlay').click(function () {
      $('#commonErrorModal').removeClass('is-active')
      $('#t-modal_content').removeClass('is-active')
    })
  }
  isExistStatus(type, flg, code) {
    if (type === 'get') {
      if (code === 'E99908') {
        return this.state.isExist[0]
      } else if (code === 'E99902') {
        return this.state.isExist[1]
      } else {
        return this.state.isExist[0] && this.state.isExist[1]
      }
    } else {
      let isExist = this.state.isExist
      if (code === 'E99908') {
        isExist[0] = flg
      } else {
        isExist[1] = flg
      }
      this.setState({ isExist })
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          {this.state.isStg ? (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '24px',
                backgroundColor: 'yellow',
                zIndex: 9999,
              }}
            >
              開発
            </div>
          ) : null}
          <Route component={App} />
          <Route component={AllLoading} />
          <div id="commonErrorModal">
            <div id="t-modal_overlay" />
            <div id="t-modal_content">
              <div className="m-modal">
                <div className="m-modal_inner">
                  <h2 className="a-h3">エラー</h2>
                  <p id="t-modal-errorMessage" />
                  <p className="m-btn">
                    <button
                      className="a-btn-dismiss"
                      type="button"
                      onClick={(e) => {
                        $('#commonErrorModal').removeClass('is-active')
                        $('#t-modal_content').removeClass('is-active')
                      }}
                    >
                      閉じる
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Switch>
            <Route
              exact
              path="/charts"
              render={(props) => (
                <Charts {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/index.html"
              render={(props) => (
                <Login {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/"
              render={(props) => (
                <Mypage {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/login"
              render={(props) => (
                <Login {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/login/mail"
              render={(props) => (
                <Login_Mail {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/contact"
              render={(props) => (
                <Contact {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/forgot"
              render={(props) => (
                <Forgot {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/forgot/complete"
              render={(props) => (
                <Forgot_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/forgot/reset"
              render={(props) => (
                <Forgot_Reset {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/forgot/reset/confirm"
              render={(props) => (
                <Forgot_Reset_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/forgot/reset/complete"
              render={(props) => (
                <Forgot_Reset_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/guide"
              render={(props) => (
                <Guide {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/guide/mnp"
              render={(props) => (
                <GuideMnp {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            {/* add 20200316 */}
            <Route
              exact
              path="/guide/merge_voice"
              render={(props) => (
                <Guide_Merge_Voice
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/guide/2fa"
              render={(props) => (
                <Guide_2fa {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/guide/merge_data"
              render={(props) => (
                <Guide_Merge_Data
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/guide/separate"
              render={(props) => (
                <Guide_Separate {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            {/* add 20200316 end */}
            <Route
              exact
              path="/mail"
              render={(props) => (
                <Mail {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mail/auth"
              render={(props) => (
                <MailX_auth {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mail/auth/complete"
              render={(props) => (
                <Mail_Complete {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/mail/integrate/complete"
              render={(props) => (
                <Mail_Integrate_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/call/usage"
              render={(props) => (
                <Call_Usage {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/call/history"
              render={(props) => (
                <Call_History {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/campaign"
              render={(props) => (
                <Campaign {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/campaign/history"
              render={(props) => (
                <CampaignHistory
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/campaign/add"
              render={(props) => (
                <CampaignTicketAdd
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/campaign/add/complete"
              render={(props) => (
                <CampaignTicketComplete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/campaign/print"
              render={(props) => (
                <CampaignTicketPrint
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/mnp"
              render={(props) => (
                <Mnp {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/mnp/detail"
              render={(props) => (
                <MnpDetail {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            {/* <Route exact path="/mypage/mnp/cancel"                      component={Mnp_cancel}/> // 一時処理のためにコメントアウト
                    <Route exact path="/mypage/mnp/fail"                        component={Mnp_fail}/> */}
            <Route
              exact
              path="/mypage/mnp/success"
              render={(props) => (
                <Mnp_success {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/news"
              render={(props) => (
                <News {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/news/detail/:noticeId"
              render={(props) => (
                <News_Detail {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/notice"
              render={(props) => (
                <Notice {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/notice/change"
              render={(props) => (
                <Notice_Change {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/notice/complete"
              render={(props) => (
                <Notice_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/operate"
              render={(props) => (
                <Operate {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/operate/password"
              render={(props) => (
                <Operate_Password
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/operate/password/complete"
              render={(props) => (
                <Operate_Password_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/operate/password/confirm"
              render={(props) => (
                <Operate_Password_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/option"
              render={(props) => (
                <Option {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/option/voip"
              render={(props) => (
                <Option_Voip {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/option/service"
              render={(props) => (
                <Option_Service {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/payment/change"
              render={(props) => (
                <Payment_Change {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/payment/change/cancel"
              render={(props) => (
                <Payment_Change_Cancel
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/payment/change/complete"
              render={(props) => (
                <Payment_Change_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/plan"
              render={(props) => (
                <Plan {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/plan/complete"
              render={(props) => (
                <Plan_complete {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/plan/change"
              render={(props) => (
                <Plan_change {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/plan/change/complete"
              render={(props) => (
                <Plan_change_complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/plan/history"
              render={(props) => (
                <Plan_History {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/plan/edit"
              render={(props) => (
                <Plan_edit {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/plan/edit/complete"
              render={(props) => (
                <Plan_edit_complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/sim"
              render={(props) => (
                <Sim {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/sim/change"
              render={(props) => (
                <Sim_Change {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/sim/user"
              render={(props) => (
                <Sim_User {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/sim/reissue"
              render={(props) => (
                <Sim_Reissue {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/sim/reissue/select"
              render={(props) => (
                <Sim_Reissue_Select
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/sim/reissue/confirm"
              render={(props) => (
                <Sim_Reissue_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/sim/options"
              render={(props) => (
                <Sim_Options {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/sim/options/step2"
              render={(props) => (
                <Sim_Options_Step2
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/sim/options/confirm"
              render={(props) => (
                <Sim_Options_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            {/* <Route
              exact
              path="/mypage/test"
              render={(props) => (
                <Test {...props} isExistStatus={this.isExistStatus} />
              )}
            /> */}
            <Route
              exact
              path="/mypage/speed"
              render={(props) => (
                <Speed {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/speed/complete"
              render={(props) => (
                <Speed_complete {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/speed/change"
              render={(props) => (
                <Speed_change {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            {/* 5G */}
            <Route
              exact
              path="/mypage/communication/change"
              render={(props) => (
                <Communication_change
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/communication/change/confirm"
              render={(props) => (
                <Communication_change_confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/usage"
              render={(props) => (
                <Usage {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/usage/notice_202204"
              render={(props) => (
                <Usage_Notice_202204
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/used"
              render={(props) => (
                <Used {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user"
              render={(props) => (
                <User {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/ga"
              render={(props) => (
                <User_Ga {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/integrate"
              render={(props) => (
                <User_Integrate {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/integrate/complete"
              render={(props) => (
                <User_Integrate_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/user/list"
              render={(props) => (
                <User_List {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/select"
              render={(props) => (
                <User_Select {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/separate"
              render={(props) => (
                <User_Separate {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/user/separate/complete"
              render={(props) => (
                <User_Separate_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/user/cancellation/procedure"
              render={(props) => (
                <User_Cancellation_Procedure
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/user/cancellation/procedure/complete"
              render={(props) => (
                <User_Cancellation_Procedure_Complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage"
              render={(props) => (
                <Mypage {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/mail"
              render={(props) => (
                <Mailx {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/mail/auth"
              render={(props) => (
                <Mail_auth {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/mail/auth/complete"
              render={(props) => (
                <Mail_auth_complete
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/name"
              render={(props) => (
                <Change_Name {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/change/name/step2"
              render={(props) => (
                <Change_Name_Step2
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/name/confirm"
              render={(props) => (
                <Change_Name_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/transfer"
              render={(props) => (
                <Change_Transfer
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/transfer/step2"
              render={(props) => (
                <Change_Transfer_Step2
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/transfer/confirm"
              render={(props) => (
                <Change_Transfer_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/inherit"
              render={(props) => (
                <Change_Inherit {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route
              exact
              path="/mypage/change/inherit/step2"
              render={(props) => (
                <Change_Inherit_Step2
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/mypage/change/inherit/confirm"
              render={(props) => (
                <Change_Inherit_Confirm
                  {...props}
                  isExistStatus={this.isExistStatus}
                />
              )}
            />
            <Route
              exact
              path="/error"
              render={(props) => (
                <Error_page {...props} isExistStatus={this.isExistStatus} />
              )}
            />
            <Route component={Error_page} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default Routes
