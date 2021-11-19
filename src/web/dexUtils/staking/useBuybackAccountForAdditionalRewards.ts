import { Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { BUY_BACK_RIN_ACCOUNT_ADDRESS } from './config'

export const useBuybackAccountForAdditionalRewards = ({
  connection,
}: {
  connection: Connection
}) => {
  const [accountBalance, setAccountBalance] = useState(0)

  const loadAccountBalance = useCallback(async () => {
    const accountBalance = await connection.getTokenAccountBalance(
      new PublicKey(BUY_BACK_RIN_ACCOUNT_ADDRESS)
    )

    const accountTokenAmount = accountBalance?.value?.uiAmount || 0
    setAccountBalance(accountTokenAmount)
  }, [])

  useEffect(() => {
    loadAccountBalance()
  }, [loadAccountBalance])

  return [accountBalance, loadAccountBalance]
}
