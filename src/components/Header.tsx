import React, { MouseEvent } from 'react'
import HeaderCell, { IHeaderCell } from './HeaderCell'

interface HeaderProps {
  matrix: IHeaderCell[][]
  onChangeCellWidth?: {
    show: (e: MouseEvent<HTMLElement>) => void
  }
}

const Header: React.FC<HeaderProps> =
  ({
     matrix,
     onChangeCellWidth
   }) => (
    <>
      <colgroup>
        <col style={{ width: 0 }}/>
        {
          matrix[matrix.length - 1].map((x, index) =>
            <col key={index} style={{ width: x.width }}/>
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
                    index={col + (cell.colSpan || 1) - 1}
                    onChangeCellWidth={onChangeCellWidth}
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
