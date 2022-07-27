import { FONT_SIZES } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { DropdownIconContainer } from './styles'

export const TokenSelectorContainer = styled(Row)`
  background: ${({ theme }) => theme.colors.white5};
  cursor: pointer;
  padding: 0.4em;
  border-radius: 0.4em;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${({ theme }) => theme.colors.white4};
    transition: all 0.3s ease-out;
  }
`

export const TokenSelector = ({
  mint,
  onClick,
}: {
  mint: string
  onClick: () => void
}) => {
  const tokenInfos = useTokenInfos()
  const { symbol } = tokenInfos.get(mint) || {
    symbol: getTokenNameByMintAddress(mint),
  }
  let fontSize = FONT_SIZES.md

  if (symbol.length > 5) fontSize = FONT_SIZES.xs
  else if (symbol.length === 4) fontSize = FONT_SIZES.sm

  return (
    <TokenSelectorContainer onClick={onClick}>
      <Row>
        <TokenIcon mint={mint} size={24} />
        <Text
          style={{ margin: '0 0.8rem' }}
          fontSize={fontSize}
          fontFamily="Avenir Next Demi"
        >
          {symbol}
        </Text>
      </Row>
      <DropdownIconContainer>
        <svg
          width="18"
          height="11"
          viewBox="0 0 18 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L9 9L17 1" stroke="#ABBAD1" strokeWidth="2" />
        </svg>
      </DropdownIconContainer>
    </TokenSelectorContainer>
  )
}
