import Gumul from '../Gumul'
import calculateRowAndColSpan from './calculateRowAndColSpan'
import createRowElement from './createRowElement'
import calculateScrollbarSize from './calculateScrollbarSize'
import compositeMatrix from './compositeMatrix'

export {
  compositeMatrix,
  createRowElement,
  calculateScrollbarSize,
  calculateRowAndColSpan
}

export const extractRowTemplate = (table: HTMLTableElement): HTMLTableRowElement => {
  const tr: Element = table.querySelector('tr')
  if (!tr) return

  const result = tr.cloneNode(true) as HTMLTableRowElement
  tr.parentNode.removeChild(tr)

  return result
}

export const resizeScrollAxis = (gumul: Gumul): void => {
  const { element: { axis }, shape: { body, columns, freeze } } = gumul
  const _columns = columns.slice(freeze)
  const mainTableWidth: number = _columns.reduce((a, b) => a + b)

  if (mainTableWidth < body.width - calculateScrollbarSize())
    axis.x.querySelector('div').style.width = '0px'
  else {
    let visibleWidth: number = 0
    let visibleIndex: number = 0
    _columns.some((v, index) => {
      if ((visibleWidth += v) > body.width) {
        visibleIndex = index
        return true
      }

      return false
    })

    const overWidth: number = _columns.slice(visibleIndex - 2).reduce((a, b) => a + b)

    visibleWidth = 0
    _columns.some((v, index) => {
      if ((visibleWidth += v) > overWidth) {
        visibleIndex = index
        return true
      }

      return false
    })

    axis.x.querySelector('div').style.width =
      (body.width + visibleIndex * Gumul.SCROLL_X_SIZE) + 'px'
  }

  axis.x.style.width = body.width + 'px'
  axis.y.style.height = body.height + 'px'
}

export const resizeTableAndCell = (
  {
    element: { table },
    shape: { body, freeze, leftWidth, columns }
  }: Gumul
) => {

  table.knob.style.width =
    table.left.style.width = leftWidth + 'px'

  table.head.style.left = leftWidth + 'px'
  table.main.style.left = leftWidth + 'px'

  table.head.style.width =
    table.main.style.width = (columns.filter((v, i) => i >= freeze)
      .reduce((a, b) => a + b)) + 'px'

  table.left.style.top =
    table.main.style.top = body.top + 'px'

  table.knob.querySelectorAll('col[data-index]').forEach(
    (col: any) => col.style.width = columns[parseInt(col.dataset.index)] + 'px')
  table.head.querySelectorAll('col[data-index]').forEach(
    (col: any) => col.style.width = columns[parseInt(col.dataset.index)] + 'px')

  const colgroup = [table.left.querySelector('colgroup'), table.main.querySelector('colgroup')]
  colgroup[0] && table.left.removeChild(colgroup[0])
  colgroup[1] && table.main.removeChild(colgroup[1])

  table.left.appendChild(table.knob.querySelector('colgroup').cloneNode(true))
  table.main.appendChild(table.head.querySelector('colgroup').cloneNode(true))
}
