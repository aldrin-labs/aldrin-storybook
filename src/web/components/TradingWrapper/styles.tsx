import styled from 'styled-components'
import { Card, Grid } from '@material-ui/core'
import { customAquaScrollBar } from '../cssUtils'

export const TablesBlockWrapper = styled(Card)`
  width: 100%;
  margin-bottom: 4px;
  height: calc(80% - 4px);
  border-radius: 0;

  && {
    box-shadow: none !important;
  }
`

export const TerminalContainer = styled.div`
  padding: 5px;
`

export const ScrollWrapper = styled.div`
  height: calc(100% - 40px);
  && {
    overflow-y: scroll;
  }
`
