import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object, number } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import DonutChart from '@components/DonutChart' 

const chartCoins = [
  {
    angle: 30.589999999999996,
    label: "Smart contracts",
    title: "Smart contracts",
    realValue: "30.59%"
  },
  {
    angle: 31.45, label: "Payments",
    title: "Payments",
    realValue: "31.45%"
  },
  {
    angle: 16.58,
    label: "Entertainment",
    title: "Entertainment",
    realValue: "16.58%"
  },
  {
    angle: 21.38,
    label: "Blockchain platform",
    title: "Blockchain platform",
    realValue: "21.38%"
  },
  {
    angle: 0,
    label: "Privacy coin",
    title: "Privacy coin",
    realValue: "0.00%"
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