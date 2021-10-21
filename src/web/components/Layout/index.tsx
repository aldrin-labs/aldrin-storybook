import styled from 'styled-components'
import { LAYOUT_WIDTH, COLORS, SIZE, FONTS, BREAKPOINTS, LAYOUT_COL_NUMBER } from '../../../variables'
import { RowProps, CellProps, StretchedBlockProps } from './types'


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
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  height: 100%;
`

export const Cell = styled.div<CellProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 1 ${(props) => (props.col || 12) / LAYOUT_COL_NUMBER * 100}%;
  ${(props) => props.colSm ? `@media(min-width:${BREAKPOINTS.sm}) { flex: 0 1 ${props.colSm / LAYOUT_COL_NUMBER * 100}%  }` : ''}
  ${(props) => props.colMd ? `@media(min-width:${BREAKPOINTS.md}) { flex: 0 1 ${props.colMd / LAYOUT_COL_NUMBER * 100}%  }` : ''}
  ${(props) => props.colLg ? `@media(min-width:${BREAKPOINTS.lg}) { flex: 0 1 ${props.colLg / LAYOUT_COL_NUMBER * 100}%  }` : ''}
`

export const StretchedBlock = styled.div<StretchedBlockProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${(props: StretchedBlockProps) => props.align ? `align-items:${props.align};` : ''}
`
