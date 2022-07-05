import { parseMintAccount } from '@project-serum/common'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
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

    // TODO: Add SOL check & close wSOL account
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
    farm: farm.publicKey,
    stakeWallet: new PublicKey(userTokenAccount),
    stakeVault: farm.stakeVault,
    tokenAmount,
  })

  instructions.push(instruction)

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: [
      { transaction: new Transaction().add(...instructions) },
    ],
  })
}
