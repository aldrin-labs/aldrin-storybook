import { ProgramAccount } from 'anchor024'
import useSWR from 'swr'

import { useConnection } from '../../connection'
import { ProgramsMultiton } from '../../ProgramsMultiton'
import { useWallet } from '../../wallet'
import { LoadReceiptsParams, SrinNftReceipt } from './types'

const USER_KEY_OFFSET = 8

export const loadNftReceipts = async (
  params: LoadReceiptsParams
): Promise<ProgramAccount<SrinNftReceipt>[]> => {
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
  ]) as Promise<any> as Promise<ProgramAccount<SrinNftReceipt>[]>
}

export const useSrinNftReceipts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  return useSWR(`srin-nft-receipts-${wallet.publicKey?.toString()}`, () =>
    loadNftReceipts({ wallet, connection })
  )
}
