import React from 'react'

import {
  WatchListContainer,
  WatchItemWrapper,
  ScrollContainer,
  SubvaluesContainer,
  WatchSubvalue,
  WatchLabel,
} from '../Chart.styles'

import ChartCardHeader from '@sb/components/ChartCardHeader'

const WatchItem = ({
  label,
  subvalues,
}: {
  label: string
  subvalues: {
    price: number | string
    percentages: string
    total: number | string
  }
}) => {
  return (
    <WatchItemWrapper>
      <WatchLabel>{label}</WatchLabel>
      <SubvaluesContainer>
        <WatchSubvalue color={'#7284A0'}>{subvalues.price}</WatchSubvalue>
        <WatchSubvalue color={'#2F7619'}>{subvalues.percentages}</WatchSubvalue>
        <WatchSubvalue color={'#7284A0'}>{subvalues.total}</WatchSubvalue>
      </SubvaluesContainer>
    </WatchItemWrapper>
  )
}

export const WatchList = () => (
  <WatchListContainer>
    <ChartCardHeader>Watchlist</ChartCardHeader>
    {/* query renderer for watchlist */}
    <ScrollContainer style={{ overflowY: 'auto' }}>
      {new Array(10)
        .fill(
          {
            label: 'Bitfinex BTCUSDT',
            subvalues: {
              price: 10084.0,
              percentages: '+4.23%',
              total: '10.94K',
            },
          },
          0,
          10
        )
        .map(({ label, subvalues }) => (
          <WatchItem label={label} subvalues={subvalues} />
        ))}
    </ScrollContainer>
  </WatchListContainer>
)
