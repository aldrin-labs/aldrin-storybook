import React from 'react'

import { ImageContainer, RewardsContainer } from './styles'

export const RewardsComponent = ({
  imgSrc,
  children,
}: {
  imgSrc: string
  children: React.ReactChild
}) => {
  return (
    <RewardsContainer>
      <ImageContainer>
        <img src={imgSrc} alt="rewards" width="50px" height="50px" />
      </ImageContainer>
      {children}
    </RewardsContainer>
  )
}
