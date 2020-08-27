import { ChangeEvent, CSSProperties } from 'react'
import { Theme } from '@material-ui/core'

export interface IProps {
  price: number
  leverage: number
  marketType: 0 | 1
  quantityPrecision: number
  pricePrecision: number
  componentLeverage: number
  funds: {
    quantity: number
  }[]
  pair: string
  theme: Theme
  marketPriceAfterPairChange: number
  hedgeMode: string
  maxLeverage: number
  minFuturesStep: number
  minSpotNotional: number
  updateTerminalViewMode: (mode: string) => void
  priceFromOrderbook: null | number
  enqueueSnackbar: (msg: string, obj: { variant: string }) => void
}

export type EntryPointType = {
  order: {
    type: 'market' | 'limit'
    side: 'buy' | 'sell'
    price: number
    amount: number
    total: number
    leverage: number
    hedgeMode: string
    isHedgeOn: boolean
    hedgePrice: number
    hedgeIncrease: number | string
    hedgeSide: 'short' | 'long'
  }
  averaging: {
    enabled: boolean
    closeStrategyAfterFirstTAP: boolean
    placeWithoutLoss: boolean
    entryLevels: {
      type: number
      price: number
      amount: number
      placeWithoutLoss: boolean
    }[]
  }
  trailing: {
    isTrailingOn: boolean
    deviationPercentage: number
    trailingDeviationPrice: number
  }
  TVAlert: {
    isTVAlertOn: boolean
    templateMode: string
    templateToken: string
    plotEnabled: boolean
    immediateEntry: boolean
    sidePlotEnabled: boolean
    sidePlot: string | number
    typePlotEnabled: boolean
    typePlot: string | number
    hedgeModePlotEnabled: boolean
    hedgeModePlot: string | number
    pricePlotEnabled: boolean
    pricePlot: string | number
    amountPlotEnabled: boolean
    amountPlot: string | number
    deviationPlotEnabled: boolean
    deviationPlot: string | number
  }
}

export type TakeProfitType = {
  isTakeProfitOn: boolean
  type: 'market' | 'limit'
  pricePercentage: number
  takeProfitPrice: number
  splitTargets: {
    isSplitTargetsOn: boolean
    volumePercentage: number
    targets: {
      price: number
      quantity: number
    }[]
  }
  timeout: {
    isTimeoutOn: boolean
    whenProfitOn: boolean
    whenProfitMode: 'sec' | 'min'
    whenProfitSec: number
    whenProfitableOn: boolean
    whenProfitableMode: 'sec' | 'min'
    whenProfitableSec: number
  }
  trailingTAP: {
    isTrailingOn: boolean
    activatePrice: number
    deviationPercentage: number
  }
  forcedStopByAlert: boolean
  external: boolean
  plotEnabled: boolean
  plot: string | number
}

export type StopLossType = {
  isStopLossOn: boolean
  type: 'market' | 'limit'
  pricePercentage: number
  stopLossPrice: number
  timeout: {
    isTimeoutOn: boolean
    whenLossOn: boolean
    whenLossMode: 'sec' | 'min'
    whenLossSec: number
    whenLossableOn: boolean
    whenLossableMode: 'sec' | 'min'
    whenLossableSec: number
  }
  forcedStop: {
    isForcedStopOn: boolean
    mandatoryForcedLoss: boolean
    pricePercentage: number
    forcedStopPrice: number
  }
  forcedStopByAlert: boolean
  external: boolean
  plotEnabled: boolean
  plot: string | number
}

export interface IState {
  showConfirmationPopup: boolean
  showErrors: boolean
  editPopup: null | string
  entryPoint: EntryPointType
  takeProfit: TakeProfitType
  stopLoss: StopLossType
  temp: {
    initialMargin: number
  }
}

export type HeaderProperties = {
  width?: string
  margin?: string
  padding?: string
  justify?: string
}

export type BlockProperties = {
  width?: string
}

export type InputProps = {
  symbol?: string
  value: number | string
  width: string
  padding?: string
  placeholder?: string
  pattern?: string
  type?: string
  list?: string
  min?: string
  needCharacter?: boolean
  beforeSymbol?: string
  onChange: (e: ChangeEvent) => void
  isDisabled?: boolean
  isValid?: boolean
  showErrors?: boolean
  inputStyles?: CSSProperties
}

export type InputRowProps = {
  direction?: string
  justify?: string
  padding?: string
  width?: string
}
