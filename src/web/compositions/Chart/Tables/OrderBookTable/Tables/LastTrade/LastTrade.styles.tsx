import React from 'react'
import styled from 'styled-components'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'

export const LastTradeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 3rem;
  margin: 0;
  text-align: center;
  background: ${(props) => props.theme.palette.white.background};
  border-top: ${(props) => props.theme.palette.border.main};
  border-bottom: ${(props) => props.theme.palette.border.main};
  font-family: 'IBM Plex Sans Condensed', sans-serif;
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
  color: ${(props) => props.theme.palette.dark.main};
  letter-spacing: 0.075rem;
  padding-left: 1rem;
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
