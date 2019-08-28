import React from 'react'

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

const Block = ({ actions, title }) => {
  const {
    trades = 0,
    deposits = 0,
    withdrawals = 0,
  }: {
    trades: number
    deposits: number
    withdrawals: number
  } = getActionsSummary(actions.myPortfolios[0].portfolioActions.trades)

  return (
    <TransactionActions>
      <Grid container justify="space-between" alignItems="flex-start">
        <TransactionActionsTypography>
          Actions {title}
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

export default Block
