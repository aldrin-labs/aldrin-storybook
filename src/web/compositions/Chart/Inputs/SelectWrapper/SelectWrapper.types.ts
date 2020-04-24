import { Theme } from '@material-ui/core'

export type SelectTabType = 'favorite' | 'btc' | 'alts' | 'fiat' | 'all'

export interface IState {
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
}

export interface IProps {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  stableCoinsPairsMap: Map<string, string>
  btcCoinsPairsMap: Map<string, string>
  altCoinsPairsMap: Map<string, string>
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType
  onSelectPair: ({ value }: { value: string }) => Promise<void>
  theme: Theme
  closeMenu: () => void
  marketType: 0 | 1
}

export interface IPropsSelectPairListComponent extends IProps {
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
  onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTabChange: (tab: SelectTabType) => void
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
