import React, { Component } from 'react'

import { Grid } from '@material-ui/core'
import {
    TransactionActions,
    TransactionActionsTypography,
    TransactionActionsSubTypography,
    TransactionActionsNumber,
    TransactionsActionsActionWrapper,
    TransactionActionsAction
} from './TransactionsActionsStatistic.styles'

class TransactionsActionsStatistic extends Component {
    render() {
        return (
          <Grid item>
            <TransactionActions>
              <Grid container justify="space-between" alignItems="flex-start">
                <TransactionActionsTypography>Actions today</TransactionActionsTypography>
                <TransactionActionsNumber>11</TransactionActionsNumber>
              </Grid>
              
              <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Deposits</h6>
                      <TransactionActionsSubTypography>
                        4 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                  <TransactionActionsAction>
                      <h6>Withdrawals</h6>
                      <TransactionActionsSubTypography>
                        2 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>

                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Trades</h6>
                      <TransactionActionsSubTypography>
                        7 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>
              </Grid>
            </TransactionActions>

            <TransactionActions>
              <Grid container justify="space-between" alignItems="flex-start">
                <TransactionActionsTypography>Actions this week</TransactionActionsTypography>
                <TransactionActionsNumber>78</TransactionActionsNumber>
              </Grid>
              
              <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Deposits</h6>
                      <TransactionActionsSubTypography>
                        18 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                  <TransactionActionsAction>
                      <h6>Withdrawals</h6>
                      <TransactionActionsSubTypography>
                        30 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>
                <TransactionsActionsActionWrapper>
                  <TransactionActionsAction>
                      <h6>Trades</h6>
                      <TransactionActionsSubTypography>
                        24 <span>$218.50</span>
                      </TransactionActionsSubTypography>
                  </TransactionActionsAction>
                </TransactionsActionsActionWrapper>
              </Grid>
            </TransactionActions>
          </Grid>
        )
    }
}

export default TransactionsActionsStatistic
