import React from 'react'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'

import TraidingTerminal from '../TraidingTerminal'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import {
  SRadio,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import {
  TerminalContainer,
  TerminalMainGrid,
  FullHeightGrid,
  TerminalHeader,
  TerminalModeButton,
  LeverageLabel,
  LeverageTitle,
  LeverageContainer,
  SettingsContainer,
  SettingsLabel,
  StyledSelect,
  StyledOption,
  FuturesSettings,
  SmartOrderModeButton,
} from './styles'

import { maxLeverage } from '@sb/compositions/Chart/mocks'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'limit',
    leverage: false,
    reduceOnly: false,
    orderMode: 'TIF',
    TIFMode: 'GTC',
    trigger: 'last price',
    orderIsCreating: false,
  }

  static getDerivedStateFromProps(props, state) {
    const { leverage } = props
    const { leverage: stateLeverage } = state

    if (!stateLeverage) {
      return {
        leverage,
      }
    } else {
      return null
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.leverage !== this.props.leverage) {
      this.setState({ leverage: this.props.leverage })
    }
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

  addLoaderToButton = (side: 'buy' | 'sell') => {
    this.setState({ orderIsCreating: side })
  }

  render() {
    const {
      mode,
      leverage,
      reduceOnly,
      orderMode,
      TIFMode,
      trigger,
      orderIsCreating,
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
      leverage: startLeverage,
      priceFromOrderbook,
      updateTerminalViewMode,
      updateLeverageWithStatus,
    } = this.props

    const isSPOTMarket = isSPOTMarketType(marketType)

    return (
      <Grid item xs={12} style={{ height: '100%', padding: '0 0 0 0' }}>
        <CustomCard>
          <TerminalHeader key={'spotTerminal'}>
            <TerminalModeButton
              isActive={mode === 'limit'}
              onClick={() => this.handleChangeMode('limit')}
            >
              Limit
            </TerminalModeButton>
            <TerminalModeButton
              isActive={mode === 'market'}
              onClick={() => this.handleChangeMode('market')}
            >
              Market
            </TerminalModeButton>
            <TerminalModeButton
              isActive={mode === 'stop-limit'}
              onClick={() => {
                this.handleChangeMode('stop-limit')
                this.setState({ orderMode: 'TIF' })
              }}
            >
              Stop-Limit
            </TerminalModeButton>
            <TerminalModeButton
              isActive={mode === 'take-profit'}
              onClick={() => {
                this.handleChangeMode('take-profit')
                this.setState({ orderMode: 'TIF' })
              }}
            >
              Take-Profit
            </TerminalModeButton>
            <SmartOrderModeButton
              isActive={mode === 'smart'}
              onClick={() => {
                this.handleChangeMode('smart')
                updateTerminalViewMode('smartOrderMode')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ paddingRight: '1rem' }}>Smart Trade</span>
              </div>
            </SmartOrderModeButton>
          </TerminalHeader>

          {!isSPOTMarket && (
            <TerminalHeader key={'futuresTerminal'} style={{ display: 'flex' }}>
              <SettingsContainer>
                {mode === 'limit' && (
                  <FuturesSettings key="postOnlyTerminalController">
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
                    <SettingsLabel htmlFor="postOnly">post only</SettingsLabel>
                  </FuturesSettings>
                )}

                {mode !== 'market' && (
                  <FuturesSettings key="TIFTerminalController">
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
                    <SettingsLabel htmlFor="TIF">TIF</SettingsLabel>
                    <StyledSelect
                      disabled={orderMode !== 'TIF'}
                      value={this.state.TIFMode}
                      onChange={(e) =>
                        this.setState({ TIFMode: e.target.value })
                      }
                    >
                      <StyledOption>GTC</StyledOption>
                      <StyledOption>IOC</StyledOption>
                      <StyledOption>FOK</StyledOption>
                    </StyledSelect>
                  </FuturesSettings>
                )}

                <FuturesSettings key="reduceTerminalController">
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
                  <SettingsLabel htmlFor="reduceOnly">
                    reduce only
                  </SettingsLabel>
                </FuturesSettings>

                {(mode === 'stop-limit' || mode === 'take-profit') && (
                  <FuturesSettings
                    key="triggerTerminalController"
                    style={{ padding: '0 1rem' }}
                  >
                    {/* <SettingsLabel htmlFor="trigger">trigger</SettingsLabel> */}
                    <StyledSelect
                      id="trigger"
                      onChange={(e) =>
                        this.setState({ trigger: e.target.value })
                      }
                    >
                      <StyledOption>last price</StyledOption>
                      <StyledOption>mark price</StyledOption>
                    </StyledSelect>
                  </FuturesSettings>
                )}
              </SettingsContainer>
              <LeverageContainer>
                <LeverageTitle>leverage:</LeverageTitle>
                <SmallSlider
                  min={1}
                  max={maxLeverage.get(`${pair[0]}_${pair[1]}`) || 75}
                  defaultValue={startLeverage}
                  value={leverage}
                  valueSymbol={'X'}
                  marks={
                    maxLeverage.get(`${pair[0]}_${pair[1]}`) !== 125
                      ? {
                          1: {},
                          15: {},
                          30: {},
                          45: {},
                          60: {},
                          75: {},
                        }
                      : {
                          1: {},
                          25: {},
                          50: {},
                          75: {},
                          100: {},
                          125: {},
                        }
                  }
                  onChange={(leverage: number) => {
                    this.setState({ leverage })
                  }}
                  onAfterChange={(leverage: number) => {
                    updateLeverageWithStatus(leverage)
                  }}
                  sliderContainerStyles={{
                    width: '65%',
                    margin: '0 auto',
                  }}
                  trackBeforeBackground={'#29AC80'}
                  handleStyles={{
                    width: '1.2rem',
                    height: '1.2rem',
                    border: 'none',
                    backgroundColor: '#036141',
                    marginTop: '-.45rem',
                    boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                  }}
                  dotStyles={{
                    border: 'none',
                    backgroundColor: '#ABBAD1',
                  }}
                  activeDotStyles={{
                    backgroundColor: '#29AC80',
                  }}
                />
                <LeverageLabel style={{ width: '12.5%' }}>
                  {leverage}x
                </LeverageLabel>
              </LeverageContainer>
            </TerminalHeader>
          )}

          <TerminalMainGrid item xs={12} container marketType={marketType}>
            <FullHeightGrid xs={6} item needBorderRight>
              <TerminalContainer>
                <TraidingTerminal
                  byType={'buy'}
                  operationType={'buy'}
                  priceType={mode}
                  priceFromOrderbook={priceFromOrderbook}
                  isSPOTMarket={isSPOTMarket}
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
                  addLoaderToButton={this.addLoaderToButton}
                  orderIsCreating={orderIsCreating}
                  showOrderResult={showOrderResult}
                  leverage={leverage}
                  reduceOnly={reduceOnly}
                  orderMode={orderMode}
                  TIFMode={TIFMode}
                  trigger={trigger}
                />
              </TerminalContainer>
            </FullHeightGrid>

            <FullHeightGrid xs={6} item>
              <TerminalContainer>
                <TraidingTerminal
                  byType={'sell'}
                  operationType={'sell'}
                  priceType={mode}
                  priceFromOrderbook={priceFromOrderbook}
                  isSPOTMarket={isSPOTMarket}
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
                  addLoaderToButton={this.addLoaderToButton}
                  orderIsCreating={orderIsCreating}
                  showOrderResult={showOrderResult}
                  leverage={leverage}
                  reduceOnly={reduceOnly}
                  orderMode={orderMode}
                  TIFMode={TIFMode}
                  trigger={trigger}
                />
              </TerminalContainer>
            </FullHeightGrid>
          </TerminalMainGrid>
        </CustomCard>
      </Grid>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
