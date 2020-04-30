import { Theme } from '@material-ui/core'
import { IExchange, IGetMarketsByExchangeQuery } from '@core/types/ChartTypes'

export type SelectTabType = 'favorite' | 'btc' | 'alts' | 'fiat' | 'all'

export interface IState {
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
}

export interface IProps {
  marketsByExchangeQuery: IGetMarketsByExchangeQuery
  getSelectorSettingsQuery: {
    getAccountSettings: {
      selectorSettings: {
        favoritePairs: string[]
      }
    }
  }
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType
  onSelectPair: ({ value }: { value: string }) => Promise<void>
  theme: Theme
  closeMenu: () => void
  marketType: number | 0 | 1
  activeExchange: IExchange
}

export interface IPropsSelectPairListComponent extends IProps {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  stableCoinsPairsMap: Map<string, string>
  btcCoinsPairsMap: Map<string, string>
  altCoinsPairsMap: Map<string, string>
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTabChange: (tab: SelectTabType) => void
  onSpecificCoinChange: ({ value }: { value: string }) => void
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
  price: number
  price24hChange: number
  volume24hChange: number
}[]

export type UpdateFavoritePairsMutationType = (variableObj: {
  variables: {
    input: {
      favoritePairs: string[]
    }
  }
}) => Promise<void>
