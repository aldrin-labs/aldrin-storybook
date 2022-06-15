import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { Connection } from '@solana/web3.js'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { Button } from '@sb/components/Button'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { Text } from '@sb/compositions/Addressbook/index'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { CREATE_FARMING_TICKET_SOL_FEE } from '@sb/dexUtils/common/config'
import { filterOldFarmingTickets } from '@sb/dexUtils/common/filterOldFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { filterTicketsAvailableForUnstake } from '@sb/dexUtils/pools/filterTicketsAvailableForUnstake'
import { RefreshFunction, TokenInfo, WalletAdapter } from '@sb/dexUtils/types'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { PoolInfo } from '../../index.types'
import { restakeAll } from '../../utils/restakeAll'
import { BoldHeader, ClaimRewardsStyledPaper } from './index.styles'

const getSOLFeesAmountToRestake = ({
  allPoolsData,
  farmingTicketsMap,
}: {
  allPoolsData: PoolInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
}) => {
  let SOLFees = 0

  for (const pool of allPoolsData) {
    const farmingStates = pool.farming || []

    const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

    if (farmingStates.length === 0 || farmingTickets.length === 0) {
      continue
    }

    const availableToUnstakeTickets = filterTicketsAvailableForUnstake(
      farmingTickets,
      farmingStates[0]
    )

    SOLFees += TRANSACTION_COMMON_SOL_FEE * availableToUnstakeTickets.length
    SOLFees += CREATE_FARMING_TICKET_SOL_FEE + TRANSACTION_COMMON_SOL_FEE * 2
  }

  return SOLFees
}

const Popup = ({
  //   open,
  //   close,
  wallet,
  connection,
  allPoolsData,
  farmingTicketsMap,
  allTokensData,
  refreshTokensWithFarmingTickets,
}: {
  //   open: boolean
  //   close: () => void
  wallet: WalletAdapter
  connection: Connection
  allPoolsData: PoolInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  allTokensData: TokenInfo[]
  refreshTokensWithFarmingTickets: RefreshFunction
}) => {
  const [isPopupTemporaryHidden, setIsPopupTemporaryHidden] = useState(false)
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [isTransactionFailed, setIsTransactionFailed] = useState(false)
  const theme = useTheme()

  // first result for sol mint is native sol account which is using to cover fees
  const { amount: userSOLAmount } = allTokensData.find(
    (tokenInfo) => tokenInfo.mint === WRAPPED_SOL_MINT.toString()
  ) || { amount: 0 }

  const SOLFeesForRestake = getSOLFeesAmountToRestake({
    allPoolsData,
    farmingTicketsMap,
  })

  const isNotEnoughSOL = userSOLAmount < SOLFeesForRestake

  const restake = async () => {
    setShowRetryMessage(false)
    setIsTransactionFailed(false)

    setOperationLoading(true)

    const result = await restakeAll({
      wallet,
      connection,
      allPoolsData,
      farmingTicketsMap,
      allTokensData,
    })

    if (result === 'timeout') {
      setShowRetryMessage(true)
      setOperationLoading(true)
      setTimeout(async () => {
        refreshTokensWithFarmingTickets()
      }, 7500)
      setOperationLoading(false)
    } else if (result === 'failed') {
      setIsTransactionFailed(true)
      setShowRetryMessage(true)
      setOperationLoading(true)
      setTimeout(async () => {
        refreshTokensWithFarmingTickets()
      }, 7500)
      setOperationLoading(false)
    } else if (result === 'cancelled') {
      setOperationLoading(false)
    } else if (result === 'success') {
      refreshTokensWithFarmingTickets()
      setIsPopupTemporaryHidden(true)
    }
  }

  // Find all tickets
  const oldTickets = filterOldFarmingTickets(
    Array.from(farmingTicketsMap.values()).flat(),
    allPoolsData
  )

  if (isPopupTemporaryHidden || oldTickets.length === 0) return null

  return (
    <DialogWrapper
      PaperComponent={ClaimRewardsStyledPaper}
      fullScreen={false}
      onClose={() => setIsPopupTemporaryHidden(true)}
      onEnter={() => {}}
      maxWidth="md"
      open={!isPopupTemporaryHidden}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer margin="2rem 0 3rem 0" justify="space-between" width="100%">
        <BoldHeader style={{ fontSize: '3rem' }}>
          Restake your LP tokens to keep earning rewards
        </BoldHeader>
      </RowContainer>

      <RowContainer
        direction="column"
        justify="flex-start"
        wrap="nowrap"
        align="flex-start"
      >
        <Text
          style={{ fontFamily: 'Avenir Next', marginBottom: '1rem' }}
          fontSize="1.6rem"
        >
          We have made some modifications to our pools and require you to click
          ‘Restake’ below.
        </Text>
        <Text style={{ fontFamily: 'Avenir Next' }} fontSize="1.6rem">
          It is important that you confirm all transactions in order to continue
          receiving rewards. Please do this as soon as posible.
        </Text>
      </RowContainer>
      {showRetryMessage && (
        <RowContainer margin="3rem 0 0 0" justify="flex-start">
          <Text
            style={{ color: theme.colors.red3, margin: '1rem 0' }}
            fontSize="1.8rem"
          >
            {isTransactionFailed
              ? 'Restake failed, please try again or contact us in telegram.'
              : 'Blockhash outdated, press “Try Again” to complete the remaining transactions.'}
          </Text>
        </RowContainer>
      )}
      <RowContainer justify="space-between" margin="2rem 0 0 0">
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: theme.colors.green7,
          }}
        >
          {stripDigitPlaces(SOLFeesForRestake, 8)} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin="7rem 0 2rem 0">
        <Button
          $variant="outline-white"
          disabled={false}
          $width="md"
          $fontSize="lg"
          $padding="lg"
          isUserConfident
          onClick={() => {
            setIsPopupTemporaryHidden(true)
          }}
        >
          Remind me later
        </Button>
        <Button
          $variant="primary"
          $width="lg"
          $fontSize="lg"
          $padding="lg"
          disabled={operationLoading || isNotEnoughSOL}
          isUserConfident
          showLoader={operationLoading}
          onClick={async () => {
            await restake()
          }}
        >
          {isNotEnoughSOL
            ? 'Insufficient SOL Balance'
            : showRetryMessage
            ? 'Try Again'
            : 'Restake Now!'}
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}

export { Popup as RestakeAllPopup }
