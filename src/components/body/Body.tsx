import React, { FC } from 'react'
import { ICell } from '../Cell'
import BodyTable from './BodyTable'

interface BodyProps {
  left: ICell[][]
  main: ICell[][]
  rows?: any[]
}

const Body: FC<BodyProps> =
  ({
     left,
     main,
     rows
   }) => (
    <div className={'gumul-body'}>
      <div className={'gumul-body-left'}>
        <BodyTable matrix={left} rows={rows}/>
      </div>
      <div className={'gumul-body-main'}>
        <BodyTable matrix={main} rows={rows}/>
      </div>
    </div>
  )

export default Body
