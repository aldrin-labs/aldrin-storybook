import styled from 'styled-components'
import { OpenRenameButton } from '@sb/components/RenameKeyDialog/RenameKeyDialog.styles'

export const OpenDeleteButton = styled(OpenRenameButton)`
  color: ${props => props.theme.palette.red.main};
  padding: 1rem 8.5rem;
  border-bottom: 0;
  border-radius: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  display: block;
  width: 100%;
`
