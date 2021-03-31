import React from 'react'
import { SERUM_ORDERS_BY_TV_ALERTS } from '@core/graphql/subscriptions/SERUM_ORDERS_BY_TV_ALERTS'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { isFuturesWarsKey } from '@core/graphql/queries/futureWars/isFuturesWarsKey'

import TraidingTerminal from '../TraidingTerminal'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import { client } from '@core/graphql/apolloClient'

import {
  SRadio,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import RoboHead from '@icons/roboHead.svg'
import Bell from '@icons/bell.svg'

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
import { TradingViewBotTerminalMemo } from './TradingViewBotTerminal'
import { withPublicKey } from '@core/hoc/withPublicKey'

const generateToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15)

class SimpleTabs extends React.Component {
  state = {
    side: 'buy',
    mode: 'market',
    leverage: false,
    reduceOnly: false,
    orderMode: 'ioc',
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

    if (
      prevProps.intervalId !== this.props.intervalId &&
      this.props.intervalId === null
    ) {
      this.setState({ tradingBotEnabled: false, tradingBotIsActive: false })
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

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
          const {
            type,
            side,
            amount,
            price,
          } = data.data.listenSerumOrdersByTVAlerts

          const variables =
            type === 'limit'
              ? { limit: price, price, amount: amount }
              : type === 'market'
              ? { amount: amount }
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
      chartPagePopup,
      closeChartPagePopup,
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
      updateIntervalId,
      publicKey,
      connected,
      SOLAmount,
      openOrdersAccount,
      minOrderSize,
      market,
      wallet,
    } = this.props

    const isSPOTMarket = isSPOTMarketType(marketType)
    const maxAmount = [funds[1].quantity, funds[0].quantity]

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
                  theme={theme}
                  active={mode === 'market'}
                  onClick={() => {
                    this.setState({
                      mode: 'market',
                      orderMode: 'ioc',
                      TVAlertsBotEnabled: false,
                    })
                  }}
                >
                  Market
                </TerminalModeButton>
                <TerminalModeButton
                  style={{ width: '10rem' }}
                  theme={theme}
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
              </div>
              <div
                style={{
                  width: mode === '' ? '20%' : mode === 'limit' ? '45%' : '37%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                {mode === 'market' ? (
                  <DarkTooltip
                    maxWidth={'35rem'}
                    title={
                      'A limit order for a price higher than the purchase price of the percentage you specify will be placed immediately after purchase, so you take profit from SRM trading.'
                    }
                  >
                    <AdditionalSettingsButton
                      theme={theme}
                      style={{
                        margin: '0',
                        border: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      isActive={false}
                      needHover={false}
                      onClick={() => {
                        this.updateState('takeProfit', !takeProfit)
                        this.updateState('breakEvenPoint', !breakEvenPoint)
                      }}
                    >
                      <SCheckbox
                        checked={takeProfit}
                        disabled={mode === 'limit'}
                        onChange={() => {}}
                        style={{
                          padding: '0 0.8rem 0 0',
                        }}
                      />
                      <span
                        style={{
                          margin: mode === 'limit' ? '0 auto' : '0',
                          fontFamily: 'Avenir Next Demi',
                        }}
                      >
                        Take Profit
                      </span>
                    </AdditionalSettingsButton>
                  </DarkTooltip>
                ) : null}

                {isSPOTMarket && mode === 'limit' ? (
                  <TerminalHeader
                    key={'futuresTerminal'}
                    style={{ display: 'flex', border: 'none' }}
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
                                orderMode:
                                  orderMode === 'postOnly' ? '' : 'postOnly',
                                TIFMode: 'GTX',
                              })
                            }
                          />
                          <SettingsLabel
                            style={{
                              whiteSpace: 'nowrap',
                              textTransform: 'capitalize',
                              color: '#7284A0',
                              fontSize: '1.1rem',
                              fontFamily: 'Avenir Next Medium',
                            }}
                            theme={theme}
                            htmlFor="postOnly"
                          >
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
                          <SettingsLabel
                            style={{
                              whiteSpace: 'nowrap',
                              color: '#7284A0',
                              fontSize: '1.1rem',
                              fontFamily: 'Avenir Next Medium',
                            }}
                            theme={theme}
                            htmlFor="ioc"
                          >
                            ioc
                          </SettingsLabel>
                        </FuturesSettings>
                      )}
                    </SettingsContainer>
                  </TerminalHeader>
                ) : null}
                <TerminalModeButton
                  theme={theme}
                  style={{
                    width: mode === 'limit' ? '26rem' : '16rem',
                    borderLeft: theme.palette.border.main,
                    ...(TVAlertsBotIsActive
                      ? { backgroundColor: '#F07878', color: '#fff' }
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
                      ...(TVAlertsBotIsActive ? { TVAlertsBotIsActive: false} : {}),
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
                </TerminalModeButton>
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
                  updateState={this.updateState}
                />
              ) : (
                <>
                  <FullHeightGrid
                    theme={theme}
                    xs={6}
                    item
                    needBorderRight={!tradingBotEnabled}
                  >
                    <TerminalContainer>
                      <TraidingTerminal
                        byType={'buy'}
                        spread={spread}
                        theme={theme}
                        sideType={'buy'}
                        priceType={mode}
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
                        changePercentage={(value) =>
                          this.handleChangePercentage(value, 'Buy')
                        }
                        wallet={wallet}
                        market={market}
                        pair={pair}
                        funds={funds}
                        lockedAmount={0}
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
                                    <b>For example:</b> you set 10% stop loss
                                    and 1 minute timeout. When your unrealized
                                    loss is 10% timeout will give a minute for a
                                    chance to reverse trend and loss to go below
                                    10% before stop loss order executes.
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
                                    <b>For example:</b> you set 10% stop loss
                                    and 1 minute timeout. When your unrealized
                                    loss is 10% timeout will give a minute for a
                                    chance to reverse trend and loss to go below
                                    10% before stop loss order executes.
                                  </p>
                                </>
                              }
                              title={"Bot's lifetime"}
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
                                      this.updateState(
                                        'tradingBotTotalTime',
                                        720
                                      )
                                    } else {
                                      this.updateState(
                                        'tradingBotTotalTime',
                                        e.target.value
                                      )
                                    }
                                  }}
                                  inputStyles={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                  }}
                                  // disabled={!stopLoss.timeout.whenLossableOn}
                                />
                                <BlueSlider
                                  theme={theme}
                                  showMarks={false}
                                  value={tradingBotTotalTime}
                                  valueSymbol={'min'}
                                  min={0}
                                  max={720}
                                  sliderContainerStyles={{
                                    width: 'calc(50% - 1.5rem)',
                                    margin: '0 .5rem 0 1rem',
                                  }}
                                  onChange={(value) => {
                                    this.updateState(
                                      'tradingBotTotalTime',
                                      value
                                    )
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
                          sideType={'sell'}
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
                          changePercentage={(value) =>
                            this.handleChangePercentage(value, 'Sell')
                          }
                          pair={pair}
                          funds={funds}
                          lockedAmount={0}
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
                </>
              )}
            </div>
          </TerminalMainGrid>
        </CustomCard>
      </Grid>
    )
  }
}

export default compose(withErrorFallback, withPublicKey)(SimpleTabs)
