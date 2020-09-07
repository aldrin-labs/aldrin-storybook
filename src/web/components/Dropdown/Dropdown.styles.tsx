import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Paper, MenuItem, Button } from '@material-ui/core'

export const StyledLink = styled(NavLink)`
  color: ${(props) => props.theme.palette.grey.text};
  padding: 1.5rem 0 1.5rem 10%;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  transition: all 0.5s ease-in-out;
  border-radius: 0rem;
  text-decoration: none;
  width: 100%;
  border-bottom: ${(props) => props.theme.palette.border.main};

  &:hover {
    background-color: ${(props) => props.theme.palette.grey.border};
    color: ${(props) => props.theme.palette.blue.light};
  }

  @media (max-width: 1400px) {
    font-size: 1.4rem;
    /* padding: 1.4rem 2.8rem 1.4rem 0.8rem; */
  }

  @media (min-width: 1921px) {
    font-size: 1.2rem;
    /* padding: 0.9rem 2.2rem 0.9rem 0.6rem; */
  }
`

export const StyledButton = styled(Button)`
  font-size: 12px;
  letter-spacing: 1px;
  width: 100%;
  height: 100%;
  transition: 0.35s all;
  padding: 0;
  border-radius: 0;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }
  @media only screen and (min-width: 2367px) {
    font-size: 1rem;
  }
`

export const StyledDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 1rem;
  padding: 0rem 0.5rem; */
  width: auto;
  height: 100%;
  padding: 0.8rem 1.2rem;
  &:hover > div {
    display: block !important;
  }
  /* @media (min-width: 1921px) {
    padding: 0rem 0.5rem;
  }

  @media (min-width: 2560px) {
    padding: 0rem 0.5rem;
  } */
`

export const StyledPaper = styled(Paper)`
  && {
    position: absolute;
    top: calc(5.4vh - 1px);
    left: calc(50% - 0.5px);
    width: calc(100% + 0.15rem);
    height: auto;
    box-shadow: 0px 8px 16px rgba(10, 19, 43, 0.1);
    border: ${(props) => props.theme.palette.border.main};
    background: ${(props) => props.theme.palette.white.background};
    transform: translateX(-50%);
    border-radius: 0rem;
    /* border-top-left-radius: 0;
    border-top-right-radius: 0; */
    /* padding-left: 8px;
    padding-right: 8px; */
  }

  @media screen and (max-width: 1400px) {
    && {
      width: calc(100% + 0.2rem);
    }
  }
`

export const StyledMenuItem = styled(MenuItem)`
  /* padding: 0.3rem 0 0.3rem 0.4rem; */
  padding: 0;
  height: auto;
  color: ${(props) => props.theme.palette.grey.light};
  background: ${(props) => props.theme.palette.white.background};

  svg {
    font-size: 14px;
  }

  &:hover {
    background: transparent;
  }

  @media (min-width: 1921px) {
    /* padding: 0.5rem 0; */

    svg {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 2560px) {
    /* padding: 0.4rem 0; */

    svg {
      font-size: 1.3rem;
    }
  }
`

export const StyledMenuItemText = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
`
