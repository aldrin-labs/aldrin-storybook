import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme, withTheme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, StyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'

import { endFarming } from '@sb/dexUtils/pools/actions/endFarming'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { COLORS } from '@variables/variables'

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

  const { address: userPoolTokenAccount } = getTokenDataByMint(
    allTokensData,
    selectedPool.poolTokenMint
  )

  const farmingState = selectedPool.farming[0]
  if (!farmingState) return null

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={StyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => { }}
      maxWidth={'md'}
      open
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader>Unstake Pool Tokens</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.4rem'}>
          You need to unstake pool tokens to be able to withdraw liquidity. You
          still be able to claim rewards in “Your Liquidity” tab.{' '}
        </Text>
      </RowContainer>

      <RowContainer justify={'space-between'} margin={'2rem 0 0 0'}>
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: COLORS.success,
          }}
        >
          {TRANSACTION_COMMON_SOL_FEE} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          style={{ width: '100%', fontFamily: 'Avenir Next Medium' }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={async () => {
            // loader in popup button
            setOperationLoading(true)
            // loader in table button
            setPoolWaitingForUpdateAfterOperation({
              pool: selectedPool.swapToken,
              operation: 'unstake',
            })

            const result = await endFarming({
              wallet,
              connection,
              poolPublicKey: new PublicKey(selectedPool.swapToken),
              userPoolTokenAccount: userPoolTokenAccount
                ? new PublicKey(userPoolTokenAccount)
                : null,
              farmingStatePublicKey: new PublicKey(farmingState.farmingState),
              snapshotQueuePublicKey: new PublicKey(
                farmingState.farmingSnapshots
              ),
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
              setTimeout(async () => {
                refreshTokensWithFarmingTickets()
                clearPoolWaitingForUpdate()
                close()
              }, 7500)
              setTimeout(() => refreshTokensWithFarmingTickets(), 15000)
            } else {
              clearPoolWaitingForUpdate()
              close()
            }
          }}
        >
          Unstake
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}


export const UnstakePopup = withTheme()(Popup)