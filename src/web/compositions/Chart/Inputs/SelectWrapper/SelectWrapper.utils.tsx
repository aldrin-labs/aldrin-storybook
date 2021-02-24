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

import LessVolumeArrow from '@icons/lessVolumeArrow.svg'
import MoreVolumeArrow from '@icons/moreVolumeArrow.svg'

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

export const getIsNotUSDTQuote = (symbol) => {
  const [base, quote] = symbol.split('_')
  return quote !== 'USDT' && quote !== 'USDC' && !symbol.toLowerCase().includes('all')
}

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
  // updateFavoritePairsMutation,
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
  needFiltrations = true,
}: {
  data: ISelectData
  // updateFavoritePairsMutation: (variableObj: {
  //   variables: {
  //     input: {
  //       favoritePairs: tabSpecificCoin[]
  //     }
  //   }
  // }) => Promise<void>
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
  needFiltrations?: boolean
}) => {
  if (!data && !Array.isArray(data)) {
    return []
  }

  let processedData = data.filter(
    (market, index, arr) =>
      arr.findIndex(
        (marketInFindIndex) => marketInFindIndex.symbol === market.symbol
      ) === index
  )

  if (tabSpecificCoin !== '' && tabSpecificCoin !== 'ALL' && needFiltrations) {
    processedData = processedData.filter((el) =>
      new RegExp(`${tabSpecificCoin}`, 'gi').test(el.symbol)
    )
  }

  if (tab !== 'all' && needFiltrations) {
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
        (el) =>
          el.symbol.includes('BULL') ||
          (el.symbol.includes('BEAR') && !el.isCustomUserMarket)
      )
    }

    if (tab === 'private') {
      processedData = data.filter((el) => el.isPrivateCustomMarket)
    }
    if (tab === 'public') {
      processedData = data.filter(
        (el) => el.isCustomUserMarket && !el.isPrivateCustomMarket
      )
    }
  } else if (needFiltrations) {
    processedData = processedData.filter((el) => !el.isCustomUserMarket)
  }

  if (searchValue) {
    processedData = processedData.filter((el) => {
      let updatedSearchValue = searchValue

      const slashInSearch = updatedSearchValue.includes('/')
      if (slashInSearch)
        updatedSearchValue = updatedSearchValue.replace('/', '_')
      const spaceInSeach = updatedSearchValue.includes(' ')
      if (spaceInSeach)
        updatedSearchValue = updatedSearchValue.replace(' ', '_')
      const dashInSeach = updatedSearchValue.includes(' ')
      if (dashInSeach) updatedSearchValue = updatedSearchValue.replace('-', '_')

      const underlineInSearch = updatedSearchValue.includes('_')

      return new RegExp(`${updatedSearchValue}`, 'gi').test(
        underlineInSearch ? el.symbol : el.symbol.replace('_', '')
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

    const isNotUSDTQuote = getIsNotUSDTQuote(el.symbol)

    // console.log('filtredData', el)
    return {
      id: `${el.symbol}`,
      // favorite: {
      //   isSortable: false,
      //   render: (
      //     <SvgIcon
      //       onClick={() =>
      //         updateFavoritePairsHandler(updateFavoritePairsMutation, el.symbol)
      //       }
      //       src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
      //       width="2rem"
      //       height="auto"
      //     />
      //   ),
      // },
      symbol: {
        render: <span>{el.symbol.replace('_', '/')}</span>,
        onClick: () =>
          onSelectPair({
            value: el.symbol,
            isCustomUserMarket: el.isCustomUserMarket,
            address: el.address,
            programId: el.programId,
          }),
        contentToSort: el.symbol,
        color: theme.palette.dark.main,
      },
      price: {
        contentToSort: +el.closePrice,
        render: (
          <span>
            {formatNumberToUSFormat(stripDigitPlaces(el.closePrice, 2))}
          </span>
        ),

        color: theme.palette.dark.main,
      },
      price24hChange: {
        isNumber: true,
        render: (
          <span
            style={{
              color:
                +el.lastPriceDiff === 0
                  ? ''
                  : +el.lastPriceDiff > 0
                  ? theme.palette.green.main
                  : theme.palette.red.main,
            }}
          >
            {`${formatNumberToUSFormat(stripDigitPlaces(el.lastPriceDiff))}`}
          </span>
        ),

        contentToSort: +el.lastPriceDiff,
        color:
          +el.lastPriceDiff === 0
            ? ''
            : +el.lastPriceDiff > 0
            ? theme.customPalette.green.main
            : theme.customPalette.red.main,
      },
      volume24hChange: {
        isNumber: true,
        contentToSort: +el.volume || 0,
        render: (
          <span>
            {`${isNotUSDTQuote ? '' : '$'}${formatNumberToUSFormat(
              roundAndFormatNumber(el.volume, 2, false)
            )}${isNotUSDTQuote ? ` ${quote}` : ''}`}
          </span>
        ),
      },
      tradesChange24h: {
        isNumber: true,
        render: (
          <span
            style={{
              color:
                +el.precentageTradesDiff === 0
                  ? ''
                  : +el.precentageTradesDiff > 0
                  ? theme.palette.green.main
                  : theme.palette.red.main,
            }}
          >
            {`${
              +el.precentageTradesDiff === 0
                ? ''
                : +el.precentageTradesDiff > 0
                ? '+'
                : '-'
            }${formatNumberToUSFormat(
              stripDigitPlaces(Math.abs(el.precentageTradesDiff))
            )}%`}
          </span>
        ),

        contentToSort: +el.precentageTradesDiff,
        color:
          +el.precentageTradesDiff === 0
            ? ''
            : +el.precentageTradesDiff > 0
            ? theme.customPalette.green.main
            : theme.customPalette.red.main,
      },
      trades24h: {
        isNumber: true,
        contentToSort: +el.tradesCount || 0,
        render: (
          <span>
            {`${formatNumberToUSFormat(
              roundAndFormatNumber(el.tradesCount, 0, false)
            )}`}
          </span>
        ),
      },
      volume24hChangeIcon: {
        render:
          +el.volumeChange > 0 ? (
            <SvgIcon src={MoreVolumeArrow} width="1rem" height="auto" />
          ) : (
            <SvgIcon src={LessVolumeArrow} width="1rem" height="auto" />
          ),
      },
    }
  })

  return filtredData.sort((a, b) =>
    a.symbol.contentToSort.localeCompare(b.symbol.contentToSort)
  )
}
