import React, { Component, MouseEvent } from 'react'
import { ICell } from './components/Cell'
import { IHeaderCell } from './components/header/HeaderCell'
import DataTable from './components/DataTable'

interface Props {
  data?: string | [any]
  count?: number
  height?: number
  freeze?: number
  columns: ICell[]
}

interface State {
  mounted: boolean
  loading: boolean
  rows?: any[]
}

export default class Gumul extends Component<Props, State> {

  public static DEFAULT_CHARACTER_WIDTH: number = 12 * 3
  public static DEFAULT_ROW_HEIGHT = 27

  private sequentialId: number = 0
  private matrix: IHeaderCell[][] = []
  private matrixLeft: IHeaderCell[][]
  private matrixMain: IHeaderCell[][]

  private data: any[] = []

  private container: HTMLDivElement
  private resize: HTMLDivElement

  private width: {
    container: number
    left: number
    main: number
  }

  private height: number
  private viewport: number

  private scroll: {
    left: number
    top: number
  } = {
    left: 0,
    top: 0
  }

  private table: {
    header?: HTMLTableElement
    headerLeft?: HTMLTableElement
    body?: HTMLTableElement
    bodyLeft?: HTMLTableElement
  } = {}

  static defaultProps: Props = {
    freeze: 0,
    height: 0,
    columns: []
  }

  constructor(props: Props) {
    super(props)

    if (typeof props.data === 'string')
      this.loading(props.data)

    this.compositeHeader()

    this.state = {
      mounted: false,
      loading: false
    }
  }

  render() {
    return (
      <div
        className={'gumul gumul-unmount'}
        ref={e => this.container = e}
      >
        <DataTable
          left={this.matrixLeft}
          main={this.matrixMain}
          rows={this.state.rows}
          onChangeCellWidth={this.onChangeCellWidth}
        />

        <div className={'gumul-resize'} ref={e => this.resize = e}/>
      </div>
    )
  }

  componentWillUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    const { freeze } = prevProps

    if (this.props.freeze !== freeze || this.matrixMain == null) {
      this.matrixLeft = this.matrix.map(y => y.slice(0, freeze))
      this.matrixMain = this.matrix.map(y => y.slice(freeze))

      this.resetSize(prevProps)
    }
  }

  componentDidMount(): void {
    this.container.addEventListener('mouseleave', () => {
      this.resize.classList.remove('gumul-resize-on')
      delete this.resize.dataset.index
      delete this.resize.dataset.startX

    })

    this.container.addEventListener('wheel', e => {
      e.preventDefault()
      this.onWheelX(e)
      this.onWheelY(e)
    })

    this.resize.addEventListener('mousedown', this.onChangeCellWidth.pick)
    this.resize.addEventListener('mouseup', this.onChangeCellWidth.drop)

    window.addEventListener('resize', () =>
      this.resetSize(this.props))

    this.setState({
      mounted: true
    })
  }

  compositeHeader() {
    let x: number = 0
    this.props.columns.forEach(cell =>
      x = this.arrangeHeaderCellsToMatrix(cell, x, 0))

    this.fillMatrix()
  }

  arrangeHeaderCellsToMatrix(cell: IHeaderCell, x: number, y: number): number {
    if (!this.matrix[y])
      this.matrix[y] = []

    if (!cell.label)
      cell.label = cell.id

    this.matrix[y][x] = {
      ...cell,
      _id: this.sequentialId++,
      width: cell.width || cell.label.length * Gumul.DEFAULT_CHARACTER_WIDTH
    }

    if (!cell.childCells || !cell.childCells.length) x++
    else {
      y++

      cell.childCells.forEach(_cell =>
        x = this.arrangeHeaderCellsToMatrix(_cell, x++, y))
    }

    return x
  }

  fillMatrix(): void {
    const { matrix } = this
    const size = {
      row: matrix.length,
      col: matrix.reduce((i, j) => i.length > j.length ? i : j).length
    }

    for (let y: number = 0; y < size.row; y++) {
      for (let x: number = 0; x < size.col; x++) {
        if (matrix[y][x] && !matrix[y][x].mocker) {
          const source: IHeaderCell = matrix[y][x]

          if (y > 0 && !source.id)
            source.id = matrix[y - 1][x].id

          let pick: number = x + 1
          while (pick < size.col && !matrix[y][pick]) {
            matrix[y][pick++] = {
              ...source,
              mocker: true
            }
          }

          pick = y + 1
          while (pick < size.row && !matrix[pick][x]) {
            matrix[pick++][x] = {
              ...source,
              mocker: true
            }
          }
        }
      }
    }
  }

  calculateWidth(matrix: IHeaderCell[][]): number {
    let width: number = 0
    matrix[matrix.length - 1].forEach(x => width += x.width)
    return width
  }

  calculateCellsWidth(matrix: ICell[][], left: number): number {
    let width: number = 0
    matrix[matrix.length - 1].slice(0, left).forEach(cell => width += cell.width)
    return width
  }

  loading = (url: string, append?: boolean) => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (append)
          this.data = res
        else
          this.data = this.data.concat(res)

        this.setState({
          rows: this.data.slice(0, this.viewport)
        })
      })
  }

  resetSize = (props: Props): void => {
    if (!this.container.querySelector('.gumul-body-main > table')) {
      setTimeout(() => this.resetSize(props), 10)
      return
    }

    const header = this.container.querySelector('.gumul-header') as HTMLDivElement
    const headerLeft = header.querySelector('.gumul-header-left') as HTMLDivElement
    this.table.headerLeft = header.querySelector('.gumul-header-left> table') as HTMLTableElement
    const headerMain = header.querySelector('.gumul-header-main') as HTMLDivElement
    this.table.header = header.querySelector('.gumul-header-main> table') as HTMLTableElement

    const body = this.container.querySelector('.gumul-body') as HTMLDivElement
    const bodyLeft = body.querySelector('.gumul-body-left') as HTMLDivElement
    this.table.bodyLeft = body.querySelector('.gumul-body-left> table') as HTMLTableElement
    const bodyMain = body.querySelector('.gumul-body-main') as HTMLDivElement
    this.table.body = body.querySelector('.gumul-body-main> table') as HTMLTableElement

    this.width = {
      container: this.container.getBoundingClientRect().width - 10, // padding size 10pixel
      left: this.calculateWidth(this.matrixLeft) + 1, // border size 1pixel
      main: this.calculateWidth(this.matrixMain)
    }

    if (props.height) {
      this.container.style.height = this.props.height + 'px'

      this.height = this.props.height
        - this.matrix.length * Gumul.DEFAULT_ROW_HEIGHT - 10 // padding top and bottom 10 pixel

      this.viewport = Math.ceil(this.height / Gumul.DEFAULT_ROW_HEIGHT)

      body.style.height =
        bodyLeft.style.height =
          bodyMain.style.height = this.height + 'px'
    }

    headerLeft.style.width =
      this.table.headerLeft.style.width =
        bodyLeft.style.width =
          this.table.bodyLeft.style.width = this.width.left + 'px'

    headerMain.style.width =
      bodyMain.style.width = (this.width.container - this.width.left - 1) + 'px'

    this.table.header.style.width =
      this.table.body.style.width = this.width.main + 'px'

    this.container.classList.remove('gumul-unmount')
  }

  onChangeCellWidth = {
    show: (e: MouseEvent<HTMLElement>): void => {
      if (!this.resize.dataset.startX) {
        const { left, width } = e.currentTarget.getBoundingClientRect()

        if (e.clientX > left + width - 5) {
          this.resize.classList.add('gumul-resize-on')
          this.resize.style.left = (left + width - 5) + 'px'
          this.resize.dataset.index = parseInt(e.currentTarget.dataset.index).toString()
          this.resize.dataset.side = this.table.header.contains(e.currentTarget)
            ? 'main'
            : 'left'
        } else {
          this.resize.classList.remove('gumul-resize-on')
          delete this.resize.dataset.index
        }
      }
    },
    move: (e: MouseEvent<HTMLElement>): void => {
      const x = e.clientX - parseInt(this.resize.dataset.startX)
      this.resize.style.left = (parseInt(this.resize.dataset.left) + x) + 'px'
    },
    pick: (e: HTMLElementEventMap['mousedown']): void => {
      e.preventDefault()
      this.resize.classList.add('gumul-resize-on')
      this.resize.dataset.startX = e.clientX.toString()
      this.resize.dataset.left = this.resize.style.left
    },
    drop: (e: HTMLElementEventMap['mouseup']) => {
      const index: number = parseInt(this.resize.dataset.index)
      const width: number = e.clientX - parseInt(this.resize.dataset.startX)
      const matrix = this.resize.dataset.side === 'left'
        ? this.matrixLeft
        : this.matrixMain
      const tables: HTMLElement[] = this.resize.dataset.side === 'left'
        ? [this.table.headerLeft, this.table.bodyLeft]
        : [this.table.header, this.table.body]

      matrix.forEach(x => x[index].width += width)

      tables.forEach(table => {
        table.querySelectorAll('col')[index + 1].style.width =
          parseInt(table.querySelectorAll('col')[index + 1].style.width) + width + 'px'
      })

      this.resetSize(this.props)

      this.resize.classList.remove('gumul-resize-on')
      delete this.resize.dataset.index
      delete this.resize.dataset.startX
    }
  }

  private onWheelX(e: WheelEvent) {
    if (this.container.dataset.wheelXThrottle) return
    else {
      this.container.dataset.wheelXThrottle = 'ing'
      setTimeout(() =>
          delete this.container.dataset.wheelXThrottle,
        150 - Math.abs(e.deltaX * 30)
      )

      const { scroll, table, width } = this
      scroll.left += e.deltaX > 0 ? 1 : e.deltaX < 0 ? -1 : 0

      if (width.main
        < this.calculateCellsWidth(this.matrixMain, scroll.left - 1)
        + width.container - width.left)
        scroll.left--

      const max = this.matrixMain[0].length - 1

      if (scroll.left < 0)
        scroll.left = 0
      else if (scroll.left > max)
        scroll.left = max

      table.header.style.marginLeft =
        table.body.style.marginLeft =
          (this.calculateCellsWidth(this.matrixMain, scroll.left) * -1) + 'px'
    }
  }

  private onWheelY(e: WheelEvent) {
    const { container, scroll, data, viewport } = this

    if (container.dataset.wheelYThrottle) return
    else {
      container.dataset.wheelYThrottle = 'ing'
      setTimeout(() =>
          delete container.dataset.wheelYThrottle,
        150 - Math.abs(e.deltaY * 30))

      let top: number = scroll.top + (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0)

      if (top < 0)
        top = 0
      else if (top > data.length - 1)
        top = data.length - 1

      if (scroll.top !== top) {
        scroll.top = top

        console.log(scroll)

        this.setState({
          rows: data.slice(scroll.top, scroll.top + viewport)
        })
      }
    }
  }
}
