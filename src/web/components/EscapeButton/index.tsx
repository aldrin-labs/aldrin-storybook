import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import SvgIcon from '../SvgIcon'
import { InlineText } from '../Typography'
import LeftArrow from './icons/left_arrow.svg'

export const EscapeButtonSC = styled((props) => (
  <Button $variant="none" minWidth="0" {...props} />
))`
  background: ${(props) => props.theme.colors.white5};
  color: ${(props) => props.theme.colors.white1};
  height: ${(props) => (props.size ? `${props.size}em` : '3em')};
  width: ${(props) => (props.size ? `${props.size}em` : '3em')};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${(props) => props.theme.colors.white4};
    transition: all 0.3s ease-out;
  }
`

interface EscapeButtonParams {
  onClose: () => void
  size?: string
  arrow?: boolean
}

export const EscapeButton: React.FC<EscapeButtonParams> = (params) => {
  const { onClose, size, arrow } = params

  useEffect(() => {
    const closePopup = (e) => {
      if (e.code === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', closePopup)
    return () => window.removeEventListener('keydown', closePopup)
  }, [])

  return (
    <EscapeButtonSC size={size} onClick={onClose}>
      {arrow ? (
        <SvgIcon src={LeftArrow} />
      ) : (
        <InlineText size="esm" weight={500} color="gray0">
          Esc
        </InlineText>
      )}
    </EscapeButtonSC>
  )
}
