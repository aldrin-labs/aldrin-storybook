export interface IProps {
  updateTerminalViewMode: (mode: string) => void
}

export interface IState {
  entryPoint: {
    order: {
      type: 'market' | 'limit'
      side: 'buy' | 'sell'
      price: number
      amount: number
      total: number
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
      whenProfitSec: number
      whenProfitableOn: boolean
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
      whenLossSec: number
      whenLossableOn: boolean
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
