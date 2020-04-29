import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  reverseFor,
} from '@core/utils/PortfolioTableUtils'

import favoriteSelected from '@icons/favoriteSelected.svg'
import favoriteUnselected from '@icons/favoriteUnselected.svg'

import {
  GetSelectorSettingsType,
  ISelectData,
  UpdateFavoritePairsMutationType,
  SelectTabType,
} from './SelectWrapper.types'

export const selectWrapperColumnNames = [
  { label: '', id: 'favorite', isSortable: false },
  { label: 'Pair', id: 'symbol', isSortable: true },
  { label: 'Last price', id: 'lastPrice', isSortable: true },
  { label: '24H change', id: '24hChange', isNumber: true, isSortable: true },
  { label: '24H volume', id: '24hVolume', isNumber: true, isSortable: true },
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
  updateFavoritePairsMutation,
  previousData,
  onSelectPair,
  theme,
  searchValue,
  tab,
  tabSpecificCoin,
  stableCoinsPairsMap,
  btcCoinsPairsMap,
  altCoinsPairsMap,
  favoritePairsMap,
  marketType,
}: {
  data: ISelectData
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
  searchValue: string
  tab: SelectTabType
  tabSpecificCoin: string
  favoritePairsMap: Map<string, string>
  stableCoinsPairsMap: Map<string, string>
  btcCoinsPairsMap: Map<string, string>
  altCoinsPairsMap: Map<string, string>
  marketType: number
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  let processedData = data

  if (searchValue) {
    processedData = processedData.filter((el) => {
      const withReplacedWhitespace = searchValue.replace(/\s/g, '_')
      const withRevertedWord = reverseFor(withReplacedWhitespace)

      return new RegExp(
        `${searchValue}|${withReplacedWhitespace}|${withRevertedWord}`,
        'gi'
      ).test(el.symbol)
    })
  }

  if (
    searchValue === '' &&
    (tabSpecificCoin !== '' && tabSpecificCoin !== 'ALL')
  ) {
    processedData = processedData.filter((el) =>
      new RegExp(`${tabSpecificCoin}`, 'gi').test(el.symbol)
    )
  }

  if (searchValue === '' && tab !== 'all') {
    if (tab === 'alts') {
      processedData = processedData.filter((el) =>
        altCoinsPairsMap.has(el.symbol)
      )
    }
    if (tab === 'btc') {
      processedData = processedData.filter((el) =>
        btcCoinsPairsMap.has(el.symbol)
      )
    }
    if (tab === 'fiat') {
      processedData = processedData.filter((el) =>
        stableCoinsPairsMap.has(el.symbol)
      )
    }
    if (tab === 'favorite') {
      processedData = processedData.filter((el) =>
        favoritePairsMap.has(el.symbol)
      )
    }
  }

  const filtredData = processedData.map((el) => {
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

    const [base, quote] = symbol.split('_')

    return {
      id: `${symbol}`,
      favorite: {
        isSortable: false,
        render: (
          <SvgIcon
            onClick={() =>
              updateFavoritePairsHandler(updateFavoritePairsMutation, symbol)
            }
            src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
            width="2rem"
            height="auto"
          />
        ),
      },
      symbol: {
        render: (
          <span onClick={() => onSelectPair({ value: symbol })}>{symbol}</span>
        ),
        onClick: () => onSelectPair({ value: symbol }),
        contentToSort: symbol,
      },
      price: {
        contentToSort: +price,
        render: (
          <span onClick={() => onSelectPair({ value: symbol })}>
            {formatNumberToUSFormat(price)}
          </span>
        ),
        // onClick: () => onSelectPair({ value: symbol }),
        // color: priceColor,
      },
      price24hChange: {
        isNumber: true,
        render: (
          <span
            style={{
              color:
                +price24hChange === 0
                  ? ''
                  : +price24hChange > 0
                  ? theme.customPalette.green.main
                  : theme.customPalette.red.main,
            }}
            onClick={() => onSelectPair({ value: symbol })}
          >
            {`${formatNumberToUSFormat(stripDigitPlaces(price24hChange))}%`}
          </span>
        ),
        // onClick: () => onSelectPair({ value: symbol }),
        contentToSort: +price24hChange,
        // color:
        //   +price24hChange === 0
        //     ? ''
        //     : +price24hChange > 0
        //     ? theme.customPalette.green.main
        //     : theme.customPalette.red.main,
      },
      volume24hChange: {
        isNumber: true,
        contentToSort: +volume24hChange,
        render: (
          <span onClick={() => onSelectPair({ value: symbol })}>
            {`${formatNumberToUSFormat(
              stripDigitPlaces(volume24hChange, marketType === 0 ? 2 : 3)
            )} ${marketType === 0 ? quote : base}`}
          </span>
        ),
        // onClick: () => onSelectPair({ value: symbol }),
      },
    }
  })

  return filtredData
}
