import { Theme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'

import SvgIcon from '@sb/components/SvgIcon'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useMarket } from '@sb/dexUtils/markets'

import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer/index'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  formatNumberToUSFormat,
  roundAndFormatNumber,
} from '@core/utils/PortfolioTableUtils'

import RINLogo from '@icons/RINLogo.svg'

import {
  BlockContainer,
  GreenTitle,
  Row,
  Text,
  TokenTitleBlockContainer,
  TokenWhiteTitle,
  TopBarTitle,
} from '../../index.styles'

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
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [CCAICirculatingSupply, setCirculatingSupply] = useState(0)
  const [showGreen, updateToGreen] = useState(false)
  const [previousPrice, savePreviousPrice] = useState(0)

  useEffect(() => {
    const getCCAISupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getCCAISupply()
  }, [])

  const { market } = useMarket() || { market: { tickSize: 8 } }

  const CCAIPrice =
    getDexTokensPricesQuery?.getDexTokensPrices?.filter(
      (el) => el.symbol === 'CCAI'
    )[0]?.price || 0

  useEffect(() => {
    if (CCAIPrice > previousPrice) {
      updateToGreen(true)
    } else {
      updateToGreen(false)
    }

    savePreviousPrice(CCAIPrice)
  }, [CCAIPrice])

  const totalySupply = ccaiData.totalySupply - ccaiData.burned
  const CCAImarketcap = CCAICirculatingSupply * CCAIPrice
  return (
    <>
      <Row height="100%">
        <SvgIcon
          style={{ marginRight: '1rem' }}
          height="50%"
          width="auto"
          src={RINLogo}
        />
        <TokenWhiteTitle theme={theme}>RIN</TokenWhiteTitle>
        <GreenTitle
          style={{ color: showGreen ? '#269F13' : '#F26D68' }}
          theme={theme}
        >
          {CCAIPrice === 0
            ? '-'
            : `$${formatNumberToUSFormat(
                roundAndFormatNumber(CCAIPrice, 4, false)
              )}`}
        </GreenTitle>
      </Row>
      <Row>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>RIN Marketcap</TopBarTitle>{' '}
          <Text theme={theme}>
            {CCAImarketcap === 0
              ? '-'
              : `$${formatNumberToUSFormat(CCAImarketcap.toFixed(0))}`}
          </Text>
        </TokenTitleBlockContainer>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>RIN Total Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(totalySupply.toFixed(0))} RIN
            </Text>
          </BlockContainer>
        </TokenTitleBlockContainer>
        <TokenTitleBlockContainer>
          <TopBarTitle theme={theme}>RIN Circulating Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(CCAICirculatingSupply.toFixed(0))} RIN
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
