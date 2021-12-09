import React, { ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from '../../SvgIcon'
import Info from '@icons/TooltipImg.svg'
import { COLORS, FONTS, BORDER_RADIUS } from '@variables/variables'

interface HintProps {
  text: ReactNode
}

const TooltipText = styled.div`
  position: absolute;
  top: 30px;
  width: 250px;
  left: -125px;
  text-align: left;
  display: none;
  background: ${COLORS.blockBackground};
  border: 1px solid ${COLORS.border};
  font-family: ${FONTS.main};
  font-size: 1em;
  letter-spacing: -0.523077px;
  border-radius: ${BORDER_RADIUS.md};
  color: ${COLORS.primaryWhite};
  padding: 5px;
  line-height: 1.4
`

const Container = styled.div`
  position: relative;
  margin-left: 10px;

  &:hover {
    ${TooltipText} {
      display: block;
    }
  }

`

export const Hint: React.FC<HintProps> = (props) => {
  const { text } = props
  return (
    <Container>
      <TooltipText>
        {text}
      </TooltipText>
      <SvgIcon
        src={Info}
        height="16px"
      />
    </Container>
  )
}