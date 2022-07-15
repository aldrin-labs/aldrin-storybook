import {
  LAYOUT_WIDTH,
  COLORS,
  SIZE,
  FONTS,
  BREAKPOINTS,
  LAYOUT_COL_NUMBER,
  WIDTH,
} from '@variables/variables'
import styled from 'styled-components'

import { RowProps, CellProps, StretchedBlockProps } from './types'

export const Body = styled.div`
  font-family: ${FONTS.main};
  color: ${COLORS.white};
  font-size: ${SIZE.fontSize};
`

export const PopupBody = styled(Body)`
  max-width: 65rem;

  @media (min-width: ${BREAKPOINTS.md}) {
    padding: 0 10px;
  }
`

export const Page = styled(Body)`
  background: ${(props) => props.theme.colors[props.$background || 'gray9']};
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const BlackPage = styled(Page)`
  background: ${(props) => props.theme.colors.gray9};
`

export const Content = styled.div`
  margin: 0 10px;
  width: 100%;

  @media (min-width: ${BREAKPOINTS.md}) {
    margin: 0 10px;
  }

  @media (min-width: ${LAYOUT_WIDTH}px) {
    max-width: ${LAYOUT_WIDTH}px;

    margin: 3rem;
  }
`

export const WideContent = styled(Content)`
  @media (min-width: ${LAYOUT_WIDTH}px) {
    max-width: calc(100% - 20px);
    margin: 0 10px;
  }
  @media (min-width: ${BREAKPOINTS.xxl}) {
    max-width: ${BREAKPOINTS.xxl};
    margin: 0 auto;
  }
`

export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  height: 100%;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
`

export const Cell = styled.div<CellProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  flex: 0 1 ${(props) => ((props.col || 12) / LAYOUT_COL_NUMBER) * 100}%;

  ${(props) =>
    props.colSm
      ? `@media(min-width:${BREAKPOINTS.sm}) {
          flex: 0 1 ${(props.colSm / LAYOUT_COL_NUMBER) * 100}%;
          max-width: ${(props.colSm / LAYOUT_COL_NUMBER) * 100}%;
        }`
      : ''}

  ${(props) =>
    props.colMd
      ? `@media(min-width:${BREAKPOINTS.md}) {
          flex: 0 1 ${(props.colMd / LAYOUT_COL_NUMBER) * 100}%;
          max-width: ${(props.colMd / LAYOUT_COL_NUMBER) * 100}%;
        }`
      : ''}

  ${(props) =>
    props.colLg
      ? `@media(min-width:${BREAKPOINTS.lg}) {
          flex: 0 1 ${(props.colLg / LAYOUT_COL_NUMBER) * 100}%;
          max-width: ${(props.colLg / LAYOUT_COL_NUMBER) * 100}%;
        }`
      : ''}

  ${(props) =>
    props.colXl
      ? `@media(min-width:${BREAKPOINTS.xl}) {
          flex: 0 1 ${(props.colXl / LAYOUT_COL_NUMBER) * 100}%;
          max-width: ${(props.colXl / LAYOUT_COL_NUMBER) * 100}%;
        }`
      : ''}
`

export const StretchedBlock = styled.div<StretchedBlockProps>`
  display: flex;
  flex-direction: ${(props: StretchedBlockProps) => props.direction || 'row'};
  justify-content: space-between;
  ${(props: StretchedBlockProps) =>
    props.align ? `align-items:${props.align};` : ''}
  ${(props: StretchedBlockProps) =>
    props.direction === 'column' ? `min-height: 100%` : ''};
  ${(props: StretchedBlockProps) =>
    props.width ? `width: ${WIDTH[props.width]}` : ''};
`
export const LeftBlock = styled(StretchedBlock)`
  justify-content: flex-start;
`

type Alignment =
  | 'normal'
  | 'center'
  | 'flex-start'
  | 'end'
  | 'flex-start'
  | 'flex-end'
  | 'left'
  | 'right'
  | 'space-between'

export interface FlexBlockProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?: Alignment
  alignItems?: Alignment
  flex?: string
}

export const Flex = styled.div`
  display: flex;
`

export const FlexBlock = styled(Flex)<FlexBlockProps>`
  flex-direction: ${(props: FlexBlockProps) => props.direction || 'row'};
  justify-content: ${(props: FlexBlockProps) =>
    props.justifyContent || 'normal'};
  align-items: ${(props: FlexBlockProps) => props.alignItems || 'normal'};
  ${(props: FlexBlockProps) => (props.flex ? `flex: ${props.flex};` : '')}
`
