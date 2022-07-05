import { Grid } from '@material-ui/core'
import React from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'

import { queryRendererHoc } from '@sb/components/QueryRenderer'

import { getPortfolioAssets } from '@core/graphql/queries/portfolio/getPortfolioAssets'
import { getPortfolioAssetsData } from '@core/utils/Overview.utils'
import {
  stripDigitPlaces,
  combineTableData,
  formatNumberToUSFormat,
} from '@core/utils/PortfolioTableUtils'

const Title = styled.span`
  font-family: Avenir Next Demi;
  font-size: 1.2rem;
  text-transform: capitalize;
  color: ${(props) => props.theme.palette.grey.text};
`

const Value = styled(Title)`
  color: ${(props) => props.theme.palette.blue.light};
`

const TotalBalance = ({ portfolioAssets, theme }) => {
  const filteredData = combineTableData(
    portfolioAssets.myPortfolios[0].portfolioAssets || []
  )

  const { totalKeyAssetsData } = getPortfolioAssetsData(filteredData, 'USDT')

  return (
    <Grid
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{
        display: 'flex',
        height: '100%',
        borderLeft: theme.palette.border.main,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        padding: '0 1.5rem',
      }}
    >
      <Title theme={theme}>total balance</Title>
      <Value theme={theme}>
        ${formatNumberToUSFormat(stripDigitPlaces(totalKeyAssetsData.value, 2))}
      </Value>
    </Grid>
  )
}

export default compose(
  queryRendererHoc({
    query: getPortfolioAssets,
    name: 'portfolioAssets',
    withOutSpinner: true,
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      baseCoin: 'USDT',
      innerSettings: true,
    }),
  })
)(TotalBalance)
