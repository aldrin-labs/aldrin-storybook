import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'
import DominanceChart from '@components/DominanceChart'

storiesOf('Components/DominanceChart', module)
  .addDecorator(backgrounds)
  .add(
    'DominanceChart',
    () => (
      <DominanceChart />
    )
  )
