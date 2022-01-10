import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { VESTING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { createTokenAccountTransaction } from '../send'
import { WithdrawVestingParams } from './types'

/**
 *
 * @param params
 * @returns Array with 2 elements: transaction with instructions and token account pk
 */
export const withrawVestingInstruction = async (
  params: WithdrawVestingParams
): Promise<[Transaction, PublicKey]> => {
  const { connection, wallet, vesting } = params

  const tx = new Transaction()
  let { withdrawAccount } = params

  if (!withdrawAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(vesting.mint),
      })

    withdrawAccount = newAccountPubkey
    tx.add(createAccountTransaction)
  }
  const program = ProgramsMultiton.getProgramByAddress({
    programAddress: VESTING_PROGRAM_ADDRESS,
    connection,
    wallet,
  })

  const [vestingSigner] = await PublicKey.findProgramAddress(
    [vesting.vesting.toBuffer()],
    program.programId
  )

  const instruction: TransactionInstruction =
    await program.instruction.withdraw(vesting.startBalance, {
      accounts: {
        vesting: vesting.vesting,
        beneficiary: wallet.publicKey,
        vault: vesting.vault,
        vestingSigner,
        token: withdrawAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    })

  tx.add(instruction)

  return [tx, withdrawAccount]
}
