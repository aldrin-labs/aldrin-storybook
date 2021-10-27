import { simulateTransaction } from '@project-serum/common'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import { checkFarmed } from './checkFarmed'
import { START_OF_LOG_WITH_AMOUNT_TO_CLAIM } from './config'
import { FarmingTicket } from './types'
import { StakingPool } from '../staking/types'

export const addAmountsToClaimForFarmingTickets = async ({
  pools,
  wallet,
  connection,
  allUserFarmingTickets,
  programAddress,
}: {
  pools: (PoolInfo | StakingPool)[]
  wallet: WalletAdapter
  connection: Connection
  allUserFarmingTickets: FarmingTicket[]
  programAddress?: string
}): Promise<FarmingTicket[]> => {
  const poolsMap = pools.reduce(
    (acc, pool) => acc.set(pool.swapToken, pool),
    new Map()
  )

  const ticketsWithExistingPools = allUserFarmingTickets.filter((ticket) =>
    poolsMap.has(ticket.pool)
  )
  let rewardsToClaimTransaction = new Transaction()
  let ticketsCounter = 0
  let commonValueLogs: string[] = []

  for (let ticket of ticketsWithExistingPools) {
    const pool = pools.find((pool) => pool.swapToken === ticket.pool)

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
          programAddress,
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
    const pool = pools.find((pool) => pool.swapToken === ticket.pool)

    if (!pool) return ticket

    const amountsToClaimForTicket = pool.farming.map((farming, index) => {
      const amountForFarmingState = amountsToClaim[counter + index] || 0
      const farmingTokenDecimals = farming.farmingTokenMintDecimals || 9 // for staking
      const amountWithoutDecimals =
        amountForFarmingState / 10 ** farmingTokenDecimals
      return {
        farmingState: farming.farmingState,
        amount: amountWithoutDecimals,
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
