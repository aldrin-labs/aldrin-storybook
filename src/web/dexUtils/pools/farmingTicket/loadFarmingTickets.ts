import { Connection, PublicKey } from '@solana/web3.js'

import {
  FARMING_TICKET_OFFSET_OF_POOL_PUBLICKEY,
  FARMING_TICKET_OFFSET_OF_USER_PUBLICKEY,
  FARMING_TICKET_SIZE,
} from '@sb/dexUtils/common/config'
import { loadAccountsFromPoolsProgram } from '@sb/dexUtils/pools/loadAccountsFromPoolsProgram'
import { loadAccountsFromPoolsV2Program } from '@sb/dexUtils/pools/loadAccountsFromPoolsV2Program'
import { WalletAdapter } from '@sb/dexUtils/types'

import { POOLS_PROGRAM_ADDRESS } from '@core/solana'

export const loadFarmingTickets = async ({
  wallet,
  connection,
  walletPublicKey,
  poolPublicKey,
  programId = POOLS_PROGRAM_ADDRESS,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
  poolPublicKey?: PublicKey
  programId?: string
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

  if (programId === POOLS_PROGRAM_ADDRESS) {
    const poolsProgramV1FarmingTickets = await loadAccountsFromPoolsProgram({
      connection,
      filters: [
        {
          dataSize: FARMING_TICKET_SIZE,
        },
        ...filterByWalletPublicKey,
        ...filterByPoolPublicKey,
      ],
    })

    return poolsProgramV1FarmingTickets
  }

  const poolsProgramV2FarmingTickets = await loadAccountsFromPoolsV2Program({
    connection,
    filters: [
      {
        dataSize: FARMING_TICKET_SIZE,
      },
      ...filterByWalletPublicKey,
      ...filterByPoolPublicKey,
    ],
  })

  return poolsProgramV2FarmingTickets
}
