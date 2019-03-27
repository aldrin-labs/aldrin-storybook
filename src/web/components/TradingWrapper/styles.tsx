import styled from 'styled-components'
import { Card, Grid } from '@material-ui/core'


export const TablesBlockWrapper = styled(Card)`
  min-width: 150px;
  width: 100%;
  position: relative;

  && {
    overflow: hidden;
    box-shadow: none !important;
  }
`

export const TerminalContainer = styled.div`
  padding: 5px;
`