import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { number, object } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import { HeatMapChart } from '@components/HeatMapChart'

const data = [
  {
    x: 1,
    y: 10,
    color: 'red'
  },
  {
    x: 2,
    y: 10,
    color: 'green'
  }
]
const groupId = 'GROUP-ID1'

storiesOf('HeatMapChart', module)
  .addDecorator(backgrounds)
  .add(
    'HeatMapChart',
    withInfo()(() =>
      <HeatMapChart
        data={object('data', data, groupId)}
        width={number('width', 100)}
        height={number('height', 100)}
      />
  )
)