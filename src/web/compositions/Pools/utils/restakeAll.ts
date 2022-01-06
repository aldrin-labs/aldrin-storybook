import { Connection, PublicKey } from '@solana/web3.js'

import { startStaking } from '@sb/dexUtils/common/actions'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { POOL_TOKENS_MINT_DECIMALS } from '@sb/dexUtils/pools/config'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { sleep } from '@sb/dexUtils/utils'

import { getTokenDataByMint } from '.'
import { PoolInfo } from '../index.types'

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
  const endFarmingTransactions = []

  for (const pool of allPoolsData) {
    const farmingStates = pool.farming || []

    const isPoolWithFarming = pool.farming && pool.farming.length > 0

    const farmingTickets = farmingTicketsMap.get(pool.swapToken)

    const openFarmings = isPoolWithFarming
      ? filterOpenFarmingStates(farmingStates)
      : []

    const hasNoActiveTickets =
      openFarmings.length === 0 ||
      !farmingTickets ||
      farmingTickets.length === 0

    if (hasNoActiveTickets) {
      continue
    }

    const { address: userPoolTokenAccount } = getTokenDataByMint(
      allTokensData,
      pool.poolTokenMint
    )

    const result = await startStaking({
      wallet,
      stakingPool: pool,
      amount: 0,
      userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
      farmingTickets,
      decimals: POOL_TOKENS_MINT_DECIMALS,
      programAddress: getPoolsProgramAddress({ curveType: pool.curveType }),
      connection,
    })

    if (result !== 'success') {
      return result
    }

    await sleep(1000)
  }

  return 'success'
}
