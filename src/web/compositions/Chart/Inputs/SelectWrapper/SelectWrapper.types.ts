import { Theme } from '@material-ui/core'
import { IExchange, IGetMarketsByExchangeQuery } from '@core/types/ChartTypes'

import { marketsByCategories } from '@core/config/marketsByCategories'
import { ITheme } from '../../../../types/materialUI'
import { TokenInfo } from '@solana/spl-token-registry'

export enum UserTabs {
  favourite = 'favourite',
  solanaNative = 'solanaNative',
  all = 'all',
  usdt = 'usdt',
  usdc = 'usdc',
  sol = 'sol',
  topGainers = 'topGainers',
  topLosers = 'topLosers',
  leveraged = 'leveraged',
  customMarkets = 'customMarkets',
}

export type SelectTabType = keyof typeof UserTabs | keyof typeof marketsByCategories

export interface IState {
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
}

export interface IProps {
  id: string
  marketsByExchangeQuery: IGetMarketsByExchangeQuery
  getSelectorSettingsQuery: {
    getAccountSettings: {
      selectorSettings: {
        favoritePairs: string[]
      }
    }
  }
  getSerumMarketDataQuery: {
    getSerumMarketData: ISelectData
  }
  onSelectPair: (pair: { value: string }) => Promise<void>
  theme: ITheme
  closeMenu: () => void
  marketType: 0 | 1
  activeExchange: IExchange
}

export interface IPropsSelectPairListComponent extends IProps {
  data: ISelectData
  favouritePairs: Set<string>
  searchValue: string
  tab: SelectTabType
  selectorMode: string
  setSelectorMode: (mode: string) => void
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTabChange: (tab: SelectTabType) => void
  toggleFavouriteMarket: (pair: string) => void
  id: string
}

export interface ProcessedItem {
  id: string
  favorite: any
  symbol: any
  price24hChange: any
  volume24hChange: any
}

export interface IStateSelectPairListComponent {
  processedSelectData: ProcessedItem[]
}

export type GetSelectorSettingsType = {
  getAccountSettings: {
    selectorSettings: {
      favoritePairs: string[]
    }
  }
}

export interface ISelectDataItem {
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
}

export interface ISelectUIDataItem extends ISelectDataItem {
  base: string
  quote: string
  marketName: string
  marketAddress?: string
  favourite: boolean
  mint: string | null
  isAwesomeMarket: boolean
  baseTokenInfo?: TokenInfo
  closePrice: number
  pricePrecision: number
  twitterLink: string
  marketCapLink: string
}

export type ISelectData = ISelectDataItem[]

export type UpdateFavoritePairsMutationType = (variableObj: {
  variables: {
    input: {
      favoritePairs: string[]
    }
  }
}) => Promise<void>
