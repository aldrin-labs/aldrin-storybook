import React from 'react'
import { useTheme } from 'styled-components'

export const ArrowsExchangeIcon = () => {
  const theme = useTheme()
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.96586 4.47998L4.48584 2L2.00586 4.47998"
        stroke={theme.colors.white1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.48633 14V2"
        stroke={theme.colors.white1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.0332 11.52L11.5132 14L13.9932 11.52"
        stroke={theme.colors.white1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5117 2V14"
        stroke={theme.colors.white1}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
