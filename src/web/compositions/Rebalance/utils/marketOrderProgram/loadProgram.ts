import { Connection, PublicKey } from '@solana/web3.js'
import { Program, Provider } from '@project-serum/anchor'
import { WalletAdapter } from '@sb/dexUtils/adapters'

const LookupJSON = require('./lookup.json')
const MARKET_ORDER_PROGRAM_ADDRESS =
  'EVAsnnEkPuDXDnGG2AtHNunXBNqK44Nd3bZauH7zKndP'

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
    new Provider(connection, wallet, {
      preflightCommitment: 'recent',
      commitment: 'recent',
    })
  )

  return marketOrderProgram
}
