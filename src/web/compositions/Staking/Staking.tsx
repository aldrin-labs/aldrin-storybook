import React, { useState } from 'react'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/core'
import { Theme } from '@sb/types/materialUI'
import useMobileSize from '@webhooks/useMobileSize'

import { RowContainer, Row } from '../AnalyticsRoute/index.styles'
import { BlockTemplate } from '../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import RewardsIcon from '@icons/rewardsIcon.svg'
import poolIcon from '@icons/poolIcon.svg'
import RedArrow from '@icons/redTriangle.svg'
import GreenArrow from '@icons/greenTriangle.svg'
import lightBird from '@icons/lightBird.svg'
import longArrow from '@icons/LongArrow.svg'
import locksIcon from '@icons/lockIcon.svg'
import { SvgIcon } from '@sb/components'
import {
  ADAPTIVE_LOW_BLOCKS,
  ADAPTIVE_UPPER_BLOCKS,
  CONTAINER,
  MAIN_BLOCK,
  RoundInput,
  StyledTextDiv,
} from './Staking.styles'
import { BorderButton } from '../Pools/components/Tables/index.styles'
import { ImagesPath } from '../Chart/components/Inputs/Inputs.utils'
import { RoundButton } from './Staking.styles'
import { TextButton } from '../Rebalance/Rebalance.styles'
import { RoundInputWithTokenName } from './components/Input'

const Staking = ({ theme }: { theme: Theme }) => {
  const isMobile = useMobileSize()
  const isPriceIncreasing = true
  const [isBalancesShowing, setIsBalancesShowing] = useState(true)
  return (
    <RowContainer style={CONTAINER(isMobile)}>
      <RowContainer
        direction={isMobile ? 'column' : 'row'}
        height={isMobile ? 'auto' : '65%'}
        justify={'space-between'}
      >
        <BlockTemplate
          direction={'column'}
          theme={theme}
          style={MAIN_BLOCK(isMobile)}
        >
          <RowContainer
            height={'33%'}
            justify={'space-between'}
            padding="3rem"
            style={{ borderBottom: '0.2rem solid #383B45' }}
          >
            <Row
              width={'60%'}
              height={'100%'}
              direction={'column'}
              justify={'space-between'}
            >
              <RowContainer justify={'space-between'}>
                <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                  Your RIN Staking{' '}
                </Text>
                <Row>
                  <SvgIcon
                    src={
                      isBalancesShowing ? ImagesPath.eye : ImagesPath.closedEye
                    }
                    width={'2.7rem'}
                    height={'auto'}
                  />
                </Row>
              </RowContainer>
              <StyledTextDiv>
                GHvybfUhsKxmWvrVZ5KDdWQGPCYSZoRKefWYyVyRHGYc
              </StyledTextDiv>
            </Row>
            <Row
              width={'30%'}
              height={'100%'}
              direction={'column'}
              justify={'space-between'}
              align={'flex-end'}
            >
              <Text
                color={'#96999C'}
                fontFamily={'Avenir Next Demi'}
                fontSize={'1.8rem'}
                style={{ lineHeight: '4rem' }}
              >
                Available in wallet:
              </Text>{' '}
              <Text
                color={'#96999C'}
                fontFamily={'Avenir Next Demi'}
                fontSize={'1.8rem'}
              >
                <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>0</span>{' '}
                RIN
              </Text>
            </Row>
          </RowContainer>{' '}
          <RowContainer padding="3rem" height={'67%'}>
            <RowContainer justify={'space-between'} height={'50%'}>
              <BlockTemplate
                direction={'column'}
                align="flex-start"
                justify={'space-between'}
                theme={theme}
                padding="3rem"
                background="#383b45"
                width={'27%'}
              >
                <Text
                  color={'#96999C'}
                  fontFamily={'Avenir Next Demi'}
                  fontSize={'1.8rem'}
                  padding={'0 0 2rem 0'}
                >
                  Total Staked:
                </Text>{' '}
                <Text
                  color={'#96999C'}
                  fontFamily={'Avenir Next Demi'}
                  fontSize={'1.8rem'}
                >
                  <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
                    1,255
                  </span>{' '}
                  RIN
                </Text>
              </BlockTemplate>
              <BlockTemplate
                width={'70%'}
                padding="3rem"
                background="#383b45"
                theme={theme}
                justify={'space-between'}
              >
                <Row
                  direction={'column'}
                  align="flex-start"
                  justify={'space-between'}
                >
                  <Text
                    color={'#96999C'}
                    fontFamily={'Avenir Next Demi'}
                    fontSize={'1.8rem'}
                    padding={'0 0 2rem 0'}
                  >
                    Total Staked:
                  </Text>{' '}
                  <Text
                    color={'#96999C'}
                    fontFamily={'Avenir Next Demi'}
                    fontSize={'1.8rem'}
                  >
                    <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
                      1,255
                    </span>{' '}
                    RIN
                  </Text>
                </Row>
                <Row
                  direction={'column'}
                  align="flex-start"
                  justify={'space-between'}
                >
                  <Text
                    color={'#96999C'}
                    fontFamily={'Avenir Next Demi'}
                    fontSize={'1.8rem'}
                    padding={'0 0 2rem 0'}
                  >
                    Total Staked:
                  </Text>{' '}
                  <Text
                    color={'#96999C'}
                    fontFamily={'Avenir Next Demi'}
                    fontSize={'1.8rem'}
                  >
                    <span style={{ color: '#fbf2f2', fontSize: '2.7rem' }}>
                      1,255
                    </span>{' '}
                    RIN
                  </Text>
                </Row>
                <Row
                  direction={'column'}
                  align="flex-end"
                  justify={'space-between'}
                >
                  <RoundButton needImage style={{ margin: '0 0 1.5rem 0' }}>
                    Claim
                  </RoundButton>
                  <TextButton style={{ margin: '0 auto' }} color="#53DF11">
                    Restake
                  </TextButton>
                </Row>
              </BlockTemplate>{' '}
            </RowContainer>
            <RowContainer justify={'space-between'}>
              <RoundInputWithTokenName text={'RIN'} />
              <RoundButton needImage>Stake</RoundButton>
              <RoundButton>Unstake All</RoundButton>
            </RowContainer>
          </RowContainer>{' '}
        </BlockTemplate>
        <Row
          direction={'column'}
          justify={'space-between'}
          width={isMobile ? '100%' : '49%'}
          height={isMobile ? 'auto' : '100%'}
        >
          <RowContainer
            direction={isMobile ? 'column' : 'row'}
            justify={'space-between'}
            height={isMobile ? 'auto' : '47%'}
          >
            <BlockTemplate
              style={ADAPTIVE_UPPER_BLOCKS({ isMobile })}
              theme={theme}
            >
              <RowContainer
                direction={'column'}
                justify={'space-between'}
                align={'flex-start'}
                height={'100%'}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                  Total Staked
                </Text>
                <Text fontFamily={'Avenir Next Bold'} fontSize={'3.5rem'}>
                  <span style={{ color: '#53DF11' }}>10,000,000</span> RIN
                </Text>
                <RowContainer justify={'flex-start'} align={'flex-end'}>
                  <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                    $1.53b
                  </Text>
                </RowContainer>
              </RowContainer>
              <SvgIcon
                style={{ position: 'absolute', bottom: '5rem', right: '3rem' }}
                src={locksIcon}
                width={'11rem'}
                height={'auto'}
              />
            </BlockTemplate>
            <BlockTemplate
              style={ADAPTIVE_UPPER_BLOCKS({ isMobile, needBackground: true })}
              theme={theme}
            >
              <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                Estimated Rewards
              </Text>
              <Text fontFamily={'Avenir Next Bold'} fontSize={'4rem'}>
                193%
              </Text>
              <RowContainer justify={'space-between'} align={'flex-end'}>
                <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                  APY
                </Text>
                <BorderButton borderColor={'#fbf2f2'} borderRadius="3rem">
                  Share
                  <SvgIcon src={lightBird} style={{ marginLeft: '1rem' }} />
                </BorderButton>
              </RowContainer>
            </BlockTemplate>
          </RowContainer>
          <BlockTemplate
            theme={theme}
            width={'100%'}
            height={isMobile ? '30rem' : '47%'}
            style={{ margin: isMobile ? '2rem 0' : '0', padding: '3rem' }}
            direction="column"
            align="flex-start"
            justify="space-between"
          >
            <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
              RIN Stats
            </Text>
            <RowContainer justify="space-between">
              <Row direction="column" width="30%" align="flex-start">
                <Text fontSize="1.5rem" padding="0 0 2rem 0">
                  Price
                </Text>
                <Row>
                  <Text
                    fontFamily={'Avenir Next Bold'}
                    fontSize={'2.3rem'}
                    padding={'0 1rem 0 0'}
                  >
                    $6.12
                  </Text>{' '}
                  <SvgIcon
                    src={isPriceIncreasing ? GreenArrow : RedArrow}
                    width={'0.7rem'}
                    height="auto"
                  />
                  <Text
                    fontFamily={'Avenir Next Medium'}
                    fontSize={'1.5rem'}
                    color={isPriceIncreasing ? '#53DF11' : '#F69894'}
                  >
                    {' '}
                    125.00%
                  </Text>
                </Row>
              </Row>
              <Row direction="column" width="30%" align="flex-start">
                <Text fontSize="1.5rem" padding="0 0 2rem 0">
                  Circulating Supply
                </Text>
                <Text fontFamily={'Avenir Next Bold'} fontSize={'2.3rem'}>
                  16,122,523 RIN
                </Text>
              </Row>
              <Row direction="column" width="30%" align="flex-start">
                <Text fontSize="1.5rem" padding="0 0 2rem 0">
                  Daily Rewards{' '}
                </Text>
                <Text fontFamily={'Avenir Next Bold'} fontSize={'2.3rem'}>
                  112,252 RIN{' '}
                </Text>
              </Row>
            </RowContainer>
          </BlockTemplate>
        </Row>
      </RowContainer>
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
    </RowContainer>
  )
}

const Wrapper = compose(withTheme())(Staking)

export { Wrapper as Staking }
