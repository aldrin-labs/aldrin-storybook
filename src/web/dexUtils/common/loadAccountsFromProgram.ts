import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js'

export const loadAccountsFromProgram = async ({
  connection,
  filters,
  programAddress
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
  programAddress: string
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(programAddress),
    {
      filters,
    }
  )
}
