import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'

import { Card } from '@material-ui/core'

import { select, number } from '@storybook/addon-knobs'

import { backgrounds } from '../backgrounds'
import TradingWrapper from '@components/TradingWrapper'

export const TablesBlockWrapper = styled(Card)`
  width: 50%;
  border: 1px solid rgba(112, 112, 112, 0.26);
  && {
    overflow: hidden;
    background-color: rgb(22, 22, 29);
    box-shadow: none !important;
  }

`

storiesOf('Components/TradingWrapper', module)
  .addDecorator(backgrounds)
  .add(
    'TradingWrapper success',
    withInfo()(() =>
      <TablesBlockWrapper
        rightBorderColor='rgba(112, 112, 112, 0.26)'
      >
        <TradingWrapper
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
          showOrderResult={(result) => console.log(result)}
          showCancelResult={(result) => console.log(result)}    
          decimals={[8, 8]}
          />
      </TablesBlockWrapper>
    )
  )