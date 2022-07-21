import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import SvgIcon from '../SvgIcon'
import { InlineText } from '../Typography'
import LeftArrow from './icons/left_arrow.svg'

const EscapeButtonSC = styled((props) => (
  <Button $variant="none" minWidth="0" {...props} />
))`
  background: ${(props) => props.theme.colors.gray6};
  color: ${(props) => props.theme.colors.gray0};
  height: ${(props) => (props.size ? `${props.size}em` : '3em')};
  width: ${(props) => (props.size ? `${props.size}em` : '3em')};
  display: flex;
  justify-content: center;
  align-items: center;
`

interface EscapeButtonParams {
  close: () => void
  size?: string
  arrow?: boolean
}

export const EscapeButton = (params: EscapeButtonParams) => {
  const { close, size, arrow } = params

  useEffect(() => {
    const closePopup = (e) => {
      if (e.code === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', closePopup)
    return () => window.removeEventListener('keydown', closePopup)
  }, [])

  return (
    <EscapeButtonSC size={size} onClick={close}>
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
