import Gumul from '../Gumul'

export default {
  x(e: Event, head: HTMLTableElement, main: HTMLTableElement, columns: number[], freeze: number): void {
    const scroll = Math.ceil((e.currentTarget as Element).scrollLeft / Gumul.SCROLL_X_SIZE)
    const scrollSize = scroll === 0 ? 0
      : columns.slice(freeze, freeze + scroll).reduce((a, b) => a + b) * -1

    head.style.marginLeft = scrollSize + 'px'
    main.style.marginLeft = scrollSize + 'px'
  },
  y(
    e: Event,
    left: HTMLTableElement,
    main: HTMLTableElement,
    data: any[],
    rows: number,
    _scroll: number,
    dataRender: (data: any, front?: boolean) => void
  ): number {
    const scroll: number = Math.ceil((e.currentTarget as Element).scrollTop / Gumul.SCROLL_Y_SIZE)
    const gap: number = scroll - _scroll

    if (gap === 1) {
      const tr = [left.querySelector('tr'), main.querySelector('tr')]
      tr[0] && tr[0].parentNode.removeChild(tr[0])
      tr[1] && tr[1].parentNode.removeChild(tr[1])

      const index: number = scroll + rows - 1
      if (index < data.length)
        dataRender(data[index])
    } else if (gap === -1) {
      const index: number = scroll
      if (index + rows < data.length) {
        const tr = [left.querySelector('tr:last-child'),
          main.querySelector('tr:last-child')]
        tr[0] && tr[0].parentNode.removeChild(tr[0])
        tr[1] && tr[1].parentNode.removeChild(tr[1])
      }

      dataRender(data[index], true)
    } else {
      if (left.querySelector('tbody')) {
        left.removeChild(left.querySelector('tbody'))
        left.appendChild(document.createElement('tbody'))
      }

      main.removeChild(main.querySelector('tbody'))
      main.appendChild(document.createElement('tbody'))

      data.slice(scroll, scroll + rows).forEach(v => dataRender(v))
    }

    return scroll
  }
}
