import React, { useEffect } from 'react'
import styled from 'styled-components'
import CardsPanel from '@sb/compositions/Chart/components/CardsPanel'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import { useMarket, useMarkPrice } from '@sb/dexUtils/markets'
import { getSerumData } from '@core/graphql/queries/chart/getSerumData'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'
import { SingleChart } from '@sb/components/Chart'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { getDecimalCount } from '@sb/dexUtils/utils'

import { ChartGridContainer } from '@sb/compositions/Chart/Chart.styles'
import { Link } from '@sb/components/PortfolioMainAllocation/PortfolioMainAllocation.styles'

export const Row = styled.div`
  display: flex;
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
`
export const RowContainer = styled(Row)`
  width: 100%;
`
export const Block = styled.div`
  width: ${(props) => props.width || '17.5%'};
  height: ${(props) => props.height || '20%'};
  background-color: ${(props) =>
    props.backgroundColor || props.theme.palette.white.block};
  margin: 0.7rem;
  border-radius: 1.6rem;
  border: 1px solid ${(props) => props.border || props.theme.palette.grey.block};
  font-family: DM Sans;
  font-size: 1.12rem;
  letter-spacing: 0.06rem;
  padding-left: 3rem;
  text-transform: uppercase;
  color: ${(props) => props.color || props.theme.palette.text.grey};
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`
export const BlockContainer = styled.div``

export const Text = styled.div`
  font-family: DM Sans;
  font-weight: bold;
  font-size: 1.5rem;
  text-transform: uppercase;
  color: 'white';
`
export const Title = styled.div`
  font-family: DM Sans;
  font-weight: bold;
  font-size: 1.2rem;
  text-transform: uppercase;

  padding-top: 1.5rem;
`

const Line = styled.div`
  position: absolute;
  top: ${(props) => props.top || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  width: 100%;
  height: 0.1rem;
  background: ${(props) => props.background || theme.palette.grey.block};
`
const Link = styled.a`
  display: block;
  width: fit-content;
  color: ${(props) => props.color || theme.palette.blue.serum};

  text-decoration: none;
  text-transform: ${(props) => props.textTransform || 'uppercase'};

  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 109.6%;
  letter-spacing: 1px;

  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
`

const AnalyticsRoute = ({ markets, setMarketAddress, ...props }) => {
  const { theme } = props
  const serumData = props.getSerumDataQuery
  const { market } = useMarket()
  const markPrice = useMarkPrice()

  useEffect(() => {
    const selectedMarketFromUrl = markets.find(
      (el) => el.name.split('/').join('_') === 'SRM_USDT'
    )
    setMarketAddress(selectedMarketFromUrl.address.toBase58())
  }, [])

let circulatingSupply = serumData.getSerumData.circulatingSupply - serumData.getSerumData.burned;
let totalySupply = serumData.getSerumData.totalySupply - serumData.getSerumData.burned;

  let quantityPrecision = market?.minOrderSize && getDecimalCount(market.minOrderSize);
  let pricePrecision = market?.tickSize && getDecimalCount(market.tickSize);

  return (
    <RowContainer
      style={{
        background: theme.palette.grey.additional,
        height: '100%',
        paddingLeft: '.8%',
        paddingRight: '.8%',
      }}
    >
      <ChartGridContainer xs={12} theme={theme}>
        <CardsPanel
          {...{
            pair: 'BTC_USDT', // url
            view: 'default',
            theme,
            marketType: 0, // url
            quantityPrecision, // chart
            pricePrecision,
            activeExchange: 'serum', // serum
          }}
        />
      </ChartGridContainer>{' '}
      <Line top={'5.7rem'} />
      <RowContainer
        style={{
          height: 'calc(96% - 2rem)',
          flexDirection: 'column',
          paddingBottom: '6rem',
        }}
      >
        <Block theme={theme}>
          srm marketcap{' '}
          <Text>
            {formatNumberToUSFormat(
              (markPrice * circulatingSupply).toFixed(0)
            )}
            $
          </Text>
        </Block>
        <Block theme={theme}>
          srm totaly supply
          <BlockContainer>
            <Text>
              {formatNumberToUSFormat(totalySupply.toFixed(0))} SRM
            </Text>
            <Title>
              $
              {formatNumberToUSFormat(
                (totalySupply * markPrice).toFixed(0)
              )}
            </Title>
          </BlockContainer>
        </Block>
        <Block theme={theme}>
          srm burned
          <BlockContainer>
            {' '}
            <Text>
              {formatNumberToUSFormat(serumData.getSerumData.burned.toFixed(0))} SRM
            </Text>
            <Title>
              $
              {formatNumberToUSFormat(
                (serumData.getSerumData.burned * markPrice).toFixed(0)
              )}
            </Title>
          </BlockContainer>
        </Block>
        <Block style={{ visibility: 'hidden'}} theme={theme}>
          srm burned
          <BlockContainer>
            {' '}
            <Text>
              {formatNumberToUSFormat(serumData.getSerumData.burned.toFixed(0))} SRM
            </Text>
            <Title>
              $
              {formatNumberToUSFormat(
                (serumData.getSerumData.burned * markPrice).toFixed(0)
              )}
            </Title>
          </BlockContainer>
        </Block>
        <Block theme={theme}>
          srm last price
          <Text>
            $
            {formatNumberToUSFormat(
              stripDigitPlaces(markPrice, pricePrecision)
            )}
          </Text>
        </Block>
        <Block theme={theme}>
          srm circulating supply
          <BlockContainer>
            <Text>
              {formatNumberToUSFormat(circulatingSupply.toFixed(0))}{' '}
              SRM
            </Text>
            <Title>
              $
              {formatNumberToUSFormat(
                (circulatingSupply * markPrice).toFixed(0)
              )}
            </Title>
          </BlockContainer>
        </Block>
        <Block theme={theme}>
          srm pending burn
          <Text>
            {/* {formatNumberToUSFormat(serumData.getSerumData.pendingBurn)}  */}
            Soon
          </Text>
        </Block>
        <Block style={{ visibility: 'hidden' }} theme={theme}>
          srm pending burn
          <Text>
            {/* {formatNumberToUSFormat(serumData.getSerumData.pendingBurn)}  */}
            soon
          </Text>
        </Block>
        <Block
          theme={theme}
          width={'62.5%'}
          height={'84.4%'}
          style={{ padding: '.5rem' }}
        >
          <SingleChart
            name=""
            themeMode={theme.palette.type}
            additionalUrl={`/?symbol=SRM/USDT_0&user_id=id`}
          />
        </Block>
      </RowContainer>
      <RowContainer>
        <Line theme={theme} bottom={'5.7rem'} />
        <Link href="https://cryptocurrencies.ai/">cryptocurrencies.ai</Link>
      </RowContainer>
    </RowContainer>
  )
}

export default compose(
  withTheme(),
  withMarketUtilsHOC,
  queryRendererHoc({
    query: getSerumData,
    name: 'getSerumDataQuery',
    withOutSpinner: false,
    withTableLoader: false,
    fetchPolicy: 'network-only',
  })
)(AnalyticsRoute)
