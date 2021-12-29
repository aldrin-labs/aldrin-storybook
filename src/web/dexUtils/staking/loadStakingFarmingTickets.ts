import { Connection, PublicKey } from '@solana/web3.js'

import {
  FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
  FARMING_TICKET_SIZE,
} from '../common/config'
import { WalletAdapter } from '../types'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingFarmingTickets = async ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}) => {
  const filterByWalletPublicKey = walletPublicKey
    ? [
        {
          memcmp: {
            offset: FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
            bytes: walletPublicKey.toBase58(),
          },
        },
      ]
    : []

  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: FARMING_TICKET_SIZE,
      },
      ...filterByWalletPublicKey,
    ],
  })
}
