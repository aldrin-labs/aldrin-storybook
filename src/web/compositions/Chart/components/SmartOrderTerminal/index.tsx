import React from 'react'

import { IProps, IState } from './types'
import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  BlueSwitcherStyles,
} from './utils'

import {
  getTakeProfitObject,
  getStopLossObject,
  getEntryOrderObject,
  transformTakeProfitProperties,
  transformStopLossProperties,
  transformEntryOrderProperties,
  validateSmartOrders,
  validateStopLoss,
  validateTakeProfit,
  validateEntryOrder,
  getDefaultStateFromStrategySettings,
} from '@core/utils/chartPageUtils'

import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { maxLeverage } from '@sb/compositions/Chart/mocks'

import { CustomCard } from '../../Chart.styles'
import { SendButton } from '@sb/components/TraidingTerminal/styles'

import {
  StyledZoomIcon,
  LeverageLabel,
  LeverageTitle,
} from '@sb/components/TradingWrapper/styles'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import CloseIcon from '@material-ui/icons/Close'

import { SCheckbox } from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { FormInputContainer, Select } from './InputComponents'
import {
  EditTakeProfitPopup,
  EditStopLossPopup,
  EditHedgePopup,
  EditEntryOrderPopup,
} from './EditOrderPopups'

import HeightIcon from '@material-ui/icons/Height'
import CustomSwitcher from '@sb/components/SwitchOnOff/CustomSwitcher'
import BlueSlider from '@sb/components/Slider/BlueSlider'
import SmallSlider from '@sb/components/Slider/SmallSlider'
import ConfirmationPopup from '@sb/compositions/Chart/components/SmartOrderTerminal/ConfirmationPopup/ConfirmationPopup'

import {
  TradeInputContent as Input,
  TradeInputHeader,
} from '@sb/components/TraidingTerminal/index'

import {
  TerminalBlocksContainer,
  TerminalHeaders,
  TerminalBlock,
  TerminalHeader,
  HeaderTitle,
  BlockHeader,
  HeaderLabel,
  CloseHeader,
  SubBlocksContainer,
  InputRowContainer,
  TimeoutTitle,
  TargetTitle,
  TargetValue,
  BluredBackground,
  SwitcherContainer,
  AdditionalSettingsButton,
} from './styles'

export class SmartOrderTerminal extends React.PureComponent<IProps, IState> {
  state: IState = {
    showConfirmationPopup: false,
    showErrors: false,
    editPopup: null,
    entryPoint: {
      order: {
        type: 'limit',
        side: 'buy',
        price: 0,
        amount: 0,
        total: 0,
        leverage: false,
        isHedgeOn: false,
        hedgePrice: 0,
        // X20,
        hedgeIncrease: 1,
        hedgeSide: 'short',
      },
      trailing: {
        isTrailingOn: false,
        deviationPercentage: 0,
      },
    },
    takeProfit: {
      isTakeProfitOn: true,
      type: 'market',
      pricePercentage: 0,
      splitTargets: {
        isSplitTargetsOn: false,
        volumePercentage: 100,
        targets: [],
      },
      timeout: {
        isTimeoutOn: false,
        whenProfitOn: false,
        whenProfitMode: 'sec',
        whenProfitSec: 0,
        whenProfitableOn: false,
        whenProfitableMode: 'sec',
        whenProfitableSec: 0,
      },
      trailingTAP: {
        isTrailingOn: false,
        activatePrice: 0,
        deviationPercentage: 0,
      },
    },
    stopLoss: {
      isStopLossOn: true,
      type: 'market',
      pricePercentage: 0,
      timeout: {
        isTimeoutOn: false,
        whenLossOn: false,
        whenLossMode: 'sec',
        whenLossSec: 0,
        whenLossableOn: false,
        whenLossableMode: 'sec',
        whenLossableSec: 0,
      },
      forcedStop: {
        isForcedStopOn: false,
        pricePercentage: 0,
      },
    },
    temp: {
      initialMargin: 0,
    },
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (state.entryPoint.order.price === 0) {
      return {
        ...state,
        entryPoint: {
          ...state.entryPoint,
          order: {
            ...state.entryPoint.order,
            price: props.price,
          },
        },
      }
    }

    if (!state.entryPoint.order.leverage) {
      return {
        ...state,
        entryPoint: {
          ...state.entryPoint,
          order: {
            ...state.entryPoint.order,
            leverage: props.componentLeverage,
          },
        },
      }
    }

    return null
  }

  componentDidMount() {
    const {
      getStrategySettingsQuery,
      marketType,
      price,
      componentLeverage,
    } = this.props

    const result = getDefaultStateFromStrategySettings({
      getStrategySettingsQuery,
      marketType,
    })

    if (!result) {
      return
    }

    this.setState((prevState) => ({
      entryPoint: {
        ...prevState.entryPoint,
        order: {
          ...prevState.entryPoint.order,
          ...(result.entryPoint &&
          result.entryPoint.order &&
          result.entryPoint.order.type
            ? { type: result.entryPoint.order.type }
            : {}),
          ...(result.entryPoint &&
          result.entryPoint.order &&
          result.entryPoint.order.side
            ? { side: result.entryPoint.order.side }
            : {}),
          leverage: componentLeverage,
        },
        trailing: {
          ...prevState.entryPoint.trailing,
          ...(result.entryPoint ? result.entryPoint.trailing : {}),
        },
      },
      takeProfit: result.takeProfit,
      stopLoss: result.stopLoss,
    }))

    if (
      !(
        result &&
        result.entryPoint &&
        result.entryPoint.order &&
        result.entryPoint.order.amount
      )
    ) {
      return
    }

    const newTotal = result.entryPoint.order.amount * price
    const newAmount =
      marketType === 0
        ? result.entryPoint.order.amount
        : result.entryPoint.order.amount

    this.updateSubBlockValue('entryPoint', 'order', 'amount', newAmount)

    this.updateSubBlockValue(
      'entryPoint',
      'order',
      'total',
      stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
    )

    this.updateBlockValue(
      'temp',
      'initialMargin',
      stripDigitPlaces((newTotal || 0) / this.props.leverage, 2)
    )
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.priceFromOrderbook !== this.props.priceFromOrderbook &&
      this.props.priceFromOrderbook
    ) {
      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'price',
        this.props.priceFromOrderbook
      )

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'total',
        this.props.priceFromOrderbook * this.state.entryPoint.order.amount
      )
    }

    if (prevProps.componentLeverage !== this.props.componentLeverage) {
      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'leverage',
        this.props.componentLeverage
      )
    }

    if (
      this.props.price !== prevProps.price &&
      this.state.entryPoint.order.type === 'market' &&
      !this.state.entryPoint.trailing.isTrailingOn
    ) {
      const { price, marketType } = this.props

      const { entryPoint } = this.state

      const total = price * entryPoint.order.amount

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'total',
        stripDigitPlaces(total, marketType === 1 ? 2 : 8)
      )

      const newMargin = stripDigitPlaces(
        (entryPoint.order.amount / entryPoint.order.leverage) * price,
        2
      )

      this.updateBlockValue('temp', 'initialMargin', newMargin)
    }

    if (
      this.props.marketPriceAfterPairChange !==
      prevProps.marketPriceAfterPairChange
    ) {
      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'price',
        this.props.marketPriceAfterPairChange
      )

      this.updateSubBlockValue('entryPoint', 'order', 'total', 0)

      this.updateSubBlockValue('entryPoint', 'order', 'amount', 0)
    }
  }

  handleCloseConfirmationPopup = () => {
    this.setState({
      showConfirmationPopup: false,
    })
  }

  handleOpenEditPopup = (popup: string) => {
    this.setState({
      editPopup: popup,
    })
  }

  addTarget = () => {
    const {
      pricePercentage,
      splitTargets: { volumePercentage, targets },
      type,
    } = this.state.takeProfit

    if (pricePercentage !== 0 && volumePercentage !== 0) {
      this.setState((prev) => ({
        takeProfit: {
          ...prev.takeProfit,
          pricePercentage: 0,
          splitTargets: {
            ...prev.takeProfit.splitTargets,
            volumePercentage: 0,
            targets: [
              ...targets,
              { price: pricePercentage, quantity: volumePercentage, type },
            ],
          },
        },
      }))
    }
  }

  deleteTarget = (index: number) => {
    const {
      splitTargets: { targets },
    } = this.state.takeProfit

    this.setState({
      takeProfit: {
        ...this.state.takeProfit,
        splitTargets: {
          ...this.state.takeProfit.splitTargets,
          targets: [...targets.slice(0, index), ...targets.slice(index + 1)],
        },
      },
    })
  }

  toggleBlock = (blockName: string, booleanName: string) => {
    this.setState((prev: IState) => ({
      [blockName]: {
        ...prev[blockName],
        [booleanName]: !prev[blockName][booleanName],
      },
    }))
  }

  updateBlockValue = (
    blockName: string,
    valueName: string,
    newValue: string | number
  ) => {
    this.setState((prev) => ({
      [blockName]: { ...prev[blockName], [valueName]: newValue },
    }))
  }

  updateSubBlockValue = (
    blockName: string,
    subBlockName: string,
    valueName: string,
    newValue: string | number | boolean
  ) => {
    this.setState((prev) => ({
      [blockName]: {
        ...prev[blockName],
        [subBlockName]: {
          ...prev[blockName][subBlockName],
          [valueName]: newValue,
        },
      },
    }))
  }

  validateField = (enabled: boolean, value: string | number) => {
    if (enabled) {
      if (!value || value <= 0 || value === '') {
        return false
      }

      return true
    }

    return true
  }

  confirmTrade = async () => {
    const { entryPoint } = this.state
    const {
      placeOrder,
      showOrderResult,
      cancelOrder,
      updateTerminalViewMode,
    } = this.props

    this.handleCloseConfirmationPopup()

    updateTerminalViewMode('default')

    const result = await placeOrder(
      entryPoint.order.side,
      entryPoint.order.type,
      {},
      'smart',
      this.state
    )

    await showOrderResult(result, cancelOrder)

    // if (result.status === 'success' && result.orderId)
    //   updateTerminalViewMode('default')
  }

  setMaxAmount = () => {
    const { entryPoint } = this.state

    const { funds, marketType, quantityPrecision } = this.props

    let maxAmount = 0

    if (marketType === 0) {
      maxAmount =
        entryPoint.order.side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * entryPoint.order.leverage
    }

    const [amount, total] =
      entryPoint.order.side === 'buy' || marketType === 1
        ? [maxAmount / entryPoint.order.price, maxAmount]
        : [maxAmount, maxAmount / entryPoint.order.price]

    this.updateSubBlockValue(
      'entryPoint',
      'order',
      'amount',
      stripDigitPlaces(amount, marketType === 1 ? quantityPrecision : 8)
    )

    this.updateSubBlockValue(
      'entryPoint',
      'order',
      'total',
      stripDigitPlaces(total, marketType === 1 ? 2 : 8)
    )

    this.updateBlockValue(
      'temp',
      'initialMargin',
      stripDigitPlaces(funds[1].quantity, 2)
    )
  }

  render() {
    const {
      pair,
      funds,
      marketType,
      updateLeverage,
      quantityPrecision,
      leverage: startLeverage,
    } = this.props

    const {
      entryPoint,
      takeProfit,
      stopLoss,
      showErrors,
      showConfirmationPopup,
      editPopup,
    } = this.state

    let maxAmount = 0

    if (marketType === 0) {
      maxAmount =
        entryPoint.order.side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * entryPoint.order.leverage
    }

    return (
      <>
        {showConfirmationPopup && !editPopup && (
          <ConfirmationPopup
            confirmTrade={this.confirmTrade}
            handleOpenEditPopup={this.handleOpenEditPopup}
            open={showConfirmationPopup}
            handleClose={this.handleCloseConfirmationPopup}
            entryPoint={entryPoint}
            takeProfit={takeProfit}
            stopLoss={stopLoss}
            pair={pair}
          />
        )}
        <CustomCard>
          <TerminalHeaders>
            <TerminalHeader
              key={'entryPoint'}
              width={'33%'}
              justify={marketType === 0 ? 'center' : 'space-between'}
            >
              <BlockHeader>entry point</BlockHeader>
              {marketType === 1 && (
                <div
                  style={{
                    display: 'flex',
                    width: '60%',
                    alignItems: 'center',
                  }}
                >
                  <LeverageTitle>leverage:</LeverageTitle>
                  <SmallSlider
                    min={1}
                    max={maxLeverage.get(`${pair[0]}_${pair[1]}`) || 75}
                    defaultValue={startLeverage}
                    value={
                      !entryPoint.order.leverage
                        ? startLeverage
                        : entryPoint.order.leverage
                    }
                    valueSymbol={'X'}
                    marks={
                      maxLeverage.get(`${pair[0]}_${pair[1]}`) === 125
                        ? {
                            1: {},
                            25: {},
                            50: {},
                            75: {},
                            100: {},
                            125: {},
                          }
                        : {
                            1: {},
                            15: {},
                            30: {},
                            45: {},
                            60: {},
                            75: {},
                          }
                    }
                    onChange={(leverage) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'leverage',
                        leverage
                      )
                    }}
                    onAfterChange={(leverage: number) => {
                      updateLeverage(leverage)
                    }}
                    sliderContainerStyles={{
                      width: '65%',
                      margin: '0 auto',
                    }}
                    trackBeforeBackground={'#29AC80;'}
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
                    {entryPoint.order.leverage || 1}x
                  </LeverageLabel>
                </div>
              )}
            </TerminalHeader>
            <TerminalHeader
              width={'32.5%'}
              margin={'0 1%'}
              padding={'0rem 1.5rem'}
              justify={'center'}
              key={'stopLoss'}
            >
              <BlockHeader>stop loss</BlockHeader>
              {/* <GreenSwitcher
                id="isStopLossOn"
                checked={stopLoss.isStopLossOn}
                handleToggle={() =>
                  this.toggleBlock('stopLoss', 'isStopLossOn')
                }
              /> */}
            </TerminalHeader>
            <TerminalHeader
              key={'takeProfit'}
              width={'32.5%'}
              padding={'0rem 1.5rem'}
              justify={'center'}
            >
              <BlockHeader>take a profit</BlockHeader>
              {/* <GreenSwitcher
                id="isTakeProfitOn"
                checked={takeProfit.isTakeProfitOn}
                handleToggle={() =>
                  this.toggleBlock('takeProfit', 'isTakeProfitOn')
                }
              /> */}
            </TerminalHeader>
            {/* <CloseHeader
              key={'buttonToggleTerminalView'}
              padding={'.55rem .5rem'}
              onClick={() => updateTerminalViewMode('default')}
            >
              <StyledZoomIcon />
            </CloseHeader> */}
          </TerminalHeaders>

          <TerminalBlocksContainer xs={12} container item>
            {/* ENTRY POINT */}

            <TerminalBlock width={'calc(33% + 0.5%)'}>
              <CustomSwitcher
                firstHalfText={'buy'}
                secondHalfText={'sell'}
                buttonHeight={'2.5rem'}
                containerStyles={{ width: '100%', paddingBottom: '.6rem' }}
                firstHalfStyleProperties={GreenSwitcherStyles}
                secondHalfStyleProperties={RedSwitcherStyles}
                firstHalfIsActive={entryPoint.order.side === 'buy'}
                changeHalf={() => {
                  if (marketType === 0) {
                    const newSide = getSecondValueFromFirst(
                      entryPoint.order.side
                    )
                    const amountPercentage =
                      entryPoint.order.side === 'buy' || marketType === 1
                        ? entryPoint.order.total / (maxAmount / 100)
                        : entryPoint.order.amount / (maxAmount / 100)

                    const newMaxAmount =
                      newSide === 'buy' ? funds[1].quantity : funds[0].quantity

                    let amount =
                      newSide === 'buy'
                        ? stripDigitPlaces(
                            ((amountPercentage / 100) * newMaxAmount) /
                              entryPoint.order.price,
                            marketType === 1 ? quantityPrecision : 8
                          )
                        : stripDigitPlaces(
                            (amountPercentage / 100) * newMaxAmount,
                            marketType === 1 ? quantityPrecision : 8
                          )

                    if (!+amount || +amount === NaN) {
                      amount = 0
                    }

                    const total = stripDigitPlaces(
                      amount * entryPoint.order.price,
                      marketType === 1 ? 2 : 8
                    )

                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'amount',
                      amount
                    )

                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'total',
                      total
                    )
                  }

                  this.updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'side',
                    getSecondValueFromFirst(entryPoint.order.side)
                  )
                }}
              />

              <CustomSwitcher
                firstHalfText={'limit'}
                secondHalfText={'market'}
                buttonHeight={'2.5rem'}
                containerStyles={{ width: '100%', padding: '.6rem 0' }}
                firstHalfStyleProperties={BlueSwitcherStyles}
                secondHalfStyleProperties={BlueSwitcherStyles}
                firstHalfIsActive={entryPoint.order.type === 'limit'}
                changeHalf={() => {
                  this.updateSubBlockValue(
                    'entryPoint',
                    'order',
                    'type',
                    getSecondValueFromFirst(entryPoint.order.type)
                  )

                  if (
                    getSecondValueFromFirst(entryPoint.order.type) === 'market'
                  ) {
                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'price',
                      this.props.price
                    )

                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'total',
                      stripDigitPlaces(
                        this.props.price * entryPoint.order.amount,
                        marketType === 1 ? 2 : 8
                      )
                    )
                  }

                  // if (entryPoint.trailing.isTrailingOn) {
                  //   this.updateSubBlockValue(
                  //     'entryPoint',
                  //     'trailing',
                  //     'isTrailingOn',
                  //     getSecondValueFromFirst(entryPoint.order.type) !== 'limit'
                  //   )
                  // }
                }}
              />

              <div>
                <InputRowContainer
                  justify="flex-start"
                  padding={'.6rem 0 1.2rem 0'}
                >
                  <AdditionalSettingsButton
                    isActive={entryPoint.trailing.isTrailingOn}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        !entryPoint.trailing.isTrailingOn
                      )
                    }}
                  >
                    Trailing {entryPoint.order.side}
                  </AdditionalSettingsButton>
                  {/* <SwitcherContainer>
                    <GreenSwitcher
                      id="isHedgeOn"
                      checked={entryPoint.order.isHedgeOn}
                      handleToggle={() =>
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'isHedgeOn',
                          !entryPoint.order.isHedgeOn
                        )
                      }
                    />
                    <HeaderLabel htmlFor="isHedgeOn">hedge</HeaderLabel>
                  </SwitcherContainer> */}
                </InputRowContainer>
                <FormInputContainer
                  padding={'0 0 1.2rem 0'}
                  title={`price (${pair[1]})`}
                >
                  <Input
                    symbol={pair[1]}
                    type={
                      entryPoint.order.type === 'limit'
                        ? 'number'
                        : entryPoint.trailing.isTrailingOn
                        ? 'number'
                        : 'text'
                    }
                    value={
                      entryPoint.order.type === 'limit'
                        ? entryPoint.order.price
                        : entryPoint.trailing.isTrailingOn
                        ? entryPoint.order.price
                        : 'MARKET'
                    }
                    showErrors={showErrors}
                    isValid={this.validateField(true, entryPoint.order.price)}
                    disabled={
                      entryPoint.order.type === 'market' &&
                      !entryPoint.trailing.isTrailingOn
                    }
                    onChange={(e) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'price',
                        e.target.value
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        stripDigitPlaces(
                          e.target.value * entryPoint.order.amount,
                          marketType === 1 ? 2 : 8
                        )
                      )

                      this.updateBlockValue(
                        'temp',
                        'initialMargin',
                        stripDigitPlaces(
                          (e.target.value * entryPoint.order.amount) /
                            entryPoint.order.leverage,
                          2
                        )
                      )
                    }}
                  />
                </FormInputContainer>

                {entryPoint.trailing.isTrailingOn && (
                  <FormInputContainer title={'trailing deviation (%)'}>
                    <InputRowContainer>
                      <Input
                        padding={'0 .8rem 0 0'}
                        width={'calc(50%)'}
                        symbol={'%'}
                        value={entryPoint.trailing.deviationPercentage}
                        // showErrors={showErrors}
                        // isValid={this.validateField(
                        //   entryPoint.trailing.isTrailingOn,
                        //   entryPoint.trailing.deviationPercentage
                        // )}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'deviationPercentage',
                            e.target.value
                          )
                        }}
                      />

                      <BlueSlider
                        disabled={!entryPoint.trailing.isTrailingOn}
                        value={entryPoint.trailing.deviationPercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'deviationPercentage',
                            value
                          )
                        }}
                      />
                    </InputRowContainer>
                  </FormInputContainer>
                )}

                <InputRowContainer>
                  <div style={{ width: '47%' }}>
                    <FormInputContainer
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? (maxAmount / entryPoint.order.price).toFixed(
                              marketType === 1 ? quantityPrecision : 8
                            )
                          : maxAmount.toFixed(
                              marketType === 1 ? quantityPrecision : 8
                            )
                      } ${pair[0]}`}
                      onValueClick={this.setMaxAmount}
                      title={`${
                        marketType === 1 ? 'order quantity' : 'amount'
                      } (${pair[0]})`}
                    >
                      <Input
                        type={'text'}
                        pattern={
                          marketType === 0
                            ? '[0-9]+.[0-9]{8}'
                            : '[0-9]+.[0-9]{3}'
                        }
                        symbol={pair[0]}
                        value={entryPoint.order.amount}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          true,
                          +entryPoint.order.amount
                        )}
                        onChange={(e) => {
                          const newTotal =
                            e.target.value * entryPoint.order.price
                          const newAmount =
                            marketType === 0 ? e.target.value : e.target.value

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'amount',
                            newAmount
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'total',
                            stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
                          )

                          this.updateBlockValue(
                            'temp',
                            'initialMargin',
                            stripDigitPlaces(
                              (newTotal || 0) / entryPoint.order.leverage,
                              2
                            )
                          )
                        }}
                      />
                    </FormInputContainer>
                  </div>
                  <div
                    style={{
                      width: '6%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <HeightIcon
                      style={{
                        color: '#7284A0',
                        transform: 'rotate(-90deg) translateX(-30%)',
                      }}
                    />
                  </div>
                  <div style={{ width: '47%' }}>
                    <FormInputContainer
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? stripDigitPlaces(
                              maxAmount,
                              marketType === 1 ? 0 : 2
                            )
                          : stripDigitPlaces(
                              maxAmount * entryPoint.order.price,
                              marketType === 1 ? 0 : 2
                            )
                      } ${pair[1]}`}
                      onValueClick={this.setMaxAmount}
                      title={`total (${pair[1]})`}
                    >
                      <Input
                        symbol={pair[1]}
                        value={entryPoint.order.total}
                        disabled={
                          entryPoint.trailing.isTrailingOn ||
                          entryPoint.order.type === 'market'
                        }
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'total',
                            e.target.value
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'amount',
                            stripDigitPlaces(
                              e.target.value / entryPoint.order.price,
                              marketType === 1 ? quantityPrecision : 8
                            )
                          )

                          this.updateBlockValue(
                            'temp',
                            'initialMargin',
                            stripDigitPlaces(
                              e.target.value / entryPoint.order.leverage,
                              2
                            )
                          )
                        }}
                      />
                    </FormInputContainer>
                  </div>
                </InputRowContainer>

                <InputRowContainer>
                  <BlueSlider
                    value={
                      entryPoint.order.side === 'buy' || marketType === 1
                        ? entryPoint.order.total / (maxAmount / 100)
                        : entryPoint.order.amount / (maxAmount / 100)
                    }
                    sliderContainerStyles={{
                      width: 'calc(100% - .8rem)',
                      margin: '0 .8rem 0 auto',
                    }}
                    onChange={(value) => {
                      const newValue = (maxAmount / 100) * value

                      const newAmount =
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? (newValue / entryPoint.order.price).toFixed(
                              marketType === 1 ? quantityPrecision : 8
                            )
                          : newValue.toFixed(
                              marketType === 1 ? quantityPrecision : 8
                            )

                      const newTotal =
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? newValue
                          : newValue * entryPoint.order.price

                      const newMargin = stripDigitPlaces(
                        (newTotal || 0) / entryPoint.order.leverage,
                        2
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        newAmount
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
                      )

                      this.updateBlockValue('temp', 'initialMargin', newMargin)
                    }}
                  />
                </InputRowContainer>

                {marketType === 1 && (
                  <InputRowContainer>
                    <FormInputContainer
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${stripDigitPlaces(funds[1].quantity, 2)} ${
                        pair[1]
                      }`}
                      onValueClick={this.setMaxAmount}
                      title={`cost / initial margin (${pair[1]})`}
                    >
                      <Input
                        symbol={pair[1]}
                        value={this.state.temp.initialMargin}
                        disabled={
                          entryPoint.trailing.isTrailingOn ||
                          entryPoint.order.type === 'market'
                        }
                        onChange={(e) => {
                          const inputInitialMargin = e.target.value
                          const newTotal =
                            inputInitialMargin * entryPoint.order.leverage
                          const newAmount = newTotal / entryPoint.order.price

                          const fixedAmount = stripDigitPlaces(
                            newAmount,
                            marketType === 1 ? quantityPrecision : 8
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'total',
                            stripDigitPlaces(newTotal, marketType === 1 ? 2 : 8)
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'amount',
                            fixedAmount
                          )

                          this.updateBlockValue(
                            'temp',
                            'initialMargin',
                            inputInitialMargin
                          )
                        }}
                      />
                    </FormInputContainer>
                  </InputRowContainer>
                )}

                {entryPoint.order.isHedgeOn && (
                  <InputRowContainer>
                    <FormInputContainer title={'hedge'}>
                      <CustomSwitcher
                        firstHalfText={'long'}
                        secondHalfText={'short'}
                        buttonHeight={'2.5rem'}
                        containerStyles={{
                          width: '30%',
                          padding: '0 .4rem 0 0',
                          whiteSpace: 'nowrap',
                        }}
                        firstHalfStyleProperties={GreenSwitcherStyles}
                        secondHalfStyleProperties={RedSwitcherStyles}
                        firstHalfIsActive={
                          entryPoint.order.hedgeSide === 'long'
                        }
                        changeHalf={() =>
                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'hedgeSide',
                            getSecondValueFromFirst(entryPoint.order.hedgeSide)
                          )
                        }
                      />
                      <Input
                        padding="0 .8rem 0 .8rem"
                        width={'calc(40% - 1.6rem)'}
                        symbol={pair[1]}
                        value={entryPoint.order.hedgePrice}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          entryPoint.order.isHedgeOn,
                          entryPoint.order.hedgePrice
                        )}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'hedgePrice',
                            e.target.value
                          )
                        }}
                      />
                      <Select
                        width={'18%'}
                        symbol={'LVRG.'}
                        value={entryPoint.order.hedgeIncrease}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          entryPoint.order.isHedgeOn,
                          entryPoint.order.hedgeIncrease
                        )}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'hedgeIncrease',
                            e.target.value
                          )
                        }}
                      >
                        <option>1</option>
                        <option>25</option>
                        <option>50</option>
                        <option>75</option>
                        <option>100</option>
                        <option>125</option>
                      </Select>
                    </FormInputContainer>
                  </InputRowContainer>
                )}
              </div>
            </TerminalBlock>

            {/* STOP LOSS */}
            <TerminalBlock
              width={'calc(32.5% + 1%)'}
              style={{ overflow: 'hidden' }}
            >
              <InputRowContainer justify="center">
                <CustomSwitcher
                  firstHalfText={'limit'}
                  secondHalfText={'market'}
                  buttonHeight={'2.5rem'}
                  containerStyles={{ width: '100%' }}
                  firstHalfStyleProperties={BlueSwitcherStyles}
                  secondHalfStyleProperties={BlueSwitcherStyles}
                  firstHalfIsActive={stopLoss.type === 'limit'}
                  changeHalf={() =>
                    this.updateBlockValue(
                      'stopLoss',
                      'type',
                      getSecondValueFromFirst(stopLoss.type)
                    )
                  }
                />
              </InputRowContainer>
              <div>
                <InputRowContainer
                  justify="flex-start"
                  padding={'.6rem 0 1.2rem 0'}
                >
                  <AdditionalSettingsButton
                    isActive={stopLoss.timeout.isTimeoutOn}
                    onClick={() =>
                      this.updateSubBlockValue(
                        'stopLoss',
                        'timeout',
                        'isTimeoutOn',
                        !stopLoss.timeout.isTimeoutOn
                      )
                    }
                  >
                    Timeout
                  </AdditionalSettingsButton>

                  <AdditionalSettingsButton
                    isActive={stopLoss.forcedStop.isForcedStopOn}
                    onClick={() =>
                      this.updateSubBlockValue(
                        'stopLoss',
                        'forcedStop',
                        'isForcedStopOn',
                        !stopLoss.forcedStop.isForcedStopOn
                      )
                    }
                  >
                    Forced stop
                  </AdditionalSettingsButton>
                </InputRowContainer>

                <FormInputContainer title={'loss (%)'}>
                  <InputRowContainer>
                    <Input
                      needCharacter
                      beforeSymbol={'-'}
                      padding={'0 .8rem 0 0'}
                      width={'calc(50%)'}
                      symbol={'%'}
                      value={stopLoss.pricePercentage}
                      showErrors={showErrors && stopLoss.isStopLossOn}
                      isValid={this.validateField(
                        true,
                        stopLoss.pricePercentage
                      )}
                      onChange={(e) => {
                        this.updateBlockValue(
                          'stopLoss',
                          'pricePercentage',
                          e.target.value
                        )
                      }}
                    />

                    <BlueSlider
                      value={stopLoss.pricePercentage}
                      sliderContainerStyles={{
                        width: '50%',
                        margin: '0 .8rem 0 .8rem',
                      }}
                      onChange={(value) => {
                        this.updateBlockValue(
                          'stopLoss',
                          'pricePercentage',
                          value
                        )
                      }}
                    />
                  </InputRowContainer>
                </FormInputContainer>

                {stopLoss.timeout.isTimeoutOn && (
                  <>
                    <TradeInputHeader title={`timeout`} needLine={true} />
                    <InputRowContainer>
                      <SubBlocksContainer>
                        <InputRowContainer>
                          <TimeoutTitle> When loss</TimeoutTitle>
                        </InputRowContainer>
                        <InputRowContainer>
                          <SCheckbox
                            checked={stopLoss.timeout.whenLossOn}
                            onChange={() => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossOn',
                                !stopLoss.timeout.whenLossOn
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            haveSelector
                            width={'calc(55% - .4rem)'}
                            value={stopLoss.timeout.whenLossSec}
                            showErrors={showErrors && stopLoss.isStopLossOn}
                            isValid={this.validateField(
                              stopLoss.timeout.whenLossOn,
                              stopLoss.timeout.whenLossSec
                            )}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossSec',
                                e.target.value
                              )
                            }}
                            inputStyles={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            disabled={!stopLoss.timeout.whenLossOn}
                          />
                          <Select
                            width={'calc(30% - .4rem)'}
                            value={stopLoss.timeout.whenLossMode}
                            inputStyles={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossMode',
                                e.target.value
                              )
                            }}
                            isDisabled={!stopLoss.timeout.whenLossOn}
                          >
                            <option>sec</option>
                            <option>min</option>
                          </Select>
                        </InputRowContainer>
                      </SubBlocksContainer>

                      <SubBlocksContainer>
                        <InputRowContainer>
                          <TimeoutTitle>When lossable</TimeoutTitle>
                        </InputRowContainer>
                        <InputRowContainer>
                          <SCheckbox
                            checked={stopLoss.timeout.whenLossableOn}
                            onChange={() => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossableOn',
                                !stopLoss.timeout.whenLossableOn
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            haveSelector
                            width={'calc(55% - .4rem)'}
                            showErrors={showErrors && stopLoss.isStopLossOn}
                            isValid={this.validateField(
                              stopLoss.timeout.whenLossableOn,
                              stopLoss.timeout.whenLossableSec
                            )}
                            value={stopLoss.timeout.whenLossableSec}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossableSec',
                                e.target.value
                              )
                            }}
                            inputStyles={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            disabled={!stopLoss.timeout.whenLossableOn}
                          />
                          <Select
                            width={'calc(30% - .4rem)'}
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
                            isDisabled={!stopLoss.timeout.whenLossableOn}
                          >
                            <option>sec</option>
                            <option>min</option>
                          </Select>
                        </InputRowContainer>
                      </SubBlocksContainer>
                    </InputRowContainer>
                  </>
                )}

                {stopLoss.forcedStop.isForcedStopOn && (
                  <>
                    <InputRowContainer>
                      <FormInputContainer title={'forced stop (loss %)'}>
                        <InputRowContainer>
                          <Input
                            needCharacter
                            showErrors={showErrors && stopLoss.isStopLossOn}
                            isValid={this.validateField(
                              stopLoss.forcedStop.isForcedStopOn,
                              stopLoss.forcedStop.pricePercentage
                            )}
                            beforeSymbol={'-'}
                            padding={'0 .8rem 0 0'}
                            width={'calc(50%)'}
                            symbol={'%'}
                            value={stopLoss.forcedStop.pricePercentage}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'pricePercentage',
                                e.target.value
                              )
                            }}
                          />

                          <BlueSlider
                            value={stopLoss.forcedStop.pricePercentage}
                            sliderContainerStyles={{
                              width: '50%',
                              margin: '0 .8rem 0 .8rem',
                            }}
                            onChange={(value) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'pricePercentage',
                                value
                              )
                            }}
                          />
                        </InputRowContainer>
                      </FormInputContainer>
                    </InputRowContainer>
                  </>
                )}
              </div>

              {!stopLoss.isStopLossOn && (
                <BluredBackground>
                  <div
                    style={{
                      width: '50%',
                    }}
                  >
                    <SendButton
                      type={'buy'}
                      onClick={() =>
                        this.toggleBlock('stopLoss', 'isStopLossOn')
                      }
                    >
                      show stop loss
                    </SendButton>
                  </div>
                </BluredBackground>
              )}
              <InputRowContainer
                style={{
                  width: 'calc(100%)',
                  margin: '0 auto',
                  position: 'relative',
                  bottom: '0',
                }}
              >
                <SendButton
                  type={entryPoint.order.side ? 'buy' : 'sell'}
                  onClick={async () => {
                    const isValid = validateSmartOrders(this.state)

                    if (isValid) {
                      this.setState({ showConfirmationPopup: true })
                    } else {
                      this.setState({ showErrors: true })
                    }
                  }}
                >
                  create trade
                </SendButton>
              </InputRowContainer>
            </TerminalBlock>

            {/* TAKE A PROFIT */}
            <TerminalBlock width={'calc(33%)'} borderRight="0">
              <InputRowContainer justify="center">
                <CustomSwitcher
                  firstHalfText={'limit'}
                  secondHalfText={'market'}
                  buttonHeight={'2.5rem'}
                  containerStyles={{ width: '100%' }}
                  firstHalfStyleProperties={BlueSwitcherStyles}
                  secondHalfStyleProperties={BlueSwitcherStyles}
                  firstHalfIsActive={takeProfit.type === 'limit'}
                  changeHalf={() => {
                    this.updateBlockValue(
                      'takeProfit',
                      'type',
                      getSecondValueFromFirst(takeProfit.type)
                    )
                  }}
                />
              </InputRowContainer>
              <div>
                <InputRowContainer
                  justify="flex-start"
                  padding={'.6rem 0 1.2rem 0'}
                >
                  <AdditionalSettingsButton
                    style={{ fontSize: '1rem' }}
                    isActive={takeProfit.trailingTAP.isTrailingOn}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'isTrailingOn',
                        !takeProfit.trailingTAP.isTrailingOn
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'isSplitTargetsOn',
                        false
                      )

                      this.updateBlockValue('takeProfit', 'type', 'market')
                    }}
                  >
                    Trailing take a profit
                  </AdditionalSettingsButton>

                  <AdditionalSettingsButton
                    isActive={takeProfit.splitTargets.isSplitTargetsOn}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'isSplitTargetsOn',
                        !takeProfit.splitTargets.isSplitTargetsOn
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'isTrailingOn',
                        false
                      )
                    }}
                  >
                    Split targets
                  </AdditionalSettingsButton>

                  <AdditionalSettingsButton
                    isActive={takeProfit.timeout.isTimeoutOn}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'isTimeoutOn',
                        !takeProfit.timeout.isTimeoutOn
                      )
                    }}
                  >
                    Timeout
                  </AdditionalSettingsButton>
                </InputRowContainer>

                {!takeProfit.trailingTAP.isTrailingOn && (
                  <FormInputContainer title={'profit (%)'}>
                    <InputRowContainer>
                      <Input
                        needCharacter
                        beforeSymbol={'+'}
                        padding={'0 .8rem 0 0'}
                        width={'calc(50%)'}
                        symbol={'%'}
                        value={takeProfit.pricePercentage}
                        showErrors={
                          showErrors &&
                          takeProfit.isTakeProfitOn &&
                          !takeProfit.splitTargets.isSplitTargetsOn &&
                          !takeProfit.trailingTAP.isTrailingOn
                        }
                        isValid={this.validateField(
                          true,
                          takeProfit.pricePercentage
                        )}
                        onChange={(e) => {
                          this.updateBlockValue(
                            'takeProfit',
                            'pricePercentage',
                            e.target.value
                          )
                        }}
                      />

                      <BlueSlider
                        value={takeProfit.pricePercentage}
                        sliderContainerStyles={{
                          width: '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          this.updateBlockValue(
                            'takeProfit',
                            'pricePercentage',
                            value
                          )
                        }}
                      />
                    </InputRowContainer>
                  </FormInputContainer>
                )}

                {takeProfit.trailingTAP.isTrailingOn && (
                  <>
                    <FormInputContainer title={`activate price (%)`}>
                      <InputRowContainer>
                        <Input
                          symbol={'%'}
                          padding={'0 .8rem 0 0'}
                          width={'calc(50%)'}
                          value={takeProfit.trailingTAP.activatePrice}
                          // showErrors={showErrors && takeProfit.isTakeProfitOn}
                          // isValid={this.validateField(
                          //   takeProfit.trailingTAP.isTrailingOn,
                          //   takeProfit.trailingTAP.activatePrice
                          // )}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'trailingTAP',
                              'activatePrice',
                              e.target.value
                            )
                          }}
                        />
                        <BlueSlider
                          value={takeProfit.trailingTAP.activatePrice}
                          sliderContainerStyles={{
                            width: '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'trailingTAP',
                              'activatePrice',
                              value
                            )
                          }}
                        />
                      </InputRowContainer>
                    </FormInputContainer>
                    <FormInputContainer title={'trailing deviation (%)'}>
                      <InputRowContainer>
                        <Input
                          padding={'0 .8rem 0 0'}
                          width={'calc(50%)'}
                          symbol={'%'}
                          value={takeProfit.trailingTAP.deviationPercentage}
                          showErrors={showErrors && takeProfit.isTakeProfitOn}
                          isValid={this.validateField(
                            takeProfit.trailingTAP.isTrailingOn,
                            takeProfit.trailingTAP.deviationPercentage
                          )}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'trailingTAP',
                              'deviationPercentage',
                              e.target.value
                            )
                          }}
                        />

                        <BlueSlider
                          value={takeProfit.trailingTAP.deviationPercentage}
                          sliderContainerStyles={{
                            width: '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            this.updateSubBlockValue(
                              'takeProfit',
                              'trailingTAP',
                              'deviationPercentage',
                              value
                            )
                          }}
                        />
                      </InputRowContainer>
                    </FormInputContainer>
                  </>
                )}

                {takeProfit.splitTargets.isSplitTargetsOn && (
                  <>
                    <FormInputContainer title={'amount (%)'}>
                      <InputRowContainer>
                        <Input
                          padding={'0 .8rem 0 0'}
                          width={'calc(50%)'}
                          symbol={'%'}
                          value={takeProfit.splitTargets.volumePercentage}
                          onChange={(e) => {
                            const occupiedVolume = takeProfit.splitTargets.targets.reduce(
                              (prev, curr) => prev + curr.quantity,
                              0
                            )

                            this.updateSubBlockValue(
                              'takeProfit',
                              'splitTargets',
                              'volumePercentage',
                              occupiedVolume + e.target.value < 100
                                ? e.target.value
                                : 100 - occupiedVolume
                            )
                          }}
                        />

                        <BlueSlider
                          value={takeProfit.splitTargets.volumePercentage}
                          sliderContainerStyles={{
                            width: '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            const occupiedVolume = takeProfit.splitTargets.targets.reduce(
                              (prev, curr) => prev + curr.quantity,
                              0
                            )

                            this.updateSubBlockValue(
                              'takeProfit',
                              'splitTargets',
                              'volumePercentage',
                              occupiedVolume + value < 100
                                ? value
                                : 100 - occupiedVolume
                            )
                          }}
                        />
                      </InputRowContainer>
                    </FormInputContainer>

                    <InputRowContainer padding="0 0 .6rem 0">
                      <BtnCustom
                        btnColor={'#fff'}
                        backgroundColor={'#F29C38'}
                        borderColor={'#F29C38'}
                        btnWidth={'100%'}
                        height={'auto'}
                        borderRadius={'1rem'}
                        margin={'0'}
                        padding={'.1rem 0'}
                        fontSize={'1rem'}
                        boxShadow={'0px .2rem .3rem rgba(8, 22, 58, 0.15)'}
                        letterSpacing={'.05rem'}
                        onClick={this.addTarget}
                      >
                        add target
                      </BtnCustom>
                    </InputRowContainer>

                    <InputRowContainer
                      padding=".6rem 1rem 1.2rem .4rem"
                      direction="column"
                    >
                      <InputRowContainer padding=".2rem .5rem">
                        <TargetTitle
                          style={{ width: '50%', paddingLeft: '2rem' }}
                        >
                          price
                        </TargetTitle>
                        <TargetTitle style={{ width: '50%' }}>
                          quantity
                        </TargetTitle>
                      </InputRowContainer>
                      <div
                        style={{
                          width: '100%',
                          background: '#F9FBFD',
                          borderRadius: '.8rem',
                          border: '.1rem solid #e0e5ec',
                        }}
                      >
                        {takeProfit.splitTargets.targets.map((target, i) => (
                          <InputRowContainer
                            key={`${target.price}${target.quantity}${i}`}
                            padding=".2rem .5rem"
                            style={
                              takeProfit.splitTargets.targets.length - 1 !== i
                                ? {
                                    borderBottom: '.1rem solid #e0e5ec',
                                  }
                                : {}
                            }
                          >
                            <TargetValue
                              style={{ width: '50%', paddingLeft: '2rem' }}
                            >
                              +{target.price}%
                            </TargetValue>
                            <TargetValue style={{ width: '40%' }}>
                              {target.quantity}%
                            </TargetValue>
                            <CloseIcon
                              onClick={() => this.deleteTarget(i)}
                              style={{
                                color: '#DD6956',
                                fontSize: '1.8rem',
                                cursor: 'pointer',
                              }}
                            />
                          </InputRowContainer>
                        ))}
                      </div>
                    </InputRowContainer>
                  </>
                )}

                {takeProfit.timeout.isTimeoutOn && (
                  <>
                    <TradeInputHeader title={`timeout`} needLine={true} />
                    <InputRowContainer>
                      <SubBlocksContainer>
                        <InputRowContainer>
                          <TimeoutTitle> When profit</TimeoutTitle>
                        </InputRowContainer>
                        <InputRowContainer>
                          <SCheckbox
                            checked={takeProfit.timeout.whenProfitOn}
                            onChange={() => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitOn',
                                !takeProfit.timeout.whenProfitOn
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            haveSelector
                            width={'calc(55% - .4rem)'}
                            value={takeProfit.timeout.whenProfitSec}
                            showErrors={showErrors && takeProfit.isTakeProfitOn}
                            isValid={this.validateField(
                              takeProfit.timeout.whenProfitOn,
                              takeProfit.timeout.whenProfitSec
                            )}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitSec',
                                e.target.value
                              )
                            }}
                            inputStyles={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            disabled={!takeProfit.timeout.whenProfitOn}
                          />
                          <Select
                            width={'calc(30% - .4rem)'}
                            value={takeProfit.timeout.whenProfitMode}
                            inputStyles={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitMode',
                                e.target.value
                              )
                            }}
                            isDisabled={!takeProfit.timeout.whenProfitOn}
                          >
                            <option>sec</option>
                            <option>min</option>
                          </Select>
                        </InputRowContainer>
                      </SubBlocksContainer>

                      <SubBlocksContainer>
                        <InputRowContainer>
                          <TimeoutTitle>When profitable</TimeoutTitle>
                        </InputRowContainer>
                        <InputRowContainer>
                          <SCheckbox
                            checked={takeProfit.timeout.whenProfitableOn}
                            onChange={() => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitableOn',
                                !takeProfit.timeout.whenProfitableOn
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            haveSelector
                            width={'calc(55% - .4rem)'}
                            value={takeProfit.timeout.whenProfitableSec}
                            showErrors={showErrors && takeProfit.isTakeProfitOn}
                            isValid={this.validateField(
                              takeProfit.timeout.whenProfitableOn,
                              takeProfit.timeout.whenProfitableSec
                            )}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitableSec',
                                e.target.value
                              )
                            }}
                            inputStyles={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                            }}
                            disabled={!takeProfit.timeout.whenProfitableOn}
                          />
                          <Select
                            width={'calc(30% - .4rem)'}
                            value={takeProfit.timeout.whenProfitableMode}
                            inputStyles={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitableMode',
                                e.target.value
                              )
                            }}
                            isDisabled={!takeProfit.timeout.whenProfitableOn}
                          >
                            <option>sec</option>
                            <option>min</option>
                          </Select>
                        </InputRowContainer>
                      </SubBlocksContainer>
                    </InputRowContainer>
                  </>
                )}
              </div>

              {!takeProfit.isTakeProfitOn && (
                <BluredBackground>
                  <div
                    style={{
                      width: '50%',
                    }}
                  >
                    <SendButton
                      type={'buy'}
                      onClick={() =>
                        this.toggleBlock('takeProfit', 'isTakeProfitOn')
                      }
                    >
                      show take a profit
                    </SendButton>
                  </div>
                </BluredBackground>
              )}
            </TerminalBlock>
          </TerminalBlocksContainer>
          {editPopup === 'takeProfit' && (
            <EditTakeProfitPopup
              open={editPopup === 'takeProfit'}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(takeProfitProperties) =>
                this.setState({
                  takeProfit: transformTakeProfitProperties(
                    takeProfitProperties
                  ),
                })
              }
              derivedState={getTakeProfitObject(this.state.takeProfit)}
              validate={validateTakeProfit}
              transformProperties={transformTakeProfitProperties}
              validateField={this.validateField}
            />
          )}

          {editPopup === 'stopLoss' && (
            <EditStopLossPopup
              open={editPopup === 'stopLoss'}
              pair={pair}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(stopLossProperties) =>
                this.setState({
                  stopLoss: transformStopLossProperties(stopLossProperties),
                })
              }
              transformProperties={transformStopLossProperties}
              validate={validateStopLoss}
              derivedState={getStopLossObject(this.state.stopLoss)}
              validateField={this.validateField}
            />
          )}

          {editPopup === 'hedge' && (
            <EditHedgePopup
              open={editPopup === 'hedge'}
              pair={pair}
              transformProperties={() => {}}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(hedgeProperties) =>
                this.setState({
                  entryPoint: {
                    ...entryPoint,
                    order: {
                      ...entryPoint.order,
                      ...hedgeProperties,
                    },
                  },
                })
              }
              validate={validateStopLoss}
              derivedState={this.state.entryPoint.order}
              validateField={this.validateField}
            />
          )}

          {editPopup === 'entryOrder' && (
            <EditEntryOrderPopup
              open={editPopup === 'entryOrder'}
              pair={pair}
              marketType={marketType}
              leverage={entryPoint.order.leverage}
              funds={funds}
              transformProperties={transformEntryOrderProperties}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(entryOrderProperties) =>
                this.setState({
                  entryPoint: {
                    ...entryPoint,
                    order: {
                      ...entryPoint.order,
                      ...entryOrderProperties.order,
                    },
                    trailing: {
                      ...entryPoint.trailing,
                      ...entryOrderProperties.trailing,
                    },
                  },
                })
              }
              validate={validateEntryOrder}
              derivedState={getEntryOrderObject(entryPoint)}
              validateField={this.validateField}
            />
          )}
        </CustomCard>
      </>
    )
  }
}
