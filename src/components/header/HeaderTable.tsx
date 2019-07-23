import React, { MouseEvent } from 'react'
import HeaderCell, { IHeaderCell } from './HeaderCell'

interface HeaderTableProps {
  matrix: IHeaderCell[][]
  onChangeCellWidth: {
    show: (e: MouseEvent<HTMLElement>) => void
  }
}

const HeaderTable: React.FC<HeaderTableProps> =
  ({
     matrix,
     onChangeCellWidth
   }) => {
    if (!matrix || !matrix[0].length) return (<table/>)

    calculateRowAndColSpan(matrix)

    return (
      <table>
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
      </table>
    )
  }

export default HeaderTable

const calculateRowAndColSpan = (matrix: IHeaderCell[][]): void => {
  for (let y: number = 0; y < matrix.length; y++) {
    for (let x: number = 0; x < matrix[y].length; x++) {
      delete matrix[y][x].mocker
      delete matrix[y][x].rowSpan
      delete matrix[y][x].colSpan
    }
  }

  matrix.map((row, y) =>
    row.map((col, x) => rowAndColSpan(matrix, matrix[y][x], y, x))
  )
}

const rowAndColSpan = (matrix: IHeaderCell[][], cell: IHeaderCell, row: number, col: number): IHeaderCell => {
  let merge: number = 1
  while (matrix[row + merge] && matrix[row + merge][col]._id === cell._id)
    matrix[row + merge++][col].mocker = true

  if (merge > 1) cell.rowSpan = merge

  merge = 1
  while (matrix[row][col + merge] && matrix[row][col + merge]._id === cell._id)
    matrix[row][col + merge++].mocker = true

  if (merge > 1) cell.colSpan = merge

  return cell
}
