import React, { useState } from 'react'

import { RewardsModal } from '@sb/components/Header/Rewards/RewardsModal'
import { useConnection } from '@sb/dexUtils/connection'
import { getTicketsWithUiValues } from '@sb/dexUtils/staking/getTicketsWithUiValues'
import { useStakingPoolInfo } from '@sb/dexUtils/staking/hooks'
import { useAllStakingTickets } from '@sb/dexUtils/staking/useAllStakingTickets'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import { useWallet } from '@sb/dexUtils/wallet'

import { getStakedTokensTotal } from '@core/solana'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import RinLogo from '@icons/rin_logo.png'

import { RinBalanceContainer, RinBalanceLogo, RinBalanceLabel } from './styles'

const RinBalanceContent = ({ children }) => {
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false)

  return (
    <>
      <RinBalanceContainer onClick={() => setIsRewardsModalOpen(true)}>
        <RinBalanceLogo src={RinLogo} />
        <RinBalanceLabel>{children}</RinBalanceLabel>
      </RinBalanceContainer>

      <RewardsModal
        open={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />
    </>
  )
}

export const RinBalance = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const { data: poolInfo } = useStakingPoolInfo()

  const rinTokenData = useAssociatedTokenAccount(
    poolInfo?.currentFarmingState?.farmingTokenMint
  )

  const [tickets] = useAllStakingTickets({
    wallet,
    connection,
    walletPublicKey: wallet.publicKey,
    onlyUserTickets: true,
  })

  if (!poolInfo || !rinTokenData) {
    return <RinBalanceContent>0.00 RIN</RinBalanceContent>
  }

  const { farmingTokenMintDecimals } = poolInfo.currentFarmingState
  const { amount: rinBalance } = rinTokenData

  const rinStaked = getStakedTokensTotal(
    getTicketsWithUiValues({
      tickets,
      farmingTokenMintDecimals,
    })
  )

  const totalRin = rinBalance + rinStaked

  return (
    <RinBalanceContent>{roundAndFormatNumber(totalRin, 2)}</RinBalanceContent>
  )
}
