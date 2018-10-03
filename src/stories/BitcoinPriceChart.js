import React from 'react'

import { storiesOf } from '@storybook/react'

import BircoinBarChart from '@components/BircoinBarChart/BircoinBarChart'

storiesOf('BircoinBarChart', module)
  .add(
    'BircoinBarChart',
    () => (
      <BircoinBarChart />
    )
  )
