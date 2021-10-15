import React, { CSSProperties, ReactChild } from 'react'
import styled, { keyframes } from 'styled-components'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/components/Typography'
import { HintQuoteBlock } from '@sb/components/HintQuoteBlock/HintQuoteBlock'

// import LoadingLogo from '@icons/logo_loader.webp'
import LoadingLogo from '@icons/RINLogo.svg'

interface LogoProps {
  size: string
  src: string
}

const load = keyframes` 
0% {
  transform: rotate(-45deg);
}

50% {
  transform: rotate(45deg);
}

100% {
  transform: rotate(-45deg);
}
`

const Logo = styled.img<LogoProps>`
  width: ${(props: LogoProps) => props.size};
  height: ${(props: LogoProps) => props.size};
  animation: ${load} 2s ease-in-out infinite;
`

export const LoadingWithHint = ({
  loaderSize = '9rem',
  loadingText = 'Loading...',
  loaderTextStyles = {},
  hintTextStyles = {},
}: {
  loaderSize?: string
  loadingText?: string | ReactChild
  loaderTextStyles?: CSSProperties
  hintTextStyles?: CSSProperties
}) => (
  <RowContainer
    padding="0 0 1rem 0"
    direction="column"
    style={{ borderBottom: '.1rem solid #383B45' }}
  >
    <RowContainer padding="3rem 2rem" direction="column">
      <Logo src={LoadingLogo} size={loaderSize} />
      <Text padding="2rem 0 0 0" style={{ ...loaderTextStyles }}>
        {loadingText}
      </Text>
    </RowContainer>
    <RowContainer
      padding="0 6.5rem 1rem 6.5rem"
      style={{ borderTop: '.1rem solid #383B45' }}
    >
      <HintQuoteBlock hintTextStyles={hintTextStyles} />
    </RowContainer>
  </RowContainer>
)
