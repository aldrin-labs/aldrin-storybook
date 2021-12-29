import { Program, Provider } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { loadAccountsFromProgram } from '@sb/dexUtils/common/loadAccountsFromProgram'
import { TWAMM_PROGRAM_ADDRESS } from '@sb/dexUtils/ProgramsMultiton/utils'
import { WalletAdapter } from '@sb/dexUtils/types'

import TwammProgramIdl from '@core/idls/twamm.json'

export const getOrderArray = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}) => {
  const programId = new PublicKey(TWAMM_PROGRAM_ADDRESS)

  const program = new Program(
    TwammProgramIdl,
    programId,
    new Provider(connection, wallet, Provider.defaultOptions())
  )
  const config = {
    filters: [{ dataSize: program.account.orderArray.size }],
  }

  const orderArrayAccount = loadAccountsFromProgram({
    connection,
    filters: config.filters,
    programAddress: TWAMM_PROGRAM_ADDRESS,
  })

  let allData = []

  await orderArrayAccount.then((resOrderArray) => {
    allData = resOrderArray.map((item) => {
      const data = Buffer.from(item.account.data)
      const dataDecoded = program.coder.accounts.decode('OrderArray', data)
      return { ...dataDecoded, pubkey: item.pubkey }
    })
  })

  return await allData
}
