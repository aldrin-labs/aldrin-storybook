import { Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import {
  FARMING_TICKET_OFFSET_OF_POOL_PUBLICKEY,
  FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
  FARMING_TICKET_SIZE,
} from './config'
import { loadAccountsFromPoolsProgram } from './loadAccountsFromPoolsProgram'

export const loadUserFarmingTickets = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey?: PublicKey
}) => {
  const filterByPoolPublicKey = poolPublicKey
    ? [
        {
          memcmp: {
            offset: FARMING_TICKET_OFFSET_OF_POOL_PUBLICKEY,
            bytes: poolPublicKey.toBase58(),
          },
        },
      ]
    : []

  return await loadAccountsFromPoolsProgram({
    connection,
    filters: [
      {
        dataSize: FARMING_TICKET_SIZE,
      },
      {
        memcmp: {
          offset: FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
          bytes: wallet.publicKey.toBase58(),
        },
      },
      ...filterByPoolPublicKey,
    ],
  })
}
