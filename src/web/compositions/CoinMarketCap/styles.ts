import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'
import { CSS_CONFIG } from '@storybook/config/cssConfig'

export const GridContainer = styled(Grid)`
  && {
    padding: 0.5rem;
    justify-content: center;
    min-height: 600px;
    height: 100%;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${CSS_CONFIG.navBarHeight}px);
  z-index: 0;
  margin-left: auto;
  margin-right: auto;
`

export const TableWrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 9px;
`

export const DonutChatWrapper = styled(TableWrapper)`
  height: 51vh;
`

export const TableContainer = styled(Grid)`
  && {
    max-height: 100%;
  }
`

export const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  max-width: 50vh;
  margin-left: auto;
  margin-right: auto;
`

export const CalculatorWrapper = styled.div`
  height: 100%;
  max-width: 50vh;
  margin-left: auto;
  margin-right: auto;
`

