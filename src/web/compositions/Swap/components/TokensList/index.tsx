import React, { useMemo, useState } from 'react'

import { BlockContent, BlockTitle } from '@sb/components/Block'
import { ConnectWalletWrapper } from '@sb/components/ConnectWalletWrapper'
import { FlexBlock } from '@sb/components/Layout'
import { TokenIconWithName } from '@sb/components/TokenIcon/TokenIconWithName'
import { InlineText } from '@sb/components/Typography'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  DATES_FOR_SERUM_MARKET_DATA,
  getSerumMarketData,
} from '@core/graphql/queries/chart/getSerumMarketData'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import {
  TokenBLock,
  TokensContainer,
  TabsContainer,
  Tab,
  TabsWrap,
} from './styles'
import { TokensPortolio, resolveDiffColor } from './TokensPortfolio'
import { TokenForList, TokensListProps } from './types'

const SUFFIX = '_USDC'

const PRICE_THRESHOLD = 10 ** -22
const List: React.FC<TokensListProps> = (props) => {
  const {
    serumMarketData: { getSerumMarketData: marketData },
  } = props

  const allTokensList = useMemo(() => {
    const list = marketData
      .filter((t) => t.symbol.endsWith(SUFFIX))
      .map((t) => {
        const prevClosePrice = t.closePrice - t.lastPriceDiff

        const priceDiffPct =
          prevClosePrice >= PRICE_THRESHOLD
            ? (t.lastPriceDiff / prevClosePrice) * 100
            : 0

        const symbol = t.symbol.replace(SUFFIX, '')
        return {
          ...t,
          symbol,
          priceDiffPct,
          mint: getTokenMintAddressByName(symbol),
        }
      })
      .filter((t): t is TokenForList => !!t.mint)
      .sort((a, b) => b.priceDiffPct - a.priceDiffPct)

    return list
  }, marketData)

  const topGainers = allTokensList.slice(0, 4)
  const topLoosers = allTokensList.slice(allTokensList.length - 4)
  const tokensList = [...topGainers, ...topLoosers]

  const [activeTab, setActiveTab] = useState<'hot' | 'portfolio'>('hot')

  return (
    <>
      <TabsWrap border>
        <BlockTitle>
          <TabsContainer>
            <Tab
              active={activeTab === 'hot'}
              onClick={() => setActiveTab('hot')}
            >
              Hot Tokens
            </Tab>
            <Tab
              active={activeTab === 'portfolio'}
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio
            </Tab>
          </TabsContainer>
        </BlockTitle>
      </TabsWrap>
      <BlockContent>
        {activeTab === 'hot' && (
          <TokensContainer>
            {tokensList.map((token) => (
              <TokenBLock key={`hot_token_${token.symbol}`}>
                <FlexBlock alignItems="center" direction="row">
                  <TokenIconWithName mint={token.mint} />
                </FlexBlock>
                <FlexBlock direction="column" alignItems="flex-end">
                  <InlineText size="sm">
                    ${stripByAmountAndFormat(token.closePrice)}
                  </InlineText>
                  <InlineText
                    size="sm"
                    color={resolveDiffColor(token.priceDiffPct)}
                    weight={600}
                  >
                    {token.priceDiffPct > 0 ? '+' : ''}
                    {stripByAmountAndFormat(token.priceDiffPct, 2)}%
                  </InlineText>
                </FlexBlock>
              </TokenBLock>
            ))}
          </TokensContainer>
        )}
        {activeTab === 'portfolio' && (
          <TokensContainer>
            <ConnectWalletWrapper size="sm">
              <TokensPortolio tokensList={allTokensList} />
            </ConnectWalletWrapper>
          </TokensContainer>
        )}
      </BlockContent>
    </>
  )
}

export const TokensList = queryRendererHoc({
  query: getSerumMarketData,
  name: 'serumMarketData',
  variables: () => ({
    exchange: 'serum',
    publicKey: '',
    marketType: 0,
    startTimestamp: `${DATES_FOR_SERUM_MARKET_DATA.startTimestamp()}`,
    endTimestamp: `${DATES_FOR_SERUM_MARKET_DATA.endTimestamp()}`,
    prevStartTimestamp: `${DATES_FOR_SERUM_MARKET_DATA.prevStartTimestamp()}`,
    prevEndTimestamp: `${DATES_FOR_SERUM_MARKET_DATA.prevEndTimestamp()}`,
  }),
  fetchPolicy: 'cache-and-network',
  withOutSpinner: true,
  withTableLoader: false,
})(List)
