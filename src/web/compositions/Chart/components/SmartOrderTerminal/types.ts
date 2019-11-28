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
      hedgePercentage: number
      // X20
      hedgeIncrease: number
      hedgeSide: 'short' | 'long'
    }
    trailing: {
      isTrailingOn: boolean
      price: number
      deviationPercentage: number
      isHedgeOn: boolean
      hedgePercentage: number
      // X20
      hedgeIncrease: number
      hedgeSide: 'short' | 'long'
    }
  }
  takeProfit: {
    isTakeProfitOn: boolean
    type: 'market' | 'limit'
    splitTarget: {
      pricePercentage: number
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
    trailing: {
      isTrailingOn: boolean
      deviationPercentage: number
    }
    opposite: {
      percentage: number
      side: 'buy' | 'sell'
    }
  }
  stopLoss: {
    isStopLossOn: boolean
    type: 'market' | 'limit'
    pricePercentage: number
    timeout: {
      isTimeoutOn: boolean
      whenProfitOn: boolean
      whenProfitSec: number
      whenProfitableOn: boolean
      whenProfitableSec: number
    }
    forcedStop: {
      pricePercentage: number
    }
    trailing: {
      isTrailingOn: boolean
      deviationPercentage: number
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
