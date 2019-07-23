import React from 'react'
import ReactDOM from 'react-dom'

import Gumul from './Gumul'
import { CellShape } from './components/Cell'

import 'react-app-polyfill/ie9'
import './Gumul.scss'

ReactDOM.render(
  <Gumul
    data={'https://next.json-generator.com/api/json/get/N1Zkq45bw'}
    height={310}
    freeze={2}
    columns={[
      { id: 'index', shape: CellShape.NUMBER },
      {
        id: 'username',
        childCells: [
          { label: 'id' },
          { id: 'email' }
        ]
      },
      {
        label: 'bio',
        childCells: [
          {
            label: 'body',
            childCells: [
              {
                id: 'name',
                childCells: [
                  {
                    id: 'name.first',
                    func: (v, r) => r.name.first
                  },
                  {
                    id: 'name.last',
                    func: (v, r) => r.name.last
                  }
                ]
              },
              {
                label: 'identity', childCells: [
                  { id: 'skin' },
                  { id: 'eye' },
                  { id: 'height' },
                  { id: 'weight' }
                ]
              }
            ]
          },
          {
            label: 'privacy',
            childCells: [
              {
                id: 'married',
                func: v => v ? 'Yes' : 'No'
              },
              {
                id: 'hire',
                func: v => new Date(v).getFullYear()
              }
            ]
          }
        ]
      },
      { id: 'about' }
    ]}
  />,
  document.getElementById('root')
)
