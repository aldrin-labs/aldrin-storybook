import styled from 'styled-components'
import { AppBar, Toolbar, Grid, Typography } from '@material-ui/core'

export const Nav = styled(AppBar)`
  z-index: 1;
  ${({ variant }: any) =>
    variant.background ? `background:${variant.background};` : ''} ${(
    props: any
  ) =>
    props.variant.hide
      ? `opacity: 0;
      position: absolute;
      z-index: -100;`
      : ''};

  height: 100%;

  && {
    box-shadow: none;
    padding: 0 3rem 0 6rem;
    background-color: ${(props) => props.variant.background};
    @media only screen and (max-width: 1024px) {
      padding: 0 2rem 0 4rem;
    }
  }
`

export const StyledToolbar = styled(Toolbar)`
  border-bottom: 1px solid #e0e5ec;
  height: 100%;
`

// @media (max-width: 1400px) {
//   height: 30px;
// }

// @media (min-width: 1400px) {
//   height: 40px;
// }

// @media (min-width: 1921px) {
//   height: 60px;
// }

// @media (min-width: 2560px) {
//   height: 80px;
// }

export const NavLinkButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  height: 100%;
`

export const NavBarWrapper = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const NavBreadcrumbTypography = styled(Typography)`
  text-transform: uppercase;
  border-left: 1px solid #7284a0;
  padding-left: 0.75rem;
  padding-top: 0.1rem;
  font-size: 1.2rem;
  line-height: 2.75rem;
  letter-spacing: 1px;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }

  @media only screen and (min-width: 2367px) {
    padding-top: 0.2rem;
    font-size: 1.4rem;
  }
`
