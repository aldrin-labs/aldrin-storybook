import { ChangeEvent, CSSProperties } from 'react'

export interface IProps {
  updateTerminalViewMode: (mode: string) => void
  priceFromOrderbook: null | number
}

export type EntryPointType = {
  order: {
    type: 'market' | 'limit'
    side: 'buy' | 'sell'
    price: number
    amount: number
    total: number
    leverage: number
    hedgeMode: boolean
    isHedgeOn: boolean
    hedgePrice: number
    hedgeIncrease: number | string
    hedgeSide: 'short' | 'long'
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
