import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import { BoldHeader, ClaimRewardsStyledPaper } from './index.styles'
import { Button } from '../Tables/index.styles'
import { Theme } from '@sb/types/materialUI'
import { restakeAll } from '../../utils/restakeAll'
import { RefreshFunction, TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { PoolInfo } from '../../index.types'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { filterTicketsAvailableForUnstake } from '@sb/dexUtils/pools/filterTicketsAvailableForUnstake'
import { getParsedUserFarmingTickets } from '@sb/dexUtils/pools/getParsedUserFarmingTickets'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { TRANSACTION_COMMON_SOL_FEE } from '@sb/components/TraidingTerminal/utils'
import { CREATE_FARMING_TICKET_SOL_FEE } from '@sb/dexUtils/common/config'
import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { WhiteText } from '@sb/components/TraidingTerminal/ConfirmationPopup'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

const getSOLFeesAmountToRestake = ({
  allPoolsData,
  farmingTicketsMap,
}: {
  allPoolsData: PoolInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
}) => {
  let SOLFees = 0

  for (let pool of allPoolsData) {
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

export const RestakeAllPopup = ({
  theme,
  //   open,
  //   close,
  wallet,
  connection,
  allPoolsData,
  farmingTicketsMap,
  allTokensData,
  refreshTokensWithFarmingTickets,
}: {
  theme: Theme
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
  const [isPopupOpen, setIsPopupOpen] = useLocalStorageState(
    `showRestakePopup-${wallet.publicKey}`,
    true
  )
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)
  const [isTransactionFailed, setIsTransactionFailed] = useState(false)

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

    if (result === 'blockhash_outdated') {
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
      setIsPopupOpen(false)
    }
  }

  if (!isPopupOpen || isPopupTemporaryHidden) return null

  return (
    <DialogWrapper
      theme={theme}
      PaperComponent={ClaimRewardsStyledPaper}
      fullScreen={false}
      onClose={() => setIsPopupTemporaryHidden(true)}
      onEnter={() => {}}
      maxWidth={'md'}
      open={isPopupOpen || !isPopupTemporaryHidden}
      aria-labelledby="responsive-dialog-title"
    >
      <RowContainer
        margin={'2rem 0 3rem 0'}
        justify={'space-between'}
        width={'100%'}
      >
        <BoldHeader style={{ fontSize: '3rem' }}>
          Restake your LP tokens to keep earning rewards
        </BoldHeader>
      </RowContainer>

      <RowContainer justify="flex-start" wrap={'nowrap'}>
        <Text style={{ fontFamily: 'Avenir Next' }} fontSize={'1.6rem'}>
          To move to the next farming era, you need to click Restake below and
          confirm all transactions in your wallet. This shouldn't take long. If
          you do not restake your LP tokens, they will cease to be credited
          within a week until the restake is made.
        </Text>
      </RowContainer>
      {showRetryMessage && (
        <RowContainer margin={'3rem 0 0 0'} justify="flex-start">
          <Text
            style={{ color: theme.palette.red.main, margin: '1rem 0' }}
            fontSize={'1.8rem'}
          >
            {isTransactionFailed
              ? 'Restake failed, please try again or contact us in telegram.'
              : 'Blockhash outdated, press “Try Again” to complete the remaining transactions.'}
          </Text>
        </RowContainer>
      )}
      <RowContainer justify={'space-between'} margin={'2rem 0 0 0'}>
        <WhiteText>Gas Fees</WhiteText>
        <WhiteText
          style={{
            color: theme.palette.green.main,
          }}
        >
          {stripDigitPlaces(SOLFeesForRestake, 8)} SOL
        </WhiteText>
      </RowContainer>

      <RowContainer justify="space-between" margin={'7rem 0 2rem 0'}>
        <Button
          color="inherit"
          height="5.5rem"
          borderColor="#fff"
          fontSize="1.7rem"
          btnWidth="calc(35% - 1rem)"
          disabled={false}
          isUserConfident={true}
          theme={theme}
          onClick={() => {
            setIsPopupTemporaryHidden(true)
          }}
        >
          Remind me later
        </Button>
        <Button
          color="#651CE4"
          height="5.5rem"
          fontSize="1.7rem"
          btnWidth="calc(65% - 1rem)"
          disabled={operationLoading || isNotEnoughSOL}
          isUserConfident={true}
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
