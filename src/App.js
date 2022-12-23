import React, { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'

import { googleAnalytics } from './lib/googleAnalytics'
import './App.css'

import {
  dispatchGetConnections,
  setConnectionCB,
} from './actions/PostActions.js'

import * as Const from './Const.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    App.PropTypes = {
      location: ReactRouterPropTypes.location.isRequired,
      history: ReactRouterPropTypes.history.isRequired,
    }
  }

  componentDidMount() {
    // loader非表示
    let loader = document.getElementById('loader')
    loader.parentNode.removeChild(loader)
    this.mounted = true

    var refinfo = document.referrer
    // 新ARS
    if (this.props.location.pathname.startsWith('/register/')) {
      return
    }
    // リロード
    if (window.performance) {
      if (performance.navigation.type == 1) {
        if (
          this.props.location.pathname !== '/login' &&
          this.props.location.pathname !== '/' &&
          this.props.location.pathname !== '/mypage' &&
          this.props.location.pathname !== '/mypage/user' &&
          this.props.location.pathname !== '/mypage/payment/change' &&
          this.props.location.pathname !== '/mypage/payment/change/cancel' &&
          this.props.location.pathname !== '/mypage/payment/change/complete' &&
          this.props.location.pathname !== '/mypage/change/plan' &&
          this.props.location.pathname !== '/error'
        ) {
          setConnectionCB(this.handleConnectChange)
          this.props.dispatch(
            dispatchGetConnections(Const.CONNECT_TYPE_MYPAGEID)
          )
        }
      }
    }
    // 直接リンク
    if (!refinfo) {
      if (
        this.props.location.pathname !== '/login' &&
        this.props.location.pathname !== '/' &&
        this.props.location.pathname !== '/mypage' &&
        this.props.location.pathname !== '/mypage/user' &&
        this.props.location.pathname !== '/mypage/mail/auth/complete' &&
        this.props.location.pathname !== '/forgot/reset' &&
        this.props.location.pathname !== '/forgot/' &&
        this.props.location.pathname !== '/error' &&
        !this.props.location.pathname.startsWith('/contact') &&
        // 一時処理のためにコメントアウト
        //  !this.props.location.pathname.startsWith("/mypage/mnp/cancel") &&
        //  !this.props.location.pathname.startsWith("/mypage/mnp/fail") &&
        //  !this.props.location.pathname.startsWith("/mypage/mnp/success") &&
        !this.props.location.pathname.startsWith('/mypage/news/detail') &&
        !this.props.location.pathname.startsWith('/mypage/payment/change') &&
        !this.props.location.pathname.startsWith(
          '/mypage/payment/change/cancel'
        ) &&
        !this.props.location.pathname.startsWith(
          '/mypage/payment/change/complete'
        ) &&
        !this.props.location.pathname.startsWith('/login/mail')
      ) {
        setConnectionCB(this.handleConnectChange)
        this.props.dispatch(dispatchGetConnections(Const.CONNECT_TYPE_MYPAGEID))
      }
    }

    this.props.history.listen((location, action) => {
      let path = location.pathname + location.search + location.hash
      setTimeout(() => {
        googleAnalytics.pageview({
          path,
          title: document.title,
        })
      }, 0)
    })
  }
  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (status === Const.CONNECT_SUCCESS) {
      this.props.history.push('/error?e=1')
      document.title = Const.TITLE_ERROR
    } else {
      this.props.history.push('/login')
    }
  }
  render() {
    return <React.Fragment />
  }
}

function mapStateToProps(state) {
  return {
    url: state.url,
    parameters: state.parameters,
    type: state.type,
  }
}

export default connect(mapStateToProps)(App)
