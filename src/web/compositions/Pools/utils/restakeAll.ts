import React from 'react'
import { getStakedTokensFromOpenFarmingTickets } from '@sb/dexUtils/common/getStakedTokensFromOpenFarmingTickets'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { PoolInfo } from '../index.types'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import {
  endFarming,
  getEndFarmingTransactions,
} from '@sb/dexUtils/pools/actions/endFarming'
import { getTokenDataByMint } from '.'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { startFarming } from '@sb/dexUtils/pools/actions/startFarming'

export const restakeAll = async ({
  wallet,
  connection,
  allPoolsData,
  farmingTicketsMap,
  allTokensData,
}: {
  wallet: WalletAdapter
  connection: Connection
  allPoolsData: PoolInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  allTokensData: TokenInfo[]
}) => {
  for (let pool of allPoolsData) {
    const farming = pool.farming || []
    const { address: userPoolTokenAccount } = getTokenDataByMint(
      allTokensData,
      pool.poolTokenMint
    )
    const userTokens = await getAllTokensData(wallet?.publicKey, connection)
    const poolTokenAmount = getTokenDataByMint(userTokens, pool.poolTokenMint)
      .amount
    // const ticketsForPool = farmingTicketsMap.get(pool?.swapToken) || []
    // const stakedTokens = getStakedTokensFromOpenFarmingTickets(ticketsForPool)
    console.log({ userPoolTokenAccount, pool: pool.poolTokenMint })
    const transactionsAndSigners = await endFarming({
      wallet,
      connection,
      poolPublicKey: new PublicKey(pool.swapToken),
      farmingStatePublicKey: new PublicKey(farming[0].farmingState),
      snapshotQueuePublicKey: new PublicKey(farming[0].farmingSnapshots),
      userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
      curveType: pool.curveType,
    })

    const result = await startFarming({
      wallet,
      connection,
      poolTokenAmount,
      poolPublicKey: new PublicKey(pool.swapToken),
      userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
      curveType: pool.curveType,
      farmingState: new PublicKey(farming[0].farmingState),
    })

    console.log({ transactionsAndSigners, result })
  }
}
