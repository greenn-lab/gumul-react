import React, { Component } from 'react'
import Cell, { ICell } from '../Cell'

interface BodyTableProps {
  matrix: ICell[][]
  rows?: any[]
}

export default class BodyTable extends Component<BodyTableProps> {
  render() {
    const { matrix, rows } = this.props

    return matrix && matrix[0].length ?
      (
        <table>
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
            rows && rows.map((row, y) => (
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
              </tr>))
          }
          </tbody>
        </table>
      )
      : (<table/>)

  }
}
