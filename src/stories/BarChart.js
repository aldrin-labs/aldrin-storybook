import React from 'react'

import { storiesOf } from '@storybook/react'

import BarChart from '@components/BarChart/BarChart'

storiesOf('BarChart', module)
  .add(
    'BarChart',
    () => (
      <BarChart />
    )
  )
