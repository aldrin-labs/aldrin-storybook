import { buildTransactions, buildStartStakingInstructions } from '@core/solana'

import { signAndSendTransactions } from '../../transactions'
import { StartStakingParams } from './types'

export const startStaking = async (params: StartStakingParams) => {
  const { wallet, connection } = params
  const creatorPk = wallet.publicKey
  if (!creatorPk) {
    throw new Error('no wallet!')
  }

  const { instructions, signers } = await buildStartStakingInstructions(params)
  try {
    const transactionsAndSigners = buildTransactions(
      instructions.map((instruction) => ({ instruction })),
      creatorPk,
      signers
    )

    return await signAndSendTransactions({
      transactionsAndSigners,
      connection,
      wallet,
    })
  } catch (e) {
    console.warn('Error sign or send transaction: ', e)
    return 'failed'
  }
}
