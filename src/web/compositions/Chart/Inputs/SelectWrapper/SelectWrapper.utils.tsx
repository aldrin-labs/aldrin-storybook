import React from 'react'
import { client } from '@core/graphql/apolloClient'
import { getSelectorSettings } from '@core/graphql/queries/chart/getSelectorSettings'
import { SvgIcon } from '@sb/components'
import { DarkTooltip, DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'

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
import { LinkToAnalytics, LinkToTwitter } from '../../components/MarketBlock'

export const selectWrapperColumnNames = [
  { label: '', id: 'favorite', isSortable: false },
  { label: 'Pair', id: 'symbol', isSortable: true },
  { label: 'Last price', id: 'lastPrice', isSortable: true },
  { label: '24H change', id: '24hChange', isNumber: true, isSortable: true },
  { label: '24H volume', id: '24hVolume', isNumber: true, isSortable: true },
]

export const marketsByCategories = {
  defi: {
    name: 'DeFi',
    tokens: [
      'CCAI',
      'SRM',
      'OXY',
      'RAY',
      'GRT',
      'FAB',
      'SLRS',
      'FTR',
      'FRONT',
      'STEP',
      'FIDA',
      'SNY',
      'TGT',
      'LIQ',
      'SLIM',
      'MER',
      'AKRO',
      'KEEP',
      'XCOPE',
      'ODOPE',
      'RSR',
      'MATH',
      'LQID',
      'LIEN',
      'DGX',
      'CREAM',
      'BOLE',
    ],
  },
  currency: { name: 'Currency', tokens: ['BTC', 'ETH', 'SOL'] },
  exchangeDerrivatives: {
    name: 'Exchange & Derrivatives',
    tokens: [
      'CCAI',
      'SRM',
      'FIDA',
      'RAY',
      'SOLAPE',
      'FTT',
      'SUSHI',
      'UNI',
      'FTR',
      '1INCH',
      'LIQ',
      'WOO',
      'PERP',
      'LUA',
      'SECO',
      'MSRM',
    ],
  },
  nftGamesGambling: {
    name: 'NFT, Games & Gambling',
    tokens: ['sHOG', 'SCA', 'HXRO', 'SAMO'],
  },
  memeSocial: {
    name: 'Meme & Social',
    tokens: ['SAIL', 'SAMO', 'COPE', 'CATO', 'IBVOL', 'BVOL'],
  },
  oracle: { name: 'Oracle', tokens: ['LINK'] },
  farmAgregator: {
    name: 'Farm & Agregator',
    tokens: ['FRONT', 'OXY', 'YARD', 'TULP', 'RAMP'],
  },
  // syntheticAsset: { name: 'Synthetic Asset', tokens: ['SNY', 'FAB'] },
  tradeLiquidity: {
    name: 'Trade & Liquidity',
    tokens: ['SLRS', 'ROPE', 'FTR', 'UBXT', 'LIEN'],
  },
  lendingYield: { name: 'Lending & Yield', tokens: ['AAVE', 'COMP', 'YFI'] },
  infrastructure: {
    name: 'Infrastructure',
    tokens: ['GRT', 'BOP', 'TOMO', 'HNT', 'GEL'],
  },
  dApp: {
    name: 'dApp',
    tokens: ['KIN', 'AUDIO', 'MAPS', 'SXP', 'STEP', 'ALEPH', 'MEDIA'],
  },
}

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
  market,
  tokenMap,
  serumMarketsDataMap,
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
  const marketsCategoriesData = Object.entries(marketsByCategories)
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
    if (tab === 'sol') {
      processedData = processedData.filter((el) => el.symbol.includes('SOL'))
    }

    marketsCategoriesData.forEach(([category, data]) => {
      const tokens = data.tokens
      if (tab === category) {
        processedData = processedData.filter((el) => {
          const [base, quote] = el.symbol.split('_')
          return tokens.includes(base) || tokens.includes(quote)
        })
      }
    })

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

    const marketName = symbol.replaceAll('_', '/')
    const currentMarket = customMarkets?.find(
      (el) => el?.name.replaceAll('_', '/') === marketName
    )

    const isAdditionalCustomUserMarket = el.isCustomUserMarket
    const isAwesomeMarket = currentMarket?.isCustomUserMarket
    const isCCAIPair =
      symbol.includes('CCAI') &&
      !isAdditionalCustomUserMarket &&
      !isAwesomeMarket

    const mint = getTokenMintAddressByName(base)

    const baseTokenInfo = tokenMap.get(getTokenMintAddressByName(base))
    const marketAddress = market?.address?.toBase58()
    const avgBuy = serumMarketsDataMap?.get(symbol)?.avgBuy || 0
    const avgSell = serumMarketsDataMap?.get(symbol)?.avgSell || 0

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
              <TokenIcon
                mint={mint}
                width={'50%'}
                emojiIfNoLogo={true}
                isAwesomeMarket={isAwesomeMarket}
                isAdditionalCustomUserMarket={isAdditionalCustomUserMarket}
              />
            </div>
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
                {baseTokenInfo?.name.replace('(Sollet)', '')}
              </span>
            )}
            <span style={{ fontSize: '1.6rem' }}>{marketName}</span>{' '}
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
            )}`}{' '}
            <span style={{ color: '#96999C' }}> / </span>{' '}
            {`${sign24hChange}${formatNumberToUSFormat(
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
                stripDigitPlaces(Math.abs(minPrice))
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
                stripDigitPlaces(Math.abs(maxPrice))
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
            <LinkToSolanaExp padding={'0'} marketAddress={marketAddress} />
            <DarkTooltip title={'Show analytics for this market.'}>
              <LinkToAnalytics to={`/analytics/${marketName}`}>
                <SvgIcon
                  src={AnalyticsIcon}
                  width={'2.3rem'}
                  height={'2.3rem'}
                />
              </LinkToAnalytics>
            </DarkTooltip>
            {baseTokenInfo?.extensions?.twitter && (
              <DarkTooltip title={'Twitter profile of base token.'}>
                <LinkToTwitter href={baseTokenInfo?.extensions?.twitter}>
                  <SvgIcon
                    width={'2.5rem'}
                    height={'2.5rem'}
                    src={BlueTwitterIcon}
                  />
                </LinkToTwitter>
              </DarkTooltip>
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

  return filtredData.sort((a, b) =>
    a.symbol.contentToSort.localeCompare(b.symbol.contentToSort)
  )
}
