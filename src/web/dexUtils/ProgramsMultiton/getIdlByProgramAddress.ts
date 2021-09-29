const PoolsProgramIdl = require('./idls/pools.json')
const MarketOrderProgramIdl = require('./idls/marketOrder.json')

import { POOLS_PROGRAM_ADDRESS, MARKET_ORDER_PROGRAM_ADDRESS } from './utils'

export const getIdlByProgramAddress = (programAddress: string) => {
  switch (programAddress) {
    case POOLS_PROGRAM_ADDRESS: {
      return PoolsProgramIdl
    }
    case MARKET_ORDER_PROGRAM_ADDRESS: {
      return MarketOrderProgramIdl
    }
    default: {
      return null
    }
  }
}