import React, { Component } from 'react'
import axios from 'axios'

import { ICell, IHeaderCell } from './components/Cell'
import Header from './components/Header'
import DataBody from './components/DataBody'
import utils from './utils'

interface Props {
  data?: string | any[]
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

  public static DEFAULT_CHARACTER_WIDTH: number = 12
  public static DEFAULT_ROW_HEIGHT = 27

  private data: any[] = []

  private matrix: {
    id: number
    main: IHeaderCell[][],
    left: IHeaderCell[][]
  } = {
    id: 0,
    main: [],
    left: null
  }

  private shape: {
    container?: number
    columns?: number[]
    height?: number,
    body: {
      top?: number,
      width?: number,
      height?: number
    }
    freeze?: number
    rows?: number
  } = {
    columns: [],
    body: {},
    freeze: 0
  }

  private scroll: {
    left: number
    top: number
  } = {
    left: 0,
    top: 0
  }

  private element: {
    root?: HTMLDivElement
    container?: HTMLDivElement
    resize?: HTMLDivElement
    axis: {
      x?: HTMLDivElement,
      y?: HTMLDivElement
    }
    table: {
      knob?: HTMLTableElement
      head?: HTMLTableElement
      left?: HTMLTableElement
      main?: HTMLTableElement
    }
  } = {
    axis: {},
    table: {}
  }

  constructor(props: Props) {
    super(props)

    if (typeof props.data === 'string') this.loading(props.data)
    else this.data = props.data

    this.shape.freeze = props.freeze || 0
    this.shape.height = props.height || Gumul.DEFAULT_ROW_HEIGHT * 5

    this.compositeMatrix()
  }

  render() {
    const { matrix, element, shape } = this

    return (
      <div className={'gumul'} ref={e => this.element.root = e}>
        <div
          className={'gumul-container'}
          style={{ height: shape.height }}
          ref={e => element.container = e}
        >
          <table
            className={'gumul-knob'}
            ref={e => element.table.knob = e}
          >
            {matrix.left && <Header matrix={matrix.left}/>}
          </table>
          <table
            className={'gumul-head'}
            ref={e => element.table.head = e}
          >
            <Header matrix={matrix.main}/>
          </table>
          <table
            className={'gumul-left'}
            ref={e => element.table.left = e}
          >
            {matrix.left && <DataBody
              matrix={matrix.left}
              //rows={shape.rows}
            />}
          </table>
          <table
            className={'gumul-main'}
            ref={e => element.table.main = e}
          >
            <DataBody
              matrix={matrix.main}
              //rows={this.state.rows}
            />
          </table>

          <div className={'gumul-resize'} ref={e => element.resize = e}/>
          <div className={'gumul-axis-x'}>
            <div ref={e => element.axis.x = e}/>
          </div>
          <div className={'gumul-axis-y'}>
            <div ref={e => element.axis.y = e}/>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount(): void {
    const { element, onWheelX, onWheelY } = this

    this.resetSize()

    element.container.addEventListener('mouseleave', () => {
      element.resize.classList.remove('gumul-resize__on')
      delete element.resize.dataset.index
      delete element.resize.dataset.startX
    })

    element.container.addEventListener('wheel', e => {
      e.preventDefault()
      onWheelX(e)
      onWheelY(e)
    })

    // element.resize.addEventListener('mousedown', onChangeCellWidth.pick)
    // element.resize.addEventListener('mouseup', onChangeCellWidth.drop)

    // window.addEventListener('resize', this.resetSize)
    //
    // this.setState({
    //   mounted: true
    // })
  }

  private compositeMatrix(): void {
    const { props, shape, matrix } = this

    let x: number = 0
    props.columns.forEach(cell =>
      x = this.spreadColumnsToMatrix(cell, x, 0))

    this.fillMatrix()

    if (shape.freeze) {
      matrix.left =
        matrix.main.map(y => y.splice(0, shape.freeze))

      utils.calculateRowAndColSpan(matrix.left)
    }

    utils.calculateRowAndColSpan(matrix.main)
  }

  private spreadColumnsToMatrix(cell: IHeaderCell, x: number, y: number): number {
    const { matrix } = this

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
        x = this.spreadColumnsToMatrix(_cell, x++, y))
    }

    return x
  }

  private fillMatrix(): void {
    const { matrix } = this
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

    this.defineColumnWidth(matrix.main[size.y - 1])
  }

  private defineColumnWidth(lastRow: IHeaderCell[]) {
    const { columns } = this.shape

    lastRow.forEach(x => {
      const width = x.width || x.label.length * Gumul.DEFAULT_CHARACTER_WIDTH
      x.width = width
      columns.push(width)
    })
  }

  private resetSize(): void {
    const { container, table, axis } = this.element
    const { columns, height, freeze } = this.shape

    const leftSideWidth: number = (freeze ?
      columns.filter((v, i) => i < freeze)
        .reduce((a, b) => a + b) : 0)

    this.shape.container = container.clientWidth
    this.shape.body.top = this.matrix.main.length * Gumul.DEFAULT_ROW_HEIGHT
    this.shape.body.width = this.shape.container - leftSideWidth
    this.shape.body.height = height - this.shape.body.top
    this.shape.rows = Math.ceil(this.shape.body.height / Gumul.DEFAULT_ROW_HEIGHT)

    container.style.height = height + 'px'

    table.knob.style.width =
      table.left.style.width = leftSideWidth + 'px'

    table.head.style.left = leftSideWidth + 'px'
    table.main.style.left = leftSideWidth + 'px'

    table.head.style.width =
      table.main.style.width = (columns.filter((v, i) => i >= freeze)
        .reduce((a, b) => a + b)) + 'px'

    table.left.style.top =
      table.main.style.top = this.shape.body.top + 'px'

    axis.x.parentElement.style.width = (this.shape.container - leftSideWidth) + 'px'
    axis.y.parentElement.style.height = this.shape.body.height + 'px'
  }

  private loading(url: string, append?: boolean): void {
    axios.get(url)
      .then(({ data }) => {
        if (append)
          this.data = data
        else
          this.data = this.data.concat(data)
      })
  }


  onChangeCellWidth = {
    // show: (e: MouseEvent<HTMLElement>): void => {
    //   if (!this.resize.dataset.startX) {
    //     const { left, width } = e.currentTarget.getBoundingClientRect()
    //
    //     if (e.clientX > left + width - 5) {
    //       this.resize.classList.add('gumul-resize-on')
    //       this.resize.style.left = (left + width - 5) + 'px'
    //       this.resize.dataset.index = parseInt(e.currentTarget.dataset.index).toString()
    //       this.resize.dataset.side = this.table.header.contains(e.currentTarget)
    //         ? 'main'
    //         : 'left'
    //     } else {
    //       this.resize.classList.remove('gumul-resize-on')
    //       delete this.resize.dataset.index
    //     }
    //   }
    // },
    // move: (e: MouseEvent<HTMLElement>): void => {
    //   const x = e.clientX - parseInt(this.resize.dataset.startX)
    //   this.resize.style.left = (parseInt(this.resize.dataset.left) + x) + 'px'
    // },
    // pick: (e: HTMLElementEventMap['mousedown']): void => {
    //   e.preventDefault()
    //   this.resize.classList.add('gumul-resize-on')
    //   this.resize.dataset.startX = e.clientX.toString()
    //   this.resize.dataset.left = this.resize.style.left
    // },
    // drop: (e: HTMLElementEventMap['mouseup']) => {
    //   const index: number = parseInt(this.resize.dataset.index)
    //   const width: number = e.clientX - parseInt(this.resize.dataset.startX)
    //   const matrix = this.resize.dataset.side === 'left'
    //     ? this.matrixLeft
    //     : this.matrixMain
    //   const tables: HTMLElement[] = this.resize.dataset.side === 'left'
    //     ? [this.table.headerLeft, this.table.bodyLeft]
    //     : [this.table.header, this.table.body]
    //
    //   matrix.forEach(x => x[index].width += width)
    //
    //   tables.forEach(table => {
    //     table.querySelectorAll('col')[index + 1].style.width =
    //       parseInt(table.querySelectorAll('col')[index + 1].style.width) + width + 'px'
    //   })
    //
    //   this.resetSize(this.props)
    //
    //   this.resize.classList.remove('gumul-resize-on')
    //   delete this.resize.dataset.index
    //   delete this.resize.dataset.startX
    // }
  }

  private onWheelX(e: WheelEvent) {
    const { element, scroll, shape } = this

    if (element.container.dataset.wheelXThrottle) return
    else {
      element.container.dataset.wheelXThrottle = 'ing'
      setTimeout(() =>
          delete element.container.dataset.wheelXThrottle,
        150 - Math.abs(e.deltaX * 30)
      )

      scroll.left += e.deltaX > 0 ? 1 : e.deltaX < 0 ? -1 : 0

      const max = shape.columns.length - shape.freeze

      if (scroll.left > max) scroll.left = max
      else if (scroll.left < 0) scroll.left = 0

      element.table.head.style.marginLeft =
        element.table.main.style.marginLeft =
          (shape.columns
            .filter((v, i) => i >= shape.freeze)
            .reduce((a, b) => a + b) * -1) + 'px'
    }
  }

  private onWheelY(e: WheelEvent) {
    const { element, scroll, data } = this

    if (element.container.dataset.wheelYThrottle) return
    else {
      element.container.dataset.wheelYThrottle = 'ing'
      setTimeout(() =>
          delete element.container.dataset.wheelYThrottle,
        150 - Math.abs(e.deltaY * 30))

      scroll.top += (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0)

      if (scroll.top < 0)
        scroll.top = 0
      else if (scroll.top > data.length - 1)
        scroll.top = data.length - 1
    }
  }
}
