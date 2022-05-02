import { FONT_SIZES } from '@variables/variables'
import React from 'react'

import SvgIcon from '@sb/components/SvgIcon'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Text } from '@sb/compositions/Addressbook/index'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import Arrow from '@icons/arrowBottom.svg'

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
        <SvgIcon src={Arrow} width="0.6875em" height="0.6875em" />
      </DropdownIconContainer>
    </InputContainer>
  )
}
