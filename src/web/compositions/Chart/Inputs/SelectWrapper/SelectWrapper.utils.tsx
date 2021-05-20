import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  reverseFor,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'

import GreenCheckmark from '@icons/successIcon.svg'

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
  return (
    quote !== 'USDT' &&
    quote !== 'USDC' &&
    !symbol.toLowerCase().includes('all')
  )
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

export const filterDataBySymbolForDifferentDeviders = ({
  searchValue,
  symbol,
}: {
  searchValue: string
  symbol: string
}) => {
  if (searchValue) {
    let updatedSearchValue = searchValue

    const slashInSearch = updatedSearchValue.includes('/')
    if (slashInSearch) updatedSearchValue = updatedSearchValue.replace('/', '_')

    const spaceInSeach = updatedSearchValue.includes(' ')
    if (spaceInSeach) updatedSearchValue = updatedSearchValue.replace(' ', '_')

    const dashInSeach = updatedSearchValue.includes('-')
    if (dashInSeach) updatedSearchValue = updatedSearchValue.replace('-', '_')

    const underlineInSearch = updatedSearchValue.includes('_')

    return new RegExp(`${updatedSearchValue}`, 'gi').test(
      underlineInSearch ? symbol : symbol.replace('_', '')
    )
  }

  return true
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
  customMarkets,
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

  processedData = processedData.filter((el) =>
    filterDataBySymbolForDifferentDeviders({ searchValue, symbol: el.symbol })
  )

  const filtredData = processedData.map((el) => {
    const {
      symbol = '',
      closePrice = 0,
      lastPriceDiff = 0,
      volume = 0,
      precentageTradesDiff = 0,
      tradesCount = 0,
      volumeChange = 0,
      address = '',
      programId = '',
      isCustomUserMarket,
      isPrivateCustomMarket,
    } = el || {
      symbol: '',
      closePrice: 0,
      lastPriceDiff: 0,
      volume: 0,
      precentageTradesDiff: 0,
      tradesCount: 0,
      volumeChange: 0,
      address: '',
      programId: '',
      isCustomUserMarket,
      isPrivateCustomMarket,
    }

    const [_, quote] = symbol.split('_')
    const pricePrecision = closePrice < 1 ? 8 : closePrice < 10 ? 4 : 2

    const isNotUSDTQuote = getIsNotUSDTQuote(symbol)

    const strippedLastPriceDiff = +stripDigitPlaces(
      lastPriceDiff,
      pricePrecision
    )

    const strippedMarkPrice = +stripDigitPlaces(closePrice, pricePrecision)

    const prevClosePrice = strippedMarkPrice - strippedLastPriceDiff

    const priceChangePercentage = !prevClosePrice
      ? 0
      : (closePrice - prevClosePrice) / (prevClosePrice / 100)

    const sign24hChange = +priceChangePercentage > 0 ? `+` : ``
    const signTrades24hChange = +precentageTradesDiff > 0 ? '+' : '-'

    const marketName = symbol.replace('_', '/')
    const currentMarket = customMarkets?.find((el) => el?.name === marketName)

    const isAdditionalCustomUserMarket =
      currentMarket?.isPrivateCustomMarket !== undefined
    const isAwesomeMarket = currentMarket?.isCustomUserMarket

    return {
      id: `${symbol}`,
      // favorite: {
      //   isSortable: false,
      //   render: (
      //     <SvgIcon
      //       onClick={() =>
      //         updateFavoritePairsHandler(updateFavoritePairsMutation, symbol)
      //       }
      //       src={isInFavoriteAlready ? favoriteSelected : favoriteUnselected}
      //       width="2rem"
      //       height="auto"
      //     />
      //   ),
      // },
      emoji: {
        render: (
          <DarkTooltip
            title={
              isAdditionalCustomUserMarket
                ? 'This is an unofficial custom market. Use at your own risk.'
                : isAwesomeMarket
                ? 'This is curated but unofficial market.'
                : 'This is the official Serum market.'
            }
          >
            <div
              style={{
                width: '4rem',
                fontSize: '2rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isAdditionalCustomUserMarket ? (
                '⚠️'
              ) : isAwesomeMarket ? (
                '🤔'
              ) : (
                <SvgIcon width={'50%'} height={'auto'} src={GreenCheckmark} />
              )}
            </div>
          </DarkTooltip>
        ),
      },
      symbol: {
        render: <span>{symbol.replace('_', '/')}</span>,
        onClick: () =>
          onSelectPair({
            value: symbol,
            address,
            programId,
          }),
        contentToSort: symbol,
        color: theme.palette.dark.main,
      },
      price: {
        contentToSort: +closePrice,
        render: (
          <span>
            {formatNumberToUSFormat(
              stripDigitPlaces(closePrice, pricePrecision)
            )}
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
                +lastPriceDiff === 0
                  ? ''
                  : +lastPriceDiff > 0
                  ? theme.palette.green.main
                  : theme.palette.red.main,
            }}
          >
            {`${sign24hChange}${formatNumberToUSFormat(
              stripDigitPlaces(lastPriceDiff, pricePrecision)
            )} / ${sign24hChange}${formatNumberToUSFormat(
              stripDigitPlaces(priceChangePercentage, 2)
            )}%`}
          </span>
        ),

        contentToSort: +priceChangePercentage,
      },
      volume24hChange: {
        isNumber: true,
        contentToSort: +volume || 0,
        render: (
          <span>
            {`${isNotUSDTQuote ? '' : '$'}${formatNumberToUSFormat(
              roundAndFormatNumber(volume, 2, false)
            )}${isNotUSDTQuote ? ` ${quote}` : ''}`}
          </span>
        ),
      },
      trades24h: {
        isNumber: true,
        contentToSort: +tradesCount || 0,
        render: (
          <>
            <span>
              {`${formatNumberToUSFormat(
                roundAndFormatNumber(tradesCount, 0, false)
              )} / `}
            </span>
            <span
              style={{
                color:
                  +precentageTradesDiff === 0
                    ? ''
                    : +precentageTradesDiff > 0
                    ? theme.palette.green.main
                    : theme.palette.red.main,
              }}
            >
              {`${signTrades24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(Math.abs(precentageTradesDiff))
              )}%`}
            </span>
          </>
        ),
      },
      volume24hChangeIcon: {
        render:
          +volumeChange > 0 ? (
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
