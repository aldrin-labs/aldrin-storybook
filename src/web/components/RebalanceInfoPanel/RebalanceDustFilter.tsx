import React from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import styled from 'styled-components'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_DUST_FILTER_REBALANCE } from '@core/graphql/queries/portfolio/rebalance/getDustFilterRebalance'
import { getMyPortfolioQuery } from '@core/graphql/queries/portfolio/rebalance/getMyPortfolioQuery'
import { toggleDustFilterRebalance } from '@core/graphql/mutations/portfolio/toggleDustFilterRebalance'

import Checkbox from '@material-ui/core/Checkbox'

const StyledCheckox = styled(Checkbox)`
  & svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`

const RebalanceDustFilter = (props: any) => {
  const {
    forceUpdate,
    toggleDustFilter,
    rebalanceDustFilter: {
      dustFilterRebalance: { enabled },
    },
  } = props

  return (
    <StyledCheckox
      checked={enabled}
      onChange={async () => {
        await toggleDustFilter()
        await forceUpdate()
      }}
    />
  )
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
