import { PublicKey } from '@solana/web3.js'
import { ProgramAccount } from 'anchor024'

import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'

import { ADDITIONAL_POOL_OWNERS } from '@core/config/dex'
import { Vesting, Farmer, Farm } from '@core/solana'

import { getTokenDataByMint } from '.'
import { PoolInfo } from '../index.types'

interface GetUserPoolsParams {
  allTokensData: TokenInfo[]
  poolsInfo: PoolInfo[]
  vestings: Map<string, Vesting>
  walletPublicKey?: PublicKey | null
  farms?: Map<string, Farm>
  farmers?: Map<String, ProgramAccount<Farmer>>
}

export const getUserPoolsFromAll = (params: GetUserPoolsParams) => {
  const {
    farms,
    farmers,
    poolsInfo,
    allTokensData,
    vestings,
    walletPublicKey,
  } = params
  const walletKey = walletPublicKey?.toBase58()
  return poolsInfo.filter((el) => {
    const { amount: poolTokenAmount } = getTokenDataByMint(
      allTokensData,
      el.poolTokenMint
    )

    const farm = farms?.get(el.poolTokenMint)
    const farmer = farmers?.get(farm?.publicKey.toString() || '')
    const vesting = vestings.get(el.poolTokenMint)
    if (farmer) {
      console.log('farmer:', farmers, farmer)
    }

    // const openFarmingTickets = filterOpenFarmingTickets(
    //   farmingTicketsMap.get(el.swapToken)
    // )

    // const availableToClaimAmount =
    //   farmingTicketsMap
    //     .get(el.swapToken)
    //     ?.reduce(
    //       (acc, ticket) => acc + getTotalFarmingAmountToClaim(ticket),
    //       0
    //     ) || 0

    // const calcAmounts = el.farming?.map((farming) =>
    //   (calcAccounts.get(farming.farmingState) || []).reduce(
    //     (acc, ca) => acc.add(ca.tokenAmount),
    //     new BN(0)
    //   )
    // )

    const additionalPoolOwners = ADDITIONAL_POOL_OWNERS[el.poolTokenMint] || []

    const isPoolOwner =
      (walletKey && walletKey === el.initializerAccount) ||
      additionalPoolOwners.includes(walletKey || '')

    return (
      poolTokenAmount > MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ||
      farmer?.account.totalStaked.gtn(0) ||
      farmer?.account.harvests.find((h) => h.tokens.amount.gtn(0)) ||
      vesting?.outstanding.gtn(0) ||
      // !!calcAmounts?.find((ca) => ca.gtn(0)) ||
      isPoolOwner
    )
  })
}
