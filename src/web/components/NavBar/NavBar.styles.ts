import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'

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
