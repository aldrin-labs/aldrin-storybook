import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import BN from 'bn.js'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../common/getTicketsAvailableToClose'
import { FarmingTicket } from '../common/types'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendPartOfTransactions, signTransactions } from '../send'
import { WalletAdapter } from '../types'
import { STAKING_FARMING_TOKEN_DECIMALS } from './config'
import { endStakingInstructions } from './endStaking'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'
import { StakingPool } from './types'
import { getCalcAccounts } from './getCalcAccountsForWallet'
import { splitBy } from '../../utils/collection'

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

  const creatorPk = wallet.publicKey
  if (!creatorPk) {
    throw new Error('no wallet!')
  }

  const calcAccounts = await getCalcAccounts(program, creatorPk)
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



  const commonTransaction = new Transaction()
    .add(farmingTicketInstruction)
    .add(startStakingTransaction)

  const commonSigners = [
    farmingTicket,
  ]


  const farmingsWithoutCalc = stakingPool.farming
    .filter((f) => f.tokensTotal !== f.tokensUnlocked) // Open farmings
    .filter((f) => !calcAccounts.find((ca) => ca.farmingState.toBase58() !== f.farmingState))

  const createCalcs = await Promise.all(
    splitBy(farmingsWithoutCalc, 4).map(async (calcs) => {
      const transaction = new Transaction()

      const instructionsPromises = await Promise.all(calcs.map(async (ca) => {
        const farmingCalc = Keypair.generate()
        return {
          instructions: Promise.all([
            program.account.farmingCalc.createInstruction(farmingCalc),
            program.instruction.initializeFarmingCalc(
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
            ) as Promise<TransactionInstruction>
          ]),
          farmingCalc,
        }
      })
      )

      const instructions = (await Promise.all(instructionsPromises.map((_) => _.instructions))).flat()

      return { transaction: transaction.add(...instructions), signers: instructionsPromises.map((_) => _.farmingCalc) }
    })
  )

  try {
    const signedTransactions = await signTransactions({
      transactionsAndSigners: [
        ...endFarmingTransactions.map((transaction) => ({ transaction, signers: [] })),
        { transaction: commonTransaction, signers: commonSigners },
        ...createCalcs,
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
