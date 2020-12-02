import React from 'react'

import { IProps, IState } from './types'

import _ from 'lodash'

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

import { CustomCard } from '../../Chart.styles'

import {
  EditTakeProfitPopup,
  EditStopLossPopup,
  EditEntryOrderPopup,
} from './EditOrderPopups'

import { SmartOrderOnboarding } from '@sb/compositions/Chart/components/SmartOrderTerminal/SmartTerminalOnboarding/SmartTerminalOnboarding'
import ConfirmationPopup from '@sb/compositions/Chart/components/SmartOrderTerminal/ConfirmationPopup/ConfirmationPopup'

import {
  TerminalBlocksContainer,
} from './styles'

import { EntryOrderBlock, StopLossBlock, TakeProfitBlock, TerminalHeadersBlock } from './Blocks'

const generateToken = () =>
  Math.random()
    .toString(36)
    .substring(2, 15) +
  Math.random()
    .toString(36)
    .substring(2, 15)

export class SmartOrderTerminal extends React.PureComponent<{}, IState> {
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
        leverage: 1,
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
        placeEntryAfterTAP: false,
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

  componentDidMount() {
    const {
      getStrategySettingsQuery,
      marketType,
      componentLeverage,
      hedgeMode,
      quantityPrecision
    } = this.props

    this.updateSubBlockValue('entryPoint', 'order', 'price', this.props.price)

    console.log('getStrategySettingsQuery', getStrategySettingsQuery)
    const result = getDefaultStateFromStrategySettings({
      getStrategySettingsQuery,
      marketType,
    })
    console.log('result', result)

    if (!result) {
      return
    }

    let savedAveraging = { ...result.entryPoint?.averaging }

    if (result.entryPoint?.averaging?.entryLevels) {
      savedAveraging = {
        ...result.entryPoint?.averaging,
        entryLevels: [
          ...(result.entryPoint?.averaging.entryLevels.length > 0
            ? [
              {
                ...result.entryPoint.averaging.entryLevels[0],
                price: this.props.price,
              },
            ]
            : []),
          ...result.entryPoint?.averaging.entryLevels.slice(1),
        ],
      }
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
          ...(marketType === 0 ? { side: 'buy' } : {}),
          leverage: componentLeverage,
          hedgeMode,
        },
        averaging: {
          enabled: false,
          closeStrategyAfterFirstTAP: false,
          placeEntryAfterTAP: false,
          placeWithoutLoss: false,
          entryLevels: [],
          percentage: 0,
          price: 0,
          ...savedAveraging,
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
            : {
              isTrailingOn: false,
            }),
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
      stripDigitPlaces(result.entryPoint.order.amount, quantityPrecision)
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
      leverage: this.props.leverage,
      side: result.entryPoint.order.side,
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
    // function difference(object, base) {
    //   function changes(object, base) {
    //     return _.transform(object, function (result, value, key) {
    //       if (!_.isEqual(value, base[key])) {
    //         result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
    //       }
    //     });
    //   }
    //   return changes(object, base);
    // }

    // console.log(difference(prevProps, this.props))

    const isMarketType =
      this.state.entryPoint.order.type === 'market' ||
      this.state.entryPoint.order.type === 'maker-only'

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
      isMarketType &&
      !this.state.entryPoint.trailing.isTrailingOn
    ) {
      const { price, marketType } = this.props
      const total = this.state.temp.initialMargin * this.props.componentLeverage

      if (total > 0) {
        this.updateSubBlockValue(
          'entryPoint',
          'order',
          'amount',
          stripDigitPlaces(
            total / this.props.price,
            marketType === 1 ? this.props.quantityPrecision : 8
          )
        )
      }

      this.updateStopLossAndTakeProfitPrices({
        price,
      })
    }

    if (
      this.props.marketPriceAfterPairChange !==
      prevProps.marketPriceAfterPairChange &&
      prevProps.marketPriceAfterPairChange !== 0
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
      type
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
              { price: pricePercentage, amount: volumePercentage, type },
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
            ...(isAveragingAfterFirstTarget ? {} : { price }),
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


      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'price',
        isAveragingAfterFirstTarget ? averagingPrice : price
      )
      this.updateSubBlockValue('entryPoint', 'order', 'amount', 0)
      this.updateSubBlockValue('entryPoint', 'order', 'total', 0)
      this.updateBlockValue('temp', 'initialMargin', 0)
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
      pair,
      keyId,
      price,
      marketType,
      placeOrder,
      showOrderResult,
      cancelOrder,
      quantityPrecision,
      updateTerminalViewMode,
    } = this.props

    this.handleCloseConfirmationPopup()

    const isValid = await validateSmartOrders(
      this.state,
      this.props.enqueueSnackbar
    )

    if (!isValid) return

    // ux-improvement to see popup before result from the backend received
    const successResult = {
      status: 'success',
      message: 'Smart order placed',
      orderId: '0',
    }
    showOrderResult(successResult, cancelOrder)

    updateTerminalViewMode('onlyTables')

    const result = await placeOrder({
      side: entryPoint.order.side,
      priceType: entryPoint.order.type,
      pair,
      values: {},
      terminalMode: 'smart',
      state: { ...this.state, templateAlertMessage: this.getEntryAlertJson() },
      futuresValues: {},
      keyId,
      marketType,
      lastMarketPrice: price,
      quantityPrecision
    })

    if (result.status === 'error' || !result.orderId) {
      await showOrderResult(result, cancelOrder)
    }

    // if (result.status === 'success' && result.orderId)
    //   updateTerminalViewMode('default')
  }

  showConfirmationPopup = async () => {
    const { entryPoint } = this.state
    const {
      pair,
      enqueueSnackbar,
      quantityPrecision,
      minSpotNotional,
      minFuturesStep,
      marketType,
    } = this.props


    const isSPOTMarket = marketType === 0
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
          `Order total should be at least ${minSpotNotional} ${pair[1]}`,
          {
            variant: 'error',
          }
        )

        return
      }

      if (
        entryPoint.order.amount < minFuturesStep &&
        !isSPOTMarket &&
        entryPoint.averaging.entryLevels.length === 0
      ) {
        enqueueSnackbar(
          `Order amount should be at least ${minFuturesStep} ${pair[0]}`,
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

      this.setState({ showConfirmationPopup: true })
    } else {
      this.setState({ showErrors: true })
    }
  }

  getEntryPrice = () => {
    const { entryPoint } = this.state
    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'

    let price =
      isMarketType && !entryPoint.trailing.isTrailingOn
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

  updatePriceToMarket = () => {
    const { entryPoint } = this.state
    const {
      price,
      marketType
    } = this.props

    if (!entryPoint.trailing.isTrailingOn) {
      this.updateSubBlockValue('entryPoint', 'averaging', 'enabled', false)

      this.updateSubBlockValue(
        'entryPoint',
        'order',
        'total',
        stripDigitPlaces(
          price * entryPoint.order.amount,
          marketType === 1 ? 2 : 8
        )
      )

      this.updateBlockValue(
        'temp',
        'initialMargin',
        stripDigitPlaces(
          (price * entryPoint.order.amount) /
          entryPoint.order.leverage,
          2
        )
      )
    }
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

    // we can pass 0 => !stopLossPercentage wont work for this case
    stopLossPercentage = stopLossPercentage != undefined
      ? stopLossPercentage
      : stopLoss.pricePercentage

    takeProfitPercentage = takeProfitPercentage != undefined
      ? takeProfitPercentage
      : takeProfit.trailingTAP.isTrailingOn
        ? takeProfit.trailingTAP.activatePrice
        : takeProfit.pricePercentage

    forcedStopPercentage = forcedStopPercentage != undefined
      ? forcedStopPercentage
      : stopLoss.forcedStop.pricePercentage

    deviationPercentage = deviationPercentage != undefined
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

    console.log('takeProfitPrice', takeProfitPrice, takeProfitPrice, leverage, price)

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

  getMaxValues = (): [number, number] => {
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
        averaging: {
          enabled: averagingEnabled,
          closeStrategyAfterFirstTAP,
          placeEntryAfterTAP,
          entryLevels,
        },
      },
    } = this.state

    const amountFromEntryLevels = entryLevels.reduce(
      (prev, curr) => prev + curr.amount,
      0
    )

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
      : averagingEnabled
        ? ''
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

    const averagingJson = averagingEnabled
      ? `\\"entryLevels\\": [${entryLevels.map(
        (level, i) =>
          `{\\"type\\": ${level.type}, \\"amount\\": ${level.type === 0
            ? level.amount
            : +stripDigitPlaces(
              (level.amount / amountFromEntryLevels) * 100,
              2
            )
          }, \\"price\\":${level.price}, \\"placeWithoutLoss\\": ${level.placeWithoutLoss
          }}`
      )}], \\"closeStrategyAfterFirstTAP\\": ${closeStrategyAfterFirstTAP}, \\"placeEntryAfterTAP\\": ${placeEntryAfterTAP}`
      : ''

    return `{\\"token\\": \\"${templateToken}\\", ${typeJson}, ${hedgeModeJson}, ${sideJson}, ${priceJson}${priceJson === '' ? '' : ','
      } ${averagingJson} ${averagingJson === '' ? '' : ','} ${amountJson}${isTrailingOn ? ', ' : ''
      }${deviationJson}}`
  }

  render() {
    const {
      pair,
      keyId,
      funds,
      theme,
      selectedKey,
      marketType,
      updateLeverage,
      quantityPrecision,
      updateTerminalViewMode,
      pricePrecision,
      maxLeverage,
      leverage: startLeverage,
      smartTerminalOnboarding,
      updateTooltipSettingsMutation,
      getTooltipSettings,
      changeMarginTypeWithStatus,
      componentMarginType,
    } = this.props

    // console.log('sm props', this.props)

    const {
      entryPoint,
      takeProfit,
      stopLoss,
      showErrors,
      showConfirmationPopup,
      editPopup,
    } = this.state

    const isMarketType =
      entryPoint.order.type === 'market' ||
      entryPoint.order.type === 'maker-only'
    const isAveragingAfterFirstTarget =
      entryPoint.averaging.entryLevels.length > 0 &&
      entryPoint.averaging.enabled
    const isCloseOrderExternal = stopLoss.external || takeProfit.external

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

    if (entryPoint.averaging.entryLevels.length > 0) {
      entryPoint.averaging.entryLevels.forEach((target) => {
        if (marketType === 0 && entryPoint.order.side === 'sell') {
          maxAmount -= target.amount
        } else {
          maxAmount -= target.amount * priceForCalculate
        }
      })
    }

    return (
      <>
        {showConfirmationPopup && !editPopup && (
          <ConfirmationPopup
            theme={theme}
            quantityPrecision={quantityPrecision}
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
          <SmartOrderOnboarding
            smartTerminalOnboarding={smartTerminalOnboarding}
            getTooltipSettings={getTooltipSettings}
            updateTooltipSettingsMutation={updateTooltipSettingsMutation}
          />

          <TerminalHeadersBlock
            pair={pair}
            theme={theme}
            entryPoint={entryPoint}
            marketType={marketType}
            selectedKey={selectedKey}
            maxLeverage={maxLeverage}
            isMarketType={isMarketType}
            startLeverage={startLeverage}
            updateLeverage={updateLeverage}
            validateField={this.validateField}
            priceForCalculate={priceForCalculate}
            quantityPrecision={quantityPrecision}
            updateBlockValue={this.updateBlockValue}
            componentMarginType={componentMarginType}
            initialMargin={this.state.temp.initialMargin}
            updateSubBlockValue={this.updateSubBlockValue}
            changeMarginTypeWithStatus={changeMarginTypeWithStatus}
            updateStopLossAndTakeProfitPrices={this.updateStopLossAndTakeProfitPrices}
          />

          {/* entry order */}
          <TerminalBlocksContainer xs={12} container item>
            <EntryOrderBlock
              pair={pair}
              addAverageTarget={this.addAverageTarget}
              deleteAverageTarget={this.deleteAverageTarget}
              entryPoint={entryPoint}
              funds={funds}
              getEntryAlertJson={this.getEntryAlertJson}
              getMaxValues={this.getMaxValues}
              initialMargin={this.state.temp.initialMargin}
              isAveragingAfterFirstTarget={isAveragingAfterFirstTarget}
              isCloseOrderExternal={isCloseOrderExternal}
              isMarketType={isMarketType}
              marketType={marketType}
              maxAmount={maxAmount}
              priceForCalculate={priceForCalculate}
              pricePrecision={pricePrecision}
              quantityPrecision={quantityPrecision}
              setMaxAmount={this.setMaxAmount}
              showErrors={showErrors}
              theme={theme}
              updateBlockValue={this.updateBlockValue}
              updateStopLossAndTakeProfitPrices={this.updateStopLossAndTakeProfitPrices}
              updateSubBlockValue={this.updateSubBlockValue}
              updatePriceToMarket={this.updatePriceToMarket}
              validateField={this.validateField}
            />
            {/* STOP LOSS */}
            <StopLossBlock
              pair={pair}
              theme={theme}
              stopLoss={stopLoss}
              showErrors={showErrors}
              entryPoint={entryPoint}
              isMarketType={isMarketType}
              pricePrecision={pricePrecision}
              validateField={this.validateField}
              priceForCalculate={entryPoint.trailing.isTrailingOn ? entryPoint.trailing.trailingDeviationPrice : priceForCalculate}
              updateBlockValue={this.updateBlockValue}
              updateSubBlockValue={this.updateSubBlockValue}
              updateTerminalViewMode={updateTerminalViewMode}
              showConfirmationPopup={this.showConfirmationPopup}
              updateStopLossAndTakeProfitPrices={this.updateStopLossAndTakeProfitPrices}
            />

            {/* TAKE A PROFIT */}

            <TakeProfitBlock
              pair={pair}
              theme={theme}
              takeProfit={takeProfit}
              showErrors={showErrors}
              entryPoint={entryPoint}
              marketType={marketType}
              addTarget={this.addTarget}
              isMarketType={isMarketType}
              pricePrecision={pricePrecision}
              deleteTarget={this.deleteTarget}
              validateField={this.validateField}
              priceForCalculate={entryPoint.trailing.isTrailingOn ? entryPoint.trailing.trailingDeviationPrice : priceForCalculate}
              updateBlockValue={this.updateBlockValue}
              updateSubBlockValue={this.updateSubBlockValue}
              updateStopLossAndTakeProfitPrices={this.updateStopLossAndTakeProfitPrices}
            />

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
              quantityPrecision={quantityPrecision}
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

export const SmartOrderTerminalMemo = SmartOrderTerminal