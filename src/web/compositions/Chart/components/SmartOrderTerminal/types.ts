import { ChangeEvent, CSSProperties } from 'react'
import { Theme } from '@material-ui/core'

type PlaceOrderResult = {
  status: string
  message: string
  orderId: string
}

type CancelOrder = (obj: { variables: { cancelOrderInput: {
  keyId: string,
  orderId: string,
  pair: string,
  marketType: 0 | 1,
  type: string
}}}) => void

type SelectedKey = {
  keyId: string
  isFuturesWarsKey: boolean
  hedgeMode: boolean
}

interface StateOfSMForPlaceOrder extends IState {
  templateAlertMessage: string
}

export interface IProps {
  price: number
  leverage: number
  keyId: string
  marketType: 0 | 1
  quantityPrecision: number
  pricePrecision: number
  componentLeverage: number
  getStrategySettingsQuery: any
  getTooltipSettings: any
  funds: [{ quantity: number, value: number}, { quantity: number, value: number}]
  pair: [string, string]
  theme: Theme
  marketPriceAfterPairChange: number
  hedgeMode: boolean
  maxLeverage: number
  minFuturesStep: number
  minSpotNotional: number
  smartTerminalOnboarding: boolean
  componentMarginType: 'cross' | 'isolated'
  cancelOrder: CancelOrder,
  placeOrder: (
    side: string,
    type: string,
    futuresValues: any,
    typeOfOrder: 'smart',
    stateOfSM: StateOfSMForPlaceOrder
  ) => PlaceOrderResult,
  showOrderResult: (res: PlaceOrderResult, cancelOrder: CancelOrder) => void
  changeMarginTypeWithStatus: (marginType: 'cross' | 'isolated') => void
  updateLeverage: (lev: number) => void
  updateTooltipSettingsMutation: (obj: { variables: any}) => void
  updateTerminalViewMode: (mode: string) => void
  priceFromOrderbook: null | number
  enqueueSnackbar: (msg: string, obj: { variant: string }) => void
}

export type EntryLevel = {
  type: number
  price: number
  amount: number
  placeWithoutLoss?: boolean
}

export type ExitLevel = {
  type: string
  price: number
  amount: number
}

export type EntryPointType = {
  order: {
    type: 'market' | 'limit' | 'maker-only'
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
  averaging: {
    enabled: boolean
    closeStrategyAfterFirstTAP: boolean
    placeEntryAfterTAP: boolean
    placeWithoutLoss: boolean
    percentage: number
    price: number
    entryLevels: EntryLevel[]
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
    targets: ExitLevel[]
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
  theme: Theme
  value: number | string
  width: string
  padding?: string
  placeholder?: string
  pattern?: string
  type?: string
  list?: string
  min?: string
  max?: string
  needCharacter?: boolean
  children: JSX.Element | React.ReactNode
  beforeSymbol?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
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
  wrap?: string
}

export type CommonForBlocks = {
  pair: [string, string]
  theme: Theme,
  validateField: (needValidate: boolean, value: any) => boolean,
  updateBlockValue: (blockName: string, valueName: string, value: any) => void,
  updateSubBlockValue: (blockName: string, subBlockName: string, valueName: string, value: any) => void,
  updateStopLossAndTakeProfitPrices: (obj: { 
    side?: string,
    price?: number,
    deviationPercentage?: number
    stopLossPercentage?: number
    forcedStopPercentage?: number
    takeProfitPercentage?: number
    leverage?: number
  }) => void,
}

export interface EntryOrderBlockProps extends CommonForBlocks {
  funds: [{ quantity: number, value: number}, { quantity: number, value: number}],
  maxAmount: number
  entryPoint: EntryPointType,
  showErrors: boolean,
  marketType: 0 | 1,
  getMaxValues: () => [number, number],
  setMaxAmount: () => void,
  isMarketType: boolean,
  initialMargin: number,
  pricePrecision: number,
  addAverageTarget: () => void,
  priceForCalculate: number,
  quantityPrecision: number,
  updatePriceToMarket: () => void
  getEntryAlertJson: () => string,
  deleteAverageTarget: (i: number) => void,
  isCloseOrderExternal: boolean,
  isAveragingAfterFirstTarget: boolean,
}

export interface StopLossBlockProps extends CommonForBlocks {
  entryPoint: EntryPointType,
  showErrors: boolean,
  stopLoss: StopLossType,
  isMarketType: boolean,
  priceForCalculate: number,
  pricePrecision: number
  showConfirmationPopup: () => void,
  updateTerminalViewMode: (newMode: string) => void
}

export interface TakeProfitBlockProps extends CommonForBlocks {
  marketType: 0 | 1,
  addTarget: () => void,
  entryPoint: EntryPointType,
  showErrors: boolean,
  takeProfit: TakeProfitType,
  isMarketType: boolean,
  priceForCalculate: number,
  deleteTarget: (i: number) => void
}

export interface TerminalHeaderBlockProps extends CommonForBlocks {
  marketType: 0 | 1,
  entryPoint: EntryPointType,
  isMarketType: boolean,
  initialMargin: number
  selectedKey: SelectedKey
  maxLeverage: number
  startLeverage: number
  componentMarginType: string
  priceForCalculate: number
  quantityPrecision: number
  updateLeverage: (leverage: number, selectedKey: SelectedKey) => void
  changeMarginTypeWithStatus: (marginType: string, selectedKey: SelectedKey, pair: [string, string]) => void
}

export interface SliderWithPriceAndPercentageFieldRowProps extends CommonForBlocks {
  entryPoint: EntryPointType,
  showErrors: boolean,
  stopLoss?: StopLossType,
  isMarketType: boolean,
  priceForCalculate: number,
  pricePrecision: number
  showConfirmationPopup?: () => void,
  updateTerminalViewMode?: (newMode: string) => void
}
