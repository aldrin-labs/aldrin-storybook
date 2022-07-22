import React from 'react'
import { useTheme } from 'styled-components'

import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import { BalanceCard, Title, Header } from './styles'

const TotalTokensValueComponent = ({
  totalTokensValue,
}: {
  totalTokensValue: number
}) => {
  const theme = useTheme()
  return (
    <BalanceCard background="rgba(80, 39, 191, 0.42)">
      <Title>Wallet Balance</Title>
      <Header fontSize="3.5rem" fontFamily="Avenir Next Demi">
        ${totalTokensValue.toFixed(2)}
      </Header>
    </BalanceCard>
  )
}

const MemoizedTotalTokensValueComponent = React.memo(TotalTokensValueComponent)

const HeaderNameRow = () => (
  <Row
    justify="space-around"
    height="100%"
    align="baseline"
    direction="column"
    width="40%"
  >
    <Header color="white1">Rebalance</Header>
    <Text>Diversify your portfolio with ease.</Text>
  </Row>
)

const MemoizedHeaderNameRow = React.memo(HeaderNameRow)

const RebalanceHeaderComponent = ({
  totalTokensValue,
  leftToDistributeValue,
}: {
  totalTokensValue: number
  leftToDistributeValue: number
}) => {
  const theme = useTheme()
  return (
    <RowContainer margin="0 0 2rem 0" height="calc(16%)">
      <MemoizedHeaderNameRow />
      <Row justify="space-between" height="100%" width="60%">
        <MemoizedTotalTokensValueComponent
          totalTokensValue={totalTokensValue}
        />
        <BalanceCard background="rgba(80, 39, 191, 0.42)">
          <Title>Left to distribute</Title>{' '}
          <Header fontSize="3.5rem" fontFamily="Avenir Next Demi">
            ${leftToDistributeValue.toFixed(2)}
          </Header>
        </BalanceCard>
      </Row>
    </RowContainer>
  )
}

export default RebalanceHeaderComponent
