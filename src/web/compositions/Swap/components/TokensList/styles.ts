import styled from 'styled-components'

import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  TRANSITION,
} from '@variables/variables'

import { BlockContent } from '../../../../components/Block'
import { SwapTabsProps } from './types'

export const TokensContainer = styled.div`
  height: 100%;
  overflow: auto;
`

export const TokenBLock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: ${COLORS.backgroundTransparent};
  margin: 10px 0;
  border-radius: ${BORDER_RADIUS.md};
  padding: 16px 12px;
  overflow: auto;
`

export const TabsWrap = styled(BlockContent)`
  overflow: visible;
`

export const TabsContainer = styled.div`
  background: ${COLORS.bodyBackground};
  border-radius: ${BORDER_RADIUS.md};
  display: flex;
  flex-direction: row;
  margin: -3px 0;
`

export const Tab = styled.div<SwapTabsProps>`
  flex: 1;
  font-size: ${FONT_SIZES.xs};
  border-radius: ${BORDER_RADIUS.md};
  text-align: center;
  cursor: pointer;
  transition: ${TRANSITION};
  height: 36px;
  line-height: 36px;
  user-select: none;

  ${(props: SwapTabsProps) =>
    props.active ? `background: ${COLORS.background};` : ''}
`
