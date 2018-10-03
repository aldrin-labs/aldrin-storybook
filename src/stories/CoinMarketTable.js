import React from 'react'

import { storiesOf } from '@storybook/react'

import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'

storiesOf('CoinMarketTable', module)
  .add(
    'CoinMarketTable',
    () => (
      <CoinMarketTable />
    )
  )
