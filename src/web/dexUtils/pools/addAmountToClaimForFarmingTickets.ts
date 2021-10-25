import { simulateTransaction } from '@project-serum/common'
import { mock } from '@sb/compositions/Pools/components/Tables/AllPools/AllPoolsTable.utils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { Connection, Transaction } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import { checkFarmed } from './checkFarmed'
import { FarmingTicket } from './endFarming'

const START_OF_LOG_WITH_AMOUNT_TO_CLAIM = 'Program log: '

export const addAmountToClaimForFarmingTickets = async ({
  pools,
  wallet,
  connection,
  allUserFarmingTickets,
}: {
  pools: PoolInfo[]
  wallet: WalletAdapter
  connection: Connection
  allUserFarmingTickets: FarmingTicket[]
}): Promise<FarmingTicket[]> => {
  const rewardsToClaimTransaction = new Transaction()
  const poolsMap = pools.reduce(
    (acc, pool) => acc.set(pool.swapToken, pool),
    new Map()
  )

  const ticketsWithExistingPools = allUserFarmingTickets.filter((ticket) =>
    poolsMap.has(ticket.pool)
  )

  for (let ticket of ticketsWithExistingPools) {
    // todo use getPoolsInfo
    const pool = pools.find((pool) => pool.swapToken === ticket.pool)

    if (!pool) continue

    let transaction = null

    try {
      transaction = await checkFarmed({
        wallet,
        connection,
        pool,
        farmingTicket: ticket,
      })
    } catch (e) {
      console.error(e)
      continue
    }

    transaction && rewardsToClaimTransaction.add(transaction)
  }

  if (rewardsToClaimTransaction.instructions.length === 0)
    return ticketsWithExistingPools

  rewardsToClaimTransaction?.feePayer = wallet.publicKey

  const { value } = await simulateTransaction(
    connection,
    rewardsToClaimTransaction,
    connection.commitment ?? 'single'
  )

  console.log('value', value)

  // for through logs + use index to get ticket -> pool and add claim value
  if (value.err) {
    return ticketsWithExistingPools
  }

  const amountsToClaim =
    value.logs
      ?.filter((log) => log.includes(START_OF_LOG_WITH_AMOUNT_TO_CLAIM))
      .map(
        (log, i) =>
          parseFloat(log.replace(START_OF_LOG_WITH_AMOUNT_TO_CLAIM, '')) + i
      ) || []

  console.log('amountsToClaim', amountsToClaim)

  return ticketsWithExistingPools.map((ticket, index) => ({
    ...ticket,
    amountToClaim: amountsToClaim[index] || 0,
  }))
}
