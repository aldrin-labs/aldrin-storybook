import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { backgrounds } from '../backgrounds'
import { TraidingTerminal } from '@components/TraidingTerminal'

storiesOf('Components/TraidingTerminal', module)
  .addDecorator(backgrounds)
  .add(
    'TraidingTerminal',
    withInfo()(() =>
      <div style={{width: 300}}>
        <TraidingTerminal />
      </div>
  )
)
