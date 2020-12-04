import React from 'react'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import { Grid } from '@material-ui/core'
import { compose } from 'recompose'

import BasicTPSL from '@sb/components/BasicTakeProfitStopLoss/index'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { isFuturesWarsKey } from '@core/graphql/queries/futureWars/isFuturesWarsKey'

import TraidingTerminal from '../TraidingTerminal'
import SmallSlider from '@sb/components/Slider/SmallSlider'

import {
  SRadio,
  SCheckbox,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

import { SendButton } from '../TraidingTerminal/styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

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

import FirstVisitPopup from '@sb/compositions/Chart/components/FirstVisitPopup'

import { getMarks } from '@core/utils/chartPageUtils'

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
    price: 0,
    takeProfitPercentage: 0,
    stopLossPercentage: 0,
    isSLTPOn: false,
  }

  static getDerivedStateFromProps(props, state) {
    const { componentLeverage } = props
    const { leverage: stateLeverage, price: updatedPrice } = state

    if (!stateLeverage && updatedPrice === 0) {
      return {
        leverage: componentLeverage,
        price: props.price,
      }
    } else {
      return null
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.state.mode !== 'market' && this.props.price !== nextProps.price) {
      return false
    }

    return true
  }

  // componentDidMount() {
  //   this.setState({
  //     leverage: this.props.componentLeverage,
  //   })
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.componentLeverage !== this.props.componentLeverage) {
      this.setState({ leverage: this.props.componentLeverage })
    }
  }

  handleChangeMode = (mode: string) => {
    this.setState({ mode })
  }

  handleStopLossTakeProfitOn = (isSLTPOn: boolean) => {
    this.setState({ isSLTPOn })
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

  updatePrice = (price) => {
    this.setState({ price })
  }

  setStopLossPercentage = (stopLossPercentage) => {
    this.setState({ stopLossPercentage })
  }

  setTakeProfitPercentage = (takeProfitPercentage) => {
    this.setState({ takeProfitPercentage })
  }

  render() {
    const {
      mode,
      leverage,
      reduceOnly,
      orderMode,
      TIFMode,
      trigger,
      operation,
      orderIsCreating,
      price: updatedPrice,
      takeProfitPercentage,
      stopLossPercentage,
      isSLTPOn,
    } = this.state

    const {
      pair,
      funds,
      price,
      theme,
      keyId,
      placeOrder,
      decimals,
      showOrderResult,
      cancelOrder,
      marketType,
      hedgeMode,
      enqueueSnackbar,
      chartPagePopup,
      selectedKey,
      currentPosition,
      closeChartPagePopup,
      leverage: startLeverage,
      componentMarginType,
      priceFromOrderbook,
      quantityPrecision,
      minSpotNotional,
      minFuturesStep,
      marketPriceAfterPairChange,
      updateTerminalViewMode,
      updateLeverage,
      changePositionModeWithStatus,
      changeMarginTypeWithStatus,
      maxLeverage,
      pricePrecision,
    } = this.props

    // console.log('TradingWrapper componentMarginType', componentMarginType)
    const isSPOTMarket = isSPOTMarketType(marketType)
    const maxAmount = [funds[1].quantity, funds[0].quantity]

    const lockedPositionBothAmount = isSPOTMarket
      ? 0
      : (
          currentPosition.find(
            (position) => position.positionSide === 'BOTH'
          ) || {
            positionAmt: 0,
          }
        ).positionAmt

    const lockedPositionShortAmount = isSPOTMarket
      ? 0
      : (
          currentPosition.find(
            (position) => position.positionSide === 'SHORT'
          ) || {
            positionAmt: 0,
          }
        ).positionAmt

    const lockedPositionLongAmount = isSPOTMarket
      ? 0
      : (
          currentPosition.find(
            (position) => position.positionSide === 'LONG'
          ) || {
            positionAmt: 0,
          }
        ).positionAmt

    console.log('isSLTPOnTW', isSLTPOn)
    return (
      <Grid
        data-tut={'basic-terminal'}
        id="tradingTerminal"
        item
        xs={12}
        style={{ height: '100%', padding: '0 0 0 0', position: 'relative' }}
      >
        <CustomCard theme={theme} style={{ borderTop: 0 }}>
          <TerminalHeader
            key={'spotTerminal'}
            style={{ display: 'flex' }}
            theme={theme}
          >
            <div
              style={{
                width: '50%',
                height: '3rem',
                borderRight: theme.palette.border.main,
                padding: '0 1rem',
              }}
            >
              {marketType === 1 && (
                <LeverageContainer
                  theme={theme}
                  style={{
                    width: '100%',
                  }}
                >
                  <LeverageTitle>
                    <StyledSelect
                      theme={theme}
                      onChange={(e) =>
                        changeMarginTypeWithStatus(
                          componentMarginType,
                          selectedKey,
                          pair
                        )
                      }
                      value={componentMarginType}
                      style={{ color: theme.palette.dark.main }}
                    >
                      <StyledOption>cross</StyledOption>
                      <StyledOption>isolated</StyledOption>
                    </StyledSelect>
                  </LeverageTitle>
                  <SmallSlider
                    min={1}
                    max={maxLeverage}
                    defaultValue={startLeverage}
                    value={leverage}
                    valueSymbol={'X'}
                    marks={getMarks(maxLeverage)}
                    onChange={(leverage: number) => {
                      this.setState({ leverage })
                    }}
                    onAfterChange={(leverage: number) => {
                      // add args
                      updateLeverage(leverage, keyId, pair)
                    }}
                    sliderContainerStyles={{
                      width: '65%',
                      margin: '0 auto',
                    }}
                    trackBeforeBackground={theme.palette.green.main}
                    handleStyles={{
                      width: '1.2rem',
                      height: '2rem',
                      border: 'none',
                      borderRadius: '0',
                      top: '0.2rem',
                      backgroundColor: '#036141',
                      marginTop: '-.28rem',
                      boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                      transform: 'translate(-50%, -15%) !important',
                    }}
                    dotStyles={{
                      border: 'none',
                      backgroundColor: theme.palette.slider.dots,
                    }}
                    activeDotStyles={{
                      backgroundColor: theme.palette.green.main,
                    }}
                    markTextSlyles={{
                      color: theme.palette.grey.light,
                      fontSize: '1rem',
                    }}
                    railStyle={{
                      backgroundColor: theme.palette.slider.rail,
                    }}
                  />
                  <LeverageLabel theme={theme} style={{ width: '12.5%' }}>
                    {leverage}x
                  </LeverageLabel>
                </LeverageContainer>
              )}
            </div>
            {/* <TerminalModeButton
                theme={theme}
                style={{
                  width: '100%',
                  border: `.1rem solid ${theme.palette.blue.main}`,
                  color: theme.palette.blue.main,
                  borderRadius: '.4rem',
                  lineHeight: 'calc(.8rem)',
                }}
                active={mode === 'smart'}
                onClick={() => {
                  this.handleChangeMode('smart')
                  updateTerminalViewMode('smartOrderMode')
                }}
              >
                Go to Smart terminal
              </TerminalModeButton> */}

            <div style={{ width: '50%' }}>
              <TerminalModeButton
                theme={theme}
                active={mode === 'market'}
                onClick={() => this.handleChangeMode('market')}
              >
                Market
              </TerminalModeButton>
              <TerminalModeButton
                theme={theme}
                active={mode === 'limit'}
                onClick={() => this.handleChangeMode('limit')}
              >
                Limit
              </TerminalModeButton>
              {/* {!reduceOnly ? (
                <DarkTooltip
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
                </DarkTooltip>
              ) : (
                <></>
              )} */}

              {!isSPOTMarket ? (
                <TerminalModeButtonWithDropdown
                  theme={theme}
                  active={mode === 'stop-limit' || mode === 'stop-market'}
                >
                  {mode === 'stop-limit'
                    ? 'Stop-Limit'
                    : mode === 'stop-market'
                    ? 'Stop-Market'
                    : 'Stop-Limit'}
                  <ExpandMoreIcon
                    style={{
                      position: 'relative',
                      left: '.8rem',
                      top: '.2rem',
                      width: '1rem',
                      height: '.9rem',
                      fill:
                        mode !== 'stop-limit' && mode !== 'stop-market'
                          ? '#7284a0'
                          : '#fff',
                    }}
                  />
                  <DropdownItemsBlock>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <TerminalModeButton
                        theme={theme}
                        active={mode === 'stop-limit'}
                        onClick={() => {
                          this.handleChangeMode('stop-limit')
                          this.setState({
                            orderMode: 'TIF',
                            ...(orderMode === 'postOnly'
                              ? { TIFMode: 'GTC' }
                              : {}),
                          })
                        }}
                        style={{
                          width: '100%',
                          padding: '1rem 0 1rem',
                          border: theme.palette.border.main,
                        }}
                      >
                        Stop-Limit
                      </TerminalModeButton>
                      <TerminalModeButton
                        theme={theme}
                        active={mode === 'stop-market'}
                        onClick={() => {
                          this.handleChangeMode('stop-market')
                          this.setState({
                            orderMode: 'TIF',
                            ...(orderMode === 'postOnly'
                              ? { TIFMode: 'GTC' }
                              : {}),
                          })
                        }}
                        style={{
                          width: '100%',
                          padding: '1rem 0 1rem',
                          border: theme.palette.border.main,
                          borderTop: 0,
                        }}
                      >
                        Stop-Market
                      </TerminalModeButton>
                    </div>
                  </DropdownItemsBlock>
                </TerminalModeButtonWithDropdown>
              ) : (
                <TerminalModeButton
                  theme={theme}
                  active={mode === 'stop-limit'}
                  onClick={() => {
                    this.handleChangeMode('stop-limit')
                    this.setState({ orderMode: 'TIF' })
                  }}
                >
                  Stop-Limit
                </TerminalModeButton>
              )}
            </div>
            {/* {marketType === 1 && (
              <div style={{ width: '35%' }}>
                <PillowButton
                  firstHalfText={'one-way'}
                  secondHalfText={'hedge'}
                  secondHalfTooltip={
                    'You can open a long and short at the same time. Just turn on hedge mode and open opposite positions.'
                  }
                  activeHalf={hedgeMode ? 'second' : 'first'}
                  buttonAdditionalStyle={{
                    width: '50%',
                  }}
                  changeHalf={() => {
                    changePositionModeWithStatus(hedgeMode ? false : true)
                  }}
                />
              </div>
            )} */}
          </TerminalHeader>

          {!isSPOTMarket ? (
            <TerminalHeader
              key={'futuresTerminal'}
              style={{
                display: 'flex',
                paddingTop: '.4rem',
                paddingBottom: '.3rem',
              }}
              theme={theme}
            >
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
                          TIFMode: 'GTX',
                        })
                      }
                    />
                    <DarkTooltip
                      title={
                        'Post-only order will be added to the order book and not execute with a pre-existing order immediately.'
                      }
                    >
                      <SettingsLabel
                        theme={theme}
                        style={{
                          borderBottom: `0.1rem dashed ${theme.palette.grey.text}`,
                        }}
                        htmlFor="postOnly"
                      >
                        post only
                      </SettingsLabel>
                    </DarkTooltip>
                  </FuturesSettings>
                )}

                {mode !== 'market' && ( //
                  <DarkTooltip
                    maxWidth={'35rem'}
                    title={
                      <>
                        <p>
                          <b>Time in Force</b>
                        </p>
                        <p>
                          <b>- GTC (Good Till Cancel):</b> the order will
                          continue to work until the order fills or is canceled.
                        </p>
                        <p>
                          <b> - IOC (Immediate Or Cancel):</b> the order will
                          execute all or part immediately and cancel any
                          unfilled portion of the order.
                        </p>
                        <p>
                          <b>- FOK (Fill Or Kill):</b> the order must be filled
                          immediately in its entirety or not executed at all.
                        </p>
                      </>
                    }
                  >
                    <FuturesSettings key="TIFTerminalController">
                      <SRadio
                        id="TIF"
                        checked={orderMode === 'TIF'}
                        style={{ padding: '0 1rem' }}
                        onChange={() =>
                          this.setState({
                            orderMode: 'TIF',
                            ...(orderMode === 'postOnly'
                              ? { TIFMode: 'GTC' }
                              : {}),
                          })
                        }
                      />
                      <SettingsLabel
                        theme={theme}
                        style={{
                          borderBottom: `0.1rem dashed ${theme.palette.grey.text}`,
                        }}
                        htmlFor="TIF"
                      >
                        TIF
                      </SettingsLabel>
                      <StyledSelect
                        theme={theme}
                        disabled={orderMode !== 'TIF'}
                        value={this.state.TIFMode}
                        onChange={(e) =>
                          this.setState({ TIFMode: e.target.value })
                        }
                      >
                        <StyledOption>GTC</StyledOption>
                        <StyledOption>IOC</StyledOption>
                        <StyledOption>FOK</StyledOption>
                        {orderMode === 'postOnly' && (
                          <StyledOption>GTX</StyledOption>
                        )}
                      </StyledSelect>
                    </FuturesSettings>
                  </DarkTooltip>
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
                  <DarkTooltip
                    title={
                      'Reduce-only order will only reduce your position, not increase it.'
                    }
                  >
                    <SettingsLabel
                      theme={theme}
                      style={{
                        borderBottom: `0.1rem dashed ${theme.palette.grey.text}`,
                      }}
                      htmlFor="reduceOnly"
                    >
                      reduce only
                    </SettingsLabel>
                  </DarkTooltip>
                </FuturesSettings>

                {(mode === 'stop-limit' || mode === 'stop-market') && (
                  <FuturesSettings
                    key="triggerTerminalController"
                    style={{ padding: '0 1rem' }}
                  >
                    {/* <SettingsLabel htmlFor="trigger">trigger</SettingsLabel> */}
                    <StyledSelect
                      theme={theme}
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
            </TerminalHeader>
          ) : null}

          <TerminalMainGrid item xs={12} container marketType={marketType}>
            {this.props.isFuturesWarsKey && false ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SendButton
                  theme={theme}
                  style={{ width: '30%' }}
                  type={'buy'}
                  onClick={() => {
                    this.handleChangeMode('smart')
                    updateTerminalViewMode('smartOrderMode')
                  }}
                >
                  use smart order
                </SendButton>
              </div>
            ) : (
              <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <FullHeightGrid theme={theme} xs={6} item>
                  <TerminalContainer>
                    <TraidingTerminal
                      updatedPrice={mode === 'market' ? price : updatedPrice}
                      operationType={operation}
                      updatePrice={this.updatePrice}
                      stopLossPercentage={stopLossPercentage}
                      takeProfitPercentage={takeProfitPercentage}
                      updateOperationType={this.handleChangeOperation}
                      byType={'buy'}
                      theme={theme}
                      priceType={mode}
                      hedgeMode={hedgeMode}
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
                      keyId={keyId}
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
                      isSLTPOn={isSLTPOn}
                    />
                  </TerminalContainer>
                </FullHeightGrid>

                <FullHeightGrid theme={theme} xs={6} item>
                  <TerminalContainer>
                    <BasicTPSL
                      isSLTPOn={isSLTPOn}
                      setSLTPOn={this.handleStopLossTakeProfitOn}
                      updatedPrice={mode === 'market' ? price : updatedPrice}
                      pair={pair}
                      operationType={operation}
                      pricePrecision={pricePrecision}
                      theme={theme}
                      leverage={leverage}
                      takeProfitPercentage={takeProfitPercentage}
                      stopLossPercentage={stopLossPercentage}
                      setStopLossPercentage={this.setStopLossPercentage}
                      setTakeProfitPercentage={this.setTakeProfitPercentage}
                    />
                    {/* */}
                  </TerminalContainer>
                </FullHeightGrid>
              </div>
            )}
          </TerminalMainGrid>
        </CustomCard>
        {/* {chartPagePopup && (
          <FirstVisitPopup closeChartPagePopup={closeChartPagePopup} />
        )} */}
      </Grid>
    )
  }
}

export default compose(withErrorFallback)(SimpleTabs)
