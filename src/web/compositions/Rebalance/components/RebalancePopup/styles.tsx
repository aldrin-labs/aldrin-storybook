import React from 'react'
import styled from 'styled-components'

import SvgIcon from '@sb/components/SvgIcon'

import MockedToken from '@icons/ccaiToken.svg'
import MockedToken2 from '@icons/solToken.svg'
import Arrow from '@icons/smallBlueArrow.svg'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'


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

export const BlockForCoins = ({ symbol }: { symbol: string }) => {
  const [base, quote] = symbol.split('_')

  return (
    <BlockForIcons>
      <TokenIcon
        mint={getTokenMintAddressByName(base)}
        width={'2.5rem'}
        height={'2.5rem'}
        margin={'0 1rem 0 0'}
      />
      <Text
        fontSize={'1.6rem'}
        fontFamily={'Avenir Next Medium'}
        style={{ margin: '0 1rem 0 0' }}
      >
        {base}
      </Text>
      <SvgIcon src={Arrow} />
      <TokenIcon
        mint={getTokenMintAddressByName(quote)}
        width={'2.5rem'}
        height={'2.5rem'}
        margin={'0 1rem 0 1rem'}
      />
      <Text
        fontSize={'1.6rem'}
        fontFamily={'Avenir Next Medium'}
        style={{ margin: '0' }}
      >
        {quote}
      </Text>
    </BlockForIcons>
  )
}
