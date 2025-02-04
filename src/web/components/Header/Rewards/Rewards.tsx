import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import dayjs from 'dayjs'
import React from 'react'

import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { STAKING_FARMING_TOKEN_DIVIDER } from '@sb/dexUtils/staking/config'
import { useAssociatedTokenAccount } from '@sb/dexUtils/token/hooks'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { RIN_MINT } from '@sb/dexUtils/utils'
import { useUserVestings } from '@sb/dexUtils/vesting'
import { useWallet } from '@sb/dexUtils/wallet'

import { withdrawVestingInstruction, walletAdapterToWallet } from '@core/solana'
import { stripByAmount } from '@core/utils/chartPageUtils'
import { estimateTime } from '@core/utils/dateUtils'

import Astronaut from '@icons/astronaut.webp'
import ClockIcon from '@icons/clock.svg'

import { Button } from '../../Button'
import { FlexBlock } from '../../Layout'
import SvgIcon from '../../SvgIcon'
import { DarkTooltip } from '../../TooltipCustom/Tooltip'
import { Text, InlineText } from '../../Typography'
import { ProgressBar, RewardsLink, Separator, Img } from './styles'
import { RewardsProps } from './types'

export const rinMint = new PublicKey(RIN_MINT)

export const AVAILABLE_TO_CLAIM_THRESHOLD = 0.1

const RewardsBlock: React.FC<RewardsProps> = (props) => {
  const {
    getDexTokensPricesQuery: { getDexTokensPrices } = {
      getDexTokensPrices: { prices: [] },
    },
  } = props

  const rinPrice =
    getDexTokensPrices?.prices?.find((p) => p.symbol === 'RIN')?.price || 0

  const { wallet } = useWallet()
  const connection = useConnection()
  const [data, reloadVesting] = useUserVestings()

  // console.debug('useUserVestings: data: ', data)

  const rinAccount = useAssociatedTokenAccount(RIN_MINT)
  if (!data) {
    return (
      <FlexBlock
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Img src={Astronaut} width="96px" alt="Aldronaut" />
        <br />
        <Text align="center">Loading...</Text>
      </FlexBlock>
    )
  }
  const rinVesting = data.find((v) => v.mint.equals(rinMint))

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

    const walletWithPk = walletAdapterToWallet(wallet)
    const [transaction] = await withdrawVestingInstruction({
      wallet: walletWithPk,
      connection,
      withdrawAccount: rinAccount
        ? new PublicKey(rinAccount.address)
        : undefined,
      vesting: rinVesting,
      amount,
    })

    const result = await signAndSendSingleTransaction({
      wallet: walletWithPk,
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
          <InlineText color="white1" weight={600}>
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
            <InlineText color="white1" weight={600}>
              Total vested:
            </InlineText>
          </div>
          <div>
            <InlineText color="white1" weight={700} size="lg">
              {stripByAmount(startBalance, 2)}{' '}
              <InlineText color="white1">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="green7">
              ${stripByAmount(rinPrice * startBalance, 2)}
            </InlineText>
          </div>
        </div>

        <ProgressBar $value={Math.round(timeProgress * 100)}>
          <InlineText weight={600}>
            {timeLeft.days ? `${timeLeft.days}d` : `${timeLeft.hours}h`} &nbsp;
          </InlineText>
          <InlineText color="white1">of vesting left</InlineText>{' '}
        </ProgressBar>
      </FlexBlock>
      <Separator />
      <FlexBlock justifyContent="space-between" alignItems="center">
        <div>
          <div>
            <InlineText color="white1" weight={600}>
              Available to claim:
            </InlineText>
          </div>
          <div>
            <InlineText color="white1" weight={700} size="lg">
              {stripByAmount(availableToClaim, 2)}{' '}
              <InlineText color="white1">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="green7">
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

// export const Rewards = queryRendererHoc({
//   query: getDexTokensPrices,
//   name: 'getDexTokensPricesQuery',
//   fetchPolicy: 'cache-and-network',
//   withoutLoading: true,
//   pollInterval: 60000,
// })(RewardsBlock)

export const Rewards = RewardsBlock
