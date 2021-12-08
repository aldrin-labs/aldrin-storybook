import { getRandomInt } from '@core/utils/helpers'
import { TokenInstructions } from '@project-serum/serum'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Keypair
} from '@solana/web3.js'
import BN from 'bn.js'
import {
  MIN_POOL_TOKEN_AMOUNT_TO_STAKE,
  NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION,
  DEFAULT_FARMING_TICKET_END_TIME
} from '../common/config'
import { isCancelledTransactionError } from '../common/isCancelledTransactionError'
import { FarmingTicket, SnapshotQueue } from '../common/types'
import { getSnapshotsWithUnclaimedRewards } from '../pools/addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS, STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import {
  createTokenAccountTransaction,

  sendSignedTransaction,
  sendTransaction,
  signTransactions
} from '../send'
import { WalletAdapter } from '../types'
import { StakingPool } from './types'
import { PoolInfo } from '../../compositions/Pools/index.types'
import { u64 } from '../token/token'
import { getCalcAccounts } from './getCalcAccountsForWallet'


export interface WithdrawStakedParams {
  wallet: WalletAdapter
  connection: Connection
  allTokensData: TokenInfo[]
  farmingTickets: FarmingTicket[]
  pool: StakingPool | PoolInfo
  programAddress?: string
  snapshotQueues: SnapshotQueue[]
  signAllTransactions: boolean
}

interface FarmingCalc {
  farmingState: PublicKey
  farmingTicket: PublicKey
  userKey: PublicKey
  initializer: PublicKey
  tokenAmount: u64
}

const USER_KEY_SPAN = 72
const CALC_ACCOUNT_SIZE = 144

export const withdrawStaked = async (params: WithdrawStakedParams) => {
  const {
    wallet,
    connection,
    allTokensData,
    farmingTickets,
    snapshotQueues,
    pool,
    programAddress = STAKING_PROGRAM_ADDRESS,
    signAllTransactions,
  } = params

  if (!wallet.publicKey) {
    return 'failed'
  }

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const { swapToken } = pool
  const poolPublicKey = new PublicKey(swapToken)

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const farmingTokenAccounts = new Map<string, PublicKey>()

  const calcAccounts = await getCalcAccounts(program, wallet.publicKey)

  const ticketsToClaim = farmingTickets
    .filter((ft) => ft.tokensFrozen > MIN_POOL_TOKEN_AMOUNT_TO_STAKE && ft.amountsToClaim.find((atc) => atc.amount > 0))

  const tokenAccountsToCreate = pool.farming.reduce((acc, farming) => {
    const amountToClaim = ticketsToClaim
      .reduce((acc, ft) => {
        const toClaim = ft.amountsToClaim.find(
          (amountToClaim) => amountToClaim.farmingState === farming.farmingState
        )?.amount || 0

        return toClaim + acc
      }, 0)

    if (amountToClaim > 0) {
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
        farmingTokenAccounts.set(farming.farmingTokenMint, new PublicKey(farmingTokenAccountAddress))
      }
    }
    return acc
  }, new Set<string>())

  const createdAccounts = await Promise.all(
    [...tokenAccountsToCreate].map(async (mint) => {
      const result = await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(mint),
      })

      farmingTokenAccounts.set(mint, result.newAccountPubkey)
      return { mint, ...result }
    })
  )

  const withdrawTransactions = await Promise.all(ticketsToClaim.map((ticket) => {
    return Promise.all(
      pool.farming
        .filter((fs) => {
          const amountToClaim =
            ticket.amountsToClaim.find((amountToClaim) => amountToClaim.farmingState === fs.farmingState)?.amount || 0
          return amountToClaim > 0
        })
        .map(async (fs) => {
          if (!wallet.publicKey) {
            throw new Error('No public key for wallet!')
          }

          const unclaimedSnapshots = getSnapshotsWithUnclaimedRewards({
            ticket,
            farmingState: fs,
            snapshotQueues,
          })

          const transactions: { transaction: Transaction, signers?: Keypair[] }[] = []

          const iterations = Math.ceil(
            unclaimedSnapshots.length / NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION
          )

          // Looking for FarmingCalc account / create if not exists
          let calcAccount = calcAccounts.find(
            (ca) => ca.farmingState.toBase58() === fs.farmingState &&
              ca.farmingTicket.toBase58() === ticket.farmingTicket
          )?.publicKey

          if (!calcAccount) {
            const farmingCalc = Keypair.generate()
            const createCalcTx = new Transaction()
              .add(await program.account.farmingCalc.createInstruction(farmingCalc))
              .add(
                await program.instruction.initializeFarmingCalc(
                  {
                    accounts: {
                      farmingCalc: farmingCalc.publicKey,
                      farmingTicket: new PublicKey(ticket.farmingTicket),
                      farmingState: new PublicKey(fs.farmingState),
                      userKey: wallet.publicKey,
                      initializer: wallet.publicKey,
                      rent: SYSVAR_RENT_PUBKEY,
                    }
                  }
                )
              )

            transactions.push({ transaction: createCalcTx, signers: [farmingCalc] })
            calcAccount = farmingCalc.publicKey
            calcAccounts.push({
              publicKey: calcAccount,
              farmingState: new PublicKey(fs.farmingState),
              farmingTicket: new PublicKey(ticket.farmingTicket),
              userKey: wallet.publicKey,
              initializer: wallet.publicKey,
              tokenAmount: new u64(0),
            })
          }

          // Create calculateFarmed transactions
          for (let i = 1; i <= iterations; i++) {
            const tx = new Transaction()
            tx
              .add(
                await program.instruction.calculateFarmed(
                  new BN(NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION),
                  {
                    accounts: {
                      pool: poolPublicKey,
                      farmingState: new PublicKey(fs.farmingState),
                      farmingSnapshots: new PublicKey(fs.farmingSnapshots),
                      farmingCalc: calcAccount,
                      farmingTicket: new PublicKey(ticket.farmingTicket),
                      clock: SYSVAR_CLOCK_PUBKEY,
                    },
                  }
                )
              )
              .add(
                // due to same transaction data for calculateFarmed we need add transaction with random
                // lamports amount to get random transaction hash every time
                SystemProgram.transfer({
                  fromPubkey: wallet.publicKey,
                  toPubkey: wallet.publicKey,
                  lamports: getRandomInt(1, 1000),
                })

              )
            transactions.push({ transaction: tx })
          }

          // Withdraw farmed
          transactions.push(
            {
              transaction:
                new Transaction().add(
                  await program.instruction.withdrawFarmed(
                    {
                      accounts: {
                        pool: poolPublicKey,
                        farmingState: new PublicKey(fs.farmingState),
                        farmingCalc: calcAccount,
                        farmingTicket: new PublicKey(ticket.farmingTicket),
                        farmingTokenVault: new PublicKey(fs.farmingTokenVault),
                        poolSigner: vaultSigner,
                        userFarmingTokenAccount: farmingTokenAccounts.get(fs.farmingTokenMint),
                        userKey: wallet.publicKey,
                        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                        clock: SYSVAR_CLOCK_PUBKEY,
                      },
                    }
                  )
                )
            }

          )

          // Close calc accounts for closed tickets or finished farmings
          if (new BN(ticket.endTime).lt(new BN(DEFAULT_FARMING_TICKET_END_TIME)) || fs.tokensUnlocked === fs.tokensTotal) {
            const closeCalcTx = new Transaction()
              .add(await program.instruction.closeFarmingCalc(
                {
                  accounts: {
                    farmingCalc: calcAccount,
                    farmingTicket: new PublicKey(ticket.farmingTicket),
                    signer: wallet.publicKey,
                    initializer: wallet.publicKey,
                  }
                }
              ))

            transactions.push({ transaction: closeCalcTx })
          }

          return transactions
        })
    )
  })
  )

  const allTransactions = withdrawTransactions.flat(2)



  // Merge with new account instructions 
  if (createdAccounts.length && allTransactions.length) {
    const firstTx = allTransactions[0]
    const newFirstTx = new Transaction()
    createdAccounts.forEach((ca) => {
      newFirstTx.add(ca.transaction)
    })
    newFirstTx.add(firstTx.transaction)

    allTransactions[0] = { transaction: newFirstTx, signers: firstTx.signers || [] }
  }

  if (signAllTransactions) {
    try {
      const signedTransactions = await signTransactions({
        wallet,
        connection,
        transactionsAndSigners: allTransactions.map(({ transaction, signers = [] }) => ({ transaction, signers })),
      })

      if (!signedTransactions) {
        return 'failed'
      }

      for (let signedTransaction of signedTransactions) {
        // send transaction and wait 1s before sending next
        const result = await sendSignedTransaction({
          transaction: signedTransaction,
          connection,
          timeout: 10_000,
        })

        if (result === 'timeout') {
          return 'blockhash_outdated'
        } else if (result === 'failed') {
          return 'failed'
        }

        // await sleep(2000)
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (isCancelledTransactionError(e)) {
        return 'cancelled'
      }
    }

    return 'success'
  } else {
    for (let i = 0; i < allTransactions.length; i++) {
      const result = await sendTransaction({
        wallet,
        connection,
        transaction: allTransactions[i].transaction,
        signers: allTransactions[i].signers || [],
      })

      if (result === 'timeout') {
        return 'blockhash_outdated'
      } else if (result === 'failed') {
        return 'failed'
      }
    }
  }

  return 'success'
}
