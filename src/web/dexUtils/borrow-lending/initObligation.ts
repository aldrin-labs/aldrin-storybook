import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'

export const initObligation = async ({
  wallet,
  connection,
  programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  // Allocate memory for the account
  const balanceNeeded = await connection.getMinimumBalanceForRentExemption(
    program.account.obligation.size
  )

  const newAccount = Keypair.generate()

  console.log('initObligation', program.account.obligation.size)

  const initObligationInstruction = program.instruction.initObligationR10({
    accounts: {
      owner: wallet.publicKey,
      lendingMarket: new PublicKey(
        '6zstoyUpKZ7iiuDND8th19BQHXrUmZ3auqxN2Ujq5vuz'
      ),
      obligation: newAccount.publicKey,
      clock: SYSVAR_CLOCK_PUBKEY,
    },
  })

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: balanceNeeded, // calculate appropriately
    space: program.account.obligation.size,
    programId: program._programId,
  })

  // Send the two instructions
  return signAndSendSingleTransaction({
    transaction: new Transaction()
      .add(createAccountInstruction)
      .add(initObligationInstruction),
    wallet,
    signers: [newAccount],
    connection,
    focusPopup: true,
  })
}
