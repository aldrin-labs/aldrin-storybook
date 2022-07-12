import {
  buildTransactions,
  STAKING_PROGRAM_ADDRESS,
  buildStartStakingInstructions,
  buildWithdrawStakedInstructions,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
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

  const w = walletAdapterToWallet(wallet)
  const claimInstructions = await buildWithdrawStakedInstructions({
    connection,
    wallet: w,
    stakingPool,
    farmingTickets,
    programAddress,
    allTokensData,
  })

  const startInstructions = await buildStartStakingInstructions({
    connection,
    wallet: w,
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

  const signers = [...startInstructions.signers]

  const transactionsAndSigners = buildTransactions(
    instructions,
    w.publicKey,
    signers
  )

  return signAndSendTransactions({
    transactionsAndSigners,
    connection,
    wallet: w,
  })
}
