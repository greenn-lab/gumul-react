import React, { FC, MouseEvent } from 'react'
import { IHeaderCell } from './HeaderCell'
import HeaderTable from './HeaderTable'

interface HeaderProps {
  left: IHeaderCell[][]
  main: IHeaderCell[][]
  onChangeCellWidth: {
    show: (e: MouseEvent<HTMLElement>) => void
    move: (e: MouseEvent<HTMLElement>) => void
  }
}

const Header: FC<HeaderProps> =
  ({
     left,
     main,
     onChangeCellWidth
   }) => (
    <div
      className={'gumul-header'}
      onMouseMove={onChangeCellWidth.move}
    >
      <div className={'gumul-header-left'}>
        <HeaderTable
          matrix={left}
          onChangeCellWidth={onChangeCellWidth}
        />
      </div>
      <div className={'gumul-header-main'}>
        <HeaderTable
          matrix={main}
          onChangeCellWidth={onChangeCellWidth}
        />
      </div>
    </div>
  )

export default Header
