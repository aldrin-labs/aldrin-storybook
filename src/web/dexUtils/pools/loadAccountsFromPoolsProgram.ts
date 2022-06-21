import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'

import { POOLS_PROGRAM_ADDRESS } from '@core/solana'

import { loadAccountsFromProgram } from '../common/loadAccountsFromProgram'

export const loadAccountsFromPoolsProgram = async ({
  connection,
  filters,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
}) => {
  return await loadAccountsFromProgram({
    connection,
    filters,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })
}
