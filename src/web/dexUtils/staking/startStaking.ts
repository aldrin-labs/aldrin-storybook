import { TokenInstructions } from '@project-serum/serum'
import {
  Keypair,
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js'
import BN from 'bn.js'

import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../common/getTicketsAvailableToClose'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { signTransactions } from '../send'
import { sendSignedTransactions } from '../transactions'
import { buildTransactions } from '../transactions/buildTransactions'
import { STAKING_FARMING_TOKEN_DECIMALS } from './config'
import { endStakingInstructions } from './endStaking'
import { getCalcAccounts } from './getCalcAccountsForWallet'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'
import { StartStakingParams } from './types'

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
  const instructions: TransactionInstruction[] = []
  const signers: Signer[] = []

  // Close existing tickets
  const instructionChunks = await endStakingInstructions(params)

  instructions.push(...instructionChunks.flat())
  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming)

  const openTickets = getTicketsAvailableToClose({
    farmingState,
    tickets: filterOpenFarmingTickets(farmingTickets),
  })

  const totalTokens = openTickets.reduce(
    (acc, ticket) => acc.add(new BN(`${ticket.tokensFrozen}`)),
    new BN(0)
  )

  const totalToStake = totalTokens.add(
    new BN(amount * 10 ** STAKING_FARMING_TOKEN_DECIMALS)
  )

  const farmingTicket = Keypair.generate()

  signers.push(farmingTicket)

  // Start farming - create FarmingTicket
  instructions.push(
    await program.account.farmingTicket.createInstruction(farmingTicket)
  )

  const startFarming = program.instruction.startFarming(totalToStake, {
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
  }) as Promise<TransactionInstruction>

  instructions.push(await startFarming)

  const farmingsWithoutCalc = stakingPool.farming
    .filter((f) => f.tokensTotal !== f.tokensUnlocked && !f.feesDistributed) // Open farmings
    .filter(
      // Farmings without calc account
      (f) =>
        !calcAccounts.find(
          (ca) => ca.farmingState.toBase58() === f.farmingState
        )
    )

  // Create missed calc accounts
  await Promise.all(
    farmingsWithoutCalc.map(async (ca) => {
      const farmingCalc = Keypair.generate()
      const addInstructions = await Promise.all([
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
      ])

      instructions.push(...addInstructions)
      signers.push(farmingCalc)
    })
  )

  try {
    const transactionsAndSigners = buildTransactions(
      instructions.map((instruction) => ({ instruction })),
      creatorPk,
      signers
    )

    const signedTransactions = await signTransactions({
      transactionsAndSigners,
      wallet,
      connection: connection.getConnection(),
    })

    return sendSignedTransactions(signedTransactions, connection)
  } catch (e) {
    console.warn('Error sign or send transaction: ', e)
    return 'failed'
  }
}
