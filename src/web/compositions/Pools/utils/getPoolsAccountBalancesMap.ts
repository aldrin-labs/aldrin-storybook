import { Connection } from '@solana/web3.js'

import { splitBy } from '@core/collection'

import { CHUNK_SIZE_FOR_GET_MULTIPLE_ACCOUNTS } from './config'
import { getPoolsBalancesMapByResponse } from './getPoolsBalancesMapByResponse'
import { getPoolsBaseQuoteAccountsAddresses } from './getPoolsBaseQuoteAccountsAddresses'
import {
  PoolsBasicInfoType,
  RawPool,
  PoolsBalancesMapType,
  GetMultipleAccountsJsonResponse,
  GetAccountInfoJsonResponse,
} from './types'

export const getPoolsAccountBalancesMap = async (
  connection: Connection,
  pools: RawPool[] | PoolsBasicInfoType[]
): Promise<PoolsBalancesMapType> => {
  const poolBaseQuoteTokenAccountsAddresses =
    getPoolsBaseQuoteAccountsAddresses(pools)
  const chunkOfPoolBaseQuoteTokenAccountAddresses = splitBy(
    poolBaseQuoteTokenAccountsAddresses,
    CHUNK_SIZE_FOR_GET_MULTIPLE_ACCOUNTS
  )

  let poolBaseQuoteTokenAccountsData: GetAccountInfoJsonResponse[] = []

  for (const chunkAddresses of chunkOfPoolBaseQuoteTokenAccountAddresses) {
    const chunkData: GetMultipleAccountsJsonResponse = await (
      connection as any
    )._rpcRequest('getMultipleAccounts', [
      chunkAddresses,
      { encoding: 'jsonParsed' },
    ])

    const tokenAccountsData: GetAccountInfoJsonResponse[] =
      chunkData.result.value

    poolBaseQuoteTokenAccountsData = [
      ...poolBaseQuoteTokenAccountsData,
      ...tokenAccountsData,
    ]
  }

  const poolsBalancesMap = getPoolsBalancesMapByResponse(
    poolBaseQuoteTokenAccountsData
  )

  return poolsBalancesMap
}
