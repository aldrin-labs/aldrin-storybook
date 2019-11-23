import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { importCoinIcon } from '@core/utils/MarketCapUtils'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import TraidingTerminal from '../TraidingTerminal'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import {
  SRadio,
  SCheckbox,
  FormInputTemplate,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

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

import { addMainSymbol } from '@sb/components/index'
import SvgIcon from '@sb/components/SvgIcon'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    percentageBuy: '0',
    percentageSell: '0',
    leverage: 1,
    reduceOnly: true,
    orderMode: 'TIF',
    TIFMode: 'GTC',
    trigger: 'last price',
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
    const {
      mode,
      percentageBuy,
      percentageSell,
      leverage,
      reduceOnly,
      orderMode,
    } = this.state
    const {
      pair,
      funds,
      price,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
      marketType,
    } = this.props

    const firstValuePair =
      stripDigitPlaces(funds[0].value) === null
        ? funds[0].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[0].value))

    const secondValuePair =
      stripDigitPlaces(funds[1].value) === null
        ? funds[1].value
        : formatNumberToUSFormat(stripDigitPlaces(funds[1].value))

    const isSPOTMarket = isSPOTMarketType(marketType)

    return (
      <TablesBlockWrapper
        item
        container
        style={{
          height: '50%',
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
                onClick={() => {
                  this.handleChangeMode('stop-limit')
                  this.setState({ orderMode: 'TIF' })
                }}
              >
                stop-limit
              </TerminalModeButton>
              <TerminalModeButton isActive={mode === 'safe'}>
                safe
              </TerminalModeButton>
            </TerminalHeader>

            {!isSPOTMarket && (
              <TerminalHeader style={{ display: 'flex' }}>
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '1rem',
                  }}
                >
                  {mode === 'limit' && (
                    <>
                      <SRadio
                        id="postOnly"
                        checked={orderMode === 'postOnly'}
                        style={{ padding: '0 1rem' }}
                        onChange={() =>
                          this.setState({
                            orderMode: 'postOnly',
                          })
                        }
                      />
                      <label for="postOnly">post only</label>
                    </>
                  )}

                  {mode !== 'market' && (
                    <>
                      <SRadio
                        id="TIF"
                        checked={orderMode === 'TIF'}
                        style={{ padding: '0 1rem' }}
                        onChange={() =>
                          this.setState({
                            orderMode: 'TIF',
                          })
                        }
                      />
                      <label for="TIF">TIF</label>
                      <select
                        disabled={orderMode !== 'TIF'}
                        onChange={(e) =>
                          this.setState({ TIFMode: e.target.value })
                        }
                      >
                        <option>GTC</option>
                        <option>IOK</option>
                        <option>FOK</option>
                      </select>
                    </>
                  )}

                  {mode !== 'stop-limit' && (
                    <>
                      <SCheckbox
                        id="reduceOnly"
                        checked={reduceOnly}
                        style={{ padding: '0 1rem' }}
                        onChange={() =>
                          this.setState((prev) => ({
                            reduceOnly: !prev.reduceOnly,
                          }))
                        }
                      />
                      <label for="reduceOnly">reduce only</label>
                    </>
                  )}

                  {mode === 'stop-limit' && (
                    <>
                      <span>trigger</span>
                      <select
                        onChange={(e) =>
                          this.setState({ trigger: e.target.value })
                        }
                      >
                        <option>last price</option>
                        <option>mark price</option>
                      </select>
                    </>
                  )}
                </div>
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '.8rem 0',
                    paddingRight: '.5rem',
                  }}
                >
                  <span>leverage:</span>
                  <SmallSlider
                    min={1}
                    max={125}
                    defaultValue={1}
                    value={leverage}
                    valueSymbol={'X'}
                    marks={{
                      1: {},
                      25: {},
                      50: {},
                      75: {},
                      100: {},
                      125: {},
                    }}
                    onChange={(leverage) => {
                      this.setState({ leverage })
                    }}
                    sliderContainerStyles={{
                      width: '70%',
                      margin: '0 auto',
                    }}
                    handleStyles={{
                      width: '1.2rem',
                      height: '1.2rem',
                      border: 'none',
                      backgroundColor: '#0B1FD1',
                      marginTop: '-.45rem',
                    }}
                    dotStyles={{
                      border: 'none',
                      backgroundColor: '#ABBAD1',
                    }}
                    activeDotStyles={{
                      backgroundColor: '#5C8CEA',
                    }}
                    markTextSlyles={{
                      color: '#7284A0;',
                      fontSize: '1rem',
                    }}
                  />
                  <span>{leverage}x</span>
                </div>
              </TerminalHeader>
            )}

            <TerminalMainGrid xs={12} container>
              <FullHeightGrid xs={6} item>
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'buy'}
                    operationType={'buy'}
                    priceType={mode}
                    isSPOTMarket={isSPOTMarket}
                    percentage={percentageBuy}
                    changePercentage={(value) =>
                      this.handleChangePercentage(value, 'Buy')
                    }
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
                    isSPOTMarket={isSPOTMarket}
                    percentage={percentageSell}
                    changePercentage={(value) =>
                      this.handleChangePercentage(value, 'Sell')
                    }
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
