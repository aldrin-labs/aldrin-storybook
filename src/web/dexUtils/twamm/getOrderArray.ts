import { Connection } from '@solana/web3.js'

import { loadAccountsFromProgram } from '@sb/dexUtils/common/loadAccountsFromProgram'
import { WalletAdapter } from '@sb/dexUtils/types'

import { TWAMM_PROGRAM_ADDRESS, ProgramsMultiton } from '@core/solana'

export const getOrderArray = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  try {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: TWAMM_PROGRAM_ADDRESS,
    })

    const config = {
      filters: [{ dataSize: program.account.orderArray.size }],
    }

    const orderArrayAccount = await loadAccountsFromProgram({
      connection,
      filters: config.filters,
      programAddress: TWAMM_PROGRAM_ADDRESS,
    })

    const allData = orderArrayAccount.map((item) => {
      const data = Buffer.from(item.account.data)
      const dataDecoded = program.coder.accounts.decode('OrderArray', data)
      return { ...dataDecoded, pubkey: item.pubkey }
    })

    return allData
  } catch (e) {
    console.warn('getOrderArray error:', e)
    throw e
  }
}
