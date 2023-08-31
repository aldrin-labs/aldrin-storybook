import { POOLS_PROGRAM_ADDRESS, POOLS_V2_PROGRAM_ADDRESS } from '@core/solana'

export const TOKEN_SWAP_PROGRAM_ID = POOLS_PROGRAM_ADDRESS
export const FARMING_POOLS_V2_PROGRAM_ID = POOLS_V2_PROGRAM_ADDRESS
export const MAX_TRANSACTION_BATCH_SIZE = 10

export const ACCOUNT_DATA_SIZE_MAP_BY_PROGRAM_ID = {
  [TOKEN_SWAP_PROGRAM_ID.toString()]: {
    Pool: 441,
    FarmingState: 169,
  },
  [FARMING_POOLS_V2_PROGRAM_ID.toString()]: {
    Pool: 474,
    FarmingState: 169,
    StableCurve: 16,
  },
}

export const CHUNK_SIZE_FOR_GET_MULTIPLE_ACCOUNTS = 100
