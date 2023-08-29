import { Idl, Program } from '@project-serum/anchor'

import { POOLS_PROGRAM_ADDRESS, POOLS_V2_PROGRAM_ADDRESS } from '@core/solana'
// eslint-disable-next-line camelcase
import MM_FARMING_POOL_v1_IDL_JSON from '@core/solana/programsMultiton/idls/pools.json'
// eslint-disable-next-line camelcase
import MM_FARMING_POOL_v2_IDL_JSON from '@core/solana/programsMultiton/idls/poolsV2.json'

export const TOKEN_SWAP_PROGRAM_ID = POOLS_PROGRAM_ADDRESS
export const FARMING_POOLS_V2_PROGRAM_ID = POOLS_V2_PROGRAM_ADDRESS
export const MAX_TRANSACTION_BATCH_SIZE = 10

// eslint-disable-next-line camelcase
const mm_farming_pool_idl: Idl = JSON.parse(
  JSON.stringify(MM_FARMING_POOL_v1_IDL_JSON)
)
// eslint-disable-next-line camelcase
const mm_farming_pool_v2_idl: Idl = JSON.parse(
  JSON.stringify(MM_FARMING_POOL_v2_IDL_JSON)
)

export const PROGRAMS_MAP_BY_PROGRAM_ID = {
  [TOKEN_SWAP_PROGRAM_ID.toString()]: new Program(
    mm_farming_pool_idl,
    TOKEN_SWAP_PROGRAM_ID,
    {} as any
  ),
  [FARMING_POOLS_V2_PROGRAM_ID.toString()]: new Program(
    mm_farming_pool_v2_idl,
    FARMING_POOLS_V2_PROGRAM_ID,
    {} as any
  ),
}

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
