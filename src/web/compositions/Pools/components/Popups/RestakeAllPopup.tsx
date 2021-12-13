import React, { useState } from 'react'

import { DialogWrapper } from '@sb/components/AddAccountDialog/AddAccountDialog.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

import { BoldHeader, ClaimRewardsStyledPaper } from './index.styles'
import { Button } from '../Tables/index.styles'
import { Theme } from '@sb/types/materialUI'
import { restakeAll } from '../../utils/restakeAll'
import { RefreshFunction, TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection } from '@solana/web3.js'
import { PoolInfo } from '../../index.types'
import { FarmingTicket } from '@sb/dexUtils/common/types'

export const RestakeAllPopup = ({
  theme,
  open,
  close,
  wallet,
  connection,
  allPoolsData,
  farmingTicketsMap,
  allTokensData,
  refreshTokensWithFarmingTickets,
}: {
  theme: Theme
  open: boolean
  close: () => void
  wallet: WalletAdapter
  connection: Connection
  allPoolsData: PoolInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  allTokensData: TokenInfo[]
  refreshTokensWithFarmingTickets: RefreshFunction
}) => {
  const [showRetryMessage, setShowRetryMessage] = useState(false)
  const [operationLoading, setOperationLoading] = useState(false)

  const restake = async () => {
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
      console.log(`failed`)
    } else if (result === 'cancelled') {
      setOperationLoading(false)
    } else if (result === 'success') {
      refreshTokensWithFarmingTickets()
      close()
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
          within a week until the restake is made. (ex.: Ledger) you will have
          to confirm each transaction manually.
        </Text>
      </RowContainer>
      {showRetryMessage && (
        <RowContainer margin={'3rem 0 0 0'} justify="flex-start">
          <Text
            style={{ color: theme.palette.red.main, margin: '1rem 0' }}
            fontSize={'1.8rem'}
          >
            Blockhash outdated, press “Try Again” to complete the remaining
            transactions.
          </Text>
        </RowContainer>
      )}
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
          onClick={() => close()}
        >
          Remind me later
        </Button>
        <Button
          color="#651CE4"
          height="5.5rem"
          fontSize="1.7rem"
          btnWidth="calc(65% - 1rem)"
          disabled={operationLoading}
          isUserConfident={true}
          showLoader={operationLoading}
          onClick={async () => {
            await restake()
          }}
        >
          {showRetryMessage ? 'Try Again' : 'Restake Now!'}
        </Button>
      </RowContainer>
    </DialogWrapper>
  )
}
