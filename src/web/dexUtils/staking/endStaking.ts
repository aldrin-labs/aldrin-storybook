import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { FarmingTicket } from '../common/types'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'
import { StakingPool } from './types'

interface EndstakingParams {
  wallet: WalletAdapter
  connection: Connection
  // poolPublicKey: PublicKey
  userPoolTokenAccount: PublicKey
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool
}

export const endStaking = async (params: EndstakingParams) => {
  const {
    wallet,
    connection,
    userPoolTokenAccount,
    farmingTickets,
    stakingPool,
  } = params

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const openTickets = filterOpenFarmingTickets(farmingTickets)

  if (openTickets.length === 0) {
    return 'failed'
  }

  const [poolSigner] = await PublicKey.findProgramAddress(
    [new PublicKey(stakingPool.swapToken).toBuffer()],
    program.programId
  )

  const commonTransaction = new Transaction()
  const sendPartOfTransactions = async () => {
    try {
      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: [],
        focusPopup: true,
      })

      if (!tx) {
        return 'failed'
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  const farmingState = stakingPool.farming[0]


  for (let ticketData of openTickets) {
    const endFarmingTransaction = await program.instruction.endFarming({
      accounts: {
        pool: new PublicKey(stakingPool.swapToken),
        farmingState: new PublicKey(farmingState.farmingState),
        farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
        farmingTicket: new PublicKey(ticketData.farmingTicket),
        stakingVault: new PublicKey(stakingPool.stakingVault),
        userStakingTokenAccount: userPoolTokenAccount,
        poolSigner,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })

    commonTransaction.add(endFarmingTransaction)

    if (commonTransaction.instructions.length > 5) {
      const result = await sendPartOfTransactions()
      if (result !== 'success') {
        return result
      }
    }
  }

  if (commonTransaction.instructions.length > 0) {
    const result = await sendPartOfTransactions()
    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}
