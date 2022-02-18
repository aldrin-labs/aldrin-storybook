import { useEffect, useState } from 'react'

import { TokenInfo } from '../../types'
import { useWallet } from '../../wallet'
import { findTokenAccount } from '../utils/findTokenAccount'
import { useUserTokenAccounts } from './useUserTokenAccounts'

export const useAssociatedTokenAccount = (
  mint?: string
): TokenInfo | undefined => {
  const [account, setAccount] = useState<TokenInfo | undefined>(undefined)
  const [tokenAccounts] = useUserTokenAccounts()
  const { wallet } = useWallet()

  useEffect(() => {
    const load = async () => {
      if (!wallet.publicKey || !mint) {
        setAccount(undefined)
        return
      }
      setAccount(await findTokenAccount(tokenAccounts, wallet.publicKey, mint))
    }

    load()
  }, [mint, tokenAccounts])

  return account
}
