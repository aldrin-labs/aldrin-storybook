import React, { Component } from 'react'
import { Grid } from '@material-ui/core'

import QueryRenderer from '@core/components/QueryRenderer'
import { MySpotTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'
import { TransactionActionsTypography } from './../TransactionsActionsStatistic/TransactionsActionsStatistic.styles'
import {
  WinLossRatioNumber,
  TypographyProfit,
  WinLossRatioChart,
} from './WinLossRatio.styles'

class WinLossRatio extends Component {
  render() {
    return (
      <Grid container alignItems="stretch" justify="space-between">
        <Grid style={{ width: '80%' }}>
          <Grid
            style={{
              borderBottom: '1px solid #e0e5ec',
              marginBottom: '2rem',
              paddingBottom: '2rem',
            }}
          >
            <TransactionActionsTypography>win</TransactionActionsTypography>
            <WinLossRatioNumber>24</WinLossRatioNumber>
            <TypographyProfit profit>+ $12,500.32</TypographyProfit>
          </Grid>
          <Grid>
            <TransactionActionsTypography>Loss</TransactionActionsTypography>
            <WinLossRatioNumber>11</WinLossRatioNumber>
            <TypographyProfit>- $12,500.32</TypographyProfit>
          </Grid>
        </Grid>

        <WinLossRatioChart win={70} />
      </Grid>
    )
  }
}

const WinLossRatioWithPeriod = ({ ...props }) => {
  let { startDate, endDate } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={WinLossRatio}
      withOutSpinner={true}
      query={MySpotTradesQuery}
      name={`myTrades`}
      fetchPolicy="network-only"
      variables={{
        input: {
          page: 0,
          perPage: 600,
          startDate,
          endDate,
        },
      }}
      {...props}
    />
  )
}

export default WinLossRatioWithPeriod
