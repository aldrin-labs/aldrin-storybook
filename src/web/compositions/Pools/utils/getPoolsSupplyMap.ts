import { Connection } from '@solana/web3.js'

import { splitBy } from '@core/collection'

import { CHUNK_SIZE_FOR_GET_MULTIPLE_ACCOUNTS } from './config'
import {
  GetAccountInfoJsonResponse,
  GetMultipleAccountsJsonResponse,
  RawPool,
} from './types'

export const getPoolsSupplyMap = async (
  connection: Connection,
  pools: RawPool[]
) => {
  const poolTokensAddresses = pools.reduce((acc: string[], pool) => {
    acc.push(pool.poolToken.toString())

    return acc
  }, [])

  const chunkOfPoolBaseQuoteTokenAccountAddresses = splitBy(
    poolTokensAddresses,
    CHUNK_SIZE_FOR_GET_MULTIPLE_ACCOUNTS
  )

  let poolTokensData: GetAccountInfoJsonResponse[] = []

  for (const chunkAddresses of chunkOfPoolBaseQuoteTokenAccountAddresses) {
    const chunkData: GetMultipleAccountsJsonResponse = await (
      connection as any
    )._rpcRequest('getMultipleAccounts', [
      chunkAddresses,
      { encoding: 'jsonParsed' },
    ])

    const tokenAccountsData: GetAccountInfoJsonResponse[] =
      chunkData.result.value

    poolTokensData = [...poolTokensData, ...tokenAccountsData]
  }

  const poolSupplyMap = poolTokensData.reduce(
    (acc: { [key: string]: { supply: number; decimals: number } }, el) => {
      const infoData = el.data.parsed.info
      const { mintAuthority } = infoData
      const { supply } = infoData
      const { decimals } = infoData

      acc[mintAuthority] = { supply: +supply, decimals }

      return acc
    },
    {}
  )

  return poolSupplyMap
}
