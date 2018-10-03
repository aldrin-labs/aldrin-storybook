import React from 'react'

import { storiesOf } from '@storybook/react'

import Chart from '@components/Chart'

storiesOf('Chart', module)
  .add(
    'Chart',
    () => (
      <Chart />
    )
  )
