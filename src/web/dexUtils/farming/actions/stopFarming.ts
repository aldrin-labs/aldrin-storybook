import { parseMintAccount } from '@project-serum/common'
import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import { BN } from 'bn.js'

import {
  createAssociatedTokenAccountTransaction,
  buildStopFarmingV2Instruction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { StopFarmingParams } from './types'

export const stopFarmingV2 = async (params: StopFarmingParams) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, userTokens, connection, amount } = params
  const stakeMint = farm.stakeMint.toString()
  const existingTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)
  let userTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)?.address

  const instructions: TransactionInstruction[] = []
  if (!userTokenAccount) {
    const { newAccountPubkey, transaction } =
      await createAssociatedTokenAccountTransaction({
        wallet,
        mintPublicKey: farm.stakeMint,
      })
    userTokenAccount = newAccountPubkey.toString()

    instructions.push(...transaction.instructions)
  }

  let decimals = existingTokenAccount?.decimals
  if (decimals === undefined) {
    const tokenInfo = await connection.getAccountInfo(farm.stakeMint)
    if (!tokenInfo) {
      throw new Error('Token does not exist!')
    }
    const mintInfo = parseMintAccount(tokenInfo.data)
    decimals = mintInfo.decimals
  }

  const tokenAmount = new BN((amount * 10 ** decimals).toFixed(0))

  const { instruction } = await buildStopFarmingV2Instruction({
    wallet,
    connection,
    farm: new PublicKey(farm.publicKey),
    stakeWallet: new PublicKey(userTokenAccount),
    stakeVault: new PublicKey(farm.stakeVault),
    tokenAmount,
  })

  const requestCUIx = ComputeBudgetProgram.requestUnits({
    units: 1_400_000,
    additionalFee: 10_000,
  })

  instructions.push(instruction)
  instructions.push(requestCUIx)

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: [
      { transaction: new Transaction().add(...instructions) },
    ],
  })
}
