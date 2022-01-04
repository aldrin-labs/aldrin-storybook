import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { BN } from 'bn.js'

import { NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION } from '@sb/dexUtils/common/config'
import { getSnapshotsWithUnclaimedRewards } from '@sb/dexUtils/pools/addFarmingRewardsToTickets/getSnapshotsWithUnclaimedRewards'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton'

import { PoolInfo } from '../../../compositions/Pools/index.types'
import { u64 } from '../../token/token'
import { WalletAdapter } from '../../types'
import { FarmingCalc, FarmingTicket, SnapshotQueue } from '../types'

export async function calculateStaked(
  farmingTickets: FarmingTicket[],
  pool: PoolInfo,
  snapshotQueues: SnapshotQueue[],
  calcAccounts: FarmingCalc[],
  programAddress: string,
  wallet: WalletAdapter,
  connection: Connection
) {
  const { swapToken } = pool
  const poolPublicKey = new PublicKey(swapToken)

  const creatorPk = wallet.publicKey
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const calculateTransactions = await Promise.all(
    farmingTickets.map((ticket) => {
      return Promise.all(
        (pool.farming || []).map(async (fs) => {
          if (!creatorPk) {
            throw new Error('No public key for wallet!')
          }

          const unclaimedSnapshots = getSnapshotsWithUnclaimedRewards({
            ticket,
            farmingState: fs,
            snapshotQueues,
            forVesting: false,
          })

          const transactions: {
            transaction: Transaction
            signers?: Keypair[]
          }[] = []

          const iterations = Math.ceil(
            unclaimedSnapshots.length /
              NUMBER_OF_SNAPSHOTS_TO_CLAIM_PER_TRANSACTION
          )

          // Looking for FarmingCalc account / create if not exists
          let calcAccount = calcAccounts.find(
            (ca) => ca.farmingState.toBase58() === fs.farmingState
          )?.publicKey

          if (!calcAccount) {
            const farmingCalc = Keypair.generate()
            const createCalcTx = new Transaction()
              .add(
                await program.account.farmingCalc.createInstruction(farmingCalc)
              )
              .add(
                await program.instruction.initializeFarmingCalc({
                  accounts: {
                    farmingCalc: farmingCalc.publicKey,
                    farmingTicket: new PublicKey(ticket.farmingTicket),
                    farmingState: new PublicKey(fs.farmingState),
                    userKey: creatorPk,
                    initializer: creatorPk,
                    rent: SYSVAR_RENT_PUBKEY,
                  },
                })
              )

            transactions.push({
              transaction: createCalcTx,
              signers: [farmingCalc],
            })
            calcAccount = farmingCalc.publicKey

            calcAccounts.push({
              publicKey: calcAccount,
              farmingState: new PublicKey(fs.farmingState),
              userKey: creatorPk,
              initializer: creatorPk,
              tokenAmount: new u64(0),
            })
          }

          // Create calculateFarmed transactions
          for (let i = 1; i <= iterations; i += 1) {
            if (calcAccount) {
              const ca = calcAccounts.find(
                (ca1) => ca1.publicKey.toBase58() === calcAccount?.toBase58()
              )
              if (ca) {
                ca.tokenAmount = new u64(1) // Just to mark for withdraw on next iter
              }
            }
            const tx = new Transaction()
            tx.add(
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
            ).add(
              // due to same transaction data for calculateFarmed we need add transaction with random
              // lamports amount to get random transaction hash every time
              SystemProgram.transfer({
                fromPubkey: creatorPk,
                toPubkey: creatorPk,
                lamports: Math.round(Math.random() * 1000),
              })
            )
            transactions.push({ transaction: tx })
          }

          return transactions
        })
      )
    })
  )

  return calculateTransactions
}
