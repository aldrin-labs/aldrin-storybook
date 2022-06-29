import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'

import { buildClaimEligibleHarvestInstruction } from '@core/solana/programs/farming/instructions/claimEligibleHarvestTransaction'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { ClaimEligibleHarvestParams } from './types'
import { createAssociatedTokenAccountTransaction } from '@core/solana'

export const claimEligibleHarvest = async (
  params: ClaimEligibleHarvestParams
) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, userTokens, connection } = params

  const instructions: TransactionInstruction[] = []

  const remainingAccounts = []

  for (const harvest of farm.harvests) {
    let userTokenAccount = userTokens.find(
      (ut) => ut.mint === harvest.mint.toString()
    )?.address

    if (!userTokenAccount) {
      const { newAccountPubkey, transaction } =
        await createAssociatedTokenAccountTransaction({
          wallet,
          mintPublicKey: farm.stakeMint,
        })
      userTokenAccount = newAccountPubkey.toString()

      instructions.push(...transaction.instructions)
    }
    remainingAccounts.push([harvest.vault, new PublicKey(userTokenAccount)])
  }

  const { instruction } = await buildClaimEligibleHarvestInstruction({
    farm: farm.publicKey,
    wallet,
    connection,
    remainingAccounts: remainingAccounts
      .map((tuple) => [
        {
          pubkey: tuple[0],
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: tuple[1],
          isSigner: false,
          isWritable: true,
        },
      ])
      .flat(),
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
