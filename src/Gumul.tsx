import React, { Component } from 'react'
import axios from 'axios'

import { ICell, IHeaderCell } from './components/Cell'
import Header from './components/Header'
import utils from './utils'
import DataRow from './components/DataRow'

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
  public static SCROLL_X_SIZE: number = 100

  private data: any[]

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
    template: {
      left?: HTMLTableRowElement
      main?: HTMLTableRowElement
      columns?: HTMLTableCellElement[]
    }
  } = {
    axis: {},
    table: {},
    template: {
      columns: []
    }
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
            <Header matrix={matrix.main} freeze={shape.freeze}/>
          </table>
          <table
            className={'gumul-left'}
            ref={e => element.table.left = e}
          >
            <DataRow matrix={matrix.left}/>
          </table>
          <table
            className={'gumul-main'}
            ref={e => element.table.main = e}
          >
            <DataRow matrix={matrix.main}/>
          </table>

          <div className={'gumul-resize'} ref={e => element.resize = e}/>
          <div className={'gumul-axis-x'} ref={e => element.axis.x = e}>
            <div/>
          </div>
          <div className={'gumul-axis-y'} ref={e => element.axis.y = e}>
            <div/>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount(): void {
    const { element } = this

    element.template.left = utils.extractRowTemplate(element.table.left)
    element.template.main = utils.extractRowTemplate(element.table.main)

    element.container.addEventListener('mouseleave', () => {
      element.resize.classList.remove('gumul-resize__on')
      delete element.resize.dataset.index
      delete element.resize.dataset.startX
    })

    element.axis.x.addEventListener('scroll', e => {
      const scrollLeft: number = (e.currentTarget as Element).scrollLeft
      const { element: { table }, shape: { columns, freeze } } = this

      const scroll = Math.ceil(scrollLeft / Gumul.SCROLL_X_SIZE)
      const scrollSize = scroll === 0 ? 0
        : columns.slice(freeze, freeze + scroll).reduce((a, b) => a + b) * -1

      table.head.style.marginLeft = scrollSize + 'px'
      table.main.style.marginLeft = scrollSize + 'px'
    })

    element.container.addEventListener('wheel', e => {
      e.preventDefault()
      utils.event.wheel.x(e, element.axis.x)
      // this.onWheelY(e)
    })

    // element.resize.addEventListener('mousedown', onChangeCellWidth.pick)
    // element.resize.addEventListener('mouseup', onChangeCellWidth.drop)

    //
    // this.setState({
    //   mounted: true
    // })

    window.addEventListener('resize', () => this.resetSize())
    this.resetSize()

    this.dataInitialRender()
  }

  private dataInitialRender = (): void => {
    if (this.data === undefined) {
      console.debug('wait for data loaded.')
      setTimeout(this.dataInitialRender, 100)
    } else if (this.data.length === 0) {
      console.log('data was empty.')
    } else {
      this.data.filter((v, index) => index <= this.shape.rows)
        .forEach(v => this.dataRender(v))
    }
  }

  private dataRender(data: any): void {
    const { matrix } = this
    const { freeze } = this.shape
    const { template, table } = this.element

    if (freeze)
      this.rowRender(data, table.left, template.left, matrix.left)

    this.rowRender(data, table.main, template.main, matrix.main)
  }

  private rowRender(data: any, table: HTMLTableElement, template: HTMLTableRowElement, matrix: IHeaderCell[][]): void {
    const tr: Element = template.cloneNode(true) as Element
    const columns: NodeListOf<HTMLTableCellElement> =
      tr.querySelectorAll('td:not(.gumul-cell-prefix)')

    matrix[matrix.length - 1].forEach((cell, index) => {
      columns.item(index).innerHTML
        = cell.func
        ? cell.func(data, this.data)
        : data[cell.id]
    })

    table.querySelector('tbody').appendChild(tr)
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
    const { columns, height, body, freeze } = this.shape

    const leftTableWidth: number = (freeze ?
      columns.filter((v, i) => i < freeze)
        .reduce((a, b) => a + b) : 0)

    const rightTableWidth: number = (freeze ?
      columns.filter((v, i) => i >= freeze)
        .reduce((a, b) => a + b) : 0)

    this.shape.container = container.clientWidth
    this.shape.body.top = this.matrix.main.length * Gumul.DEFAULT_ROW_HEIGHT
    this.shape.body.width = this.shape.container - leftTableWidth
    this.shape.body.height = height - body.top
    this.shape.rows = Math.ceil(body.height / Gumul.DEFAULT_ROW_HEIGHT)

    container.style.height = height + 'px'

    table.knob.style.width =
      table.left.style.width = leftTableWidth + 'px'

    table.head.style.left = leftTableWidth + 'px'
    table.main.style.left = leftTableWidth + 'px'

    table.head.style.width =
      table.main.style.width = (columns.filter((v, i) => i >= freeze)
        .reduce((a, b) => a + b)) + 'px'

    table.left.style.top =
      table.main.style.top = body.top + 'px'

    utils.calculateXAxis(rightTableWidth, axis.x, body.width, columns.slice(freeze))
    axis.x.style.width = body.width + 'px'
    axis.y.style.height = body.height + 'px'

    table.left.querySelector('colgroup') && table.left.removeChild(table.left.querySelector('colgroup'))
    table.main.querySelector('colgroup') && table.main.removeChild(table.main.querySelector('colgroup'))
    table.left.appendChild(table.knob.querySelector('colgroup').cloneNode(true))
    table.main.appendChild(table.head.querySelector('colgroup').cloneNode(true))
  }

  private loading(url: string): void {
    axios.get(url)
      .then(({ data }) => {
        this.data = data
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
}
