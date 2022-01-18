import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js'
import { AsyncGetProgramAccountsResult } from './types'

export const loadAccountsFromProgram = async ({
  connection,
  filters,
  programAddress,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
  programAddress: string
}): AsyncGetProgramAccountsResult => {
  return await connection.getProgramAccounts(new PublicKey(programAddress), {
    filters,
  })
}
