import {
  buildTransactions,
  buildWithdrawStakedInstructions,
} from '@core/solana'

import { signAndSendTransactions } from '../../transactions'
import { WithdrawStakedParams } from './types'

export const withdrawStaked = async (params: WithdrawStakedParams) => {
  const { wallet, connection } = params

  const creatorPk = wallet.publicKey

  const { instructions } = await buildWithdrawStakedInstructions(params)

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
