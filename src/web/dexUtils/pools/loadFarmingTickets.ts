import { Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import {
  FARMING_TICKET_OFFSET_OF_POOL_PUBLICKEY,
  FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
  FARMING_TICKET_SIZE,
} from './config'
import { loadAccountsFromPoolsProgram } from './loadAccountsFromPoolsProgram'

export const loadFarmingTickets = async ({
  wallet,
  connection,
  walletPublicKey,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
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

  return await loadAccountsFromPoolsProgram({
    connection,
    filters: [
      {
        dataSize: FARMING_TICKET_SIZE,
      },
      ...filterByWalletPublicKey,
      ...filterByPoolPublicKey,
    ],
  })
}
