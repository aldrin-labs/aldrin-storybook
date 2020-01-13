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
    isHedgeOn: boolean
    hedgePrice: number
    hedgeIncrease: number | string
    hedgeSide: 'short' | 'long'
  }
  trailing: {
    isTrailingOn: boolean
    deviationPercentage: number
  }
}

export type TakeProfitType = {
  isTakeProfitOn: boolean
  type: 'market' | 'limit'
  pricePercentage: number
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
}

export type StopLossType = {
  isStopLossOn: boolean
  type: 'market' | 'limit'
  pricePercentage: number
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
  }
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
