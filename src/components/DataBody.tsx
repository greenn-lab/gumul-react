import React from 'react'
import { ICell } from './Cell'

interface Props {
  matrix: ICell[][]
  data?: any[]
}

const DataBody: React.FC<Props> =
  ({
     matrix,
     data
   }) => {
    if (!matrix || !matrix[0].length) return (<table/>)

    return (
      <>
        <colgroup>
          <col style={{ width: 0 }}/>
          {
            matrix[matrix.length - 1].map((x, index) =>
              <col key={index} style={{ width: x.width }}/>
            )
          }
        </colgroup>
        <tbody>
        {
          /*rows && rows.map((row, y) => (
            <tr key={y}>
              <th className={'gumul-cell-prefixing'}/>
              {
                matrix[matrix.length - 1].map((cell, x) => {
                  let value: any = row[cell.id]

                  if (cell.func)
                    value = cell.func(value, row)

                  return (<Cell {...cell} value={value} key={x}/>)
                })
              }
            </tr>))*/
        }
        </tbody>
      </>
    )
  }

export default DataBody
