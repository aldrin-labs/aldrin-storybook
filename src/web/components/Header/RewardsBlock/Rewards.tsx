import React, { useState } from 'react'

import ClockIcon from '@icons/clock.svg'

import { Button } from '../../Button'
import { FlexBlock } from '../../Layout'
import SvgIcon from '../../SvgIcon'
import { Text, InlineText } from '../../Typography'
import Helmet from './helmet.png'
import { ProgressBar, Separator } from './styles'

export const Rewards = () => {
  const [hasRewards] = useState(false)
  if (!hasRewards) {
    return (
      <FlexBlock
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <img src={Helmet} alt="Aldronaut" />
        <br />
        <Text align="center">
          Sorry, your wallet is not eligible for the current airdrop. But don't
          despair, you can farm rewards for staking your tokens or providing
          liquidity to Aldrin AMM.
        </Text>
      </FlexBlock>
    )
  }
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

          <SvgIcon src={ClockIcon} width="20px" />
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
              30 <InlineText color="hint">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="hint">$ 100.42</InlineText>
          </div>
        </div>

        <ProgressBar value={10}>
          <InlineText weight={600}>84d &nbsp;</InlineText>
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
              30 <InlineText color="hint">RIN</InlineText>
            </InlineText>
          </div>
          <div>
            <InlineText color="hint">$ 100.42</InlineText>
          </div>
        </div>
        <div>
          <Button>Claim</Button>
        </div>
      </FlexBlock>
    </>
  )
}
