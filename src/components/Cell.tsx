import React, { ReactElement } from 'react'

export interface ICell {
  id?: string
  label?: string
  width?: number
  shape?: CellShape
  align?: CellAlign
  justify?: CellJustify
  childCells?: ICell[]
  element?: ReactElement
  html?: HTMLSpanElement
  value?: any
  func?: (value: any, row: any) => string | number
}

const Cell: React.FC<ICell> = (props) => (
  <td>
    <span className={classes(props)}>
      {props.value}
    </span>
  </td>
)

export default Cell

const classes = (props: ICell): string => {
  const classList: string[] = ['gumul-cell']

  if (props.shape)
    classList.push(`gumul-cell-${props.shape}`)

  if (props.justify)
    classList.push(`gumul-cell-${props.justify}`)

  if (props.align)
    classList.push(`gumul-cell-${props.align}`)

  return classList.join(' ')
}

export enum CellShape {
  STRING = 'string',
  NUMBER = 'number',
  FORMULA = 'fomula',
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
