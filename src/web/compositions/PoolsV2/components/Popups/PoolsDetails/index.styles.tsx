import { BORDER_RADIUS } from '@variables/variables'
import styled from 'styled-components'

type GrayBoxType = {
  height?: string
  align?: string
  $justify?: string
}

export const GrayBox = styled.div<GrayBoxType>`
  width: 100%;
  height: ${(props) => props.height || '4em'};
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.$justify || 'space-between'};
  align-items: ${(props) => props.align || 'center'};
  background: ${(props) => props.theme.colors.white4};
  border-radius: ${BORDER_RADIUS.rg};
  padding: 0.5em 1em;
`
export const GrayContainer = styled.div<GrayBoxType>`
  width: 100%;
  height: ${(props) => props.height || '10.5em'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.colors.white5};
  border-radius: ${BORDER_RADIUS.rg};
  padding: 0.7em;
`
