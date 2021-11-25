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
