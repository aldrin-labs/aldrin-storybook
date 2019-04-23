import styled from 'styled-components'
import { Table } from '@components/OldTable/Table'
import { Button } from '@material-ui/core'

export const AsksTable = styled(Table)`
  height: 50%;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  display: flex;
`

export const SwitchTablesButton = styled(Button)`
  && {
    display: none;

    @media (max-width: 1080px) {
      display: block;
    }
  }
`
