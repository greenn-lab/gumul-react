import React from 'react'
import { HeaderCell, IHeaderCell } from './Cell'

interface HeaderProps {
  matrix: IHeaderCell[][]
  freeze?: number
}

const Header: React.FC<HeaderProps> =
  ({
     matrix,
     freeze = 0
   }) => (
    <>
      <colgroup>
        <col style={{ width: 0 }}/>
        {
          matrix[matrix.length - 1].map((x, index) =>
            <col key={index} data-index={index + freeze} style={{ width: x.width }}/>
          )
        }
      </colgroup>
      <thead>{
        matrix.map((y, row) => (
          <tr key={row}>
            <th className={'gumul-cell-prefixing'}/>
            {
              y.map((cell, col) => {
                return !cell.mocker && (
                  <HeaderCell
                    {...cell}
                    key={col}
                    col={col + freeze}
                  />
                )
              })
            }
          </tr>
        ))
      }</thead>
    </>
  )

export default Header
