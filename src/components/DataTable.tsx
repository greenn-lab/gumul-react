import React, { MouseEvent } from 'react'
import Header from './header/Header'
import Body from './body/Body'
import { IHeaderCell } from './header/HeaderCell'
import { ICell } from './Cell'

const DataTable: React.FC<{
  left: IHeaderCell[][]
  main: IHeaderCell[][]
  rows?: any[]
  onChangeCellWidth?: {
    show: (e: MouseEvent<HTMLElement>) => void
    move: (e: MouseEvent<HTMLElement>) => void
  }
}> = ({ left, main, rows, onChangeCellWidth }) => (
  <>
    <Header
      left={left}
      main={main}
      onChangeCellWidth={onChangeCellWidth}
    />
    <Body
      left={left as ICell[][]}
      main={main as ICell[][]}
      rows={rows}
    />
  </>
)

export default DataTable
