import React from 'react'

import { RootRow } from '../Staking.styles'

import locksIcon from './assets/lockIcon.svg'
import poolIcon from './assets/poolIcon.svg'
import rewardsIcon from './assets/rewards.svg'

import greenBack from './assets/greenBack.png'

import { Cell } from '../../../components/Layout'
import { Text } from '../../../components/Typography'
import { Block, BlockContent, BlockSubtitle } from '../../../components/Block'
import { COLORS } from '../../../../variables'

export const BlockWithHints = () => {
  return (
    <RootRow>
      <Cell colLg={4}>
        <Block icon={locksIcon}>
          <BlockContent>
            <BlockSubtitle>Staking Lockup:</BlockSubtitle>
            <Text maxWidth="85%" size="sm">
              Staking lockup lasts for one month from the date of deposit. You
              will not be able to withdraw your RIN until the lock is lifted.
            </Text>
          </BlockContent>
        </Block>
      </Cell>
      <Cell colLg={4}>
        <Block icon={rewardsIcon}>
          <BlockContent>
            <BlockSubtitle>Rewards:</BlockSubtitle>
            <Text maxWidth="95%" size="sm">
              The reward is recalculated daily for the duration of the staking
              period. But claim your you can reward after the first day of each
              following month.
            </Text>
          </BlockContent>
        </Block>
      </Cell>
      <Cell colLg={4}>
        <Block backgroundImage={greenBack} icon={poolIcon}>
          <BlockContent>
            <BlockSubtitle color={COLORS.white}>Liquidity Mining:</BlockSubtitle>
            <Text maxWidth="85%" size="sm">
              You can also deposit your funds in one of the liquidity pools
              presented here, and farm RIN with your pool tokens staking. ⟶
            </Text>
          </BlockContent>
        </Block>
      </Cell>
    </RootRow>
  )
}
