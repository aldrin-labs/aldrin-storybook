import { PublicKey } from '@solana/web3.js'

import { AldrinConnection } from '@core/solana'

import { ProgramsMultiton } from '../../ProgramsMultiton'
import { WalletAdapter } from '../../types'

export const updateEligibleHarvest = async ({
  wallet,
  connection,
  farm,
  farmer,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  farm: PublicKey
  farmer: PublicKey
}) => {
  const p = ProgramsMultiton.getFarmingProgram({
    wallet,
    connection,
  })

  const sig = await p.methods
    .updateEligibleHarvest()
    .accounts({
      farm,
      farmer,
    })
    .rpc()

  console.log('updateEligibleHarvest request sent:', sig)
}
