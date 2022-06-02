import { COLORS, BREAKPOINTS, BORDER_RADIUS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Block } from '@sb/components/Block'
import { BlackPage } from '@sb/components/Layout'

import { ContentBlockProps } from './types'

export const StakingBlock = styled(Block)`
  background: ${(props) => props.theme.colors.gray6};
  @media (max-width: ${BREAKPOINTS.md}) {
    margin: 8px 15px;
  }
`

export const Content = styled.div`
  max-width: ${BREAKPOINTS.xxl};
  width: 100%;
  margin: 20px auto;
`
export const ContentBlock = styled.div<ContentBlockProps>`
  margin: 1em 0;
  display: flex;
  width: ${(props: ContentBlockProps) => props.width || '100%'};
  height: auto;
  padding: 1em;
  flex-direction: column;
  justify-content: space-between;
  background: ${(props) => props.theme.colors[props.background || 'gray5']};
  border-radius: ${BORDER_RADIUS.md};
`
export const StretchedContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
`
export const GrayButton = styled.button`
  width: 100%;
  border: none;
  color: ${COLORS.newWhite};
  background: ${(props) => props.theme.colors.gray5};
  border-radius: ${BORDER_RADIUS.md};
  margin: ${(props) => props.margin || '1em 0 0 0'};
  height: 3em;

  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${(props) => props.theme.colors.blue5};
    color: #fff;
    transition: 0.3s;
  }

  &:active {
    background: ${COLORS.darkBlue};
  }

  @media (max-width: 600px) {
    height: 4em;
    font-size: 1em;
  }
`

export const StakeButton = styled(GrayButton)`
  background: ${COLORS.primaryBlue};

  &:disabled {
    background-color: ${COLORS.hint};
  }
`

export const UnStakeButton = styled(GrayButton)`
  background: rgba(224, 66, 55, 0.25);

  &:disabled {
    background-color: ${COLORS.hint};
  }
`

export const GrayLink = styled(Link)`
  width: 100%;
  border: none;
  color: ${(props) => props.theme.colors.gray1};
  background: ${(props) => props.theme.colors.gray5};
  border-radius: ${BORDER_RADIUS.md};
  margin: 0.7em 0 0 0;
  line-height: 3em;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
  text-align: center;
  padding: 0.5em 0;
  font-size: 0.9em;

  &:hover {
    background: ${(props) => props.theme.colors.blue5};
    color: #fff;
    transition: 0.3s;
  }

  &:active {
    background: ${(props) => props.theme.colors.blue2};
  }

  @media (min-width: ${BREAKPOINTS.md}) {
    padding: 0;
  }
`

export const Line = styled.div`
  border-top: 0.05em solid ${(props) => props.theme.colors.line};
  height: 0em;
  margin: 2em 0 1em 0;
  width: 100%;
`

export const Page = styled(BlackPage)`
  display: flex;
  align-items: center;
  justify-content: center;
`
