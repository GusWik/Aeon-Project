import React, { Component } from 'react'

class MessageArea extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: props.error,
      param: props.param,
      index: props.index,
    }
  }
  render() {
    let id
    if (
      this.state.index !== '' &&
      this.state.index !== null &&
      this.state.index !== undefined
    ) {
      id =
        this.state.param.replace(
          'simList.',
          'simList.' + this.state.index + '.'
        ) + '.message'
    } else {
      id = this.state.param + '.message'
    }
    return (
      <div
        className={`
          ${'ui_errorText'} ${
          this.state.error[this.state.param].result === 'NG' ? 'errorText' : ''
        }`}
        id={id}
        style={{
          display:
            this.state.error[this.state.param].result === 'NG'
              ? 'block'
              : 'none',
        }}
      >
        {this.state.error[this.state.param].message}
      </div>
    )
  }
}

export default MessageArea
