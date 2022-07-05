import { Theme, withTheme } from '@material-ui/core'
import { COLORS } from '@variables/variables'
import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { useWallet } from '@sb/dexUtils/wallet'

import Close from '@icons/closeIcon.svg'

import {
  stopFarmingV2,
  useFarm,
  useFarmer,
} from '../../../../../dexUtils/farming'
import { Button } from '../../Tables/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'

interface UnstakePopupProps {
  theme: Theme
  allTokensData: TokenInfo[]
  selectedPool: PoolInfo
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}

const Popup: React.FC<UnstakePopupProps> = (props) => {
  const {
    theme,
    allTokensData,
    selectedPool,
    close,
    refreshTokensWithFarmingTickets,
    setPoolWaitingForUpdateAfterOperation,
  } = props
  const { wallet } = useWallet()
  const connection = useConnection()

  const [operationLoading, setOperationLoading] = useState(false)
  const farm = useFarm(selectedPool.poolTokenMint)
  const farmer = useFarmer(farm?.publicKey.toString())

  const { address: userPoolTokenAccount } = getTokenDataByMint(
    allTokensData,
    selectedPool.poolTokenMint
  )

  if (!farm) return null

  const isUnstakeLocked = farmer?.account.vested.amount.gtn(0)
  const isUnstakeDisabled = isUnstakeLocked || operationLoading

  const unstake = async () => {
    if (!farm) {
      throw new Error('no Farm!')
    }
    if (!farmer) {
      throw new Error('no Farmer!')
    }
    // loader in popup button
    setOperationLoading(true)
    // loader in table button
    setPoolWaitingForUpdateAfterOperation({
      pool: selectedPool.swapToken,
      operation: 'unstake',
    })

    const result = await stopFarmingV2({
      wallet,
      connection,
      farm,
      userTokens: allTokensData,
      amount: parseFloat(farmer.account.staked.amount.toString()),
    })

    setOperationLoading(false)

    notify({
      type: result === 'success' ? 'success' : 'error',
      message:
        result === 'success'
          ? 'Successfully unstaked.'
          : result === 'failed'
          ? 'Unstaking failed, please try again later or contact us in telegram.'
          : 'Unstaking cancelled.',
    })

    const clearPoolWaitingForUpdate = () =>
      setPoolWaitingForUpdateAfterOperation({
        pool: '',
        operation: '',
      })

    if (result === 'success') {
      refreshTokensWithFarmingTickets()
      clearPoolWaitingForUpdate()
      close()
    } else {
      clearPoolWaitingForUpdate()
      close()
    }
  }
  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {}}
      maxWidth="md"
      open
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify="space-between" width="100%">
        <BoldHeader>Unstake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize="1.4rem">
          You need to unstake pool tokens to be able to withdraw liquidity. You
          still be able to claim rewards in “Your Liquidity” tab.{' '}
        </Text>
      </RowContainer>

      <RowContainer justify="space-between" margin="2rem 0 0 0">
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: COLORS.success,
          }}
        >
          {TRANSACTION_COMMON_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin="3rem 0 2rem 0">
        <DarkTooltip
          title={
            isUnstakeLocked
              ? `Withdraw will be available in a few minutes`
              : null
          }
        >
          <div style={{ width: '100%', cursor: 'help' }}>
            <Button
              data-testid="unstake-lp-tokens-submit-btn"
              style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
              disabled={isUnstakeDisabled}
              isUserConfident
              theme={theme}
              showLoader={operationLoading}
              onClick={unstake}
            >
              {isUnstakeLocked ? 'Locked' : 'Unstake'}
            </Button>
          </div>
        </DarkTooltip>
      </RowContainer>
    </DialogWrapper>
  )
}

export const UnstakePopup = withTheme()(Popup)
