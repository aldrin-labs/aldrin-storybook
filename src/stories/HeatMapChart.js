import React from 'react'

import { storiesOf } from '@storybook/react'

import HeatMapChart from '@components/HeatMapChart'

//const data = 

storiesOf('HeatMapChart', module)
  .add(
    'HeatMapChart',
    () => (
      <HeatMapChart />
    )
  )
