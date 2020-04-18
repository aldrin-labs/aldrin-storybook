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
  { label: 'Pair', id: 'pair' },
  { label: 'Last price', id: 'lastPrice' },
  { label: '24H change', id: '24hChange' },
  { label: '24H volume', id: '24hVolume' },
]

export const getUpdatedFavoritePairsList = (
  clonedData: GetSelectorSettingsType,
  pair: string
) => {
  const {
    getAccountSettings: {
      selectorSettings: { favoritePairs },
    },
  } = clonedData

  let updatedList
  const isAlreadyInTheList = favoritePairs.find((el) => el === pair)
  if (isAlreadyInTheList) {
    updatedList = favoritePairs.filter((el) => el !== pair)
  } else {
    updatedList = [...favoritePairs, pair]
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
        },
      },
    },
  })
}

export const updateFavoritePairsHandler = async (
  updateFavoritePairs: UpdateFavoritePairsMutationType,
  pair: string
) => {
  const favoritePairsData = client.readQuery(getSelectorSettings)
  const clonedData = JSON.parse(JSON.stringify(favoritePairsData))

  const updatedFavoritePairsList = getUpdatedFavoritePairsList(clonedData, pair)

  updateFavoritePairsCache(clonedData, updatedFavoritePairsList)

  try {
    await updateFavoritePairs({
      variables: { input: { favoritePairs: updatedFavoritePairsList } },
    })
  } catch (e) {
    console.log('update favorite pairs failed')
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
  onSelectPair: () => void
  theme: any
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  const processedData = data.map((el) => {
    const {
      pair = '',
      price = 0,
      price24hChange = 0,
      volume24hChange = 0,
    } = el || {
      pair: '',
      price: 0,
      price24hChange: 0,
      volume24hChange: 0,
    }

    const isInFavoriteAlready = favoritePairsMap.has(pair)

    const priceColor = !!previousData ? '' : ''

    return {
      id: `${pair}`,
      favorite: {
        render: (
          <SvgIcon
            onClick={() =>
              updateFavoritePairsHandler(updateFavoritePairsMutation, pair)
            }
            src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
            width="1rem"
            height="auto"
          />
        ),
      },
      pair: {
        render: pair,
        onClick: onSelectPair,
      },
      price: {
        render: price,
        onClick: onSelectPair,
        style: { color: priceColor },
      },
      price24hChange: {
        render: price24hChange,
        onClick: onSelectPair,
      },
      volume24hChange: {
        render: volume24hChange,
        onClick: onSelectPair,
      },
    }
  })

  return processedData
}
