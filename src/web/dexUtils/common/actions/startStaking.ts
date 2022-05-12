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

import { buildTransactions } from '@core/solana'

import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { STAKING_FARMING_TOKEN_DECIMALS } from '../../staking/config'
import { getCurrentFarmingStateFromAll } from '../../staking/getCurrentFarmingStateFromAll'
import { signAndSendTransactions } from '../../transactions'
import { filterOpenFarmingTickets } from '../filterOpenFarmingTickets'
import { getCalcAccounts } from '../getCalcAccountsForWallet'
import { getTicketsAvailableToClose } from '../getTicketsAvailableToClose'
import { endStakingInstructions } from './endStaking'
import { StartStakingParams } from './types'

export const startStakingInstructions = async (params: StartStakingParams) => {
  const {
    wallet,
    connection,
    amount,
    userPoolTokenAccount,
    stakingPool,
    farmingTickets,
    programAddress,
    decimals = STAKING_FARMING_TOKEN_DECIMALS,
  } = params

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress,
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
  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming || [])

  const openTickets = getTicketsAvailableToClose({
    farmingState,
    tickets: filterOpenFarmingTickets(farmingTickets),
  })

  const totalTokens = openTickets.reduce(
    (acc, ticket) => acc.add(new BN(`${ticket.tokensFrozen}`)),
    new BN(0)
  )

  const totalToStake = totalTokens.add(new BN(amount * 10 ** decimals))

  const farmingTicket = Keypair.generate()

  signers.push(farmingTicket)

  // Start farming - create FarmingTicket
  instructions.push(
    await program.account.farmingTicket.createInstruction(farmingTicket)
  )

  const startFarming = program.instruction.startFarming(totalToStake, {
    accounts: {
      pool: new PublicKey(stakingPool.swapToken),
      farmingState: new PublicKey(farmingState.farmingState),
      farmingTicket: farmingTicket.publicKey,
      // Make code compatible for both staking and pools farming
      stakingVault:
        'stakingVault' in stakingPool
          ? new PublicKey(stakingPool.stakingVault)
          : undefined,
      lpTokenFreezeVault:
        'lpTokenFreezeVault' in stakingPool
          ? new PublicKey(stakingPool.lpTokenFreezeVault)
          : undefined,
      userStakingTokenAccount: userPoolTokenAccount,
      userLpTokenAccount: userPoolTokenAccount,
      walletAuthority: wallet.publicKey,
      userKey: wallet.publicKey,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
      rent: SYSVAR_RENT_PUBKEY,
    },
  }) as Promise<TransactionInstruction>

  instructions.push(await startFarming)

  const farmingsWithoutCalc = (stakingPool.farming || [])
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

  return {
    instructions,
    signers,
  }
}
export const startStaking = async (params: StartStakingParams) => {
  const { wallet, connection } = params
  const creatorPk = wallet.publicKey
  if (!creatorPk) {
    throw new Error('no wallet!')
  }

  const { instructions, signers } = await startStakingInstructions(params)
  try {
    const transactionsAndSigners = buildTransactions(
      instructions.map((instruction) => ({ instruction })),
      creatorPk,
      signers
    )

    return await signAndSendTransactions({
      transactionsAndSigners,
      connection,
      wallet,
    })
  } catch (e) {
    console.warn('Error sign or send transaction: ', e)
    return 'failed'
  }
}
