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

export const calculateXAxis = (mainTableWidth: number, axis: HTMLDivElement, bodyWidth: number, columns: number[]): void => {
  if (mainTableWidth < bodyWidth - calculateScrollbarSize()) axis.querySelector('div').style.width = '0px'
  else {
    let visibleWidth: number = 0
    let visibleIndex: number = 0
    columns.some((v, index) => {
      if ((visibleWidth += v) > bodyWidth) {
        visibleIndex = index
        return true
      }

      return false
    })

    const overWidth: number = columns.slice(visibleIndex - 2).reduce((a, b) => a + b)

    visibleWidth = 0
    columns.some((v, index) => {
      if ((visibleWidth += v) > overWidth) {
        visibleIndex = index
        return true
      }

      return false
    })

    axis.querySelector('div').style.width = (bodyWidth + visibleIndex * Gumul.SCROLL_X_SIZE) + 'px'
  }
}
