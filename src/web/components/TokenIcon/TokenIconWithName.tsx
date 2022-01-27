import { COLORS } from '@variables/variables'
import React from 'react'
import styled from 'styled-components'

import { getTokenNameByMintAddress } from '@core/utils/awesomeMarkets/serum'

import { FlexBlock } from '../Layout'
import { TokenIcon } from './TokenIcon'

interface TokenIconWithNameProps {
  mint: string
}

export const TokenName = styled.span`
  margin-left: 10px;
  font-weight: 600;
  color: ${COLORS.primaryWhite};
`

export const TokenIconWithName: React.FC<TokenIconWithNameProps> = (props) => {
  const { mint } = props
  return (
    <FlexBlock alignItems="center">
      <TokenIcon mint={mint} width="32px" height="32px" />
      <TokenName>{getTokenNameByMintAddress(mint)}</TokenName>
    </FlexBlock>
  )
}
