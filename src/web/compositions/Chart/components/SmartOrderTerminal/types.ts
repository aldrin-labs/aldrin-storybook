import { ChangeEvent, CSSProperties } from 'react'

export interface IProps {
  updateTerminalViewMode: (mode: string) => void
}

export interface IState {
  showErrors: boolean
  entryPoint: {
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
  takeProfit: {
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
      deviationPercentage: number
    }
  }
  stopLoss: {
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
  symbol: string
  value: number | string
  width: string
  padding: string
  pattern: string
  type: string
  list: string
  min: string
  needCharacter: boolean
  beforeSymbol: string
  onChange: (e: ChangeEvent) => void
  isDisabled: boolean
  isValid: boolean
  showErrors: boolean
  inputStyles: CSSProperties
}
