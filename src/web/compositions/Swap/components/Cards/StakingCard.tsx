import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getBuyBackAmountForPeriod } from '@core/graphql/queries/pools/getBuyBackAmountForPeriod'
import { getStakingPoolInfo } from '@core/graphql/queries/staking/getStakingPool'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { dayDuration } from '@core/utils/dateUtils'
import { getRandomInt } from '@core/utils/helpers'
import {
  DAYS_TO_CHECK_BUY_BACK,
  STAKING_FARMING_TOKEN_DIVIDER,
} from '@sb/dexUtils/staking/config'
import { getCurrentFarmingStateFromAll } from '@sb/dexUtils/staking/getCurrentFarmingStateFromAll'
import { StakingPool } from '@sb/dexUtils/staking/types'
import { useAccountBalance } from '@sb/dexUtils/staking/useAccountBalance'
import { PublicKey } from '@solana/web3.js'
import dayjs from 'dayjs'
import React from 'react'
import { compose } from 'recompose'

import PinkBox from '@icons/pinkBox.png'
import WhiteArrow from '@icons/longWhiteArrow.svg'

import { SvgIcon } from '@sb/components'
import { StyledLink, Text } from '@sb/compositions/Addressbook'
import { InfoBox } from '../../styles'

interface StakingCardParams {
  getStakingPoolInfoQuery: { getStakingPoolInfo: StakingPool }
  getBuyBackAmountForPeriodQuery: { getBuyBackAmountForPeriod: number }
}

const StakingCard = (props: StakingCardParams) => {
  const { getStakingPoolInfoQuery, getBuyBackAmountForPeriodQuery } = props

  const stakingPool = getStakingPoolInfoQuery.getStakingPoolInfo || {}
  const allStakingFarmingStates = stakingPool.farming || []

  const [totalStaked] = useAccountBalance({
    publicKey: new PublicKey(stakingPool.stakingVault),
  })

  const currentFarmingState = getCurrentFarmingStateFromAll(
    allStakingFarmingStates
  )

  const buyBackAmount = getBuyBackAmountForPeriodQuery.getBuyBackAmountForPeriod

  const buyBackDailyRewards = buyBackAmount / DAYS_TO_CHECK_BUY_BACK

  const buyBackAPR = (buyBackDailyRewards / totalStaked) * 365 * 100

  const treasuryDailyRewards =
    (currentFarmingState.tokensPerPeriod /
      10 ** currentFarmingState.farmingTokenMintDecimals) *
    (dayDuration / currentFarmingState.periodLength)

  const treasuryAPR = (treasuryDailyRewards / totalStaked) * 365 * 100

  const formattedAPR =
    isFinite(buyBackAPR) && isFinite(treasuryAPR)
      ? stripByAmount(buyBackAPR + treasuryAPR, 2)
      : '--'

  return (
    <InfoBox image={PinkBox}>
      <Text
        fontSize={'1.7rem'}
        fontFamily={'Avenir Next Bold'}
        whiteSpace="nowrap"
      >
        Stake RIN
      </Text>
      <Text
        fontSize={'1.4rem'}
        fontFamily={'Avenir Next Bold'}
        whiteSpace="nowrap"
      >
        <span style={{ fontFamily: 'Avenir Next Light' }}>with</span>{' '}
        {formattedAPR}% APR!
      </Text>
      <StyledLink
        to={'/staking'}
        needHover
        fontSize={'1.7rem'}
        fontFamily={'Avenir Next Bold'}
        whiteSpace="nowrap"
      >
        Stake Now <SvgIcon width={'3rem'} height={'0.75rem'} src={WhiteArrow} />
      </StyledLink>
    </InfoBox>
  )
}

export default compose(
  queryRendererHoc({
    query: getStakingPoolInfo,
    name: 'getStakingPoolInfoQuery',
    fetchPolicy: 'cache-and-network',
  }),
  queryRendererHoc({
    name: 'getBuyBackAmountForPeriodQuery',
    query: getBuyBackAmountForPeriod,
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60000 * getRandomInt(5, 10),
    variables: () => {
      const endOfDay = dayjs()
        .endOf('day')
        .unix()

      return {
        timestampFrom: endOfDay - dayDuration * DAYS_TO_CHECK_BUY_BACK,
        timestampTo: endOfDay,
      }
    },
  })
)(StakingCard)
