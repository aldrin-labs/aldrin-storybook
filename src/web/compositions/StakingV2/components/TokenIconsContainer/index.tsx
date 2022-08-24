import React from 'react'

import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { Container, IconsContainer } from './index.styles'

export const TokenIconsContainer = ({
  token,
  mint,
  size = 32,
  elementSize = 'lg',
}: {
  token: string
  mint?: string
  size?: number
  elementSize?: 'sm' | 'lg'
}) => {
  console.log('token:', token)
  return (
    <Container>
      <IconsContainer>
        <TokenIcon mint={getTokenMintAddressByName(`${token}`)} size={size} />
      </IconsContainer>
    </Container>
  )
}
