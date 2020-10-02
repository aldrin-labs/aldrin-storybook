import React from 'react'
import copy from 'clipboard-copy'

import { IProps, IState } from './types'
import {
  getSecondValueFromFirst,
  GreenSwitcherStyles,
  RedSwitcherStyles,
  BlueSwitcherStyles,
  DisabledSwitcherStyles,
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
import { API_URL } from '@core/utils/config'
import WebHookImg from '@sb/images/WebHookImg.png'
import MessageImg from '@sb/images/MessageImg.png'

import { CustomCard } from '../../Chart.styles'
import { SendButton } from '@sb/components/TraidingTerminal/styles'

import {
  StyledZoomIcon,
  LeverageLabel,
  LeverageTitle,
  SettingsLabel,
} from '@sb/components/TradingWrapper/styles'
import GreenSwitcher from '@sb/components/SwitchOnOff/GreenSwitcher'
import CloseIcon from '@material-ui/icons/Close'

import {
  SCheckbox,
  SRadio,
} from '@sb/components/SharePortfolioDialog/SharePortfolioDialog.styles'
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
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'

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
  StyledSwitch,
  ChangeOrderTypeBtn,
  Switcher,
} from './styles'

import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

const generateToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15)

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
        hedgeMode: false,
        isHedgeOn: false,
        hedgePrice: 0,
        // X20,
        hedgeIncrease: 1,
        hedgeSide: 'short',
      },
      trailing: {
        isTrailingOn: false,
        deviationPercentage: 0,
        trailingDeviationPrice: 0,
      },
      averaging: {
        enabled: false,
        percentage: 0,
        price: 0,
        closeStrategyAfterFirstTAP: false,
        placeWithoutLoss: false,
        entryLevels: [],
      },
      TVAlert: {
        isTVAlertOn: false,
        templateMode: 'once',
        templateToken: generateToken(),
        plotEnabled: false,
        immediateEntry: false,
        sidePlotEnabled: true,
        sidePlot: '',
        typePlotEnabled: true,
        typePlot: '',
        pricePlotEnabled: true,
        pricePlot: '',
        amountPlotEnabled: true,
        amountPlot: '',
        deviationPlotEnabled: true,
        deviationPlot: '',
      },
    },
    takeProfit: {
      isTakeProfitOn: true,
      type: 'limit',
      pricePercentage: 0,
      takeProfitPrice: 0,
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
      external: false,
      forcedStopByAlert: false,
      plotEnabled: false,
      plot: '',
    },
    stopLoss: {
      isStopLossOn: true,
      type: 'limit',
      pricePercentage: 0,
      stopLossPrice: 0,
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
        mandatoryForcedLoss: false,
        isForcedStopOn: false,
        pricePercentage: 0,
        forcedStopPrice: 0,
      },
      external: false,
      forcedStopByAlert: false,
      plotEnabled: false,
      plot: '',
    },
    temp: {
      initialMargin: 0,
    },
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    const isMarketType =
      state.entryPoint.order.type === 'market' ||
      state.entryPoint.order.type === 'maker-only'

    // TODO: check this condition later
    if (
      state.priceForCalculate === 0 ||
      (isMarketType && !state.entryPoint.trailing.isTrailingOn)
    ) {
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
      componentLeverage,
      hedgeMode,
    } = this.props

    this.updateSubBlockValue('entryPoint', 'order', 'price', this.props.price)

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
          hedgeMode: hedgeMode,
        },
        averaging: {
          enabled: false,
          closeStrategyAfterFirstTAP: false,
          placeWithoutLoss: false,
          entryLevels: [],
          percentage: 0,
          price: 0,
          ...result.entryPoint.averaging,
        },
        TVAlert: {
          isTVAlertOn: false,
          templateMode: 'once',
          plotEnabled: false,
          immediateEntry: false,
          sidePlotEnabled: true,
          sidePlot: '',
          typePlotEnabled: true,
          typePlot: '',
          pricePlotEnabled: true,
          pricePlot: '',
          amountPlotEnabled: true,
          amountPlot: '',
          deviationPlotEnabled: true,
          deviationPlot: '',
          ...result.entryTVAlert,
          templateToken: generateToken(),
        },
        trailing: {
          trailingDeviationPrice: 0,
          deviationPercentage: 0,
          isTrailingOn: false,
          ...(marketType === 1 ? { ...prevState.entryPoint.trailing } : {}),
          ...(result.entryPoint && marketType === 1
            ? {
                ...result.entryPoint.trailing,
                deviationPercentage: +stripDigitPlaces(
                  result.entryPoint.trailing.deviationPercentage /
                    componentLeverage,
                  3
                ),
              }
            : {}),
        },
      },
      takeProfit: {
        takeProfitPrice: 0,
        ...result.takeProfit,
        trailingTAP: {
          ...result.takeProfit.trailingTAP,
        },
      },
      stopLoss: {
        stopLossPrice: 0,
        ...result.stopLoss,
        forcedStop: {
          forcedStopPrice: 0,
          ...result.stopLoss.forcedStop,
          isForcedStopOn: result.stopLoss.timeout.isTimeoutOn,
          mandatoryForcedLoss: !!result.stopLoss.forcedStop.mandatoryForcedLoss,
        },
      },
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

    const isMarketType =
      result.entryPoint.order.type === 'market' ||
      result.entryPoint.order.type === 'maker-only'

    let price =
      (isMarketType && !result.entryPoint.trailing.isTrailingOn) ||
      !result.entryPoint.order.price
        ? this.props.price
        : result.entryPoint.order.price

    const newTotal = result.entryPoint.order.amount * this.props.price

    this.updateSubBlockValue(
      'entryPoint',
      'order',
      'amount',
      result.entryPoint.order.amount
    )
    this.updateSubBlockValue('entryPoint', 'order', 'price', this.props.price)
    this.updateSubBlockValue(
      'entryPoint',
      'averaging',
      'price',
      this.props.price
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
      stripDigitPlaces((newTotal || 0) / this.props.leverage, 2)
    )

    this.updateStopLossAndTakeProfitPrices({
      price,
      stopLossPercentage: result.stopLoss.pricePercentage,
      forcedStopPercentage: result.stopLoss.forcedStop.pricePercentage,
      takeProfitPercentage: result.takeProfit.trailingTAP.isTrailingOn
        ? result.takeProfit.trailingTAP.activatePrice
        : result.takeProfit.pricePercentage,
      deviationPercentage:
        result.entryPoint.trailing.deviationPercentage / componentLeverage,
      includeDeviation: true,
    })
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.priceFromOrderbook !== this.props.priceFromOrderbook &&
      this.props.priceFromOrderbook &&
      this.state.entryPoint.order.type === 'limit'
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
        stripDigitPlaces(
          this.props.priceFromOrderbook * this.state.entryPoint.order.amount,
          this.props.marketType === 1 ? 2 : 8
        )
      )
    }

    if (prevProps.componentLeverage !== this.props.componentLeverage) {
      const isMarketType =
        this.state.entryPoint.order.type === 'market' ||
        this.state.entryPoint.order.type === 'maker-only'
      const total = this.state.temp.initialMargin * this.props.componentLeverage
      const price =
        isMarketType && !this.state.entryPoint.trailing.isTrailingOn
          ? this.props.price
          : this.state.entryPoint.order.price

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'total',
        stripDigitPlaces(total, this.props.marketType === 1 ? 2 : 8)
      )

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'amount',
        stripDigitPlaces(
          total / price,
          this.props.marketType === 1 ? this.props.quantityPrecision : 8
        )
      )

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'leverage',
        this.props.componentLeverage
      )

      this.updateStopLossAndTakeProfitPrices({
        leverage: this.props.componentLeverage,
      })
    }

    if (
      this.props.price !== prevProps.price &&
      this.state.entryPoint.order.type === 'market' &&
      !this.state.entryPoint.trailing.isTrailingOn
    ) {
      const { price, marketType } = this.props
      const total = this.state.temp.initialMargin * this.props.componentLeverage

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'amount',
        stripDigitPlaces(
          total / this.props.price,
          marketType === 1 ? this.props.quantityPrecision : 8
        )
      )

      this.updateStopLossAndTakeProfitPrices({
        price,
      })
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

    if (prevProps.hedgeMode !== this.props.hedgeMode) {
      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'hedgeMode',
        this.props.hedgeMode
      )
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

  addAverageTarget = () => {
    const {
      averaging: {
        placeWithoutLoss,
        entryLevels,
        percentage,
        price: averagingPrice,
      },
      order: { price, amount },
    } = this.state.entryPoint

    const isAveragingAfterFirstTarget =
      this.state.entryPoint.averaging.entryLevels.length > 0 &&
      this.state.entryPoint.averaging.enabled

    if (price !== 0 && amount !== 0) {
      this.setState((prev) => ({
        entryPoint: {
          ...prev.entryPoint,
          averaging: {
            ...prev.entryPoint.averaging,
            placeWithoutLoss: false,
            percentage: 0,
            entryLevels: [
              ...entryLevels,
              {
                price: isAveragingAfterFirstTarget ? +percentage : +price,
                amount: +amount,
                type: isAveragingAfterFirstTarget ? 1 : 0,
                placeWithoutLoss,
              },
            ],
          },
        },
      }))

      this.updateSubBlockValue('entryPoint', 'order', 'price', averagingPrice)
    }
  }

  deleteAverageTarget = (index: number) => {
    const {
      averaging: { entryLevels },
    } = this.state.entryPoint

    const { pricePrecision } = this.props

    let price = entryLevels[0].price

    let newEntryLevels =
      index === 0
        ? []
        : [...entryLevels.slice(0, index), ...entryLevels.slice(index + 1)]

    if (index !== 0) {
      newEntryLevels.forEach((target, i) => {
        if (i === 0) {
          return
        }
        price =
          this.state.entryPoint.order.side === 'buy'
            ? +stripDigitPlaces(
                this.state.entryPoint.order.price *
                  (1 -
                    target.price / 100 / this.state.entryPoint.order.leverage),
                pricePrecision
              )
            : +stripDigitPlaces(
                this.state.entryPoint.order.price *
                  (1 +
                    target.price / 100 / this.state.entryPoint.order.leverage),
                pricePrecision
              )
      })
    }

    this.setState({
      entryPoint: {
        ...this.state.entryPoint,
        averaging: {
          ...this.state.entryPoint.averaging,
          price: price,
          percentage: 0,
          entryLevels: newEntryLevels,
        },
      },
    })

    this.updateSubBlockValue('entryPoint', 'order', 'price', price)
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
    if (valueName === 'price') {
      this.updateStopLossAndTakeProfitPrices({
        price: +newValue,
      })
    }

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
      if (!value || value <= 0 || value === '' || value === '0') {
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

    // ux-improvement to see popup before result from the backend received
    const successResult = {
      status: 'success',
      message: 'Smart order placed',
      orderId: '0',
    }
    showOrderResult(successResult, cancelOrder)

    updateTerminalViewMode('default')

    const result = await placeOrder(
      entryPoint.order.side,
      entryPoint.order.type,
      {},
      'smart',
      this.state
    )

    if (result.status === 'error' || !result.orderId) {
      await showOrderResult(result, cancelOrder)
    }

    // if (result.status === 'success' && result.orderId)
    //   updateTerminalViewMode('default')
  }

  getEntryPrice = () => {
    const { entryPoint } = this.state
    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'

    let price =
      entryPoint.order.type === 'market' && !entryPoint.trailing.isTrailingOn
        ? this.props.price
        : entryPoint.order.price

    if (entryPoint.trailing.isTrailingOn) {
      price =
        entryPoint.order.side === 'buy'
          ? price * (1 + entryPoint.trailing.deviationPercentage / 100)
          : price * (1 - entryPoint.trailing.deviationPercentage / 100)
    }

    return price
  }

  updateStopLossAndTakeProfitPrices = ({
    price,
    stopLossPercentage,
    takeProfitPercentage,
    forcedStopPercentage,
    leverage,
    side,
    deviationPercentage,
    includeDeviation = false,
  }: {
    price?: number
    stopLossPercentage?: number
    takeProfitPercentage?: number
    forcedStopPercentage?: number
    leverage?: number
    side?: string
    deviationPercentage?: number
    includeDeviation?: boolean
  }) => {
    const { pricePrecision } = this.props
    const { entryPoint, stopLoss, takeProfit } = this.state

    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'

    side = !!side ? side : entryPoint.order.side
    price =
      price !== undefined
        ? price
        : isMarketType && !entryPoint.trailing.isTrailingOn
        ? this.props.price
        : entryPoint.order.price

    leverage = !!leverage ? leverage : entryPoint.order.leverage

    stopLossPercentage = !!stopLossPercentage
      ? stopLossPercentage
      : stopLoss.pricePercentage

    takeProfitPercentage = !!takeProfitPercentage
      ? takeProfitPercentage
      : takeProfit.trailingTAP.isTrailingOn
      ? takeProfit.trailingTAP.activatePrice
      : takeProfit.pricePercentage

    forcedStopPercentage = !!forcedStopPercentage
      ? forcedStopPercentage
      : stopLoss.forcedStop.pricePercentage

    deviationPercentage = !!deviationPercentage
      ? deviationPercentage
      : entryPoint.trailing.deviationPercentage

    const trailingDeviationPrice =
      side === 'buy'
        ? stripDigitPlaces(
            price * (1 + deviationPercentage / 100),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 - deviationPercentage / 100),
            pricePrecision
          )

    if (entryPoint.trailing.isTrailingOn || includeDeviation) {
      price =
        side === 'buy'
          ? price * (1 + deviationPercentage / 100)
          : price * (1 - deviationPercentage / 100)
    }

    const stopLossPrice =
      side === 'buy'
        ? stripDigitPlaces(
            price * (1 - stopLossPercentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 + stopLossPercentage / 100 / leverage),
            pricePrecision
          )

    const forcedStopPrice =
      side === 'buy'
        ? stripDigitPlaces(
            price * (1 - forcedStopPercentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 + forcedStopPercentage / 100 / leverage),
            pricePrecision
          )

    const takeProfitPrice =
      side === 'sell'
        ? stripDigitPlaces(
            price * (1 - takeProfitPercentage / 100 / leverage),
            pricePrecision
          )
        : stripDigitPlaces(
            price * (1 + takeProfitPercentage / 100 / leverage),
            pricePrecision
          )

    this.updateBlockValue('stopLoss', 'stopLossPrice', stopLossPrice)
    this.updateBlockValue('takeProfit', 'takeProfitPrice', takeProfitPrice)
    this.updateSubBlockValue(
      'stopLoss',
      'forcedStop',
      'forcedStopPrice',
      forcedStopPrice
    )
    this.updateSubBlockValue(
      'entryPoint',
      'trailing',
      'trailingDeviationPrice',
      trailingDeviationPrice
    )
  }

  getMaxValues = (): number[] => {
    const { entryPoint } = this.state
    const { funds, marketType, quantityPrecision } = this.props

    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'
    let maxAmount = 0

    let priceForCalculate =
      isMarketType && !entryPoint.trailing.isTrailingOn
        ? this.props.price
        : entryPoint.order.price

    if (marketType === 0) {
      maxAmount =
        entryPoint.order.side === 'buy'
          ? +stripDigitPlaces(funds[1].quantity, 8)
          : +stripDigitPlaces(funds[0].quantity, 8)
    } else if (marketType === 1) {
      maxAmount = +stripDigitPlaces(
        funds[1].quantity * entryPoint.order.leverage,
        quantityPrecision
      )
    }

    if (entryPoint.averaging.entryLevels.length > 0) {
      entryPoint.averaging.entryLevels.forEach((target) => {
        if (marketType === 0) {
          maxAmount -= target.amount
        } else {
          maxAmount -= target.amount * priceForCalculate
        }
      })
    }

    const [amount, total] =
      entryPoint.order.side === 'buy' || marketType === 1
        ? [maxAmount / priceForCalculate, maxAmount]
        : [maxAmount, maxAmount / priceForCalculate]

    return [amount, total]
  }

  setMaxAmount = () => {
    const { funds, marketType, quantityPrecision } = this.props

    const [amount, total] = this.getMaxValues()

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

  getEntryAlertJson = () => {
    const {
      entryPoint: {
        TVAlert: {
          plotEnabled,
          sidePlotEnabled,
          sidePlot,
          typePlotEnabled,
          typePlot,
          pricePlotEnabled,
          pricePlot,
          amountPlotEnabled,
          amountPlot,
          deviationPlotEnabled,
          deviationPlot,
          templateToken,
        },
        order: { type, side, amount, price },
        trailing: { isTrailingOn, deviationPercentage },
      },
    } = this.state

    const typeJson =
      typePlotEnabled && plotEnabled
        ? `\\"orderType\\": {{plot_${typePlot}}}`
        : `\\"orderType\\": \\"${type}\\"`

    const sideJson =
      sidePlotEnabled && plotEnabled
        ? `\\"side\\": {{plot_${sidePlot}}}`
        : `\\"side\\": \\"${side}\\"`

    const priceJson = isTrailingOn
      ? pricePlotEnabled && plotEnabled
        ? `\\"activatePrice\\": {{plot_${pricePlot}}}`
        : `\\"activatePrice\\": ${price}`
      : pricePlotEnabled && plotEnabled
      ? `\\"price\\": {{plot_${pricePlot}}}`
      : `\\"price\\": ${price}`

    const amountJson =
      amountPlotEnabled && plotEnabled
        ? `\\"amount\\": {{plot_${amountPlot}}}`
        : `\\"amount\\": ${amount}`

    const hedgeModeJson = `\\"hedgeMode\\": ${this.props.hedgeMode}`

    const deviationJson = isTrailingOn
      ? deviationPlotEnabled && plotEnabled
        ? `\\"entryDeviation\\": {{plot_${deviationPlot}}}`
        : `\\"entryDeviation\\": \\"${deviationPercentage}\\"`
      : ''

    return `{\\"token\\": \\"${templateToken}\\", ${typeJson}, ${hedgeModeJson}, ${sideJson}, ${priceJson}, ${amountJson}${
      isTrailingOn ? ', ' : ''
    }${deviationJson}}`
  }

  render() {
    const {
      pair,
      funds,
      theme,
      marketType,
      updateLeverage,
      quantityPrecision,
      updateTerminalViewMode,
      isSmartOrderMode,
      pricePrecision,
      enqueueSnackbar,
      minSpotNotional,
      minFuturesStep,
      maxLeverage,
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

    const isSPOTMarket = marketType === 0
    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'
    const isAveragingAfterFirstTarget =
      entryPoint.averaging.entryLevels.length > 0 &&
      entryPoint.averaging.enabled

    let maxAmount = 0
    let priceForCalculate =
      isMarketType && !entryPoint.trailing.isTrailingOn
        ? this.props.price
        : entryPoint.order.price

    if (marketType === 0) {
      maxAmount =
        entryPoint.order.side === 'buy' ? funds[1].quantity : funds[0].quantity
    } else if (marketType === 1) {
      maxAmount = funds[1].quantity * entryPoint.order.leverage
    }

    console.log('maxAmount', maxAmount)

    if (entryPoint.averaging.entryLevels.length > 0) {
      entryPoint.averaging.entryLevels.forEach((target) => {
        if (marketType === 0 && entryPoint.order.side === 'sell') {
          maxAmount -= target.amount
        } else {
          maxAmount -= target.amount * priceForCalculate
        }
      })
    }

    console.log('maxAmount', maxAmount)

    return (
      <>
        {showConfirmationPopup && !editPopup && (
          <ConfirmationPopup
            theme={theme}
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
        <CustomCard theme={theme} style={{ borderTop: 0 }}>
          <TerminalHeaders>
            <TerminalHeader
              theme={theme}
              key={'entryPoint'}
              width={'33%'}
              justify={marketType === 0 ? 'center' : 'space-between'}
            >
              <BlockHeader theme={theme}>entry point</BlockHeader>
              {marketType === 1 && (
                <div
                  style={{
                    display: 'flex',
                    width: '60%',
                    alignItems: 'center',
                  }}
                >
                  <LeverageTitle theme={theme}>leverage:</LeverageTitle>
                  <SmallSlider
                    min={1}
                    max={maxLeverage}
                    defaultValue={startLeverage}
                    value={
                      !entryPoint.order.leverage
                        ? startLeverage
                        : entryPoint.order.leverage
                    }
                    valueSymbol={'X'}
                    marks={
                      maxLeverage === 125
                        ? {
                            1: {},
                            25: {},
                            50: {},
                            75: {},
                            100: {},
                            125: {},
                          }
                        : maxLeverage === 75
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
                            10: {},
                            20: {},
                            30: {},
                            40: {},
                            50: {},
                          }
                    }
                    onChange={(leverage) => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'leverage',
                        leverage
                      )

                      const total = this.state.temp.initialMargin * leverage

                      const price =
                        isMarketType && !entryPoint.trailing.isTrailingOn
                          ? this.props.price
                          : entryPoint.order.price

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'total',
                        stripDigitPlaces(
                          total,
                          this.props.marketType === 1 ? 2 : 8
                        )
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        stripDigitPlaces(
                          total / price,
                          this.props.marketType === 1
                            ? this.props.quantityPrecision
                            : 8
                        )
                      )

                      this.updateStopLossAndTakeProfitPrices({
                        leverage,
                      })
                    }}
                    onAfterChange={(leverage: number) => {
                      updateLeverage(leverage)
                    }}
                    sliderContainerStyles={{
                      width: '65%',
                      margin: '0 auto',
                    }}
                    trackBeforeBackground={theme.palette.green.main}
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
                    {entryPoint.order.leverage || 1}x
                  </LeverageLabel>
                </div>
              )}
            </TerminalHeader>
            <TerminalHeader
              theme={theme}
              width={'32.5%'}
              margin={'0 1%'}
              padding={'0rem 1.5rem'}
              justify={'center'}
              key={'stopLoss'}
            >
              <BlockHeader theme={theme}>stop loss</BlockHeader>
              {/* <GreenSwitcher
                id="isStopLossOn"
                checked={stopLoss.isStopLossOn}
                handleToggle={() =>
                  this.toggleBlock('stopLoss', 'isStopLossOn')
                }
              /> */}
            </TerminalHeader>
            <TerminalHeader
              theme={theme}
              key={'takeProfit'}
              width={'32.5%'}
              padding={'0rem 1.5rem'}
              justify={'center'}
            >
              <BlockHeader theme={theme}>take a profit</BlockHeader>
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

            <TerminalBlock theme={theme} width={'calc(33% + 0.5%)'}>
              {/* {marketType === 1 && (
                <InputRowContainer padding={'0 0 0.6rem 0'}>
                  <CustomSwitcher theme={theme}
                    containerStyles={{
                      width: entryPoint.TVAlert.plotEnabled ? '70%' : '100%',
                      margin: 0,
                    }}
                    buttonHeight={'3rem'}
                    firstHalfStyleProperties={
                      entryPoint.TVAlert.plotEnabled &&
                      entryPoint.TVAlert.hedgeModePlotEnabled
                        ? DisabledSwitcherStyles
                        : BlueSwitcherStyles
                    }
                    secondHalfStyleProperties={
                      entryPoint.TVAlert.plotEnabled &&
                      entryPoint.TVAlert.hedgeModePlotEnabled
                        ? DisabledSwitcherStyles
                        : BlueSwitcherStyles
                    }
                    firstHalfText={'one-way'}
                    secondHalfText={'hedge'}
                    firstHalfIsActive={!entryPoint.order.hedgeMode}
                    changeHalf={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'hedgeMode',
                        !entryPoint.order.hedgeMode
                      )
                    }}
                  />
                  {entryPoint.TVAlert.plotEnabled && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '10%',
                        }}
                      >
                        <Switcher
                          checked={entryPoint.TVAlert.hedgeModePlotEnabled}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'hedgeModePlotEnabled',
                              !entryPoint.TVAlert.hedgeModePlotEnabled
                            )
                          }}
                        />
                      </div>
                      <Input theme={theme}                        type={'number'}
                        needTitle
                        title={`plot_`}
                        textAlign="left"
                        width={'calc(20% - .8rem)'}
                        inputStyles={{
                          paddingLeft: '4rem',
                        }}
                        disabled={!entryPoint.TVAlert.hedgeModePlotEnabled}
                        value={entryPoint.TVAlert.hedgeModePlot}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          true,
                          entryPoint.TVAlert.hedgeModePlot
                        )}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'hedgeModePlot',
                            e.target.value
                          )
                        }}
                      />
                    </>
                  )}
                </InputRowContainer>
              )} */}
              <InputRowContainer padding={'0 0 .6rem 0'}>
                {/* <div style={{ width: '50%' }}>
                  {' '}
                  <CustomSwitcher
                    theme={theme}
                    firstHalfText={marketType === 1 ? 'long' : 'buy'}
                    secondHalfText={marketType === 1 ? 'short' : 'sell'}
                    buttonHeight={'3rem'}
                    containerStyles={{
                      width: entryPoint.TVAlert.plotEnabled ? '70%' : '100%',
                      padding: 0,
                    }}
                    firstHalfStyleProperties={
                      entryPoint.TVAlert.plotEnabled &&
                      entryPoint.TVAlert.sidePlotEnabled
                        ? DisabledSwitcherStyles(theme)
                        : GreenSwitcherStyles(theme)
                    }
                    secondHalfStyleProperties={
                      entryPoint.TVAlert.plotEnabled &&
                      entryPoint.TVAlert.sidePlotEnabled
                        ? DisabledSwitcherStyles(theme)
                        : RedSwitcherStyles(theme)
                    }
                    firstHalfIsActive={entryPoint.order.side === 'buy'}
                    changeHalf={() => {
                      if (
                        entryPoint.TVAlert.plotEnabled &&
                        entryPoint.TVAlert.sidePlotEnabled
                      ) {
                        return
                      }

                      if (marketType === 0) {
                        // disable sell option for spot
                        const newSide = getSecondValueFromFirst(
                          entryPoint.order.side
                        )

                        if (newSide === 'sell') {
                          return
                        }

                        const amountPercentage =
                          entryPoint.order.side === 'buy' || marketType === 1
                            ? entryPoint.order.total / (maxAmount / 100)
                            : entryPoint.order.amount / (maxAmount / 100)

                        const newMaxAmount =
                          newSide === 'buy'
                            ? funds[1].quantity
                            : funds[0].quantity

                        let amount =
                          newSide === 'buy'
                            ? stripDigitPlaces(
                                ((amountPercentage / 100) * newMaxAmount) /
                                  priceForCalculate,
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
                          amount * priceForCalculate,
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

                      this.updateStopLossAndTakeProfitPrices({
                        price: priceForCalculate,
                        stopLossPercentage: stopLoss.pricePercentage,
                        side: getSecondValueFromFirst(entryPoint.order.side),
                      })

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'side',
                        getSecondValueFromFirst(entryPoint.order.side)
                      )
                    }}
                  />
                </div> */}

                {entryPoint.TVAlert.plotEnabled && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '10%',
                      }}
                    >
                      <Switcher
                        checked={entryPoint.TVAlert.sidePlotEnabled}
                        onChange={() => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'sidePlotEnabled',
                            !entryPoint.TVAlert.sidePlotEnabled
                          )
                        }}
                      />
                    </div>
                    <Input
                      theme={theme}
                      type={'number'}
                      needTitle
                      title={`plot_`}
                      textAlign="left"
                      width={'calc(20% - .8rem)'}
                      inputStyles={{
                        paddingLeft: '4rem',
                      }}
                      disabled={!entryPoint.TVAlert.sidePlotEnabled}
                      value={entryPoint.TVAlert.sidePlot}
                      showErrors={showErrors}
                      isValid={this.validateField(
                        true,
                        entryPoint.TVAlert.sidePlot
                      )}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'sidePlot',
                          e.target.value
                        )
                      }}
                    />
                  </>
                )}
              </InputRowContainer>

              {/* <InputRowContainer padding={'0 0 0.6rem 0'}>
                <CustomSwitcher
                  theme={theme}
                  firstHalfText={'limit'}
                  secondHalfText={'market'}
                  buttonHeight={'3rem'}
                  containerStyles={{
                    width: entryPoint.TVAlert.plotEnabled ? '70%' : '100%',
                    padding: 0,
                  }}
                  firstHalfStyleProperties={
                    entryPoint.TVAlert.plotEnabled &&
                    entryPoint.TVAlert.typePlotEnabled
                      ? DisabledSwitcherStyles(theme)
                      : BlueSwitcherStyles(theme)
                  }
                  secondHalfStyleProperties={
                    entryPoint.TVAlert.plotEnabled &&
                    entryPoint.TVAlert.typePlotEnabled
                      ? DisabledSwitcherStyles(theme)
                      : BlueSwitcherStyles(theme)
                  }
                  firstHalfIsActive={entryPoint.order.type === 'limit'}
                  changeHalf={() => {
                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'type',
                      getSecondValueFromFirst(entryPoint.order.type)
                    )

                    if (
                      getSecondValueFromFirst(entryPoint.order.type) ===
                        'market' &&
                      !entryPoint.trailing.isTrailingOn
                    ) {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'averaging',
                        'enabled',
                        false
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

                      this.updateBlockValue(
                        'temp',
                        'initialMargin',
                        stripDigitPlaces(
                          (this.props.price * entryPoint.order.amount) /
                            entryPoint.order.leverage,
                          2
                        )
                      )
                    }

                    if (
                      getSecondValueFromFirst(entryPoint.order.type) === 'limit'
                    ) {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'TVAlert',
                        'immediateEntry',
                        false
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
                {entryPoint.TVAlert.plotEnabled && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '10%',
                      }}
                    >
                      <Switcher
                        checked={entryPoint.TVAlert.typePlotEnabled}
                        onChange={() => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'typePlotEnabled',
                            !entryPoint.TVAlert.typePlotEnabled
                          )
                        }}
                      />
                    </div>
                    <Input
                      theme={theme}
                      type={'number'}
                      needTitle
                      title={`plot_`}
                      textAlign="left"
                      width={'calc(20% - .8rem)'}
                      inputStyles={{
                        paddingLeft: '4rem',
                      }}
                      disabled={!entryPoint.TVAlert.typePlotEnabled}
                      value={entryPoint.TVAlert.typePlot}
                      showErrors={showErrors}
                      isValid={this.validateField(
                        true,
                        entryPoint.TVAlert.typePlot
                      )}
                      onChange={(e) => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'typePlot',
                          e.target.value
                        )
                      }}
                    />
                  </>
                )}
              </InputRowContainer> */}
              {/* <InputRowContainer
                justify="flex-start"
                padding={'.6rem 0 0.6rem 0'}
              >
                <ChangeOrderTypeBtn
                  theme={theme}
                  isActive={entryPoint.order.type === 'market'}
                  onClick={() => {
                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'type',
                      'market'
                    )

                    if (!entryPoint.trailing.isTrailingOn) {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'averaging',
                        'enabled',
                        false
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

                      this.updateBlockValue(
                        'temp',
                        'initialMargin',
                        stripDigitPlaces(
                          (this.props.price * entryPoint.order.amount) /
                            entryPoint.order.leverage,
                          2
                        )
                      )
                    }
                  }}
                >
                  Market
                </ChangeOrderTypeBtn>
                <ChangeOrderTypeBtn
                  theme={theme}
                  isActive={entryPoint.order.type === 'limit'}
                  onClick={() => {
                    this.updateSubBlockValue(
                      'entryPoint',
                      'order',
                      'type',
                      'limit'
                    )

                    this.updateSubBlockValue(
                      'entryPoint',
                      'TVAlert',
                      'immediateEntry',
                      false
                    )
                  }}
                >
                  Limit
                </ChangeOrderTypeBtn>
                <DarkTooltip
                  maxWidth={'30rem'}
                  title={
                    'Maker-only or post-only market order will place a post-only limit orders as close to the market price as possible until the last one is executed. This way you can enter the position at the market price by paying low maker fees.'
                  }
                >
                  <ChangeOrderTypeBtn
                    theme={theme}
                    isActive={entryPoint.order.type === 'maker-only'}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'type',
                        'maker-only'
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'averaging',
                        'enabled',
                        false
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

                      this.updateBlockValue(
                        'temp',
                        'initialMargin',
                        stripDigitPlaces(
                          (this.props.price * entryPoint.order.amount) /
                            entryPoint.order.leverage,
                          2
                        )
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'trailing',
                        'isTrailingOn',
                        false
                      )
                    }}
                  >
                    Maker-only
                  </ChangeOrderTypeBtn>
                </DarkTooltip>
              </InputRowContainer> */}

              <div>
                <InputRowContainer
                  justify="flex-start"
                  padding={'.6rem 0 1.2rem 0'}
                >
                  {marketType === 1 && (
                    <DarkTooltip
                      maxWidth={'40rem'}
                      title={
                        <>
                          <p>
                            The algorithm which will wait for the trend to
                            reverse to place the order.
                          </p>

                          <p>
                            <b>Activation price:</b> The price at which the
                            algorithm is enabled.
                          </p>

                          <p>
                            <b>Deviation:</b> The level of price change after
                            the trend reversal, at which the order will be
                            executed.
                          </p>

                          <p>
                            <b>For example:</b> you set 7500 USDT activation
                            price and 1% deviation to buy BTC. Trailing will
                            start when price will be 7500 and then after
                            activation there will be a buy when the price moves
                            upward by 1% from its lowest point. If for instance
                            it drops to $7,300, then the trend will reverse and
                            start to rise, the order will be executed when the
                            price reaches 7373, i.e. by 1% from the moment the
                            trend reversed.
                          </p>
                        </>
                      }
                    >
                      <AdditionalSettingsButton
                        theme={theme}
                        isActive={entryPoint.trailing.isTrailingOn}
                        onClick={() => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'isTrailingOn',
                            !entryPoint.trailing.isTrailingOn
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'immediateEntry',
                            false
                          )

                          if (!entryPoint.trailing.isTrailingOn) {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'enabled',
                              false
                            )
                          }

                          if (entryPoint.order.type === 'maker-only') {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'order',
                              'type',
                              'limit'
                            )
                          }
                        }}
                      >
                        Trailing {entryPoint.order.side}
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                  )}
                  <DarkTooltip
                    maxWidth={'30rem'}
                    title={
                      'Your smart order will be placed once when there is a Trading View alert that you connected to smart order.'
                    }
                  >
                    <AdditionalSettingsButton
                      theme={theme}
                      isActive={entryPoint.TVAlert.isTVAlertOn}
                      onClick={() => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'TVAlert',
                          'isTVAlertOn',
                          !entryPoint.TVAlert.isTVAlertOn
                        )

                        if (entryPoint.TVAlert.isTVAlertOn) {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'plotEnabled',
                            false
                          )
                        }
                      }}
                    >
                      Entry by TV Alert
                    </AdditionalSettingsButton>
                  </DarkTooltip>
                  <DarkTooltip
                    maxWidth={'30rem'}
                    title={
                      'Your smart order will be placed once when there is a Trading View alert that you connected to smart order.'
                    }
                  >
                    <AdditionalSettingsButton
                      theme={theme}
                      isActive={entryPoint.averaging.enabled}
                      onClick={() => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'averaging',
                          'enabled',
                          !entryPoint.averaging.enabled
                        )

                        if (!entryPoint.averaging.enabled) {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'type',
                            'limit'
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'isTrailingOn',
                            false
                          )

                          this.updateSubBlockValue(
                            'takeProfit',
                            'trailingTAP',
                            'isTrailingOn',
                            false
                          )

                          this.updateSubBlockValue(
                            'takeProfit',
                            'splitTargets',
                            'isSplitTargetsOn',
                            false
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'plotEnabled',
                            false
                          )
                        }
                      }}
                    >
                      Averaging
                    </AdditionalSettingsButton>
                  </DarkTooltip>
                </InputRowContainer>

                <InputRowContainer>
                  {' '}
                  <div style={{ width: '50%', marginRight: '2%' }}>
                    {' '}
                    <CustomSwitcher
                      theme={theme}
                      firstHalfText={marketType === 1 ? 'long' : 'buy'}
                      secondHalfText={marketType === 1 ? 'short' : 'sell'}
                      buttonHeight={'3rem'}
                      containerStyles={{
                        width: entryPoint.TVAlert.plotEnabled ? '70%' : '100%',
                        padding: 0,
                      }}
                      firstHalfStyleProperties={
                        entryPoint.TVAlert.plotEnabled &&
                        entryPoint.TVAlert.sidePlotEnabled
                          ? DisabledSwitcherStyles(theme)
                          : GreenSwitcherStyles(theme)
                      }
                      secondHalfStyleProperties={
                        entryPoint.TVAlert.plotEnabled &&
                        entryPoint.TVAlert.sidePlotEnabled
                          ? DisabledSwitcherStyles(theme)
                          : RedSwitcherStyles(theme)
                      }
                      firstHalfIsActive={entryPoint.order.side === 'buy'}
                      changeHalf={() => {
                        if (
                          entryPoint.TVAlert.plotEnabled &&
                          entryPoint.TVAlert.sidePlotEnabled
                        ) {
                          return
                        }

                        if (marketType === 0) {
                          // disable sell option for spot
                          const newSide = getSecondValueFromFirst(
                            entryPoint.order.side
                          )

                          if (newSide === 'sell') {
                            return
                          }

                          const amountPercentage =
                            entryPoint.order.side === 'buy' || marketType === 1
                              ? entryPoint.order.total / (maxAmount / 100)
                              : entryPoint.order.amount / (maxAmount / 100)

                          const newMaxAmount =
                            newSide === 'buy'
                              ? funds[1].quantity
                              : funds[0].quantity

                          let amount =
                            newSide === 'buy'
                              ? stripDigitPlaces(
                                  ((amountPercentage / 100) * newMaxAmount) /
                                    priceForCalculate,
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
                            amount * priceForCalculate,
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

                        this.updateStopLossAndTakeProfitPrices({
                          price: priceForCalculate,
                          stopLossPercentage: stopLoss.pricePercentage,
                          side: getSecondValueFromFirst(entryPoint.order.side),
                        })

                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'side',
                          getSecondValueFromFirst(entryPoint.order.side)
                        )
                      }}
                    />
                  </div>
                  <ChangeOrderTypeBtn
                    theme={theme}
                    isActive={entryPoint.order.type === 'market'}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'type',
                        'market'
                      )

                      if (!entryPoint.trailing.isTrailingOn) {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'averaging',
                          'enabled',
                          false
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

                        this.updateBlockValue(
                          'temp',
                          'initialMargin',
                          stripDigitPlaces(
                            (this.props.price * entryPoint.order.amount) /
                              entryPoint.order.leverage,
                            2
                          )
                        )
                      }
                    }}
                  >
                    Market
                  </ChangeOrderTypeBtn>
                  <ChangeOrderTypeBtn
                    theme={theme}
                    isActive={entryPoint.order.type === 'limit'}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'type',
                        'limit'
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'TVAlert',
                        'immediateEntry',
                        false
                      )
                    }}
                  >
                    Limit
                  </ChangeOrderTypeBtn>
                  <DarkTooltip
                    maxWidth={'30rem'}
                    title={
                      'Maker-only or post-only market order will place a post-only limit orders as close to the market price as possible until the last one is executed. This way you can enter the position at the market price by paying low maker fees.'
                    }
                  >
                    <ChangeOrderTypeBtn
                      theme={theme}
                      isActive={entryPoint.order.type === 'maker-only'}
                      onClick={() => {
                        this.updateSubBlockValue(
                          'entryPoint',
                          'order',
                          'type',
                          'maker-only'
                        )

                        this.updateSubBlockValue(
                          'entryPoint',
                          'averaging',
                          'enabled',
                          false
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

                        this.updateBlockValue(
                          'temp',
                          'initialMargin',
                          stripDigitPlaces(
                            (this.props.price * entryPoint.order.amount) /
                              entryPoint.order.leverage,
                            2
                          )
                        )

                        this.updateSubBlockValue(
                          'entryPoint',
                          'trailing',
                          'isTrailingOn',
                          false
                        )
                      }}
                    >
                      Maker-only
                    </ChangeOrderTypeBtn>
                  </DarkTooltip>
                </InputRowContainer>
                {entryPoint.averaging.enabled && (
                  <InputRowContainer padding={'0 0 1.2rem 0'}>
                    <DarkTooltip
                      maxWidth={'30rem'}
                      title={
                        'Your smart order will be closed once first TAP order was executed.'
                      }
                    >
                      <AdditionalSettingsButton
                        width={'50%'}
                        theme={theme}
                        margin={'0 2% 0 0'}
                        isActive={
                          entryPoint.averaging.closeStrategyAfterFirstTAP
                        }
                        onClick={() => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'averaging',
                            'closeStrategyAfterFirstTAP',
                            !entryPoint.averaging.closeStrategyAfterFirstTAP
                          )

                          if (entryPoint.averaging.closeStrategyAfterFirstTAP) {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'closeStrategyAfterFirstTAP',
                              false
                            )
                          }
                        }}
                      >
                        Close SM After First TAP
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                    {entryPoint.averaging.enabled && (
                      <DarkTooltip
                        title={
                          'Without loss order will be placed after entry order execution (mostly TAP order to have 0 profit + comissions).'
                        }
                        maxWidth={'30rem'}
                      >
                        <AdditionalSettingsButton
                          theme={theme}
                          width={'50%'}
                          padding={'0 0 0 0'}
                          isActive={entryPoint.averaging.placeWithoutLoss}
                          onClick={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'placeWithoutLoss',
                              !entryPoint.averaging.placeWithoutLoss
                            )
                          }}
                        >
                          Place Without Loss
                        </AdditionalSettingsButton>
                      </DarkTooltip>
                    )}
                  </InputRowContainer>
                )}
                {entryPoint.TVAlert.isTVAlertOn && (
                  <>
                    <InputRowContainer padding={'.8rem 0 2rem 0'}>
                      <InputRowContainer justify="flex-start">
                        <DarkTooltip
                          title={
                            'Trade will be placed once when there is an alert.'
                          }
                          maxWidth={'30rem'}
                        >
                          <div>
                            <SRadio
                              id="once"
                              checked={
                                entryPoint.TVAlert.templateMode === 'once'
                              }
                              style={{ padding: '0 1rem' }}
                              onChange={() => {
                                this.updateSubBlockValue(
                                  'entryPoint',
                                  'TVAlert',
                                  'templateMode',
                                  'once'
                                )
                              }}
                            />
                            <SettingsLabel
                              style={{
                                color: theme.palette.dark.main,
                                textDecoration: 'underline',
                              }}
                              htmlFor={'once'}
                            >
                              once
                            </SettingsLabel>
                          </div>
                        </DarkTooltip>
                      </InputRowContainer>

                      <InputRowContainer justify={'center'}>
                        <DarkTooltip
                          title={
                            'Trade will be placed every time when there is an alert but no open position.'
                          }
                          maxWidth={'30rem'}
                        >
                          <div>
                            <SRadio
                              id="ifNoActive"
                              checked={
                                entryPoint.TVAlert.templateMode === 'ifNoActive'
                              }
                              style={{ padding: '0 1rem' }}
                              onChange={() => {
                                this.updateSubBlockValue(
                                  'entryPoint',
                                  'TVAlert',
                                  'templateMode',
                                  'ifNoActive'
                                )
                              }}
                            />
                            <SettingsLabel
                              style={{
                                color: theme.palette.dark.main,
                                textDecoration: 'underline',
                              }}
                              htmlFor={'ifNoActive'}
                            >
                              If no trade exists
                            </SettingsLabel>
                          </div>
                        </DarkTooltip>
                      </InputRowContainer>

                      <InputRowContainer justify="flex-end">
                        <DarkTooltip
                          title={
                            'Trade will be placed every time there is an alert.'
                          }
                          maxWidth={'30rem'}
                        >
                          <div>
                            <SRadio
                              id="always"
                              checked={
                                entryPoint.TVAlert.templateMode === 'always'
                              }
                              style={{ padding: '0 1rem' }}
                              disabled={
                                stopLoss.external || takeProfit.external
                              }
                              onChange={() => {
                                this.updateSubBlockValue(
                                  'entryPoint',
                                  'TVAlert',
                                  'templateMode',
                                  'always'
                                )
                              }}
                            />
                            <SettingsLabel
                              style={{
                                color: theme.palette.dark.main,
                                textDecoration: 'underline',
                              }}
                              htmlFor={'always'}
                            >
                              Every time
                            </SettingsLabel>
                          </div>
                        </DarkTooltip>
                      </InputRowContainer>
                    </InputRowContainer>

                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={false}
                      tooltipText={''}
                      title={'action when alert'}
                    >
                      <InputRowContainer>
                        {/* <AdditionalSettingsButton theme={theme}
                          isActive={entryPoint.TVAlert.immediateEntry}
                          onClick={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'order',
                              'type',
                              'market'
                            )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'trailing',
                              'isTrailingOn',
                              false
                            )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'immediateEntry',
                              !entryPoint.TVAlert.immediateEntry
                            )
                          }}
                        >
                          Immediate entry
                        </AdditionalSettingsButton> */}
                        <AdditionalSettingsButton
                          theme={theme}
                          isActive={entryPoint.TVAlert.plotEnabled}
                          onClick={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'plotEnabled',
                              !entryPoint.TVAlert.plotEnabled
                            )

                            if (!entryPoint.TVAlert.plotEnabled) {
                              this.updateSubBlockValue(
                                'entryPoint',
                                'averaging',
                                'enabled',
                                false
                              )
                            }
                          }}
                        >
                          Plot
                        </AdditionalSettingsButton>
                      </InputRowContainer>
                    </FormInputContainer>
                  </>
                )}

                <FormInputContainer
                  theme={theme}
                  padding={'0 0 1.2rem 0'}
                  haveTooltip={entryPoint.trailing.isTrailingOn}
                  tooltipText={
                    'The price at which the trailing algorithm is enabled.'
                  }
                  title={`price (${pair[1]})`}
                >
                  <InputRowContainer>
                    <Input
                      theme={theme}
                      width={
                        isAveragingAfterFirstTarget
                          ? '32.5%'
                          : entryPoint.TVAlert.plotEnabled
                          ? '70%'
                          : '100%'
                      }
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
                          ? isAveragingAfterFirstTarget
                            ? entryPoint.averaging.price
                            : priceForCalculate
                          : entryPoint.trailing.isTrailingOn
                          ? priceForCalculate
                          : 'MARKET'
                      }
                      showErrors={showErrors}
                      isValid={
                        entryPoint.TVAlert.pricePlotEnabled ||
                        priceForCalculate != 0
                      }
                      disabled={
                        (isMarketType && !entryPoint.trailing.isTrailingOn) ||
                        (entryPoint.TVAlert.pricePlotEnabled &&
                          entryPoint.TVAlert.plotEnabled)
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
                    {isAveragingAfterFirstTarget && (
                      <>
                        <Input
                          theme={theme}
                          padding={'0 .8rem 0 .8rem'}
                          width={'calc(17.5%)'}
                          symbol={'%'}
                          textAlign={'right'}
                          pattern={'[0-9]+.[0-9]{3}'}
                          type={'text'}
                          value={entryPoint.averaging.percentage}
                          inputStyles={{
                            paddingLeft: 0,
                            paddingRight: '2rem',
                          }}
                          symbolRightIndent={'1.5rem'}
                          onChange={(e) => {
                            // const value =
                            //   e.target.value > 100 / entryPoint.order.leverage
                            //     ? stripDigitPlaces(
                            //       100 / entryPoint.order.leverage,
                            //       3
                            //     )
                            //     : e.target.value
                            const price =
                              entryPoint.order.side === 'buy'
                                ? stripDigitPlaces(
                                    entryPoint.order.price *
                                      (1 -
                                        e.target.value /
                                          100 /
                                          entryPoint.order.leverage),
                                    pricePrecision
                                  )
                                : stripDigitPlaces(
                                    entryPoint.order.price *
                                      (1 +
                                        e.target.value /
                                          100 /
                                          entryPoint.order.leverage),
                                    pricePrecision
                                  )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'percentage',
                              e.target.value
                            )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'price',
                              price
                            )
                          }}
                        />

                        <BlueSlider
                          theme={theme}
                          value={entryPoint.averaging.percentage}
                          sliderContainerStyles={{
                            width: entryPoint.TVAlert.plotEnabled
                              ? '20%'
                              : '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            if (
                              entryPoint.averaging.percentage > 100 &&
                              value === 100
                            ) {
                              return
                            }

                            const price =
                              entryPoint.order.side === 'buy'
                                ? stripDigitPlaces(
                                    entryPoint.order.price *
                                      (1 -
                                        value /
                                          100 /
                                          entryPoint.order.leverage),
                                    pricePrecision
                                  )
                                : stripDigitPlaces(
                                    entryPoint.order.price *
                                      (1 +
                                        value /
                                          100 /
                                          entryPoint.order.leverage),
                                    pricePrecision
                                  )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'percentage',
                              value
                            )

                            this.updateSubBlockValue(
                              'entryPoint',
                              'averaging',
                              'price',
                              price
                            )
                          }}
                        />
                      </>
                    )}
                    {entryPoint.TVAlert.plotEnabled && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '10%',
                          }}
                        >
                          <Switcher
                            checked={entryPoint.TVAlert.pricePlotEnabled}
                            onChange={() => {
                              this.updateSubBlockValue(
                                'entryPoint',
                                'TVAlert',
                                'pricePlotEnabled',
                                !entryPoint.TVAlert.pricePlotEnabled
                              )
                            }}
                          />
                        </div>
                        <Input
                          theme={theme}
                          type={'number'}
                          needTitle
                          title={`plot_`}
                          textAlign="left"
                          width={'calc(20% - .8rem)'}
                          inputStyles={{
                            paddingLeft: '4rem',
                          }}
                          disabled={!entryPoint.TVAlert.pricePlotEnabled}
                          value={entryPoint.TVAlert.pricePlot}
                          showErrors={showErrors}
                          isValid={this.validateField(
                            true,
                            entryPoint.TVAlert.pricePlot
                          )}
                          onChange={(e) => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'pricePlot',
                              e.target.value
                            )
                          }}
                        />
                      </>
                    )}
                  </InputRowContainer>
                </FormInputContainer>

                {entryPoint.trailing.isTrailingOn && marketType !== 0 && (
                  <FormInputContainer
                    theme={theme}
                    haveTooltip
                    tooltipText={
                      'The level of price change after the trend reversal, at which the order will be executed.'
                    }
                    title={'price deviation (%)'}
                  >
                    <InputRowContainer>
                      <Input
                        theme={theme}
                        padding={'0'}
                        width={'calc(32.5%)'}
                        textAlign={'left'}
                        symbol={pair[1]}
                        value={entryPoint.trailing.trailingDeviationPrice}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          true,
                          entryPoint.trailing.trailingDeviationPrice
                        )}
                        disabled={
                          (isMarketType && !entryPoint.trailing.isTrailingOn) ||
                          (entryPoint.TVAlert.deviationPlotEnabled &&
                            entryPoint.TVAlert.plotEnabled)
                        }
                        inputStyles={{
                          paddingLeft: '1rem',
                        }}
                        onChange={(e) => {
                          const percentage =
                            entryPoint.order.side === 'sell'
                              ? (1 - e.target.value / priceForCalculate) * 100
                              : -(1 - e.target.value / priceForCalculate) * 100

                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'deviationPercentage',
                            stripDigitPlaces(percentage < 0 ? 0 : percentage, 2)
                          )

                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'trailingDeviationPrice',
                            e.target.value
                          )
                        }}
                      />

                      <Input
                        theme={theme}
                        padding={'0 .8rem 0 .8rem'}
                        width={'calc(17.5%)'}
                        symbol={'%'}
                        textAlign={'right'}
                        pattern={'[0-9]+.[0-9]{3}'}
                        type={'text'}
                        value={entryPoint.trailing.deviationPercentage}
                        // showErrors={showErrors}
                        // isValid={this.validateField(
                        //   entryPoint.trailing.isTrailingOn,
                        //   entryPoint.trailing.deviationPercentage
                        // )}
                        inputStyles={{
                          paddingLeft: 0,
                          paddingRight: '2rem',
                        }}
                        symbolRightIndent={'1.5rem'}
                        onChange={(e) => {
                          const value =
                            e.target.value > 100 / entryPoint.order.leverage
                              ? stripDigitPlaces(
                                  100 / entryPoint.order.leverage,
                                  3
                                )
                              : e.target.value
                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'deviationPercentage',
                            value
                          )

                          this.updateStopLossAndTakeProfitPrices({
                            deviationPercentage: value,
                          })
                        }}
                      />

                      <BlueSlider
                        theme={theme}
                        disabled={!entryPoint.trailing.isTrailingOn}
                        value={
                          +stripDigitPlaces(
                            entryPoint.trailing.deviationPercentage *
                              entryPoint.order.leverage,
                            3
                          )
                        }
                        sliderContainerStyles={{
                          width: entryPoint.TVAlert.plotEnabled ? '20%' : '50%',
                          margin: '0 .8rem 0 .8rem',
                        }}
                        onChange={(value) => {
                          if (
                            stripDigitPlaces(
                              entryPoint.trailing.deviationPercentage *
                                entryPoint.order.leverage,
                              3
                            ) > 100 &&
                            value === 100
                          ) {
                            return
                          }

                          this.updateSubBlockValue(
                            'entryPoint',
                            'trailing',
                            'deviationPercentage',
                            stripDigitPlaces(
                              value / entryPoint.order.leverage,
                              3
                            )
                          )
                          this.updateStopLossAndTakeProfitPrices({
                            deviationPercentage: stripDigitPlaces(
                              value / entryPoint.order.leverage,
                              3
                            ),
                          })
                        }}
                      />
                      {entryPoint.TVAlert.plotEnabled && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              width: '10%',
                            }}
                          >
                            <Switcher
                              checked={entryPoint.TVAlert.deviationPlotEnabled}
                              onChange={() => {
                                this.updateSubBlockValue(
                                  'entryPoint',
                                  'TVAlert',
                                  'deviationPlotEnabled',
                                  !entryPoint.TVAlert.deviationPlotEnabled
                                )
                              }}
                            />
                          </div>
                          <Input
                            theme={theme}
                            type={'number'}
                            needTitle
                            title={`plot_`}
                            textAlign="left"
                            width={'calc(20% - .8rem)'}
                            inputStyles={{
                              paddingLeft: '4rem',
                            }}
                            disabled={!entryPoint.TVAlert.deviationPlotEnabled}
                            value={entryPoint.TVAlert.deviationPlot}
                            showErrors={showErrors}
                            isValid={this.validateField(
                              true,
                              entryPoint.TVAlert.deviationPlot
                            )}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'entryPoint',
                                'TVAlert',
                                'deviationPlot',
                                e.target.value
                              )
                            }}
                          />
                        </>
                      )}
                    </InputRowContainer>
                  </FormInputContainer>
                )}

                <InputRowContainer>
                  <div
                    style={{
                      width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
                    }}
                  >
                    <FormInputContainer
                      theme={theme}
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? stripDigitPlaces(
                              maxAmount / priceForCalculate,
                              marketType === 1 ? quantityPrecision : 8
                            )
                          : stripDigitPlaces(
                              maxAmount,
                              marketType === 1 ? quantityPrecision : 8
                            )
                      } ${pair[0]}`}
                      onValueClick={this.setMaxAmount}
                      title={`${
                        marketType === 1 ? 'order quantity' : 'amount'
                      } (${pair[0]})`}
                    >
                      <Input
                        theme={theme}
                        type={'text'}
                        pattern={
                          marketType === 0
                            ? '[0-9]+.[0-9]{8}'
                            : '[0-9]+.[0-9]{3}'
                        }
                        symbol={pair[0]}
                        value={entryPoint.order.amount}
                        showErrors={showErrors}
                        disabled={
                          entryPoint.TVAlert.amountPlotEnabled &&
                          entryPoint.TVAlert.plotEnabled
                        }
                        isValid={this.validateField(
                          true,
                          +entryPoint.order.amount
                        )}
                        onChange={(e) => {
                          const [maxAmount] = this.getMaxValues()
                          const isAmountMoreThanMax = e.target.value > maxAmount
                          const amountForUpdate = isAmountMoreThanMax
                            ? maxAmount
                            : e.target.value

                          const strippedAmount = isAmountMoreThanMax
                            ? stripDigitPlaces(
                                amountForUpdate,
                                marketType === 1 ? quantityPrecision : 8
                              )
                            : e.target.value

                          const newTotal = strippedAmount * priceForCalculate

                          this.updateSubBlockValue(
                            'entryPoint',
                            'order',
                            'amount',
                            strippedAmount
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
                        color: theme.palette.grey.text,
                        transform: 'rotate(-90deg) translateX(-30%)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: entryPoint.TVAlert.plotEnabled ? '32%' : '47%',
                    }}
                  >
                    <FormInputContainer
                      theme={theme}
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${
                        entryPoint.order.side === 'buy' || marketType === 1
                          ? stripDigitPlaces(
                              maxAmount,
                              marketType === 1 ? 0 : 2
                            )
                          : stripDigitPlaces(
                              maxAmount * priceForCalculate,
                              marketType === 1 ? 0 : 2
                            )
                      } ${pair[1]}`}
                      onValueClick={this.setMaxAmount}
                      title={`total (${pair[1]})`}
                    >
                      <Input
                        theme={theme}
                        symbol={pair[1]}
                        value={entryPoint.order.total}
                        disabled={
                          entryPoint.trailing.isTrailingOn ||
                          isMarketType ||
                          (entryPoint.TVAlert.amountPlotEnabled &&
                            entryPoint.TVAlert.plotEnabled)
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
                              e.target.value / priceForCalculate,
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
                  {entryPoint.TVAlert.plotEnabled && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '10%',
                        }}
                      >
                        <Switcher
                          checked={entryPoint.TVAlert.amountPlotEnabled}
                          onChange={() => {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'amountPlotEnabled',
                              !entryPoint.TVAlert.amountPlotEnabled
                            )
                          }}
                        />
                      </div>
                      <Input
                        theme={theme}
                        type={'number'}
                        needTitle
                        title={`plot_`}
                        textAlign="left"
                        width={'calc(20% - .8rem)'}
                        inputStyles={{
                          paddingLeft: '4rem',
                        }}
                        disabled={!entryPoint.TVAlert.amountPlotEnabled}
                        value={entryPoint.TVAlert.amountPlot}
                        showErrors={showErrors}
                        isValid={this.validateField(
                          true,
                          entryPoint.TVAlert.amountPlot
                        )}
                        onChange={(e) => {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'amountPlot',
                            e.target.value
                          )
                        }}
                      />
                    </>
                  )}
                </InputRowContainer>

                <InputRowContainer>
                  <BlueSlider
                    theme={theme}
                    showMarks
                    value={
                      entryPoint.order.side === 'buy' || marketType === 1
                        ? (entryPoint.order.total / maxAmount) * 100
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
                          ? newValue / priceForCalculate
                          : newValue

                      const newTotal = newAmount * priceForCalculate

                      const newMargin = stripDigitPlaces(
                        (newTotal || 0) / entryPoint.order.leverage,
                        2
                      )

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        stripDigitPlaces(
                          newAmount,
                          marketType === 1 ? quantityPrecision : 8
                        )
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
                      theme={theme}
                      needLine={false}
                      needRightValue={true}
                      rightValue={`${stripDigitPlaces(funds[1].quantity, 2)} ${
                        pair[1]
                      }`}
                      onValueClick={this.setMaxAmount}
                      title={`cost / initial margin (${pair[1]})`}
                    >
                      <Input
                        theme={theme}
                        symbol={pair[1]}
                        value={this.state.temp.initialMargin}
                        disabled={
                          entryPoint.trailing.isTrailingOn || isMarketType
                        }
                        onChange={(e) => {
                          const inputInitialMargin = e.target.value
                          const newTotal =
                            inputInitialMargin * entryPoint.order.leverage
                          const newAmount = newTotal / priceForCalculate

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

                {entryPoint.averaging.enabled && (
                  <>
                    <InputRowContainer padding="0 0 .6rem 0">
                      <BtnCustom
                        btnColor={theme.palette.white.main}
                        backgroundColor={theme.palette.orange.main}
                        borderColor={theme.palette.orange.main}
                        btnWidth={'100%'}
                        height={'auto'}
                        borderRadius={'0.1rem'}
                        margin={'0'}
                        padding={'.1rem 0'}
                        fontSize={'1rem'}
                        boxShadow={'0px .2rem .3rem rgba(8, 22, 58, 0.15)'}
                        letterSpacing={'.05rem'}
                        onClick={this.addAverageTarget}
                      >
                        add point
                      </BtnCustom>
                    </InputRowContainer>

                    <InputRowContainer
                      padding=".6rem 1rem 1.2rem .4rem"
                      direction="column"
                    >
                      <InputRowContainer padding=".2rem .5rem">
                        <TargetTitle
                          theme={theme}
                          style={{ width: '25%', paddingLeft: '2rem' }}
                        >
                          price
                        </TargetTitle>
                        <TargetTitle theme={theme} style={{ width: '25%' }}>
                          quantity
                        </TargetTitle>
                        <TargetTitle theme={theme} style={{ width: '40%' }}>
                          place Without Loss
                        </TargetTitle>
                      </InputRowContainer>
                      <div
                        style={{
                          width: '100%',
                          background: theme.palette.grey.main,
                          borderRadius: '.8rem',
                          border: theme.palette.border.main,
                        }}
                      >
                        {entryPoint.averaging.entryLevels.map((target, i) => (
                          <InputRowContainer
                            key={`${target.price}${target.amount}${i}`}
                            padding=".2rem .5rem"
                            style={
                              entryPoint.averaging.entryLevels.length - 1 !== i
                                ? {
                                    borderBottom: theme.palette.border.main,
                                  }
                                : {}
                            }
                          >
                            <TargetValue
                              theme={theme}
                              style={{ width: '25%', paddingLeft: '2rem' }}
                            >
                              {target.price} {i > 0 ? '%' : pair[1]}
                            </TargetValue>
                            <TargetValue theme={theme} style={{ width: '25%' }}>
                              {target.amount} {pair[0]}
                            </TargetValue>
                            <TargetValue theme={theme} style={{ width: '40%' }}>
                              {target.placeWithoutLoss ? '+' : '-'}
                            </TargetValue>
                            <CloseIcon
                              onClick={() => this.deleteAverageTarget(i)}
                              style={{
                                color: theme.palette.red.main,
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

                {entryPoint.order.isHedgeOn && (
                  <InputRowContainer>
                    <FormInputContainer theme={theme} title={'hedge'}>
                      <CustomSwitcher
                        theme={theme}
                        firstHalfText={'long'}
                        secondHalfText={'short'}
                        buttonHeight={'3rem'}
                        containerStyles={{
                          width: '30%',
                          padding: '0 .4rem 0 0',
                          whiteSpace: 'nowrap',
                        }}
                        firstHalfStyleProperties={GreenSwitcherStyles(theme)}
                        secondHalfStyleProperties={RedSwitcherStyles(theme)}
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
                        theme={theme}
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
                        theme={theme}
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

                {entryPoint.TVAlert.isTVAlertOn && (
                  <>
                    {' '}
                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={true}
                      tooltipText={
                        <img
                          style={{ width: '35rem', height: '50rem' }}
                          src={WebHookImg}
                        />
                      }
                      title={
                        <span>
                          paste it into{' '}
                          <span
                            style={{ color: theme.palette.blue.background }}
                          >
                            web-hook url
                          </span>{' '}
                          field when creating tv alert
                        </span>
                      }
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          width={'85%'}
                          type={'text'}
                          disabled={true}
                          textAlign={'left'}
                          value={`https://${API_URL}/createSmUsingTemplate`}
                        />
                        <BtnCustom
                          btnWidth="calc(15% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            copy(`https://${API_URL}/createSmUsingTemplate`)
                          }}
                        >
                          copy
                        </BtnCustom>
                      </InputRowContainer>
                    </FormInputContainer>
                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={true}
                      tooltipText={
                        <img
                          style={{ width: '40rem', height: '42rem' }}
                          src={MessageImg}
                        />
                      }
                      title={
                        <span>
                          paste it into{' '}
                          <span
                            style={{ color: theme.palette.blue.background }}
                          >
                            message
                          </span>{' '}
                          field when creating tv alert
                        </span>
                      }
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          width={'65%'}
                          type={'text'}
                          disabled={true}
                          textAlign={'left'}
                          value={this.getEntryAlertJson()}
                        />
                        {/* entryPoint.TVAlert.templateToken */}
                        <BtnCustom
                          btnWidth="calc(15% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            copy(this.getEntryAlertJson())
                          }}
                        >
                          copy
                        </BtnCustom>
                        <BtnCustom
                          btnWidth="calc(20% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            // redirect to full example page
                          }}
                        >
                          example
                        </BtnCustom>
                      </InputRowContainer>
                    </FormInputContainer>
                  </>
                )}
              </div>
            </TerminalBlock>

            {/* STOP LOSS */}
            <TerminalBlock
              theme={theme}
              width={'calc(32.5% + 1%)'}
              style={{ overflow: 'hidden', padding: 0 }}
            >
              <div
                style={{
                  overflow: 'hidden scroll',
                  height: 'calc(100% - 6rem)',
                  padding: '0rem 1rem 0rem 1.2rem',
                }}
              >
                <InputRowContainer justify="center">
                  <CustomSwitcher
                    theme={theme}
                    firstHalfText={'limit'}
                    secondHalfText={'market'}
                    buttonHeight={'3rem'}
                    containerStyles={{ width: '100%' }}
                    firstHalfStyleProperties={BlueSwitcherStyles(theme)}
                    secondHalfStyleProperties={BlueSwitcherStyles(theme)}
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
                    <DarkTooltip
                      maxWidth={'30rem'}
                      title={
                        <>
                          <p>
                            Waiting after unrealized P&L will reach set target.
                          </p>
                          <p>
                            <b>For example:</b> you set 10% stop loss and 1
                            minute timeout. When your unrealized loss is 10%
                            timeout will give a minute for a chance to reverse
                            trend and loss to go below 10% before stop loss
                            order executes.
                          </p>
                        </>
                      }
                    >
                      <AdditionalSettingsButton
                        theme={theme}
                        isActive={stopLoss.timeout.isTimeoutOn}
                        onClick={() => {
                          if (!stopLoss.external) {
                            this.updateBlockValue('stopLoss', 'external', false)
                            this.updateSubBlockValue(
                              'stopLoss',
                              'forcedStop',
                              'mandatoryForcedLoss',
                              false
                            )
                          }
                          this.updateSubBlockValue(
                            'stopLoss',
                            'timeout',
                            'isTimeoutOn',
                            !stopLoss.timeout.isTimeoutOn
                          )

                          this.updateSubBlockValue(
                            'stopLoss',
                            'timeout',
                            'whenLossableOn',
                            !stopLoss.timeout.whenLossableOn
                          )

                          this.updateSubBlockValue(
                            'stopLoss',
                            'forcedStop',
                            'isForcedStopOn',
                            !stopLoss.forcedStop.isForcedStopOn
                          )
                        }}
                      >
                        Timeout
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                    <DarkTooltip
                      maxWidth={'30rem'}
                      title={
                        'Your stop loss order will be placed once when there is a Trading View alert with params that you sent.'
                      }
                    >
                      <AdditionalSettingsButton
                        theme={theme}
                        isActive={stopLoss.external}
                        onClick={() => {
                          this.updateBlockValue(
                            'stopLoss',
                            'external',
                            !stopLoss.external
                          )

                          if (!stopLoss.external) {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'timeout',
                              'isTimeoutOn',
                              false
                            )
                          } else {
                            this.updateSubBlockValue(
                              'stopLoss',
                              'forcedStop',
                              'mandatoryForcedLoss',
                              false
                            )
                          }

                          if (
                            !stopLoss.external &&
                            entryPoint.TVAlert.templateMode === 'always'
                          ) {
                            this.updateSubBlockValue(
                              'entryPoint',
                              'TVAlert',
                              'templateMode',
                              'ifNoActive'
                            )
                          }
                        }}
                      >
                        SL by TV Alert
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                    {/* <AdditionalSettingsButton theme={theme}
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
                  </AdditionalSettingsButton> */}
                  </InputRowContainer>

                  {((stopLoss.external &&
                    !stopLoss.forcedStopByAlert &&
                    !stopLoss.plotEnabled) ||
                    !stopLoss.external) && (
                    <FormInputContainer
                      theme={theme}
                      haveTooltip
                      tooltipText={
                        <>
                          <p>The unrealized loss/ROE for closing trade.</p>
                          <p>
                            <b>For example:</b> you bought 1 BTC and set 10%
                            stop loss. Your unrealized loss should be 0.1 BTC
                            and order will be executed.
                          </p>
                        </>
                      }
                      title={'stop price'}
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          padding={'0'}
                          width={'calc(32.5%)'}
                          textAlign={'left'}
                          symbol={pair[1]}
                          value={stopLoss.stopLossPrice}
                          disabled={
                            isMarketType && !entryPoint.trailing.isTrailingOn
                          }
                          showErrors={showErrors && stopLoss.isStopLossOn}
                          isValid={this.validateField(
                            true,
                            stopLoss.pricePercentage
                          )}
                          inputStyles={{
                            paddingLeft: '1rem',
                          }}
                          onChange={(e) => {
                            const percentage =
                              entryPoint.order.side === 'buy'
                                ? (1 - e.target.value / priceForCalculate) *
                                  100 *
                                  entryPoint.order.leverage
                                : -(1 - e.target.value / priceForCalculate) *
                                  100 *
                                  entryPoint.order.leverage

                            this.updateBlockValue(
                              'stopLoss',
                              'pricePercentage',
                              stripDigitPlaces(
                                percentage < 0 ? 0 : percentage,
                                2
                              )
                            )

                            this.updateBlockValue(
                              'stopLoss',
                              'stopLossPrice',
                              e.target.value
                            )
                          }}
                        />

                        <Input
                          theme={theme}
                          padding={'0 .8rem 0 .8rem'}
                          width={'calc(17.5%)'}
                          symbol={'%'}
                          preSymbol={'-'}
                          textAlign={'left'}
                          needPreSymbol={true}
                          value={
                            stopLoss.pricePercentage > 100
                              ? 100
                              : stopLoss.pricePercentage
                          }
                          showErrors={showErrors && stopLoss.isStopLossOn}
                          isValid={this.validateField(
                            true,
                            stopLoss.pricePercentage
                          )}
                          inputStyles={{
                            paddingRight: '0',
                            paddingLeft: '2rem',
                          }}
                          onChange={(e) => {
                            this.updateStopLossAndTakeProfitPrices({
                              stopLossPercentage: e.target.value,
                            })

                            this.updateBlockValue(
                              'stopLoss',
                              'pricePercentage',
                              e.target.value
                            )
                          }}
                        />

                        <BlueSlider
                          theme={theme}
                          value={stopLoss.pricePercentage}
                          sliderContainerStyles={{
                            width: '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            if (
                              stopLoss.pricePercentage > 100 &&
                              value === 100
                            ) {
                              return
                            }

                            this.updateStopLossAndTakeProfitPrices({
                              stopLossPercentage: value,
                            })

                            this.updateBlockValue(
                              'stopLoss',
                              'pricePercentage',
                              value
                            )
                          }}
                        />
                      </InputRowContainer>
                    </FormInputContainer>
                  )}

                  {(stopLoss.timeout.isTimeoutOn ||
                    (stopLoss.forcedStop.isForcedStopOn &&
                      stopLoss.forcedStop.mandatoryForcedLoss)) &&
                    (!stopLoss.external ||
                      (stopLoss.external &&
                        stopLoss.forcedStop.mandatoryForcedLoss)) && (
                      <>
                        <InputRowContainer>
                          {stopLoss.timeout.isTimeoutOn && (
                            <SubBlocksContainer>
                              <FormInputContainer
                                theme={theme}
                                haveTooltip
                                tooltipText={
                                  <>
                                    <p>
                                      Waiting after unrealized P&L will reach
                                      set target.
                                    </p>
                                    <p>
                                      <b>For example:</b> you set 10% stop loss
                                      and 1 minute timeout. When your unrealized
                                      loss is 10% timeout will give a minute for
                                      a chance to reverse trend and loss to go
                                      below 10% before stop loss order executes.
                                    </p>
                                  </>
                                }
                                title={'timeout'}
                                lineMargin={'0 1.2rem 0 1rem'}
                              >
                                <InputRowContainer>
                                  <Input
                                    theme={theme}
                                    haveSelector
                                    // width={'calc(55% - .4rem)'}
                                    width={'calc(75% - .4rem)'}
                                    showErrors={
                                      showErrors && stopLoss.isStopLossOn
                                    }
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
                                    // disabled={!stopLoss.timeout.whenLossableOn}
                                  />
                                  <Select
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
                                  </Select>
                                </InputRowContainer>
                              </FormInputContainer>
                            </SubBlocksContainer>
                          )}
                          <SubBlocksContainer
                            width={
                              stopLoss.forcedStop.mandatoryForcedLoss
                                ? '100%'
                                : '50%'
                            }
                          >
                            <FormInputContainer
                              theme={theme}
                              haveTooltip
                              tooltipText={
                                <>
                                  <p>
                                    How much should the price change to ignore
                                    timeout.
                                  </p>

                                  <p>
                                    <b>For example:</b> You bought BTC and set
                                    10% stop loss with 1 minute timeout and 15%
                                    forced stop. But the price continued to fall
                                    during the timeout. Your trade will be
                                    closed when loss will be 15% regardless of
                                    timeout.
                                  </p>
                                </>
                              }
                              title={'forced stop price'}
                            >
                              <InputRowContainer>
                                <Input
                                  theme={theme}
                                  padding={'0'}
                                  width={
                                    stopLoss.forcedStop.mandatoryForcedLoss
                                      ? '32.5%'
                                      : '65%'
                                  }
                                  textAlign={'left'}
                                  symbol={pair[1]}
                                  value={stopLoss.forcedStop.forcedStopPrice}
                                  disabled={
                                    isMarketType &&
                                    !entryPoint.trailing.isTrailingOn
                                  }
                                  showErrors={
                                    showErrors && stopLoss.isStopLossOn
                                  }
                                  isValid={this.validateField(
                                    true,
                                    stopLoss.forcedStop.forcedStopPrice
                                  )}
                                  inputStyles={{
                                    paddingLeft: '1rem',
                                  }}
                                  onChange={(e) => {
                                    const percentage =
                                      entryPoint.order.side === 'buy'
                                        ? (1 -
                                            e.target.value /
                                              priceForCalculate) *
                                          100 *
                                          entryPoint.order.leverage
                                        : -(
                                            1 -
                                            e.target.value / priceForCalculate
                                          ) *
                                          100 *
                                          entryPoint.order.leverage

                                    this.updateSubBlockValue(
                                      'stopLoss',
                                      'forcedStop',
                                      'pricePercentage',
                                      stripDigitPlaces(
                                        percentage < 0 ? 0 : percentage,
                                        2
                                      )
                                    )

                                    this.updateSubBlockValue(
                                      'stopLoss',
                                      'forcedStop',
                                      'forcedStopPrice',
                                      e.target.value
                                    )
                                  }}
                                />
                                <Input
                                  theme={theme}
                                  showErrors={
                                    showErrors && stopLoss.isStopLossOn
                                  }
                                  isValid={this.validateField(
                                    stopLoss.forcedStop.isForcedStopOn,
                                    stopLoss.forcedStop.pricePercentage
                                  )}
                                  padding={'0 .8rem 0 .8rem'}
                                  width={
                                    stopLoss.forcedStop.mandatoryForcedLoss
                                      ? '17.5%'
                                      : 'calc(35%)'
                                  }
                                  symbol={'%'}
                                  preSymbol={'-'}
                                  textAlign={'left'}
                                  needPreSymbol={true}
                                  inputStyles={{
                                    paddingRight: 0,
                                    paddingLeft: '2rem',
                                  }}
                                  value={
                                    stopLoss.forcedStop.pricePercentage > 100
                                      ? 100
                                      : stopLoss.forcedStop.pricePercentage
                                  }
                                  onChange={(e) => {
                                    this.updateSubBlockValue(
                                      'stopLoss',
                                      'forcedStop',
                                      'pricePercentage',
                                      e.target.value
                                    )

                                    this.updateStopLossAndTakeProfitPrices({
                                      forcedStopPercentage: e.target.value,
                                    })
                                  }}
                                />
                                {stopLoss.external &&
                                  stopLoss.forcedStop.mandatoryForcedLoss && (
                                    <BlueSlider
                                      theme={theme}
                                      value={
                                        stopLoss.forcedStop.pricePercentage
                                      }
                                      sliderContainerStyles={{
                                        width: 'calc(50%)',
                                        margin: '0 .8rem 0 .8rem',
                                      }}
                                      onChange={(value) => {
                                        if (
                                          stopLoss.forcedStop.pricePercentage >
                                            100 &&
                                          value === 100
                                        ) {
                                          return
                                        }

                                        this.updateSubBlockValue(
                                          'stopLoss',
                                          'forcedStop',
                                          'pricePercentage',
                                          value
                                        )

                                        this.updateStopLossAndTakeProfitPrices({
                                          forcedStopPercentage: value,
                                        })
                                      }}
                                    />
                                  )}
                              </InputRowContainer>
                            </FormInputContainer>
                          </SubBlocksContainer>
                        </InputRowContainer>
                      </>
                    )}

                  {stopLoss.timeout.isTimeoutOn && !stopLoss.external && (
                    <>
                      <InputRowContainer>
                        <SubBlocksContainer>
                          <BlueSlider
                            theme={theme}
                            max={60}
                            value={
                              stopLoss.timeout.whenLossableSec > 60
                                ? 60
                                : stopLoss.timeout.whenLossableSec
                            }
                            sliderContainerStyles={{
                              width: 'calc(100% - 1.2rem)',
                              margin: '0 1.2rem 0 0rem',
                            }}
                            onChange={(value) => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'timeout',
                                'whenLossableSec',
                                value
                              )
                            }}
                          />
                        </SubBlocksContainer>

                        <SubBlocksContainer>
                          <BlueSlider
                            theme={theme}
                            value={stopLoss.forcedStop.pricePercentage}
                            sliderContainerStyles={{
                              width: 'calc(100%)',
                              margin: '0 0rem 0 0',
                            }}
                            onChange={(value) => {
                              if (
                                stopLoss.forcedStop.pricePercentage > 100 &&
                                value === 100
                              ) {
                                return
                              }

                              this.updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'pricePercentage',
                                value
                              )

                              this.updateStopLossAndTakeProfitPrices({
                                forcedStopPercentage: value,
                              })
                            }}
                          />
                        </SubBlocksContainer>
                      </InputRowContainer>
                    </>
                  )}

                  {stopLoss.external && (
                    <>
                      <FormInputContainer
                        theme={theme}
                        padding={'0 0 .8rem 0'}
                        haveTooltip={false}
                        tooltipText={''}
                        title={'action when alert'}
                      >
                        <InputRowContainer>
                          <AdditionalSettingsButton
                            theme={theme}
                            fontSize={'1rem'}
                            isActive={stopLoss.forcedStopByAlert}
                            onClick={() => {
                              this.updateBlockValue(
                                'stopLoss',
                                'forcedStopByAlert',
                                !stopLoss.forcedStopByAlert
                              )
                              this.updateBlockValue(
                                'stopLoss',
                                'plotEnabled',
                                false
                              )

                              this.updateBlockValue(
                                'stopLoss',
                                'type',
                                'market'
                              )
                            }}
                          >
                            Forced Stop by Alert
                          </AdditionalSettingsButton>
                          <AdditionalSettingsButton
                            theme={theme}
                            fontSize={'1rem'}
                            isActive={stopLoss.forcedStop.mandatoryForcedLoss}
                            onClick={() => {
                              this.updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'isForcedStopOn',
                                !stopLoss.forcedStop.mandatoryForcedLoss
                              )

                              this.updateSubBlockValue(
                                'stopLoss',
                                'forcedStop',
                                'mandatoryForcedLoss',
                                !stopLoss.forcedStop.mandatoryForcedLoss
                              )
                            }}
                          >
                            Settings Forced stop
                          </AdditionalSettingsButton>
                          <AdditionalSettingsButton
                            theme={theme}
                            isActive={stopLoss.plotEnabled}
                            onClick={() => {
                              this.updateBlockValue(
                                'stopLoss',
                                'forcedStopByAlert',
                                false
                              )

                              this.updateBlockValue(
                                'stopLoss',
                                'plotEnabled',
                                !stopLoss.plotEnabled
                              )
                            }}
                          >
                            Plot
                          </AdditionalSettingsButton>
                        </InputRowContainer>
                      </FormInputContainer>

                      {stopLoss.plotEnabled && (
                        <InputRowContainer padding={'0 0 .8rem 0'}>
                          <Input
                            theme={theme}
                            type={'number'}
                            needTitle
                            title={`plot_`}
                            textAlign="left"
                            inputStyles={{
                              paddingLeft: '4rem',
                            }}
                            value={stopLoss.plot}
                            showErrors={showErrors}
                            isValid={this.validateField(true, stopLoss.plot)}
                            onChange={(e) => {
                              this.updateBlockValue(
                                'stopLoss',
                                'plot',
                                e.target.value
                              )
                            }}
                          />
                        </InputRowContainer>
                      )}

                      <FormInputContainer
                        theme={theme}
                        padding={'0 0 .8rem 0'}
                        haveTooltip={true}
                        tooltipText={
                          <img
                            style={{ width: '35rem', height: '50rem' }}
                            src={WebHookImg}
                          />
                        }
                        title={
                          <span>
                            paste it into{' '}
                            <span
                              style={{ color: theme.palette.blue.background }}
                            >
                              web-hook url
                            </span>{' '}
                            field when creating tv alert
                          </span>
                        }
                      >
                        <InputRowContainer>
                          <Input
                            theme={theme}
                            width={'85%'}
                            type={'text'}
                            disabled={true}
                            textAlign={'left'}
                            value={`https://${API_URL}/editStopLossByAlert`}
                          />
                          <BtnCustom
                            btnWidth="calc(15% - .8rem)"
                            height="auto"
                            margin="0 0 0 .8rem"
                            fontSize="1rem"
                            padding=".5rem 0 .4rem 0"
                            borderRadius=".8rem"
                            btnColor={theme.palette.blue.main}
                            backgroundColor={theme.palette.white.background}
                            hoverColor={theme.palette.white.main}
                            hoverBackground={theme.palette.blue.main}
                            transition={'all .4s ease-out'}
                            onClick={() => {
                              copy(`https://${API_URL}/editStopLossByAlert`)
                            }}
                          >
                            copy
                          </BtnCustom>
                        </InputRowContainer>
                      </FormInputContainer>
                      <FormInputContainer
                        theme={theme}
                        padding={'0 0 .8rem 0'}
                        haveTooltip={true}
                        tooltipText={
                          <img
                            style={{ width: '40rem', height: '42rem' }}
                            src={MessageImg}
                          />
                        }
                        title={
                          <span>
                            paste it into{' '}
                            <span
                              style={{ color: theme.palette.blue.background }}
                            >
                              message
                            </span>{' '}
                            field when creating tv alert
                          </span>
                        }
                      >
                        <InputRowContainer>
                          <Input
                            theme={theme}
                            width={'65%'}
                            type={'text'}
                            disabled={true}
                            textAlign={'left'}
                            value={`{\\"token\\": \\"${
                              entryPoint.TVAlert.templateToken
                            }\\", \\"orderType\\": ${
                              stopLoss.forcedStopByAlert
                                ? `\\"market\\"`
                                : `\\"${stopLoss.type}\\"`
                            } ${
                              stopLoss.plotEnabled
                                ? `, \\"stopLossPrice\\": {{plot_${
                                    stopLoss.plot
                                  }}}`
                                : !stopLoss.forcedStopByAlert
                                ? `, \\"stopLossPrice\\": ${
                                    stopLoss.stopLossPrice
                                  }`
                                : ''
                            }}`}
                          />
                          {/* entryPoint.TVAlert.templateToken */}
                          <BtnCustom
                            btnWidth="calc(15% - .8rem)"
                            height="auto"
                            margin="0 0 0 .8rem"
                            fontSize="1rem"
                            padding=".5rem 0 .4rem 0"
                            borderRadius=".8rem"
                            btnColor={theme.palette.blue.main}
                            backgroundColor={theme.palette.white.background}
                            hoverColor={theme.palette.white.main}
                            hoverBackground={theme.palette.blue.main}
                            transition={'all .4s ease-out'}
                            onClick={() => {
                              copy(
                                `{\\"token\\": \\"${
                                  entryPoint.TVAlert.templateToken
                                }\\", \\"orderType\\": ${
                                  stopLoss.forcedStopByAlert
                                    ? `\\"market\\"`
                                    : `\\"${stopLoss.type}\\"`
                                } ${
                                  stopLoss.plotEnabled
                                    ? `, \\"stopLossPrice\\": {{plot_${
                                        stopLoss.plot
                                      }}}`
                                    : !stopLoss.forcedStopByAlert
                                    ? `, \\"stopLossPrice\\": ${
                                        stopLoss.stopLossPrice
                                      }`
                                    : ''
                                }}`
                              )
                            }}
                          >
                            copy
                          </BtnCustom>
                          <BtnCustom
                            btnWidth="calc(20% - .8rem)"
                            height="auto"
                            margin="0 0 0 .8rem"
                            fontSize="1rem"
                            padding=".5rem 0 .4rem 0"
                            borderRadius=".8rem"
                            btnColor={theme.palette.blue.main}
                            backgroundColor={theme.palette.white.background}
                            hoverColor={theme.palette.white.main}
                            hoverBackground={theme.palette.blue.main}
                            transition={'all .4s ease-out'}
                            onClick={() => {
                              // redirect to full example page
                            }}
                          >
                            example
                          </BtnCustom>
                        </InputRowContainer>
                      </FormInputContainer>
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
              </div>
              <InputRowContainer
                style={{
                  width: 'calc(100%)',
                  height: '4rem',
                  margin: '0 auto',
                  position: 'absolute',
                  bottom: '1rem',
                  padding: '0rem 1rem 0rem 1.2rem',
                }}
              >
                {' '}
                <SendButton
                  type={entryPoint.order.side ? 'sell' : 'buy'}
                  onClick={() => {
                    updateTerminalViewMode('onlyTables')
                  }}
                >
                  cancel
                </SendButton>
                <SendButton
                  type={entryPoint.order.side ? 'buy' : 'sell'}
                  onClick={async () => {
                    const isValid = validateSmartOrders(
                      this.state,
                      this.props.enqueueSnackbar
                    )
                    if (isValid) {
                      if (
                        entryPoint.order.total < minSpotNotional &&
                        isSPOTMarket
                      ) {
                        enqueueSnackbar(
                          `Order total should be at least ${minSpotNotional} ${
                            pair[1]
                          }`,
                          {
                            variant: 'error',
                          }
                        )

                        return
                      }

                      if (
                        entryPoint.order.amount < minFuturesStep &&
                        !isSPOTMarket
                      ) {
                        enqueueSnackbar(
                          `Order amount should be at least ${minFuturesStep} ${
                            pair[0]
                          }`,
                          {
                            variant: 'error',
                          }
                        )

                        return
                      }

                      this.updateSubBlockValue(
                        'entryPoint',
                        'order',
                        'amount',
                        stripDigitPlaces(
                          entryPoint.order.amount,
                          quantityPrecision
                        )
                      )

                      // if (
                      //   entryPoint.order.amount % minFuturesStep !== 0 &&
                      //   !isSPOTMarket
                      // ) {
                      //   enqueueSnackbar(
                      //     `Order amount should divided without remainder on ${minFuturesStep}`,
                      //     {
                      //       variant: 'error',
                      //     }
                      //   )

                      //   return
                      // }

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
            <TerminalBlock theme={theme} width={'calc(33%)'} borderRight="0">
              <InputRowContainer justify="center">
                <CustomSwitcher
                  theme={theme}
                  firstHalfText={'limit'}
                  secondHalfText={'market'}
                  buttonHeight={'3rem'}
                  containerStyles={{ width: '100%' }}
                  firstHalfStyleProperties={BlueSwitcherStyles(theme)}
                  secondHalfStyleProperties={BlueSwitcherStyles(theme)}
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
                  {!entryPoint.averaging.enabled && (
                    <DarkTooltip
                      maxWidth={'40rem'}
                      title={
                        <>
                          <p>
                            The algorithm which will wait for the trend to
                            reverse to place the order.
                          </p>
                          <p>
                            <b>Deviation:</b> The level of price change after
                            the trend reversal, at which the order will be
                            executed.
                          </p>
                          <p>
                            <b>For example:</b> you bought BTC at 7500 USDT
                            price and set 1% trailing deviation to take a
                            profit. Trailing will start right after you buy.
                            Then the price goes to 7700 and the trend reverses
                            and begins to fall. The order will be executed when
                            the price reaches 7633, i.e. by 1% from the moment
                            the trend reversed.
                          </p>
                        </>
                      }
                    >
                      <AdditionalSettingsButton
                        theme={theme}
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

                          this.updateSubBlockValue(
                            'takeProfit',
                            'timeout',
                            'isTimeoutOn',
                            false
                          )

                          this.updateStopLossAndTakeProfitPrices({
                            takeProfitPercentage: !takeProfit.trailingTAP
                              .isTrailingOn
                              ? takeProfit.trailingTAP.activatePrice
                              : takeProfit.pricePercentage,
                          })
                        }}
                      >
                        Trailing take a profit
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                  )}
                  {!takeProfit.external && !entryPoint.averaging.enabled && (
                    <DarkTooltip
                      maxWidth={'40rem'}
                      title={
                        <>
                          <p>
                            Partial closing of a trade when a certain level of
                            profit is reached.
                          </p>

                          <p>
                            Set up the price and amount, then click "Add
                            target". Distribute 100% of the total trading
                            amount.
                          </p>

                          <p>
                            <b>For example:</b> you bought BTC and set that at
                            5% profit sell 25% of your amount, at 10% profit
                            sell 60% amount and at 15% profit sell remaining 15%
                            amount. When the price reaches each profit level, it
                            will place the order for specified amount.
                          </p>
                        </>
                      }
                    >
                      <AdditionalSettingsButton
                        theme={theme}
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

                          this.updateSubBlockValue(
                            'takeProfit',
                            'timeout',
                            'isTimeoutOn',
                            false
                          )

                          this.updateBlockValue('takeProfit', 'external', false)
                        }}
                      >
                        Split targets
                      </AdditionalSettingsButton>
                    </DarkTooltip>
                  )}
                  <DarkTooltip
                    maxWidth={'30rem'}
                    title={
                      'Your take profit order will be placed once when there is a Trading View alert with params that you sent.'
                    }
                  >
                    <AdditionalSettingsButton
                      theme={theme}
                      isActive={takeProfit.external}
                      onClick={() => {
                        this.updateSubBlockValue(
                          'takeProfit',
                          'splitTargets',
                          'isSplitTargetsOn',
                          false
                        )

                        this.updateBlockValue(
                          'takeProfit',
                          'external',
                          !takeProfit.external
                        )

                        if (
                          !takeProfit.external &&
                          entryPoint.TVAlert.templateMode === 'always'
                        ) {
                          this.updateSubBlockValue(
                            'entryPoint',
                            'TVAlert',
                            'templateMode',
                            'ifNoActive'
                          )
                        }
                      }}
                    >
                      TAP by TV Alert
                    </AdditionalSettingsButton>
                  </DarkTooltip>
                  {/* <AdditionalSettingsButton theme={theme}
                    isActive={takeProfit.timeout.isTimeoutOn}
                    onClick={() => {
                      this.updateSubBlockValue(
                        'takeProfit',
                        'timeout',
                        'isTimeoutOn',
                        !takeProfit.timeout.isTimeoutOn
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'trailingTAP',
                        'isTrailingOn',
                        false
                      )

                      this.updateSubBlockValue(
                        'takeProfit',
                        'splitTargets',
                        'isSplitTargetsOn',
                        false
                      )
                    }}
                  >
                    Timeout
                  </AdditionalSettingsButton> */}
                </InputRowContainer>
                {!takeProfit.trailingTAP.isTrailingOn &&
                  ((takeProfit.external &&
                    !takeProfit.forcedStopByAlert &&
                    !takeProfit.plotEnabled) ||
                    !takeProfit.external) && (
                    <FormInputContainer
                      theme={theme}
                      haveTooltip
                      tooltipText={
                        <>
                          <p>
                            The unrealized profit/ROE for closing the trade.
                          </p>
                          <p>
                            <b>For example:</b>you bought 1 BTC and set 100%
                            take a profit. Your unrealized profit should be 1
                            BTC and order will be executed.
                          </p>
                        </>
                      }
                      title={'stop price'}
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          textAlign={'left'}
                          padding={'0'}
                          width={'calc(32.5%)'}
                          symbol={pair[1]}
                          value={takeProfit.takeProfitPrice}
                          disabled={
                            isMarketType && !entryPoint.trailing.isTrailingOn
                          }
                          showErrors={
                            showErrors &&
                            takeProfit.isTakeProfitOn &&
                            !takeProfit.external &&
                            !takeProfit.splitTargets.isSplitTargetsOn &&
                            !takeProfit.trailingTAP.isTrailingOn
                          }
                          isValid={this.validateField(
                            true,
                            takeProfit.takeProfitPrice
                          )}
                          inputStyles={{
                            paddingRight: '0',
                            paddingLeft: '1rem',
                          }}
                          onChange={(e) => {
                            const percentage =
                              entryPoint.order.side === 'sell'
                                ? (1 - e.target.value / priceForCalculate) *
                                  100 *
                                  entryPoint.order.leverage
                                : -(1 - e.target.value / priceForCalculate) *
                                  100 *
                                  entryPoint.order.leverage

                            this.updateBlockValue(
                              'takeProfit',
                              'pricePercentage',
                              stripDigitPlaces(
                                percentage < 0 ? 0 : percentage,
                                2
                              )
                            )

                            this.updateBlockValue(
                              'takeProfit',
                              'takeProfitPrice',
                              e.target.value
                            )
                          }}
                        />

                        <Input
                          theme={theme}
                          padding={'0 .8rem 0 .8rem'}
                          width={'calc(17.5%)'}
                          symbol={'%'}
                          preSymbol={'+'}
                          textAlign={'left'}
                          needPreSymbol={true}
                          value={takeProfit.pricePercentage}
                          showErrors={showErrors && takeProfit.isTakeProfitOn}
                          isValid={this.validateField(
                            true,
                            takeProfit.pricePercentage
                          )}
                          inputStyles={{
                            paddingRight: '0',
                            paddingLeft: '2rem',
                          }}
                          onChange={(e) => {
                            this.updateStopLossAndTakeProfitPrices({
                              takeProfitPercentage: e.target.value,
                            })

                            this.updateBlockValue(
                              'takeProfit',
                              'pricePercentage',
                              e.target.value
                            )
                          }}
                        />

                        <BlueSlider
                          theme={theme}
                          value={
                            takeProfit.pricePercentage > 100
                              ? 100
                              : takeProfit.pricePercentage
                          }
                          sliderContainerStyles={{
                            width: '50%',
                            margin: '0 .8rem 0 .8rem',
                          }}
                          onChange={(value) => {
                            if (
                              takeProfit.pricePercentage > 100 &&
                              value === 100
                            ) {
                              return
                            }

                            this.updateBlockValue(
                              'takeProfit',
                              'pricePercentage',
                              value
                            )

                            this.updateStopLossAndTakeProfitPrices({
                              takeProfitPercentage: value,
                            })
                          }}
                        />
                      </InputRowContainer>
                    </FormInputContainer>
                  )}

                {takeProfit.trailingTAP.isTrailingOn &&
                  ((takeProfit.external &&
                    !takeProfit.forcedStopByAlert &&
                    !takeProfit.plotEnabled) ||
                    !takeProfit.external) && (
                    <>
                      <FormInputContainer
                        theme={theme}
                        haveTooltip
                        tooltipText={
                          'The price at which the trailing algorithm is enabled.'
                        }
                        title={
                          !takeProfit.external
                            ? 'activation price'
                            : 'stop price'
                        }
                      >
                        <InputRowContainer>
                          <Input
                            theme={theme}
                            textAlign={'left'}
                            padding={'0'}
                            width={'calc(32.5%)'}
                            symbol={pair[1]}
                            value={takeProfit.takeProfitPrice}
                            disabled={
                              isMarketType && !entryPoint.trailing.isTrailingOn
                            }
                            showErrors={
                              false &&
                              showErrors &&
                              takeProfit.isTakeProfitOn &&
                              !takeProfit.splitTargets.isSplitTargetsOn &&
                              !takeProfit.external
                            }
                            isValid={this.validateField(
                              true,
                              takeProfit.takeProfitPrice
                            )}
                            inputStyles={{
                              paddingRight: '0',
                              paddingLeft: '1rem',
                            }}
                            onChange={(e) => {
                              const percentage =
                                entryPoint.order.side === 'sell'
                                  ? (1 - e.target.value / priceForCalculate) *
                                    100 *
                                    entryPoint.order.leverage
                                  : -(1 - e.target.value / priceForCalculate) *
                                    100 *
                                    entryPoint.order.leverage

                              this.updateSubBlockValue(
                                'takeProfit',
                                'trailingTAP',
                                'activatePrice',
                                stripDigitPlaces(
                                  percentage < 0 ? 0 : percentage,
                                  2
                                )
                              )

                              this.updateBlockValue(
                                'takeProfit',
                                'takeProfitPrice',
                                e.target.value
                              )
                            }}
                          />
                          <Input
                            theme={theme}
                            symbol={'%'}
                            padding={'0 .8rem 0 .8rem'}
                            width={'calc(17.5%)'}
                            preSymbol={'+'}
                            textAlign={'left'}
                            needPreSymbol={true}
                            value={takeProfit.trailingTAP.activatePrice}
                            showErrors={
                              showErrors &&
                              takeProfit.isTakeProfitOn &&
                              !takeProfit.external
                            }
                            isValid={this.validateField(
                              takeProfit.trailingTAP.isTrailingOn,
                              takeProfit.trailingTAP.activatePrice
                            )}
                            inputStyles={{
                              paddingRight: '0',
                              paddingLeft: '2rem',
                            }}
                            onChange={(e) => {
                              this.updateSubBlockValue(
                                'takeProfit',
                                'trailingTAP',
                                'activatePrice',
                                e.target.value
                              )

                              this.updateStopLossAndTakeProfitPrices({
                                takeProfitPercentage: e.target.value,
                              })
                            }}
                          />
                          <BlueSlider
                            theme={theme}
                            value={takeProfit.trailingTAP.activatePrice}
                            sliderContainerStyles={{
                              width: '50%',
                              margin: '0 .8rem 0 .8rem',
                            }}
                            onChange={(value) => {
                              if (
                                takeProfit.trailingTAP.activatePrice > 100 &&
                                value === 100
                              ) {
                                return
                              }

                              this.updateSubBlockValue(
                                'takeProfit',
                                'trailingTAP',
                                'activatePrice',
                                value
                              )

                              this.updateStopLossAndTakeProfitPrices({
                                takeProfitPercentage: value,
                              })
                            }}
                          />
                        </InputRowContainer>
                      </FormInputContainer>
                      {!takeProfit.external && (
                        <FormInputContainer
                          theme={theme}
                          haveTooltip
                          tooltipText={
                            'The level of price change after the trend reversal, at which the order will be executed.'
                          }
                          title={'trailing deviation (%)'}
                        >
                          <InputRowContainer>
                            <Input
                              theme={theme}
                              padding={'0 .8rem 0 0'}
                              width={'calc(50%)'}
                              symbol={'%'}
                              value={takeProfit.trailingTAP.deviationPercentage}
                              showErrors={
                                showErrors &&
                                takeProfit.isTakeProfitOn &&
                                !takeProfit.external
                              }
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
                              theme={theme}
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
                      )}
                    </>
                  )}
                {takeProfit.external && (
                  <>
                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={false}
                      tooltipText={''}
                      title={'action when alert'}
                    >
                      <InputRowContainer>
                        <AdditionalSettingsButton
                          theme={theme}
                          btnWidth={'50%'}
                          isActive={takeProfit.forcedStopByAlert}
                          onClick={() => {
                            this.updateBlockValue(
                              'takeProfit',
                              'forcedStopByAlert',
                              !takeProfit.forcedStopByAlert
                            )
                            this.updateBlockValue(
                              'takeProfit',
                              'plotEnabled',
                              false
                            )

                            this.updateBlockValue(
                              'takeProfit',
                              'type',
                              'market'
                            )
                          }}
                        >
                          Forced Stop by Alert
                        </AdditionalSettingsButton>
                        <AdditionalSettingsButton
                          theme={theme}
                          btnWidth={'50%'}
                          isActive={takeProfit.plotEnabled}
                          onClick={() => {
                            this.updateBlockValue(
                              'takeProfit',
                              'forcedStopByAlert',
                              false
                            )

                            this.updateBlockValue(
                              'takeProfit',
                              'plotEnabled',
                              !takeProfit.plotEnabled
                            )
                          }}
                        >
                          Plot
                        </AdditionalSettingsButton>
                      </InputRowContainer>
                    </FormInputContainer>

                    {takeProfit.plotEnabled && (
                      <InputRowContainer padding={'0 0 .8rem 0'}>
                        <Input
                          theme={theme}
                          type={'number'}
                          needTitle
                          title={`plot_`}
                          textAlign="left"
                          inputStyles={{
                            paddingLeft: '4rem',
                          }}
                          value={takeProfit.plot}
                          showErrors={showErrors}
                          isValid={this.validateField(true, takeProfit.plot)}
                          onChange={(e) => {
                            this.updateBlockValue(
                              'takeProfit',
                              'plot',
                              e.target.value
                            )
                          }}
                        />
                      </InputRowContainer>
                    )}
                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={true}
                      tooltipText={
                        <img
                          style={{ width: '35rem', height: '50rem' }}
                          src={WebHookImg}
                        />
                      }
                      title={
                        <span>
                          paste it into{' '}
                          <span
                            style={{ color: theme.palette.blue.background }}
                          >
                            web-hook url
                          </span>{' '}
                          field when creating tv alert
                        </span>
                      }
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          width={'85%'}
                          type={'text'}
                          disabled={true}
                          textAlign={'left'}
                          value={`https://${API_URL}/editTakeProfitByAlert`}
                        />
                        {/* entryPoint.TVAlert.templateToken */}
                        <BtnCustom
                          btnWidth="calc(15% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            copy(`https://${API_URL}/editTakeProfitByAlert`)
                          }}
                        >
                          copy
                        </BtnCustom>
                      </InputRowContainer>
                    </FormInputContainer>
                    <FormInputContainer
                      theme={theme}
                      padding={'0 0 .8rem 0'}
                      haveTooltip={true}
                      tooltipText={
                        <img
                          style={{ width: '40rem', height: '42rem' }}
                          src={MessageImg}
                        />
                      }
                      title={
                        <span>
                          paste it into{' '}
                          <span
                            style={{ color: theme.palette.blue.background }}
                          >
                            message
                          </span>{' '}
                          field when creating tv alert
                        </span>
                      }
                    >
                      <InputRowContainer>
                        <Input
                          theme={theme}
                          width={'65%'}
                          type={'text'}
                          disabled={true}
                          textAlign={'left'}
                          value={`{\\"token\\": \\"${
                            entryPoint.TVAlert.templateToken
                          }\\", \\"orderType\\": ${
                            takeProfit.forcedStopByAlert
                              ? `\\"market\\"`
                              : `\\"${takeProfit.type}\\"`
                          } ${
                            takeProfit.plotEnabled
                              ? takeProfit.trailingTAP.isTrailingOn
                                ? `, \\"trailingExitPrice\\": {{plot_${
                                    takeProfit.plot
                                  }}}`
                                : `, \\"takeProfitPrice\\": {{plot_${
                                    takeProfit.plot
                                  }}}`
                              : !takeProfit.forcedStopByAlert
                              ? takeProfit.trailingTAP.isTrailingOn
                                ? `, \\"trailingExitPrice\\": ${
                                    takeProfit.takeProfitPrice
                                  }`
                                : `, \\"takeProfitPrice\\": ${
                                    takeProfit.takeProfitPrice
                                  }`
                              : ''
                          }}`}
                        />
                        {/* entryPoint.TVAlert.templateToken */}
                        <BtnCustom
                          btnWidth="calc(15% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            copy(
                              `{\\"token\\": \\"${
                                entryPoint.TVAlert.templateToken
                              }\\", \\"orderType\\": ${
                                takeProfit.forcedStopByAlert
                                  ? `\\"market\\"`
                                  : `\\"${takeProfit.type}\\"`
                              } ${
                                takeProfit.plotEnabled
                                  ? takeProfit.trailingTAP.isTrailingOn
                                    ? `, \\"trailingExitPrice\\": {{plot_${
                                        takeProfit.plot
                                      }}}`
                                    : `, \\"takeProfitPrice\\": {{plot_${
                                        takeProfit.plot
                                      }}}`
                                  : !takeProfit.forcedStopByAlert
                                  ? takeProfit.trailingTAP.isTrailingOn
                                    ? `, \\"trailingExitPrice\\": ${
                                        takeProfit.takeProfitPrice
                                      }`
                                    : `, \\"takeProfitPrice\\": ${
                                        takeProfit.takeProfitPrice
                                      }`
                                  : ''
                              }}`
                            )
                          }}
                        >
                          copy
                        </BtnCustom>
                        <BtnCustom
                          btnWidth="calc(20% - .8rem)"
                          height="auto"
                          margin="0 0 0 .8rem"
                          fontSize="1rem"
                          padding=".5rem 0 .4rem 0"
                          borderRadius=".8rem"
                          btnColor={theme.palette.blue.main}
                          backgroundColor={theme.palette.white.background}
                          hoverColor={theme.palette.white.main}
                          hoverBackground={theme.palette.blue.main}
                          transition={'all .4s ease-out'}
                          onClick={() => {
                            // redirect to full example page
                          }}
                        >
                          example
                        </BtnCustom>
                      </InputRowContainer>
                    </FormInputContainer>
                  </>
                )}

                {takeProfit.splitTargets.isSplitTargetsOn && (
                  <>
                    <FormInputContainer theme={theme} title={'amount (%)'}>
                      <InputRowContainer>
                        <Input
                          theme={theme}
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
                          theme={theme}
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
                        btnColor={theme.palette.white.main}
                        backgroundColor={theme.palette.orange.main}
                        borderColor={theme.palette.orange.main}
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
                          theme={theme}
                          style={{ width: '50%', paddingLeft: '2rem' }}
                        >
                          profit
                        </TargetTitle>
                        <TargetTitle theme={theme} style={{ width: '50%' }}>
                          quantity
                        </TargetTitle>
                      </InputRowContainer>
                      <div
                        style={{
                          width: '100%',
                          background: theme.palette.grey.main,
                          borderRadius: '.8rem',
                          border: theme.palette.border.main,
                        }}
                      >
                        {takeProfit.splitTargets.targets.map((target, i) => (
                          <InputRowContainer
                            key={`${target.price}${target.quantity}${i}`}
                            padding=".2rem .5rem"
                            style={
                              takeProfit.splitTargets.targets.length - 1 !== i
                                ? {
                                    borderBottom: theme.palette.border.main,
                                  }
                                : {}
                            }
                          >
                            <TargetValue
                              theme={theme}
                              style={{ width: '50%', paddingLeft: '2rem' }}
                            >
                              +{target.price}%
                            </TargetValue>
                            <TargetValue theme={theme} style={{ width: '40%' }}>
                              {target.quantity}%
                            </TargetValue>
                            <CloseIcon
                              onClick={() => this.deleteTarget(i)}
                              style={{
                                color: theme.palette.red.main,
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
                    <TradeInputHeader
                      theme={theme}
                      title={`timeout`}
                      needLine={true}
                    />
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

                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitableOn',
                                false
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            theme={theme}
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
                            theme={theme}
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

                              this.updateSubBlockValue(
                                'takeProfit',
                                'timeout',
                                'whenProfitOn',
                                false
                              )
                            }}
                            style={{ padding: '0 .4rem 0 0' }}
                          />
                          <Input
                            theme={theme}
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
                            theme={theme}
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
              theme={theme}
              openFromTerminal
              price={this.getEntryPrice()}
              pair={pair}
              pricePrecision={pricePrecision}
              side={entryPoint.order.side}
              leverage={entryPoint.order.leverage}
              open={editPopup === 'takeProfit'}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(takeProfitProperties) => {
                const price = this.getEntryPrice()
                const percentage = takeProfitProperties.isTrailingOn
                  ? takeProfitProperties.activatePrice
                  : takeProfitProperties.pricePercentage
                const takeProfitPrice =
                  entryPoint.order.side === 'sell'
                    ? stripDigitPlaces(
                        price *
                          (1 - percentage / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )
                    : stripDigitPlaces(
                        price *
                          (1 + percentage / 100 / entryPoint.order.leverage),
                        pricePrecision
                      )

                this.setState({
                  takeProfit: {
                    takeProfitPrice,
                    ...transformTakeProfitProperties(takeProfitProperties),
                  },
                })
              }}
              derivedState={getTakeProfitObject(this.state.takeProfit)}
              validate={(obj, isValid) =>
                validateTakeProfit(obj, isValid, this.props.enqueueSnackbar)
              }
              transformProperties={transformTakeProfitProperties}
              validateField={this.validateField}
            />
          )}

          {editPopup === 'stopLoss' && (
            <EditStopLossPopup
              theme={theme}
              openFromTerminal
              price={this.getEntryPrice()}
              pair={pair}
              pricePrecision={pricePrecision}
              side={entryPoint.order.side}
              leverage={entryPoint.order.leverage}
              open={editPopup === 'stopLoss'}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(stopLossProperties) => {
                const stopLossPercentage = stopLossProperties.pricePercentage
                const forcedStopPercentage = stopLossProperties.forcedPercentage
                const price = this.getEntryPrice()
                const stopLossPrice =
                  entryPoint.order.side === 'buy'
                    ? stripDigitPlaces(
                        price *
                          (1 -
                            stopLossPercentage /
                              100 /
                              entryPoint.order.leverage),
                        pricePrecision
                      )
                    : stripDigitPlaces(
                        price *
                          (1 +
                            stopLossPercentage /
                              100 /
                              entryPoint.order.leverage),
                        pricePrecision
                      )

                const forcedStopPrice =
                  entryPoint.order.side === 'buy'
                    ? stripDigitPlaces(
                        price *
                          (1 -
                            forcedStopPercentage /
                              100 /
                              entryPoint.order.leverage),
                        pricePrecision
                      )
                    : stripDigitPlaces(
                        price *
                          (1 +
                            forcedStopPercentage /
                              100 /
                              entryPoint.order.leverage),
                        pricePrecision
                      )

                this.setState({
                  stopLoss: {
                    stopLossPrice,
                    ...transformStopLossProperties(stopLossProperties),
                    forcedStop: {
                      forcedStopPrice,
                      ...transformStopLossProperties(stopLossProperties)
                        .forcedStop,
                    },
                  },
                })
              }}
              transformProperties={transformStopLossProperties}
              validate={(obj, isValid) =>
                validateStopLoss(obj, isValid, this.props.enqueueSnackbar)
              }
              derivedState={getStopLossObject(this.state.stopLoss)}
              validateField={this.validateField}
            />
          )}
          {editPopup === 'entryOrder' && (
            <EditEntryOrderPopup
              theme={theme}
              maxLeverage={maxLeverage}
              openFromTerminal
              open={editPopup === 'entryOrder'}
              price={this.props.price}
              pair={pair}
              pricePrecision={pricePrecision}
              side={entryPoint.order.side}
              marketType={marketType}
              leverage={entryPoint.order.leverage}
              funds={funds}
              transformProperties={transformEntryOrderProperties}
              handleClose={() => this.setState({ editPopup: null })}
              updateState={(entryOrderProperties) => {
                const trailingDeviationPrice =
                  entryPoint.order.side === 'buy'
                    ? stripDigitPlaces(
                        priceForCalculate *
                          (1 +
                            entryOrderProperties.trailing.deviationPercentage /
                              100),
                        pricePrecision
                      )
                    : stripDigitPlaces(
                        priceForCalculate *
                          (1 -
                            entryOrderProperties.trailing.deviationPercentage /
                              100),
                        pricePrecision
                      )

                this.setState({
                  entryPoint: {
                    ...entryPoint,
                    order: {
                      ...entryPoint.order,
                      ...entryOrderProperties.order,
                    },
                    trailing: {
                      trailingDeviationPrice,
                      ...entryPoint.trailing,
                      ...entryOrderProperties.trailing,
                    },
                  },
                })
              }}
              validate={(obj, isValid) =>
                validateEntryOrder(obj, isValid, this.props.enqueueSnackbar)
              }
              derivedState={getEntryOrderObject(entryPoint)}
              validateField={this.validateField}
            />
          )}
        </CustomCard>
      </>
    )
  }
}
