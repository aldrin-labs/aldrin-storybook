import MarketOrderProgramIdl from './idls/marketOrder.json'
import PoolsProgramIdl from './idls/pools.json'
import StablePoolsProgramIdl from './idls/stablePools.json'
import StakingProgramIdl from './idls/staking.json'

import {
  POOLS_PROGRAM_ADDRESS,
  MARKET_ORDER_PROGRAM_ADDRESS,
  STAKING_PROGRAM_ADDRESS,
  STABLE_POOLS_PROGRAM_ADDRESS,
} from './utils'
import { Idl } from '@project-serum/anchor'

export const getIdlByProgramAddress = (programAddress: string): Idl => {
  switch (programAddress) {
    case POOLS_PROGRAM_ADDRESS: {
      return PoolsProgramIdl as Idl
    }
    case STABLE_POOLS_PROGRAM_ADDRESS: {
      return StablePoolsProgramIdl as Idl
    }
    case MARKET_ORDER_PROGRAM_ADDRESS: {
      return MarketOrderProgramIdl as Idl
    }
    case STAKING_PROGRAM_ADDRESS: {
      return StakingProgramIdl as Idl
    }
    default: {
      throw Error('Programm addres not found')
    }
  }
}
