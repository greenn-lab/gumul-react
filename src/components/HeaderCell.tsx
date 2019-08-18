import React, { Component, MouseEvent } from 'react'
import { ICell } from './Cell'

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

export default class HeaderCell extends Component<IHeaderCell> {

  render() {
    const { label, index, rowSpan, colSpan, onChangeCellWidth } = this.props

    const attrs: any = {
      'data-index': index
    }

    if (rowSpan > 1) attrs['rowSpan'] = rowSpan
    if (colSpan > 1) attrs['colSpan'] = colSpan

    return (
      <td {...attrs}
        // onMouseMove={onChangeCellWidth.show}
      >
        <span className={this.makeClassList()}>
          {label}
        </span>
      </td>
    )
  }

  private makeClassList(): string {
    const classList: string[] = ['gumul-cell']

    if (this.props.shape)
      classList.push(`gumul-cell-${this.props.shape}`)

    if (this.props.justify)
      classList.push(`gumul-cell-${this.props.justify}`)

    if (this.props.align)
      classList.push(`gumul-cell-${this.props.align}`)

    return classList.join(' ')
  }
}

