import React, { useState } from 'react'
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

const Pools = ({ theme }: { theme: Theme }) => {
  const { wallet } = useWallet()
  const [selectedPool, selectPool] = useState({})

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
      <AddLiquidityPopup
        theme={theme}
        selectedPool={selectedPool}
        close={() => setIsAddLiquidityPopupOpen(false)}
        open={isAddLiquidityPopupOpen}
      />
      <CreatePoolPopup
        theme={theme}
        close={() => setIsCreatePoolPopupOpen(false)}
        open={isCreatePoolPopupOpen}
      />
      <WithdrawalPopup
        theme={theme}
        selectedPool={selectedPool}
        close={() => setIsWithdrawalPopupOpen(false)}
        open={isWithdrawalPopupOpen}
      />
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
