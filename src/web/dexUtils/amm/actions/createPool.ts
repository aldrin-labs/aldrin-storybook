import { buildTransactions } from '@core/solana'
import { buildCreatePoolInstruction } from '@core/solana/programs/amm/instructions/createPoolTransaction'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'

export const initializeFarmingV2 = async (params: any) => {
  const { connection } = params
  const wallet = walletAdapterToWallet(params.wallet)

  const { instructions, signers } = await buildCreatePoolInstruction({
    ...params,
    wallet,
  })

  const transactionsAndSigners = buildTransactions(
    instructions.map((instruction) => ({ instruction })),
    wallet.publicKey,
    signers
  )

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners,
  })
}
