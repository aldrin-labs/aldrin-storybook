import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import UserLiquitidyTable from './components/Tables/UserLiquidity'
import AllPoolsTable from './components/Tables/Pools'
import {
  CreatePoolPopup,
  WithdrawalPopup,
  AddLiquidityPopup,
} from './components/Popups'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '../Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolInfo, PoolsPrices } from './index.types'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

const Pools = ({
  theme,
  getDexTokensPricesQuery,
}: {
  theme: Theme
  getDexTokensPricesQuery: { getDexTokensPrices: PoolsPrices[] }
}) => {
  const [
    refreshAllTokensDataCounter,
    setRefreshAllTokensDataCounter,
  ] = useState<number>(0)
  const [allTokensData, setAllTokensData] = useState<TokenInfo[]>([])
  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isCreatePoolPopupOpen, setIsCreatePoolPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()

  const { getDexTokensPrices = [] } = getDexTokensPricesQuery || {
    getDexTokensPrices: [],
  }

  const refreshAllTokensData = () =>
    setRefreshAllTokensDataCounter(refreshAllTokensDataCounter + 1)

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
    <RowContainer direction={'column'} padding={'2rem 3rem'}>
      <RowContainer justify={'space-between'}>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TotalVolumeLockedChart theme={theme} />
        </BlockTemplate>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
          style={{ position: 'relative' }}
        >
          <TradingVolumeChart theme={theme} />
        </BlockTemplate>
      </RowContainer>

      {wallet.connected ? (
        <UserLiquitidyTable
          allTokensData={allTokensData}
          theme={theme}
          wallet={wallet}
          selectedPool={selectedPool}
          selectPool={selectPool}
          poolsPrices={getDexTokensPrices}
          setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
          setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
        />
      ) : null}

      <AllPoolsTable
        theme={theme}
        selectPool={selectPool}
        poolsPrices={getDexTokensPrices}
        setIsCreatePoolPopupOpen={setIsCreatePoolPopupOpen}
        setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
      />

      <CreatePoolPopup
        theme={theme}
        poolsPrices={getDexTokensPrices}
        close={() => setIsCreatePoolPopupOpen(false)}
        open={isCreatePoolPopupOpen}
        allTokensData={allTokensData}
        refreshAllTokensData={refreshAllTokensData}
      />

      {selectedPool && (
        <AddLiquidityPopup
          theme={theme}
          poolsPrices={getDexTokensPrices}
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
          poolsPrices={getDexTokensPrices}
          allTokensData={allTokensData}
          close={() => setIsWithdrawalPopupOpen(false)}
          open={isWithdrawalPopupOpen}
          refreshAllTokensData={refreshAllTokensData}
        />
      )}
    </RowContainer>
  )
}

const Wrapper = compose(
  withTheme(),
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000,
  })
)(Pools)

export { Wrapper as PoolsComponent }
