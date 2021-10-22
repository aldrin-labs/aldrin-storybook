import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { Theme } from '@sb/types/materialUI'
import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'

import { SvgIcon } from '@sb/components'

import lightBird from '@icons/lightBird.svg'

import {
  Block,
  BlockContentStretched,
  BlockSubtitle, BlockTitle
} from '../../../components/Block'
import { Cell, StretchedBlock } from '../../../components/Layout'
import { InlineText } from '../../../components/Typography'
import {
  BigNumber,
  LastPrice, Number,
  StatsBlock,
  StatsBlockItem
} from '../Staking.styles'
import locksIcon from './assets/lockIcon.svg'
import pinkBackground from './assets/pinkBackground.png'
import { stripByAmountAndFormat, stripByAmount } from '@core/utils/chartPageUtils'
import { BorderButton } from '../../Pools/components/Tables/index.styles'


const StatsComponent = ({
  isMobile,
  theme,
  getDexTokensPricesQuery,
}: {
  isMobile: boolean
  theme: Theme
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}) => {
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)
  const isPriceIncreasing = true

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const tokenPrice = getDexTokensPricesQuery.getDexTokensPrices[0].price

  return (
    <>
      <Row>
        <Cell colMd={6}>
          <Block icon={locksIcon}>
            <BlockContentStretched>
              <BlockTitle>Total Staked</BlockTitle>
              <BigNumber><InlineText color="success">10,000,000</InlineText> RIN</BigNumber>
              <Number>$1.53b</Number>
            </BlockContentStretched>
          </Block>
        </Cell>
        <Cell colMd={6}>
          <Block backgroundImage={pinkBackground}>
            <BlockContentStretched>
              <BlockTitle>Estimated Rewards</BlockTitle>
              <BigNumber>193%</BigNumber>
              <StretchedBlock>
                <Number>APY</Number>
                <div>
                  <BorderButton
                    target="_blank"
                    href={
                      'https://twitter.com/intent/tweet?text=I+stake+my+%24RIN+on+%40Aldrin_Exchange+with+192%25+APY%21%0D%0A%0D%0ADon%27t+miss+your+chance%21'
                    }
                    borderColor={'#fbf2f2'}
                    borderRadius="3rem"
                  >
                    Share
                    <SvgIcon src={lightBird} style={{ marginLeft: '1rem' }} />
                  </BorderButton>

                </div>
              </StretchedBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
      <Row>
        <Cell>
          <Block>
            <BlockContentStretched>
              <BlockTitle>RIN Stats </BlockTitle>
              <StatsBlock>
                <StatsBlockItem>
                  <BlockSubtitle>Price</BlockSubtitle>
                  <LastPrice>
                    <Number>
                      ${stripByAmount(tokenPrice)}
                    </Number>
                    <InlineText color={isPriceIncreasing ? 'success' : 'error'} size="xs">▲ 125.00%</InlineText>
                  </LastPrice>

                </StatsBlockItem>
                <StatsBlockItem>
                  <BlockSubtitle>Circulating Supply</BlockSubtitle>
                  <Number>
                    {stripByAmountAndFormat(RINCirculatingSupply)} RIN
                  </Number>
                </StatsBlockItem>
                <StatsBlockItem>
                  <BlockSubtitle>Daily Rewards</BlockSubtitle>
                  <Number>
                    112,252 RIN
                  </Number>
                </StatsBlockItem>
              </StatsBlock>
            </BlockContentStretched>
          </Block>
        </Cell>
      </Row>
    </>
  )
}

export default compose(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'getDexTokensPricesQuery',
    fetchPolicy: 'cache-and-network',
    variables: { symbols: ['RIN'] },
    withoutLoading: true,
    pollInterval: 60000,
  })
)(StatsComponent)
