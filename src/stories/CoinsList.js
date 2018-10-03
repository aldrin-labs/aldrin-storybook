import React from 'react'

import { storiesOf } from '@storybook/react'

import CoinsList from '@components/CoinsList'

storiesOf('CoinsList', module)
  .add(
    'CoinsList',
    () => (
      <CoinsList />
    )
  )
