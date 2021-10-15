import { Theme } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import { BtnCustom } from '../BtnCustom/BtnCustom.styles'
import { Loading } from '../Loading'

interface ButtonProps {
  onClick?: (e: React.SyntheticEvent) => void
  showLoader?: boolean
  disabled?: boolean
  theme: Theme
  text: React.ReactNode
  width?: string
  height?: string
  margin?: string
  background?: string
  color?: string
}

export const PurpleButton: React.FC<ButtonProps> = (props) => {
  const {
    onClick = () => {},
    showLoader = false,
    disabled = false,
    width = '15rem',
    height = '4.5rem',
    margin = '1rem 0 0 0',
    background = '',
    color = '#fff',
    text,
    theme,
  } = props

  return (
    <BtnCustom
      disabled={showLoader || disabled}
      needMinWidth={false}
      btnWidth={width}
      height={height}
      fontSize="1.4rem"
      padding="1rem 2rem"
      borderRadius=".8rem"
      borderColor={background || theme.palette.blue.serum}
      btnColor={color}
      backgroundColor={background || theme.palette.blue.serum}
      textTransform="none"
      margin={margin}
      transition="all .4s ease-out"
      onClick={onClick}
    >
      {showLoader ? (
        <Loading
          color="#fff"
          size={16}
          height="16px"
          style={{ height: '16px' }}
        />
      ) : (
        text
      )}
    </BtnCustom>
  )
}

export const PasteButton = styled.button`
  position: absolute;
  font-size: 1.8rem;
  right: 0.5rem;
  background: inherit;
  border: 0;
  color: ${(props) => props.theme.palette.blue.serum};
  cursor: pointer;
  padding: 1.5rem;
`
