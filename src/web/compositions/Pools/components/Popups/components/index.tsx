import React from 'react'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'
import { StyledInput, TokenContainer } from '../index.styles'
import MockedToken from '@icons/ccaiToken.svg'
import MockedToken2 from '@icons/solToken.svg'
import Arrow from '@icons/arrowBottom.svg'

export const InputWithCoins = ({}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={'#93A0B2'}>SOL</Text>
      </TokenContainer>
      <TokenContainer left={'2rem'} top={'6rem'}>
        <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
          200.00
        </Text>
      </TokenContainer>
      <TokenContainer left={'42rem'} top={'6rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <SvgIcon src={MockedToken} width={'20px'} height={'20px'} />
          <Text
            style={{ marginLeft: '0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            CCAI
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer left={'27rem'} top={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color={'#93A0B2'} fontSize={'1.2rem'}>
            Already in pool:{' '}
          </Text>
          &nbsp;
          <Text
            style={{ marginRight: '2rem' }}
            color={'#366CE5'}
            fontSize={'1.2rem'}
          >
            200.00
          </Text>
          &nbsp;
          <Text color={'#93A0B2'} fontSize={'1.2rem'}>
            &nbsp;Max:
          </Text>
          &nbsp;
          <Text color={'#366CE5'} fontSize={'1.2rem'}>
            {' '}
            200.00
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}

export const InputWithTotal = ({}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={'#93A0B2'}>Total</Text>
      </TokenContainer>
      <TokenContainer left={'2rem'} top={'6rem'}>
        <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
          $2000.00{' '}
        </Text>
      </TokenContainer>
      <TokenContainer left={'45rem'} top={'5rem'}>
        <Row>
          <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
            USD
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}

export const InputWithSelector = ({}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={'#93A0B2'}>SOL</Text>
      </TokenContainer>
      <TokenContainer left={'2rem'} top={'6rem'}>
        <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
          200.00
        </Text>
      </TokenContainer>
      <TokenContainer
        style={{ right: '2rem', cursor: 'pointer' }}
        left={'auto'}
        top={'6rem'}
      >
        <Row style={{ flexWrap: 'nowrap' }}>
          <SvgIcon src={MockedToken} width={'18px'} height={'18px'} />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            CCAI
          </Text>
          <SvgIcon src={Arrow} width={'10px'} height={'10px'} />
        </Row>
      </TokenContainer>
      <TokenContainer left={'42rem'} top={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color={'#93A0B2'} fontSize={'1.2rem'}>
            &nbsp;Max:
          </Text>
          &nbsp;
          <Text color={'#366CE5'} fontSize={'1.2rem'}>
            {' '}
            200.00
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}

export const SimpleInput = ({}) => {
  return (
    <Row style={{ position: 'relative' }} padding={'2rem 0'} width={'100%'}>
      <StyledInput />
      <TokenContainer left={'2rem'} top={'3rem'}>
        <Text color={'#93A0B2'}>SOL</Text>
      </TokenContainer>
      <TokenContainer left={'2rem'} top={'6rem'}>
        <Text fontSize={'2rem'} fontFamily={'Avenir Next Demi'}>
          200.00
        </Text>
      </TokenContainer>
      <TokenContainer
        style={{ right: '2rem', cursor: 'pointer' }}
        left={'auto'}
        top={'6rem'}
      >
        <Row style={{ flexWrap: 'nowrap' }}>
          <SvgIcon src={MockedToken} width={'18px'} height={'18px'} />
          <Text
            style={{ margin: '0 0.5rem' }}
            fontSize={'2rem'}
            fontFamily={'Avenir Next Demi'}
          >
            CCAI
          </Text>
        </Row>
      </TokenContainer>
      <TokenContainer left={'42rem'} top={'3rem'}>
        <Row style={{ flexWrap: 'nowrap' }}>
          <Text color={'#93A0B2'} fontSize={'1.2rem'}>
            &nbsp;Max:
          </Text>
          &nbsp;
          <Text color={'#366CE5'} fontSize={'1.2rem'}>
            {' '}
            200.00
          </Text>
        </Row>
      </TokenContainer>
    </Row>
  )
}
