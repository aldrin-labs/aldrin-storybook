import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'

import { Card } from '@material-ui/core'

import { select, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { backgrounds } from '../backgrounds'
import TradingWithStatus from '@components/TradingWithStatus'

export const TablesBlockWrapper = styled(Card)`
  width: 50%;
  border: 1px solid rgba(112, 112, 112, 0.26);
  && {
    overflow: hidden;
    background-color: rgb(22, 22, 29);
    box-shadow: none !important;
  }

`

storiesOf('Components/TradingWithStatus', module)
  .addDecorator(backgrounds)
  .add(
    'TradingWithStatus',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TradingWithStatus
          pair={['BTC', 'USDT']}
          funds={[number('walletValue1', 1000000), number('walletValue2', 1000000)]}
          price={number('marketPrice', 4040.45)}
          placeOrder={(values) => {
            console.log(values)
            return {
              status: 'success',
              message: 'order Plased',
              orderId: 'orderId',
            }
          }}
          canselOrder={(orderId) => console.log('cansel', orderId)}
          decimals={[8, 8]}
          />
      </TablesBlockWrapper>
    )
  )