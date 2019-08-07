import styled, { css } from 'styled-components'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import { NavLink } from 'react-router-dom'

export const StyledButton = styled(Button)`
  position: absolute;
  width: 14.8rem;
  height: 4.5rem;
  display: flex;
  align-content: flex-end;
  justify-content: center;
  background: #5c8cea;
  color: white;
  font-size: 1.2rem;
  text-transform: capitalize;
  transition: all ease-in-out 0.2s;
  padding-bottom: 0;

  span:first-child {
    position: relative;
    top: .5rem;
    left: 0;
  }
  
  a {
    text-decoration: none;
    color: white;
  }

  &:hover {
    background: #165be0;
  }
`

export const StyledLeftButton = styled(StyledButton)`
  transform: rotate(-90deg);
  left: -8.4rem;
  border-radius: 0 0 1.25rem 1.25rem;

  &:hover {
    left: -7.6rem;
  }
`

export const StyledRightButton = styled(StyledButton)`
  position: relative;
  transform: rotate(90deg);
  left: calc(100vw - 9.6rem);
  top: 0px;
  border-radius: 0 0 1.25rem 1.25rem;
  text-decoration: none;
  &:hover {
    left: calc(100vw - 10.4rem);
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
