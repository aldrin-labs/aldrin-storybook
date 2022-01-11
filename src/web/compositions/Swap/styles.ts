import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  TRANSITION,
} from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Block } from '@sb/components/Block'
import { Input } from '@sb/components/Input'
import { Row, Page, WideContent } from '@sb/components/Layout'

import stakeBg from './img/stake-bg.png'
import bg from './img/swaps-bg.png'
import { SwapTabsProps } from './types'

export const SPage = styled(Page)`
  display: flex;
  flex-direction: row;
  background: url(${bg}) right bottom no-repeat;
`
export const RootRow = styled(Row)`
  padding: 32px 0;
  min-height: 600px;
`

export const Content = styled(WideContent)`
  flex: 1;
`

export const SBlock = styled(Block)`
  background: ${COLORS.swapBlockBg};
`

export const StakeBlock = styled(Block)`
  background: ${COLORS.swapBlockBg} url(${stakeBg}) center center no-repeat;
  background-size: cover;
  height: 140px;
`
export const FormBlock = styled(SBlock)`
  display: flex;
  flex-direction: column;
`

export const SearchInput = styled(Input)`
  background: none;
  margin: 10px 8px;

  input {
    font-weight: normal;
  }
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

  ${(props: SwapTabsProps) =>
    props.active ? `background: ${COLORS.background};` : ''}
`

export const StakingLink = styled(Link)`
  color: ${COLORS.primaryWhite};
  text-decoration: none;
`
