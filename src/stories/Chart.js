import React from 'react'

import { storiesOf } from '@storybook/react'

import {SingleChart} from '@components/Chart/Chart'

const [base, quote] = 'BTC_USDT'.split('_')

storiesOf('Chart', module)
  .add(
    'Chart',
    () => (
      <SingleChart additionalUrl={`/?symbol=${base}/${quote}`} />
    )
  )
