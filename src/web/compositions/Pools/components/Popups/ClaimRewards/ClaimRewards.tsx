import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Theme } from '@material-ui/core'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BoldHeader, ClaimRewardsStyledPaper } from '../index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import SvgIcon from '@sb/components/SvgIcon'
import Close from '@icons/closeIcon.svg'
import GearIcon from '@icons/cogwheel.svg'

import { Button } from '../../Tables/index.styles'
import { PoolInfo, PoolWithOperation } from '@sb/compositions/Pools/index.types'

import { useWallet } from '@sb/dexUtils/wallet'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { RefreshFunction, TokenInfo } from '@sb/dexUtils/types'
import { withdrawFarmed } from '@sb/dexUtils/pools/withdrawFarmed'
import { FarmingTicket, SnapshotQueue } from '@sb/dexUtils/common/types'
import { StakingPool } from '@sb/dexUtils/staking/types'
import ProposeToStakePopup from '../../Popups/ProposeToStake'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { RIN_MINT } from '@sb/dexUtils/utils'
import LightLogo from '@icons/lightLogo.svg'
import { STAKING_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import AttentionComponent from '@sb/components/AttentionBlock'
import { WithdrawStakedParams } from '@sb/dexUtils/staking/withdrawStaked'

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
  programId,
  callback,
  withdrawFunction = withdrawFarmed,
  hideMaintenanceWarning = false
}: {
  theme: Theme
  open: boolean
  selectedPool: PoolInfo | StakingPool
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  snapshotQueues: SnapshotQueue[]
  close: () => void
  refreshTokensWithFarmingTickets: RefreshFunction
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  programId: string
  callback?: () => void
  withdrawFunction?: (params: WithdrawStakedParams) => Promise<string>
  hideMaintenanceWarning?: boolean
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
      result = await withdrawFunction({
        wallet,
        connection,
        pool: selectedPool,
        allTokensData,
        farmingTickets,
        snapshotQueues,
        signAllTransactions,
        programAddress: programId
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
          if (callback) {
            callback()
            close()
          }
        }, 7500)

        setTimeout(() => refreshTokensWithFarmingTickets(), 15000)
      }
    } catch (e) {
      clearPoolWaitingForUpdate()
      close()

      setTimeout(async () => {
        refreshTokensWithFarmingTickets()
      }, 7500)
      console.warn('Error withdraw farming: ', e)
    }

    if (result !== 'blockhash_outdated') {
      if (isFarmingRIN && programId !== STAKING_PROGRAM_ADDRESS) {
        setIsProposeToStakePopupOpen(true)
      }

      if (!callback) {
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
      onEnter={() => { }}
      maxWidth={'md'}
      open={open}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer justify={'space-between'} width={'100%'}>
        <BoldHeader style={{ fontSize: '3rem' }}>Claim Rewards</BoldHeader>
        <SvgIcon style={{ cursor: 'pointer' }} onClick={close} src={Close} />
      </RowContainer>
      {!hideMaintenanceWarning &&
        <RowContainer margin={'0 0 3rem 0'}>
          <AttentionComponent
            header={`The issue below is currently being fixed.`}
            text={'You can wait approx few weeks and claim rewards without any issues then.'}
            blockHeight={'9rem'}
            iconSrc={GearIcon} />
        </RowContainer>
      }

      <RowContainer justify="flex-start" wrap={'nowrap'}>
        <SvgIcon
          src={LightLogo}
          height={'13rem'}
          width={'13rem'}
          style={{ marginRight: '3rem' }}
        />
        <Text
          style={{ marginBottom: '1rem', fontFamily: 'Avenir Next' }}
          fontSize={'1.6rem'}
        >
          Do not close this page until the pop-up closes. You will need to
          confirm multiple transactions, depending on how long your last claim
          was, in order to claim your rewards. Transactions will be signed in a
          single action, but it may take some time to confirm them in the
          blockchain. If you are using a hardware wallet (ex.: Ledger) you will
          have to confirm each transaction manually.
        </Text>
      </RowContainer>

      {showRetryMessage && (
        <RowContainer justify="flex-start">
          <Text
            style={{ color: theme.palette.red.main, margin: '1rem 0' }}
            fontSize={'1.8rem'}
          >
            Blockhash outdated, press “Try Again” to complete the remaining
            transactions.
          </Text>
        </RowContainer>
      )}

      <RowContainer justify="space-between" margin={'3rem 0 2rem 0'}>
        <Button
          color="inherit"
          height="5.5rem"
          borderColor="#fff"
          fontSize="1.3rem"
          btnWidth="calc(50% - 1rem)"
          disabled={false}
          isUserConfident={true}
          theme={theme}
          showLoader={operationLoading}
          onClick={() => claimRewards(false)}
        >
          Claim Rewards with Hardware Wallet (e.g. Ledger)
        </Button>
        <Button
          color="#651CE4"
          height="5.5rem"
          btnWidth="calc(50% - 1rem)"
          disabled={false}
          isUserConfident={true}
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
