import React from 'react'

import { Cell } from '@sb/components/Layout'
import { Text } from '@sb/components/Typography'
import { Block, BlockContent, BlockSubtitle } from '@sb/components/Block'
import { COLORS } from '@variables/variables'
import { RootRow, StyledLink } from '../styles'

import locksIcon from './assets/lockIcon.svg'
import poolIcon from './assets/poolIcon.svg'
import rewardsIcon from './assets/rewards.svg'
import InfoIcon from '@icons/inform.svg'

import greenBack from './assets/greenBack.png'
import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

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
            <RowContainer margin={'0 0 1rem'} justify={'flex-start'}>
              <BlockSubtitle margin={'0'}>Rewards: </BlockSubtitle>
              <DarkTooltip
                title={
                  <p>
                   Staking rewards are paid <strong>every 27th of the month</strong> based on RIN weekly buy-backs 
                   on 1/6th of AMM fees. Estimated rewards are updated <strong> hourly based on treasury 
                   rewards</strong> and <strong>weekly based on RIN buyback.</strong> 
                  </p>
                }
              >
                <div>
                  <SvgIcon
                    src={InfoIcon}
                    width={'1.5rem'}
                    height={'2.5rem'}
                    style={{ marginLeft: '0.75rem' }}
                  />
                </div>
              </DarkTooltip>
            </RowContainer>

            <Text maxWidth="95%" size="sm">
              Staking rewards are paid <strong>every 27th of the month</strong>.
              Estimated rewards may be slightly different from the actual number
              received on the 27th.
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
