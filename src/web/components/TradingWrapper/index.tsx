import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

import { Grid } from '@material-ui/core'

import { compose } from 'recompose'

import TraidingTerminal from '../TraidingTerminal'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  TablesBlockWrapper,
  TerminalContainer,
  TerminalHeader,
  TerminalModeButton,
  TabsContainer,
  TabsTypeContainer,
  StyledTab,
  BuyTab,
  SellTab,
} from './styles'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

import {
  TradingItemTitle,
  TradingItemValue,
  TradingItemSubValue,
} from '@sb/components/TraidingTerminal/styles'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    percentage: '100',
  }

  handleChangeMode = (mode: string) => {
    this.setState({ mode })
  }

  handleChangeOperation = (operation: string) => {
    this.setState({ operation })
  }

  handleChangePercentage = (percentage: string) => {
    this.setState({ percentage })
  }

  render() {
    const { operation, mode, percentage } = this.state
    const {
      pair,
      funds,
      price,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
    } = this.props

    const firstValuePair =
      stripDigitPlaces(funds[0].value) === null
        ? funds[0].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[0].value))

    const secondValuePair =
      stripDigitPlaces(funds[1].value) === null
        ? funds[1].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[1].value))

    return (
      <TablesBlockWrapper
        item
        container
        style={{
          height: '40%',
          padding: '.4rem 0 0 0',
        }}
      >
        <Grid item xs={2} style={{ height: '100%', padding: '0 .4rem 0 0' }}>
          <CustomCard>
            <ChartCardHeader>Balances</ChartCardHeader>
            <Grid
              container
              xs={12}
              direction="column"
              style={{ height: 'calc(100% - 3rem)', padding: '.8rem .3rem' }}
            >
              <Grid
                item
                xs={6}
                style={{
                  borderBottom: '.1rem solid #e0e5ec',
                  maxWidth: '100%',
                }}
              >
                <TradingItemTitle>{pair[0]}</TradingItemTitle>
                <TradingItemValue>
                  {funds[0].quantity.toFixed(8)}
                  <TradingItemSubValue>
                    {`$${firstValuePair}`}
                  </TradingItemSubValue>
                </TradingItemValue>
              </Grid>
              <Grid item xs={6} style={{ maxWidth: '100%' }}>
                <TradingItemTitle>{pair[1]}</TradingItemTitle>
                <TradingItemValue>
                  {funds[1].quantity.toFixed(8)}
                  <TradingItemSubValue>
                    {`$${secondValuePair}`}
                  </TradingItemSubValue>
                </TradingItemValue>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
        <Grid item xs={10} style={{ height: '100%', padding: '0 0 0 .4rem' }}>
          <CustomCard>
            <TerminalHeader>
              <TerminalModeButton
                isActive={mode === 'limit'}
                onClick={() => this.handleChangeMode('limit')}
              >
                limit
              </TerminalModeButton>
              <TerminalModeButton
                isActive={mode === 'market'}
                onClick={() => this.handleChangeMode('market')}
              >
                market
              </TerminalModeButton>
              <TerminalModeButton
                isActive={mode === 'stop-limit'}
                onClick={() => this.handleChangeMode('stop-limit')}
              >
                stop
              </TerminalModeButton>
              <TerminalModeButton isActive={mode === 'safe'}>
                safe
              </TerminalModeButton>
            </TerminalHeader>

            <Grid xs={12} container>
              <Grid xs={6} item>
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'buy'}
                    operationType={'buy'}
                    priceType={mode}
                    percentage={percentage}
                    changePercentage={this.handleChangePercentage}
                    pair={pair}
                    funds={funds}
                    key={[pair, funds]}
                    walletValue={funds && funds[1]}
                    marketPrice={price}
                    confirmOperation={placeOrder}
                    cancelOrder={cancelOrder}
                    decimals={decimals}
                    showOrderResult={showOrderResult}
                  />
                </TerminalContainer>
              </Grid>

              <Grid xs={6} item>
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'sell'}
                    operationType={'sell'}
                    priceType={mode}
                    percentage={percentage}
                    changePercentage={this.handleChangePercentage}
                    pair={pair}
                    funds={funds}
                    key={[pair, funds]}
                    walletValue={funds && funds[1]}
                    marketPrice={price}
                    confirmOperation={placeOrder}
                    cancelOrder={cancelOrder}
                    decimals={decimals}
                    showOrderResult={showOrderResult}
                  />
                </TerminalContainer>
              </Grid>
            </Grid>
          </CustomCard>
        </Grid>
      </TablesBlockWrapper>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
