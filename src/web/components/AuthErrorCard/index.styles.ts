import MdLock from '@material-ui/icons/Lock'
import styled from 'styled-components'
import { Card } from '@material-ui/core'

export const StyledDialog = styled.div`
  && {
    z-index: -10;
  }

  outline: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const StyledCard = styled(Card)`
  height: auto;
  width: 40rem;
  grid-column: 2;
  margin: auto;
`
export const MdLockStyled = styled(MdLock)`
  width: 80%;
  height: 80%;
`
