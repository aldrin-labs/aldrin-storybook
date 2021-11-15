import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, ClaimRewardsStyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'

import { Button } from '../../Tables/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'

import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { FarmingTicket, SnapshotQueue } from '@sb/dexUtils/common/types'
import ProposeToStakePopup from '../../Popups/ProposeToStake'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { RIN_MINT } from '@sb/dexUtils/utils'

export const ClaimRewards = ({
  theme,
  open,
  selectedPool,
  allTokensData,
  farmingTicketsMap,
  snapshotQueues,
  close,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  snapshotQueues: SnapshotQueue[]
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const farmingTickets = farmingTicketsMap.get(selectedPool.swapToken) || []

  const [operationLoading, setOperationLoading] = useState(false)
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [isProposeToStakePopupOpen, setIsProposeToStakePopupOpen] = useState(
    false
  )

  const isPoolWithFarming =
    selectedPool.farming && selectedPool.farming.length > 0
  const openFarmings = isPoolWithFarming
    ? filterOpenFarmingStates(selectedPool.farming)
    : []

  const isFarmingRIN = !!openFarmings.find(
    (el) => el.farmingTokenMint === RIN_MINT
  )

  const claimRewards = async (signAllTransactions: boolean) => {
    setShowRetryMessage(false)
    // loader in popup button
    setOperationLoading(true)
    // loader in table button
    setPoolWaitingForUpdateAfterOperation({
      pool: selectedPool.swapToken,
      operation: 'claim',
    })

    const clearPoolWaitingForUpdate = () => {
      setOperationLoading(false)
      setPoolWaitingForUpdateAfterOperation({
        pool: '',
        operation: '',
      })
    }

    let result = null

    try {
      result = await withdrawFarmed({
        wallet,
        connection,
        pool: selectedPool,
        allTokensData,
        farmingTickets,
        snapshotQueues,
        signAllTransactions,
      })

      notify({
        type: result === 'success' ? 'success' : 'error',
        message:
          result === 'success'
            ? 'Successfully claimed rewards.'
            : result === 'failed'
            ? 'Claim rewards failed, please try again later or contact us in telegram.'
            : result === 'cancelled'
            ? 'Claim rewards cancelled.'
            : 'Blockhash outdated, please claim rest rewards in a few seconds.',
      })

      if (result === 'cancelled') {
        clearPoolWaitingForUpdate()
      } else {
        setTimeout(async () => {
          refreshTokensWithFarmingTickets()
          clearPoolWaitingForUpdate()
        }, 7500)

        setTimeout(() => refreshTokensWithFarmingTickets(), 15000)
      }
    } catch (e) {
      clearPoolWaitingForUpdate()

      setTimeout(async () => {
        refreshTokensWithFarmingTickets()
      }, 7500)
    }

    if (result !== 'blockhash_outdated') {
      if (isFarmingRIN) {
        setIsProposeToStakePopupOpen(true)
      } else {
        close()
      }
    } else {
      setShowRetryMessage(true)
    }
  }

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={ClaimRewardsStyledPaper}
      fullScreen={false}
      onClose={close}
      onEnter={() => {}}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader style={{ fontSize: '3rem' }}>Claim Rewards</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      <RowContainer justify="flex-start">
        <Text style={{ marginBottom: '1rem' }} fontSize={'1.6rem'}>
          Do not close the page until this pop-up has closed. You will need to
          sign several transactions to make a claim, the number depends on how
          long it has been since your last reward claim. They will be signed
          with a single action in the software wallet but may take some time to
          confirm in the blockchain. If you use hardware wallet you have to
          confirm every transaction manualy.
        </Text>
        {showRetryMessage && (
          <Text
            style={{ color: theme.palette.red.main, margin: '1rem 0' }}
            fontSize={'1.8rem'}
          >
            Blockhash outdated, press “Try Again” to complete the remaining
            transactions.
          </Text>
        )}
      </RowContainer>

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          fontSize={'1.5rem'}
          style={{
            width: 'calc(70% - 1rem)',
            fontFamily: 'Avenir Next Medium',
          }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={() => claimRewards(false)}
        >
          Claim Rewards with Hardware Wallet (e.g. Ledger)
        </Button>
        <Button
          style={{
            width: 'calc(30% - 1rem)',
            fontFamily: 'Avenir Next Medium',
          }}
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={() => claimRewards(true)}
        >
          {showRetryMessage ? 'Try Again' : 'Claim rewards'}
        </Button>
      </RowContainer>
      <ProposeToStakePopup
        theme={theme}
        open={isProposeToStakePopupOpen}
        close={() => {
          close()
          setIsProposeToStakePopupOpen(false)
        }}
      />
    </DialogWrapper>
  )
}
