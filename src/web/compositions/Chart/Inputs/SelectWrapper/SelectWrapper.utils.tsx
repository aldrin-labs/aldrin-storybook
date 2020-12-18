import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  reverseFor,
  roundAndFormatNumber,
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
  usdcPairsMap,
  usdtPairsMap,
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
  usdcPairsMap: Map<string, string>
  usdtPairsMap: Map<string, string>
  marketType: number
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  let processedData = data

  if (tabSpecificCoin !== '' && tabSpecificCoin !== 'ALL') {
    processedData = processedData.filter((el) =>
      new RegExp(`${tabSpecificCoin}`, 'gi').test(el.symbol)
    )
  }

  if (tab !== 'all') {
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
    if (tab === 'usdc') {
      processedData = processedData.filter(
        (el) =>
          !el.symbol.includes('BULL') &&
          !el.symbol.includes('BEAR') &&
          usdcPairsMap.has(el.symbol) &&
          !el.isCustomUserMarket
      )
    }
    if (tab === 'usdt') {
      processedData = processedData.filter(
        (el) =>
          !el.symbol.includes('BULL') &&
          !el.symbol.includes('BEAR') &&
          usdtPairsMap.has(el.symbol) &&
          !el.isCustomUserMarket
      )
    }
    if (tab === 'leveraged') {
      processedData = processedData.filter(
        (el) => el.symbol.includes('BULL') || el.symbol.includes('BEAR') && !el.isCustomUserMarket
      )
    }

    if (tab === 'private') {
      processedData = processedData.filter((el) => el.isPrivateCustomMarket)
    }
    if (tab === 'public') {
      processedData = processedData.filter(
        (el) => el.isCustomUserMarket && !el.isPrivateCustomMarket
      )
    }
  } else {
    processedData = processedData.filter(
      (el) => !el.isCustomUserMarket
    )
  }

  if (searchValue) {
    processedData = processedData.filter((el) => {
      const underlineInSearch = searchValue.includes('_')
      const symbolBase = el.symbol.split('_')[0]
      const withReplacedWhitespace = searchValue.replace(/\s/g, '_')
      const withRevertedWord = reverseFor(withReplacedWhitespace)

      return new RegExp(`${searchValue}`, 'gi').test(
        underlineInSearch ? el.symbol : symbolBase
      )
    })
  }

  const filtredData = processedData.map((el) => {
    // const {
    //   symbol = '',
    //   price = 0,
    //   price24hChange = 0,
    //   volume24hChange = 0,
    //   pricePrecision: pricePrecisionRaw = 0,
    //   quantityPrecision: quantityPrecisionRaw = 0,
    // } = el || {
    //   symbol: '',
    //   price: 0,
    //   price24hChange: 0,
    //   volume24hChange: 0,
    //   pricePrecision: 0,
    //   quantityPrecision: 0,
    // }

    // const pricePrecision =
    //   pricePrecisionRaw === 0 || pricePrecisionRaw < 0 ? 8 : pricePrecisionRaw
    // const quantityPrecision =
    //   quantityPrecisionRaw === 0 || quantityPrecisionRaw < 0
    //     ? 8
    //     : quantityPrecisionRaw

    const isInFavoriteAlready = favoritePairsMap.has(el.symbol)

    const priceColor = !!previousData ? '' : ''

    const [base, quote] = el.symbol.split('_')
    // console.log('filtredData', el)
    return {
      id: `${el.symbol}`,
      favorite: {
        isSortable: false,
        render: (
          <SvgIcon
            onClick={() =>
              updateFavoritePairsHandler(updateFavoritePairsMutation, el.symbol)
            }
            src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
            width="2rem"
            height="auto"
          />
        ),
      },
      symbol: {
        render: (
          <span>
            {el.symbol}
          </span>
        ),
        onClick: () => onSelectPair({ value: el.symbol, isCustomUserMarket: el.isCustomUserMarket, address: el.address, programId: el.programId, }),
        contentToSort: el.symbol,
      },
      price: {
        contentToSort: +el.closePrice,
        render: (
          <span >
            {formatNumberToUSFormat(stripDigitPlaces(el.closePrice, 2))}
          </span>
        ),
        
        color: priceColor,
      },
      // price24hChange: {
      //   isNumber: true,
      //   render: (
      //     <span
      //       style={{
      //         color:
      //           +el.closePrice === 0
      //             ? ''
      //             : +el.closePrice > 0
      //             ? theme.palette.green.main
      //             : theme.palette.red.main,
      //       }}
      //       
      //     >
      //       {`${formatNumberToUSFormat(stripDigitPlaces(el.closePrice))}%`}
      //     </span>
      //   ),
      //   
      //   contentToSort: +el.closePrice,
      //   color:
      //     +el.closePrice === 0
      //       ? ''
      //       : +el.closePrice > 0
      //       ? theme.customPalette.green.main
      //       : theme.customPalette.red.main,
      // },
      volume24hChange: {
        isNumber: true,
        contentToSort: +el.volume,
        render: (
          <span >
            {`${formatNumberToUSFormat(
              roundAndFormatNumber(el.volume, 2, false)
            )} ${quote}`}
          </span>
        ),
        
      },
      // tradesChange24h: {
      //   isNumber: true,
      //   contentToSort: +el.tradesDiff,
      //   render: (
      //     <span >
      //       {`${formatNumberToUSFormat(
      //         roundAndFormatNumber(el.tradesDiff, 2, false)
      //       )} ${quote}`}
      //     </span>
      //   ),
      //   
      // },
      trades24h: {
        isNumber: true,
        contentToSort: +el.tradesCount,
        render: (
          <span >
            {`${formatNumberToUSFormat(
              roundAndFormatNumber(el.tradesCount, 2, false)
            )} ${quote}`}
          </span>
        ),
        
      },
    }
  })

  return filtredData.sort((a, b) =>
    a.symbol.contentToSort.localeCompare(b.symbol.contentToSort)
  )
}
