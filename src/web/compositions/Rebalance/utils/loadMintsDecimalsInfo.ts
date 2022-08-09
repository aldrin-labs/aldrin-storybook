import { Connection } from '@solana/web3.js'

import { notifyForDevelop, notifyWithLog } from '@sb/dexUtils/notifications'
import { MINT_LAYOUT } from '@sb/dexUtils/tokens'

export const loadMintsDecimalsInfo = async ({
  connection,
  mints,
}: {
  connection: Connection
  mints: string[]
}) => {
  const mintsMap = new Map()

  const loadedMints = await connection._rpcRequest('getMultipleAccounts', [
    mints,
    { encoding: 'base64' },
  ])

  if (loadedMints.result.error || !loadedMints.result.value) {
    notifyWithLog({
      message:
        'Something went wrong while loading mints, please try again later.',
      result: loadedMints.result,
    })

    return mintsMap
  }

  loadedMints.result.value.map((encodedMintInfo: any, i: number) => {
    const mint = mints[i]
    const data = new Buffer(encodedMintInfo.data[0], 'base64')
    const { decimals } = MINT_LAYOUT.decode(data)

    if (!decimals) {
      notifyForDevelop({
        message: 'No decimals info for mint.',
        mint,
        decimals,
      })

      return
    }

    // get mint by index for now, don't see any other way to match decimals with mint
    mintsMap.set(mint, { mint, decimals })
  })

  return mintsMap
}
