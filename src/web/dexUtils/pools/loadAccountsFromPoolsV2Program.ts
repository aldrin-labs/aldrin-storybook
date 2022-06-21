import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'

import { POOLS_V2_PROGRAM_ADDRESS } from '@core/solana'

import { loadAccountsFromProgram } from '../common/loadAccountsFromProgram'

export const loadAccountsFromPoolsV2Program = async ({
  connection,
  filters,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
}) => {
  return await loadAccountsFromProgram({
    connection,
    filters,
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })
}
