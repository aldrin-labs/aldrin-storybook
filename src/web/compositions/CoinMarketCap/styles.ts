import { Grid, Card } from '@material-ui/core'
import styled from 'styled-components'
import { CSS_CONFIG } from '@sb/config/cssConfig'

export const GridContainer = styled(Grid)`
  && {
    padding: 0.8rem;
    justify-content: center;
    min-height: 600px;
    height: 100%;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${CSS_CONFIG.navBarHeight * 2}px);
  z-index: 0;
  margin-left: auto;
  margin-right: auto;
`

export const TableWrapper = styled(Card)`
  max-height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 9px;

  & tr:last-child {
    th {
      top: 42px;
    }

    @media (min-width: 1921px) {
      th {
        top: 50px;
      }
    }
  }
`

export const DonutChatWrapper = styled(TableWrapper)`
  height: 51vh;
`

export const TableContainer = styled(Grid)`
  && {
    height: 84.2vh;
    padding: 8px 8px 0;
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

export const CoinSymbolContainer = styled.span`
  display: flex;
  align-items: center;
`

export const CoinMarketCapLink = styled.div`
  ${(props: { isSupported: boolean }) =>
    props.isSupported
      ? 'font-weight: bold; text-decoration: underline; color: #69c; cursor: pointer'
      : 'font-weight: bold; color: #69c;'}
`
