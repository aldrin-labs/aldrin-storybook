import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js'

import { TWAMM_PROGRAM_ADDRESS } from '@core/solana'

export const loadAccountsFromTWAMMProgram = async ({
  connection,
  filters,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(TWAMM_PROGRAM_ADDRESS),
    {
      filters,
    }
  )
}
