import React from 'react'
import { Cell, ICell } from './Cell'

interface IDataRow {
  matrix: ICell[][]
}

const DataRow: React.FC<IDataRow> = ({ matrix }) => (
  <tbody>
  <tr>
    <td className={'gumul-cell-prefix'}/>
    {
      matrix && matrix[matrix.length - 1].map(
        (cell, index) => <Cell key={index} {...cell}/>)
    }</tr>
  </tbody>

)

export default DataRow
