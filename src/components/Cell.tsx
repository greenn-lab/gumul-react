import React, { ReactElement } from 'react'

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
  col?: number
}

export const Cell: React.FC<ICell> = (props) => (
  <td>
    <span className={classes(props)}>
      {props.value}
    </span>
  </td>
)


export const HeaderCell: React.FC<IHeaderCell> = (props) => {
  const { label, col, rowSpan, colSpan } = props
  const attrs: {[key: string]: number} = {
    'col': col + (colSpan || 1) - 1
  }

  if (rowSpan > 1) attrs['rowSpan'] = rowSpan
  if (colSpan > 1) attrs['colSpan'] = colSpan

  return (
    <td {...attrs}
        className={classes(props)}
      // onMouseMove={onChangeCellWidth.show}
    >{label}</td>
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
