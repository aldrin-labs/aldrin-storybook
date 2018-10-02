import React, { SFC } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = styled(NavLink)`
  width: 120px;
  text-decoration: none;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props: { color: string }) => props.color};
  transition: opacity 0.2s ease-in-out;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    color: ${(props: { color: string }) => props.color};
    border-bottom: 2px solid #4ed8da;
  }

  ${(props: { active: boolean; color: string }) =>
    props.active
      ? ` opacity: 1;
    color: ${props.color};
    font-weight: bold;
    border-bottom: 2px solid #4ed8da;`
      : ''};
`

interface INavButton {
  link: string
  title: string
  color: string
  active: boolean
}

export const NavButton: SFC<INavButton> = ({
  link,
  title,
  color,
  active,
  ...props
}) => (
  <StyledNavLink active={active} color={color} to={link} {...props}>
    {title}
  </StyledNavLink>
)
