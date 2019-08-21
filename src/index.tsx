import React from 'react'
import ReactDOM from 'react-dom'

import Gumul from './Gumul'
import { CellType } from './components/Cell'

import 'core-js/es/map'
import 'core-js/es/set'
import 'react-app-polyfill/ie9'

import './Gumul.scss'

ReactDOM.render(
  <Gumul
    data={'./sample-row-10.json'}
    height={310}
    freeze={2}
    columns={[
      { id: 'index', type: CellType.NUMBER },
      {
        id: 'username',
        childCells: [
          { label: 'id' },
          { id: 'email' },
          {
            id: 'name',
            childCells: [
              {
                id: 'name.first',
                func: ({ name }) => name.first
              },
              {
                id: 'name.last',
                func: ({ name }) => name.last
              }
            ]
          }
        ]
      },
      {
        label: 'bio',
        childCells: [
          {
            label: 'body',
            childCells: [
              { id: 'height', func: ({ bio }) => bio.height },
              { id: 'weight', func: ({ bio }) => bio.weight },
              {
                label: 'identity', childCells: [
                  { id: 'skin', func: ({ bio }) => bio.skin },
                  { id: 'eyes', func: ({ bio }) => bio.eyes }
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
                func: ({ hire }) => new Date(hire).getFullYear()
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
