import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object, number } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import DonutChart from '@components/DonutChart' 

const chartCoins = [
  {
    title: "Smart contracts",
    realValue: 1,
  },
  {
    title: "Payments",
    realValue: 1,
  },
  {
    title: "Entertainment",
    realValue: 1,
  },
  {
    title: "Blockchain platform",
    realValue: 1,
  },
  {
    title: "Privacy coin",
    realValue: 1,
  }
]

storiesOf('DonutChart', module)
  .addDecorator(backgrounds)
  .add(
    'DonutChart',
    withInfo()(() =>
      <DonutChart
        data={object('data', chartCoins)}
        width={number('width', 256)}
        height={number('height', 256)}
        radius={number('radius', 128)}
      />
  )
)