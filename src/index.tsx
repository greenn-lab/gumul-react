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
    data={'./sample-row-100.json'}
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
                func: (v, r) => r.name.first
              },
              {
                id: 'name.last',
                func: (v, r) => r.name.last
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
              { id: 'height', func: (v, r) => r.bio.height },
              { id: 'weight', func: (v, r) => r.bio.weight },
              {
                label: 'identity', childCells: [
                  { id: 'skin', func: (v, r) => r.bio.skin },
                  { id: 'eyes', func: (v, r) => r.bio.eyes }
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
