import MdLock from '@material-ui/icons/Lock'
import styled from 'styled-components'
import { Card, Dialog } from '@material-ui/core'

export const StyledDialog = styled(Dialog)`
  z-index: -1;
`

export const StyledCard = styled(Card)`
  height: auto;
  width: 25rem;
  grid-column: 2;
  margin: auto;
`
export const MdLockStyled = styled(MdLock)`
  width: 80%;
  height: 80%;
`
