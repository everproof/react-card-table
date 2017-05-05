import { chunk } from 'lodash'
import { arrayOf, func, number, shape, string } from 'prop-types'
import React, { Component } from 'react'

import { Deck, Table } from 'components'
import getElementContentWidth from 'utils/getElementContentWidth'

import { navigation } from './styles'

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
    viewingIndex: 0,
  }

  componentDidMount () {
    if (document.readyState === 'complete') {
      this.onWindowLoad()
    } else {
      window.addEventListener('load', this.onWindowLoad)
    }

    window.addEventListener(RESIZE_EVENT_NAME, this.handleWindowResize)
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

  get deck () {
    const MIN_INDEX = 0
    const INCREMENT = 1

    const { cardsPerDeck, classNames, headers, rows } = this.props

    const deckIndex = Math.floor(this.state.viewingIndex / cardsPerDeck)
    const nextIndex = deckIndex + INCREMENT
    const prevIndex = deckIndex - INCREMENT

    const decks = cardsPerDeck ? chunk(rows, cardsPerDeck) : [rows]
    const deckRows = decks[deckIndex]

    return (
      <div>
        <Deck classNames={classNames} headers={headers} rows={deckRows} />
        <div className={navigation}>
          <button disabled={prevIndex < MIN_INDEX} onClick={this.prevPage(cardsPerDeck)}>
            {'Prev'}
          </button>
          <button disabled={nextIndex >= decks.length} onClick={this.nextPage(cardsPerDeck)}>
            {'Next'}
          </button>
        </div>
      </div>
    )
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

  get tables () {
    const MIN_INDEX = 0
    const INCREMENT = 1

    const { classNames: { tableClass }, headers, rows, rowsPerTable } = this.props

    const tableIndex = Math.floor(this.state.viewingIndex / rowsPerTable)
    const nextIndex = tableIndex + INCREMENT
    const prevIndex = tableIndex - INCREMENT

    const tables = rowsPerTable ? chunk(rows, rowsPerTable) : [rows]

    return (
      <div>
        {tables.map((tableRows, index) => (
          <div key={index} style={index === tableIndex ? null : this.hiddenStyle}>
            <Table
              headers={headers}
              id={index}
              rows={tableRows}
              tableClass={tableClass}
              tableNode={this.updateTableNodeRef}
            />
          </div>
        ))}
        <div className={navigation}>
          <button disabled={prevIndex < MIN_INDEX} onClick={this.prevPage(rowsPerTable)}>
            {'Prev'}
          </button>
          <button disabled={nextIndex >= tables.length} onClick={this.nextPage(rowsPerTable)}>
            {'Next'}
          </button>
        </div>
      </div>
    )
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

  nextPage = increment => (event) => {
    event.stopPropagation()
    const index = this.state.viewingIndex + increment

    this.setState({
      viewingIndex: Math.floor(index / increment) * increment,
    })
  }

  prevPage = decrement => (event) => {
    event.stopPropagation()
    const index = this.state.viewingIndex - decrement

    this.setState({
      viewingIndex: Math.floor(index / decrement) * decrement,
    })
  }

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
        {this.state.tableIsTooWide ? this.deck : null}
        <div style={this.state.tableIsTooWide ? this.hiddenStyle : null}>
          {this.tables}
        </div>
      </div>
    )
  }
}
