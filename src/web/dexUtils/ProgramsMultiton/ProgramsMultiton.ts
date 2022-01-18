import { Idl, Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  Program as Program03,
  Provider as Provider03,
  Idl as Idl03,
} from 'acnhor03'

import MarketOrderProgramIdl from '@core/idls/marketOrder.json'
import PoolsProgramIdl from '@core/idls/pools.json'
import PoolsV2ProgramIdl from '@core/idls/poolsV2.json'
import StakingProgramIdl from '@core/idls/staking.json'
import VestingProgramIdl from '@core/idls/vesting.json'

import { walletAdapterToWallet } from '../common'
import { notifyForDevelop } from '../notifications'
import { WalletAdapter } from '../types'
import BorrowLendingIdl from './idls/borrowLending.json'
import {
  POOLS_PROGRAM_ADDRESS,
  MARKET_ORDER_PROGRAM_ADDRESS,
  STAKING_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  VESTING_PROGRAM_ADDRESS,
  BORROW_LENDING_PROGRAM_ADDRESS,
  defaultOptions,
} from './utils'

const IDLS = {
  [POOLS_PROGRAM_ADDRESS]: PoolsProgramIdl as Idl,
  [POOLS_V2_PROGRAM_ADDRESS]: PoolsV2ProgramIdl as Idl,
  [MARKET_ORDER_PROGRAM_ADDRESS]: MarketOrderProgramIdl as Idl,
  [STAKING_PROGRAM_ADDRESS]: StakingProgramIdl as Idl,
  [VESTING_PROGRAM_ADDRESS]: VestingProgramIdl as Idl03,
  [BORROW_LENDING_PROGRAM_ADDRESS]: BorrowLendingIdl as Idl,
}

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

    const programIdl = IDLS[programAddress]
    if (!programIdl) {
      throw Error('Programm addres not found')
    }
    const programId = new PublicKey(programAddress)

    const poolsProgram =
      programAddress === VESTING_PROGRAM_ADDRESS
        ? (new Program03(
            programIdl as Idl03,
            new PublicKey(VESTING_PROGRAM_ADDRESS),
            new Provider03(
              connection,
              walletAdapterToWallet(wallet),
              defaultOptions()
            )
          ) as any as Program) // TODO
        : new Program(
            programIdl,
            programId,
            new Provider(
              connection,
              walletAdapterToWallet(wallet),
              defaultOptions()
            )
          )

    this.cache[cacheKey] = poolsProgram

    return poolsProgram
  }
}

const instance = new ProgramsMultiton()

export { instance as ProgramsMultiton }
