import { COLORS } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { useTokenSymbol } from '../../dexUtils/tokenRegistry'
import { FlexBlock } from '../Layout'
import { TokenIcon } from './TokenIcon'

interface TokenIconWithNameProps {
  mint: string
}

export const TokenName = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 600;
  color: ${COLORS.primaryWhite};
`

export const TokenIconWithName: React.FC<TokenIconWithNameProps> = (props) => {
  const { mint } = props
  const tokenName = useTokenSymbol(mint)
  return (
    <FlexBlock alignItems="center">
      <TokenIcon mint={mint} width="24px" height="24px" />
      <TokenName>{tokenName}</TokenName>
    </FlexBlock>
  )
}
