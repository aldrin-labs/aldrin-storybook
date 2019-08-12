import styled from 'styled-components'
import { AppBar, Toolbar } from '@material-ui/core'

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

  && {
    box-shadow: none;

    @media only screen and (min-width: 600px) {
      padding: 0 3rem 0 6rem;
    }
  }
`

export const StyledToolbar = styled(Toolbar)`
  border-bottom: 1px solid #e0e5ec;

  @media (max-width: 1400px) {
    height: 30px;
  }

  @media (min-width: 1400px) {
    height: 40px;
  }

  @media (min-width: 1921px) {
    height: 60px;
  }

  @media (min-width: 2560px) {
    height: 80px;
  }
`
