import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const OpenRenameButton = styled(Button)`
  border-radius: 0;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border-bottom: .1rem solid ${props => props.theme.palette.text.white};
  padding: 1rem 8rem;
  text-transform: capitalize;
  display: block;
  width: 100%;
`
