import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import UserLiquitidyTable from './components/Tables/UserLiquidity'
import AllPoolsTable from './components/Tables/Pools'
import { AddLiquidityPopup } from './components/Popups/AddLiquidity'
import { CreatePoolPopup } from './components/Popups/CreatePool'
import { WithdrawalPopup } from './components/Popups/WithdrawLiquidity'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { getAllTokensData } from '../Rebalance/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolInfo } from './index.types'

const Pools = ({ theme }: { theme: Theme }) => {
  const [allTokensData, setAllTokensData] = useState<TokenInfo[] | []>([])
  const [selectedPool, selectPool] = useState<PoolInfo | null>(null)

  const [isAddLiquidityPopupOpen, setIsAddLiquidityPopupOpen] = useState(false)
  const [isCreatePoolPopupOpen, setIsCreatePoolPopupOpen] = useState(false)
  const [isWithdrawalPopupOpen, setIsWithdrawalPopupOpen] = useState(false)

  const { wallet } = useWallet()
  const connection = useConnection()

  useEffect(() => {
    const fetchData = async () => {
      const allTokensData = await getAllTokensData(wallet.publicKey, connection)

      await setAllTokensData(allTokensData)
    }

    if (!!wallet?.publicKey) {
      fetchData()
    }
  }, [wallet?.publicKey])

  return (
    <RowContainer direction={'column'} padding={'2rem 3rem'}>
      <RowContainer justify={'space-between'}>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
        >
          <TotalVolumeLockedChart theme={theme} />
        </BlockTemplate>
        <BlockTemplate
          theme={theme}
          width={'calc(50% - 1rem)'}
          height={'30rem'}
        >
          <TradingVolumeChart theme={theme} />
        </BlockTemplate>
      </RowContainer>

      {wallet.connected ? (
        <UserLiquitidyTable
          theme={theme}
          setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
          setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
        />
      ) : null}

      <AllPoolsTable
        theme={theme}
        selectPool={selectPool}
        setIsCreatePoolPopupOpen={setIsCreatePoolPopupOpen}
        setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
      />

      <CreatePoolPopup
        theme={theme}
        close={() => setIsCreatePoolPopupOpen(false)}
        open={isCreatePoolPopupOpen}
        allTokensData={allTokensData}
      />

      {selectedPool && (
        <AddLiquidityPopup
          theme={theme}
          selectedPool={selectedPool}
          close={() => setIsAddLiquidityPopupOpen(false)}
          open={isAddLiquidityPopupOpen}
        />
      )}

      {selectedPool && (
        <WithdrawalPopup
          theme={theme}
          selectedPool={selectedPool}
          close={() => setIsWithdrawalPopupOpen(false)}
          open={isWithdrawalPopupOpen}
        />
      )}
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
