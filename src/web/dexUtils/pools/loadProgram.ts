import { Connection, PublicKey } from '@solana/web3.js'
import { Program, Provider } from '@project-serum/anchor'
import { WalletAdapter } from '@sb/dexUtils/types'

const LookupJSON = require('./lookup.json')
const POOLS_PROGRAM_ADDRESS =
  'RinKtB5mZkTYfVvhCyLrwGxaYsfXruZg4r4AmzPM4wx'

// This is program to interact with pools.
export const loadPoolsProgram = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const program_idl = LookupJSON
  const poolsProgramId = new PublicKey(POOLS_PROGRAM_ADDRESS)

  const poolsProgram = new Program(
    program_idl,
    poolsProgramId,
    new Provider(connection, wallet, {
      preflightCommitment: 'recent',
      commitment: 'recent',
    })
  )

  return poolsProgram
}