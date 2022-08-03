import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  AldrinConnection,
  AuthorizedWalletAdapter,
  buildTransactions,
  DEFAULT_FARMING_TICKET_END_TIME,
  getCalcAccounts,
  getCurrentFarmingStateFromAll,
  getParsedUserFarmingTickets,
  getParsedUserStakingTickets,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
  ProgramsMultiton,
  RIN_MINT,
  STAKING_PROGRAM_ADDRESS,
} from '@core/solana'

import { PoolInfo } from '../compositions/Pools/index.types'
import { groupBy, toMap } from '../utils'
import { FarmingCalc, FarmingTicket } from './common/types'
import { StakingPool } from './staking/types'
import { Token, u64 as U64 } from './token/token'
import { signAndSendTransactions } from './transactions'
import { createAssociatedTokenAccountIx } from './wallet'

export enum MigrationStatus {
  PREPARING = 'PREPARING',
}

interface MigrateLiquidityParams {
  wallet: AuthorizedWalletAdapter
  connection: AldrinConnection
  newWallet: PublicKey
  onStatusChange: (newStatus: MigrationStatus) => void
  rinStaking: StakingPool
  pools: PoolInfo[]
  stakingTickets: FarmingTicket[]
  stakingCalcAccounts: FarmingCalc[]
  poolsTicketsByPool: Map<string, FarmingTicket[]>
  poolsCalcsByFarmingState: Map<string, FarmingCalc[]>
}

export const getTokensForUser = async (
  owner: PublicKey,
  connection: AldrinConnection
) => {
  const newUserTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  )

  const newUserTokens = newUserTokenAccounts.value.map((el) => ({
    mint: el.account.data.parsed.info.mint as string,
    address: el.pubkey.toBase58(),
    amount: new U64(el.account.data.parsed.info.tokenAmount.amount as string),
  }))

  return toMap(newUserTokens, (n) => n.mint)
}

export const migrateLiquidity = async (params: MigrateLiquidityParams) => {
  const { wallet, connection, rinStaking, newWallet, pools } = params

  // 1. RIN staking

  // 1.1 Get data
  const tickets = await getParsedUserStakingTickets({
    wallet,
    connection,
  })

  const rinProgram = ProgramsMultiton.getProgramByAddress({
    programAddress: STAKING_PROGRAM_ADDRESS,
    connection,
    wallet,
  })

  const rinStakingInstructions = new Transaction()

  const calcAccounts = await getCalcAccounts(rinProgram, wallet.publicKey)

  const activeCalcAccounts = calcAccounts.filter((ca) => ca.tokenAmount.gtn(0))

  const rinPoolPk = new PublicKey(rinStaking.swapToken)
  const [rinVaultSigner] = await PublicKey.findProgramAddress(
    [rinPoolPk.toBuffer()],
    rinProgram.programId
  )

  const userTokensMap = await getTokensForUser(wallet.publicKey, connection)
  const newUserTokensMap = await getTokensForUser(newWallet, connection)

  let rinAmountToTransfer = new U64(0)

  const claimFarmedIxsMaybe = await Promise.all(
    activeCalcAccounts.map(async (calcAccount) => {
      const fs = rinStaking.farming.find(
        (f) => f.farmingState === calcAccount.farmingState.toString()
      )

      if (fs) {
        let tokenAccount = userTokensMap.get(fs.farmingTokenMint)?.address
        rinAmountToTransfer = rinAmountToTransfer.add(calcAccount.tokenAmount)
        if (!tokenAccount) {
          const [ix, associatedAddress] = await createAssociatedTokenAccountIx(
            wallet.publicKey,
            wallet.publicKey,
            new PublicKey(RIN_MINT)
          )
          rinStakingInstructions.add(ix)
          userTokensMap.set(fs.farmingTokenMint, {
            mint: fs.farmingTokenMint,
            address: associatedAddress.toString(),
            amount: new U64(0),
          })
          tokenAccount = associatedAddress.toString()
        }
        return rinProgram.instruction.withdrawFarmed({
          accounts: {
            pool: rinPoolPk,
            farmingState: calcAccount.farmingState,
            farmingCalc: calcAccount.publicKey,
            farmingTokenVault: new PublicKey(fs.farmingTokenVault),
            poolSigner: rinVaultSigner,
            userFarmingTokenAccount: tokenAccount,
            userKey: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        }) as TransactionInstruction
      }
      console.warn(
        'No farming state for calc account',
        calcAccount.farmingState.toString()
      )
      return undefined
    })
  )

  const claimFarmedIxs = claimFarmedIxsMaybe.filter(
    (_): _ is TransactionInstruction => !!_
  )

  if (claimFarmedIxs.length) {
    rinStakingInstructions.add(...claimFarmedIxs)
  }

  const rinFarmingState = getCurrentFarmingStateFromAll(
    rinStaking.farming || []
  )

  const activeTickets = tickets.filter(
    (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
  )

  const endStakingIx = await Promise.all(
    activeTickets.map(async (ticketData) => {
      rinAmountToTransfer = rinAmountToTransfer.add(
        new U64(ticketData.tokensFrozen.toFixed(0))
      )
      return (await rinProgram.instruction.endFarming({
        accounts: {
          pool: new PublicKey(rinStaking.swapToken),
          farmingState: new PublicKey(rinFarmingState.farmingState),
          farmingSnapshots: new PublicKey(rinFarmingState.farmingSnapshots),
          farmingTicket: new PublicKey(ticketData.farmingTicket),
          // Make code compatible for both staking and pools farming
          stakingVault: new PublicKey(rinStaking.stakingVault),
          userStakingTokenAccount: new PublicKey(
            userTokensMap.get(rinFarmingState.farmingTokenMint)?.address || ''
          ),

          poolSigner: rinVaultSigner,
          userKey: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
      })) as TransactionInstruction
    })
  )

  if (endStakingIx.length) {
    rinStakingInstructions.add(...endStakingIx)
  }

  if (rinAmountToTransfer.gtn(0)) {
    let newRin = newUserTokensMap.get(RIN_MINT)?.address

    // Prepare transfer
    if (!newRin) {
      const [ix, associatedAddress] = await createAssociatedTokenAccountIx(
        wallet.publicKey,
        newWallet,
        new PublicKey(RIN_MINT)
      )

      newRin = associatedAddress.toString()

      rinStakingInstructions.add(ix)

      newUserTokensMap.set(RIN_MINT, {
        address: associatedAddress.toString(),
        mint: RIN_MINT,
        amount: new U64(0),
      })
    }

    rinStakingInstructions.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(userTokensMap.get(RIN_MINT)?.address || ''),
        new PublicKey(newRin),
        wallet.publicKey,
        [],
        rinAmountToTransfer.toString()
      )
    )
  }

  const programV1 = ProgramsMultiton.getProgramByAddress({
    programAddress: POOLS_PROGRAM_ADDRESS,
    connection,
    wallet,
  })
  const programV2 = ProgramsMultiton.getProgramByAddress({
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
    connection,
    wallet,
  })
  const accounts = await Promise.all([
    getCalcAccounts(programV1, wallet.publicKey),
    getCalcAccounts(programV2, wallet.publicKey),
  ])

  const calcsForPools = groupBy(accounts.flat(), (acc) =>
    acc.farmingState.toString()
  )

  const poolTickets = await getParsedUserFarmingTickets({
    wallet,
    connection,
  })

  const ticketsForPools = groupBy(poolTickets, (pt) => pt.pool)

  const poolTransactions = pools.map(async (pool) => {
    const program = pool.curve ? programV2 : programV1

    const [vaultSigner] = await PublicKey.findProgramAddress(
      [new PublicKey(pool.swapToken).toBuffer()],
      program.programId
    )

    const withdrawMap = new Map<string, { address: string; amount: U64 }>() // mint -> { address, amount }

    const ticketsForPool = ticketsForPools.get(pool.swapToken)

    if (!ticketsForPool) {
      return undefined
    }

    const activeTicketsForPool = ticketsForPool.filter(
      (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
    )

    const tx = new Transaction()

    // Claim from calcs
    const claimFromCalcs = (pool.farming || []).map(async (f) => {
      const calcAccountsForState = calcsForPools.get(f.farmingState.toString())
      if (!calcAccountsForState) {
        return undefined
      }

      console.log(
        'calcs for state,',
        calcAccountsForState
          .filter((_) => _.tokenAmount.gtn(0))
          .map((_) => [_.publicKey.toString(), _.tokenAmount.toString()]),
        pool.parsedName,
        f.farmingState
      )

      const withdrawInstructions = Promise.all(
        calcAccountsForState
          .filter((_) => _.tokenAmount.gtn(0))
          .map(async (calcAccount) => {
            let tokenAccount = userTokensMap.get(f.farmingTokenMint)?.address
            if (!tokenAccount) {
              const [ix, associatedAddress] =
                await createAssociatedTokenAccountIx(
                  wallet.publicKey,
                  wallet.publicKey,
                  new PublicKey(f.farmingTokenMint)
                )
              tx.add(ix)
              tokenAccount = associatedAddress.toString()
              userTokensMap.set(f.farmingTokenMint, {
                mint: f.farmingTokenMint,
                address: associatedAddress.toString(),
                amount: new U64(0),
              })
              withdrawMap.set(f.farmingTokenMint, {
                address: associatedAddress.toString(),
                amount: new U64(0),
              })
            }
            const amount =
              withdrawMap.get(f.farmingTokenMint)?.amount ||
              userTokensMap.get(f.farmingTokenMint)?.amount ||
              new U64(0)

            withdrawMap.set(f.farmingTokenMint, {
              address: tokenAccount,
              amount: amount.add(calcAccount.tokenAmount),
            })

            return program.instruction.withdrawFarmed({
              accounts: {
                pool: new PublicKey(pool.swapToken),
                farmingState: calcAccount.farmingState,
                farmingCalc: calcAccount.publicKey,
                farmingTokenVault: new PublicKey(f.farmingTokenVault),
                poolSigner: vaultSigner,
                userFarmingTokenAccount: new PublicKey(
                  withdrawMap.get(f.farmingTokenMint)?.address || ''
                ),
                userKey: wallet.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                clock: SYSVAR_CLOCK_PUBKEY,
              },
            }) as Promise<TransactionInstruction>
          })
      )

      return withdrawInstructions
    })

    const claimCalcsIxs = (await Promise.all(claimFromCalcs)).filter(
      (c): c is TransactionInstruction[] => !!c
    )

    if (claimCalcsIxs.flat().length) {
      console.log('claimCalcsIxs', claimCalcsIxs.flat())
      tx.add(...claimCalcsIxs.flat())
    }

    let userPoolTokenAccount = userTokensMap.get(pool.poolTokenMint)?.address

    if (!userPoolTokenAccount) {
      console.log(
        'No LP token account, create...',
        userTokensMap.get(pool.poolTokenMint),
        pool.poolTokenMint,
        Date.now()
      )
      const [ix, associatedAddress] = await createAssociatedTokenAccountIx(
        wallet.publicKey,
        wallet.publicKey,
        new PublicKey(pool.poolTokenMint)
      )
      tx.add(ix)
      userTokensMap.set(pool.poolTokenMint, {
        mint: pool.poolTokenMint,
        address: associatedAddress.toString(),
        amount: new U64(0),
      })
      withdrawMap.set(pool.poolTokenMint, {
        address: associatedAddress.toString(),
        amount: new U64(0),
      })
      userPoolTokenAccount = associatedAddress.toString()
    }

    // End farming
    const endFarmings = activeTicketsForPool.map(async (ticket) => {
      const farmingState = (pool.farming || []).find(
        (_) => _.tokensUnlocked < _.tokensTotal
      )
      if (farmingState) {
        const amount =
          withdrawMap.get(pool.poolTokenMint)?.amount ||
          userTokensMap.get(pool.poolTokenMint)?.amount ||
          new U64(0)

        if (!userPoolTokenAccount) {
          throw new Error('No user pool token account')
        }

        withdrawMap.set(pool.poolTokenMint, {
          address: userPoolTokenAccount,
          amount: amount.add(new U64(ticket.tokensFrozen.toString())),
        })

        return (await program.instruction.endFarming({
          accounts: {
            pool: new PublicKey(pool.swapToken),
            farmingState: new PublicKey(farmingState.farmingState),
            farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
            farmingTicket: new PublicKey(ticket.farmingTicket),

            lpTokenFreezeVault: new PublicKey(pool.lpTokenFreezeVault),
            userPoolTokenAccount,

            poolSigner: vaultSigner,
            userKey: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
        })) as TransactionInstruction
      }
      return undefined
    })

    const endFarmingIxs = await Promise.all(endFarmings)
    const endFarmingIxsFiltered = endFarmingIxs.filter(
      (_): _ is TransactionInstruction => !!_
    )
    if (endFarmingIxsFiltered.length) {
      tx.add(...endFarmingIxsFiltered)
    }

    const toWithdraw = Array.from(withdrawMap.entries())
    await Promise.all(
      toWithdraw.map(async ([mint, v]) => {
        let userToken = newUserTokensMap.get(mint)?.address
        if (!userToken) {
          const [ix, associatedAddress] = await createAssociatedTokenAccountIx(
            wallet.publicKey,
            newWallet,
            new PublicKey(mint)
          )
          tx.add(ix)
          userToken = associatedAddress.toString()
        }

        console.log('withdraw', v.address, v.amount.toString())

        tx.add(
          Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            new PublicKey(v.address),
            new PublicKey(userToken),
            wallet.publicKey,
            [],
            v.amount.toString()
          )
        )
      })
    )

    return tx
  })

  const transactions = [
    rinStakingInstructions,
    ...(await Promise.all(poolTransactions)),
  ].filter((_): _ is Transaction => !!_ && _.instructions.length > 0)

  const splittedTransactions = transactions.map((t) =>
    buildTransactions(
      t.instructions.map((instruction) => ({ instruction })),
      wallet.publicKey
    )
  )

  for (let i = 0; i < splittedTransactions.length; i += 1) {
    const transactionsAndSigners = splittedTransactions[i]
    console.log('tx', transactionsAndSigners)
    const result = await signAndSendTransactions({
      transactionsAndSigners,
      connection,
      wallet,
    })
    console.log('txHash', result)
  }
}
