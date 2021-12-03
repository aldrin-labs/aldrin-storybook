import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'
import { NUMBER_OF_RETRIES } from '../common'
import { notify } from '../notifications'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { isTransactionFailed, sendTransaction, signTransactions, sendPartOfTransactions } from '../send'
import { WalletAdapter } from '../types'
import { STAKING_FARMING_TOKEN_DECIMALS } from './config'
import { StakingPool } from './types'
import { FarmingTicket } from '../common/types'
import { endStakingInstructions } from './endStaking'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../common/getTicketsAvailableToClose'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'

interface StartStakingParams {
  wallet: WalletAdapter
  connection: Connection
  amount: number
  userPoolTokenAccount: PublicKey
  stakingPool: StakingPool
  farmingTickets: FarmingTicket[]
}

export const startStaking = async (params: StartStakingParams) => {
  const {
    wallet,
    connection,
    amount,
    userPoolTokenAccount,
    stakingPool,
    farmingTickets,
  } = params

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const instructionChunks = await endStakingInstructions(params)

  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming)

  const openTickets = getTicketsAvailableToClose(
    {
      farmingState,
      tickets: filterOpenFarmingTickets(farmingTickets),
    }
  )


  const totalTokens = openTickets.reduce((acc, ticket) => acc.add(new BN(`${ticket.tokensFrozen}`)), new BN(0))

  const endFarmingTransactions = instructionChunks.map((instr) => new Transaction().add(...instr))

  const totalToStake = totalTokens.add(new BN(amount * 10 ** STAKING_FARMING_TOKEN_DECIMALS))

  console.log('totalToStake: ', totalToStake.toString())

  const farmingTicket = Keypair.generate()
  const farmingTicketInstruction = await program.account.farmingTicket.createInstruction(
    farmingTicket
  )

  const startStakingTransaction = await program.instruction.startFarming(
    totalToStake,
    {
      accounts: {
        pool: new PublicKey(stakingPool.swapToken),
        farmingState: new PublicKey(stakingPool.farming[0].farmingState),
        farmingTicket: farmingTicket.publicKey,
        stakingVault: new PublicKey(stakingPool.stakingVault),
        userStakingTokenAccount: userPoolTokenAccount,
        walletAuthority: wallet.publicKey,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  )

  const farmingCalc = Keypair.generate()

  const commonTransaction = new Transaction()
    .add(farmingTicketInstruction)
    .add(startStakingTransaction)
    .add(await program.account.farmingCalc.createInstruction(farmingCalc))
    .add(await program.instruction.initializeFarmingCalc(
      {
        accounts: {
          farmingCalc: farmingCalc.publicKey,
          farmingTicket: farmingTicket.publicKey,
          farmingState: new PublicKey(stakingPool.farming[0].farmingState),
          userKey: wallet.publicKey,
          initializer: wallet.publicKey,
          rent: SYSVAR_RENT_PUBKEY,
        }
      }
    ))
  const commonSigners = [farmingCalc, farmingTicket]

  try {
    const signedTransactions = await signTransactions({
      transactionsAndSigners: [
        ...endFarmingTransactions.map((transaction) => ({ transaction, signers: [] })),
        { transaction: commonTransaction, signers: commonSigners }
      ],
      wallet,
      connection,
    })



    for (let transaction of signedTransactions) {
      const result = await sendPartOfTransactions(connection, transaction)
      if (result !== 'success') {
        return result
      }
    }

    return 'success'
  } catch (e) {
    console.warn('Error sign or send transaction: ', e)
    return 'failed'
  }



}
