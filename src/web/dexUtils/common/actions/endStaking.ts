import { PublicKey } from '@solana/web3.js'

import {
  buildEndStakingInstructions,
  AldrinConnection,
  buildTransactions,
} from '@core/solana'
import { FarmingTicket, StakingPool } from '@core/types/farming.types'
import { PoolInfo } from '@core/types/pools.types'

import { walletAdapterToWallet } from '..'

import { signAndSendTransactions } from '../../transactions'
import { WalletAdapter } from '../../types'

export interface EndstakingParams {
  wallet: WalletAdapter
  connection: AldrinConnection
  userPoolTokenAccount?: PublicKey
  farmingTickets: FarmingTicket[]
  stakingPool: StakingPool | PoolInfo
  programAddress: string
  closeCalcs?: boolean
}

export const endStaking = async (params: EndstakingParams) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const instructions = await buildEndStakingInstructions({
    ...params,
    closeCalcs: true,
    wallet,
  })

  const { connection } = params

  if (!wallet.publicKey) {
    throw new Error('No publicKey for wallet!')
  }

  const transactionsAndSigners = buildTransactions(
    instructions.map((instruction) => ({ instruction })),
    wallet.publicKey,
    []
  )

  return signAndSendTransactions({
    transactionsAndSigners,
    connection,
    wallet,
  })
}
