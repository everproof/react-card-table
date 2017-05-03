import { arrayOf, func, shape, string } from 'prop-types'
import React from 'react'

import { tableContainer } from './styles'

export default function Table ({ headers, rows, tableClass, tableNode }) {
  return (
    <table className={tableClass} ref={tableNode}>
      <thead>
        <tr>
          {headers.map(({ key, title }) => <th key={key}>{title}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ data, id, onClick }) => (
          <tr key={id} onClick={onClick} role='row'>
            {Object.entries(data).map(([key, value]) => <td key={key + value}>{value}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

Table.defaultProps = {
  tableClass: tableContainer,
}

Table.displayName = 'Table'

Table.propTypes = {
  headers: arrayOf(shape({
    key: string.isRequired,
    title: string.isRequired,
  })).isRequired,
  rows: arrayOf(shape({
    data: shape().isRequired,
    id: string.isRequired,
    onClick: func,
  })).isRequired,
  tableClass: string,
  tableNode: func.isRequired,
}
