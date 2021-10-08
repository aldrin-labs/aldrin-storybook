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
    position: unset;
    box-shadow: none;
    /* padding: 0 3rem 0 6rem; */
    background-color: ${(props) =>
      props.theme.palette.white.background || '#f9fbfd'};
    @media only screen and (max-width: 1024px) {
      /* padding: 0 2rem 0 4rem; */
    }
  }
`

export const StyledToolbar = styled(Toolbar)`
  border-bottom: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.border &&
      props.theme.palette.border.main) ||
    '.1rem solid #e0e5ec'};
  height: 100%;
  min-height: auto;
  padding: 0;
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
  justify-content: center;
  padding: 0;
  height: 100%;
  width: 14rem;
  color: ${(props) => props.theme.palette.grey.text};
  /* border-left: ${(props) => props.theme.palette.border.main}; */
  padding: 0.8rem 1.2rem;
  /* border-right: 0.1rem solid #e0e5ec; */

  @media only screen and (max-width: 1400px) {
    width: 17rem;
  }
`

export const NavBarWrapper = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  height: 100%;
`

export const NavBreadcrumbTypography = styled(Typography)`
  color: ${(props) =>
    (props.theme &&
      props.theme.palette &&
      props.theme.palette.dark &&
      props.theme.palette.dark.main) ||
    '#16253d'};
  font-weight: bold;
  text-transform: uppercase;
  border-left: 0;
  padding-left: 0.75rem;
  padding-top: 0.1rem;
  font-size: 1.3rem;
  line-height: 2.75rem;
  letter-spacing: 1px;
  white-space: nowrap;

  @media only screen and (max-width: 1100px) {
    font-size: 9px;
  }

  @media only screen and (min-width: 2367px) {
    padding-top: 0.2rem;
    font-size: 1.4rem;
  }
`
