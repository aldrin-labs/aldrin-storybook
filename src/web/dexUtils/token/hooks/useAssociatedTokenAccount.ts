import { useEffect, useState } from 'react'

import { useUserTokenAccounts } from '.'
import { TokenInfo } from '../../types'
import { useWallet } from '../../wallet'
import { findTokenAccount } from '../utils/findTokenAccount'

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
