import React, { Component } from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
//import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import ImageEditor from '../../lib/ImageEditor'
import IconDelete from '../../modules/images/icon_delete.svg'
import IconRectangle from '../../modules/images/icon_shape_rectangle.svg'
import IconHelp from '../../modules/images/icon_q.png'
import imgHoken01 from '../../modules/images/hoken_01.png'
import imgHoken02 from '../../modules/images/hoken_02.png'

const myTheme = {
  'common.backgroundColor': '#F5F5F2',
}

class ImageEditWindow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeObject: null,
      width: 0,
      height: 0,
      selectedImageSize: null,
      exampleModal: false,
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.editorRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedImageSize !== prevProps.selectedImageSize ||
      this.state.selectedImageSize == null
    ) {
      this.setState({ selectedImageSize: this.props.selectedImageSize })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions)
    this.updateWindowDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  render() {
    console.log(this.props)
    var _this = this
    return (
      <div className="ulModal imageEditWindow">
        <div className="ulModal_main">
          <div className="ulModal_header">
            <h1
              id="simTableHeading"
              className="heading"
              style={{ marginBottom: '4px', fontSize: '18px' }}
            >
              画像の編集
            </h1>
            <p
              className="caption"
              style={{ marginBottom: '14px', fontSize: '14px' }}
            >
              健康保険被保険者証をご選択の場合は、記載の保険者番号、記号・番号・二次元コードをマスクしてください。
              <br />
              <span style={{ color: '#ba0080' }}>
                ※左下の■部分をクリックし、表示された■をドラッグして該当部分をマスキングしてください。
              </span>
            </p>
            <p
              className="noteText"
              style={{
                display: 'table',
                marginBottom: '0',
                paddingLeft: '0',
                textIndent: '0',
              }}
            >
              <a
                href={() => false}
                onClick={() => {
                  this.setState({ exampleModal: true })
                }}
                style={{
                  color: '#ba0080',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'table-cell',
                  textDecoration: 'underline',
                }}
              >
                マスクする場所についてはこちら
              </a>
              <img
                src={IconHelp}
                style={{ display: 'table-cell' }}
                alt="help"
                width="16"
              />
            </p>
          </div>
          <div className="ulModal_content" style={{ flex: '1 1 auto' }}>
            {(() => {
              console.log(`selectedImageSize: ${_this.state.selectedImageSize}`)
              if (_this.state.selectedImageSize) {
                return (
                  <ImageEditor
                    ref={_this.editorRef}
                    includeUI={{
                      loadImage: {
                        path: _this.props.selectedImageData,
                        name: 'selectedImage',
                      },
                      theme: myTheme,
                      menu: ['shape'],
                      uiSize: {
                        width: '100%',
                        height: '100%',
                      },
                    }}
                    cssMaxHeight={_this.state.height * 0.4}
                    cssMaxWidth={_this.state.width * 0.8}
                    onObjectActivated={(props) => {
                      _this.setState({ activeObject: props })
                    }}
                    selectionStyle={{
                      cornerColor: '#B50080',
                      cornerSize: _this.state.selectedImageSize
                        ? _this.state.selectedImageSize.width * 0.05
                        : 20,
                      rotatingPointOffset: this.state.selectedImageSize
                        ? _this.state.selectedImageSize.width * 0.1
                        : 70,
                    }}
                    usageStatistics
                  />
                )
              }
            })()}
          </div>
          <div
            className="ulModal_actions adjust"
            style={{
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
            }}
          >
            <div className="imageEditWindowButtonArea">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className="imageEditWindowButtonArea_btn"
                  onClick={() => {
                    try {
                      this.editorRef.current.getInstance().removeActiveObject()
                    } catch (e) {}
                  }}
                >
                  {/* <IconDelete /> */}
                  <img src={IconDelete} />
                </button>
                <button
                  className="imageEditWindowButtonArea_btn"
                  onClick={() => {
                    this.editorRef.current.getInstance().addShape('rect', {
                      fill: 'black',
                      stroke: 'black',
                      strokeWidth: 0,
                      width: this.state.selectedImageSize
                        ? this.state.selectedImageSize.width * 0.15
                        : 75,
                      height: this.state.selectedImageSize
                        ? this.state.selectedImageSize.width * 0.15
                        : 75,
                      left: this.state.selectedImageSize
                        ? this.state.selectedImageSize.width * 0.15
                        : 75,
                      top: this.state.selectedImageSize
                        ? this.state.selectedImageSize.width * 0.15
                        : 75,
                      isRegular: false,
                    })
                  }}
                >
                  {/* <IconRectangle /> */}
                  <img src={IconRectangle} />
                </button>
              </div>
              <div className="item">
                <button
                  className="imageEditWindowButtonArea_btn"
                  onClick={() => {
                    try {
                      const props = this.editorRef.current
                        .getInstance()
                        .getObjectProperties(this.state.activeObject.id, [
                          'left',
                          'width',
                        ])
                      this.editorRef.current
                        .getInstance()
                        .changeShape(this.state.activeObject.id, {
                          left:
                            props.left +
                            this.state.selectedImageSize.width * 0.01,
                          width:
                            props.width +
                            this.state.selectedImageSize.width * 0.02,
                        })
                    } catch (e) {}
                  }}
                >
                  {/* <Icon name="resize horizontal" /> */}↔
                </button>
                <button
                  className="imageEditWindowButtonArea_btn"
                  onClick={() => {
                    try {
                      const props = this.editorRef.current
                        .getInstance()
                        .getObjectProperties(this.state.activeObject.id, [
                          'top',
                          'height',
                        ])
                      this.editorRef.current
                        .getInstance()
                        .changeShape(this.state.activeObject.id, {
                          top:
                            props.top +
                            this.state.selectedImageSize.width * 0.01,
                          height:
                            props.height +
                            this.state.selectedImageSize.width * 0.02,
                        })
                    } catch (e) {}
                  }}
                >
                  {/* <Icon name="resize vertical" /> */}↕
                </button>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <button
                className="Back"
                onClick={() => this.props.close()}
                style={{ maxHeight: '48px', padding: '1.0em', width: 'auto' }}
              >
                キャンセル
              </button>
              <button
                className="Button"
                onClick={() => {
                  const imageData = this.editorRef.current
                    .getInstance()
                    .toDataURL({ format: 'jpeg', quality: '0.8' })
                  const imageType = 'image/jpeg'
                  this.props.uploadImage(imageData, imageType)
                }}
                style={{ maxHeight: '48px' }}
              >
                保存
              </button>
            </div>
          </div>

          {this.state.exampleModal && (
            <div className="ulModal">
              <div className="ulModal_main">
                <div
                  className="ulModal_content"
                  style={{
                    fontSize: '1.2rem',
                    borderBottom: '1px solid rgba(34,36,38,.15)',
                  }}
                >
                  <h3>マスクする場所について</h3>
                </div>
                <div className="ulModal_content">
                  <div
                    className="ContentArea ContentAreaColor-confirm"
                    style={{ fontWeight: 'bold', margin: '0' }}
                  >
                    <ul
                      style={{
                        fontSize: '0.9375rem',
                        listStyle: 'disc',
                        marginBottom: '1.0rem',
                        paddingLeft: '1.0rem',
                      }}
                    >
                      <li>
                        <p>
                          下図を参照して
                          <span style={{ color: '#ba0080' }}>
                            健康保険被保険者証に記載の保険者番号、記号・番号・枝番・二次元コードをマスク
                          </span>
                          してください。
                        </p>
                      </li>
                      <li>
                        <p style={{ color: '#ba0080' }}>
                          保険者番号・記号・番号・枝番・二次元コード以外はマスクしないでください。
                        </p>
                      </li>
                      <li>
                        <p>
                          <span style={{ color: '#ba0080' }}>
                            補助書類が必要
                          </span>
                          です。（被保険者証のみではお申し込みいただけません）
                          <a
                            className="blank"
                            href="https://aeonmobile.jp/support/verify/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            詳しくはこちら
                          </a>
                        </p>
                      </li>
                      <li>
                        <p>
                          画像は一例です。保険者により被保険者証の書式は異なります。
                        </p>
                      </li>
                    </ul>
                    <div className="cardImageArea">
                      <div>
                        <p>マスク前イメージ</p>
                        <img src={imgHoken01} alt="" />
                      </div>
                      <div>
                        <p>マスク後イメージ</p>
                        <img src={imgHoken02} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ulModal_actions">
                  <button
                    className="Button"
                    onClick={() => {
                      this.setState({ exampleModal: false })
                    }}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default ImageEditWindow
