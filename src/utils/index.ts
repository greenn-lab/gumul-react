import Gumul from '../Gumul'
import calculateRowAndColSpan from './calculateRowAndColSpan'
import event from './event'

export default {
  event,
  calculateRowAndColSpan,
  extractRowTemplate(table: HTMLTableElement): HTMLTableRowElement {
    const tr: Element = table.querySelector('tr')
    if (!tr) return

    const result = tr.cloneNode(true) as HTMLTableRowElement
    tr.parentNode.removeChild(tr)

    return result
  },
  calculateXAxis(rightTableWidth: number, axis: HTMLDivElement, bodyWidth: number, columns: number[]) {
    if (rightTableWidth <= bodyWidth) axis.querySelector('div').style.width = '0px'
    else {
      let visibleWidth: number = 0
      let visibleIndex: number = 0
      columns.some((v, index) => {
        if ((visibleWidth += v) > bodyWidth) {
          visibleIndex = index
          return true
        }
      })

      const overWidth: number = columns.slice(visibleIndex - 2).reduce((a, b) => a + b)

      visibleWidth = 0
      columns.some((v, index) => {
        if ((visibleWidth += v) > overWidth) {
          visibleIndex = index
          return true
        }
      })

      axis.querySelector('div').style.width = (bodyWidth + visibleIndex * Gumul.SCROLL_X_SIZE) + 'px'
    }

  }
}
