import { arrayOf, func, shape, string } from 'prop-types'
import React, { Component } from 'react'

import { Deck, Table } from 'components'
import getElementContentWidth from 'utils/getElementContentWidth'

const RESIZE_EVENT_NAME = 'resize'

export default class CardTable extends Component {
  static defaultProps = {
    classNames: {},
  }

  static displayName = 'CardTable'

  static propTypes = {
    classNames: shape({
      cardClass: string,
      cardLabelClass: string,
      cardValueClass: string,
      cardValuesClass: string,
      deckClass: string,
      tableClass: string,
    }),
    headers: arrayOf(shape({
      key: string.isRequired,
      title: string.isRequired,
    })).isRequired,
    rows: arrayOf(shape({
      data: shape().isRequired,
      id: string.isRequired,
      onClick: func,
    })).isRequired,
  }

  state = {
    shouldRender: false,
    tableIsTooWide: false,
  }

  componentDidMount () {
    window.onload = this.onWindowLoad
    window.addEventListener(RESIZE_EVENT_NAME, this.handleWindowResize)
  }

  shouldComponentUpdate (nextProps, { shouldRender, tableIsTooWide }) {
    return this.state.shouldRender !== shouldRender
      || this.state.tableIsTooWide !== tableIsTooWide
      || this.props !== nextProps
  }

  componentWillUnmount () {
    window.removeEventListener(RESIZE_EVENT_NAME, this.handleWindowResize)
  }

  onWindowLoad = () => {
    this.handleWindowResizeAsync().then(() => {
      this.setState({
        shouldRender: true,
      })
    })
  }

  hiddenStyle = {
    opacity: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  }

  handleWindowResize = () => {
    const parentWidth = getElementContentWidth(this.containerNode.parentNode)

    this.setState({
      tableIsTooWide: this.tableNode.clientWidth > parentWidth,
    })
  }

  handleWindowResizeAsync = () => new Promise((resolve) => {
    const parentWidth = getElementContentWidth(this.containerNode.parentNode)

    this.setState({
      tableIsTooWide: this.tableNode.clientWidth > parentWidth,
    }, resolve)
  })

  updateRef = ({ containerNodeRef, tableNodeRef }) => {
    this.containerNode = containerNodeRef
    this.tableNode = tableNodeRef
  }

  render () {
    return (
      <div
        ref={(ref) => {
          this.containerNode = ref
        }}
        style={this.state.shouldRender ? null : this.hiddenStyle}
      >
        {this.state.tableIsTooWide
          ? (
            <Deck
              classNames={this.props.classNames}
              headers={this.props.headers}
              rows={this.props.rows}
            />
          )
          : null}
        <div style={this.state.tableIsTooWide ? this.hiddenStyle : null}>
          <Table
            headers={this.props.headers}
            rows={this.props.rows}
            tableClass={this.props.classNames.tableClass}
            tableNode={(ref) => {
              this.tableNode = ref
            }}
          />
        </div>
      </div>
    )
  }
}
