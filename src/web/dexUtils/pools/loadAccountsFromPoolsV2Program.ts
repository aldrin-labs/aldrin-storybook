import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'
import { loadAccountsFromProgram } from '../common/loadAccountsFromProgram'
import { POOLS_V2_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'

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
