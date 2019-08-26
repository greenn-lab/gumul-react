import React, { Component } from 'react'
import axios from 'axios'

import { ICell, IHeaderCell } from './components/Cell'
import Header from './components/Header'
import DataRow from './components/DataRow'

import events from './events'
import { calculateXAxis, compositeMatrix, createRowElement, extractRowTemplate } from './lib'

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

export interface GumulElement {
  root?: HTMLDivElement
  container?: HTMLDivElement
  sizer?: HTMLDivElement
  table: {
    knob?: HTMLTableElement
    head?: HTMLTableElement
    left?: HTMLTableElement
    main?: HTMLTableElement
  }
  axis: {
    x?: HTMLDivElement
    y?: HTMLDivElement
  }
  template: {
    left?: HTMLTableRowElement
    main?: HTMLTableRowElement
  }
}

export interface GumulShape {
  columns: number[]
  width?: number
  height?: number
  body?: {
    top?: number
    width?: number
    height?: number
  }
  freeze?: number
  rows?: number
}

export default class Gumul extends Component<Props, State> {

  public static DEFAULT_CHARACTER_WIDTH: number = 12
  public static DEFAULT_ROW_HEIGHT = 27
  public static MINIMUM_COLUMN_WIDTH = 10
  public static SCROLL_X_SIZE: number = 100
  public static SCROLL_Y_SIZE: number = 50//Gumul.DEFAULT_ROW_HEIGHT

  private matrix: {
    id: number
    main: IHeaderCell[][],
    left?: IHeaderCell[][]
  } = {
    id: 0,
    main: []
  }

  public element: GumulElement = {
    table: {},
    axis: {},
    template: {}
  }

  public shape: GumulShape = {
    columns: []
  }

  private data: any[]

  private scroll: number = 0

  constructor(props: Props) {
    super(props)

    if (typeof props.data === 'string') this.loading(props.data)
    else this.data = props.data

    compositeMatrix(
      props.columns,
      props.freeze,
      this.shape.columns,
      this.matrix
    )
  }

  render() {
    const { matrix, element, shape: { height }, props: { freeze } } = this

    return (
      <div className={'gumul'} ref={e => this.element.root = e}>
        <div
          className={'gumul-container'}
          style={{ height }}
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
            <Header matrix={matrix.main} freeze={freeze}/>
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

          <div className={'gumul-sizer'} ref={e => element.sizer = e}/>
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
    const { template, sizer, container, axis, table } = this.element

    template.left = extractRowTemplate(table.left)
    template.main = extractRowTemplate(table.main)

    this.resize()
    window.addEventListener('resize', () => this.resize())

    axis.x.addEventListener('scroll', (e: Event) =>
      events.scroll.x(
        e,
        table.head,
        table.main,
        this.shape.columns,
        this.shape.freeze
      )
    )

    axis.y.addEventListener('scroll', (e: Event) => {
      this.scroll = events.scroll.y(
        e,
        table.left,
        table.main,
        this.data,
        this.shape.rows,
        this.scroll,
        this.renderRow.bind(this))
    })

    container.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      events.wheel.x(e, axis.x)
      events.wheel.y(e, axis.y)
    })

    events.cell.resize(this)

    // resize.addEventListener('mousedown', onChangeCellWidth.pick)
    // resize.addEventListener('mouseup', onChangeCellWidth.drop)

    this.dataInitialRender()
  }

  private dataInitialRender = (): void => {
    if (this.data === undefined) setTimeout(this.dataInitialRender, 100)
    else if (this.data.length === 0) console.log('data was empty.')
    else {
      const { element: { axis }, shape: { rows, body: { height } }, data } = this

      axis.y.querySelector('div').style.height = (
        data.length < rows
          ? 0
          : height + (data.length - rows + 3) * Gumul.SCROLL_Y_SIZE
      ) + 'px'

      data.filter((v, index) => index < rows).forEach(v => this.renderRow(v))
    }
  }

  private renderRow(row: any, insertBefore?: boolean): void {
    const {
      data,
      matrix,
      element: { table, template }
    } = this

    const tbody = [table.left.querySelector('tbody'),
      table.main.querySelector('tbody')]

    if (tbody[0]) {
      if (insertBefore)
        tbody[0].insertBefore(
          createRowElement(data, row, template.left, matrix.left),
          tbody[0].querySelector('tr'))
      else
        tbody[0].appendChild(
          createRowElement(data, row, template.left, matrix.left))
    }

    if (insertBefore)
      tbody[1].insertBefore(
        createRowElement(data, row, template.main, matrix.main),
        tbody[1].querySelector('tr'))
    else
      tbody[1].appendChild(
        createRowElement(data, row, template.main, matrix.main))
  }

  public resize(): void {
    const { props, matrix, element: { container, table, axis } } = this
    const { columns } = this.shape
    const freeze = props.freeze || 0
    const height = props.height || Gumul.DEFAULT_ROW_HEIGHT * 5
    const bodyTop = matrix.main.length * Gumul.DEFAULT_ROW_HEIGHT

    const leftTableWidth: number = (freeze ?
      columns.filter((v, i) => i < freeze)
        .reduce((a, b) => a + b) : 0)

    const rightTableWidth: number = (freeze ?
      columns.filter((v, i) => i >= freeze)
        .reduce((a, b) => a + b) : 0)

    this.shape = {
      width: container.clientWidth,
      height,
      freeze,
      rows: Math.ceil((height - bodyTop) / Gumul.DEFAULT_ROW_HEIGHT),
      body: {
        top: matrix.main.length * Gumul.DEFAULT_ROW_HEIGHT,
        width: container.clientWidth - leftTableWidth,
        height: height - bodyTop
      },
      columns
    }

    container.style.height = height + 'px'

    table.knob.style.width =
      table.left.style.width = leftTableWidth + 'px'

    table.head.style.left = leftTableWidth + 'px'
    table.main.style.left = leftTableWidth + 'px'

    table.head.style.width =
      table.main.style.width = (columns.filter((v, i) => i >= freeze)
        .reduce((a, b) => a + b)) + 'px'

    table.left.style.top =
      table.main.style.top = bodyTop + 'px'

    events.axis.mouseenter(axis.x, axis.y)
    calculateXAxis(rightTableWidth, axis.x, this.shape.body.width, columns.slice(freeze))
    axis.x.style.width = this.shape.body.width + 'px'
    axis.y.style.height = this.shape.body.height + 'px'

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

  private loading(url: string): void {
    axios.get(url)
      .then(({ data }) => {
        this.data = data
      })
  }
}
