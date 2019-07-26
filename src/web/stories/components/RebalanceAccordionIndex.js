import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'
import RebalanceDialogTransaction from '@components/RebalanceDialogTransaction/RebalanceDialogTransaction'

storiesOf('Components/RebalanceDialogTransaction', module)
  .addDecorator(backgrounds)
  .add(
    'RebalanceDialogTransaction',
    withInfo()(() =>
      <RebalanceDialogTransaction />
  )
)
