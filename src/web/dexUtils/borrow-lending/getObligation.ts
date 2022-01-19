import { Connection, PublicKey } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { BORROW_LENDING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'

export const getObligation = async ({
  wallet,
  connection,
  programAddress = BORROW_LENDING_PROGRAM_ADDRESS,
  obligationPk,
}: {
  wallet: WalletAdapter
  connection: Connection
  programAddress?: string
  obligationPk: PublicKey
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  console.log(program.account.obligation)

  return await program.account.obligation.fetch(obligationPk)
}
