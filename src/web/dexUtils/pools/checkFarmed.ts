import { FarmingState } from '@sb/compositions/Pools/index.types'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { FarmingTicket } from './endFarming'

export const checkFarmed = async ({
  wallet,
  connection,
  poolPublicKey,
  farmingTicket,
  farming,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  farmingTicket: PublicKey
  farming: FarmingState
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  if (!farming) return null

  const { farmingState, farmingSnapshots, farmingTokenVault } = farming

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  return await program.instruction.checkFarmed({
    accounts: {
      pool: poolPublicKey,
      farmingState: new PublicKey(farmingState),
      farmingSnapshots: new PublicKey(farmingSnapshots),
      farmingTicket: farmingTicket,
      farmingTokenVault: new PublicKey(farmingTokenVault),
      poolSigner: vaultSigner,
      clock: SYSVAR_CLOCK_PUBKEY,
      rent: SYSVAR_RENT_PUBKEY,
    },
  })
}
