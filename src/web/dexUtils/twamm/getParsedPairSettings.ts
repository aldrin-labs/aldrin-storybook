import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { TWAMM_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadPairSettings } from './loadPairSettings'
import { PairSettings } from './types'
import TwammProgramIdl from '@core/idls/twamm.json'

export const getParsedPairSettings = async ({
  connection,
  wallet,
}: {
  connection: Connection
  wallet: WalletAdapter
}): Promise<PairSettings[]> => {
  const pairSettings = await loadPairSettings({
    connection,
  })

  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS)

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(connection, wallet, Provider.defaultOptions())
  )

  const OrdersArray = pairSettings.map((pair) => {
    const data = Buffer.from(pair.account.data)
    const pairData = program.coder.accounts.decode('PairSettings', data)

    console.log('ordersData', pairData)

    return {
      ...pairData,
      isInitialized: pairData.isInitialized,
      baseTokenFeeAccount: pairData.baseTokenFeeAccount.toString(),
      quoteTokenFeeAccount: pairData.quoteTokenFeeAccount.toString(),
      baseTokenMint: pairData.baseTokenMint.toString(),
      quoteTokenMint: pairData.quoteTokenMint.toString(),
      quoteMintDecimals: pairData.quoteMintDecimals,
      baseMintDecimals: pairData.baseMintDecimals,
      pair: pairData.initializerAccount.toString(),
      publicKey: pair.pubkey.toString(),
      account: pairData.initializerAccount.toString(),
    }
  })

  return OrdersArray
}
