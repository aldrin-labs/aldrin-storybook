import { Keypair, PublicKey, Connection, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js"
import { WalletAdapter } from "../../types"
import BN from "bn.js"
import { ProgramsMultiton } from "../../ProgramsMultiton/ProgramsMultiton"
import { POOLS_V2_PROGRAM_ADDRESS } from "../../ProgramsMultiton/utils"
import { TokenInstructions } from "@project-serum/serum"
import { createTokenAccountInstrs } from "@project-serum/common"
import { Provider } from "@project-serum/anchor"

import { walletAdapterToWallet } from './createPool'

export interface InitializeFarmingBase {
  farmingTokenMint: PublicKey
  farmingTokenAccount: PublicKey
  tokenAmount: BN
  tokensPerPeriod: BN
  periodLength: BN // In seconds
  noWithdrawPeriodSeconds: BN // In seconds
  vestingPeriodSeconds: BN // In seconds
}

interface InitializeFarmingParams extends InitializeFarmingBase {
  pool: PublicKey
  wallet: WalletAdapter
  connection: Connection
}

export const initializeFarmingInstructions = async (params: InitializeFarmingParams): Promise<[Transaction, Keypair[]]> => {

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
  } = params

  const farmingState = Keypair.generate()
  const snapshots = Keypair.generate()
  const farmingTokenVault = Keypair.generate()

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })


  const walletWithPk = walletAdapterToWallet(wallet)


  const provider = new Provider(connection, walletWithPk, Provider.defaultOptions())

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [pool.toBuffer()],
    program.programId
  )


  const vaultTransaction = new Transaction()
    .add(...(await createTokenAccountInstrs(provider, farmingTokenVault.publicKey, farmingToken, vaultSigner)))

  // const transaction = new Transaction()
  const transaction = vaultTransaction
    .add(await program.account.snapshotQueue.createInstruction(snapshots))
    .add(await program.account.farmingState.createInstruction(farmingState))
    .add(await program.instruction.initializeFarming(
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
          farmingTokenAccount: farmingTokenAccount,
          farmingAuthority: wallet.publicKey,
          walletAuthority: wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    ))

  return [
    transaction,
    [
      snapshots,
      farmingState,
      farmingTokenVault,
    ]
  ]

}