import React, { PureComponent } from 'react'

import { Grid } from '@material-ui/core'

import {
  TransactionActions,
  TransactionActionsTypography,
  TransactionActionsSubTypography,
  TransactionActionsNumber,
  TransactionsActionsActionWrapper,
  TransactionActionsAction,
  TransactionActionsHeading,
} from './TransactionsActionsStatistic.styles'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

export type PortfolioTradesSummaryItemType = {
  cost: number
  fee: {
    bnb: number
    usdt: number
  }
  count: number
  realizedPnl: number
}

export type PortfolioTradesSummary = {
  _id: string
  portfolioTradesSummary: PortfolioTradesSummaryItemType
}

export interface IProps {
  includeFutures: boolean
  title: string
  portfolioTradesSummaryQuery: {
    myPortfolios: PortfolioTradesSummary[]
  }
}

class Block extends PureComponent<IProps> {
  render() {
    const { portfolioTradesSummaryQuery, title, includeFutures } = this.props

    const { myPortfolios } = portfolioTradesSummaryQuery || {
      myPortfolios: [
        {
          _id: '',
          portfolioTradesSummary: {},
        },
      ],
    }

    const portfolioTradesSummary = myPortfolios[0].portfolioTradesSummary
    const {
      cost = 0,
      fee = { bnb: 0, usdt: 0 },
      count = 0,
      realizedPnl = 0,
    } = portfolioTradesSummary || {
      cost: 0,
      fee: {
        bnb: 0,
        usdt: 0,
      },
      count: 0,
      realizedPnl: 0,
    }

    const pnlColor =
      realizedPnl > 0 ? '#29AC80' : realizedPnl < 0 ? '#DD6956' : ''
    const pnlSymbol = realizedPnl > 0 ? '+' : realizedPnl < 0 ? '-' : ''

    return (
      <TransactionActions>
        <Grid container justify="space-between" alignItems="flex-start">
          <TransactionActionsTypography>{title}</TransactionActionsTypography>
          <TransactionActionsNumber>{count}</TransactionActionsNumber>
        </Grid>

        {includeFutures && (
          <Grid container alignItems="center" style={{ marginTop: '1rem' }}>
            <TransactionsActionsActionWrapper>
              <TransactionActionsAction>
                <TransactionActionsHeading>P&L USDT</TransactionActionsHeading>
                <TransactionActionsSubTypography
                  style={{
                    color: pnlColor,
                  }}
                >
                  {`${pnlSymbol} `}
                  {formatNumberToUSFormat(
                    stripDigitPlaces(Math.abs(realizedPnl))
                  )}
                </TransactionActionsSubTypography>
              </TransactionActionsAction>
              <TransactionActionsAction>
                <TransactionActionsHeading>Fee USDT</TransactionActionsHeading>
                <TransactionActionsSubTypography>
                  {formatNumberToUSFormat(stripDigitPlaces(fee.usdt))}
                </TransactionActionsSubTypography>
              </TransactionActionsAction>
            </TransactionsActionsActionWrapper>

            <TransactionsActionsActionWrapper>
              <TransactionActionsAction>
                <TransactionActionsHeading>
                  Volume USDT
                </TransactionActionsHeading>
                <TransactionActionsSubTypography>
                  {formatNumberToUSFormat(stripDigitPlaces(cost))}
                </TransactionActionsSubTypography>
              </TransactionActionsAction>
              <TransactionActionsAction>
                <TransactionActionsHeading>Fee BNB</TransactionActionsHeading>
                <TransactionActionsSubTypography>
                  {formatNumberToUSFormat(stripDigitPlaces(fee.bnb))}
                </TransactionActionsSubTypography>
              </TransactionActionsAction>
            </TransactionsActionsActionWrapper>
          </Grid>
        )}
      </TransactionActions>
    )
  }
}

export default Block
