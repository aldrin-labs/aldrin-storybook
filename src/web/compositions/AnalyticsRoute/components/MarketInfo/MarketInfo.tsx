import React from 'react'
import styled from 'styled-components'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import copy from 'clipboard-copy'

import { Theme } from '@material-ui/core'
import { useMarket, useMarkPrice } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import WhiteArrow from '@icons/whiteArrow.svg'
import CoinPlaceholder from '@icons/coinPlaceholder.svg'
import CopyIcon from '@icons/copyIcon.png'
import { SvgIcon } from '@sb/components/index'

import { Link } from 'react-router-dom'
import FeesInfo from './FeesInfo'
import { marketDataByTickers } from '@core/graphql/queries/chart/marketDataByTickers'
import { datesForQuery } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper'

import {
  Row,
  RowContainer,
  BlockContainer,
  WhiteTitle,
  SerumTitleBlockContainer,
  SerumWhiteTitle,
  Text,
  TopBarTitle,
  BlockTemplate,
} from '../../index.styles'
import {
  stripDigitPlaces,
  formatNumberToUSFormat,
} from '@core/utils/PortfolioTableUtils'

const PairNameTitle = styled((props) => <WhiteTitle {...props} />)`
  font-size: 2.2rem;
  font-family: Avenir Next Demi;
`

const LastPrice = styled((props) => <WhiteTitle {...props} />)`
  font-size: 3.5rem;
  font-family: Avenir Next Demi;
  margin: 1rem 0;

  @media (min-width: 1440px) and (max-width: 1540px) {
    font-size: 2.6rem;
  }

  @media (min-width: 2200px) {
    font-size: 2.6rem;
  }
`

const SmallTitle = styled((props) => <WhiteTitle {...props} />)`
  font-weight: 400;
  font-size: 1.4rem;

  @media (min-width: 2200px) {
    font-size: 1.2rem;
  }
`

const Address = styled((props) => <WhiteTitle {...props} />)`
  font-size: 1.2rem;
`

const SmallBoldTitle = styled((props) => <SmallTitle {...props} />)`
  font-weight: 600;
  font-family: Avenir Next Demi;
`

const ValueBlock = styled((props) => <Row {...props} />)`
  padding: 1rem 4rem 1rem 1rem;
  border-left: ${(props) => props.theme.palette.border.new};
`

const BlockTitle = styled((props) => <WhiteTitle {...props} />)`
  font-size: 1.4rem;
  color: #949494;
  margin-bottom: 1rem;
`

export const BlockValue = styled((props) => <WhiteTitle {...props} />)`
  font-size: 2.2rem;
`

const PurpleTitle = styled((props) => <a {...props} />)`
  font-size: 1.4rem;
  color: #9ba6ff;
  font-family: Avenir Next Demi;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 1rem;
  margin-left: 1rem;
`

const PurpleLinkButton = styled(Link)`
  min-width: 8rem;
  font-size: 1.4rem;
  color: ${props => props.theme.palette.white.main};
  text-align: center;
  text-decoration: none;
  background: #9ba6ff;
  border-radius: .4rem;
  padding: .5rem 0;
  font-family: Avenir Next;
`

const MarketInfo = ({
  theme,
  selectedPair,
  marketDataByTickersQuery,
}: {
  theme: Theme
  selectedPair: string
  marketDataByTickersQuery: any
}) => {
  const {
    marketDataByTickers: {
      // symbol = '',
      tradesCount = 0,
      tradesDiff = 0,
      volume = 0,
      volumeChange = 0,
      lastPriceDiff = 0,
      minPrice = 0,
      maxPrice = 0,
      // closePrice = 0
    } = {
      // symbol: '',
      tradesCount: 0,
      tradesDiff: 0,
      volume: 0,
      volumeChange: 0,
      minPrice: 0,
      maxPrice: 0,
      // closePrice: 0
    },
  } = marketDataByTickersQuery || {
    marketDataByTickers: {
      // symbol: '',
      tradesCount: 0,
      tradesDiff: 0,
      volume: 0,
      volumeChange: 0,
      minPrice: 0,
      maxPrice: 0,
      // closePrice: 0
    },
  }

  const { market } = useMarket() || { market: { tickSize: 8 } }
  const markPrice = useMarkPrice() || 0

  const pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)
  const pair = selectedPair.replace('_', '/')
  const quote = pair.split('/')[1]

  const prevClosePrice = markPrice + lastPriceDiff * -1
  const priceChangePercentage = !!markPrice
    ? (markPrice - prevClosePrice) / (prevClosePrice / 100)
    : 0
  const sign24hChange = +priceChangePercentage > 0 ? `+` : ``

  return (
    <BlockTemplate
      theme={theme}
      width={'100%'}
      height="calc(20rem - 0.8rem)"
      margin="0 0 .8rem 0"
      padding="3rem 6rem 4rem 6rem"
    >
      <RowContainer justify="space-between" wrap={'nowrap'}>
        <Row direction={'column'} align={'flex-start'}>
          <RowContainer justify={'space-between'}>
            <Row>
              <SvgIcon
                style={{
                  margin: '0 1rem 0 0',
                }}
                width={`3rem`}
                height={'3rem'}
                src={CoinPlaceholder}
              />
              <PairNameTitle theme={theme}>{pair}</PairNameTitle>
            </Row>
            <PurpleLinkButton theme={theme} to={`/chart/spot/${selectedPair}`}>Trade</PurpleLinkButton>
          </RowContainer>

          <RowContainer justify="space-between">
            <LastPrice theme={theme}>
              {`${markPrice === 0 ? '--' : markPrice.toFixed(pricePrecision)} ${
                pair.split('/')[1]
              }`}
            </LastPrice>
            <Row
              style={{
                background: priceChangePercentage > 0 ? '#1BA492' : '#F26D68',
                marginLeft: '1.5rem',
                borderRadius: '.4rem',
                minWidth: '8rem',
              }}
            >
              <SvgIcon
                style={{
                  margin: '0 .5rem 0 1rem',
                  transform: priceChangePercentage > 0 ? '' : 'rotate(180deg)',
                }}
                width={`1rem`}
                height={'1rem'}
                src={WhiteArrow}
              />
              <SmallTitle
                theme={theme}
                style={{
                  padding: '1rem',
                  fontWeight: 600,
                  color: theme.palette.white.main,
                }}
              >
                {`${sign24hChange}${formatNumberToUSFormat(
                  stripDigitPlaces(priceChangePercentage, 2)
                )}%`}
              </SmallTitle>
            </Row>
          </RowContainer>
          <Row justify={'flex-start'}>
            <Row margin={'0 1rem 0 0'}>
              <SmallTitle theme={theme} style={{ paddingRight: '.5rem' }}>
                24h Low:
              </SmallTitle>
              <SmallBoldTitle
                theme={theme}
              >{`${minPrice} ${quote}`}</SmallBoldTitle>
            </Row>
            <Row>
              <SmallTitle theme={theme} style={{ paddingRight: '.5rem' }}>
                24h High:
              </SmallTitle>
              <SmallBoldTitle
                theme={theme}
              >{`${maxPrice} ${quote}`}</SmallBoldTitle>
            </Row>
          </Row>
        </Row>
        <Row wrap={'nowrap'}>
          <Row padding="2rem 0">
            <ValueBlock theme={theme} align={'flex-start'} direction={'column'}>
              <BlockTitle theme={theme}>Volume (24h)</BlockTitle>
              <BlockValue theme={theme}>{`$${formatNumberToUSFormat(
                stripDigitPlaces(volume, 2)
              )}`}</BlockValue>
            </ValueBlock>
          </Row>
          {/* <Row padding="2rem 0">
            <ValueBlock theme={theme} align={'flex-start'} direction={'column'}>
              <BlockTitle theme={theme}>Supply</BlockTitle>
              <BlockValue theme={theme}>28.95</BlockValue>
            </ValueBlock>
          </Row> */}
          <Row padding="2rem 0">
            <ValueBlock theme={theme} align={'flex-start'} direction={'column'}>
              <BlockTitle theme={theme}>Fees (24h)</BlockTitle>
              <FeesInfo theme={theme} selectedPair={selectedPair} />
            </ValueBlock>
          </Row>
          <Row padding="2rem 0">
            <ValueBlock theme={theme} align={'flex-start'} direction={'column'}>
              <RowContainer justify={'space-between'}>
                <BlockTitle theme={theme}>Address</BlockTitle>
                <PurpleTitle
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://explorer.solana.com/address/${
                    market ? market.address.toBase58() : '--'
                  }`}
                  theme={theme}
                >
                  Go to explorer
                </PurpleTitle>
              </RowContainer>
              <Row>
                <Address theme={theme}>
                  {market ? market.address.toBase58() : '--'}
                </Address>
                <img
                  onClick={() =>
                    copy(market ? market.address.toBase58() : '--')
                  }
                  style={{
                    marginLeft: '1rem',
                    width: '4rem',
                    cursor: 'pointer',
                  }}
                  src={CopyIcon}
                />
              </Row>
            </ValueBlock>
          </Row>
        </Row>
      </RowContainer>
    </BlockTemplate>
  )
}

export default compose(
  queryRendererHoc({
    query: marketDataByTickers,
    name: 'marketDataByTickersQuery',
    variables: (props) => ({
      symbol: props.selectedPair,
      exchange: 'serum',
      marketType: props.marketType,
      startTimestamp: `${datesForQuery.startOfTime}`,
      endTimestamp: `${datesForQuery.endOfTime}`,
      prevStartTimestamp: `${datesForQuery.prevStartTimestamp}`,
      prevEndTimestamp: `${datesForQuery.prevEndTimestamp}`,
    }),
    fetchPolicy: 'cache-and-network',
    pollInterval: 30000,
    withOutSpinner: true,
    withTableLoader: true,
    withoutLoading: true,
  })
)(MarketInfo)
