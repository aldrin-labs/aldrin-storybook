import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import dayjs from 'dayjs'
import React from 'react'

import { useConnection } from '@sb/dexUtils/connection'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { RIN_MINT } from '@sb/dexUtils/utils'
import {
  useUserVestings,
  withrawVestingInstruction,
} from '@sb/dexUtils/vesting'
import { useWallet } from '@sb/dexUtils/wallet'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { estimateTime } from '@core/utils/dateUtils'

import Astronaut from '@icons/astronaut.webp'
import ClockIcon from '@icons/clock.svg'

import { notify } from '../../../dexUtils/notifications'
import { Button } from '../../Button'
import { FlexBlock } from '../../Layout'
import SvgIcon from '../../SvgIcon'
import { DarkTooltip } from '../../TooltipCustom/Tooltip'
import { Text, InlineText } from '../../Typography'
import { AVAILABLE_TO_CLAIM_THRESHOLD, rinMint } from './config'
import { ProgressBar, RewardsLink, Separator, Img } from './styles'
import { RewardsProps } from './types'

const RewardsBlock: React.FC<RewardsProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices: prices = [] },
  } = props

  const rinPrice = prices.find((p) => p.symbol === 'RIN')?.price || 0

  const { wallet } = useWallet()
  const connection = useConnection()
  const [data, reloadVesting] = useUserVestings()

  const rinVesting = data.find((v) => v.mint.equals(rinMint))
  const rinAccount = useAssociatedTokenAccount(RIN_MINT)

  if (!rinVesting) {
    return (
      <FlexBlock
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Img src={Astronaut} width="96px" alt="Aldronaut" />
        <br />
        <Text align="center">
          Sorry, your wallet is not eligible for the current airdrop. But don't
          despair, you can farm rewards for{' '}
          <RewardsLink to="/staking">staking</RewardsLink> your tokens or{' '}
          <RewardsLink to="/pools">providing liquidity</RewardsLink> to Aldrin
          AMM.
        </Text>
      </FlexBlock>
    )
  }
  const startBalance =
    parseFloat(rinVesting.startBalance.toString()) /
    STAKING_FARMING_TOKEN_DIVIDER

  const notClaimed =
    parseFloat(rinVesting.outstanding.toString()) /
    STAKING_FARMING_TOKEN_DIVIDER

  const claimed = startBalance - notClaimed

  const duration = rinVesting.endTs - rinVesting.startTs

  const now = Date.now() / 1000
  const timePassed = Math.max(0, now - rinVesting.startTs)
  const timeProgress = Math.min(timePassed / duration, 1)
  const secondsLeft = rinVesting.endTs - now
  const timeLeft = estimateTime(Math.max(secondsLeft, 0))

  const periodDuration = duration / rinVesting.periodCount
  const tokensPerPeriod = startBalance / rinVesting.periodCount
  const periodsPassed = Math.min(
    rinVesting.periodCount,
    Math.floor(timePassed / periodDuration)
  )

  const availableToClaimTotal = periodsPassed * tokensPerPeriod
  const availableToClaim = availableToClaimTotal - claimed

  const claim = async () => {
    const amount = new BN(
      (availableToClaim * STAKING_FARMING_TOKEN_DIVIDER).toFixed(0)
    )

    const [transaction] = await withrawVestingInstruction({
      wallet,
      connection,
      withdrawAccount: rinAccount
        ? new PublicKey(rinAccount.address)
        : undefined,
      vesting: rinVesting,
      amount,
    })

    const result = await signAndSendSingleTransaction({
      wallet,
      connection,
      transaction,
    })

    await reloadVesting()

    notify({
      message: result === 'success' ? 'Claimed succesfully' : 'Claim failed',
    })
  }

  const isClaimable = availableToClaim >= AVAILABLE_TO_CLAIM_THRESHOLD

  const unstakeTooltipText =
    secondsLeft > 0
      ? `Locked until ${dayjs
          .unix(rinVesting.endTs)
          .format('HH:mm:ss MMM DD, YYYY')}`
      : null
  return (
    <>
      <FlexBlock justifyContent="space-between" alignItems="center">
        <InlineText weight={700} size="lg">
          RIN
        </InlineText>
        <FlexBlock alignItems="center">
          <InlineText color="hint" weight={600}>
            Vested&nbsp;
          </InlineText>

          <DarkTooltip title={unstakeTooltipText}>
            <span>
              <SvgIcon src={ClockIcon} width="20px" />
            </span>
          </DarkTooltip>
        </FlexBlock>
      </FlexBlock>
      <Separator />
      <FlexBlock justifyContent="space-between" alignItems="center">
        <div>
          <div>
            <InlineText color="hint" weight={600}>
              Total vested:
            </InlineText>
          </div>
          <div>
            <InlineText weight={700} size="lg">
              {stripByAmount(startBalance, 2)}{' '}
              <InlineText color="hint">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="hint">
              ${stripByAmount(rinPrice * startBalance, 2)}
            </InlineText>
          </div>
        </div>

        <ProgressBar $value={timeProgress * 100}>
          <InlineText weight={600}>
            {timeLeft.days ? `${timeLeft.days}d` : `${timeLeft.hours}h`} &nbsp;
          </InlineText>
          <InlineText color="hint">of vesting left</InlineText>{' '}
        </ProgressBar>
      </FlexBlock>
      <Separator />
      <FlexBlock justifyContent="space-between" alignItems="center">
        <div>
          <div>
            <InlineText color="hint" weight={600}>
              Available to claim:
            </InlineText>
          </div>
          <div>
            <InlineText weight={700} size="lg">
              {stripByAmount(availableToClaim, 2)}{' '}
              <InlineText color="hint">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="hint">
              ${stripByAmount(rinPrice * availableToClaim, 2)}
            </InlineText>
          </div>
        </div>
        <div>
          <Button disabled={!isClaimable} onClick={claim}>
            Claim
          </Button>
        </div>
      </FlexBlock>
    </>
  )
}

export const Rewards = queryRendererHoc({
  query: getDexTokensPrices,
  name: 'getDexTokensPricesQuery',
  fetchPolicy: 'cache-and-network',
  withoutLoading: true,
  pollInterval: 60000,
})(RewardsBlock)
