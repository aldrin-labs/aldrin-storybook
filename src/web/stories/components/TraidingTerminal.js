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
      <div style={{width: '50%'}}>
        <TraidingTerminal
          type='buy'
          pair={['BTC', 'USDT']}
          amount={0}
          marketPrice={4040.45}
          />
      </div>
  )
)
