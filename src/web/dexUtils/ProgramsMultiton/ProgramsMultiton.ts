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
    const cacheKey = `${programAddress}-${wallet.publicKey}`

    // save program to key program-address-wallet (to load program after connecting wallet)
    // in case of need in program for rpc-decode only
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey]
    }

    if (!connection) {
      notifyForDevelop({
        message: 'No connection in getProgramByAddress',
        wallet,
        connection,
        programAddress,
      })

      throw Error('No connection in getProgramByAddress')
    }


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