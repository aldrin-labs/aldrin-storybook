import { Program, Provider } from '@project-serum/anchor'
import {
  Program as Program03,
  Provider as Provider03,
  Idl as Idl03,
} from 'acnhor03'
import { Connection, PublicKey } from '@solana/web3.js'
import { notifyForDevelop } from '../notifications'
import { WalletAdapter } from '../types'
import { getIdlByProgramAddress } from './getIdlByProgramAddress'
import { VESTING_PROGRAM_ADDRESS } from './utils'
import { walletAdapterToWallet } from '../common'

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

    const programIdl = getIdlByProgramAddress(programAddress)
    const programId = new PublicKey(programAddress)

    const poolsProgram =
      programAddress === VESTING_PROGRAM_ADDRESS
        ? (new Program03(
            programIdl as Idl03,
            new PublicKey(VESTING_PROGRAM_ADDRESS),
            new Provider03(
              connection,
              walletAdapterToWallet(wallet),
              Provider.defaultOptions()
            )
          ) as any as Program) // TODO
        : new Program(
            programIdl,
            programId,
            new Provider(
              connection,
              walletAdapterToWallet(wallet),
              Provider.defaultOptions()
            )
          )

    this.cache[programAddress] = poolsProgram

    return poolsProgram
  }
}

const instance = new ProgramsMultiton()

export { instance as ProgramsMultiton }
