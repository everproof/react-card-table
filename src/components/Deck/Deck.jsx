import { arrayOf, func, shape, string } from 'prop-types'
import React from 'react'

import { card, cell, deck, label, values } from './styles'

const defaultClassNames = {
  cardClass: card,
  cardLabelClass: label,
  cardValueClass: cell,
  cardValuesClass: values,
  deckClass: deck,
}

export default function Deck ({
  classNames: {
    cardClass = defaultClassNames.cardClass,
    cardLabelClass = defaultClassNames.cardLabelClass,
    cardValueClass = defaultClassNames.cardValueClass,
    cardValuesClass = defaultClassNames.cardValuesClass,
    deckClass = defaultClassNames.deckClass,
  },
  headers,
  rows,
}) {
  return (
    <div className={deckClass}>
      {rows.map(({ data, id, onClick }) => (
        <div className={cardClass} key={id} onClick={onClick} role='row'>
          <div>
            {headers.map(({ key, title }) =>
              <div className={cardLabelClass} key={key}>{title}</div>)}
          </div>
          <div className={cardValuesClass}>
            {Object.entries(data).map(([key, value]) =>
              <div className={cardValueClass} key={key + value}>{value}</div>)}
          </div>
        </div>
      ))}
    </div>
  )
}

Deck.defaultProps = {
  classNames: defaultClassNames,
}

Deck.displayName = 'Deck'

Deck.propTypes = {
  classNames: shape({
    cardClass: string,
    cardLabelClass: string,
    cardValueClass: string,
    cardValuesClass: string,
    deckClass: string,
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
