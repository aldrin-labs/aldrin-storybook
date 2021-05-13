import React from 'react'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { SearchInput, IconsContainer, TokenIcon } from '../index.styles'

import MockedToken from '@icons/ccaiToken.svg'
import MockedToken2 from '@icons/solToken.svg'
import Loop from '@icons/loop.svg'

export const SeachInputWithLoop = ({
  placeholder,
}: {
  placeholder: String
}) => {
  return (
    <Row style={{ position: 'relative' }} width={'40rem'}>
      <SearchInput placeholder={placeholder} />
      <SvgIcon src={Loop} style={{ position: 'absolute', right: '2rem' }} />
    </Row>
  )
}

export const TokenIconsContainer = ({}) => {
  return (
    <Row justify={'end'}>
      <IconsContainer>
        <TokenIcon
          zIndex={'0'}
          left={'0'}
          style={{ transform: 'translateX(70%)' }}
        >
          <SvgIcon width={'27px'} height={'27px'} src={MockedToken} />
        </TokenIcon>
        <TokenIcon left={'0'} zIndex={'1'}>
          <SvgIcon width={'27px'} height={'27px'} src={MockedToken2} />
        </TokenIcon>
      </IconsContainer>{' '}
      <Text style={{ marginLeft: '2rem' }} fontFamily={'Avenir Next Demi'}>
        SOL/CCAI
      </Text>{' '}
    </Row>
  )
}
