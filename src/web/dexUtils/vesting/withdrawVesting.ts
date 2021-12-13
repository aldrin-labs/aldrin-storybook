import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { VESTING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WithdrawVestingParams } from './types'

export const withrawVestingInstruction = async (
  params: WithdrawVestingParams
) => {
  const { connection, wallet, vesting, withdrawAccount } = params

  const program = ProgramsMultiton.getProgramByAddress({
    programAddress: VESTING_PROGRAM_ADDRESS,
    connection,
    wallet,
  })

  const [vestingSigner] = await PublicKey.findProgramAddress(
    [vesting.vesting.toBuffer()],
    program.programId
  )

  const instruction = await program.instruction.withdraw(vesting.startBalance, {
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

  return instruction as TransactionInstruction
}
