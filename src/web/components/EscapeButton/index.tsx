import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { InlineText } from '../Typography'

const EscapeButtonSC = styled((props) => (
  <Button $variant="none" minWidth="0" {...props} />
))`
  background: ${(props) => props.theme.colors.gray6};
  color: ${(props) => props.theme.colors.gray0};
  height: 3em;
  width: 3em;
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
    <EscapeButtonSC>
      <InlineText size="esm" weight={500} color="gray0">
        Esc
      </InlineText>
    </EscapeButtonSC>
  )
}
