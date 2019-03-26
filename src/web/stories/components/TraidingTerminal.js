import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'

import { Card } from '@material-ui/core'

import { select, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

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
    'TraidingTerminal Limit',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TraidingTerminal
          byType='buy'
          priceType='limit'
          pair={['BTC', 'USDT']}
          walletValue={number('walletValue', 1000000)}
          marketPrice={number('marketPrice', 4040.45)}
          confirmOperation={(values) => console.log(values)}
          />
      </TablesBlockWrapper>
    )
  ).add(
    'TraidingTerminal Market',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TraidingTerminal
          byType='buy'
          priceType='market'
          pair={['BTC', 'USDT']}
          walletValue={number('walletValue', 1000000)}
          marketPrice={number('marketPrice', 4040.45)}
          confirmOperation={(values) => console.log(values)}
          />
      </TablesBlockWrapper>
    )
  ).add(
    'TraidingTerminal Stop-limit',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TraidingTerminal
          byType='buy'
          priceType='stop-limit'
          pair={['BTC', 'USDT']}
          walletValue={number('walletValue', 1000000)}
          marketPrice={number('marketPrice', 4040.45)}
          confirmOperation={(values) => console.log(values)}
          />
      </TablesBlockWrapper>
  )
)
