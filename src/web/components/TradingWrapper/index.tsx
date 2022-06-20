import { Grid } from '@material-ui/core'
import React from 'react'
import { compose } from 'recompose'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import BlueSlider from '@sb/components/Slider/BlueSlider'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import TraidingTerminal, {
  TradeInputContent,
} from '@sb/components/TraidingTerminal/index'
import { CustomCard } from '@sb/compositions/Chart/Chart.styles'
import { FormInputContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/InputComponents'
import { InputRowContainer } from '@sb/compositions/Chart/components/SmartOrderTerminal/styles'
import { withErrorFallback } from '@sb/hoc'
import { withPublicKey } from '@sb/hoc/withPublicKey'

import { client } from '@core/graphql/apolloClient'
import { SERUM_ORDERS_BY_TV_ALERTS } from '@core/graphql/subscriptions/SERUM_ORDERS_BY_TV_ALERTS'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'

import {
  TerminalContainer,
  TerminalMainGrid,
  FullHeightGrid,
  TerminalHeader,
  TerminalModeButton,
  SettingsContainer,
  SettingsLabel,
  FuturesSettings,
  BuyTerminal,
  SellTerminal,
  TerminalComponentsContainer,
} from './styles'
import { TradingViewBotTerminalMemo } from './TradingViewBotTerminal'

const generateToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)

class SimpleTabs extends React.Component<any, any> {
  state: {
    mode: 'market' | 'limit'
  } = {
    side: 'buy',
    mode: 'limit',
    leverage: false,
    reduceOnly: false,
    orderMode: 'TIF',
    TIFMode: 'GTC',
    trigger: 'last price',
    orderIsCreating: false,
    takeProfit: false,
    takeProfitPercentage: 0,
    breakEvenPoint: false,
    tradingBotEnabled: false,
    TVAlertsBotEnabled: false,
    tradingBotIsActive: false,
    TVAlertsBotIsActive: false,
    tradingBotInterval: 45,
    tradingBotTotalTime: 60,
    token: generateToken(),
  }

  static getDerivedStateFromProps(props, state) {
    const { componentLeverage } = props
    const { leverage: stateLeverage } = state

    if (!stateLeverage) {
      return {
        leverage: componentLeverage,
      }
    }
    return null
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

    if (
      prevProps.intervalId !== this.props.intervalId &&
      this.props.intervalId === null
    ) {
      this.setState({ tradingBotEnabled: false, tradingBotIsActive: false })
    }

    if (
      prevProps.wallet.connected &&
      this.props.wallet.connected &&
      this.state.TVAlertsBotIsActive
    ) {
      this.unsubscribe()

      this.setState((prev) => ({
        TVAlertsBotEnabled: false,
        mode: 'market',
        TVAlertsBotIsActive: false,
      }))
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  updateWrapperState = (newState: { [key: string]: any }) =>
    this.setState(newState)

  subscribe = () => {
    const that = this

    this.subscription = client
      .subscribe({
        query: SERUM_ORDERS_BY_TV_ALERTS,
        variables: {
          serumOrdersByTVAlertsInput: {
            publicKey: this.props.publicKey,
            token: this.state.token,
          },
        },
        fetchPolicy: 'cache-first',
      })
      .subscribe({
        next: (data: { loading: boolean; data: any }) => {
          const { type, side, amount, price } =
            data.data.listenSerumOrdersByTVAlerts

          const variables =
            type === 'limit'
              ? { limit: price, price, amount }
              : type === 'market'
              ? { amount }
              : {}

          that.props.placeOrder(side, type, variables, {
            orderMode: type === 'market' ? 'ioc' : 'limit',
            takeProfit: false,
            takeProfitPercentage: 0,
            breakEvenPoint: false,
            tradingBotEnabled: false,
            tradingBotInterval: 0,
            tradingBotTotalTime: 0,
          })
        },
      })
  }

  unsubscribe = () => {
    this.subscription && this.subscription.unsubscribe()
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
      side,
      token,
      breakEvenPoint,
      takeProfitPercentage,
      tradingBotEnabled,
      TVAlertsBotEnabled,
      tradingBotIsActive,
      TVAlertsBotIsActive,
      tradingBotInterval,
      tradingBotTotalTime,
    } = this.state

    const {
      pair,
      funds,
      price,
      theme,
      placeOrder,
      decimals,
      spread,
      showOrderResult,
      cancelOrder,
      marketType,
      hedgeMode,
      enqueueSnackbar,
      priceFromOrderbook,
      quantityPrecision,
      pricePrecision,
      minSpotNotional,
      minFuturesStep,
      marketPriceAfterPairChange,
      publicKey,
      connected,
      SOLAmount,
      openOrdersAccount,
      minOrderSize,
      market,
      wallet,
      setAutoConnect,
      providerUrl,
      setProvider,
      terminalViewMode,
      baseCurrencyAccount,
      quoteCurrencyAccount,
      isButtonLoaderShowing,
      newTheme,
    } = this.props

    const isSPOTMarket = isSPOTMarketType(marketType)
    const maxAmount = [funds[1].quantity, funds[0].quantity]
    return (
      <TerminalComponentsContainer
        terminalViewMode={terminalViewMode}
        id="tradingTerminal"
        item
        xs={12}
        style={{ height: '100%', padding: '0' }}
      >
        <CustomCard style={{ borderTop: 0, overflow: 'unset' }}>
          <TerminalHeader
            key="spotTerminal"
            // style={{ display: 'flex' }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <TerminalModeButton
                  style={{ width: '10rem' }}
                  active={mode === 'limit'}
                  onClick={() => {
                    this.setState({
                      mode: 'limit',
                      orderMode: 'TIF',
                      tradingBotEnabled: false,
                      TVAlertsBotEnabled: false,
                    })

                    this.updateState('takeProfit', false)
                  }}
                >
                  Limit
                </TerminalModeButton>
                <TerminalModeButton
                  style={{ width: '10rem' }}
                  active={mode === 'market'}
                  onClick={() => {
                    this.setState({
                      mode: 'market',
                      orderMode: 'ioc',
                      TVAlertsBotEnabled: false,
                      takeProfit: false,
                    })
                  }}
                >
                  Market
                </TerminalModeButton>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                {mode === 'market' ? (
                  <DarkTooltip
                    maxWidth="35rem"
                    title="A limit order for a price higher than the purchase price of the percentage you specify will be placed immediately after purchase, so you take profit from SRM trading."
                  >
                    <FuturesSettings
                      theme={theme}
                      style={{
                        padding: '0 2rem 0 0',
                      }}
                    >
                      <SCheckbox
                        id="takeProfitButton"
                        checked={takeProfit}
                        disabled={mode === 'limit'}
                        onChange={() => {
                          this.setState({ takeProfit: !takeProfit })
                        }}
                        style={{
                          padding: '0 0.8rem 0 0',
                        }}
                      />
                      <SettingsLabel htmlFor="takeProfitButton">
                        Take Profit
                      </SettingsLabel>
                    </FuturesSettings>
                  </DarkTooltip>
                ) : null}

                {mode === 'limit' ? (
                  <TerminalHeader
                    key="futuresTerminal"
                    style={{ display: 'flex', border: 'none' }}
                  >
                    <SettingsContainer>
                      <FuturesSettings key="postOnlyTerminalController">
                        <SCheckbox
                          id="postOnly"
                          checked={orderMode === 'postOnly'}
                          style={{ padding: '0 1rem' }}
                          onChange={() =>
                            this.setState({
                              orderMode:
                                orderMode === 'postOnly' ? '' : 'postOnly',
                              TIFMode: 'GTX',
                            })
                          }
                        />
                        <SettingsLabel htmlFor="postOnly">
                          post only
                        </SettingsLabel>
                      </FuturesSettings>

                      <FuturesSettings
                        key="iocTerminalController"
                        style={{ padding: '.4rem 2rem .4rem 0' }}
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
                        <SettingsLabel
                          htmlFor="ioc"
                          style={{ textTransform: 'uppercase' }}
                        >
                          ioc
                        </SettingsLabel>
                      </FuturesSettings>
                    </SettingsContainer>
                  </TerminalHeader>
                ) : null}
                {/* <TerminalModeButton
                  theme={theme}
                  style={{
                    width: 'auto',
                    height: '100%',
                    padding: TVAlertsBotIsActive ? '0 4rem ' : '0 4rem 0 6rem',
                    borderRight: 0,
                    borderLeft: theme.palette.border.main,
                    ...(TVAlertsBotIsActive
                      ? {
                          backgroundColor: '#F07878',
                          color: '#fff',
                          borderBottom: '0',
                        }
                      : {}),
                  }}
                  active={TVAlertsBotEnabled}
                  onClick={() => {
                    if (TVAlertsBotIsActive) {
                      this.unsubscribe()
                    }

                    this.setState((prev) => ({
                      TVAlertsBotEnabled: !prev.TVAlertsBotEnabled,
                      // tradingBotEnabled: false,
                      mode: prev.TVAlertsBotEnabled ? 'market' : '',
                      ...(TVAlertsBotIsActive
                        ? { TVAlertsBotIsActive: false }
                        : {}),
                    }))
                  }}
                >
                  {!TVAlertsBotIsActive && (
                    <SvgIcon
                      src={Bell}
                      height={'100%'}
                      width={'1.5rem'}
                      style={{
                        position: 'absolute',
                        right: '12rem',
                        top: 0,
                      }}
                    />
                  )}
                  {TVAlertsBotIsActive ? 'Stop Alert BOT' : 'Alert BOT'}
                </TerminalModeButton> */}
                {/* {pair.join('_') === 'SRM_USDT' && (
                  <TerminalModeButton
                    theme={theme}
                    active={tradingBotEnabled}
                    style={{
                      width: '17rem',
                      ...(tradingBotIsActive
                        ? { backgroundColor: '#F07878' }
                        : {}),
                    }}
                    onClick={() => {
                      if (tradingBotIsActive) {
                        clearInterval(intervalId)
                        updateIntervalId(null)
                        this.setState({ tradingBotIsActive: false })
                      } else {
                        this.setState((prev) => ({
                          tradingBotEnabled: !prev.tradingBotEnabled,
                          TVAlertsBotEnabled: false,
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
                      style={{ position: 'absolute', right: '14rem', top: 0 }}
                    />
                    {tradingBotIsActive ? 'Stop Cycle BOT' : 'Use Cycle BOT'}
                  </TerminalModeButton>
                )} */}
              </div>
            </div>
          </TerminalHeader>

          <TerminalMainGrid item xs={12} container marketType={marketType}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              {TVAlertsBotEnabled ? (
                <TradingViewBotTerminalMemo
                  theme={theme}
                  side={side}
                  pair={pair}
                  token={token}
                  orderType={mode}
                  marketPrice={price}
                  maxAmount={maxAmount}
                  publicKey={publicKey}
                  subscribeToTVAlert={this.subscribe}
                  quantityPrecision={quantityPrecision}
                  updateWrapperState={this.updateWrapperState}
                />
              ) : (
                <>
                  <BuyTerminal xs={6} item needBorderRight={!tradingBotEnabled}>
                    <TerminalContainer>
                      <TraidingTerminal
                        newTheme={newTheme}
                        isButtonLoaderShowing={isButtonLoaderShowing}
                        baseCurrencyAccount={baseCurrencyAccount}
                        quoteCurrencyAccount={quoteCurrencyAccount}
                        byType={side}
                        spread={spread}
                        theme={theme}
                        sideType={side}
                        priceType={mode}
                        setAutoConnect={setAutoConnect}
                        providerUrl={providerUrl}
                        setProvider={setProvider}
                        hedgeMode={hedgeMode}
                        minOrderSize={minOrderSize}
                        publicKey={publicKey}
                        connected={connected}
                        pricePrecision={pricePrecision}
                        SOLAmount={SOLAmount}
                        quantityPrecision={quantityPrecision}
                        minSpotNotional={minSpotNotional}
                        minFuturesStep={minFuturesStep}
                        openOrdersAccount={openOrdersAccount}
                        priceFromOrderbook={priceFromOrderbook}
                        marketPriceAfterPairChange={marketPriceAfterPairChange}
                        isSPOTMarket={isSPOTMarket}
                        enqueueSnackbar={enqueueSnackbar}
                        pair={pair}
                        funds={funds}
                        wallet={wallet}
                        market={market}
                        lockedAmount={0}
                        key={JSON.stringify([pair])}
                        marketPrice={price}
                        confirmOperation={placeOrder}
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
                          updateWrapperState: this.updateWrapperState,
                        }}
                      />
                    </TerminalContainer>
                  </BuyTerminal>

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
                                    <b>For example:</b> you set 10% stop loss
                                    and 1 minute timeout. When your unrealized
                                    loss is 10% timeout will give a minute for a
                                    chance to reverse trend and loss to go below
                                    10% before stop loss order executes.
                                  </p>
                                </>
                              }
                              title="Buy SRM Each"
                              lineMargin="0 1.2rem 0 1rem"
                              style={{
                                borderBottom: theme.palette.border.main,
                                padding: '1rem 0',
                              }}
                            >
                              {takeProfit && (
                                <InputRowContainer>
                                  <TradeInputContent
                                    theme={theme}
                                    padding="0 1.5% 0 0"
                                    width="calc(50%)"
                                    symbol="%"
                                    title="TP"
                                    textAlign="right"
                                    needTitle
                                    value={takeProfitPercentage}
                                    onChange={(e) => {
                                      this.setState({
                                        takeProfitPercentage: e.target.value,
                                      })
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
                                      this.setState({
                                        takeProfitPercentage: value / 20,
                                      })
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
                                    <b>For example:</b> you set 10% stop loss
                                    and 1 minute timeout. When your unrealized
                                    loss is 10% timeout will give a minute for a
                                    chance to reverse trend and loss to go below
                                    10% before stop loss order executes.
                                  </p>
                                </>
                              }
                              title={"Bot's lifetime"}
                              lineMargin="0 1.2rem 0 1rem"
                              style={{
                                borderBottom: theme.palette.border.main,
                                padding: '1rem 0',
                              }}
                            >
                              <InputRowContainer>
                                <TradeInputContent
                                  theme={theme}
                                  haveSelector
                                  symbol="min"
                                  width="calc(50% - .4rem)"
                                  value={tradingBotTotalTime}
                                  onChange={(e) => {
                                    if (+e.target.value > 720) {
                                      this.setState({
                                        tradingBotTotalTime: 720,
                                      })
                                    } else {
                                      this.setState({
                                        tradingBotTotalTime: e.target.value,
                                      })
                                    }
                                  }}
                                  inputStyles={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                  }}
                                />
                                <BlueSlider
                                  theme={theme}
                                  showMarks={false}
                                  value={tradingBotTotalTime}
                                  valueSymbol="min"
                                  min={0}
                                  max={720}
                                  sliderContainerStyles={{
                                    width: 'calc(50% - 1.5rem)',
                                    margin: '0 .5rem 0 1rem',
                                  }}
                                  onChange={(value) => {
                                    this.setState({
                                      tradingBotTotalTime: value,
                                    })
                                  }}
                                />
                              </InputRowContainer>
                            </FormInputContainer>
                          </InputRowContainer>
                        </Grid>
                      </TerminalContainer>
                    </FullHeightGrid>
                  ) : (
                    <SellTerminal theme={theme} xs={6} item>
                      <TerminalContainer>
                        <TraidingTerminal
                          newTheme={newTheme}
                          isButtonLoaderShowing={isButtonLoaderShowing}
                          baseCurrencyAccount={baseCurrencyAccount}
                          quoteCurrencyAccount={quoteCurrencyAccount}
                          byType="sell"
                          sideType="sell"
                          setAutoConnect={setAutoConnect}
                          providerUrl={providerUrl}
                          setProvider={setProvider}
                          market={market}
                          priceType={mode}
                          minOrderSize={minOrderSize}
                          theme={theme}
                          hedgeMode={hedgeMode}
                          pricePrecision={pricePrecision}
                          quantityPrecision={quantityPrecision}
                          minSpotNotional={minSpotNotional}
                          minFuturesStep={minFuturesStep}
                          connected={connected}
                          SOLAmount={SOLAmount}
                          openOrdersAccount={openOrdersAccount}
                          priceFromOrderbook={priceFromOrderbook}
                          marketPriceAfterPairChange={
                            marketPriceAfterPairChange
                          }
                          spread={spread}
                          wallet={wallet}
                          isSPOTMarket={isSPOTMarket}
                          enqueueSnackbar={enqueueSnackbar}
                          pair={pair}
                          funds={funds}
                          lockedAmount={0}
                          key={JSON.stringify([pair])}
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
                          updateWrapperState={this.updateWrapperState}
                        />
                      </TerminalContainer>
                    </SellTerminal>
                  )}
                </>
              )}
            </div>
          </TerminalMainGrid>
        </CustomCard>
      </TerminalComponentsContainer>
    )
  }
}

export default compose(withErrorFallback, withPublicKey)(SimpleTabs)
