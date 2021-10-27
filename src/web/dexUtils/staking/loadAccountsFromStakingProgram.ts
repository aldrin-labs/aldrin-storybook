import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'

export const loadAccountsFromStakingProgram = async ({
  connection,
  filters,
}: {
  connection: Connection
  filters: GetProgramAccountsFilter[]
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(STAKING_PROGRAM_ADDRESS),
    {
      filters,
    }
  )
}
