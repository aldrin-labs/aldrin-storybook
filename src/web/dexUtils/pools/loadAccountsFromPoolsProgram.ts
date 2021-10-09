import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'

export const loadAccountsFromPoolsProgram = async ({
  connection,
  filters,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(POOLS_PROGRAM_ADDRESS),
    {
      filters,
    }
  )
}
