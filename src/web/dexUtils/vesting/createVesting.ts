import { createTokenAccountInstrs } from '@project-serum/common'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { ProgramsMultiton, VESTING_PROGRAM_ADDRESS } from '@core/solana'

import { CreateVestingParams } from './types'

export const createVestingTransaction = async (
  params: CreateVestingParams
): Promise<[Transaction, Signer[]]> => {
  const {
    wallet,
    connection,
    tokenMint,
    depositAmount,
    vestingPeriod,
    depositorAccount,
    accountLamports,
  } = params

  const unlockTs = new BN(Date.now() / 1000).add(vestingPeriod)

  const program = ProgramsMultiton.getProgramByAddress({
    programAddress: VESTING_PROGRAM_ADDRESS,
    connection: connection.getConnection(),
    wallet,
  })

  const vestingAccount = Keypair.generate()
  const vestingVault = Keypair.generate()

  const [vestingSigner, vaultSignerNonce] = await PublicKey.findProgramAddress(
    [vestingAccount.publicKey.toBuffer()],
    program.programId
  )

  if (!wallet.publicKey) {
    throw Error('No public key!')
  }

  const creatorPk = wallet.publicKey

  const tx = new Transaction()
    .add(await program.account.vesting.createInstruction(vestingAccount))
    .add(
      ...(await createTokenAccountInstrs(
        program.provider,
        vestingVault.publicKey,
        tokenMint,
        vestingSigner,
        accountLamports
      ))
    )
    .add(
      await program.instruction.createVesting(
        creatorPk,
        depositAmount,
        vaultSignerNonce,
        unlockTs, // unlock start
        unlockTs.addn(1), // unlock end
        new BN(1), // Leave empty
        null,
        {
          accounts: {
            vesting: vestingAccount.publicKey,
            vault: vestingVault.publicKey,
            depositor: depositorAccount,
            depositorAuthority: creatorPk,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        }
      )
    )

  return [tx, [vestingAccount, vestingVault]]
}
