import {
  buildEndPlutoniansStakingTransactions,
  EndSrinStakingParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { WalletAdapter } from '../../types'
import {} from './types'

export const endSrinStaking = async (
  params: EndSrinStakingParams<WalletAdapter>
) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const transactionsAndSigners = await buildEndPlutoniansStakingTransactions({
    ...params,
    wallet,
  })
  return signAndSendTransactions({
    transactionsAndSigners,
    wallet,
    connection: params.connection,
  })
}
