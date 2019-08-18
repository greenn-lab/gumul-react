import { IHeaderCell } from '../components/Cell'

export default function(matrix: IHeaderCell[][]): void {
  if (matrix.length === 1) return

  const size = {
    x: matrix[0].length,
    y: matrix.length
  }

  for (let y: number = 0; y < size.y; y++) {
    for (let x: number = 0; x < size.x;) {
      const current: IHeaderCell = matrix[y][x]
      current.rowSpan = 1
      current.colSpan = 1

      if (current.mocker) x++
      else {
        let seek: number = 0
        while (++seek + y < size.y && matrix[seek + y][x]._id === current._id) {
          matrix[seek + y][x].mocker = true
          ++current.rowSpan
        }

        while (++x < size.x && matrix[y][x]._id === current._id) {
          matrix[y][x].mocker = true
          ++current.colSpan
        }
      }
    }
  }
}
