import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'
import RebalanceInfoPanel from '@components/RebalanceInfoPanel/RebalanceInfoPanel'

storiesOf('Components/RebalanceInfoPanel', module)
  .addDecorator(backgrounds)
  .add(
    'RebalanceInfoPanel',
    withInfo()(() =>
      <RebalanceInfoPanel />
  )
)
