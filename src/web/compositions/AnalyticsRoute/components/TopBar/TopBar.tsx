import React from 'react'
import { compose } from 'recompose'

import { Theme } from '@material-ui/core'
import { getSerumData } from '@core/graphql/queries/chart/getSerumData'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { useMarket, useMarkPrice } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import SvgIcon from '@sb/components/SvgIcon'
import SrmLogo from '@icons/srmLogo.svg'

import {
  Row,
  BlockContainer,
  GreenTitle,
  SerumTitleBlockContainer,
  SerumWhiteTitle,
  Text,
  TopBarTitle,
} from '../../index.styles'

import SRMPriceBlock from './SRMPriceBlock'
import SRMMarketCap from './SRMMarketCap'

const TopBar = ({
  theme,
  getSerumDataQuery,
}: {
  theme: Theme
  getSerumDataQuery: {
    getSerumData: {
      circulatingSupply: number
      totalySupply: number
      burned: number
    }
  }
}) => {
  const { market } = useMarket() || { market: { tickSize: 8 } }

  let circulatingSupply =
    getSerumDataQuery.getSerumData.circulatingSupply -
    getSerumDataQuery.getSerumData.burned
  let totalySupply =
    getSerumDataQuery.getSerumData.totalySupply -
    getSerumDataQuery.getSerumData.burned

  let pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)

  return (
    <>
      <Row height={'100%'}>
        <SvgIcon
          style={{ marginRight: '.75rem' }}
          height={'50%'}
          width={'auto'}
          src={SrmLogo}
        />
        <SerumWhiteTitle theme={theme}>SRM / Serum</SerumWhiteTitle>
        <SRMPriceBlock
          theme={theme}
          pricePrecision={3}
          exchange={{ symbol: 'binance' }}
          marketType={0}
          symbol={'SRM_USDT'}
        />
      </Row>
      <Row>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>SRM Marketcap</TopBarTitle>
          <SRMMarketCap
            theme={theme}
            pricePrecision={3}
            exchange={{ symbol: 'binance' }}
            marketType={0}
            symbol={'SRM_USDT'}
            circulatingSupply={circulatingSupply}
          />
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>SRM Total Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(totalySupply.toFixed(0))} SRM
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>SRM Circulating Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(circulatingSupply.toFixed(0))} SRM
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>SRM Burned</TopBarTitle>
          <BlockContainer>
            {' '}
            <Text theme={theme}>
              {formatNumberToUSFormat(
                getSerumDataQuery.getSerumData.burned.toFixed(0)
              )}{' '}
              SRM
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
      </Row>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getSerumData,
    name: 'getSerumDataQuery',
    withOutSpinner: false,
    withTableLoader: false,
    fetchPolicy: 'network-only',
  })
)(TopBar)
