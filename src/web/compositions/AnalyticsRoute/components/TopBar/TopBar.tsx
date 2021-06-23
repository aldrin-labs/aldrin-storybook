import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

import { Theme } from '@material-ui/core'
import { getSerumData } from '@core/graphql/queries/chart/getSerumData'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'

import {
  formatNumberToUSFormat,
  roundAndFormatNumber,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import { useMarket, useMarkPrice } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import SvgIcon from '@sb/components/SvgIcon'
import SrmLogo from '@icons/srmLogo.svg'
import CCAILogo from '@icons/auth0Logo.svg'

import {
  Row,
  BlockContainer,
  GreenTitle,
  TokenTitleBlockContainer,
  TokenWhiteTitle,
  Text,
  TopBarTitle,
} from '../../index.styles'

import PriceBlock from './tokenPriceBlock'
import MarketCap from './tokenMarketCap'
import { getCCAICirculationSupply } from '../CirculationSupply'
import { PoolsPrices } from '@sb/compositions/Pools/index.types'

export const ccaiData = {
  totalySupply: 50000000,
  burned: 0,
  circulatingSupply: 50000000,
}

const TopBar = ({
  theme,
  getDexTokensPricesQuery,
}: {
  theme: Theme
  getDexTokensPricesQuery: { getDexTokensPrices: PoolsPrices[] }
}) => {
  const [CCAICirculatingSupply, setCirculatingSupply] = useState(0)
  const [showGreen, updateToGreen] = useState(false)
  const [previousPrice, savePreviousPrice] = useState(0)

  useEffect(() => {
    const getCCAISupply = async () => {
      const CCAICircSupplyValue = await getCCAICirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getCCAISupply()
  }, [])

  const { market } = useMarket() || { market: { tickSize: 8 } }

  const CCAIPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === 'CCAI'
    )[0].price || 0

  useEffect(() => {
    if (CCAIPrice > previousPrice) {
      updateToGreen(true)
    } else {
      updateToGreen(false)
    }

    savePreviousPrice(CCAIPrice)
  }, [CCAIPrice])

  let totalySupply = ccaiData.totalySupply - ccaiData.burned
  const CCAImarketcap = CCAICirculatingSupply * CCAIPrice
  return (
    <>
      <Row height={'100%'}>
        <SvgIcon
          style={{ marginRight: '1rem' }}
          height={'50%'}
          width={'auto'}
          src={CCAILogo}
        />
        <TokenWhiteTitle theme={theme}>CCAI</TokenWhiteTitle>
        <GreenTitle
          style={{ color: showGreen ? '#A5E898' : '#F26D68' }}
          theme={theme}
        >
          {`$${formatNumberToUSFormat(
            roundAndFormatNumber(CCAIPrice, 4, false)
          )}`}
        </GreenTitle>
      </Row>
      <Row>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Marketcap</TopBarTitle>{' '}
          <Text theme={theme}>
            ${formatNumberToUSFormat(CCAImarketcap.toFixed(0))}
          </Text>
        </TokenTitleBlockContainer>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Total Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(totalySupply.toFixed(0))} CCAI
            </Text>
          </BlockContainer>
        </TokenTitleBlockContainer>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Circulating Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(CCAICirculatingSupply.toFixed(0))} CCAI
            </Text>
          </BlockContainer>
        </TokenTitleBlockContainer>
      </Row>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 10000,
  })
)(TopBar)
