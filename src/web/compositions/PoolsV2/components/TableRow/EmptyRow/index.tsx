import React from 'react'

import Pepe from '../../Icons/pepe.png'
import { Container, StyledInlineText, TextContainer } from './index.styles'

export const EmptyRow = () => {
  return (
    <Container>
      <img src={Pepe} alt="pepe" width="15%" height="auto" />
      <TextContainer>
        <StyledInlineText weight={400} size="lg">
          There’s only a guitar playing frog.{' '}
        </StyledInlineText>
        <StyledInlineText weight={400} size="lg">
          Frog’s really happy to see you, but it’s time to{' '}
          <StyledInlineText
            weight={700}
            onClick={() => {}}
            needDecoration
            color="green4"
          >
            CLEAR FILTERS
          </StyledInlineText>
        </StyledInlineText>
      </TextContainer>
    </Container>
  )
}
