import { TokenInstructions } from '@project-serum/serum'
import {
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import BN from 'bn.js'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../common/getTicketsAvailableToClose'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { signTransactions } from '../send'
import { STAKING_FARMING_TOKEN_DECIMALS } from './config'
import { endStakingInstructions } from './endStaking'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'
import { StartStakingParams } from './types'
import { getCalcAccounts } from './getCalcAccountsForWallet'
import { splitBy } from '../../utils/collection'
import { sendSignedTransactions } from '../transactions'

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
    connection: connection.getConnection(),
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const creatorPk = wallet.publicKey
  if (!creatorPk) {
    throw new Error('no wallet!')
  }

  const calcAccounts = await getCalcAccounts(program, creatorPk)
  const instructionChunks = await endStakingInstructions(params)

  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming)

  const openTickets = getTicketsAvailableToClose({
    farmingState,
    tickets: filterOpenFarmingTickets(farmingTickets),
  })

  const totalTokens = openTickets.reduce(
    (acc, ticket) => acc.add(new BN(`${ticket.tokensFrozen}`)),
    new BN(0)
  )

  const endFarmingTransactions = instructionChunks.map((instr) =>
    new Transaction().add(...instr)
  )

  const totalToStake = totalTokens.add(
    new BN(amount * 10 ** STAKING_FARMING_TOKEN_DECIMALS)
  )

  const farmingTicket = Keypair.generate()
  const farmingTicketInstruction =
    await program.account.farmingTicket.createInstruction(farmingTicket)

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

  const commonSigners = [farmingTicket]

  const farmingsWithoutCalc = stakingPool.farming
    .filter((f) => f.tokensTotal !== f.tokensUnlocked && !f.feesDistributed) // Open farmings
    .filter(
      (f) =>
        !calcAccounts.find(
          (ca) => ca.farmingState.toBase58() !== f.farmingState
        )
    )

  const createCalcs = await Promise.all(
    splitBy(farmingsWithoutCalc, 3).map(async (calcs) => {
      const transaction = new Transaction()

      const instructionsPromises = await Promise.all(
        calcs.map(async (ca) => {
          const farmingCalc = Keypair.generate()
          return {
            instructions: Promise.all([
              program.account.farmingCalc.createInstruction(farmingCalc),
              program.instruction.initializeFarmingCalc({
                accounts: {
                  farmingCalc: farmingCalc.publicKey,
                  farmingTicket: farmingTicket.publicKey,
                  farmingState: new PublicKey(ca.farmingState),
                  userKey: wallet.publicKey,
                  initializer: wallet.publicKey,
                  rent: SYSVAR_RENT_PUBKEY,
                },
              }) as Promise<TransactionInstruction>,
            ]),
            farmingCalc,
          }
        })
      )

      const instructions = (
        await Promise.all(instructionsPromises.map((_) => _.instructions))
      ).flat()

      return {
        transaction: transaction.add(...instructions),
        signers: instructionsPromises.map((_) => _.farmingCalc),
      }
    })
  )

  const [create, ...createRest] = createCalcs

  if (create) {
    commonTransaction.add(create.transaction)
    commonSigners.push(...create.signers)
  }
  try {
    const signedTransactions = await signTransactions({
      transactionsAndSigners: [
        ...endFarmingTransactions.map((transaction) => ({
          transaction,
          signers: [],
        })),
        {
          transaction: commonTransaction,
          signers: commonSigners,
        },
        ...createRest,
      ],
      wallet,
      connection: connection.getConnection(),
    })

    const result = await sendSignedTransactions(signedTransactions, connection)

    return result
  } catch (e) {
    console.warn('Error sign or send transaction: ', e)
    return 'failed'
  }
}
