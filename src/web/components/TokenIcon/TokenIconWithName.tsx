import React from 'react'
import styled from 'styled-components'
import { FlexBlock } from '../Layout'
import { TokenIcon } from './TokenIcon'
import { getTokenNameByMintAddress } from '../../dexUtils/markets'
import { COLORS } from '@variables/variables'

interface TokenIconWithNameProps {
  mint: string
}


export const TokenName = styled.span`
  margin-left: 10px;
  font-weight: 600;
  color: ${COLORS.primaryWhite};
`

export const TokenIconWithName: React.FC<TokenIconWithNameProps> = (props) => {
  return (
    <FlexBlock alignItems="center">
      <TokenIcon
        mint={props.mint}
        width="32px"
        height="32px"
      />
      <TokenName>
        {getTokenNameByMintAddress(props.mint)}
      </TokenName>
    </FlexBlock>
  )
}