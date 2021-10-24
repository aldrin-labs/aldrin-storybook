import { Connection, PublicKey } from '@solana/web3.js'
import { WalletAdapter } from '../types'
import { STAKING_SNAPSHOTS_SIZE } from '../common/config'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingSnapshots = async ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}) => {
  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: STAKING_SNAPSHOTS_SIZE,
      },
    ],
  })
}
