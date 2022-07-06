import React from 'react'

import RinLogo from '@icons/rin_logo.png'

import { RinBalanceContainer, RinBalanceLogo, RinBalanceLabel } from './styles'
import { useWallet } from "@sb/dexUtils/wallet"
import { useStakingPoolInfo } from "@sb/dexUtils/staking/hooks"
import { useAssociatedTokenAccount } from "@sb/dexUtils/token/hooks"
import { roundAndFormatNumber } from "@core/utils/PortfolioTableUtils"
import { getStakedTokensTotal } from "@core/solana"
import { getTicketsWithUiValues } from "@sb/dexUtils/staking/getTicketsWithUiValues"
import { useAllStakingTickets } from "@sb/dexUtils/staking/useAllStakingTickets"
import { useConnection } from "@sb/dexUtils/connection"

const RinBalanceContent = ({ children }) => {
  return (
    <RinBalanceContainer>
      <RinBalanceLogo src={RinLogo} />
      <RinBalanceLabel>{children}</RinBalanceLabel>
    </RinBalanceContainer>
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
    <RinBalanceContent>
      {roundAndFormatNumber(totalRin, 2)} RIN
    </RinBalanceContent>
  )
}
