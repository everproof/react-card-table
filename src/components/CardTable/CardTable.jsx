import { chunk } from 'lodash'
import { arrayOf, func, number, shape, string } from 'prop-types'
import React, { Component } from 'react'

import { Deck, Table } from 'components'
import getElementContentWidth from 'utils/getElementContentWidth'

const RESIZE_EVENT_NAME = 'resize'

export default class CardTable extends Component {
  static defaultProps = {
    cardsPerDeck: null,
    classNames: {},
    rowsPerTable: null,
  }

  static displayName = 'CardTable'

  static propTypes = {
    cardsPerDeck: number,
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
    rowsPerTable: number,
  }

  state = {
    shouldRender: false,
    tableIsTooWide: false,
  }

  componentDidMount () {
    if (document.readyState === 'complete') {
      this.onWindowLoad()
    } else {
      window.addEventListener('load', this.onWindowLoad)
    }

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

  get decks () {
    const { cardsPerDeck, classNames, headers, rows } = this.props
    const decks = cardsPerDeck ? chunk(rows, cardsPerDeck) : [rows]

    return decks.map((deckRows, index) => (
      <Deck
        classNames={classNames}
        headers={headers}
        key={index}
        rows={deckRows}
      />
    ))
  }

  get tables () {
    const { classNames: { tableClass }, headers, rows, rowsPerTable } = this.props
    const tables = rowsPerTable ? chunk(rows, rowsPerTable) : [rows]

    return tables.map((tableRows, index) => (
      <Table
        headers={headers}
        id={index}
        key={index}
        rows={tableRows}
        tableClass={tableClass}
        tableNode={this.updateTableNodeRef}
      />
    ))
  }

  get largestTableWidth () {
    const tableNodes = Object.values(this.tableNodes)
    const tableWidths = tableNodes.map(tableNode => tableNode.clientWidth)

    return Math.max(...tableWidths)
  }

  get parentWidth () {
    return getElementContentWidth(this.containerNode.parentNode)
  }

  get tableIsTooWide () {
    return this.largestTableWidth > this.parentWidth
  }

  handleWindowResize = () => {
    this.setState({
      tableIsTooWide: this.tableIsTooWide,
    })
  }

  handleWindowResizeAsync = () => new Promise((resolve) => {
    this.setState({
      tableIsTooWide: this.tableIsTooWide,
    }, resolve)
  })

  updateTableNodeRef = (ref) => {
    this.tableNodes = {
      ...this.tableNodes,
      [ref.id]: ref,
    }
  }

  render () {
    return (
      <div
        ref={(ref) => {
          this.containerNode = ref
        }}
        style={this.state.shouldRender ? null : this.hiddenStyle}
      >
        {this.state.tableIsTooWide ? this.decks : null}
        <div style={this.state.tableIsTooWide ? this.hiddenStyle : null}>
          {this.tables}
        </div>
      </div>
    )
  }
}
