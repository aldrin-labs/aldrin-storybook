import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  Account,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,
  isTransactionFailed,
  sendSignedTransaction,
  sendTransaction,
  signTransactions,
} from '../send'
import { WalletAdapter } from '../types'
import { FarmingTicket, SnapshotQueue } from '../common/types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { getSnapshotsWithUnclaimedRewards } from './addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import { NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION } from '../common/config'
import BN from 'bn.js'
import { isCancelledTransactionError } from '../common/isCancelledTransactionError'
import { sleep } from '../utils'
import { getRandomInt } from '@core/utils/helpers'

export const withdrawFarmed = async ({
  wallet,
  connection,
  allTokensData,
  farmingTickets,
  pool,
}: {
  wallet: WalletAdapter
  connection: Connection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
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
  let commonTransaction = new Transaction()
  const commonSigners: (Account | Keypair)[] = []

  let tx = null

  const sendPartOfTransactions = async () => {
    try {
      tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
        focusPopup: true,
      })

      if (isTransactionFailed(tx)) {
        return 'failed'
      }

      commonTransaction = new Transaction()
    } catch (e) {
      console.log('end farming catch error', e)

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  // check farmed for every ticket and withdrawFarmed for every farming state
  for (let ticketData of farmingTickets) {
    for (let i = 0; i < pool.farming.length; i++) {
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

      const endFarmingTransaction = await program.instruction.withdrawFarmed({
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
      })

      commonTransaction.add(endFarmingTransaction)

      if (commonTransaction.instructions.length > 5) {
        const result = await sendPartOfTransactions()
        if (result !== 'success') {
          return result
        }
      }
    }
  }

  if (commonTransaction.instructions.length > 0) {
    const result = await sendPartOfTransactions()
    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}


// export const withdrawFarmed = async ({
//   wallet,
//   connection,
//   allTokensData,
//   farmingTickets,
//   snapshotQueues,
//   pool,
// }: {
//   wallet: WalletAdapter
//   connection: Connection
//   allTokensData: TokenInfo[]
//   farmingTickets: FarmingTicket[]
//   snapshotQueues: SnapshotQueue[]
//   pool: PoolInfo
// }) => {
//   if (!wallet.publicKey) return 'failed'

//   const program = ProgramsMultiton.getProgramByAddress({
//     wallet,
//     connection,
//     programAddress: POOLS_PROGRAM_ADDRESS,
//   })

//   const { swapToken } = pool
//   const poolPublicKey = new PublicKey(swapToken)

//   const [vaultSigner] = await PublicKey.findProgramAddress(
//     [poolPublicKey.toBuffer()],
//     program.programId
//   )

//   const createdTokensMap = new Map()
//   const transactionsAndSigners = []

//   // check farmed for every ticket and withdrawFarmed for every farming state
//   for (let ticketData of farmingTickets) {
//     for (let i = 0; i < pool.farming.length; i++) {
//       let commonTransaction = new Transaction()

//       const farmingState = pool.farming[i]

//       // find amount to claim for this farming state in tickets amounts
//       const amountToClaim =
//         ticketData.amountsToClaim.find(
//           (amountToClaim) =>
//             amountToClaim.farmingState === farmingState.farmingState
//         )?.amount || 0

//       // check amount for every farming state
//       if (amountToClaim === 0) continue

//       const { address: farmingTokenAccountAddress } = getTokenDataByMint(
//         allTokensData,
//         farmingState.farmingTokenMint
//       )

//       let userFarmingTokenAccount = farmingTokenAccountAddress
//         ? new PublicKey(farmingTokenAccountAddress)
//         : null

//       // to not create same token several times
//       if (createdTokensMap.has(farmingState.farmingTokenMint)) {
//         userFarmingTokenAccount = createdTokensMap.get(
//           farmingState.farmingTokenMint
//         )
//       }

//       // create pool token account for user if not exist
//       if (!userFarmingTokenAccount) {
//         const {
//           transaction: createAccountTransaction,
//           newAccountPubkey,
//         } = await createTokenAccountTransaction({
//           wallet,
//           mintPublicKey: new PublicKey(farmingState.farmingTokenMint),
//         })

//         userFarmingTokenAccount = newAccountPubkey
//         createdTokensMap.set(farmingState.farmingTokenMint, newAccountPubkey)
//         commonTransaction.add(createAccountTransaction)
//       }

//       // get number of snapshots, get number of iterations, send transaction n times
//       const unclaimedSnapshots = getSnapshotsWithUnclaimedRewards({
//         ticket: ticketData,
//         farmingState,
//         snapshotQueues,
//       })

//       const iterations = Math.ceil(
//         unclaimedSnapshots.length / NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION
//       )

//       for (let i = 1; i <= iterations; i++) {
//         const withdrawFarmedTransaction = await program.instruction.withdrawFarmed(
//           new BN(NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION),
//           {
//             accounts: {
//               pool: poolPublicKey,
//               farmingState: new PublicKey(farmingState.farmingState),
//               farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
//               farmingTicket: new PublicKey(ticketData.farmingTicket),
//               farmingTokenVault: new PublicKey(farmingState.farmingTokenVault),
//               poolSigner: vaultSigner,
//               userFarmingTokenAccount,
//               userKey: wallet.publicKey,
//               userSolAccount: wallet.publicKey,
//               tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
//               clock: SYSVAR_CLOCK_PUBKEY,
//               rent: SYSVAR_RENT_PUBKEY,
//             },
//           }
//         )

//         // due to same transaction data for withdrawFarmed we need add transaction with random
//         // lamports amount to get random transaction hash every time
//         const transferTransaction = await SystemProgram.transfer({
//           fromPubkey: wallet.publicKey,
//           toPubkey: wallet.publicKey,
//           lamports: getRandomInt(1, 1000),
//         })

//         commonTransaction.add(withdrawFarmedTransaction)
//         commonTransaction.add(transferTransaction)

//         transactionsAndSigners.push({ transaction: commonTransaction })
//         // reset create account, leave only withdrawFarmed for all transactions except first
//         commonTransaction = new Transaction()
//       }
//     }
//   }

//   try {
//     const signedTransactions = await signTransactions({
//       wallet,
//       connection,
//       transactionsAndSigners,
//     })

//     if (!signedTransactions) {
//       return 'failed'
//     }

//     for (let signedTransaction of signedTransactions) {
//       // send transaction and wait 1s before sending next
//       const result = await sendSignedTransaction({
//         transaction: signedTransaction,
//         connection,
//         timeout: 5_000,
//       })

//       if (result === 'timeout') {
//         return 'blockhash_outdated'
//       } else {
//         return 'failed'
//       }

//       // await sleep(2000)
//     }
//   } catch (e) {
//     console.log('end farming catch error', e)

//     if (isCancelledTransactionError(e)) {
//       return 'cancelled'
//     }
//   }

//   return 'success'
// }
