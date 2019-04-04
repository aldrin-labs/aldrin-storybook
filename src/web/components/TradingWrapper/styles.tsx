import styled from 'styled-components'
import { Card, Grid } from '@material-ui/core'
import { customAquaScrollBar } from '../cssUtils'


export const TablesBlockWrapper = styled(Card)`
  min-width: 150px;
  width: 100%;
  position: relative;

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