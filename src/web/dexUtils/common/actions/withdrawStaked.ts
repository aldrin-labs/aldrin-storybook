import { TokenInstructions } from '@project-serum/serum'
import {
  PublicKey,
  Signer,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { getTokenDataByMint } from '@sb/compositions/Pools/utils'

import { buildTransactions } from '@core/solana'

import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../../ProgramsMultiton/utils'
import { createTokenAccountTransaction } from '../../send'
import { findTokenAccount } from '../../token/utils/findTokenAccount'
import { signAndSendTransactions } from '../../transactions'
import {
  DEFAULT_FARMING_TICKET_END_TIME,
  MIN_POOL_TOKEN_AMOUNT_TO_STAKE,
} from '../config'
import { getCalcAccounts } from '../getCalcAccountsForWallet'
import { WithdrawStakedParams } from './types'

export const withdrawStakedInstructions = async (
  params: WithdrawStakedParams
) => {
  const {
    wallet,
    connection,
    allTokensData,
    farmingTickets,
    stakingPool,
    programAddress = STAKING_PROGRAM_ADDRESS,
  } = params

  if (!wallet.publicKey) {
    throw new Error('No pubkey for wallet!')
  }

  const creatorPk = wallet.publicKey

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress,
  })

  const { swapToken } = stakingPool
  const poolPublicKey = new PublicKey(swapToken)

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const farmingTokenAccounts = new Map<string, PublicKey>()

  const calcAccounts = await getCalcAccounts(program, creatorPk)

  const ticketsToCalc = farmingTickets.filter((ft) => {
    return (
      ft.tokensFrozen > MIN_POOL_TOKEN_AMOUNT_TO_STAKE &&
      ft.amountsToClaim.find((atc) => atc.amount > 0)
    )
  })

  const tokenAccountsToCreate = new Set<string>()
  // Check token accounts for rewards
  await Promise.all(
    (stakingPool.farming || []).map(async (farming) => {
      const amountToClaim = ticketsToCalc.reduce((acc1, ft) => {
        const toClaim =
          ft.amountsToClaim.find(
            (atc) => atc.farmingState === farming.farmingState
          )?.amount || 0

        return toClaim + acc1
      }, 0)

      if (amountToClaim > 0) {
        // Looking for existing account
        const tokenAccount = await findTokenAccount(
          allTokensData,
          creatorPk,
          farming.farmingTokenMint
        )
        // Token account does not exists
        if (!tokenAccount?.address) {
          // Mark account to create
          tokenAccountsToCreate.add(farming.farmingTokenMint)
        } else {
          farmingTokenAccounts.set(
            farming.farmingTokenMint,
            new PublicKey(tokenAccount.address)
          )
        }
      }
      return farming
    })
  )

  const tokenAccountsWithCalcs = calcAccounts.reduce((acc, ca) => {
    if (ca.tokenAmount.gtn(0)) {
      const farming = (stakingPool.farming || []).find(
        (fs) => fs.farmingState === ca.farmingState.toBase58()
      )
      if (farming) {
        // Looking for existing account
        const { address: farmingTokenAccountAddress } = getTokenDataByMint(
          allTokensData,
          farming.farmingTokenMint
        )

        // Token account does not exists
        if (!farmingTokenAccountAddress) {
          // Mark account to create
          acc.add(farming.farmingTokenMint)
        } else {
          farmingTokenAccounts.set(
            farming.farmingTokenMint,
            new PublicKey(farmingTokenAccountAddress)
          )
        }
      }
    }
    return acc
  }, tokenAccountsToCreate)

  const createdAccounts = await Promise.all(
    [...tokenAccountsWithCalcs].map(async (mint) => {
      const result = await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(mint),
      })

      farmingTokenAccounts.set(mint, result.newAccountPubkey)
      return { mint, ...result }
    })
  )

  // TODO: uncomment that when backend will be fixed?

  // Run calculateFarmed if backend not started
  // const calculateTransactions = await Promise.all(ticketsToCalc.map((ticket) => {
  //   return Promise.all(
  //     pool.farming
  //       .filter((fs) => {
  //         const amountToClaim =
  //           ticket.amountsToClaim.find((amountToClaim) => amountToClaim.farmingState === fs.farmingState)?.amount || 0
  //         return amountToClaim > 0
  //       })
  //       .map(async (fs) => {
  //         if (!creatorPk) {
  //           throw new Error('No public key for wallet!')
  //         }

  //         const unclaimedSnapshots = getSnapshotsWithUnclaimedRewards({
  //           ticket,
  //           farmingState: fs,
  //           snapshotQueues,
  //         })

  //         const transactions: { transaction: Transaction, signers?: Keypair[] }[] = []

  //         const iterations = Math.ceil(
  //           unclaimedSnapshots.length / NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION
  //         )

  //         // Looking for FarmingCalc account / create if not exists
  //         let calcAccount = calcAccounts.find(
  //           (ca) => ca.farmingState.toBase58() === fs.farmingState
  //         )?.publicKey

  //         if (!calcAccount) {
  //           const farmingCalc = Keypair.generate()
  //           const createCalcTx = new Transaction()
  //             .add(await program.account.farmingCalc.createInstruction(farmingCalc))
  //             .add(
  //               await program.instruction.initializeFarmingCalc(
  //                 {
  //                   accounts: {
  //                     farmingCalc: farmingCalc.publicKey,
  //                     farmingTicket: new PublicKey(ticket.farmingTicket),
  //                     farmingState: new PublicKey(fs.farmingState),
  //                     userKey: creatorPk,
  //                     initializer: creatorPk,
  //                     rent: SYSVAR_RENT_PUBKEY,
  //                   }
  //                 }
  //               )
  //             )

  //           transactions.push({ transaction: createCalcTx, signers: [farmingCalc] })
  //           calcAccount = farmingCalc.publicKey

  //           calcAccounts.push({
  //             publicKey: calcAccount,
  //             farmingState: new PublicKey(fs.farmingState),
  //             userKey: creatorPk,
  //             initializer: creatorPk,
  //             tokenAmount: new u64(0),
  //           })
  //         }

  //         // Create calculateFarmed transactions
  //         for (let i = 1; i <= iterations; i++) {
  //           if (calcAccount) {
  //             const ca = calcAccounts.find((ca1) => ca1.publicKey.toBase58() === calcAccount?.toBase58())
  //             if (ca) {
  //               ca.tokenAmount = new u64(1) // Just to mark for withdraw on next iter
  //             }
  //           }
  //           const tx = new Transaction()
  //           tx
  //             .add(
  //               await program.instruction.calculateFarmed(
  //                 new BN(NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION),
  //                 {
  //                   accounts: {
  //                     pool: poolPublicKey,
  //                     farmingState: new PublicKey(fs.farmingState),
  //                     farmingSnapshots: new PublicKey(fs.farmingSnapshots),
  //                     farmingCalc: calcAccount,
  //                     farmingTicket: new PublicKey(ticket.farmingTicket),
  //                     clock: SYSVAR_CLOCK_PUBKEY,
  //                   },
  //                 }
  //               )
  //             )
  //             .add(
  //               // due to same transaction data for calculateFarmed we need add transaction with random
  //               // lamports amount to get random transaction hash every time
  //               SystemProgram.transfer({
  //                 fromPubkey: creatorPk,
  //                 toPubkey: creatorPk,
  //                 lamports: getRandomInt(1, 1000),
  //               })

  //             )
  //           transactions.push({ transaction: tx })
  //         }

  //         return transactions
  //       })
  //   )
  // })
  // )

  // Generate withdrawFarmed transactions for calcs
  const withdrawInstructions = (
    await Promise.all(
      calcAccounts.map(async (calcAccount) => {
        const fs = (stakingPool.farming || []).find(
          (farming) =>
            farming.farmingState === calcAccount.farmingState.toBase58()
        )
        if (fs) {
          // Withdraw farmed

          const tx = new Transaction()

          if (calcAccount.tokenAmount.gtn(0)) {
            tx.add(
              await program.instruction.withdrawFarmed({
                accounts: {
                  pool: poolPublicKey,
                  farmingState: calcAccount.farmingState,
                  farmingCalc: calcAccount.publicKey,
                  farmingTokenVault: new PublicKey(fs.farmingTokenVault),
                  poolSigner: vaultSigner,
                  userFarmingTokenAccount: farmingTokenAccounts.get(
                    fs.farmingTokenMint
                  ),
                  userKey: creatorPk,
                  tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                  clock: SYSVAR_CLOCK_PUBKEY,
                },
              })
            )
          }

          const calcTickets = farmingTickets.filter((ft) =>
            ft.amountsToClaim.find(
              (atc) => atc.farmingState === fs.farmingState
            )
          )
          // If farming ended - close calc, otherwise - close calc only when all tickets are closed
          const closeCalc =
            fs && fs.tokensUnlocked === fs.tokensTotal
              ? true
              : !calcTickets.find(
                  (t) => t.endTime === DEFAULT_FARMING_TICKET_END_TIME
                )

          if (closeCalc) {
            const ticket = farmingTickets.find((ft) =>
              ft.amountsToClaim.find(
                (atc) => atc.farmingState === fs.farmingState
              )
            )

            if (ticket) {
              tx.add(
                await program.instruction.closeFarmingCalc({
                  accounts: {
                    farmingCalc: calcAccount.publicKey,
                    farmingTicket: new PublicKey(ticket.farmingTicket),
                    signer: creatorPk,
                    initializer: calcAccount.initializer,
                  },
                })
              )
            } else {
              console.warn('No tickets found for calc:', calcAccount)
            }
          }

          return tx
        }
        return null
      })
    )
  )
    .filter((tx): tx is Transaction => !!tx)
    .map((tx) => tx.instructions)
    .flat()

  const instructions = [
    ...createdAccounts
      .map(({ transaction }) => transaction.instructions)
      .flat(),
    ...withdrawInstructions,
  ]

  const signers: Signer[] = []
  return {
    instructions,
    signers,
    createdAccounts: createdAccounts.map((acc) => ({
      mint: acc.mint,
      publicKey: acc.newAccountPubkey,
    })),
  }
}
export const withdrawStaked = async (params: WithdrawStakedParams) => {
  const { wallet, connection } = params

  if (!wallet.publicKey) {
    return 'failed'
  }
  const creatorPk = wallet.publicKey

  const { instructions } = await withdrawStakedInstructions(params)

  const transactionsAndSigners = buildTransactions(
    instructions.map((instruction) => ({ instruction })),
    creatorPk
  )

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners,
  })
}
