import {
  Key,
  CancelOrderMutationType,
  ShowCancelResultFunction,
  FundsType,
  IResult,
} from '@core/types/ChartTypes'
import { DefaultTheme } from 'styled-components'

export interface IDataWrapperProps {
  activeExchange: {
    name: string
    symbol: string
  }
  pair: [string, string]
  selectedKey: Key
  showCancelResult: ShowCancelResultFunction
  showOrderResult: (
    result: IResult,
    cancelOrderFunction: (arg: any) => void
  ) => null
}

export interface IProps extends IDataWrapperProps {
  newTheme: DefaultTheme
  cancelOrderMutation: CancelOrderMutationType
  marketType: 0 | 1
  getTerminalDataQuery: {
    getPrice: number
    assetBySymbolFirst: {
      decimals: number
    }
    assetBySymbolSecond: {
      decimals: number
    }
  }
  getFundsQuery: {
    getFunds: FundsType[]
    subscribeToMoreFunction: () => () => void
  }
  getPriceQuery: {
    getPrice: number
    subscribeToMoreFunction: () => () => void
  }
  createOrderMutation: (createOrder: any) => any
  getStrategySettingsQuery: {
    getStrategySettings: {
      spot: any | null
      futures: any | null
    }
  }
  updateStrategySettingsMutation: (arg : {
    variables: {
      input: {
        marketType: 0 | 1
        entryOrder: any
        stopLoss: any
        takeProfit: any
      }
    }
  }) => Promise<any>
}
