import React from 'react'

import { TokenNameWrap } from '.'
import { useTokenSymbol } from '../../dexUtils/tokenRegistry'
import { FlexBlock } from '../Layout'
import { TokenName } from './styles'
import { TokenIcon } from './TokenIcon'
import { TokenIconWithNameProps } from './types'

export const TokenIconWithName: React.FC<TokenIconWithNameProps> = (props) => {
  const { mint, size = '24px', children } = props
  const tokenName = useTokenSymbol(mint)
  return (
    <FlexBlock alignItems="center">
      <TokenIcon mint={mint} width={size} height={size} />
      <TokenNameWrap>
        <TokenName>{tokenName}</TokenName>
        {children}
      </TokenNameWrap>
    </FlexBlock>
  )
}
