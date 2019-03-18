import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'
import { TraidingTerminal } from '@components/TraidingTerminal'

storiesOf('Components/Input', module)
  .addDecorator(backgrounds)
  .add(
    'Input',
    withInfo()(() =>
      <TraidingTerminal />
  )
)
