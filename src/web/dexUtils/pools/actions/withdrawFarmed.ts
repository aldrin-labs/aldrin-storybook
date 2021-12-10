import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,

  sendTransaction
} from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import {
  Connection,
  PublicKey,

  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction
} from '@solana/web3.js'


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

  return 'success'

  // if (signAllTransactions) {
  //   try {
  //     const signedTransactions = await signTransactions({
  //       wallet,
  //       connection,
  //       transactionsAndSigners,
  //     })

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
}