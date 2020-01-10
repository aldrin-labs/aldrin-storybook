import React from 'react'
import styled from 'styled-components'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'

export const LastTradeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: calc(100% - 1.6rem);
  height: 3rem;
  margin: 0 0.8rem;
  text-align: center;
  background: #f2f4f6;
  border: 0.1rem solid #e0e5ec;
  border-radius: 0.75rem;
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
  color: #16253d;
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
