import { buildTransactions, STAKING_PROGRAM_ADDRESS } from '@core/solana'

import {
  startStakingInstructions,
  withdrawStakedInstructions,
} from '../../common/actions'
import { signAndSendTransactions } from '../../transactions'
import { RestakeParams } from './types'

export const restake = async (params: RestakeParams) => {
  const {
    connection,
    wallet,
    amount,
    userPoolTokenAccount,
    stakingPool,
    farmingTickets,
    programAddress = STAKING_PROGRAM_ADDRESS,
    allTokensData,
  } = params

  const creatorPk = wallet.publicKey
  if (!creatorPk) {
    throw new Error('no pubkey')
  }

  const claimInstructions = await withdrawStakedInstructions({
    connection,
    wallet,
    stakingPool,
    farmingTickets,
    programAddress,
    allTokensData,
  })

  const startInstructions = await startStakingInstructions({
    connection,
    wallet,
    amount,
    userPoolTokenAccount,
    stakingPool,
    farmingTickets,
    programAddress,
  })

  const instructions = [
    ...claimInstructions.instructions,
    ...startInstructions.instructions,
  ].map((instruction) => ({
    instruction,
  }))

  const signers = [...claimInstructions.signers, ...startInstructions.signers]

  const transactionsAndSigners = buildTransactions(
    instructions,
    creatorPk,
    signers
  )

  return signAndSendTransactions({
    transactionsAndSigners,
    connection,
    wallet,
  })
}
