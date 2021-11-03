import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  Account,
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { createTokenAccountTransaction, sendTransaction } from '../send'
import { WalletAdapter } from '../types'
import { FarmingTicket, SnapshotQueue } from '../common/types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getSnapshotsWithUnclaimedRewards } from './addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import { NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION } from '../common/config'
import BN from 'bn.js'
import { isCancelledTransactionError } from '../common/isCancelledTransactionError'

export const withdrawFarmed = async ({
  wallet,
  connection,
  allTokensData,
  farmingTickets,
  snapshotQueues,
  pool,
}: {
  wallet: WalletAdapter
  connection: Connection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  snapshotQueues: SnapshotQueue[]
  pool: PoolInfo
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const { swapToken } = pool
  const poolPublicKey = new PublicKey(swapToken)

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const createdTokensMap = new Map()
  let tx = null

  const sendPartOfTransactions = async (transaction: Transaction) => {
    try {
      tx = await sendTransaction({
        wallet,
        connection,
        transaction,
        signers: [],
        focusPopup: true,
      })

      if (!tx) {
        return 'failed'
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (isCancelledTransactionError(e)) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  // check farmed for every ticket and withdrawFarmed for every farming state
  for (let ticketData of farmingTickets) {
    for (let i = 0; i < pool.farming.length; i++) {
      let commonTransaction = new Transaction()

      const farmingState = pool.farming[i]

      // find amount to claim for this farming state in tickets amounts
      const amountToClaim =
        ticketData.amountsToClaim.find(
          (amountToClaim) =>
            amountToClaim.farmingState === farmingState.farmingState
        )?.amount || 0

      // check amount for every farming state
      if (amountToClaim === 0) continue

      const { address: farmingTokenAccountAddress } = getTokenDataByMint(
        allTokensData,
        farmingState.farmingTokenMint
      )

      let userFarmingTokenAccount = farmingTokenAccountAddress
        ? new PublicKey(farmingTokenAccountAddress)
        : null

      // to not create same token several times
      if (createdTokensMap.has(farmingState.farmingTokenMint)) {
        userFarmingTokenAccount = createdTokensMap.get(
          farmingState.farmingTokenMint
        )
      }

      // create pool token account for user if not exist
      if (!userFarmingTokenAccount) {
        const {
          transaction: createAccountTransaction,
          newAccountPubkey,
        } = await createTokenAccountTransaction({
          wallet,
          mintPublicKey: new PublicKey(farmingState.farmingTokenMint),
        })

        userFarmingTokenAccount = newAccountPubkey
        createdTokensMap.set(farmingState.farmingTokenMint, newAccountPubkey)
        commonTransaction.add(createAccountTransaction)
      }

      const withdrawFarmedTransaction = await program.instruction.withdrawFarmed(
        new BN(NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION),
        {
          accounts: {
            pool: poolPublicKey,
            farmingState: new PublicKey(farmingState.farmingState),
            farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
            farmingTicket: new PublicKey(ticketData.farmingTicket),
            farmingTokenVault: new PublicKey(farmingState.farmingTokenVault),
            poolSigner: vaultSigner,
            userFarmingTokenAccount,
            userKey: wallet.publicKey,
            userSolAccount: wallet.publicKey,
            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
        }
      )

      commonTransaction.add(withdrawFarmedTransaction)

      // get number of snapshots, get number of iterations, send transaction n times
      const unclaimedSnapshots = getSnapshotsWithUnclaimedRewards({
        ticket: ticketData,
        farmingState,
        snapshotQueues,
      })

      const iterations = Math.ceil(
        unclaimedSnapshots.length / NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION
      )

      for (let i = 1; i <= iterations; i++) {
        const result = await sendPartOfTransactions(commonTransaction)

        // reset create account, leave only withdrawFarmed for all transactions except first
        commonTransaction = new Transaction().add(withdrawFarmedTransaction)
        if (result !== 'success') {
          return result
        }
      }
    }
  }

  return 'success'
}
