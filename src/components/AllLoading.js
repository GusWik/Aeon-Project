import React from 'react'
import { connect } from 'react-redux'
import $ from 'jquery'

//css
import './assets/css/common.css'

import ComponentBase from './ComponentBase'

import Loading from '../modules/Loading.js'
class AllLoading extends ComponentBase {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    $('.loading').hide()
  }

  render() {
    return (
      <React.Fragment>
        <Loading loading_state={true} key="loading" />
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

export default connect(mapStateToProps)(AllLoading)
