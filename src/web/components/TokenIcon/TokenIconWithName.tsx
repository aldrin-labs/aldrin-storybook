import React from 'react'
import styled from 'styled-components'

import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { getTokenName } from '../../dexUtils/markets'
import { FlexBlock } from '../Layout'
import { TokenIcon } from './TokenIcon'

interface TokenIconWithNameProps {
  mint: string
}

export const TokenName = styled.span`
  margin-left: 10px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray1};
`

export const TokenIconWithName: React.FC<TokenIconWithNameProps> = (props) => {
  const tokensInfo = useTokenInfos()

  const { mint } = props
  const tokenName = getTokenName({ address: mint, tokensInfoMap: tokensInfo })
  return (
    <FlexBlock alignItems="center">
      <TokenIcon mint={mint} size={32} />
      <TokenName>{tokenName}</TokenName>
    </FlexBlock>
  )
}
