import { Connection } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadPairSettings } from './loadPairSettings'

export const getParsedPairSettings = async ({
  connection,
  wallet,
}: {
  connection: Connection
  wallet: WalletAdapter
}) => {
  const pairSettings = await loadPairSettings({
    connection,
  })

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const OrdersArray = pairSettings.map((pair) => {
    const data = Buffer.from(pair.account.data)
    const pairData = program.coder.accounts.decode('PairSettings', data)

    console.log('ordersData', pairData)

    return {
      isInitialized: pairData.isInitialized,
      baseTokenFeeAccount: pairData.baseTokenFeeAccount.toString(),
      quoteTokenFeeAccount: pairData.quoteTokenFeeAccount.toString(),
      baseTokenMint: pairData.baseTokenMint.toString(),
      quoteTokenMint: pairData.quoteTokenMint.toString(),
      quoteMintDecimals: pairData.quoteMintDecimals,
      baseMintDecimals: pairData.baseMintDecimals,
      pair: pairData.initializerAccount.toString(),
      publicKey: pair.pubkey.toString(),
    }
  })

  return OrdersArray
}
