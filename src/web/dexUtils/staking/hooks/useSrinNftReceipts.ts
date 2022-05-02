import useSWR from 'swr'

import { AldrinConnection, useConnection } from '../../connection'
import { ProgramsMultiton } from '../../ProgramsMultiton'
import { WalletAdapter } from '../../types'
import { useWallet } from '../../wallet'

interface LoadReceiptsParams {
  wallet: WalletAdapter
  connection: AldrinConnection
}

const USER_KEY_OFFSET = 8

export const loadNftReceipts = async (params: LoadReceiptsParams) => {
  const program = ProgramsMultiton.getPlutoniansStakingProgram({
    wallet: params.wallet,
    connection: params.connection,
  })
  if (!params.wallet.publicKey) {
    return []
  }
  return program.account.userNftReceipt.all([
    {
      memcmp: {
        offset: USER_KEY_OFFSET,
        bytes: params.wallet.publicKey.toString(),
      },
    },
  ])
}

export const useSrinNftReceipts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  return useSWR(`srin-nft-receipts-${wallet.publicKey?.toString()}`, () =>
    loadNftReceipts({ wallet, connection })
  )
}
