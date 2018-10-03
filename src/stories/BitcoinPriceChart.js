import React from 'react'

import { storiesOf } from '@storybook/react'

import BitcoinPriceChart from '@components/BitcoinPriceChart/BitcoinPriceChart'

storiesOf('BitcoinPriceChart', module)
  .add(
    'BitcoinPriceChart',
    () => (
      <BitcoinPriceChart />
    )
  )
