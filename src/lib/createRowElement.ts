import { IHeaderCell } from '../components/Cell'

export default (data: any[], row: any, template: HTMLTableRowElement, matrix: IHeaderCell[][]): Element => {
    const tr: Element = template.cloneNode(true) as Element
    const td: NodeListOf<HTMLTableCellElement> =
      tr.querySelectorAll('td:not(.gumul-cell-prefix)')

    matrix[matrix.length - 1].forEach((cell, index) => {
      td.item(index).innerHTML
        = cell.func
        ? cell.func(row, data)
        : row[cell.id]
    })

    return tr
  }
