import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { notifyForDevelop } from '../notifications'
import { WalletAdapter } from '../types'
import { getIdlByProgramAddress } from './getIdlByProgramAddress'

class ProgramsMultiton {
  private cache: { [programAddress: string]: Program } = {}

  getProgramByAddress({
    wallet,
    connection,
    programAddress,
  }: {
    wallet: WalletAdapter
    connection: Connection
    programAddress: string
  }) {
    // save program to key program-address
    if (this.cache[programAddress]) {
      return this.cache[programAddress]
    }

    if (!wallet || !connection || !wallet.publicKey) {
      notifyForDevelop({
        message: 'No wallet or connection in getProgramByAddress',
        wallet,
        connection,
        programAddress,
      })

      throw Error('No wallet or connection in getProgramByAddress')
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

    this.cache[programAddress] = poolsProgram

    return poolsProgram
  }
}

const instance = new ProgramsMultiton()

export { instance as ProgramsMultiton }