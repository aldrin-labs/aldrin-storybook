import { Paper } from '@material-ui/core'
import { BORDER_RADIUS, BREAKPOINTS } from '@variables/variables'
import styled from 'styled-components'

const CommonPaper = styled(Paper)`
  font-size: 16px;
  height: auto;
  padding: 2em 1.5em;
  width: auto;
  min-width: 24em;
  box-shadow: 0px 0px 0.4em 0px rgba(0, 0, 0, 0.45);
  background: ${(props) => props.theme.colors.white6};
  border-radius: ${BORDER_RADIUS.md};
  overflow: hidden;
  overflow: visible;

  @media (max-width: ${BREAKPOINTS.sm}) {
    max-height: 100%;
    margin: 0;
    width: 100%;
    height: 100%;
  }
`

export { CommonPaper }
