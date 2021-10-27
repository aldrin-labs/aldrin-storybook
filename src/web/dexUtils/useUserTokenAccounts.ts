import { useCallback, useEffect, useState } from 'react'
import { Connection } from '@solana/web3.js'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { RefreshFunction, TokenInfo, WalletAdapter } from './types'

export const useUserTokenAccounts = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [TokenInfo[], RefreshFunction] => {
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([])

  const loadUserTokens = useCallback(async () => {
    if (!wallet || !wallet.publicKey) return true
    const userTokens = await getAllTokensData(wallet.publicKey, connection)

    setUserTokens(userTokens)

    return true
  }, [wallet.publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      loadUserTokens()
    }
  }, [wallet.publicKey])

  return [userTokens, loadUserTokens]
}
