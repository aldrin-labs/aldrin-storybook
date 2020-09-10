import React from 'react'
import { Grid } from '@material-ui/core'

import { StyledTypography } from './AccountBlock.styles'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Loading } from '@sb/components/index'

import QueryRenderer from '@core/components/QueryRenderer'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { FundsType } from '@core/types/ChartTypes'

interface IProps {
  selectedAccount: string
  selectedCoin: string
  getFundsQuery: {
    getFunds: FundsType[]
  }
}

const Balances = ({ selectedCoin, getFundsQuery, selectedAccount }: IProps) => {
  const { getFunds = [] } = getFundsQuery || {
    getFunds: [],
  }
  const [currentElement] = getFunds.filter(
    (el: FundsType) => el.asset.symbol === selectedCoin
  )

  const { quantity, locked, free } = currentElement || {
    quantity: '0.00000000',
    locked: '0.00000000',
    free: '0.00000000',
  }

  return (
    <Grid item id="balances_block" style={{ padding: '3rem 7rem' }}>
      {currentElement && currentElement.keyId !== selectedAccount && (
        <Loading width={'3rem'} height={'3rem'} size={24} />
      )}
      <Grid container justify="space-between">
        <StyledTypography>Total balance:</StyledTypography>

        <StyledTypography style={{ color: '#16253D' }}>
          {`${stripDigitPlaces(quantity, 8)} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>In order:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${stripDigitPlaces(locked, 8)} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
      <Grid container justify="space-between">
        <StyledTypography>Available balance:</StyledTypography>
        <StyledTypography style={{ color: '#16253D' }}>
          {`${stripDigitPlaces(free, 8)} ${selectedCoin}`}
        </StyledTypography>
      </Grid>
    </Grid>
  )
}

const BalancesWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={Balances}
      withOutSpinner={true}
      withTableLoader={true}
      //withoutLoading={true}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: props.selectedAccount } }}
      name={`getFundsQuery`}
      fetchPolicy="cache-and-network"
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
