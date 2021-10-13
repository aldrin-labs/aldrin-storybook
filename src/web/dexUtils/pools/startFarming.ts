import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  Keypair,
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
import { WalletAdapter } from '../types'

export const startFarming = async ({
  wallet,
  connection,
  poolTokenAmount,
  poolPublicKey,
  userPoolTokenAccount,
  farmingState,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolTokenAmount: number
  poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey
  farmingState: PublicKey
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const { lpTokenFreezeVault } = await program.account.pool.fetch(poolPublicKey)

  const farmingTicket = Keypair.generate()
  const farmingTicketInstruction = await program.account.farmingTicket.createInstruction(
    farmingTicket
  )

  const startFarmingTransaction = await program.instruction.startFarming(
    new BN(poolTokenAmount),
    {
      accounts: {
        pool: poolPublicKey,
        farmingState,
        farmingTicket: farmingTicket.publicKey,
        lpTokenFreezeVault: lpTokenFreezeVault,
        userLpTokenAccount: userPoolTokenAccount,
        walletAuthority: wallet.publicKey,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )

  const commonTransaction = new Transaction()
  const commonSigners = []

  commonSigners.push(farmingTicket)
  commonTransaction.add(farmingTicketInstruction)
  commonTransaction.add(startFarmingTransaction)

  let counter = 0
  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message: 'Staking failed. Please confirm transaction again.',
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
      console.log('start farming catch error', e)
      counter++

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}
