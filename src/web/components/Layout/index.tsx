import styled from 'styled-components'
import { LAYOUT_WIDTH, COLORS, SIZE, FONTS } from '../../../variables'

export interface RowProps {
  wrap?: string
  justify?: string
  direction?: string
  align?: string
  width?: string
  height?: string
  margin?: string
  padding?: string
}

export const Page = styled.div`
  background: ${COLORS.bodyBackground};
  font-family: ${FONTS.main};
  color: ${COLORS.white};
  flex: 1;
` 

export const Content = styled.div`
  max-width: ${LAYOUT_WIDTH}px;
  margin: 0 auto;
  font-size: ${SIZE.fontSize};

  @media(max-width: ${LAYOUT_WIDTH}px) {
    margin: 0 20px;
  }
`

export const Row = styled.div<RowProps>`
  display: flex;
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
`
