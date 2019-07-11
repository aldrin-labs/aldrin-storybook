import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'

export const Nav = styled(AppBar)`
  z-index: 1;
  overflow: hidden;
  background: black;
  ${({ variant }: any) =>
    variant.background ? `background:${variant.background};` : ''} ${(
    props: any
  ) =>
    props.variant.hide
      ? `opacity: 0;
      background: black;
    position: absolute;
    z-index: -100;`
      : ''};

  && {
    box-shadow: none;
  }
`
