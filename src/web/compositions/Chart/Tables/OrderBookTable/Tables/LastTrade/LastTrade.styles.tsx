import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import React from 'react'
import styled from 'styled-components'

import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

export const LastTradeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 4rem;
  margin: 0;
  text-align: center;
  background: ${(props) => props.theme.colors.border};
  border-top: ${(props) => props.theme.colors.border};
  border-bottom: ${(props) => props.theme.colors.border};

  @media (max-width: 600px) {
    background: none;
    border-right: ${(props) => props.theme.colors.border};
    height: 6rem;
    color: #fbf2f2;
    display: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'none' : 'flex'};
  }
`
export const LastTradeContainerMobile = styled.div`
  display: ${(props) =>
    props.terminalViewMode === 'mobileChart' ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6rem;
  margin: 0;
  text-align: center;
  background: none;
  border-top: ${(props) => props.theme.colors.border};
  border-bottom: ${(props) => props.theme.colors.border};

  @media (min-width: 600px) {
    display: none;
  }
`

export const LastTradeValue = styled.div`
  letter-spacing: 0.075rem;
  color: ${({ fall }: { fall: boolean }) => (fall ? '#DD6956' : '#29AC80')};
  font-size: 1.6rem;
  font-weight: bold;
`

export const LastTradePrice = styled.span`
  /* position: relative;
  top: 0.4rem; */

  font-size: 1.6rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.black};
  letter-spacing: 0.075rem;
  padding-left: 1rem;

  @media (max-width: 600px) {
    font-size: 2.1rem;
    font-family: Avenir Next Light;
  }
`

export const ArrowIcon = styled(({ fall, ...rest }: { fall: boolean }) => (
  <ArrowRightAltIcon {...rest} />
))`
  position: relative;
  top: 0.4rem;
  width: 2rem;
  height: 2rem;
  transform: rotate(${(props) => (props.fall ? '90deg' : '-90deg')});
`

export const OrderBookStyledContainer = styled(RowContainer)`
  height: 100%;
  @media (max-width: 600px) {
    width: 100%;
    height: ${(props) =>
      props.terminalViewMode === 'mobileChart' ? 'calc(100% - 6rem)' : '100%'};
  }
`
