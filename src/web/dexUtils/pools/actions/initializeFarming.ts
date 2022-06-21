import { Provider } from '@project-serum/anchor'
import { createTokenAccountInstrs } from '@project-serum/common'
import { TokenInstructions } from '@project-serum/serum'
import {
  Keypair,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import BN from 'bn.js'

import {
  AldrinConnection,
  ProgramsMultiton,
  defaultOptions,
  POOLS_V2_PROGRAM_ADDRESS,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signTransactions } from '../../send'
import { sendSignedSignleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

export interface InitializeFarmingBase {
  farmingTokenMint: PublicKey
  farmingTokenAccount: PublicKey
  tokenAmount: BN
  tokensPerPeriod: BN
  periodLength: BN // In seconds
  noWithdrawPeriodSeconds: BN // In seconds
  vestingPeriodSeconds: BN // In seconds
  accountLamports?: number
}

interface InitializeFarmingParams extends InitializeFarmingBase {
  pool: PublicKey
  wallet: WalletAdapter
  connection: AldrinConnection
  programAddress?: string
}

export const initializeFarmingInstructions = async (
  params: InitializeFarmingParams
): Promise<[Transaction, Keypair[]]> => {
  const {
    wallet,
    connection,
    tokenAmount,
    tokensPerPeriod,
    periodLength,
    noWithdrawPeriodSeconds,
    vestingPeriodSeconds,
    farmingTokenAccount,
    farmingTokenMint: farmingToken,
    pool,
    accountLamports,
    programAddress = POOLS_V2_PROGRAM_ADDRESS,
  } = params

  const farmingState = Keypair.generate()
  const snapshots = Keypair.generate()
  const farmingTokenVault = Keypair.generate()

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress,
  })

  const walletWithPk = walletAdapterToWallet(wallet)

  const provider = new Provider(connection, walletWithPk, defaultOptions())

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [pool.toBuffer()],
    program.programId
  )

  const vaultTransaction = new Transaction().add(
    ...(await createTokenAccountInstrs(
      provider,
      farmingTokenVault.publicKey,
      farmingToken,
      vaultSigner,
      accountLamports
    ))
  )

  // const transaction = new Transaction()
  const transaction = vaultTransaction
    .add(await program.account.snapshotQueue.createInstruction(snapshots))
    .add(await program.account.farmingState.createInstruction(farmingState))
    .add(
      await program.instruction.initializeFarming(
        tokenAmount,
        tokensPerPeriod,
        periodLength,
        noWithdrawPeriodSeconds,
        vestingPeriodSeconds,
        {
          accounts: {
            pool,
            farmingState: farmingState.publicKey,
            snapshots: snapshots.publicKey,
            farmingTokenVault: farmingTokenVault.publicKey,
            farmingTokenAccount,
            farmingAuthority: wallet.publicKey,
            walletAuthority: wallet.publicKey,
            tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
            rent: SYSVAR_RENT_PUBKEY,
          },
        }
      )
    )

  return [transaction, [snapshots, farmingState, farmingTokenVault]]
}

export const initializeFaming = async (
  params: InitializeFarmingParams
): Promise<[string | undefined, string]> => {
  const [transaction, signers] = await initializeFarmingInstructions(params)

  try {
    const [signedTransaction] = await signTransactions({
      transactionsAndSigners: [{ transaction, signers }],
      connection: params.connection,
      wallet: params.wallet,
    })
    const { txId, result } = await sendSignedSignleTransaction({
      transaction: signedTransaction,
      connection: params.connection,
      wallet: params.wallet,
    })
    return [txId, result]
  } catch (e) {
    return [undefined, 'rejected']
  }
}
