import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import AreaChart from '@components/AreaChart'

const data = [{ x: 1, y: 2 }, { x: 2, y: 4 }]

storiesOf('AreaChart', module)
  .add(
    'AreaChart',
    withInfo({ inline: true })(() =>
      <AreaChart data={data} />
    )
  )
