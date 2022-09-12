import React, { useState } from 'react'
import { compose } from 'recompose'

import { RewardsModal } from '@sb/components/Header/Rewards/RewardsModal'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { RIN_DECIMALS } from '@sb/compositions/StakingV2/config'
import { useFarmersAccountInfo, useFarmInfo } from '@sb/dexUtils/farming'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import { withPublicKey } from '@sb/hoc'

import { toMap } from '@core/collection'
import { getStakingInfo as getStakingInfoQuery } from '@core/graphql/queries/staking/getStakingInfo'
import { FARMING_V2_TOKEN, RIN_MINT } from '@core/solana'
import { removeDecimals } from '@core/utils/helpers'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'

import RinLogo from '@icons/rin_logo.png'

import { RinBalanceContainer, RinBalanceLogo, RinBalanceLabel } from './styles'
import { WithStakingInfo } from './types'

const RinBalanceContent = ({ children }) => {
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false)

  return (
    <>
      <RinBalanceContainer onClick={() => setIsRewardsModalOpen(true)}>
        <RinBalanceLogo src={RinLogo} />
        <RinBalanceLabel>{children}</RinBalanceLabel>
      </RinBalanceContainer>

      <RewardsModal
        open={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />
    </>
  )
}

const RinBalanceComponent: React.FC<WithStakingInfo> = (props) => {
  const {
    getStakingInfoQuery: { getStakingInfo },
  } = props

  const stakingDataMap = toMap(getStakingInfo?.farming || [], (farming) =>
    farming?.stakeMint.toString()
  )

  const { data: farms } = useFarmInfo(stakingDataMap)

  const { data: farmersInfo } = useFarmersAccountInfo()
  const farm = farms?.get(FARMING_V2_TOKEN)

  const farmer = farmersInfo?.get(farm?.publicKey.toString() || '')
  const totalStaked = farmer?.totalStaked || '0'
  const totalStakedWithDecimals = removeDecimals(
    totalStaked,
    farm?.stakeVaultDecimals || RIN_DECIMALS
  )
  const rinTokenData = useAssociatedTokenAccount(RIN_MINT)

  if (!rinTokenData) {
    return <RinBalanceContent>0.00</RinBalanceContent>
  }

  const { amount: rinBalance } = rinTokenData

  const totalRin = rinBalance + totalStakedWithDecimals

  return (
    <RinBalanceContent>{roundAndFormatNumber(totalRin, 2)}</RinBalanceContent>
  )
}

export const RinBalance: any = compose(
  withPublicKey,
  queryRendererHoc({
    query: getStakingInfoQuery,
    name: 'getStakingInfoQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      farmerPubkey: props.publicKey,
    }),
    withoutLoading: true,
    pollInterval: 60000,
  })
)(RinBalanceComponent)
