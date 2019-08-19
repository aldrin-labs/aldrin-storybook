import React, { Component } from 'react'

import { compose } from 'recompose'
import moment from 'moment'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { MyTradesQuery } from '@core/graphql/queries/portfolio/main/MyTradesQuery'

import { Grid } from '@material-ui/core'
import {
    TransactionActions,
    TransactionActionsTypography,
    TransactionActionsSubTypography,
    TransactionActionsNumber,
    TransactionsActionsActionWrapper,
    TransactionActionsAction
} from './TransactionsActionsStatistic.styles'

const getActionsSummary = actions => actions.reduce((sum, action) => {
  if (!action.isAccountTrade) {
    return {
      ...sum,
      trades: sum.trades + 1
    }
  } else if (action.type === 'deposit') {
    return {
      ...sum,
      deposits: sum.deposits + 1
    }
  }

  return {
    ...sum,
    withdrawals: sum.withdrawals + 1
  }
}, {
  deposits: 0,
  withdrawals: 0,
  trades: 0
})

class TransactionsActionsStatistic extends Component {
    render() {
        const { dayActions, weekActions } = this.props

        const dayActionsSummary = getActionsSummary(dayActions.myPortfolios[0].portfolioActions.trades)
        const weekActionsSummary = getActionsSummary(weekActions.myPortfolios[0].portfolioActions.trades)

        return (
          <Grid item>
            <TransactionActions>
              <Grid container justify="space-between" alignItems="flex-start">
                <TransactionActionsTypography>Actions today</TransactionActionsTypography>
                <TransactionActionsNumber>
                  {dayActionsSummary.trades + dayActionsSummary.deposits + dayActionsSummary.withdrawals}
                </TransactionActionsNumber>
              </Grid>
              
              <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Deposits</h6>
                      <TransactionActionsSubTypography>
                        {dayActionsSummary.deposits}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                  <TransactionActionsAction>
                      <h6>Withdrawals</h6>
                      <TransactionActionsSubTypography>
                        {dayActionsSummary.withdrawals}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>

                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Trades</h6>
                      <TransactionActionsSubTypography>
                        {dayActionsSummary.trades}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>
              </Grid>
            </TransactionActions>

            <TransactionActions>
              <Grid container justify="space-between" alignItems="flex-start">
                <TransactionActionsTypography>Actions this week</TransactionActionsTypography>
                <TransactionActionsNumber>
                  {weekActionsSummary.trades + weekActionsSummary.deposits + weekActionsSummary.withdrawals}
                </TransactionActionsNumber>
              </Grid>
              
              <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
              <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Deposits</h6>
                      <TransactionActionsSubTypography>
                        {weekActionsSummary.deposits}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                  <TransactionActionsAction>
                      <h6>Withdrawals</h6>
                      <TransactionActionsSubTypography>
                        {weekActionsSummary.withdrawals}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>

                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Trades</h6>
                      <TransactionActionsSubTypography>
                        {weekActionsSummary.trades}
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>
              </Grid>
            </TransactionActions>
          </Grid>
        )
    }
}

export default compose(
  queryRendererHoc({
    name: 'weekActions',
    query: MyTradesQuery,
    withOutSpinner: false,
    variables: {
      input: {
        page: 0,
        perPage: 600,
        startDate: moment().subtract(1, 'weeks').valueOf(),
        endDate: moment().valueOf()
      }
    }
  }),

  queryRendererHoc({
    name: 'dayActions',
    query: MyTradesQuery,
    withOutSpinner: false,
    variables: {
      input: {
        page: 0,
        perPage: 600,
        startDate: moment().subtract(1, 'days').valueOf(),
        endDate: moment().valueOf()
      }
    }
  })
)(TransactionsActionsStatistic)
