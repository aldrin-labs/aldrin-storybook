import React, { useState } from 'react'
import { compose } from 'recompose'
import { withTheme, Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from './index.styles'
import { TotalVolumeLockedChart, TradingVolumeChart } from './components/Charts'
import { UserLiquitidyTable } from './components/Tables/UserLiquidity'
import { AllPoolsTable } from './components/Tables/Pools'
import { AddLiquidityPopup } from './components/Popups/AddLiquidity'
import { CreatePoolPopup } from './components/Popups/CreatePool'
import { WithdrawalPopup } from './components/Popups/Withdraw Liquidity'

const Pools = ({ theme }: { theme: Theme }) => {
  const [isAddLiquidityPopupOpen, changeLiquidityPopupState] = useState(false)
  const [isCreatePoolPopupOpen, changeCreatePoolPopupState] = useState(false)
  const [isWithdrawalPopupOpen, changeWithdrawalPopupState] = useState(false)

  return (
    <RowContainer direction={'column'} padding={'2rem 15rem'}>
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
      <UserLiquitidyTable
        theme={theme}
        changeLiquidityPopupState={changeLiquidityPopupState}
        changeWithdrawalPopupState={changeWithdrawalPopupState}
      />
      <AllPoolsTable
        changeCreatePoolPopupState={changeCreatePoolPopupState}
        theme={theme}
      />
      <AddLiquidityPopup
        theme={theme}
        close={() => changeLiquidityPopupState(false)}
        open={isAddLiquidityPopupOpen}
      />
      <CreatePoolPopup
        theme={theme}
        close={() => changeCreatePoolPopupState(false)}
        open={isCreatePoolPopupOpen}
      />
      <WithdrawalPopup
        theme={theme}
        close={() => changeWithdrawalPopupState(false)}
        open={isWithdrawalPopupOpen}
      />
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Pools)

export { Wrapper as PoolsComponent }
