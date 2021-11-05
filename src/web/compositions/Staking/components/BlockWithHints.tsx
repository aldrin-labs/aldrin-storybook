import React from 'react'

import { Cell } from '@sb/components/Layout'
import { Text } from '@sb/components/Typography'
import { Block, BlockContent, BlockSubtitle } from '@sb/components/Block'
import { COLORS } from '@variables/variables'
import { RootRow, StyledLink } from '../styles'

import locksIcon from './assets/lockIcon.svg'
import poolIcon from './assets/poolIcon.svg'
import rewardsIcon from './assets/rewards.svg'

import greenBack from './assets/greenBack.png'

export const BlockWithHints = () => {
  return (
    <RootRow>
      <Cell colLg={4}>
        <Block icon={locksIcon}>
          <BlockContent>
            <BlockSubtitle>Staking Lockup:</BlockSubtitle>
            <Text maxWidth="85%" size="sm">
              Staking lockup lasts for <strong>one hour</strong> from the time
              of deposit. You will not be able to withdraw your RIN until the
              lock is lifted.{' '}
            </Text>
          </BlockContent>
        </Block>
      </Cell>
      <Cell colLg={4}>
        <Block icon={rewardsIcon}>
          <BlockContent>
            <BlockSubtitle>Rewards:</BlockSubtitle>
            <Text maxWidth="95%" size="sm">
              RIN staking rewards are calculated hourly. These are then
              accumulated and{' '}
              <strong>
                paid out on the 27th of each month along with trading fee
                revenue.
              </strong>
            </Text>
          </BlockContent>
        </Block>
      </Cell>
      <Cell colLg={4}>
        <Block backgroundImage={greenBack} icon={poolIcon}>
          <BlockContent>
            <BlockSubtitle color={COLORS.white}>
              Liquidity Mining:
            </BlockSubtitle>
            <StyledLink to="/pools">
              <Text maxWidth="80%" size="sm">
                You can also deposit your funds in one of the liquidity pools
                presented here, and farm RIN by staking the LP tokens you
                receive from providing liquidity. ⟶
              </Text>
            </StyledLink>
          </BlockContent>
        </Block>
      </Cell>
    </RootRow>
  )
}
