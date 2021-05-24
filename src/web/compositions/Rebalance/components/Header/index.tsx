import React from 'react'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BalanceCard, Title, Header } from './styles'
import { Text } from '@sb/compositions/Addressbook/index'

const TotalTokensValueComponent = ({ totalTokensValue }: { totalTokensValue: number }) => (
  <BalanceCard
    background={'linear-gradient(135deg, #1331AD 0%, #95363F 100%)'}
  >
    <Title>Wallet Balance</Title>
    <Header fontSize={'3.5rem'} fontFamily="Avenir Next Demi">
      ${totalTokensValue.toFixed(2)}
    </Header>
  </BalanceCard>
)

const MemoizedTotalTokensValueComponent = React.memo(TotalTokensValueComponent)

const RebalanceHeaderComponent = ({
  totalTokensValue,
  leftToDistributeValue,
}: {
  totalTokensValue: number
  leftToDistributeValue: number
}) => {
  return (
    <RowContainer margin={'0 0 2rem 0'} height={'calc(16%)'}>
      <Row
        justify="space-around"
        height="100%"
        align={'baseline'}
        direction={'column'}
        width={'40%'}
      >
        <Header>Rebalance</Header>
        <Text>Diversify your portfolio with ease.</Text>
      </Row>{' '}
      <Row justify={'space-between'} height={'100%'} width={'60%'}>
      <MemoizedTotalTokensValueComponent totalTokensValue={totalTokensValue} />
        <BalanceCard
          background={'linear-gradient(135deg, #1331AD 0%, #3B8D17 100%)'}
        >
          <Title>Left to distribute</Title>{' '}
          <Header fontSize={'3.5rem'} fontFamily="Avenir Next Demi">
            ${leftToDistributeValue.toFixed(2)}
          </Header>
        </BalanceCard>
      </Row>
    </RowContainer>
  )
}

export default RebalanceHeaderComponent
