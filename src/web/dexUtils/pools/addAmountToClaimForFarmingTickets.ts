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

  for (let ticket of allUserFarmingTickets) {
    // todo use getPoolsInfo
    const pool = mock.find((pool) => pool.swapToken === ticket.pool)

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
    return allUserFarmingTickets

  rewardsToClaimTransaction?.feePayer = wallet.publicKey

  const { value } = await simulateTransaction(
    connection,
    rewardsToClaimTransaction,
    connection.commitment ?? 'single'
  )

  // for through logs + use index to get ticket -> pool and add claim value
  if (value.err) {
    return allUserFarmingTickets
  }

  const amountsToClaim =
    value.logs
      ?.filter((log) => log.includes(START_OF_LOG_WITH_AMOUNT_TO_CLAIM))
      .map(
        (log, i) =>
          parseFloat(log.replace(START_OF_LOG_WITH_AMOUNT_TO_CLAIM, '')) + i
      ) || []

  return allUserFarmingTickets.map((ticket, index) => ({
    ...ticket,
    amountToClaim: amountsToClaim[index] || 0,
  }))
}
