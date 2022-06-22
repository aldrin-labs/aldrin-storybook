import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { DropdownIconContainer, InputContainer } from './styles'

export const TokenSelector = ({
  mint,
  roundSides = [],
  onClick,
}: {
  mint: string
  roundSides?: string[]
  onClick: () => void
}) => {
  const tokenInfos = useTokenInfos()
  const { symbol } = tokenInfos.get(mint) || {
    symbol: getTokenNameByMintAddress(mint),
  }

  return (
    <InputContainer
      roundSides={roundSides}
      padding="0 0.8em"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Row>
        <TokenIcon mint={mint} width={FONT_SIZES.xl} height={FONT_SIZES.xl} />
        <Text
          style={{ margin: '0 0.8rem' }}
          fontSize={
            symbol.length > 5
              ? FONT_SIZES.sm
              : symbol.length >= 4
              ? FONT_SIZES.md
              : FONT_SIZES.xmd
          }
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
    </InputContainer>
  )
}
