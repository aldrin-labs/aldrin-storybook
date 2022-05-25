import { Theme } from '@material-ui/core'
import { IExchange, IGetMarketsByExchangeQuery } from '@core/types/ChartTypes'

export type SelectTabType =
  | 'favourite'
  | 'solanaNative'
  | 'all'
  | 'usdt'
  | 'usdc'
  | 'sol'
  | 'topGainers'
  | 'topLosers'
  | 'leveraged'
  | 'customMarkets'

export interface IState {
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
}

export interface IProps {
  getSerumMarketDataQuery: {
    getSerumMarketData: [{ symbol: string }]
  }
  marketsByExchangeQuery: IGetMarketsByExchangeQuery
  getSelectorSettingsQuery: {
    getAccountSettings: {
      selectorSettings: {
        favoritePairs: string[]
      }
    }
  }
  onSelectPair: ({ value }: { value: string }) => Promise<void>
  theme: Theme
  closeMenu: () => void
  marketType: number | 0 | 1
  activeExchange: IExchange
}

export interface IPropsSelectPairListComponent extends IProps {
  data: ISelectData
  favouriteMarkets: string[]
  searchValue: string
  tab: SelectTabType
  selectorMode: string
  setSelectorMode: (mode: string) => void
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTabChange: (tab: SelectTabType) => void
  toggleFavouriteMarket: (pair: string) => void
}

export interface IStateSelectPairListComponent {
  processedSelectData: {
    id: string
    favorite: any
    symbol: any
    price24hChange: any
    volume24hChange: any
  }[]
}

export type GetSelectorSettingsType = {
  getAccountSettings: {
    selectorSettings: {
      favoritePairs: string[]
    }
  }
}

export type ISelectData = {
  symbol: string
  volume: number
  tradesCount: number
  tradesDiff: number
  volumeChange: number
  minPrice: number
  maxPrice: number
  closePrice: number
  precentageTradesDiff: number
  lastPriceDiff: number
  isCustomUserMarket: boolean
  isPrivateCustomMarket: boolean
  address: string
  programId: string
}[]

export type UpdateFavoritePairsMutationType = (variableObj: {
  variables: {
    input: {
      favoritePairs: string[]
    }
  }
}) => Promise<void>
