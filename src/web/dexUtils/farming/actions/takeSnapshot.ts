import { PublicKey } from '@solana/web3.js'

import { AldrinConnection } from '@core/solana'

import { ProgramsMultiton } from '../../ProgramsMultiton'
import { WalletAdapter } from '../../types'

export const takeSnapshots = async ({
  wallet,
  connection,
  farm,
  stakeVault,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: PublicKey
  stakeVault: PublicKey
}) => {
  const p = ProgramsMultiton.getFarmingProgram({
    wallet,
    connection,
  })

  const sig = await p.methods
    .takeSnapshot()
    .accounts({
      farm,
      stakeVault,
    })
    .rpc()

  console.log('request sent:', sig)
}
