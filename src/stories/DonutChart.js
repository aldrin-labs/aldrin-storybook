import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { object, number, string } from '@storybook/addon-knobs/react'

import { backgrounds } from './backgrounds'
import DonutChart from '@components/DonutChart' 

const chartCoins = [
  {
    label: "Payments",
    realValue: 25.1,
  },
  {
    label: "Entertainment",
    realValue: 10,
  },
  {
    label: "Blockchain platform",
    realValue: 14,
  },
  {
    label: "Privacy coin",
    realValue: 17,
  },
  {
    label: "Some other things",
    realValue: 30,
  },
]

storiesOf('DonutChart', module)
  .addDecorator(backgrounds)
  .add(
    'DonutChart',
    withInfo()(() =>
      <DonutChart
        labelPlaceholder={string('labelPlaceholder', 'Industries %')}
        data={object('data', chartCoins)}
        radius={number('radius', 128)}
        thickness={number('thickness', 20)}
      />
  )
)