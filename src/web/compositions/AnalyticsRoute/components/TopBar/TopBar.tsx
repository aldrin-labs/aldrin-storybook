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
import CCAILogo from '@icons/auth0Logo.svg'

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
import { CCAICirculationSupply } from '../CirculationSupply'

export const ccaiData = {
  totalySupply: 50000000,
  burned: 0,
  circulatingSupply: 50000000,
}

const TopBar = ({ theme }: { theme: Theme }) => {
  const { market } = useMarket() || { market: { tickSize: 8 } }

  let circulatingSupply = ccaiData.circulatingSupply - ccaiData.burned
  let totalySupply = ccaiData.totalySupply - ccaiData.burned

  let pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)

  return (
    <>
      <Row height={'100%'}>
        <SvgIcon
          style={{ marginRight: '1rem' }}
          height={'50%'}
          width={'auto'}
          src={CCAILogo}
        />
        <SerumWhiteTitle theme={theme}>CCAI</SerumWhiteTitle>
        <SRMPriceBlock
          theme={theme}
          pricePrecision={3}
          exchange={{ symbol: 'serum' }}
          marketType={0}
          symbol={'CCAI_USDC'}
        />
      </Row>
      <Row>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Marketcap</TopBarTitle>
          <SRMMarketCap
            theme={theme}
            pricePrecision={3}
            exchange={{ symbol: 'serum' }}
            marketType={0}
            symbol={'CCAI_USDC'}
            circulatingSupply={circulatingSupply}
          />
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Total Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              {formatNumberToUSFormat(totalySupply.toFixed(0))} CCAI
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Circulating Supply</TopBarTitle>
          <BlockContainer>
            <Text theme={theme}>
              <CCAICirculationSupply /> CCAI
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
        <SerumTitleBlockContainer>
          <TopBarTitle theme={theme}>CCAI Burned</TopBarTitle>
          <BlockContainer>
            {' '}
            <Text theme={theme}>
              {formatNumberToUSFormat(ccaiData.burned.toFixed(0))} CCAI
            </Text>
          </BlockContainer>
        </SerumTitleBlockContainer>
      </Row>
    </>
  )
}

export default TopBar
