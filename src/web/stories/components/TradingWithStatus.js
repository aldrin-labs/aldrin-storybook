import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'

import { Card } from '@material-ui/core'

import { select, number } from '@storybook/addon-knobs'

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
    'TradingWithStatus success',
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
              message: 'Order plased',
              orderId: 'orderId',
            }
          }}
          canselOrder={(orderId) => console.log('cansel', orderId)}
          decimals={[8, 8]}
          />
      </TablesBlockWrapper>
    )
  )
  .add(
    'TradingWithStatus error',
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
              status: 'error',
              message: 'Someting went wrong',
              orderId: 'orderId',
            }
          }}
          canselOrder={(orderId) => console.log('cansel', orderId)}
          decimals={[8, 8]}
          />
      </TablesBlockWrapper>
    )
  )