import React from 'react'
import { Theme } from '@sb/types/materialUI'

import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

import { ADAPTIVE_LOW_BLOCKS } from '../Staking.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { SvgIcon } from '@sb/components'

import RewardsIcon from '@icons/rewardsIcon.svg'
import poolIcon from '@icons/poolIcon.svg'
import longArrow from '@icons/LongArrow.svg'
import locksIcon from '@icons/lockIcon.svg'

export const BlockWithHints = ({
  isMobile,
  theme,
}: {
  isMobile: boolean
  theme: Theme
}) => {
  return (
    <RowContainer
      direction={isMobile ? 'column' : 'row'}
      justify={'space-between'}
    >
      <BlockTemplate style={ADAPTIVE_LOW_BLOCKS({ isMobile })} theme={theme}>
        <Text
          color={'#96999C'}
          fontFamily={'Avenir Next Demi'}
          fontSize={'1.8rem'}
          padding={'0 0 2rem 0'}
        >
          Staking Lockup:
        </Text>
        <Row
          style={{ position: 'relative', zIndex: 1 }}
          width="100%"
          justify={'flex-start'}
          align={'flex-end'}
        >
          <Text
            fontFamily={'Avenir Next Light'}
            fontSize={'1.5rem'}
            style={{
              width: '90%',
              lineHeight: '2.5rem',
            }}
          >
            Staking lockup lasts for one month from the date of deposit. You
            will not be able to withdraw your RIN until the lock is lifted.
          </Text>
        </Row>{' '}
        <SvgIcon
          style={{ position: 'absolute', bottom: '3rem', right: '3rem' }}
          src={locksIcon}
          width={'auto'}
          height={'8rem'}
        />{' '}
      </BlockTemplate>
      <BlockTemplate style={ADAPTIVE_LOW_BLOCKS({ isMobile })} theme={theme}>
        <Text
          color={'#96999C'}
          fontFamily={'Avenir Next Demi'}
          fontSize={'1.8rem'}
          padding={'0 0 2rem 0'}
        >
          Rewards:
        </Text>
        <Row
          style={{ position: 'relative', zIndex: 1 }}
          width="100%"
          justify={'flex-start'}
          align={'flex-end'}
        >
          <Text
            fontFamily={'Avenir Next Light'}
            fontSize={'1.5rem'}
            style={{
              width: '90%',
              lineHeight: '2.5rem',
            }}
          >
            The reward is recalculated daily for the duration of the staking
            period. But claim your you can reward after the first day of each
            following month.
          </Text>
        </Row>
        <SvgIcon
          style={{ position: 'absolute', bottom: '3rem', right: '3rem' }}
          src={RewardsIcon}
          width={'auto'}
          height={'8rem'}
        />
      </BlockTemplate>
      <BlockTemplate
        style={ADAPTIVE_LOW_BLOCKS({ isMobile, needBackground: true })}
        theme={theme}
      >
        <Text
          fontFamily={'Avenir Next Demi'}
          fontSize={'1.8rem'}
          padding={'0 0 2rem 0'}
        >
          Liquidity Mining:
        </Text>
        <Row
          style={{
            position: 'relative',
          }}
          width="100%"
          justify={'flex-start'}
          align={'flex-end'}
        >
          <Text
            fontFamily={'Avenir Next Light'}
            fontSize={'1.5rem'}
            style={{
              width: '80%',
              lineHeight: '2.5rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            You can also deposit your funds in one of the liquidity pools
            presented here, and farm RIN with your pool tokens staking.
            <SvgIcon
              src={longArrow}
              width={'3rem'}
              height={'1rem'}
              style={{ transform: 'rotate(180deg)' }}
            />
          </Text>
        </Row>{' '}
        <SvgIcon
          style={{ position: 'absolute', bottom: '3rem', right: '3rem' }}
          src={poolIcon}
          width={'auto'}
          height={'8rem'}
        />
      </BlockTemplate>
    </RowContainer>
  )
}
