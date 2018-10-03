import React from 'react'

import { storiesOf } from '@storybook/react'

import DominanceChart from '@components/DominanceChart'

storiesOf('DominanceChart', module)
  .add(
    'DominanceChart',
    () => (
      <DominanceChart />
    )
  )
