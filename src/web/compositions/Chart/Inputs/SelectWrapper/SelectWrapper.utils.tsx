import React from 'react'

import { SvgIcon } from '@sb/components'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import { formatNumberWithSpaces } from '@sb/dexUtils/utils'

import stableCoins from '@core/config/stableCoins'
import {
  getNumberOfDecimalsFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import {
  roundAndFormatNumber,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import favouriteSelected from '@icons/favouriteSelected.svg'
import favouriteUnselected from '@icons/favouriteUnselected.svg'
import LessVolumeArrow from '@icons/lessVolumeArrow.svg'
import MoreVolumeArrow from '@icons/moreVolumeArrow.svg'

import { DEX_PID, FORK_DEX_PID } from '../../../../../../../core/src/config/dex'
import { ISelectData, SelectTabType } from './SelectWrapper.types'
import {
  IconContainer,
  StyledColumn,
  StyledRow,
  StyledSymbol,
  StyledTokenName,
} from './SelectWrapperStyles'

export const filterNativeSolanaMarkets = (data, tokenMap) =>
  data.filter((el) => {
    const [base] = el.symbol.split('_')
    const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))

    return !baseTokenInfo?.name?.includes('Wrapped')
  })

const FORK_PK = FORK_DEX_PID.toString()
const LEGACY_SERUM_PK = DEX_PID.toString()
export const filterSelectorDataByTab = ({
  tab,
  data,
  tokenMap,
  allMarketsMap,
  favouriteMarkets,
}: {
  tab: SelectTabType
  data: ISelectData
  allMarketsMap: Map<string, any>
  tokenMap: Map<string, any>
  favouriteMarkets: string[]
}) => {
  const processedData = [...data]
  if (tab === 'live') {
    return processedData.filter((el) => {
      return el.programId?.toString() === FORK_PK
    })
  }

  return processedData.filter(
    (el) => el.programId?.toString() === LEGACY_SERUM_PK
  )

  // const { usdcPairsMap, usdtPairsMap } = getMarketsMapsByCoins(data)

  // const marketsCategoriesData = Object.entries(marketsByCategories)

  // if (tab !== 'all') {
  //   if (tab === 'favourite') {
  //     processedData = processedData.filter((el) =>
  //       favouriteMarkets.includes(el.symbol)
  //     )
  //   }
  //   if (tab === 'usdc') {
  //     processedData = processedData.filter(
  //       (el) =>
  //         !el.symbol.includes('BULL') &&
  //         !el.symbol.includes('BEAR') &&
  //         usdcPairsMap.has(el.symbol)
  //     )
  //   }

  //   if (tab === 'usdt') {
  //     processedData = processedData.filter(
  //       (el) =>
  //         !el.symbol.includes('BULL') &&
  //         !el.symbol.includes('BEAR') &&
  //         usdtPairsMap.has(el.symbol)
  //     )
  //   }

  //   if (tab === 'sol') {
  //     processedData = processedData.filter((el) => {
  //       const [_, quote] = el.symbol.split('_')
  //       return quote === 'SOL'
  //     })
  //   }

  //   if (tab === 'solanaNative') {
  //     processedData = processedData.filter((el) => {
  //       const [base] = el.symbol.split('_')
  //       const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))

  //       return !baseTokenInfo?.name?.includes('Wrapped')
  //     })
  //   }

  //   marketsCategoriesData?.forEach(([category, data]) => {
  //     const { tokens } = data

  //     if (tab === category) {
  //       processedData = processedData.filter((el) => {
  //         const [base] = el.symbol.split('_')
  //         return tokens.includes(base)
  //       })
  //     }
  //   })

  //   if (tab === 'leveraged') {
  //     processedData = processedData.filter(
  //       (el) => el.symbol.includes('BULL') || el.symbol.includes('BEAR')
  //     )
  //   }

  //   if (tab === 'topGainers' || tab === 'topLosers') {
  //     processedData = processedData.sort((a, b) => {
  //       const pricePrecisionA = getNumberOfDecimalsFromNumber(a.closePrice)

  //       const strippedLastPriceDiffA = +stripDigitPlaces(
  //         a.lastPriceDiff,
  //         pricePrecisionA
  //       )

  //       const strippedMarkPriceA = +stripDigitPlaces(
  //         a.closePrice,
  //         pricePrecisionA
  //       )

  //       const prevClosePriceA = strippedMarkPriceA - strippedLastPriceDiffA

  //       const priceChangePercentageA = !prevClosePriceA
  //         ? 0
  //         : (a.closePrice - prevClosePriceA) / (prevClosePriceA / 100)

  //       const pricePrecisionB = getNumberOfDecimalsFromNumber(b.closePrice)

  //       const strippedLastPriceDiffB = +stripDigitPlaces(
  //         b.lastPriceDiff,
  //         pricePrecisionB
  //       )

  //       const strippedMarkPriceB = +stripDigitPlaces(
  //         b.closePrice,
  //         pricePrecisionB
  //       )

  //       const prevClosePriceB = strippedMarkPriceB - strippedLastPriceDiffB

  //       const priceChangePercentageB = !prevClosePriceB
  //         ? 0
  //         : (b.closePrice - prevClosePriceB) / (prevClosePriceB / 100)

  //       return tab === 'topGainers'
  //         ? priceChangePercentageB - priceChangePercentageA
  //         : priceChangePercentageA - priceChangePercentageB
  //     })
  //   }

  //   if (tab === 'customMarkets') {
  //     processedData = data.filter(
  //       (el) =>
  //         allMarketsMap.has(el.symbol) &&
  //         allMarketsMap.get(el.symbol).isCustomUserMarket
  //     )
  //   } else {
  //     processedData = processedData.filter((el) => !el.isCustomUserMarket)
  //   }
  // } else {
  //   processedData = processedData.filter((el) => !el.isCustomUserMarket)
  // }

  // return processedData
}

export const filterDataBySymbolForDifferentDividers = ({
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

export const getIsNotUSDTQuote = (symbol) => {
  const [base, quote] = symbol.split('_')
  return (
    quote !== 'USDT' &&
    quote !== 'USDC' &&
    !symbol.toLowerCase().includes('all')
  )
}

export const getMarketsMapsByCoins = (markets) => {
  const stableCoinsRegexp = new RegExp(stableCoins.join('|'), 'g')
  const altCoinsRegexp = new RegExp(`${stableCoins.join('|')}|BTC`, 'g')

  const altCoinsPairsMap = new Map()
  const stableCoinsPairsMap = new Map()
  const btcCoinsPairsMap = new Map()
  const usdcPairsMap = new Map()
  const usdtPairsMap = new Map()

  markets.forEach((el) => {
    if (
      stableCoinsRegexp.test(el.symbol.split('_')[0]) ||
      stableCoinsRegexp.test(el.symbol.split('_')[1])
    ) {
      stableCoinsPairsMap.set(el.symbol, el.price)
    }

    if (
      /BTC/g.test(el.symbol.split('_')[1]) &&
      !stableCoinsRegexp.test(el.symbol.split('_')[0]) &&
      !stableCoinsRegexp.test(el.symbol.split('_')[1])
    ) {
      btcCoinsPairsMap.set(el.symbol, el.price)
    }
    if (
      /USDC/g.test(el.symbol.split('_')[0]) ||
      /USDC/g.test(el.symbol.split('_')[1])
    ) {
      usdcPairsMap.set(el.symbol, el.price)
    }
    if (
      /USDT/g.test(el.symbol.split('_')[0]) ||
      /USDT/g.test(el.symbol.split('_')[1])
    ) {
      usdtPairsMap.set(el.symbol, el.price)
    }
    if (
      !altCoinsRegexp.test(el.symbol) &&
      !stableCoinsRegexp.test(el.symbol.split('_')[0]) &&
      !stableCoinsRegexp.test(el.symbol.split('_')[1])
    ) {
      altCoinsPairsMap.set(el.symbol, el.price)
    }
  })

  return {
    altCoinsPairsMap,
    stableCoinsPairsMap,
    btcCoinsPairsMap,
    usdcPairsMap,
    usdtPairsMap,
  }
}

const FavouriteIcon = ({ symbol, onChange, value }) => {
  return (
    <SvgIcon
      onClick={(e) => {
        e.stopPropagation()
        onChange(symbol)
      }}
      src={value ? favouriteSelected : favouriteUnselected}
      width="2.5rem"
      height="auto"
    />
  )
}

export const combineSelectWrapperData = ({
  data,
  onSelectPair,
  theme,
  tab,
  favouriteMarkets,
  tokenMap,
  searchValue,
  serumMarketsDataMap,
  allMarketsMap,
  setIsMintsPopupOpen,
  changeChoosenMarketData,
  toggleFavouriteMarket,
}: {
  data: ISelectData
  searchValue: string
  onSelectPair: ({ value }: { value: string }) => void
  theme: any
  tab: SelectTabType
  favouriteMarkets: string[]
  allMarketsMap: Map<string, any>
  tokenMap: Map<string, any>
  serumMarketsDataMap: Map<string, any>
  changeChoosenMarketData: ({
    symbol,
    marketAddress,
  }: {
    symbol: string
    marketAddress: string
  }) => void
  setIsMintsPopupOpen: (isOpen: boolean) => void
  toggleFavouriteMarket: (pair: string) => void
}) => {
  let filteredData = data.filter((item) =>
    filterDataBySymbolForDifferentDividers({ searchValue, symbol: item.symbol })
  )

  filteredData = filterSelectorDataByTab({
    tab,
    data: filteredData,
    allMarketsMap,
    favouriteMarkets,
    tokenMap,
  })

  return filteredData
    .filter((item) => item.symbol !== 'CCAI_USDC')
    .map((item) => {
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
        minPrice = 0,
        maxPrice = 0,
      } = item || {
        symbol: '',
        closePrice: 0,
        lastPriceDiff: 0,
        volume: 0,
        precentageTradesDiff: 0,
        tradesCount: 0,
        volumeChange: 0,
        address: '',
        programId: '',
        minPrice: 0,
        maxPrice: 0,
      }

      const [base, quote] = symbol.split('_')
      const pricePrecision = getNumberOfDecimalsFromNumber(closePrice)

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

      const marketName = symbol?.replace('_', '/')
      const currentMarket = allMarketsMap?.get(symbol)

      const isAdditionalCustomUserMarket = item.isCustomUserMarket
      const isAwesomeMarket = currentMarket?.isAwesomeMarket

      const mint = getTokenMintAddressByName(base)

      const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))
      const marketAddress = allMarketsMap?.get(item.symbol)?.address?.toBase58()

      const avgBuy = serumMarketsDataMap?.get(symbol)?.avgBuy || '--'
      const avgSell = serumMarketsDataMap?.get(symbol)?.avgSell || '--'

      return {
        id: `${symbol}`,
        favourite: {
          render: (
            <FavouriteIcon
              symbol={symbol}
              value={favouriteMarkets.includes(symbol)}
              onChange={toggleFavouriteMarket}
            />
          ),
        },
        emoji: {
          render: (
            <IconContainer>
              <TokenIcon
                mint={mint}
                width="2.5rem"
                emojiIfNoLogo
                isAwesomeMarket={isAwesomeMarket}
                isAdditionalCustomUserMarket={isAdditionalCustomUserMarket}
              />
            </IconContainer>
          ),
        },
        symbol: {
          render: (
            <Row direction="column" align="initial">
              {baseTokenInfo && baseTokenInfo?.name && (
                <StyledSymbol>
                  {baseTokenInfo?.name === 'Cryptocurrencies.Ai'
                    ? 'Aldrin'
                    : baseTokenInfo?.name.replace('(Sollet)', '')}
                </StyledSymbol>
              )}
              <StyledTokenName>{marketName}</StyledTokenName>{' '}
            </Row>
          ),
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
            <>
              <StyledColumn
                style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <span
                  style={{
                    color: theme.palette.green.main,
                  }}
                >
                  {closePrice === 0
                    ? '-'
                    : formatNumberWithSpaces(stripByAmount(closePrice))}
                </span>
                <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                  {quote}
                </span>
              </StyledColumn>
              <StyledRow>
                <span
                  style={{
                    color: theme.palette.green.main,
                  }}
                >
                  {closePrice === 0
                    ? '-'
                    : formatNumberWithSpaces(stripByAmount(closePrice))}
                </span>
                <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                  {quote}
                </span>
              </StyledRow>
            </>
          ),

          color: theme.palette.dark.main,
        },
        price24hChange: {
          isNumber: true,
          render: (
            <>
              <StyledRow
                style={{
                  color:
                    +lastPriceDiff === 0
                      ? ''
                      : +lastPriceDiff > 0
                      ? theme.palette.green.main
                      : theme.palette.red.main,
                }}
              >
                {`${sign24hChange}${formatNumberWithSpaces(
                  stripDigitPlaces(lastPriceDiff, 2)
                )}`}{' '}
                <span style={{ color: '#96999C' }}> / </span>{' '}
                {`${sign24hChange}${formatNumberWithSpaces(
                  stripDigitPlaces(priceChangePercentage, 2)
                )}%`}
              </StyledRow>
              <StyledColumn
                style={{
                  color:
                    +lastPriceDiff === 0
                      ? ''
                      : +lastPriceDiff > 0
                      ? theme.palette.green.main
                      : theme.palette.red.main,
                }}
              >
                <span>
                  {`${formatNumberWithSpaces(
                    stripDigitPlaces(closePrice, pricePrecision)
                  )} ${quote}`}
                </span>
                <span
                  style={{ fontFamily: 'Avenir Next Thin', marginTop: '1rem' }}
                >{`${sign24hChange}${formatNumberWithSpaces(
                  stripDigitPlaces(priceChangePercentage, 2)
                )}%`}</span>
              </StyledColumn>
            </>
          ),

          contentToSort: +priceChangePercentage,
        },
        volume24hChange: {
          isNumber: true,
          contentToSort: +volume || 0,
          render: (
            <span>
              {`${isNotUSDTQuote ? '' : '$'}${formatNumberWithSpaces(
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
                {`${formatNumberWithSpaces(
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
                {`${signTrades24hChange}${formatNumberWithSpaces(
                  stripDigitPlaces(Math.abs(precentageTradesDiff))
                )}%`}
              </span>
            </>
          ),
        },
        min24h: {
          render: (
            <span
              style={{
                color: theme.palette.red.main,
              }}
            >
              <>
                {' '}
                {`${formatNumberWithSpaces(
                  stripDigitPlaces(minPrice, pricePrecision)
                )}`}{' '}
                <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                  {quote}
                </span>
              </>
            </span>
          ),
        },
        max24h: {
          render: (
            <span
              style={{
                color: theme.palette.green.main,
              }}
            >
              <>
                {`${formatNumberWithSpaces(
                  stripDigitPlaces(maxPrice, pricePrecision)
                )}`}{' '}
                <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                  {quote}
                </span>
              </>
            </span>
          ),
        },
        avgSell14d: {
          render: (
            <>
              <span
                style={{
                  color: theme.palette.red.main,
                }}
              >
                {`${formatNumberWithSpaces(stripDigitPlaces(avgSell))}`}
              </span>
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </>
          ),
        },
        avgBuy14d: {
          render: (
            <>
              <span
                style={{
                  color: theme.palette.green.main,
                }}
              >
                {`${formatNumberWithSpaces(stripDigitPlaces(avgBuy))}`}{' '}
              </span>{' '}
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </>
          ),
        },
        links: {
          render: (
            <Row
              style={{ flexWrap: 'nowrap' }}
              justify="flex-start"
              align="baseline"
            >
              <TokenExternalLinks
                tokenName={base}
                marketAddress={marketAddress}
                onInfoClick={(e) => {
                  e.stopPropagation()
                  changeChoosenMarketData({ symbol: marketName, marketAddress })
                  setIsMintsPopupOpen(true)
                }}
                marketPair={symbol}
              />
            </Row>
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
}
