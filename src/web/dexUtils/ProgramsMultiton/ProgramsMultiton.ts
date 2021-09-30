import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { notifyForDevelop } from '../notifications'
import { WalletAdapter } from '../types'
import { getIdlByProgramAddress } from './getIdlByProgramAddress'

export class ProgramsMultiton {
  [programAddress: string]: Program

  static getProgramByAddress({
    wallet,
    connection,
    programAddress,
  }: {
    wallet: WalletAdapter
    connection: Connection
    programAddress: string
  }) {
    // save program to key program-address
    if (this[programAddress]) {
      return this[programAddress]
    }

    if (!wallet || !connection) {
      notifyForDevelop({
        message: 'No wallet or connection in getProgramByAddress',
        wallet,
        connection,
        programAddress,
      })
      
      return
    }

    console.log('create program', wallet)

    const program_idl = getIdlByProgramAddress(programAddress)
    const programId = new PublicKey(programAddress)

    const poolsProgram = new Program(
      program_idl,
      programId,
      new Provider(connection, wallet, {
        preflightCommitment: 'recent',
        commitment: 'recent',
      })
    )

    this[programAddress] = poolsProgram

    return poolsProgram
  }
}
