import Gumul from '../Gumul'
import { ICell, IHeaderCell } from '../components/Cell'

import calculateRowAndColSpan from './calculateRowAndColSpan'

export default (columns: ICell[], freeze: number, widths: number[], matrix: {
  id: number,
  main: IHeaderCell[][]
  left?: IHeaderCell[][]
}): void => {
  let x: number = 0
  columns.forEach(cell =>
    x = spreadColumnsToMatrix(matrix, cell, x, 0))

  const size = {
    y: matrix.main.length,
    x: matrix.main.reduce((i, j) => i.length > j.length ? i : j).length
  }

  for (let y: number = 0; y < size.y; y++) {
    for (let x: number = 0; x < size.x;) {
      let current: IHeaderCell = matrix.main[y][x]

      if (!current) x++
      else {
        let seek: number = y
        while (++seek < size.y && !matrix.main[seek][x])
          matrix.main[seek++][x] = { ...current }

        while (++x < size.x && !matrix.main[y][x])
          matrix.main[y][x] = { ...current }
      }
    }
  }

  matrix.main[size.y - 1].forEach(x => {
    const width: number = x.width
      || x.label.length * Gumul.DEFAULT_CHARACTER_WIDTH

    x.width = width
    widths.push(width)
  })

  if (freeze) {
    matrix.left = matrix.main.map(y => y.splice(0, freeze as number))
    calculateRowAndColSpan(matrix.left)
  }

  calculateRowAndColSpan(matrix.main)
}

function spreadColumnsToMatrix(matrix: {
  id: number,
  main: IHeaderCell[][]
  left?: IHeaderCell[][]
}, cell: IHeaderCell, x: number, y: number): number {

  if (!matrix.main[y])
    matrix.main[y] = []

  if (!cell.label)
    cell.label = cell.id

  matrix.main[y][x] = {
    ...cell,
    _id: matrix.id++
  }

  if (!cell.childCells || !cell.childCells.length) x++
  else {
    y++

    cell.childCells.forEach(_cell =>
      x = spreadColumnsToMatrix(matrix, _cell, x++, y))
  }

  return x
}
