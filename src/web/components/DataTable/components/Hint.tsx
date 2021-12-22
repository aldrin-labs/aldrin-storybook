import React from 'react'

import Info from '@icons/TooltipImg.svg'

import SvgIcon from '../../SvgIcon'
import { TooltipText, Container } from './styles'
import { HintProps } from './types'

export const Hint: React.FC<HintProps> = (props) => {
  const { text } = props
  return (
    <Container>
      <TooltipText>{text}</TooltipText>
      <SvgIcon src={Info} height="16px" />
    </Container>
  )
}
