import React, { Component } from 'react'

class SelectList extends Component {
  constructor(props) {
    super(props)
    let selected = ''
    if (props.selected) {
      selected = props.selected
    } else if (props.options[0] && props.options[0].value) {
      selected = props.options[0].value
    }
    this.state = {
      disabled: props.disabled,
      type: props.type,
      id: props.id || '',
      options: props.options,
      selected: selected,
      onChange: props.onChange,
      layoutType: props.layoutType,
    }
  }
  static getDerivedStateFromProps(props, state) {
    // 更新
    if (props) {
      return props
    }
  }
  render() {
    let maxLength = 0
    if (this.state.layoutType === 'planServiceId') {
      this.state.options.map((item) => {
        if (item.text.indexOf('　') !== -1) {
          let text = item.text.split('　')
          let length = text[0].length
          if (maxLength < length) {
            maxLength = length
          }
        }
      })
    }
    let selects = this.state.options.map((item) => {
      let _class = null
      let simSizeText = null
      switch (this.state.layoutType) {
        case 'simType':
          _class = `selectItem simType-${item.key}`
          break
        case 'simSize':
          _class = `selectItem simSize-${item.key}`
          if (item.key == '01') {
            simSizeText = `(タテ：25㎜　ヨコ：15㎜)`
          } else if (item.key == '02') {
            simSizeText = `(タテ：15.0㎜　ヨコ：12.0㎜)`
          } else if (item.key == '03') {
            simSizeText = `(タテ：12.3㎜　ヨコ：8.8㎜)`
          } else if (item.key == '04') {
            simSizeText = `全てのサイズに対応できるSIMカードです。 ご利用の端末に合わせて、お客さまご自身で切り離してご利用ください。`
          }
          break
        default:
          _class = `selectItem`
          break
      }

      if (item.value === this.state.selected) {
        _class = _class + ` active`
      }

      if (item.note) {
        return (
          <div className="selectItemNotes">
            <div
              className={_class}
              onClick={(e) => {
                if (this.state.disabled) {
                  return
                }
                this.setState({ selected: item.value })
                this.props.onChange(item)
              }}
              style={{
                opacity: this.state.disabled ? '0.6' : '1.0',
              }}
            >
              {(() => {
                if (this.state.layoutType === 'simSize') {
                  return (
                    <span>
                      {item.text}
                      <br />
                      <small>{simSizeText}</small>
                    </span>
                  )
                } else if (this.state.layoutType === 'planServiceId') {
                  if (item.text.indexOf('　') !== -1) {
                    let text = item.text.split('　')
                    return (
                      <div className="selectPlanList">
                        <span className="planServiceName">{text[0]}</span>
                        <span className="price">{text[1]}</span>
                      </div>
                    )
                  }
                  return (
                    <span>
                      {item.text}
                      <br />
                      <small>{simSizeText}</small>
                    </span>
                  )
                } else {
                  return item.text
                }
              })()}
            </div>
            <span style={item.note.style}>{item.note.text}</span>
          </div>
        )
      }

      return (
        <div
          className={_class}
          onClick={(e) => {
            if (this.state.disabled) {
              return
            }
            this.setState({ selected: item.value })
            this.props.onChange(item)
          }}
          style={{
            opacity: this.state.disabled ? '0.6' : '1.0',
          }}
        >
          {(() => {
            if (this.state.layoutType === 'simSize') {
              return (
                <span>
                  {item.text}
                  <br />
                  <small>{simSizeText}</small>
                </span>
              )
            } else if (this.state.layoutType === 'planServiceId') {
              if (item.text.indexOf('　') !== -1) {
                let text = item.text.split('　')
                return (
                  <div className="selectPlanList">
                    <span className="planServiceName">{text[0]}</span>
                    <span className="price">{text[1]}</span>
                  </div>
                )
              }
              return (
                <span>
                  {item.text}
                  <br />
                  <small>{simSizeText}</small>
                </span>
              )
            } else {
              return item.text
            }
          })()}
        </div>
      )
    })

    let columnClass = 'selectListWrapper'
    switch (this.state.type) {
      case 4:
        columnClass = `selectListWrapper column-4`
        break
      case 3:
        columnClass = `selectListWrapper column-3`
        break
      case 2:
        columnClass = `selectListWrapper column-2`
        break
      case 1:
        columnClass = 'selectListWrapper column-0'
        break
      default:
        columnClass = 'selectListWrapper'
        break
    }

    return (
      <div id={this.state.id} className={columnClass}>
        {selects}
      </div>
    )
  }
}

export default SelectList
