import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { WalletAdapter } from '@sb/dexUtils/types'

import { defaultOptions, MARKET_ORDER_PROGRAM_ADDRESS } from '@core/solana'

const LookupJSON = require('./lookup.json')

// This is custom Serum program to place market orders & settle & etc.
export const loadMarketOrderProgram = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const program_idl = LookupJSON
  const marketOrderProgramId = new PublicKey(MARKET_ORDER_PROGRAM_ADDRESS)

  const marketOrderProgram = new Program(
    program_idl,
    marketOrderProgramId,
    new Provider(connection, wallet, defaultOptions)
  )

  return marketOrderProgram
}
