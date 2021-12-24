import React from 'react'

import RedBox from '@icons/redBox.png'
import GreenBox from '@icons/greenBox.png'
import WhiteArrow from '@icons/longWhiteArrow.svg'

import { SvgIcon } from '@sb/components'
import { InfoBox } from '../../styles'
import { StyledLink, Text } from '@sb/compositions/Addressbook'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import StakingCard from './StakingCard'

export const Cards = () => {
  return (
    <Row justify={'space-between'} width={'50rem'} margin={'3rem 0 0 0'}>
      <StakingCard />
      <InfoBox image={GreenBox}>
        <Text
          fontSize={'1.7rem'}
          fontFamily={'Avenir Next Bold'}
          whiteSpace="nowrap"
        >
          Add Liquidity
        </Text>
        <Text
          fontSize={'1.4rem'}
          fontFamily={'Avenir Next Light'}
          whiteSpace="nowrap"
        >
          and farm rewards!
        </Text>
        <StyledLink
          to={'/pools'}
          needHover
          fontSize={'1.7rem'}
          fontFamily={'Avenir Next Bold'}
          whiteSpace="nowrap"
        >
          View Pools{' '}
          <SvgIcon width={'3rem'} height={'0.75rem'} src={WhiteArrow} />
        </StyledLink>
      </InfoBox>
      <InfoBox image={RedBox}>
        <Text
          fontSize={'1.7rem'}
          fontFamily={'Avenir Next Bold'}
          whiteSpace="nowrap"
        >
          250+ Markets
        </Text>
        <Text
          fontSize={'1.4rem'}
          fontFamily={'Avenir Next Light'}
          whiteSpace="nowrap"
        >
          on orderbook DEX!
        </Text>
        <StyledLink
          to={'/chart'}
          needHover
          fontSize={'1.7rem'}
          fontFamily={'Avenir Next Bold'}
          whiteSpace="nowrap"
        >
          Trade Now{' '}
          <SvgIcon width={'3rem'} height={'0.75rem'} src={WhiteArrow} />
        </StyledLink>
      </InfoBox>
    </Row>
  )
}
