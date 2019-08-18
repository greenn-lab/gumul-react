import React, { Component, MouseEvent, ReactElement } from 'react'

export interface ICell {
  id?: string
  label?: string
  width?: number
  type?: CellType
  align?: CellAlign
  justify?: CellJustify
  childCells?: ICell[]
  element?: ReactElement
  html?: HTMLSpanElement
  value?: any
  func?: (value: any, row: any) => string | number
}

export interface IHeaderCell extends ICell {
  _id?: number
  colSpan?: number
  rowSpan?: number
  mocker?: boolean
  index?: number
  onChangeCellWidth?: {
    show: (e: MouseEvent<HTMLElement>) => void
  }
}

export const Cell: React.FC<ICell> = (props) => (
  <td>
    <span className={classes(props)}>
      {props.value}
    </span>
  </td>
)


export const HeaderCell: React.FC<IHeaderCell> = (props) => {
  const { label, index, rowSpan, colSpan, onChangeCellWidth } = props
  const attrs: any = {
    'data-index': index
  }

  if (rowSpan > 1) attrs['rowSpan'] = rowSpan
  if (colSpan > 1) attrs['colSpan'] = colSpan

  return (
    <td {...attrs}
      // onMouseMove={onChangeCellWidth.show}
    >
        <span className={classes(props)}>
          {label}
        </span>
    </td>
  )
}

const classes = (props: ICell | IHeaderCell): string => {
  const classList: string[] = ['gumul-cell']

  if (props.type)
    classList.push(`gumul-cell__${props.type}`)

  if (props.justify)
    classList.push(`gumul-cell__${props.justify}`)

  if (props.align)
    classList.push(`gumul-cell__${props.align}`)

  return classList.join(' ')
}

export enum CellType {
  STRING = 'string'
  ,
  NUMBER = 'number'
  ,
  FORMULA = 'fomula'
  ,
  DATE = 'date'
}

export enum CellAlign {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom'
}

export enum CellJustify {
  LEFT = 'left',
  MIDDLE = 'middle',
  RIGHT = 'right'
}
