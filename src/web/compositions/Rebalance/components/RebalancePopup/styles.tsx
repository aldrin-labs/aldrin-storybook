import React from 'react'
import styled from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'

import MockedToken from '@icons/ccaiToken.svg'
import MockedToken2 from '@icons/solToken.svg'
import Arrow from '@icons/smallBlueArrow.svg'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'

const BlockForIcons = styled(Row)`
  padding: 1rem 2rem;
  justify-content: space-around;
  background: #222429;
  border: 1px solid #383b45;
  box-sizing: border-box;
  box-shadow: 16px 16px 12px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
`
export const Stroke = styled(RowContainer)`
  justify-content: space-between;
  border-bottom: 0.1rem solid #383b45;
  padding: 1.5rem 2rem;
`

export const BlockForCoins = ({}) => {
  return (
    <BlockForIcons>
      <SvgIcon
        width={'2.5rem'}
        height={'2.5rem'}
        style={{ margin: '0 1rem 0 0' }}
        src={MockedToken2}
      />{' '}
      <Text
        fontSize={'1.6rem'}
        fontFamily={'Avenir Next Medium'}
        style={{ margin: '0 1rem 0 0' }}
      >
        {' '}
        CCAI
      </Text>
      <SvgIcon src={Arrow} />
      <SvgIcon
        width={'2.5rem'}
        height={'2.5rem'}
        style={{ margin: '0  0 0 1rem' }}
        src={MockedToken}
      />{' '}
      <Text
        fontSize={'1.6rem'}
        fontFamily={'Avenir Next Medium'}
        style={{ margin: '0 0 0 1rem' }}
      >
        SOL
      </Text>
    </BlockForIcons>
  )
}
