import { Idl } from '@project-serum/anchor'
import MarketOrderProgramIdl from './idls/marketOrder.json'
import PoolsProgramIdl from './idls/pools.json'
import PoolsV2ProgramIdl from './idls/poolsV2.json'
import StakingProgramIdl from './idls/staking.json'
import VestingProgramIdl from './idls/vesting.json'

import {
  POOLS_PROGRAM_ADDRESS,
  MARKET_ORDER_PROGRAM_ADDRESS,
  STAKING_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  VESTING_PROGRAM_ADDRESS,
} from './utils'

export const getIdlByProgramAddress = (programAddress: string): Idl => {
  switch (programAddress) {
    case POOLS_PROGRAM_ADDRESS: {
      return PoolsProgramIdl as Idl
    }
    case POOLS_V2_PROGRAM_ADDRESS: {
      return PoolsV2ProgramIdl as Idl
    }
    case MARKET_ORDER_PROGRAM_ADDRESS: {
      return MarketOrderProgramIdl as Idl
    }
    case STAKING_PROGRAM_ADDRESS: {
      return StakingProgramIdl as Idl
    }
    case VESTING_PROGRAM_ADDRESS: {
      return VestingProgramIdl as Idl
    }
    default: {
      throw Error('Programm addres not found')
    }
  }
}
