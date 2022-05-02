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
  AnchorProvider as Provider020,
  Idl as Idl020,
} from 'anchor024'
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
  PLUTONIANS_STAKING_PROGRAMM_ADDRESS,
  defaultOptions,
} from './utils'

const IDLS = {
  [POOLS_PROGRAM_ADDRESS]: PoolsProgramIdl as Idl,
  [POOLS_V2_PROGRAM_ADDRESS]: PoolsV2ProgramIdl as Idl,
  [MARKET_ORDER_PROGRAM_ADDRESS]: MarketOrderProgramIdl as Idl,
  [STAKING_PROGRAM_ADDRESS]: StakingProgramIdl as Idl,
  [VESTING_PROGRAM_ADDRESS]: VestingProgramIdl as Idl03,
  [TWAMM_PROGRAM_ADDRESS]: TwammProgramIdl as Idl019,
  [PLUTONIANS_STAKING_PROGRAMM_ADDRESS]: PlutoniansStakingProgramIdl as Idl020,
}

interface GetProgramParamsCommon {
  wallet: WalletAdapter
  connection: Connection
}

interface GetProgramParams extends GetProgramParamsCommon {
  programAddress: string
}

class ProgramsMultiton {
  private cache: { [programAddress: string]: Program } = {}

  getProgramByAddress(params: GetProgramParams) {
    const { wallet, connection, programAddress } = params
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
    } else if (programAddress === PLUTONIANS_STAKING_PROGRAMM_ADDRESS) {
      return this.getPlutoniansStakingProgram(params) as any as Program
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

  getPlutoniansStakingProgram(params: GetProgramParamsCommon): Program020 {
    const cacheKey = `${PLUTONIANS_STAKING_PROGRAMM_ADDRESS}-${params.wallet.publicKey}`
    if (!this.cache[cacheKey]) {
      return new Program020(
        IDLS[PLUTONIANS_STAKING_PROGRAMM_ADDRESS] as Idl020,
        new PublicKey(PLUTONIANS_STAKING_PROGRAMM_ADDRESS),
        new Provider020(
          params.connection,
          // walletAdapterToWallet(wallet),
          params.wallet, // TODO: resolve more gently?
          defaultOptions()
        )
      )
    }
    return this.cache[cacheKey] as any as Program020
  }
}

const instance = new ProgramsMultiton()

export { instance as ProgramsMultiton }
