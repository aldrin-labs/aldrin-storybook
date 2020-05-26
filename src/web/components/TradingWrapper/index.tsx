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

  componentDidMount() {
    this.setState({
      leverage: this.props.componentLeverage,
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.componentLeverage !== this.props.componentLeverage) {
      this.setState({ leverage: this.props.componentLeverage })
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
      hedgeMode,
      enqueueSnackbar,
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
        <CustomCard>
          <TerminalHeader key={'spotTerminal'} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
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
              {!isSPOTMarket ? (
                <TerminalModeButtonWithDropdown
                  isActive={mode === 'stop-limit' || mode === 'stop-market'}
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
                      width: '1.2rem',
                      height: '1.2rem',
                      fill:
                        mode !== 'stop-limit' && mode !== 'stop-market'
                          ? '#7284a0'
                          : '#fff',
                    }}
                  />
                  <DropdownItemsBlock>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <TerminalModeButton
                        isActive={mode === 'stop-limit'}
                        onClick={() => {
                          this.handleChangeMode('stop-limit')
                          this.setState({ orderMode: 'TIF' })
                        }}
                        style={{
                          width: '100%',
                          padding: '1rem 0 1rem',
                          border: '.1rem solid #e0e5ec',
                        }}
                      >
                        Stop-Limit
                      </TerminalModeButton>
                      <TerminalModeButton
                        isActive={mode === 'stop-market'}
                        onClick={() => {
                          this.handleChangeMode('stop-market')
                          this.setState({ orderMode: 'TIF' })
                        }}
                        style={{
                          width: '100%',
                          padding: '1rem 0 1rem',
                          border: '.1rem solid #e0e5ec',
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
                  isActive={mode === 'stop-limit'}
                  onClick={() => {
                    this.handleChangeMode('stop-limit')
                    this.setState({ orderMode: 'TIF' })
                  }}
                >
                  Stop-Limit
                </TerminalModeButton>
              )}
              <TerminalModeButton
                style={{
                  width: '19%',
                  borderRight: '.1rem solid #e0e5ec',
                }}
                isActive={mode === 'smart'}
                onClick={() => {
                  this.handleChangeMode('smart')
                  updateTerminalViewMode('smartOrderMode')
                }}
              >
                Smart
              </TerminalModeButton>
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
                  <SettingsLabel htmlFor="reduceOnly">
                    reduce only
                  </SettingsLabel>
                </FuturesSettings>

                {(mode === 'stop-limit' || mode === 'stop-market') && (
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
                <LeverageTitle>
                  <StyledSelect
                    onChange={(e) =>
                      changeMarginTypeWithStatus(e.target.value.toLowerCase())
                    }
                    value={componentMarginType}
                    style={{ color: '#16253D' }}
                  >
                    <StyledOption>crossed</StyledOption>
                    <StyledOption>isolated</StyledOption>
                  </StyledSelect>
                </LeverageTitle>
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
                    updateLeverage(leverage)
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
                    marginTop: '-.28rem',
                    boxShadow: '0px .4rem .6rem rgba(8, 22, 58, 0.3)',
                    transform: 'translate(-50%, -15%) !important',
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
          ) : (
            <TerminalHeader style={{ display: 'flex' }}>
              <div
                style={{
                  width: '50%',
                  padding: '.5rem 0 .5rem 3rem',
                  borderRight: '.1rem solid #e0e5ec',
                }}
              >
                <SpotBalanceSpan
                  style={{
                    color: '#0B1FD1',
                    borderBottom: '.1rem dashed #ABBAD1',
                  }}
                >
                  {stripDigitPlaces(maxAmount[0], 8)}
                </SpotBalanceSpan>{' '}
                <SpotBalanceSpan
                  style={{
                    color: '#7284A0',
                  }}
                >
                  {pair[1]}
                </SpotBalanceSpan>
              </div>
              <div style={{ width: '50%', padding: '.5rem 0 .5rem 3rem' }}>
                <SpotBalanceSpan
                  style={{
                    color: '#0B1FD1',
                    borderBottom: '.1rem dashed #ABBAD1',
                  }}
                >
                  {stripDigitPlaces(maxAmount[1], 8)}
                </SpotBalanceSpan>{' '}
                <SpotBalanceSpan
                  style={{
                    color: '#7284A0',
                  }}
                >
                  {pair[0]}
                </SpotBalanceSpan>
              </div>
            </TerminalHeader>
          )}

          <TerminalMainGrid item xs={12} container marketType={marketType}>
            {this.props.isFuturesWarsKeyQuery &&
            this.props.isFuturesWarsKeyQuery.isFuturesWarsKey &&
            false ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SendButton
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
                <FullHeightGrid xs={6} item needBorderRight>
                  <TerminalContainer>
                    <TraidingTerminal
                      byType={'buy'}
                      operationType={'buy'}
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
                      hedgeMode={hedgeMode}
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
                    />
                  </TerminalContainer>
                </FullHeightGrid>
              </div>
            )}
          </TerminalMainGrid>
        </CustomCard>
      </Grid>
    )
  }
}

export default compose(
  withErrorFallback,
  queryRendererHoc({
    query: isFuturesWarsKey,
    name: 'isFuturesWarsKeyQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      input: {
        keyId: props.keyId,
      },
    }),
  })
)(SimpleTabs)
