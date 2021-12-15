/**
 * Calls takeFarmingSnapshot method for all farmings of all pools
 * @param pools
 * @return {Promise<void>}
 */

import { sleep } from '@core/utils/helpers'
import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import { sendTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

const MAX_RETRY_COUNT = 1

export const takePoolsFarmingSnapshots = async ({
  pools,
  wallet,
  connection,
}: {
  pools: PoolInfo[]
  wallet: WalletAdapter
  connection: Connection
}) => {
  const poolAuthority = Keypair.fromSecretKey(
    Buffer.from([
      248, 67, 139, 128, 249, 56, 136, 198, 163, 148, 212, 233, 95, 117, 177,
      241, 48, 20, 120, 110, 142, 2, 218, 152, 238, 210, 153, 109, 249, 137,
      218, 108, 195, 151, 179, 178, 110, 137, 182, 5, 106, 131, 122, 178, 193,
      43, 71, 216, 163, 250, 26, 15, 254, 179, 209, 113, 134, 178, 55, 71, 146,
      105, 81, 61,
    ])
  )

  console.log('pools', pools)

  const poolsWithFarming = pools.filter((p) => p.lpTokenFreezeVaultBalance > 0)

  for (let i = 0; i < poolsWithFarming.length; i += 1) {
    const pool = poolsWithFarming[i]

    const programId = getPoolsProgramAddress({ curveType: pool.curveType })

    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: programId,
    })

    if (pool.farming) {
      for (let j = 0; j < pool.farming.length; j++) {
        const farming = pool.farming[j]
        let retries = 0

        const { lpTokenFreezeVault, authority } =
          await program.account.pool.fetch(new PublicKey(pool.swapToken))

        console.log('Pool authority: ', authority.toBase58())

        while (true) {
          try {
            const tx = new Transaction().add(
              await program.instruction.takeFarmingSnapshot({
                accounts: {
                  pool: new PublicKey(pool.swapToken),
                  farmingState: new PublicKey(farming.farmingState),
                  farmingSnapshots: new PublicKey(farming.farmingSnapshots),
                  lpTokenFreezeVault,
                  authority: poolAuthority.publicKey,
                  tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                  clock: SYSVAR_CLOCK_PUBKEY,
                  rent: SYSVAR_RENT_PUBKEY,
                },
              })
            )

            console.log('send transaction', pool, retries)
            await sendTransaction({
              wallet,
              connection,
              transaction: tx,
              signers: [poolAuthority],
            })

            console.error(`serum.takePoolsFarmingSnapshots.snapshots`)
            break
          } catch (e) {
            console.warn('Error collectiong pools: ', e)
            if (e.message.includes('custom program error')) {
              // error might be further parsed by type
              console.error(
                `serum.takePoolsFarmingSnapshots.snapshotsTakenTooEarly`
              )
              break
            }

            /// at some point we might want to get a proper error name
            console.error(`serum.collectRecentPoolsInfo.error.nonProgramError`)
            if (retries < MAX_RETRY_COUNT) {
              retries += 1
              // statsdClient.increment(`serum.collectRecentPoolsInfo.error.snapshotTakingFailed`);
              // break;
            }

            await sleep(retries * 10000)
          }
        }
      }
    }
  }
}
