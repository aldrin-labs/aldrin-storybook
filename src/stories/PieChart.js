import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import PieChart from '@components/PieChart' 

const chartCoins = [
  {
    angle: 30.589999999999996,
    label: "Smart contracts",
    title: "Smart contracts",
    color: "#EFC151",
    realValue: "30.59%"
  },
  {
    angle: 31.45, label: "Payments",
    title: "Payments",
    color: "#E85454",
    realValue: "31.45%"
  },
  {
    angle: 16.58,
    label: "Entertainment",
    title: "Entertainment",
    color: "#BB118D",
    realValue: "16.58%"
  },
  {
    angle: 21.38,
    label: "Blockchain platform",
    title: "Blockchain platform",
    color: "#C79B42",
    realValue: "21.38%"
  },
  {
    angle: 0,
    label: "Privacy coin",
    title: "Privacy coin",
    color: "#6DC56F",
    realValue: "0.00%"
  }
]

storiesOf('PieChart', module)
  .addDecorator(backgrounds)
  .add(
    'PieChart',
    withInfo()(() =>
      <PieChart
        data={object('data', chartCoins)}
        width={256}
        height={256}
        radius={128}
        colorLegend={true}
      />
  )
)