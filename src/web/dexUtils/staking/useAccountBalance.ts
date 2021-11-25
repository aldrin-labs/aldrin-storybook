import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { useConnection } from '../connection'
import { AsyncRefreshVoidFunction } from '../types'

export const useAccountBalance = ({
  publicKey,
}: {
  publicKey: PublicKey
}): [number, AsyncRefreshVoidFunction] => {
  const [accountBalance, setAccountBalance] = useState(0)

  const connection = useConnection()

  const loadAccountBalance = useCallback(async () => {
    const accountBalance = await connection.getTokenAccountBalance(publicKey)

    const accountTokenAmount = accountBalance?.value?.uiAmount || 0
    setAccountBalance(accountTokenAmount)
  }, [])

  useEffect(() => {
    loadAccountBalance()
  }, [loadAccountBalance])

  return [accountBalance, loadAccountBalance]
}
