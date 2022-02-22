import { Connection } from '@solana/web3.js'

import { loadAccountsFromProgram } from '@sb/dexUtils/common/loadAccountsFromProgram'
import { TWAMM_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { WalletAdapter } from '@sb/dexUtils/types'

import { ProgramsMultiton } from '../ProgramsMultiton'

export const getPairSettings = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const config = {
    filters: [{ dataSize: program.account.pairSettings.size }],
  }

  const pairSettingsAccount = await loadAccountsFromProgram({
    connection,
    filters: config.filters,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  const allData = pairSettingsAccount.map((item) => {
    const data = Buffer.from(item.account.data)
    const dataDecoded = program.coder.accounts.decode('PairSettings', data)
    return { ...dataDecoded, pubkey: item.pubkey }
  })

  return allData
}
