import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Paper, MenuItem, Button } from '@material-ui/core'

export const StyledLink = styled(NavLink)`
  color: #7284a0;
  padding: 0.9rem 2rem 0.9rem 0.6rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
  border-radius: 1rem;
  text-decoration: none;
  width: 100%;

  &:hover {
    background-color: #e0e5ec;
    color: #165be0;
  }

  @media (max-width: 1400px) {
    font-size: 1.4rem;
    padding: 1.4rem 2.8rem 1.4rem 0.8rem;
  }

  @media (min-width: 1921px) {
    font-size: 1.3rem;
    padding: 0.9rem 2.2rem 0.9rem 0.6rem;
  }
`

export const StyledButton = styled(Button)`
  font-size: 1.4rem;
  transition: 0.35s all;
`

export const StyledDropdown = styled.div`
  position: relative;
  display: inherit;
  margin: 0 0.4rem;
  padding: 1rem 0.5rem;

  @media (min-width: 1921px) {
    padding: 1.15rem 0.5rem;
  }

  @media (min-width: 2560px) {
    padding: 1.25rem 0.5rem;
  }
`

export const StyledPaper = styled(Paper)`
  position: absolute;
  top: 50px;
  left: 50%;
  box-shadow: 0px 8px 16px rgba(10, 19, 43, 0.1);
  border: 1px solid #e0e5ec;
  transform: translateX(-50%);
  border-radius: 2rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-left: 8px;
  padding-right: 8px;

  @media (max-width: 1400px) {
    top: 47px;
  }

  @media (min-width: 1400px) {
    top: 52px;
  }

  @media (min-width: 1921px) {
    top: 71px;
  }

  @media (min-width: 2560px) {
    top: 95px;
  }
`

export const StyledMenuItem = styled(MenuItem)`
  padding: 0.3rem 0;
  height: auto;

  svg {
    font-size: 14px;
  }

  &:hover {
    background: transparent;
  }

  @media (min-width: 1921px) {
    padding: 0.5rem 0;

    svg {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 2560px) {
    padding: 0.4rem 0;

    svg {
      font-size: 1.3rem;
    }
  }
`

export const StyledMenuItemText = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
`

// TODO
// fix padding in folio card
// 1024 -> 1400
