import { PublicKey } from '@solana/web3.js'

import { AldrinConnection, ProgramsMultiton } from '@core/solana'

import { ACCOUNT_DATA_SIZE_MAP_BY_PROGRAM_ID } from './config'
import { filterCorruptedPools } from './filterCorruptedPools'
import { RawPool } from './types'

export const getPools = async (
  programId: PublicKey,
  connection: AldrinConnection
): Promise<RawPool[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    connection,
    programAddress: programId.toString(),
  })

  const dataSizes = ACCOUNT_DATA_SIZE_MAP_BY_PROGRAM_ID[programId.toString()]

  const tokenSwapOwnedAccounts = await connection.getProgramAccounts(
    programId,
    {
      commitment: 'finalized',
      filters: [{ dataSize: dataSizes.Pool }],
    }
  )
  const providerId = 'Aldrin'

  const pools = tokenSwapOwnedAccounts.map((pool) => {
    const data = Buffer.from(pool.account.data)
    const poolData = program.coder.accounts.decode('Pool', data)

    return {
      pubkey: pool.pubkey,
      providerId,
      programId,
      poolToken: poolData.poolMint,
      tokenAccountA: poolData.baseTokenVault,
      tokenAccountB: poolData.quoteTokenVault,
      mintA: poolData.baseTokenMint,
      mintB: poolData.quoteTokenMint,
      poolSigner: poolData.poolSigner,
      fees: poolData.fees,
      curveType: poolData.curveType,
      lpTokenFreezeVault: poolData.lpTokenFreezeVault,
      initializerAccount: poolData.initializerAccount,
      feePoolTokenAccount: poolData.feePoolTokenAccount,
      curve: poolData.curve,
      extra: pool,
    }
  })

  const filtredPools = pools.filter(filterCorruptedPools)

  return filtredPools
}
