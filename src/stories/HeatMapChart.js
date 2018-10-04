import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { HeatMapChart } from '@components/HeatMapChart'

//const data = 

storiesOf('HeatMapChart', module)
  .add(
    'HeatMapChart',
    withInfo({ inline: true })(() =>
      <HeatMapChart />
    )
  )
