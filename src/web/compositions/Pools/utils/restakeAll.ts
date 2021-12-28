import { Connection, PublicKey } from '@solana/web3.js'

import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { MIN_POOL_TOKEN_AMOUNT_TO_STAKE } from '@sb/dexUtils/common/config'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { getEndFarmingTransactions } from '@sb/dexUtils/pools/actions/endFarming'
import { getStartFarmingTransactions } from '@sb/dexUtils/pools/actions/startFarming'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { sleep } from '@sb/dexUtils/utils'

import { getTokenDataByMint } from '.'
import { signAndSendTransactions } from '../../../dexUtils/transactions'
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
    const openFarmings = isPoolWithFarming
      ? filterOpenFarmingStates(farmingStates)
      : []

    if (openFarmings.length === 0) {
      continue
    }

    const { address: userPoolTokenAccount } = getTokenDataByMint(
      allTokensData,
      pool.poolTokenMint
    )
    const hasFarmingTicket = farmingTicketsMap.get(pool.swapToken)

    if (hasFarmingTicket) {
      const transactionsAndSigners = await getEndFarmingTransactions({
        wallet,
        connection,
        poolPublicKey: new PublicKey(pool.swapToken),
        farmingState: openFarmings[0],
        userPoolTokenAccount: userPoolTokenAccount
          ? new PublicKey(userPoolTokenAccount)
          : null,
        curveType: pool.curveType,
      })

      endFarmingTransactions.push(...transactionsAndSigners)
    }
  }

  const resultEndFarming = await signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: endFarmingTransactions,
  })

  if (resultEndFarming !== 'success') {
    return resultEndFarming
  }

  await sleep(7500)

  const userTokens = await getAllTokensData(wallet?.publicKey, connection)

  const startFarmingTransactions = []

  for (let i = 0; i < allPoolsData.length; i += 1) {
    const pool = allPoolsData[i]
    const farmings = pool.farming || []
    const { address: userPoolTokenAccount, amount: poolTokenAmount } =
      getTokenDataByMint(userTokens, pool.poolTokenMint)

    const hasPoolTokenAccount =
      userPoolTokenAccount && poolTokenAmount > MIN_POOL_TOKEN_AMOUNT_TO_STAKE

    if (farmings.length === 0) {
      continue
    }

    if (hasPoolTokenAccount) {
      const transactionsAndSigners = await getStartFarmingTransactions({
        wallet,
        connection,
        poolTokenAmount,
        poolPublicKey: new PublicKey(pool.swapToken),
        userPoolTokenAccount: new PublicKey(userPoolTokenAccount),
        farmingState: new PublicKey(farmings[0].farmingState),
        curveType: pool.curveType,
      })

      startFarmingTransactions.push(...transactionsAndSigners)
    }
  }

  const resultStartFarming = await signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: startFarmingTransactions,
  })

  return resultStartFarming
}
