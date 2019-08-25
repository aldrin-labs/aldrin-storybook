import React, { useEffect } from 'react'
import { compose } from 'recompose'
import moment from 'moment'

import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { MyTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'
import { getActionsSummary } from './TransactionsActionsStatistic.utils'

import { Grid } from '@material-ui/core'

import {
  TransactionActions,
  TransactionActionsTypography,
  TransactionActionsSubTypography,
  TransactionActionsNumber,
  TransactionsActionsActionWrapper,
  TransactionActionsAction,
} from './TransactionsActionsStatistic.styles'

const Block = ({ actions, refetch }) => {
  const {
    trades,
    deposits,
    withdrawals,
  }: {
    trades: number
    deposits: number
    withdrawals: number
  } = getActionsSummary(actions.myPortfolios[0].portfolioActions.trades)

  useEffect(() => {
    refetch()
  }, [actions])

  return (
    <TransactionActions>
      <Grid container justify="space-between" alignItems="flex-start">
        <TransactionActionsTypography>
          Actions today
        </TransactionActionsTypography>
        <TransactionActionsNumber>
          {trades + deposits + withdrawals}
        </TransactionActionsNumber>
      </Grid>

      <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
        <TransactionsActionsActionWrapper>
          <TransactionActionsAction>
            <h6>Deposits</h6>
            <TransactionActionsSubTypography>
              {deposits}
            </TransactionActionsSubTypography>
          </TransactionActionsAction>
          <TransactionActionsAction>
            <h6>Withdrawals</h6>
            <TransactionActionsSubTypography>
              {withdrawals}
            </TransactionActionsSubTypography>
          </TransactionActionsAction>
        </TransactionsActionsActionWrapper>

        <TransactionsActionsActionWrapper>
          <TransactionActionsAction>
            <h6>Trades</h6>
            <TransactionActionsSubTypography>
              {trades}
            </TransactionActionsSubTypography>
          </TransactionActionsAction>
        </TransactionsActionsActionWrapper>
      </Grid>
    </TransactionActions>
  )
}

export const DaysBlock = compose(
  queryRendererHoc({
    name: 'actions',
    query: MyTradesQuery,
    withOutSpinner: false,
    variables: {
      input: {
        page: 0,
        perPage: 600,
        startDate: moment()
          .subtract(1, 'days')
          .valueOf(),
        endDate: moment().valueOf(),
      },
    },
  })
)(Block)

export const WeekBlock = compose(
  queryRendererHoc({
    name: 'actions',
    query: MyTradesQuery,
    withOutSpinner: false,
    variables: {
      input: {
        page: 0,
        perPage: 600,
        startDate: moment()
          .subtract(1, 'weeks')
          .valueOf(),
        endDate: moment().valueOf(),
      },
    },
  })
)(Block)
