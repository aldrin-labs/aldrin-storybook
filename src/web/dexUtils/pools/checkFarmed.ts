import { PoolInfo } from '@sb/compositions/Pools/index.types'
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
  pool,
  farmingTicket,
}: {
  wallet: WalletAdapter
  connection: Connection
  pool: PoolInfo
  farmingTicket: FarmingTicket
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const { swapToken, farming } = pool
  const poolPublicKey = new PublicKey(swapToken)

  if (farming && farming.length === 0) return null

  const { farmingState, farmingSnapshots, farmingTokenVault } = farming[0]

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  return await program.instruction.checkFarmed({
    accounts: {
      pool: poolPublicKey,
      farmingState: new PublicKey(farmingState),
      farmingSnapshots: new PublicKey(farmingSnapshots),
      farmingTicket: new PublicKey(farmingTicket.farmingTicket),
      farmingTokenVault: new PublicKey(farmingTokenVault),
      poolSigner: vaultSigner,
      clock: SYSVAR_CLOCK_PUBKEY,
      rent: SYSVAR_RENT_PUBKEY,
    },
  })
}
