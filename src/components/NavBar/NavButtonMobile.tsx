import React, { SFC } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  font-family: Roboto, sans-serif;
  font-size: 10px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: white;
  }

  &.selected {
    color: white;
    font-weight: bold;
    border-bottom: 2px solid #4ed8da;
  }
`

interface INavButton {
  link: string
  title: string
}

export const NavButtonMobile: SFC<INavButton> = ({ link, title, ...props }) => (
  <StyledNavLink to={link} activeClassName={'selected'} {...props}>
    {title}
  </StyledNavLink>
)
