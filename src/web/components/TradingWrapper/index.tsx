import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { importCoinIcon } from '@core/utils/MarketCapUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import TraidingTerminal from '../TraidingTerminal'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import {
  TablesBlockWrapper,
  TerminalContainer,
  TerminalMainGrid,
  FullHeightGrid,
  TerminalHeader,
  TerminalModeButton,
  BalanceTitle,
  BalanceSymbol,
  BalanceValues,
  BalanceQuantity,
  BalanceValue,
} from './styles'

import {
  addMainSymbol,
} from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    percentageBuy: '0',
    percentageSell: '0',
  }

  handleChangeMode = (mode: string) => {
    this.setState({ mode })
  }

  handleChangeOperation = (operation: string) => {
    this.setState({ operation })
  }

  handleChangePercentage = (percentage: string, mode: string) => {
    this.setState({ [`percentage${mode}`]: percentage })
  }

  render() {
    const { mode, percentageBuy, percentageSell } = this.state
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
              style={{ height: 'calc(100% - 3rem)', padding: '0 .3rem' }}
            >
              <Grid
                item
                xs={6}
                style={{
                  borderBottom: '.1rem solid #e0e5ec',
                  maxWidth: '100%',
                }}
              >
                <BalanceTitle>
                  <BalanceSymbol>{pair[0]}</BalanceSymbol>
                  <SvgIcon
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon(pair[0])}
                  />
                </BalanceTitle>
                <BalanceValues>
                  <BalanceQuantity>
                    {funds[0].quantity.toFixed(8)}
                  </BalanceQuantity>
                  <BalanceValue>
                    {addMainSymbol(firstValuePair, true)}
                  </BalanceValue>
                </BalanceValues>
              </Grid>
              <Grid item xs={6} style={{ maxWidth: '100%' }}>
                <BalanceTitle>
                  <BalanceSymbol>{pair[1]}</BalanceSymbol>
                  <SvgIcon
                    width={`1.7rem`}
                    height={`1.7rem`}
                    src={importCoinIcon(pair[1])}
                  />
                </BalanceTitle>
                <BalanceValues>
                  <BalanceQuantity>
                    {funds[1].quantity.toFixed(8)}
                  </BalanceQuantity>
                  <BalanceValue>
                    {addMainSymbol(secondValuePair, true)}
                  </BalanceValue>
                </BalanceValues>
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

            <TerminalMainGrid xs={12} container>
              <FullHeightGrid xs={6} item>
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'buy'}
                    operationType={'buy'}
                    priceType={mode}
                    percentage={percentageBuy}
                    changePercentage={(value) => this.handleChangePercentage(value, 'Buy')}
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
              </FullHeightGrid>

              <FullHeightGrid xs={6} item>
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'sell'}
                    operationType={'sell'}
                    priceType={mode}
                    percentage={percentageSell}
                    changePercentage={(value) => this.handleChangePercentage(value, 'Sell')}
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
              </FullHeightGrid>
            </TerminalMainGrid>
          </CustomCard>
        </Grid>
      </TablesBlockWrapper>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
