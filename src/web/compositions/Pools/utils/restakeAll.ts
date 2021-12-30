import { Connection, PublicKey } from '@solana/web3.js'

import { FarmingTicket } from '@sb/dexUtils/common/types'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { sleep } from '@sb/dexUtils/utils'

import { getTokenDataByMint } from '.'
import { startStaking } from '../../../dexUtils/common/actions'
import { getPoolsProgramAddress } from '../../../dexUtils/ProgramsMultiton'
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

    if (
      openFarmings.length === 0 ||
      !farmingTickets ||
      farmingTickets.length === 0
    ) {
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
      decimals: 0,
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
