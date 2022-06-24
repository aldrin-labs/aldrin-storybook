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
  background: ${({ theme }) => theme.colors.gray7};
  cursor: pointer;
  padding: 0.4em;
  border-radius: 0.4em;
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

  return (
    <TokenSelectorContainer onClick={onClick}>
      <Row>
        <TokenIcon mint={mint} width={FONT_SIZES.lg} height={FONT_SIZES.lg} />
        <Text
          style={{ margin: '0 0.8rem' }}
          fontSize={
            symbol.length > 5
              ? FONT_SIZES.xs
              : symbol.length >= 4
              ? FONT_SIZES.sm
              : FONT_SIZES.md
          }
          fontFamily="Avenir Next Demi"
        >
          {symbol}
        </Text>
      </Row>
      <Row>
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
      </Row>
    </TokenSelectorContainer>
  )
}
