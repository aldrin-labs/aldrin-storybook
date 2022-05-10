/* eslint-disable no-nested-ternary */
import { Idl, Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  Program as Program019,
  Provider as Provider019,
  Idl as Idl019,
} from 'anchor019'
import {
  Program as Program020,
  Provider as Provider020,
  Idl as Idl020,
} from 'anchor020'
import {
  Program as Program03,
  Provider as Provider03,
  Idl as Idl03,
} from 'anchor03'

import MarketOrderProgramIdl from '@core/idls/marketOrder.json'
import PlutoniansStakingProgramIdl from '@core/idls/plutonians.json'
import PoolsProgramIdl from '@core/idls/pools.json'
import PoolsV2ProgramIdl from '@core/idls/poolsV2.json'
import StakingProgramIdl from '@core/idls/staking.json'
import TwammProgramIdl from '@core/idls/twamm.json'
import VestingProgramIdl from '@core/idls/vesting.json'

import { notifyForDevelop } from '../notifications'
import { WalletAdapter } from '../types'
import {
  POOLS_PROGRAM_ADDRESS,
  MARKET_ORDER_PROGRAM_ADDRESS,
  STAKING_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  VESTING_PROGRAM_ADDRESS,
  TWAMM_PROGRAM_ADDRESS,
  PLUTONIANS_STAKING_ADDRESS,
  defaultOptions,
} from './utils'

const IDLS = {
  [POOLS_PROGRAM_ADDRESS]: PoolsProgramIdl as Idl,
  [POOLS_V2_PROGRAM_ADDRESS]: PoolsV2ProgramIdl as Idl,
  [MARKET_ORDER_PROGRAM_ADDRESS]: MarketOrderProgramIdl as Idl,
  [STAKING_PROGRAM_ADDRESS]: StakingProgramIdl as Idl,
  [VESTING_PROGRAM_ADDRESS]: VestingProgramIdl as Idl03,
  [TWAMM_PROGRAM_ADDRESS]: TwammProgramIdl as Idl019,
  [PLUTONIANS_STAKING_ADDRESS]: PlutoniansStakingProgramIdl as Idl020,
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

    if (programAddress === VESTING_PROGRAM_ADDRESS) {
      this.cache[cacheKey] = new Program03(
        programIdl as Idl03,
        new PublicKey(VESTING_PROGRAM_ADDRESS),
        new Provider03(
          connection,
          // walletAdapterToWallet(wallet),
          wallet, // TODO: resolve more gently?
          defaultOptions()
        )
      ) as any as Program
    } else if (programAddress === PLUTONIANS_STAKING_ADDRESS) {
      this.cache[cacheKey] = new Program020(
        programIdl as Idl020,
        new PublicKey(PLUTONIANS_STAKING_ADDRESS),
        new Provider020(
          connection,
          // walletAdapterToWallet(wallet),
          wallet, // TODO: resolve more gently?
          defaultOptions()
        )
      ) as any as Program
    } else if (programAddress === TWAMM_PROGRAM_ADDRESS) {
      this.cache[cacheKey] = new Program019(
        programIdl as Idl019,
        TWAMM_PROGRAM_ADDRESS,
        new Provider019(
          connection,
          // walletAdapterToWallet(wallet),
          wallet,
          defaultOptions()
        )
      ) as any as Program
    } else {
      this.cache[cacheKey] = new Program(
        programIdl as Idl,
        programId,
        new Provider(
          connection,
          // walletAdapterToWallet(wallet),
          wallet, // TODO: resolve more gently?
          defaultOptions()
        )
      )
    }

    return this.cache[cacheKey]
  }
}

const instance = new ProgramsMultiton()

export { instance as ProgramsMultiton }
