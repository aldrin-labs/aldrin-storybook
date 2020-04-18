import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'

import favoriteSelected from '@icons/favoriteSelected.svg'
import favoriteUnselected from '@icons/favoriteUnselected.svg'

import {
  GetSelectorSettingsType,
  ISelectData,
  UpdateFavoritePairsMutationType,
} from './SelectWrapper.types'

export const selectWrapperColumnNames = [
  { label: '', id: 'favorite', isSortable: false },
  { label: 'Pair', id: 'symbol' },
  { label: 'Last price', id: 'lastPrice' },
  { label: '24H change', id: '24hChange' },
  { label: '24H volume', id: '24hVolume' },
]

export const getUpdatedFavoritePairsList = (
  clonedData: GetSelectorSettingsType,
  symbol: string
) => {
  const {
    getAccountSettings: {
      selectorSettings: { favoritePairs },
    },
  } = clonedData

  let updatedList
  const isAlreadyInTheList = favoritePairs.find((el) => el === symbol)
  if (isAlreadyInTheList) {
    updatedList = favoritePairs.filter((el) => el !== symbol)
  } else {
    updatedList = [...favoritePairs, symbol]
  }

  return updatedList
}

export const updateFavoritePairsCache = (
  clonedData: GetSelectorSettingsType,
  updatedFavoritePairsList: string[]
) => {
  client.writeQuery({
    query: getSelectorSettings,
    data: {
      getAccountSettings: {
        selectorSettings: {
          favoritePairs: updatedFavoritePairsList,
          __typename: 'AccountSettingsSelectorSettings',
        },
        __typename: 'AccountSettings',
      },
    },
  })
}

export const updateFavoritePairsHandler = async (
  updateFavoritePairsMutation: UpdateFavoritePairsMutationType,
  symbol: string
) => {
  const favoritePairsData = client.readQuery({ query: getSelectorSettings })
  const clonedData = JSON.parse(JSON.stringify(favoritePairsData))
  const updatedFavoritePairsList = getUpdatedFavoritePairsList(
    clonedData,
    symbol
  )

  updateFavoritePairsCache(clonedData, updatedFavoritePairsList)

  try {
    await updateFavoritePairsMutation({
      variables: { input: { favoritePairs: updatedFavoritePairsList } },
    })
  } catch (e) {
    console.log('update favorite symbols failed')
  }
}

export const combineSelectWrapperData = ({
  data,
  favoritePairsMap,
  updateFavoritePairsMutation,
  previousData,
  onSelectPair,
  theme,
}: {
  data: ISelectData
  favoritePairsMap: Map<string, string>
  updateFavoritePairsMutation: (variableObj: {
    variables: {
      input: {
        favoritePairs: string[]
      }
    }
  }) => Promise<void>
  previousData?: ISelectData
  onSelectPair: ({ value }: { value: string }) => void
  theme: any
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const processedData = data.map((el) => {
    const {
      symbol = '',
      price = 0,
      price24hChange = 0,
      volume24hChange = 0,
    } = el || {
      symbol: '',
      price: 0,
      price24hChange: 0,
      volume24hChange: 0,
    }

    const isInFavoriteAlready = favoritePairsMap.has(symbol)

    const priceColor = !!previousData ? '' : ''

    return {
      id: `${symbol}`,
      favorite: {
        render: (
          <SvgIcon
            onClick={() =>
              updateFavoritePairsHandler(updateFavoritePairsMutation, symbol)
            }
            src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
            width="1rem"
            height="auto"
          />
        ),
      },
      symbol: {
        render: symbol,
        onClick: () => onSelectPair({ value: symbol }),
      },
      price: {
        render: price,
        onClick: () => onSelectPair({ value: symbol }),
        style: { color: priceColor },
      },
      price24hChange: {
        render: price24hChange,
        onClick: () => onSelectPair({ value: symbol }),
      },
      volume24hChange: {
        render: volume24hChange,
        onClick: () => onSelectPair({ value: symbol }),
      },
    }
  })

  return processedData
}
