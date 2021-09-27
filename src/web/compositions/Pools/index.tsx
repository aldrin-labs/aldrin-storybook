import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import UserLiquitidyTable from './components/Tables/UserLiquidity'
import AllPoolsTable from './components/Tables/AllPools'
import {
  CreatePoolPopup,
  WithdrawalPopup,
  AddLiquidityPopup,
} from './components/Popups'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '../Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolInfo, DexTokensPrices } from './index.types'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { WarningPopup } from '../Chart/components/WarningPopup'
import { useInterval } from '@sb/dexUtils/useInterval'
import TablesSwitcher from './components/Tables/TablesSwitcher/TablesSwitcher'

const Pools = ({
  theme,
  // getDexTokensPricesQuery,
}: {
  theme: Theme
  // getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)
  const [isWarningPopupOpen, openWarningPopup] = useState(true)

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isCreatePoolPopupOpen, setIsCreatePoolPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)


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

      {/* {wallet.connected ? (
        <UserLiquitidyTable
          allTokensData={allTokensData}
          theme={theme}
          wallet={wallet}
          selectedPool={selectedPool}
          selectPool={selectPool}
          dexTokensPrices={getDexTokensPrices}
          setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
          setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
        />
      ) : null} */}

      <TablesSwitcher
        theme={theme}
      />

      {/* <AllPoolsTable
        theme={theme}
        selectPool={selectPool}
        dexTokensPrices={getDexTokensPrices}
        setIsCreatePoolPopupOpen={setIsCreatePoolPopupOpen}
        setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
      /> */}

      {/* <CreatePoolPopup
        theme={theme}
        dexTokensPrices={getDexTokensPrices}
        close={() => setIsCreatePoolPopupOpen(false)}
        open={isCreatePoolPopupOpen}
        allTokensData={allTokensData}
        refreshAllTokensData={refreshAllTokensData}
      /> */}

      <WarningPopup
        theme={theme}
        open={isWarningPopupOpen}
        onClose={() => openWarningPopup(false)}
        isPoolsPage={true}
      />
    </RowContainer>
  )
}

const Wrapper = compose(
  withTheme(),
  // queryRendererHoc({
  //   query: getDexTokensPrices,
  //   name: 'getDexTokensPricesQuery',
  //   fetchPolicy: 'cache-and-network',
  //   withoutLoading: true,
  //   pollInterval: 60000,
  // })
)(Pools)

export { Wrapper as PoolsComponent }
