import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Block } from '@sb/components/Block'
import { Row, Page, WideContent, Cell } from '@sb/components/Layout'

import { COLORS } from '@variables/variables'

import stakeBg from './img/stake-bg.png'
import bg from './img/swaps-bg.png'

export const SPage = styled(Page)`
  display: flex;
  flex-direction: row;
  background: url(${bg}) right bottom no-repeat;
`

export const RootRow = styled(Row)`
  padding: 10px 0;
  min-height: 590px;
  max-height: 700px;
  width: 100%;
  margin: auto;
`

export const Content = styled(WideContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SCell = styled(Cell)`
  height: 100%;
`

export const SBlock = styled(Block)`
  background: ${COLORS.swapBlockBg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

export const StakingLink = styled(Link)`
  color: ${COLORS.primaryWhite};
  text-decoration: none;
`
