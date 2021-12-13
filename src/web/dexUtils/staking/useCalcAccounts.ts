import { Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { AsyncRefreshFunction, WalletAdapter } from '../types'
import { FarmingCalc, getCalcAccounts } from './getCalcAccountsForWallet'

export const useCalcAccounts = ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}): [FarmingCalc[], AsyncRefreshFunction] => {
  const [calcAccounts, setCalcAccounts] = useState<
    FarmingCalc[]
  >([])

  const loadCalcAccounts = useCallback(
    async () => {
      if (walletPublicKey) {
        const program = ProgramsMultiton.getProgramByAddress({ programAddress: STAKING_PROGRAM_ADDRESS, connection, wallet })
        const calc = await getCalcAccounts(program, walletPublicKey)

        setCalcAccounts(calc)
      }

      return true
    },
    [walletPublicKey?.toBase58()],
  )

  useEffect(() => {
    loadCalcAccounts()
  }, [walletPublicKey])

  return [calcAccounts, loadCalcAccounts]
}
