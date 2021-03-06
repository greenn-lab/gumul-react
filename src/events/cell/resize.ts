import Gumul, { GumulElement, GumulShape } from '../../Gumul'

export default (
  gumul: Gumul
) => {
  const { resize, element, shape } = gumul

  element.container
    .querySelectorAll('.gumul-knob,.gumul-head')
    .forEach(table =>
      table
        .querySelectorAll('.gumul-cell')
        .forEach(cell => {
          cell.addEventListener(
            'mousemove',
            (e: Event) => show(e as MouseEvent)
          )

          cell.addEventListener(
            'mousedown',
            (e: Event) => mousedown(e as MouseEvent, element, shape)
          )
        })
    )

  element.container
    .addEventListener(
      'mousemove',
      (e: Event) => mousemove(e as MouseEvent, element)
    )

  element.container
    .addEventListener(
      'mouseup',
      (e: Event) =>
        mouseup(e as MouseEvent, element, shape, resize.bind(gumul))
    )
}

let started: boolean = false
let currCol: number = -1
let startX: number = 0
let startLeft: number = 0

const show = (event: MouseEvent) => {
  if (!started) {
    const { layerX, currentTarget } = event
    const target = currentTarget as HTMLTableCellElement
    const { width } = target.getBoundingClientRect()

    target.style.cursor = layerX < width - 5 ? '' : 'ew-resize'
  }
}

const mousedown = (
  event: MouseEvent,
  { container, table, sizer }: GumulElement,
  { columns, freeze }: GumulShape
) => {
  const { layerX, pageX, currentTarget } = event
  const target = currentTarget as HTMLTableCellElement
  const { width } = target.getBoundingClientRect()

  if (layerX >= width - 5) {
    started = true
    startX = pageX
    currCol = parseInt(target.getAttribute('col'))
    startLeft = columns.slice(0, currCol + 1).reduce((a, b) => a + b)

    if (currCol > freeze)
      startLeft += parseInt(table.main.style.marginLeft || '0')

    container.classList.add('gumul-sizer__on')
    sizer.style.left = startLeft + 'px'
  }
}

const mousemove = (e: MouseEvent, { sizer }: GumulElement) => {
  if (started) {
    const { pageX } = e
    sizer.style.left = pageX - startX + startLeft + 'px'
  }
}

const mouseup = (
  e: MouseEvent,
  { container, sizer }: GumulElement,
  { columns }: GumulShape,
  resize: () => void
) => {
  if (started) {
    const { pageX } = e

    started = false

    container.classList.remove('gumul-sizer__on')
    sizer.style.left = '-10px'

    columns[currCol] += pageX - startX

    if (columns[currCol] < Gumul.MINIMUM_COLUMN_WIDTH)
      columns[currCol] = Gumul.MINIMUM_COLUMN_WIDTH

    resize()
  }
}
