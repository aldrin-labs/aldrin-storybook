import React, { useEffect, useState } from 'react'

import { Theme } from '@material-ui/core'

import {
  Row,
  RowContainer,
  Text,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'
import { SearchInputWithLoop } from '../components'
import { getPoolsInfo } from '@core/graphql/queries/pools/getPoolsInfo'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import AllPoolsTable from '../Pools'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { AddLiquidityPopup, WithdrawalPopup } from '../../Popups'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

const TablesSwitcher = ({
  theme,
  getDexTokensPricesQuery: { getDexTokensPrices = [] },
}: {
  theme: Theme
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])

  const [selectedPool, selectPool] = useState(null)
  const [searchValue, onChangeSearch] = useState('')
  const [selectedTable, setSelectedTable] = useState('all')

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)

  const [
    refreshAllTokensDataCounter,
    setRefreshAllTokensDataCounter,
  ] = useState<number>(0)

  const { wallet } = useWallet()
  const connection = useConnection()

  const refreshAllTokensData = () =>
    setRefreshAllTokensDataCounter(refreshAllTokensDataCounter + 1)

  // useTokenAccountsMap - need to refresh? mb button for it and after every action?
  useEffect(() => {
    const fetchData = async () => {
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)

      await setAllTokensData(allTokensData)
    }

    if (!!wallet?.publicKey) {
      fetchData()
    }
  }, [wallet?.publicKey, refreshAllTokensDataCounter])

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
          setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
        />
        {selectedPool && (
          <AddLiquidityPopup
            theme={theme}
            dexTokensPrices={getDexTokensPrices}
            selectedPool={selectedPool}
            allTokensData={allTokensData}
            close={() => setIsAddLiquidityPopupOpen(false)}
            open={isAddLiquidityPopupOpen}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}

        {selectedPool && (
          <WithdrawalPopup
            theme={theme}
            selectedPool={selectedPool}
            dexTokensPrices={getDexTokensPrices}
            allTokensData={allTokensData}
            close={() => setIsWithdrawalPopupOpen(false)}
            open={isWithdrawalPopupOpen}
            refreshAllTokensData={refreshAllTokensData}
          />
        )}
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
  })
)(TablesSwitcher)
