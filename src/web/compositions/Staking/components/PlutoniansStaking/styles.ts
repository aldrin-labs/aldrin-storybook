import { COLORS, BORDER_RADIUS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BlockContent as BlockContentOrig } from '@sb/components/Block'
import { FlexBlock as FlexBlockOrig } from '@sb/components/Layout'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { ContentBlock as ContentBlockOrig } from '../../styles'
import bg from './assets/plutonians-bg.png'
import Logo from './assets/plutonians-logo.png'

export const LogoWrap = styled.div`
  height: 200px;
  position: relative;
  background-color: ${COLORS.black};
  background-image: url(${bg});
  background-repeat: none;
  background-size: contain;

  border-radius: 12px 12px 0px 0px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 90%;
    left: 5%;
    height: 100%;
    background: url(${Logo}) center center no-repeat;
    background-size: contain;
  }
`

export const ButtonContainer = styled(RowContainer)`
  margin-top: 9px;
`

export const StakePoolText = styled.div`
  margin-left: 20px;
`

export const StakePoolWrap = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StakePoolButtonContainer = styled.div`
  margin-left: auto;
`

export const StakePoolLink = styled(Link)`
  background: ${COLORS.lightButtonBg};
  border-radius: ${BORDER_RADIUS.md};
  color: ${COLORS.main};
  text-decoration: none;
  padding: 10px;
  margin-left: 20px;

  &:hover {
    background: ${COLORS.primary};
  }
`

export const BlockContent = styled(BlockContentOrig)`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const ContentBlock = styled(ContentBlockOrig)`
  margin: 0;
`

export const RootFlexBlock = styled(FlexBlockOrig)`
  margin-bottom: 1em;
`
