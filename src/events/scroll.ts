import Gumul from '../Gumul'

export default (gumul: Gumul) => {
  const {
    element: { table, axis },
    shape: { columns, freeze, rows }
  } = gumul

  axis.x.addEventListener('mouseenter', () => {
    axis.x.style.zIndex = '6'
    axis.y.style.zIndex = '5'
  })

  axis.y.addEventListener('mouseenter', () => {
    axis.y.style.zIndex = '6'
    axis.x.style.zIndex = '5'
  })


  axis.x.addEventListener('scroll', (e: Event) => {
    const scrollX = Math.ceil(
      (e.currentTarget as Element).scrollLeft / Gumul.SCROLL_X_SIZE)
    const scrollSize = scrollX === 0
      ? 0
      : columns
      .slice(freeze, freeze + scrollX)
      .reduce((a, b) => a + b) * -1

    table.head.style.marginLeft =
      table.main.style.marginLeft = scrollSize + 'px'

  })

  let scrolled = 0
  axis.y.addEventListener('scroll', (e: Event) => {
    const scrollY: number = Math.ceil(
      (e.currentTarget as Element).scrollTop / Gumul.SCROLL_Y_SIZE)
    const gap: number = scrollY - scrolled

    scrolled = scrollY

    if (gap === 1) {
      const tr = [
        table.left.querySelector('tr'),
        table.main.querySelector('tr')
      ]

      tr[0] && tr[0].parentNode.removeChild(tr[0])
      tr[1] && tr[1].parentNode.removeChild(tr[1])

      const index: number = scrollY + rows - 1
      if (index < gumul.data.length)
        gumul.renderRow(index)
    } else if (gap === -1) {
      const index: number = scrollY
      if (index + rows < gumul.data.length) {
        const tr = [
          table.left.querySelector('tr:last-child'),
          table.main.querySelector('tr:last-child')
        ]
        tr[0] && tr[0].parentNode.removeChild(tr[0])
        tr[1] && tr[1].parentNode.removeChild(tr[1])
      }

      gumul.renderRow(index, true)
    } else {
      if (table.left.querySelector('tbody')) {
        table.left.removeChild(table.left.querySelector('tbody'))
        table.left.appendChild(document.createElement('tbody'))
      }

      table.main.removeChild(table.main.querySelector('tbody'))
      table.main.appendChild(document.createElement('tbody'))

      for (let i: number = 0; i < rows; i++)
        gumul.renderRow(i + scrollY)
    }
  })
}
