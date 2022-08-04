import { PublicKey } from '@solana/web3.js'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  RIN_MINT,
  STAKING_PROGRAM_ADDRESS,
} from '@core/solana'

import { PoolInfo } from '../compositions/Pools/index.types'
import { startStaking } from './common/actions'
import { getTokensForUser } from './migrateAll'
import { StakingPool } from './staking/types'

interface StakeAllParams {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  rinStaking: StakingPool
  pools: PoolInfo[]
}

export const stakeAll = async (params: StakeAllParams) => {
  const { wallet, connection, rinStaking, pools } = params
  const tokens = await getTokensForUser(wallet.publicKey, connection)

  const rin = tokens.get(RIN_MINT)
  if (rin && rin.amount.gtn(0)) {
    // console.log('start rin staking', rin, rin.amount.toString())
    const result = await startStaking({
      wallet,
      connection,
      amount: parseFloat(rin.amount.toString()) / 10 ** 9,
      decimals: 9,
      farmingTickets: [],
      stakingPool: rinStaking,
      programAddress: STAKING_PROGRAM_ADDRESS,
      userPoolTokenAccount: new PublicKey(rin.address),
    })

    if (result !== 'success') {
      throw new Error(`Failed to stake rin: ${result}`)
    }
  }

  for (let i = 0; i < pools.length; i += 1) {
    const pool = pools[i]

    const hasActiveFarming = pool.farming?.some(
      (_) => _.tokensTotal > _.tokensUnlocked
    )

    const poolTokenAccount = tokens.get(pool.poolTokenMint)
    if (
      poolTokenAccount &&
      poolTokenAccount.amount.gten(10_000) &&
      hasActiveFarming
    ) {
      const result = await startStaking({
        wallet,
        connection,
        amount: parseFloat(poolTokenAccount.amount.toString()),
        decimals: 0,
        farmingTickets: [],
        stakingPool: pool,
        programAddress: pool.curve
          ? POOLS_V2_PROGRAM_ADDRESS
          : POOLS_PROGRAM_ADDRESS,
        userPoolTokenAccount: new PublicKey(poolTokenAccount.address),
      })

      if (result !== 'success') {
        throw new Error(`Failed to stake LP tokens: ${result}`)
      }
    }
  }

  return 'success'
}
