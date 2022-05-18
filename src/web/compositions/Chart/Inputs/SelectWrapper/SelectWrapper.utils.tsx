import React from 'react'

import { SvgIcon } from '@sb/components'
import { TokenExternalLinks } from '@sb/components/TokenExternalLinks'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { marketsByCategories } from '@core/config/marketsByCategories'
import stableCoins from '@core/config/stableCoins'
import {
  getNumberOfDecimalsFromNumber,
  stripByAmount,
} from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  roundAndFormatNumber,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import favouriteSelected from '@icons/favouriteSelected.svg'
import favouriteUnselected from '@icons/favouriteUnselected.svg'
import LessVolumeArrow from '@icons/lessVolumeArrow.svg'
import MoreVolumeArrow from '@icons/moreVolumeArrow.svg'

import { ISelectData, SelectTabType } from './SelectWrapper.types'
import {
  IconContainer,
  StyledColumn,
  StyledRow,
  StyledSymbol,
  StyledTokenName,
} from './SelectWrapperStyles'

export const selectWrapperColumnNames = [
  { label: '', id: 'favourite', isSortable: false },
  { label: 'Pair', id: 'symbol', isSortable: true },
  { label: 'Last price', id: 'lastPrice', isSortable: true },
  { label: '24H change', id: '24hChange', isNumber: true, isSortable: true },
  { label: '24H volume', id: '24hVolume', isNumber: true, isSortable: true },
]

export const filterNativeSolanaMarkets = (data, tokenMap) =>
  data.filter((el) => {
    const [base] = el.symbol.split('_')
    const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))

    return !baseTokenInfo?.name?.includes('Wrapped')
  })

export const filterSelectorDataByTab = ({
  tab,
  data,
  tokenMap,
  allMarketsMap,
  favouritePairsMap,
}: {
  tab: SelectTabType
  data: ISelectData
  allMarketsMap: Map<string, any>
  tokenMap: Map<string, any>
  favouritePairsMap: Map<string, string>
}) => {
  let processedData = [...data]

  const { usdcPairsMap, usdtPairsMap } = getMarketsMapsByCoins(data)

  const marketsCategoriesData = Object.entries(marketsByCategories)

  if (tab !== 'all') {
    if (tab === 'favourite') {
      processedData = processedData.filter((el) =>
        favouritePairsMap.has(el.symbol)
      )
    }
    if (tab === 'usdc') {
      processedData = processedData.filter(
        (el) =>
          !el.symbol.includes('BULL') &&
          !el.symbol.includes('BEAR') &&
          usdcPairsMap.has(el.symbol)
      )
    }

    if (tab === 'usdt') {
      processedData = processedData.filter(
        (el) =>
          !el.symbol.includes('BULL') &&
          !el.symbol.includes('BEAR') &&
          usdtPairsMap.has(el.symbol)
      )
    }

    if (tab === 'sol') {
      processedData = processedData.filter((el) => {
        const [_, quote] = el.symbol.split('_')
        return quote === 'SOL'
      })
    }

    if (tab === 'solanaNative') {
      processedData = processedData.filter((el) => {
        const [base] = el.symbol.split('_')
        const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))

        return !baseTokenInfo?.name?.includes('Wrapped')
      })
    }

    marketsCategoriesData?.forEach(([category, data]) => {
      const { tokens } = data

      if (tab === category) {
        processedData = processedData.filter((el) => {
          const [base] = el.symbol.split('_')
          return tokens.includes(base)
        })
      }
    })

    if (tab === 'leveraged') {
      processedData = processedData.filter(
        (el) => el.symbol.includes('BULL') || el.symbol.includes('BEAR')
      )
    }

    if (tab === 'topGainers' || tab === 'topLosers') {
      processedData = processedData.sort((a, b) => {
        const pricePrecisionA = getNumberOfDecimalsFromNumber(a.closePrice)

        const strippedLastPriceDiffA = +stripDigitPlaces(
          a.lastPriceDiff,
          pricePrecisionA
        )

        const strippedMarkPriceA = +stripDigitPlaces(
          a.closePrice,
          pricePrecisionA
        )

        const prevClosePriceA = strippedMarkPriceA - strippedLastPriceDiffA

        const priceChangePercentageA = !prevClosePriceA
          ? 0
          : (a.closePrice - prevClosePriceA) / (prevClosePriceA / 100)

        const pricePrecisionB = getNumberOfDecimalsFromNumber(b.closePrice)

        const strippedLastPriceDiffB = +stripDigitPlaces(
          b.lastPriceDiff,
          pricePrecisionB
        )

        const strippedMarkPriceB = +stripDigitPlaces(
          b.closePrice,
          pricePrecisionB
        )

        const prevClosePriceB = strippedMarkPriceB - strippedLastPriceDiffB

        const priceChangePercentageB = !prevClosePriceB
          ? 0
          : (b.closePrice - prevClosePriceB) / (prevClosePriceB / 100)

        return tab === 'topGainers'
          ? priceChangePercentageB - priceChangePercentageA
          : priceChangePercentageA - priceChangePercentageB
      })
    }

    if (tab === 'customMarkets') {
      processedData = data.filter(
        (el) =>
          allMarketsMap.has(el.symbol) &&
          allMarketsMap.get(el.symbol).isCustomUserMarket
      )
    } else {
      processedData = processedData.filter((el) => !el.isCustomUserMarket)
    }
  } else {
    processedData = processedData.filter((el) => !el.isCustomUserMarket)
  }

  return processedData
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

export const combineSelectWrapperData = ({
  data,
  previousData,
  onSelectPair,
  searchValue,
  tab,
  favouritePairsMap,
  tokenMap,
  serumMarketsDataMap,
  allMarketsMap,
  setIsMintsPopupOpen,
  changeChoosenMarketData,
  toggleFavouriteMarket,
}: {
  data: ISelectData
  previousData?: ISelectData
  onSelectPair: ({ value }: { value: string }) => void
  searchValue: string
  tab: SelectTabType
  favouritePairsMap: Map<string, string>
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
  if (!data && !Array.isArray(data)) {
    return []
  }
  let processedData = data.filter(
    (market, index, arr) =>
      arr.findIndex(
        (marketInFindIndex) => marketInFindIndex.symbol === market.symbol
      ) === index
  )

  processedData = filterSelectorDataByTab({
    tab,
    data: processedData,
    tokenMap,
    allMarketsMap,
    favouritePairsMap,
  })

  processedData = processedData.filter((el) =>
    filterDataBySymbolForDifferentDeviders({ searchValue, symbol: el.symbol })
  )

  processedData = processedData.filter((el) => el.symbol !== 'CCAI_USDC')

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
      minPrice = 0,
      maxPrice = 0,
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

    const isAdditionalCustomUserMarket = el.isCustomUserMarket
    const isAwesomeMarket = currentMarket?.isAwesomeMarket

    const mint = getTokenMintAddressByName(base)

    const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))
    const marketAddress = allMarketsMap?.get(el.symbol)?.address?.toBase58()

    const avgBuy = serumMarketsDataMap?.get(symbol)?.avgBuy || '--'
    const avgSell = serumMarketsDataMap?.get(symbol)?.avgSell || '--'

    return {
      id: `${symbol}`,
      favourite: {
        isSortable: false,
        render: (
          <SvgIcon
            onClick={(e) => {
              e.stopPropagation()
              toggleFavouriteMarket(symbol)
            }}
            src={
              favouritePairsMap.get(symbol)
                ? favouriteSelected
                : favouriteUnselected
            }
            width="2.5rem"
            height="auto"
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
      },
      price: {
        contentToSort: +closePrice,
        render: (
          <>
            <StyledColumn
              style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
            >
              <InlineText color="green7">
                {closePrice === 0
                  ? '-'
                  : formatNumberToUSFormat(stripByAmount(closePrice))}
              </InlineText>
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </StyledColumn>
            <StyledRow>
              <InlineText color="green7">
                {closePrice === 0
                  ? '-'
                  : formatNumberToUSFormat(stripByAmount(closePrice))}
              </InlineText>
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </StyledRow>
          </>
        ),
      },
      price24hChange: {
        isNumber: true,
        render: (
          <>
            <StyledRow>
              <InlineText
                color={
                  +lastPriceDiff === 0
                    ? ''
                    : +lastPriceDiff > 0
                    ? 'green7'
                    : 'red3'
                }
              >
                {' '}
                {`${sign24hChange}${formatNumberToUSFormat(
                  stripDigitPlaces(lastPriceDiff, 2)
                )}`}{' '}
              </InlineText>
              <InlineText
                color={
                  +lastPriceDiff === 0
                    ? ''
                    : +lastPriceDiff > 0
                    ? 'green7'
                    : 'red3'
                }
                style={{ color: '#96999C' }}
              >
                {' '}
                /{' '}
              </InlineText>{' '}
              {`${sign24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(priceChangePercentage, 2)
              )}%`}
            </StyledRow>
            <StyledColumn>
              <InlineText
                color={
                  +lastPriceDiff === 0
                    ? ''
                    : +lastPriceDiff > 0
                    ? 'green7'
                    : 'red3'
                }
              >
                {`${formatNumberToUSFormat(
                  stripDigitPlaces(closePrice, pricePrecision)
                )} ${quote}`}
              </InlineText>
              <InlineText
                color={
                  +lastPriceDiff === 0
                    ? ''
                    : +lastPriceDiff > 0
                    ? 'green7'
                    : 'red3'
                }
                style={{ fontFamily: 'Avenir Next Thin', marginTop: '1rem' }}
              >{`${sign24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(priceChangePercentage, 2)
              )}%`}</InlineText>
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
            <InlineText
              color={
                +precentageTradesDiff === 0
                  ? ''
                  : +precentageTradesDiff > 0
                  ? 'green7'
                  : 'red3'
              }
            >
              {`${signTrades24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(Math.abs(precentageTradesDiff))
              )}%`}
            </InlineText>
          </>
        ),
      },
      min24h: {
        render: (
          <InlineText color="red3">
            <>
              {' '}
              {`${formatNumberToUSFormat(
                stripDigitPlaces(minPrice, pricePrecision)
              )}`}{' '}
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </>
          </InlineText>
        ),
      },
      max24h: {
        render: (
          <InlineText color="green7">
            <>
              {`${formatNumberToUSFormat(
                stripDigitPlaces(maxPrice, pricePrecision)
              )}`}{' '}
              <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
                {quote}
              </span>
            </>
          </InlineText>
        ),
      },
      avgSell14d: {
        render: (
          <>
            <InlineText color="red3">
              {`${formatNumberToUSFormat(stripDigitPlaces(avgSell))}`}
            </InlineText>
            <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
              {quote}
            </span>
          </>
        ),
      },
      avgBuy14d: {
        render: (
          <>
            <InlineText color="green7">
              {`${formatNumberToUSFormat(stripDigitPlaces(avgBuy))}`}{' '}
            </InlineText>{' '}
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

  return filtredData
}
