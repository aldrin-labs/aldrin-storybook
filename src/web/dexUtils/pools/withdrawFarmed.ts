import { TokenInstructions } from '@project-serum/serum'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify } from '../notifications'
import { NUMBER_OF_RETRIES } from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { Token } from '../token/token'
import { WalletAdapter } from '../types'
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
  const commonSigners = []

  // check farmed for every ticket and withdrawFarmed for every farming state
  for (let ticketData of farmingTickets) {
    for (let farmingState of pool.farming) {
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
    }
  }

  let counter = 0
  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message: 'Unstaking failed. Please confirm transaction again.',
        })
      }

      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: commonSigners,
        focusPopup: true,
      })

      if (tx) {
        return 'success'
      } else {
        counter++
      }
    } catch (e) {
      console.log('end farming catch error', e)
      counter++

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
