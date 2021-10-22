import { useEffect, useState } from 'react'
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
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refreshUserTokens: RefreshFunction = () =>
    setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadUserTokens = async () => {
      if (!wallet || !wallet.publicKey) return
      const userTokens = await getAllTokensData(wallet.publicKey, connection)

      setUserTokens(userTokens)
    }

    if (wallet.publicKey) {
      loadUserTokens()
    }
  }, [wallet.publicKey, refreshCounter])

  return [userTokens, refreshUserTokens]
}
