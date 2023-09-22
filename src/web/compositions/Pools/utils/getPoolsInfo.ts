import { BN } from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'

import { getPoolsAccountBalancesMap } from './getPoolsAccountBalancesMap'
import { getPoolsSupplyMap } from './getPoolsSupplyMap'
import { getTokenSymbolByMintAddress } from './getTokenSymbolByMintAddress'
import { RawPool, PoolsInfoType } from './types'

export const getPoolsInfo = async (
  pools: RawPool[],
  connection: Connection
): Promise<PoolsInfoType[]> => {
  let poolsAccountBalancesMap: { [x: string]: { [x: string]: any } }
  try {
    poolsAccountBalancesMap = await getPoolsAccountBalancesMap(
      connection,
      pools
    )
  } catch (e) {
    console.log('getting getPoolsAccountBalancesMap error in getPoolsInfo', e)
    throw e
  }

  let poolsSupplyMap: { [x: string]: { [x: string]: any } }
  try {
    poolsSupplyMap = await getPoolsSupplyMap(connection, pools)
  } catch (e) {
    console.log('getting getPoolsSupplyTokenMap error in getPoolsInfo', e)
    throw e
  }

  try {
    const poolsInfo = pools.map((pool) => {
      const programId = pool.programId.toString()

      const mintA = pool.mintA.toString()
      const mintB = pool.mintB.toString()

      const tokenASymbol = getTokenSymbolByMintAddress(mintA)
      const tokenBSymbol = getTokenSymbolByMintAddress(mintB)

      const { providerId } = pool
      const poolAddress = pool.pubkey.toString()

      const poolTokenAccountA = pool.tokenAccountA.toString()
      const poolTokenAccountB = pool.tokenAccountB.toString()
      const poolMintAddress = pool?.poolToken?.toString()
      const poolSigner = pool.poolSigner.toString()
      const curveType = pool.curveType !== undefined ? pool.curveType : null

      const { initializerAccount } = pool

      const tokenABalanceData = poolsAccountBalancesMap[poolSigner][mintA]
      const tokenBBalanceData = poolsAccountBalancesMap[poolSigner][mintB]
      const lpTokenBalanceData =
        poolsAccountBalancesMap[poolSigner][poolMintAddress]

      const tokenAmountA = new BN(tokenABalanceData.tokenAmount.amount)
      const tokenAmountB = new BN(tokenBBalanceData.tokenAmount.amount)
      const lptokenAmount = new BN(lpTokenBalanceData.tokenAmount.amount)

      const tokenABalance: string = tokenABalanceData.tokenAmount.uiAmountString
      const tokenBBalance: string = tokenBBalanceData.tokenAmount.uiAmountString
      const lptokenBalance: string =
        lpTokenBalanceData.tokenAmount.uiAmountString

      const tokenADecimals = tokenABalanceData.tokenAmount.decimals
      const tokenBDecimals = tokenBBalanceData.tokenAmount.decimals
      const lptokenDecimals = lpTokenBalanceData.tokenAmount.decimals

      const { feePoolTokenAccount } = pool

      const {
        tradeFeeNumerator,
        ownerTradeFeeNumerator,
        tradeFeeDenominator,
        ownerTradeFeeDenominator,
      } = pool.fees

      const timestamp = Math.floor(Date.now() / 1000) // unix timestamp in seconds

      const curve = pool.curve && pool.curve.toString()

      const isFarmingForPoolExists =
        pool.farmingData &&
        Array.isArray(pool.farmingData) &&
        pool.farmingData.length

      const data = {
        programId,
        name: `${mintA}_${mintB}`,
        fees: {
          tradeFeeNumerator: tradeFeeNumerator.toNumber(),
          ownerTradeFeeNumerator: ownerTradeFeeNumerator.toNumber(),
          tradeFeeDenominator: tradeFeeDenominator.toNumber(),
          ownerTradeFeeDenominator: ownerTradeFeeDenominator.toNumber(),
        },
        tokenA: mintA,
        tokenB: mintB,
        tvl: {
          tokenA: tokenABalance,
          tokenB: tokenBBalance,
        },
        supply: poolsSupplyMap[poolSigner].supply,
        parsedName: `${tokenASymbol}_${tokenBSymbol}`,

        tokenSwap: poolAddress,
        swapToken: poolAddress,
        poolAddress,

        providerId,
        poolSigner,
        poolToken: pool.poolToken.toString(),
        poolTokenMint: poolMintAddress,
        mintA,
        mintB,
        tokenADecimals,
        tokenBDecimals,
        tokenAmountA,
        tokenAmountB,
        tokenAccountA: pool.tokenAccountA,
        tokenAccountB: pool.tokenAccountB,

        poolTokenAccountA,
        poolTokenAccountB,

        tokenABalance,
        tokenBBalance,

        tokenABalanceExtended: tokenABalanceData.tokenAmount,
        tokenBBalanceExtended: tokenBBalanceData.tokenAmount,
        lpTokenFreezeVault: pool.lpTokenFreezeVault,
        lpTokenFreezeVaultBalance: lptokenBalance,
        lptokenAmount,
        lptokenBalance,
        lptokenDecimals,

        curve,
        curveType,

        ...(isFarmingForPoolExists
          ? {
              farming: (pool.farmingData ?? []).map((el) => {
                return {
                  farmingState: el.farmingPubKey.toString(),
                  tokensUnlocked: el.tokensUnlocked.toString(),
                  tokensPerPeriod: el.tokensPerPeriod.toString(),
                  tokensTotal: el.tokensTotal.toString(),
                  periodLength: el.periodLength.toString(),
                  noWithdrawalTime: el.noWithdrawalTime.toString(),
                  vestingType: el.vestingType,
                  vestingPeriod: el.vestingPeriod.toString(),
                  startTime: el.startTime.toString(),
                  currentTime: el.currentTime.toString(),
                  pool: el.pool.toString(),
                  farmingTokenVault: el.farmingTokenVault.toString(),
                  farmingTokenMint: el.farmingTokenMint,
                  farmingTokenMintDecimals: el.farmingTokenMintDecimals,
                  farmingSnapshots: el.farmingSnapshots.toString(),
                }
              }),
            }
          : { farming: null }),

        initializerAccount: initializerAccount.toString(),
        feePoolTokenAccount,

        rawPoolData: {
          ...pool,
        },

        updateTime: Date.now(),
        timestamp,
      }

      return data
    })

    return poolsInfo
  } catch (e) {
    console.error('collectRecentPoolsInfo:', e)
    throw e
  }
}
