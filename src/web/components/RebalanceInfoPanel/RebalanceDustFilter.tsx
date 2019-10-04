import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_DUST_FILTER_REBALANCE } from '@core/graphql/queries/portfolio/rebalance/getDustFilterRebalance'
import { getMyPortfolioQuery } from '@core/graphql/queries/portfolio/rebalance/getMyPortfolioQuery'
import { toggleDustFilterRebalance } from '@core/graphql/mutations/portfolio/toggleDustFilterRebalance'

import Switch from '@material-ui/core/Switch'

const RebalanceDustFilter = (props: any) => {
  const {
    toggleDustFilter,
    rebalanceDustFilter: {
      dustFilterRebalance: { enabled },
    },
  } = props

  return <Switch checked={enabled} onChange={toggleDustFilter} />
}

export default compose(
  queryRendererHoc({
    query: GET_DUST_FILTER_REBALANCE,
    name: 'rebalanceDustFilter',
  }),
  graphql(toggleDustFilterRebalance, {
    name: 'toggleDustFilter',
    options: {
      refetchQueries: [
        {
          query: getMyPortfolioQuery,
          variables: { baseCoin: 'USDT', forRebalance: true },
        },
      ],
    },
  })
)(RebalanceDustFilter)
