import React, { useState } from 'react'

import { Theme } from '@material-ui/core'

import { Row, RowContainer, Text } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { SearchInputWithLoop } from '../components'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'

const TablesSwitcher = ({
  theme,
  getDexTokensPricesQuery: { getDexTokensPrices }
}: {
  theme: Theme,
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [searchValue, onChangeSearch] = useState('')
  const [selectedTable, setSelectedTable] = useState('all')

  return (
    <RowContainer>
      <BlockTemplate
        width={'100%'}
        height={'auto'}
        style={{ marginTop: '2rem' }}
        align={'start'}
        theme={theme}
        direction={'column'}
        justify={'end'}
      >
        <RowContainer padding="2rem" justify={'space-between'} align="center">
          <Text theme={theme}>All Pools</Text>
          <Row
            style={{ flexWrap: 'nowrap' }}
            justify={'space-between'}
            width={'calc(100% / 3)'}
          >
            <SearchInputWithLoop
              searchValue={searchValue}
              onChangeSearch={onChangeSearch}
              placeholder={'Search...'}
            />
          </Row>
        </RowContainer>
        <AllPoolsTable
          theme={theme}
          selectPool={selectPool}
          dexTokensPrices={getDexTokensPrices}
          setIsCreatePoolPopupOpen={setIsCreatePoolPopupOpen}
          setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
        />
      </BlockTemplate>
    </RowContainer>
  )
}

export default compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  }),
  queryRendererHoc({
    name: 'getPoolsInfoQuery',
    query: getPoolsInfo,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  }),
)(TablesSwitcher)