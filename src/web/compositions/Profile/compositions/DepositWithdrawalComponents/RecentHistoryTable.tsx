import React from 'react'
import { Grid } from '@material-ui/core'

import { StyledTable } from './RecentHistoryTable.styles'
import { columnNames } from './RecentHistoryTable.utils'
import { combineRecentHistoryTable } from './RecentHistoryTable.utils'
import { PortfolioAction } from './RecentHistoryTable.types'

import QueryRenderer from '@core/components/QueryRenderer'
import { getTransactionsInfo } from '@core/graphql/queries/portfolio/getTransactionsInfo'

const RecentHistoryTable = ({
  getTransactionsInfo,
  isDepositPage,
}: {
  getTransactionsInfo: {
    myPortfolios: {
      portfolioActions: PortfolioAction
    }[]
  }
  isDepositPage: true
}) => {
  const body = combineRecentHistoryTable(
    getTransactionsInfo.myPortfolios[0].portfolioActions,
    isDepositPage
  )

  return (
    <Grid style={{ height: '30%' }}>
      <StyledTable
        style={{
          height: '100%',
          position: 'relative',
          overflowY: 'scroll',
          // overflowX: 'hidden',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          border: '2px solid rgb(224, 229, 236)',
          boxShadow: 'rgba(8, 22, 58, 0.1) 0px 0px 32px',
        }}
        id="Deposits"
        padding="dense"
        data={{ body: body }}
        columnNames={columnNames}
        emptyTableText="No history"
        tableStyles={{
          heading: {
            top: '-1px',
            padding: '.6rem 1.6rem .6rem 1.2rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            letterSpacing: 0.5,
            borderBottom: '2px solid #e0e5ec',
            whiteSpace: 'nowrap',
            color: '#7284A0',
            background: '#F2F4F6',
          },
          cell: {
            padding: '1.2rem 1.6rem 1.2rem 1.2rem',
            fontFamily: "'DM Sans Bold', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#7284A0',
          },
        }}
      />
    </Grid>
  )
}

const TableDataWrapper = ({ ...props }) => {
  let {
    specificKey = '',
    page = 0,
    perPage = 20,
    includeExchangeTransactions = true,
    includeTrades = false,
    includeFutures = false,
  } = props

  return (
    <QueryRenderer
      component={RecentHistoryTable}
      withOutSpinner={true}
      withTableLoader={true}
      query={getTransactionsInfo}
      fetchPolicy={`cache-and-network`}
      name={`getTransactionsInfo`}
      variables={{
        input: {
          specificKey: {
            enabled: true,
            specificKeyId: specificKey,
          },
          page,
          perPage,
          includeExchangeTransactions,
          includeTrades,
          includeFutures,
        },
      }}
      {...props}
    />
  )
}

export default TableDataWrapper
