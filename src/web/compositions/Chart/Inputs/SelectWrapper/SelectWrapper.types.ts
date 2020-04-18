import { Theme } from '@material-ui/core'

export interface IState {
  processedSelectData: {
    id: string
    favorite: any
    pair: any
    price24hChange: any
    volume24hChange: any
  }[]
}

export interface IProps {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType
  onSelectPair: () => void
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
  pair: string
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
