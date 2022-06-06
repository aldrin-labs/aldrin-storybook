import { FONTS, BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

export const TooltipText = styled.div`
  position: absolute;
  top: 30px;
  width: 250px;
  left: -125px;
  text-align: left;
  display: none;
  background: ${(props) => props.theme.colors.gray11};
  font-family: ${FONTS.main};
  font-size: 1em;
  letter-spacing: -0.523077px;
  border-radius: ${BORDER_RADIUS.md};
  color: ${(props) => props.theme.colors.gray0};
  padding: 5px;
  line-height: 1.4;
`

export const Container = styled.div`
  position: relative;
  margin-left: 10px;

  &:hover {
    ${TooltipText} {
      display: block;
    }
  }
`
