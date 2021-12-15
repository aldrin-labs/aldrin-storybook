import { TokenInstructions } from '@project-serum/serum'
import {
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,
  sendSignedTransaction,
  sendTransaction,
  signTransactions,
} from '@sb/dexUtils/send'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getSnapshotsWithUnclaimedRewards } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import {
  MIN_POOL_TOKEN_AMOUNT_TO_STAKE,
  NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION,
} from '@sb/dexUtils/common/config'
import BN from 'bn.js'
import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import { getRandomInt } from '@core/utils/helpers'
import { WithdrawFarmedParams } from '@sb/dexUtils/staking/types'

export const withdrawFarmed = async ({
  wallet,
  connection,
  allTokensData,
  farmingTickets,
  snapshotQueues,
  pool,
  signAllTransactions,
}: WithdrawFarmedParams) => {
  if (!wallet.publicKey) return 'failed'

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: getPoolsProgramAddress({ curveType: pool.curveType }),
  })

  const { swapToken } = pool
  const poolPublicKey = new PublicKey(swapToken)

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const createdTokensMap = new Map()
  const transactionsAndSigners = []

  // check farmed for every ticket and withdrawFarmed for every farming state
  for (const ticketData of farmingTickets) {
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
      if (
        amountToClaim === 0 ||
        ticketData.tokensFrozen < MIN_POOL_TOKEN_AMOUNT_TO_STAKE
      )
        continue

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
        const { transaction: createAccountTransaction, newAccountPubkey } =
          await createTokenAccountTransaction({
            wallet,
            mintPublicKey: new PublicKey(farmingState.farmingTokenMint),
          })

        userFarmingTokenAccount = newAccountPubkey
        createdTokensMap.set(farmingState.farmingTokenMint, newAccountPubkey)
        commonTransaction.add(createAccountTransaction)
      }

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
        const withdrawFarmedTransaction =
          await program.instruction.withdrawFarmed(
            new BN(NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION),
            {
              accounts: {
                pool: poolPublicKey,
                farmingState: new PublicKey(farmingState.farmingState),
                farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
                farmingTicket: new PublicKey(ticketData.farmingTicket),
                farmingTokenVault: new PublicKey(
                  farmingState.farmingTokenVault
                ),
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

        // due to same transaction data for withdrawFarmed we need add transaction with random
        // lamports amount to get random transaction hash every time
        const transferTransaction = await SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey,
          lamports: getRandomInt(1, 1000),
        })

        commonTransaction.add(withdrawFarmedTransaction)
        commonTransaction.add(transferTransaction)

        if (signAllTransactions) {
          transactionsAndSigners.push({ transaction: commonTransaction })
        } else {
          const result = await sendTransaction({
            wallet,
            connection,
            transaction: commonTransaction,
            signers: [],
          })

          if (result === 'timeout') {
            return 'blockhash_outdated'
          }
          if (result === 'failed') {
            return 'failed'
          }
        }
        // reset create account, leave only withdrawFarmed for all transactions except first
        commonTransaction = new Transaction()
      }
    }
  }

  if (signAllTransactions) {
    try {
      const signedTransactions = await signTransactions({
        wallet,
        connection,
        transactionsAndSigners,
      })

      if (!signedTransactions) {
        return 'failed'
      }

      for (const signedTransaction of signedTransactions) {
        // send transaction and wait 1s before sending next
        const result = await sendSignedTransaction({
          transaction: signedTransaction,
          connection,
          timeout: 10_000,
        })

        if (result === 'timeout') {
          return 'blockhash_outdated'
        }
        if (result === 'failed') {
          return 'failed'
        }

        // await sleep(2000)
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (isCancelledTransactionError(e)) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  return 'success'
}
