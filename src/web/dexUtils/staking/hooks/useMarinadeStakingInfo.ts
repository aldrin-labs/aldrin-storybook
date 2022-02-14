import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { useMemo } from 'react'
import useSWR from 'swr'

import { useConnection } from '../../connection'

export const useMarinadeStakingInfo = () => {
  const connection = useConnection()

  const marinade = useMemo(
    () => new Marinade(new MarinadeConfig({ connection })),
    []
  )

  const fetcher = async () => {
    const marinadeState = await marinade.getMarinadeState()

    const {
      state,
      lpMint,
      mSolMint,
      mSolMintAddress,
      mSolPrice,
      treasuryMsolAccount,
      rewardsCommissionPercent,
    } = marinadeState

    const mSolMintClient = mSolMint.mintClient()
    const mSolMintSupply = await mSolMint.totalSupply()
    const validatorRecords = await marinadeState.getValidatorRecords()
    const epochInfo = await marinadeState.epochInfo()
    console.log('epochInfo: ', epochInfo)
    // console.log(
    //   'validatorRecords: ',
    //   validatorRecords.validatorRecords.filter((vr) => vr.score > 0)
    // )
    return {
      mSolPrice,
      mSolMintSupply,
      epochInfo,
    }
  }

  return useSWR('marinade-pool-full-info', fetcher, {
    refreshInterval: 60_1000,
  })
}
