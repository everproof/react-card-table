import { arrayOf, func, oneOfType, number, shape, string } from 'prop-types'
import React from 'react'

import { tableContainer } from './styles'

export default function Table({ headers, id, rows, tableClass, tableNode }) {
  return (
    <table className={tableClass} id={id} ref={tableNode}>
      <thead>
        <tr>
          {headers.map(({ key, title }) => <th key={key}>{title}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ data, id: rowId, onClick }) =>
          <tr key={rowId} onClick={onClick} role="row">
            {Object.entries(data).map(([key, value]) =>
              <td key={key + value}>{value}</td>,
            )}
          </tr>,
        )}
      </tbody>
    </table>
  )
}

Table.defaultProps = {
  style: null,
  tableClass: tableContainer,
}

Table.displayName = 'Table'

Table.propTypes = {
  headers: arrayOf(
    shape({
      key: string.isRequired,
      title: string.isRequired,
    }),
  ).isRequired,
  id: oneOfType([number, string]).isRequired,
  rows: arrayOf(
    shape({
      data: shape().isRequired,
      id: string.isRequired,
      onClick: func,
    }),
  ).isRequired,
  tableClass: string,
  tableNode: func.isRequired,
}
