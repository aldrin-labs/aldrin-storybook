import React from 'react'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { isFuturesWarsKey } from '@core/graphql/queries/futureWars/isFuturesWarsKey'

import TraidingTerminal from '../TraidingTerminal'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import {
  SRadio,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import RoboHead from '@icons/roboHead.svg'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { SendButton } from '../TraidingTerminal/styles'

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
  SpotBalanceSpan,
  FuturesSettings,
  DropdownItemsBlock,
  TerminalModeButtonWithDropdown,
} from './styles'

import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import FirstVisitPopup from '@sb/compositions/Chart/components/FirstVisitPopup'
import SvgIcon from '@sb/components/SvgIcon'
import { TradeInputContent } from '@sb/components/TraidingTerminal/index'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import {
  InputRowContainer,
  AdditionalSettingsButton,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'

class SimpleTabs extends React.Component {
  state = {
    operation: 'buy',
    mode: 'market',
    leverage: false,
    reduceOnly: false,
    orderMode: 'ioc',
    TIFMode: 'GTC',
    trigger: 'last price',
    orderIsCreating: false,
    takeProfit: false,
    takeProfitPercentage: 0,
    breakEvenPoint: true,
    tradingBotEnabled: false,
    tradingBotIsActive: false,
    tradingBotInterval: 45,
    tradingBotTotalTime: 60,
  }

  static getDerivedStateFromProps(props, state) {
    const { componentLeverage } = props
    const { leverage: stateLeverage } = state

    if (!stateLeverage) {
      return {
        leverage: componentLeverage,
      }
    } else {
      return null
    }
  }

  updateState = (name, property) => {
    this.setState({ [name]: property })
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.mode !== 'market' && this.props.price !== nextProps.price) {
      return false
    }

    return true
  }

  componentDidMount() {
    this.setState({
      leverage: this.props.componentLeverage,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.componentLeverage !== this.props.componentLeverage) {
      this.setState({ leverage: this.props.componentLeverage })
    }

    if (prevProps.intervalId !== this.props.intervalId && this.props.intervalId === null) {
      this.setState({ tradingBotEnabled: false, tradingBotIsActive: false })
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
      takeProfit,
      breakEvenPoint,
      takeProfitPercentage,
      tradingBotEnabled,
      tradingBotIsActive,
      tradingBotInterval,
      tradingBotTotalTime
    } = this.state

    const {
      pair,
      funds,
      price,
      theme,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
      marketType,
      hedgeMode,
      enqueueSnackbar,
      chartPagePopup,
      closeChartPagePopup,
      leverage: startLeverage,
      componentMarginType,
      priceFromOrderbook,
      quantityPrecision,
      pricePrecision,
      minSpotNotional,
      minFuturesStep,
      marketPriceAfterPairChange,
      updateTerminalViewMode,
      updateLeverage,
      changePositionModeWithStatus,
      changeMarginTypeWithStatus,
      maxLeverage,
      intervalId,
      updateIntervalId
    } = this.props

    const isSPOTMarket = isSPOTMarketType(marketType)
    const maxAmount = [funds[1].quantity, funds[0].quantity]

    const lockedPositionBothAmount = isSPOTMarket
      ? 0
      : (
        funds[2].find((position) => position.positionSide === 'BOTH') || {
          positionAmt: 0,
        }
      ).positionAmt

    const lockedPositionShortAmount = isSPOTMarket
      ? 0
      : (
        funds[2].find((position) => position.positionSide === 'SHORT') || {
          positionAmt: 0,
        }
      ).positionAmt

    const lockedPositionLongAmount = isSPOTMarket
      ? 0
      : (
        funds[2].find((position) => position.positionSide === 'LONG') || {
          positionAmt: 0,
        }
      ).positionAmt

    return (
      <Grid
        id="tradingTerminal"
        item
        xs={12}
        style={{ height: '100%', padding: '0 0 0 0' }}
      >
        <CustomCard theme={theme} style={{ borderTop: 0 }}>
          <TerminalHeader
            key={'spotTerminal'}
            style={{ display: 'flex' }}
            theme={theme}
          >
            <div style={{ width: '100%' }}>
              <TerminalModeButton
                theme={theme}
                active={mode === 'market'}
                onClick={() => {
                  this.handleChangeMode('market')
                  this.setState({
                    orderMode: 'ioc',
                  })
                }}
              >
                Market
              </TerminalModeButton>
              <TerminalModeButton
                theme={theme}
                active={mode === 'limit'}
                onClick={() => {
                  this.handleChangeMode('limit')
                  this.setState({
                    orderMode: 'TIF',
                    tradingBotEnabled: false,
                  })
                }}
              >
                Limit
              </TerminalModeButton>
              {pair.join('_') === 'SRM_USDT' && <TerminalModeButton
                theme={theme}
                active={tradingBotEnabled}
                style={{
                  width: '25%',
                  position: 'absolute',
                  right: 0,
                  ...(tradingBotIsActive ? { backgroundColor: '#F07878' } : {}),
                }}
                onClick={() => {
                  if (tradingBotIsActive) {
                    clearInterval(intervalId)
                    updateIntervalId(null)
                    this.setState({ tradingBotIsActive: false })
                  } else {
                    this.setState((prev) => ({
                      tradingBotEnabled: !prev.tradingBotEnabled,
                      tradingBotIsActive: false,
                      orderMode: 'ioc',
                      mode: 'market',
                    }))
                  }
                }}
              >
                <SvgIcon
                  src={RoboHead}
                  height={'100%'}
                  width={'2rem'}
                  style={{ position: 'absolute', left: '1rem', top: 0 }}
                />
                {tradingBotIsActive ? 'Stop Cycle BOT' : 'Use Cycle BOT'}
              </TerminalModeButton>}
              {/* <DarkTooltip
                maxWidth={'35rem'}
                title={
                  'Maker-only or post-only market order will place a post-only limit orders as close to the market price as possible until the last one is executed. This way you can enter the position at the market price by paying low maker fees.'
                }
              >
                <TerminalModeButton
                  theme={theme}
                  active={mode === 'maker-only'}
                  onClick={() => this.handleChangeMode('maker-only')}
                >
                  Maker-only
                </TerminalModeButton>
              </DarkTooltip> */}
            </div>
          </TerminalHeader>

          {isSPOTMarket && mode === 'limit' ? (
            <TerminalHeader
              key={'futuresTerminal'}
              style={{ display: 'flex' }}
              theme={theme}
            >
              <SettingsContainer>
                {mode === 'limit' && (
                  <FuturesSettings key="postOnlyTerminalController">
                    <SCheckbox
                      id="postOnly"
                      checked={orderMode === 'postOnly'}
                      style={{ padding: '0 1rem' }}
                      onChange={() =>
                        this.setState({
                          orderMode: orderMode === 'postOnly' ? '' : 'postOnly',
                          TIFMode: 'GTX',
                        })
                      }
                    />
                    <SettingsLabel theme={theme} htmlFor="postOnly">
                      post only
                    </SettingsLabel>
                  </FuturesSettings>
                )}

                {mode === 'limit' && (
                  <FuturesSettings
                    key="iocTerminalController"
                    style={{ padding: '.4rem 0' }}
                  >
                    <SCheckbox
                      id="ioc"
                      checked={orderMode === 'ioc'}
                      style={{ padding: '0 1rem' }}
                      onChange={() =>
                        this.setState({
                          orderMode: orderMode === 'ioc' ? '' : 'ioc',
                        })
                      }
                    />
                    <SettingsLabel theme={theme} htmlFor="ioc">
                      ioc
                    </SettingsLabel>
                  </FuturesSettings>
                )}
              </SettingsContainer>
            </TerminalHeader>
          ) : null}

          <TerminalMainGrid item xs={12} container marketType={marketType}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <FullHeightGrid
                theme={theme}
                xs={6}
                item
                needBorderRight={!tradingBotEnabled}
              >
                <TerminalContainer>
                  <TraidingTerminal
                    byType={'buy'}
                    theme={theme}
                    operationType={'buy'}
                    priceType={mode}
                    hedgeMode={hedgeMode}
                    pricePrecision={pricePrecision}
                    quantityPrecision={quantityPrecision}
                    minSpotNotional={minSpotNotional}
                    minFuturesStep={minFuturesStep}
                    priceFromOrderbook={priceFromOrderbook}
                    marketPriceAfterPairChange={marketPriceAfterPairChange}
                    isSPOTMarket={isSPOTMarket}
                    enqueueSnackbar={enqueueSnackbar}
                    changePercentage={(value) =>
                      this.handleChangePercentage(value, 'Buy')
                    }
                    pair={pair}
                    funds={funds}
                    lockedAmount={
                      hedgeMode
                        ? -lockedPositionShortAmount
                        : lockedPositionBothAmount >= 0
                          ? 0
                          : -lockedPositionBothAmount
                    }
                    key={[pair, funds]}
                    walletValue={funds && funds[1]}
                    marketPrice={price}
                    confirmOperation={placeOrder}
                    cancelOrder={cancelOrder}
                    tradingBotEnabled={tradingBotEnabled}
                    tradingBotInterval={tradingBotInterval}
                    tradingBotIsActive={tradingBotIsActive}
                    tradingBotTotalTime={tradingBotTotalTime}
                    {...{
                      trigger,
                      TIFMode,
                      orderMode,
                      reduceOnly,
                      leverage,
                      takeProfit,
                      decimals,
                      showOrderResult,
                      orderIsCreating,
                      takeProfitPercentage,
                      breakEvenPoint,
                      cancelOrder,
                      addLoaderToButton: this.addLoaderToButton,
                      updateState: this.updateState,
                    }}
                  />
                </TerminalContainer>
              </FullHeightGrid>

              {tradingBotEnabled && !tradingBotIsActive ? (
                <FullHeightGrid theme={theme} xs={6} item>
                  <TerminalContainer>
                    <Grid
                      item
                      container
                      xs={8}
                      style={{ maxWidth: '100%', height: '66.666667%' }}
                    >
                      <InputRowContainer
                        direction="column"
                        style={{ margin: 'auto 0', width: '100%' }}
                      >
                        <FormInputContainer
                          theme={theme}
                          haveTooltip={false}
                          tooltipText={
                            <>
                              <p>
                                Waiting after unrealized P&L will reach set
                                target.
                              </p>
                              <p>
                                <b>For example:</b> you set 10% stop loss and 1
                                minute timeout. When your unrealized loss is 10%
                                timeout will give a minute for a chance to
                                reverse trend and loss to go below 10% before
                                stop loss order executes.
                              </p>
                            </>
                          }
                          title={'Buy SRM Each'}
                          lineMargin={'0 1.2rem 0 1rem'}
                          style={{
                            borderBottom: theme.palette.border.main,
                            padding: '1rem 0',
                          }}
                        >
                          <InputRowContainer>
                            <DarkTooltip
                              maxWidth={'35rem'}
                              title={
                                'As soon as you purchase SRM, there are will be placed a limit order for sale at a price that will refund the fees you paid.'
                              }
                            >
                              <AdditionalSettingsButton
                                theme={theme}
                                isActive={breakEvenPoint}
                                fontSize={'1rem'}
                                onClick={() => {
                                  this.updateState('takeProfit', false)
                                  this.updateState(
                                    'breakEvenPoint',
                                    !breakEvenPoint
                                  )
                                }}
                              >
                                <SCheckbox
                                  checked={breakEvenPoint}
                                  onChange={() => { }}
                                  style={{
                                    padding: '0 0 0 1rem',
                                    color: '#fff',
                                  }}
                                />
                                <span style={{ margin: '0 auto' }}>
                                  Break-Even Point
                                  </span>
                              </AdditionalSettingsButton>
                            </DarkTooltip>
                            <DarkTooltip
                              maxWidth={'35rem'}
                              title={
                                'A limit order for a price higher than the purchase price of the percentage you specify will be placed immediately after purchase, so you will not only farm DCFI but also take profit from SRM trading.'
                              }
                            >
                              <AdditionalSettingsButton
                                theme={theme}
                                isActive={takeProfit}
                                onClick={() => {
                                  this.updateState('takeProfit', !takeProfit)
                                  this.updateState('breakEvenPoint', false)
                                }}
                              >
                                <SCheckbox
                                  checked={takeProfit}
                                  onChange={() => { }}
                                  style={{
                                    padding: '0 0 0 1rem',
                                    color: '#fff',
                                  }}
                                />
                                <span style={{ margin: '0 auto' }}>
                                  Take Profit
                                </span>
                              </AdditionalSettingsButton>
                            </DarkTooltip>
                          </InputRowContainer>

                          {takeProfit && (
                            <InputRowContainer>
                              <TradeInputContent
                                theme={theme}
                                padding={'0 1.5% 0 0'}
                                width={'calc(50%)'}
                                symbol={'%'}
                                title={'TP'}
                                textAlign={'right'}
                                needTitle={true}
                                value={takeProfitPercentage}
                                onChange={(e) => {
                                  this.updateState(
                                    'takeProfitPercentage',
                                    e.target.value
                                  )
                                }}
                              />

                              <BlueSlider
                                theme={theme}
                                value={takeProfitPercentage * 20}
                                sliderContainerStyles={{
                                  width: '50%',
                                  margin: '0 0 0 1.5%',
                                }}
                                onChange={(value) => {
                                  this.updateState(
                                    'takeProfitPercentage',
                                    value / 20
                                  )
                                }}
                              />
                            </InputRowContainer>
                          )}
                        </FormInputContainer>
                        <FormInputContainer
                          theme={theme}
                          haveTooltip={false}
                          tooltipText={
                            <>
                              <p>
                                Waiting after unrealized P&L will reach set
                                target.
                              </p>
                              <p>
                                <b>For example:</b> you set 10% stop loss and 1
                                minute timeout. When your unrealized loss is 10%
                                timeout will give a minute for a chance to
                                reverse trend and loss to go below 10% before
                                stop loss order executes.
                              </p>
                            </>
                          }
                          title={'Bot\'s lifetime'}
                          lineMargin={'0 1.2rem 0 1rem'}
                          style={{
                            borderBottom: theme.palette.border.main,
                            padding: '1rem 0',
                          }}
                        >
                          <InputRowContainer>
                            <TradeInputContent
                              theme={theme}
                              haveSelector
                              symbol={'min'}
                              // width={'calc(55% - .4rem)'}
                              width={'calc(50% - .4rem)'}
                              value={tradingBotTotalTime}
                              onChange={(e) => {
                                if (+e.target.value > 720) {
                                  this.updateState('tradingBotTotalTime', 720)
                                } else {
                                  this.updateState('tradingBotTotalTime', e.target.value)
                                }
                              }}
                              inputStyles={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                              }}
                            // disabled={!stopLoss.timeout.whenLossableOn}
                            />
                            {/* <Select
                  theme={theme}
                  width={'calc(25% - .8rem)'}
                  // width={'calc(30% - .4rem)'}
                  value={stopLoss.timeout.whenLossableMode}
                  inputStyles={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  onChange={(e) => {
                    this.updateSubBlockValue(
                      'stopLoss',
                      'timeout',
                      'whenLossableMode',
                      e.target.value
                    )
                  }}
                // isDisabled={!stopLoss.timeout.whenLossableOn}
                >
                  <option>sec</option>
                  <option>min</option>
                </Select> */}
                            <BlueSlider
                              theme={theme}
                              showMarks={false}
                              value={
                                tradingBotTotalTime
                              }
                              valueSymbol={'min'}
                              min={0}
                              max={720}
                              sliderContainerStyles={{
                                width: 'calc(50% - 1.5rem)',
                                margin: '0 .5rem 0 1rem',
                              }}
                              onChange={(value) => {
                                this.updateState('tradingBotTotalTime', value)
                              }}
                            />
                          </InputRowContainer>
                        </FormInputContainer>
                      </InputRowContainer>
                    </Grid>
                  </TerminalContainer>
                </FullHeightGrid>
              ) : (
                  <FullHeightGrid theme={theme} xs={6} item>
                    <TerminalContainer>
                      <TraidingTerminal
                        byType={'sell'}
                        operationType={'sell'}
                        priceType={mode}
                        theme={theme}
                        hedgeMode={hedgeMode}
                        pricePrecision={pricePrecision}
                        quantityPrecision={quantityPrecision}
                        minSpotNotional={minSpotNotional}
                        minFuturesStep={minFuturesStep}
                        priceFromOrderbook={priceFromOrderbook}
                        marketPriceAfterPairChange={marketPriceAfterPairChange}
                        isSPOTMarket={isSPOTMarket}
                        enqueueSnackbar={enqueueSnackbar}
                        changePercentage={(value) =>
                          this.handleChangePercentage(value, 'Sell')
                        }
                        pair={pair}
                        funds={funds}
                        lockedAmount={
                          hedgeMode
                            ? lockedPositionLongAmount
                            : lockedPositionBothAmount <= 0
                              ? 0
                              : lockedPositionBothAmount
                        }
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
                        updateState={this.updateState}
                      />
                    </TerminalContainer>
                  </FullHeightGrid>
                )}
            </div>
          </TerminalMainGrid>
        </CustomCard>
      </Grid>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
