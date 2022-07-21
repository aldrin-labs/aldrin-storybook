import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { InlineText } from '../Typography'

const EscapeButtonSC = styled((props) => (
  <Button $variant="none" minWidth="0" {...props} />
))`
  background: ${(props) => props.theme.colors.white5};
  color: ${(props) => props.theme.colors.white1};
  height: 3em;
  width: 3em;
  transition: all 0.3s ease-out;

  &:hover {
    background: ${(props) => props.theme.colors.white4};
    transition: all 0.3s ease-out;
  }
`

interface EscapeButtonParams {
  close: () => void
}

export const EscapeButton = (params: EscapeButtonParams) => {
  const { close } = params

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
    <EscapeButtonSC onClick={close}>
      <InlineText size="esm" weight={500} color="gray0">
        Esc
      </InlineText>
    </EscapeButtonSC>
  )
}
