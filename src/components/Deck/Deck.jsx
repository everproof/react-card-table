import { arrayOf, func, shape, string } from 'prop-types'
import React from 'react'

import { cardContainer, cell, deckContainer, label, values } from './styles'

export default function Deck ({
  cardClass,
  cardLabelClass,
  cardValueClass,
  cardValuesCless,
  deckClass,
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
          <div className={cardValuesCless}>
            {Object.entries(data).map(([key, value]) =>
              <div className={cardValueClass} key={key + value}>{value}</div>)}
          </div>
        </div>
      ))}
    </div>
  )
}

Deck.defaultProps = {
  cardClass: cardContainer,
  cardLabelClass: label,
  cardValueClass: cell,
  cardValuesCless: values,
  deckClass: deckContainer,
}

Deck.displayName = 'Deck'

Deck.propTypes = {
  cardClass: string,
  cardLabelClass: string,
  cardValueClass: string,
  cardValuesCless: string,
  deckClass: string,
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
