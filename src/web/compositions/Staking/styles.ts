import { COLORS, BREAKPOINTS } from '@variables/variables'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Block } from '@sb/components/Block'
import { BlackPage } from '@sb/components/Layout'

import { ContentBlockProps } from './types'

export const StakingBlock = styled(Block)`
  background: ${COLORS.defaultGray};
`

export const Content = styled.div`
  max-width: ${BREAKPOINTS.xxl};
  width: 100%;
  margin: 20px auto;
`
export const ContentBlock = styled.div<ContentBlockProps>`
  margin: 2rem 0;
  display: flex;
  width: ${(props: ContentBlockProps) => props.width || '100%'};
  height: auto;
  padding: 2rem;
  flex-direction: column;
  justify-content: space-between;
  background: ${COLORS.cardsBack};
  border-radius: 1rem;
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
  background: ${COLORS.cardsBack};
  border-radius: 1rem;
  margin: ${(props) => props.margin || '2rem 0 0 0'};
  height: 6rem;

  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: ${COLORS.bluePrimary};
    transition: 0.3s;
  }

  &:active {
    background: ${COLORS.darkBlue};
  }
`

export const StakeButton = styled(GrayButton)`
  background: ${COLORS.bluePrimary};

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
  color: ${COLORS.newWhite};
  background: ${COLORS.cardsBack};
  border-radius: 1rem;
  margin: ${(props) => props.margin || '2rem 0 0 0'};
  height: 6rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
  text-align: center;
  padding: 1.6rem 0;
  font-size: 0.9em;
  line-height: 3rem;
  &:hover {
    background: ${COLORS.bluePrimary};
    transition: 0.3s;
  }

  &:active {
    background: ${COLORS.darkBlue};
  }
`

export const Line = styled.div`
  border: 0.1rem solid ${COLORS.cardsBack};
  height: 0.1rem;
  margin: 4rem 0 2rem 0;
  width: 100%;
`

export const Page = styled(BlackPage)`
  display: flex;
  align-items: center;
  justify-content: center;
`
