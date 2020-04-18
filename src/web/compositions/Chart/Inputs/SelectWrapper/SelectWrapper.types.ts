import { Theme } from '@material-ui/core'

export interface IState {
  processedSelectData: {
    id: string
    favorite: any
    symbol: any
    price24hChange: any
    volume24hChange: any
  }[]
}

export interface IProps {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType
  onSelectPair: ({ value }: { value: string }) => Promise<void>
  theme: Theme
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
