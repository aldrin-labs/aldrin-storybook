import React from 'react'

import { storiesOf } from '@storybook/react'

import { backgrounds } from './backgrounds'
import CoinMarketTable from '@components/CoinMarketTable/CoinMarketTable'

storiesOf('CoinMarketTable', module)
  .addDecorator(backgrounds)
  .add(
    'CoinMarketTable',
    () => withInfo()(
      <CoinMarketTable />
    )
  )
