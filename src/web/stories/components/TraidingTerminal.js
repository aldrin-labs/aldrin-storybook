import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'

import { Card } from '@material-ui/core'

import { backgrounds } from '../backgrounds'
import TraidingTerminal from '@components/TraidingTerminal'

export const TablesBlockWrapper = styled(Card)`
  width: 50%;
  border: 1px solid rgba(112, 112, 112, 0.26);
  && {
    overflow: hidden;
    background-color: rgb(22, 22, 29);
    box-shadow: none !important;
  }

`

storiesOf('Components/TraidingTerminal', module)
  .addDecorator(backgrounds)
  .add(
    'TraidingTerminal',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TraidingTerminal
          byType='buy'
          priceType='stop-limit'
          pair={['BTC', 'USDT']}
          wallet={0}
          marketPrice={4040.45}
          />
      </TablesBlockWrapper>
  )
)
