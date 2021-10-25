import { simulateTransaction } from '@project-serum/common'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import { checkFarmed } from './checkFarmed'
import { START_OF_LOG_WITH_AMOUNT_TO_CLAIM } from '../common/config'
import { FarmingTicket } from '../common/types'

export const addAvailableToClaimForFarmingTickets = async ({
  pool,
  wallet,
  connection,
  allUserFarmingTickets,
}: {
  pool: PoolInfo
  wallet: WalletAdapter
  connection: Connection
  allUserFarmingTickets: FarmingTicket[]
}): Promise<FarmingTicket[]> => {
  const ticketsWithExistingPools = allUserFarmingTickets.filter(
    (ticket) => pool.swapToken === ticket.pool
  )

  let rewardsToClaimTransaction = new Transaction()
  let ticketsCounter = 0
  let commonValueLogs: string[] = []

  for (let ticket of ticketsWithExistingPools) {
    // if farming(s) exists
    if (!pool || !pool.farming || pool.farming.length === 0) continue

    let transaction = null

    for (let farming of pool.farming) {
      try {
        transaction = await checkFarmed({
          wallet,
          connection,
          poolPublicKey: new PublicKey(pool.swapToken),
          farmingTicket: new PublicKey(ticket.farmingTicket),
          farming,
        })
      } catch (e) {
        console.error(e)
        continue
      }
      ticketsCounter++

      transaction && rewardsToClaimTransaction.add(transaction)

      if (ticketsCounter >= 8) {
        // @ts-ignore
        rewardsToClaimTransaction.feePayer = wallet.publicKey

        const { value } = await simulateTransaction(
          connection,
          rewardsToClaimTransaction,
          connection.commitment ?? 'single'
        )

        // for through logs + use index to get ticket -> pool and add claim value
        if (value.err) {
          return ticketsWithExistingPools
        }

        commonValueLogs = commonValueLogs.concat(value.logs || [])
        rewardsToClaimTransaction = new Transaction()
        ticketsCounter = 0
      }
    }
  }

  // if no tickets to check
  if (rewardsToClaimTransaction.instructions.length > 0) {
    // @ts-ignore
    rewardsToClaimTransaction.feePayer = wallet.publicKey

    const { value } = await simulateTransaction(
      connection,
      rewardsToClaimTransaction,
      connection.commitment ?? 'single'
    )

    // for through logs + use index to get ticket -> pool and add claim value
    if (value.err) {
      return ticketsWithExistingPools
    }

    commonValueLogs = commonValueLogs.concat(value.logs || [])
  }

  // match amounts via index (ticket for every farming state, then next ticket)
  const amountsToClaim =
    commonValueLogs
      ?.filter((log) => log.includes(START_OF_LOG_WITH_AMOUNT_TO_CLAIM))
      .map((log, i) =>
        parseFloat(log.replace(START_OF_LOG_WITH_AMOUNT_TO_CLAIM, ''))
      ) || []

  let counter = 0

  const ticketsWithAmountsToClaim = ticketsWithExistingPools.map((ticket) => {
    if (!pool) return ticket

    const amountsToClaimForTicket = pool.farming.map((farming, index) => {
      const amountForFarmingState = amountsToClaim[counter + index] || 0
      return {
        farmingState: farming.farmingState,
        amount: amountForFarmingState,
      }
    })

    counter += pool.farming.length

    return {
      ...ticket,
      amountsToClaim: amountsToClaimForTicket,
    }
  })

  return ticketsWithAmountsToClaim
}
