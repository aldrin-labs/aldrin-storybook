import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
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
import { sendTransaction } from '../send'
import { Token } from '../token/token'
import { WalletAdapter } from '../types'
import { checkFarmed } from './checkFarmed'
import { FarmingTicket } from './endFarming'

export const withdrawFarmed = async ({
  wallet,
  connection,
  allTokensDataMap,
  farmingTickets,
  pool,
}: {
  wallet: WalletAdapter
  connection: Connection
  allTokensDataMap: Map<string, TokenInfo>
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
  const commonTransaction = new Transaction()
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

      if (!tx) {
        return 'failed'
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  // console.log('farmingTickets', farmingTickets)

  // check farmed for every ticket and withdrawFarmed for every farming state
  for (let ticketData of farmingTickets.reverse()) {
    for (let i = 0; i < pool.farming.length; i++) {
    // for now only for fisrt farming state
    const farmingState = pool.farming[0]

    // find amount to claim for this farming state in tickets amounts
    const amountToClaim =
      ticketData.amountsToClaim.find(
        (amountToClaim) =>
          amountToClaim.farmingState === farmingState.farmingState
      )?.amount || 0

    // check amount for every farming state
    if (amountToClaim === 0) continue

    // console.log('amountToClaim', amountToClaim, ticketData.farmingTicket)
    // if (
    //   farmingState.farmingState ===
    //     'FWbMz56rZfhVejnYbtxfx1qZc2zcFPN6Rt9rV2H6uEiz' &&
    //   ticketData.farmingTicket ===
    //     '8bVGGwV6xg7Wfhbk29A5djyrahVQsjohwhxiHJWwKm7A'
    // ) {
    //   await sendTransaction({
    //     wallet,
    //     connection,
    //     transaction: new Transaction().add(
    //       await checkFarmed({
    //         wallet,
    //         connection,
    //         farming: farmingState,
    //         farmingTicket: new PublicKey(ticketData.farmingTicket),
    //         poolPublicKey: new PublicKey(pool.swapToken),
    //       })
    //     ),
    //     signers: [],
    //   })
    // }

    const farmingTokenAccountAddress = allTokensDataMap.get(
      farmingState.farmingTokenMint
    )?.address

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
      const poolToken = new Token(
        wallet,
        connection,
        new PublicKey(farmingState.farmingTokenMint),
        TOKEN_PROGRAM_ID
      )

      const [
        newUserFarmingTokenAccount,
        userPoolTokenAccountSignature,
        userPoolTokenAccountTransaction,
      ] = await poolToken.createAccount(wallet.publicKey)

      userFarmingTokenAccount = newUserFarmingTokenAccount
      createdTokensMap.set(
        farmingState.farmingTokenMint,
        newUserFarmingTokenAccount
      )
      commonTransaction.add(userPoolTokenAccountTransaction)
      commonSigners.push(userPoolTokenAccountSignature)
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
