import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { useCallback, useEffect, useState } from 'react'
import { useConnection } from './connection'
import { RefreshFunction, TokenInfo } from './types'
import { useWallet } from './wallet'

export const useUserTokenAccounts = (): [TokenInfo[], RefreshFunction] => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([])

  const loadUserTokens = useCallback(async () => {
    if (!wallet || !wallet.publicKey) return true
    const tokens = await getAllTokensData(wallet.publicKey, connection)

    setUserTokens(tokens)

    return true
  }, [wallet.publicKey])

  useEffect(() => {
    if (wallet.publicKey) {
      loadUserTokens()
    }
  }, [wallet.publicKey])

  return [userTokens, loadUserTokens]
}
