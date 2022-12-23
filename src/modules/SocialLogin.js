import React, { Component } from 'react'

import { dispatchGetConnections } from '../actions/PostActions.js'
import { setConnectionCB } from '../actions/PostActions.js'

export default class SocialLogin extends Component {
  constructor(props) {
    super(props)
    this.handleConnect = this.handleConnect.bind(this)
    this.handleConnectChange = this.handleConnectChange.bind(this)

    this.state = {
      api_data: [],
      callback: this.props.callback,
    }
  }

  handleConnect(type) {
    //setConnectionCB(this.handleConnectChange);
    //this.props.dispatch(dispatchGetConnections(type));
    let base = location.protocol + '//' + location.host
    if (location.port != 443 && location.port != 80) {
      base += ':' + location.port
    }
    window.open(base + type, '_self')
  }

  handleConnectChange(type, data, status, token) {
    if (token) this.setState({ token })
    if (data) {
      console.log(data)
    }
  }

  render() {
    return <div></div>
  }
}
