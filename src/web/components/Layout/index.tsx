import styled from 'styled-components'
import { LAYOUT_WIDTH, COLORS, SIZE, FONTS, BREAKPOINTS, LAYOUT_COL_NUMBER } from '../../../variables'

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


interface CellProps {
  col?: number
  colSm?: number
  colLg?: number
}

export const Cell = styled.div<CellProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 1 ${(props) => (props.col || 12) / LAYOUT_COL_NUMBER * 100}%;
  ${(props) => props.colSm ? `@media(min-width:${BREAKPOINTS.sm}) { flex: 0 1 ${props.colSm / LAYOUT_COL_NUMBER * 100}%  }` : ''}
  ${(props) => props.colLg ? `@media(min-width:${BREAKPOINTS.lg}) { flex: 0 1 ${props.colLg / LAYOUT_COL_NUMBER * 100}%  }` : ''}
`

export const StretchedBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
