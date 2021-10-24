import { Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import { STAKING_FARMING_TICKET_SIZE } from '../common/config'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingFarmingStates = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: STAKING_FARMING_TICKET_SIZE,
      },
    ],
  })
}
