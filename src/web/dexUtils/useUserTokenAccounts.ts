import { useEffect, useState, useCallback } from 'react'
import { Connection } from '@solana/web3.js'
import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import { TokenInfo, WalletAdapter, AsyncRefreshFunction } from './types'

export const useUserTokenAccounts = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [TokenInfo[], AsyncRefreshFunction] => {
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([])

  const loadUserTokens = useCallback(async () => {
    if (!wallet || !wallet.publicKey) return false
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
