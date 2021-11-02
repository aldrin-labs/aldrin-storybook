import { Connection, GetProgramAccountsFilter } from '@solana/web3.js'
import { loadAccountsFromProgram } from '../common/loadAccountsFromProgram'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'

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
