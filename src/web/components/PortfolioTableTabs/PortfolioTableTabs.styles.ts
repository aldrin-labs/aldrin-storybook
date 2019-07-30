import styled, { css } from 'styled-components'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import { NavLink } from 'react-router-dom'

export const StyledButton = styled(Button)`
  width: 8rem;
  background: #5c8cea;
  transform: rotate(-90deg);
  position: absolute;
  left: -3rem;
  color: white;
  border-radius: 0 0 .5rem .5rem;

  font-size: 1rem;

  transition: all ease-in-out 0.2s;
  &:hover {
    background: #165be0;
    left: -3.25rem;
  }
`

export const DividerWithMargin = styled(Divider)`
  margin: 0.5rem auto;
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
  width: 1rem;
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`
export const BlurForMarker = styled.span`
  left: -32px;
  border-radius: 23px;
  height: 40px;
  width: 1rem;
  filter: blur(1rem);
  background: ${(props: { color: string }) => props.color};
  position: absolute;
`

export const Tab = styled(IconButton)`
  margin: 0.6rem auto;
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
