import React from 'react'
import { Grid } from '@material-ui/core'

import { StyledTypography } from './AccountBlock.styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { FundsType } from '@core/types/ChartTypes'

interface IProps {
  selectedCoin: string
  getFundsQuery: {
    getFunds: FundsType[]
  }
}

const Balances = ({ selectedCoin, getFundsQuery }: IProps) => {
  const { getFunds } = getFundsQuery
  const [currentElement] = getFunds.filter(
    (el: FundsType) => el.asset.symbol === selectedCoin
  )

  const { quantity, locked, free } = currentElement || {
    quantity: '-',
    locked: '-',
    free: '-',
  }

  return (
    <Grid item id="balances_block" style={{ padding: '3rem 7rem' }}>
      <Grid container justify="space-between">
        <StyledTypography>Total balance:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${quantity} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>In order:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${locked} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>Available balance:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${free} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
    </Grid>
  )
}

const BalancesWrapper = ({...props}) => {
  return (
    <QueryRenderer
      component={Balances}
      withOutSpinner={true}
      withTableLoader={true}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: props.selectedAccount } }}
      name={`getFundsQuery`}
      fetchPolicy="network-only"
      subscriptionArgs={{
        subscription: FUNDS,
        variables: {
          listenFundsInput: { activeExchangeKey: props.selectedAccount },
        },
        updateQueryFunction: updateFundsQuerryFunction,
      }}
      {...props}
    />
  )
}

export default BalancesWrapper
