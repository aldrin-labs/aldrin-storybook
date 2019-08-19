import styled from 'styled-components'
import { Button } from '@material-ui/core'

import { Table, HeadCell } from '@sb/components/OldTable/Table'

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
export const StyledHeadCell = styled(HeadCell)`
  width: auto;
  flex-basis: ${(props) => (props.isCenter ? '40%' : '30%')};
  padding-left: 0;
`
