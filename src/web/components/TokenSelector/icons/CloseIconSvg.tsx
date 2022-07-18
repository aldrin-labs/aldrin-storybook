import React from 'react'
import styled, { useTheme } from 'styled-components'

const CloseIconContainer = styled.svg``

export const CloseIconSvg = () => {
  const theme = useTheme()

  return (
    <CloseIconContainer
      width="100%"
      height="100%"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 18L9.5 9.5M18 1L9.5 9.5M9.5 9.5L18 18L1 1"
        stroke={theme.colors.gray1}
        strokeWidth="2"
      />
    </CloseIconContainer>
  )
}
