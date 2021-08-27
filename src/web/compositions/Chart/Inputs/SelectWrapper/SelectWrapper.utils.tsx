import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'
import { DarkTooltip, DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

import { marketsByCategories } from '@core/config/marketsByCategories'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
  reverseFor,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'

import GreenCheckmark from '@icons/successIcon.svg'
import Warning from '@icons/warningPairSel.png'
import ThinkingFace from '@icons/thinkingFace.png'
import CCAILogo from '@icons/auth0Logo.svg'
import AnalyticsIcon from '@icons/analytics.svg'
import BlueTwitterIcon from '@icons/blueTwitter.svg'

import favoriteSelected from '@icons/favoriteSelected.svg'
import favoriteUnselected from '@icons/favoriteUnselected.svg'

import LessVolumeArrow from '@icons/lessVolumeArrow.svg'
import MoreVolumeArrow from '@icons/moreVolumeArrow.svg'
import Coinmarketcap from '@icons/coinmarketcap.svg'
import CoinGecko from '@icons/coingecko.svg'
import Inform from '@icons/inform.svg'

import tokensLinksMap from '@core/config/tokensTwitterLinks'

import {
  GetSelectorSettingsType,
  ISelectData,
  UpdateFavoritePairsMutationType,
  SelectTabType,
} from './SelectWrapper.types'
import { TokenIcon } from '@sb/components/TokenIcon'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'
import LinkToSolanaExp from '../../components/LinkToSolanaExp'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  LinkToAnalytics,
  LinkToTwitter,
} from '../../components/MarketBlock/MarketBlock.styles'
import { getNumberOfDecimalsFromNumber } from '@core/utils/chartPageUtils'
import { MintsPopup } from './MintsPopup'
import {
  IconContainer,
  StyledColumn,
  StyledRow,
  StyledSymbol,
  StyledTokenName,
} from './SelectWrapperStyles'
import stableCoins from '@core/config/stableCoins'

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
  previousData,
  onSelectPair,
  theme,
  searchValue,
  tab,
  favoritePairsMap,
  marketType,
  needFiltrations = true,
  tokenMap,
  serumMarketsDataMap,
  allMarketsMap,
  setIsMintsPopupOpen,
  changeChoosenMarketData,
  toggleFavoriteMarket,
}: {
  data: ISelectData
  previousData?: ISelectData
  onSelectPair: ({ value }: { value: string }) => void
  theme: any
  searchValue: string
  tab: SelectTabType
  favoritePairsMap: Map<string, string>
  marketType: number
  needFiltrations?: boolean
  allMarketsMap: any
  toggleFavoriteMarket: (pair: string) => void
}) => {
  const marketsCategoriesData = Object.entries(marketsByCategories)
  // no need actually in this, need to be done by filter func for data by categories
  const {
    stableCoinsPairsMap,
    btcCoinsPairsMap,
    altCoinsPairsMap,
    usdcPairsMap,
    usdtPairsMap,
  } = getMarketsMapsByCoins(data)

  // create map & filter out from custom
  if (!data && !Array.isArray(data)) {
    return []
  }

  let processedData = data.filter(
    (market, index, arr) =>
      arr.findIndex(
        (marketInFindIndex) => marketInFindIndex.symbol === market.symbol
      ) === index
  )

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
        const [base, quote] = el.symbol.split('_')
        return quote === 'SOL'
      })
    }

    if (tab === 'solanaNative') {
      processedData = processedData.filter((el) => {
        const [base] = el.symbol.split('_')
        const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))

        return !baseTokenInfo?.name?.includes('Wrapped') || base === 'SOL'
      })
    }

    marketsCategoriesData?.forEach(([category, data]) => {
      const tokens = data.tokens

      if (tab === category) {
        processedData = processedData.filter((el) => {
          const [base, quote] = el.symbol.split('_')
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
  } else if (needFiltrations) {
    processedData = processedData.filter((el) => !el.isCustomUserMarket)
  }

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
      isCustomUserMarket,
      isPrivateCustomMarket,
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
      isCustomUserMarket,
      isPrivateCustomMarket,
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

    const marketName = symbol?.replaceAll('_', '/')
    const currentMarket = allMarketsMap?.get(symbol)

    const isAdditionalCustomUserMarket = el.isCustomUserMarket
    const isAwesomeMarket = currentMarket?.isAwesomeMarket

    const mint = getTokenMintAddressByName(base)

    const baseTokenInfo = tokenMap?.get(getTokenMintAddressByName(base))
    const marketAddress = allMarketsMap?.get(el.symbol)?.address?.toBase58()

    const avgBuy = serumMarketsDataMap?.get(symbol)?.avgBuy || 0
    const avgSell = serumMarketsDataMap?.get(symbol)?.avgSell || 0

    const twitterLink = tokensLinksMap?.get(base)?.twitterLink || ''
    const marketCapLink = tokensLinksMap?.get(base)?.marketCapLink || ''
    const marketCapIcon = marketCapLink.includes('coinmarketcap')
      ? Coinmarketcap
      : CoinGecko

    console.log(favoritePairsMap, symbol, favoritePairsMap[symbol])

    return {
      id: `${symbol}`,
      favorite: {
        isSortable: false,
        render: (
          <SvgIcon
            onClick={(e) => {
              e.stopPropagation()
              toggleFavoriteMarket(symbol)
            }}
            src={
              favoritePairsMap.get(symbol) ? favoriteSelected : favoriteUnselected
            }
            width="2.5rem"
            height="auto"
          />
        ),
      },
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
            <IconContainer>
              <TokenIcon
                mint={mint}
                width={'2.5rem'}
                emojiIfNoLogo={true}
                isAwesomeMarket={isAwesomeMarket}
                isAdditionalCustomUserMarket={isAdditionalCustomUserMarket}
              />
            </IconContainer>
          </DarkTooltip>
        ),
      },
      symbol: {
        render: (
          <Row direction={'column'} align={'initial'}>
            {baseTokenInfo && baseTokenInfo?.name && (
              <span
                style={{
                  fontSize: '1.3rem',
                  textTransform: 'capitalize',
                  color: '#96999C',
                  fontFamily: 'Avenir Next Thin',
                  marginBottom: '1rem',
                }}
              >
                {baseTokenInfo?.name === 'Cryptocurrencies.Ai'
                  ? 'Aldrin'
                  : baseTokenInfo?.name.replace('(Sollet)', '')}
              </span>
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
            <span
              style={{
                color: theme.palette.green.main,
              }}
            >
              {formatNumberToUSFormat(
                stripDigitPlaces(closePrice, pricePrecision)
              )}
            </span>
            <span style={{ color: '#96999C', marginLeft: '0.5rem' }}>
              {quote}
            </span>
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
              {`${sign24hChange}${formatNumberToUSFormat(
                stripDigitPlaces(lastPriceDiff, pricePrecision)
              )}`}{' '}
              <span style={{ color: '#96999C' }}> / </span>{' '}
              {`${sign24hChange}${formatNumberToUSFormat(
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
                {`${formatNumberToUSFormat(
                  stripDigitPlaces(closePrice, pricePrecision)
                )} ${quote}`}
              </span>
              <span
                style={{ fontFamily: 'Avenir Next Thin', marginTop: '1rem' }}
              >{`${sign24hChange}${formatNumberToUSFormat(
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
      min24h: {
        render: (
          <span
            style={{
              color: theme.palette.red.main,
            }}
          >
            <>
              {' '}
              {`${formatNumberToUSFormat(
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
              {`${formatNumberToUSFormat(
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
              {`${formatNumberToUSFormat(stripDigitPlaces(avgSell))}`}
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
              {`${formatNumberToUSFormat(stripDigitPlaces(avgBuy))}`}{' '}
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
            justify={'flex-start'}
            align={'baseline'}
          >
            <SvgIcon
              onClick={(e) => {
                e.stopPropagation()
                changeChoosenMarketData({ symbol: marketName, marketAddress })
                setIsMintsPopupOpen(true)
              }}
              src={Inform}
              style={{ marginRight: '1.5rem', cursor: 'pointer' }}
              width={'2.3rem'}
              height={'2.3rem'}
            />
            <LinkToSolanaExp padding={'0'} marketAddress={marketAddress} />
            <DarkTooltip title={'Show analytics for this market.'}>
              <LinkToAnalytics
                target="_blank"
                rel="noopener noreferrer"
                to={`/analytics/${symbol}`}
              >
                <SvgIcon
                  src={AnalyticsIcon}
                  width={'2.3rem'}
                  height={'2.3rem'}
                />
              </LinkToAnalytics>
            </DarkTooltip>
            {twitterLink !== '' && (
              <DarkTooltip title={'Twitter profile of base token.'}>
                <LinkToTwitter
                  target="_blank"
                  rel="noopener noreferrer"
                  href={twitterLink}
                >
                  <SvgIcon
                    width={'2.5rem'}
                    height={'2.5rem'}
                    src={BlueTwitterIcon}
                  />
                </LinkToTwitter>
              </DarkTooltip>
            )}
            {marketCapLink !== '' && (
              <a
                style={{ marginLeft: '1.5rem' }}
                target="_blank"
                rel="noopener noreferrer"
                href={marketCapLink}
              >
                <SvgIcon
                  width={'2.5rem'}
                  height={'2.5rem'}
                  src={marketCapIcon}
                />
              </a>
            )}
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
