import styled from 'styled-components'
import { COLORS, FONTS } from '../../../variables'

export const Block = styled.div`
  box-shadow: 0px 0px 48px rgba(0, 0, 0, 0.55);
  background: ${COLORS.blockBackground}; 
  border-radius: 12px;
  margin: 10px;
  height: 100%;
`

export const BlockTitle = styled.h2`
  font-family: ${FONTS.mainDemi};
  font-size: 1.25em;
  margin: 0.25rem 0 0.5rem;
`

interface BlockContentProps {
  border?: true
}

export const BlockContent = styled.div<BlockContentProps>`
  padding: 20px 24px;
  ${(props) => props.border ? `border-bottom: 1px solid ${COLORS.border}` : ''}
`