import React from 'react'
import { useTheme } from 'styled-components'

export const PlusIcon = () => {
  const theme = useTheme()
  return (
    <svg
      style={{ margin: '0 3px 2px 0' }}
      width="12"
      height="12"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.50004 12.4163C9.47921 12.4163 11.9167 9.97884 11.9167 6.99967C11.9167 4.02051 9.47921 1.58301 6.50004 1.58301C3.52087 1.58301 1.08337 4.02051 1.08337 6.99967C1.08337 9.97884 3.52087 12.4163 6.50004 12.4163Z"
        stroke={theme.colors.blue2}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33337 7H8.66671"
        stroke={theme.colors.blue2}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.16634V4.83301"
        stroke={theme.colors.blue2}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
