import { chunk } from 'lodash-es'
import { arrayOf, func, node, number, shape, string } from 'prop-types'
import React, { cloneElement, Component } from 'react'

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
    backButton: node.isRequired,
    cardsPerDeck: number,
    classNames: shape({
      cardClass: string,
      cardLabelClass: string,
      cardValueClass: string,
      cardValuesClass: string,
      deckClass: string,
      tableClass: string,
    }),
    headers: arrayOf(
      shape({
        key: string.isRequired,
        title: string.isRequired,
      }),
    ).isRequired,
    nextButton: node.isRequired,
    rows: arrayOf(
      shape({
        data: shape().isRequired,
        id: string.isRequired,
        onClick: func,
      }),
    ).isRequired,
    rowsPerTable: number,
  }

  state = {
    shouldRender: false,
    tableIsTooWide: false,
    viewingIndex: 0,
  }

  componentDidMount() {
    this.mounted = true

    if (document.readyState === 'complete') {
      this.onWindowLoad()
    } else {
      window.addEventListener('load', this.onWindowLoad)
    }

    window.addEventListener(RESIZE_EVENT_NAME, this.handleWindowResize)
  }

  componentWillUnmount() {
    this.mounted = false

    window.removeEventListener(RESIZE_EVENT_NAME, this.handleWindowResize)
  }

  onWindowLoad = () => {
    this.handleWindowResize().then(() => {
      this.setState({
        shouldRender: true,
      })
    })
  }

  hiddenStyle = {
    float: 'left',
    opacity: 0,
    margin: 0,
    marginRight: '-1px',
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    color: 'transparent',
    clip: 'rect(0 0 0 0)',
  }

  mounted = false

  tableNodes = {}

  get cardsPerDeck() {
    return this.props.cardsPerDeck || this.props.rows.length
  }

  get deck() {
    const { classNames, headers } = this.props
    const {
      items: decks,
      itemIndex: deckIndex,
      minIndex,
      nextIndex,
      prevIndex,
    } = this.itemsProperties(this.cardsPerDeck)
    const deckRows = decks[deckIndex]

    return (
      <div>
        <Deck classNames={classNames} headers={headers} rows={deckRows} />
        <div className={navigation}>
          {this.backButton(
            prevIndex < minIndex,
            this.prevPage(this.cardsPerDeck),
          )}
          <div>{`${nextIndex}/${decks.length}`}</div>
          {this.nextButton(
            nextIndex >= decks.length,
            this.nextPage(this.cardsPerDeck),
          )}
        </div>
      </div>
    )
  }

  get largestTableWidth() {
    const tableNodes = Object.values(this.tableNodes)
    const tableWidths = tableNodes.map(tableNode => tableNode.clientWidth)

    return Math.max(...tableWidths)
  }

  get parentWidth() {
    const DEFAULT_WIDTH = 0

    return this.containerNode && this.containerNode.parentNode
      ? getElementContentWidth(this.containerNode.parentNode)
      : DEFAULT_WIDTH
  }

  get rowsPerTable() {
    return this.props.rowsPerTable || this.props.rows.length
  }

  get tableIsTooWide() {
    return this.largestTableWidth > this.parentWidth
  }

  get tables() {
    const { classNames: { tableClass }, headers } = this.props
    const {
      items: tables,
      itemIndex: tableIndex,
      minIndex,
      nextIndex,
      prevIndex,
    } = this.itemsProperties(this.rowsPerTable)

    return (
      <div>
        {tables.map((tableRows, index) =>
          <div
            key={index}
            style={index === tableIndex ? null : this.hiddenStyle}
          >
            <Table
              headers={headers}
              id={index}
              rows={tableRows}
              tableClass={tableClass}
              tableNode={this.updateTableNodeRef}
            />
          </div>,
        )}
        <div className={navigation}>
          {this.backButton(
            prevIndex < minIndex,
            this.prevPage(this.rowsPerTable),
          )}
          <div>{`${nextIndex}/${tables.length}`}</div>
          {this.nextButton(
            nextIndex >= tables.length,
            this.nextPage(this.rowsPerTable),
          )}
        </div>
      </div>
    )
  }

  backButton = (disabled, onClick) =>
    cloneElement(this.props.backButton, {
      disabled,
      onClick,
    })

  handleWindowResize = () => {
    if (!this.mounted) {
      throw new Error('Card table is not mounted.')
    }

    return new Promise(resolve => {
      this.setState(
        {
          tableIsTooWide: this.tableIsTooWide,
        },
        resolve,
      )
    })
  }

  itemsProperties = itemsPerContainer => {
    const MIN_INDEX = 0
    const INCREMENT = 1

    const { rows } = this.props
    const itemIndex = Math.floor(this.state.viewingIndex / itemsPerContainer)
    const nextIndex = itemIndex + INCREMENT
    const prevIndex = itemIndex - INCREMENT

    const items = itemsPerContainer ? chunk(rows, itemsPerContainer) : [rows]

    return {
      items,
      itemIndex,
      minIndex: MIN_INDEX,
      nextIndex,
      prevIndex,
    }
  }

  navigate = (event, change) => {
    event.stopPropagation()
    const index = this.state.viewingIndex + change
    const absoluteChange = Math.abs(change)

    this.setState({
      viewingIndex: Math.floor(index / absoluteChange) * absoluteChange,
    })
  }

  nextButton = (disabled, onClick) =>
    cloneElement(this.props.nextButton, {
      disabled,
      onClick,
    })

  nextPage = increment => event => {
    this.navigate(event, increment)
  }

  prevPage = decrement => event => {
    const NEGATIVE_ONE = -1

    this.navigate(event, decrement * NEGATIVE_ONE)
  }

  updateContainerNodeRef = ref => {
    if (ref) {
      this.containerNode = ref
    }
  }

  updateTableNodeRef = ref => {
    if (ref) {
      this.tableNodes = {
        ...this.tableNodes,
        [ref.id]: ref,
      }
    }
  }

  render() {
    return (
      <div
        ref={this.updateContainerNodeRef}
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
