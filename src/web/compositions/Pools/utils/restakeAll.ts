import React from 'react'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { endFarming } from '@sb/dexUtils/pools/endFarming'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection } from '@solana/web3.js'
import { PoolInfo } from '../index.types'

export const restakeAll = ({
  wallet,
  connection,
  allPoolsData,
  farmingTickets,
}: {
  wallet: WalletAdapter
  connection: Connection
  allPoolsData: PoolInfo[]
  farmingTickets: FarmingTicket[]
}) => {
  const stakedTokens = getStakedTokensFromOpenFarmingTickets(farmingTickets)
}
