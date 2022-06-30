import React from 'react'
import styled from 'styled-components'

export interface TokenIconContainerProps {
  $size: number
  $margin?: string
}

export const TokenIconContainer = styled.div<TokenIconContainerProps>`
  display: flex;
  align-items: center;
  width: ${(props) => `${props.$size}px`};
  height: ${(props) => `${props.$size}px`};
  margin: ${(props) => props.$margin || 0};
`
