import styled, { css } from 'styled-components'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import { NavLink } from 'react-router-dom'

export const StyledButton = styled(Button)`
  position: absolute;
  width: 10.8rem;
  background: #5c8cea;
  color: white;
  font-size: 1.2rem;
  text-transform: capitalize;
  transition: all ease-in-out 0.2s;

  &:hover {
    background: #165be0;
  }
`

export const StyledAccountsButton = styled(StyledButton)`
  transform: rotate(-90deg);
  left: -6.2rem;
  border-radius: 0 0 1rem 1rem;

  &:hover {
    left: -5.5rem;
  }
`

export const StyledTransactionsButton = styled(StyledButton)`
  position: relative;
  transform: rotate(90deg);
  left: calc(100vw - 8rem);
  top: 0px;
  border-radius: 0 0 1rem 1rem;
  text-decoration: none;
  &:hover {
    left: calc(100vw - 8.7rem);
  }
`

export const DividerWithMargin = styled(Divider)`
  margin: .8rem auto;
  margin-bottom: 0px;
  width: 70%;
`

/* TODO: Fix visibility trouble later */
export const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: auto;
  z-index: 0;

  //visibility: hidden;

  && {
    background: ${(props: { background: string }) => props.background};
    border-radius: 0;
  }
`

export const Marker = styled.span`
  left: -32px;
  border-radius: 23px;
  height: 40px;
  width: 1.6rem;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`
export const BlurForMarker = styled.span`
  left: -32px;
  border-radius: 23px;
  height: 40px;
  width: 1.6rem;
  filter: blur(1.6rem);
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`

export const Tab = styled(IconButton)`
  margin: 0.96rem auto;
  margin-bottom: 0px;
`

export const BarStyles = css`
  text-align: center;
  cursor: pointer;
`

export const BarContainer = styled.div`
  ${BarStyles}
`

export const BarLink = styled(NavLink)`
  text-decoration: none;
  ${BarStyles}
`
