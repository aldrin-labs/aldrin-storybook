import { getRINCirculationSupply } from '@core/api'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import lightBird from '@icons/lightBird.svg'
import { SvgIcon } from '@sb/components'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import React, { useEffect, useState } from 'react'
import { compose } from 'recompose'
import {
  Block,
  BlockContentStretched,
  BlockSubtitle,
  BlockTitle,
} from '@sb/components/Block'
import { Cell, Row, StretchedBlock } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'
import { ShareButton } from '@sb/components/ShareButton'
import { BorderButton } from '../../Pools/components/Tables/index.styles'
import {
  BigNumber,
  LastPrice,
  Number,
  StatsBlock,
  StatsBlockItem,
} from '../Staking.styles'
import locksIcon from './assets/lockIcon.svg'
import pinkBackground from './assets/pinkBackground.png'
import { useTotalStakedTokens } from '@sb/dexUtils/staking/useTotalStakedTokens'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'

interface StatsComponentProps {
  getDexTokensPricesQuery: { getDexTokensPrices: DexTokensPrices[] }
}

const SHARE_TEXT = `I stake my $RIN on @Aldrin_Exchange with 192% APY!
Don't miss your chance!`

const StatsComponent: React.FC<StatsComponentProps> = (
  props: StatsComponentProps
) => {
  const { getDexTokensPricesQuery } = props
  const [RINCirculatingSupply, setCirculatingSupply] = useState(0)
  const connection = useConnection()
  const { wallet } = useWallet()
  const isPriceIncreasing = true

  const [totalStaked, refreshTotalStaked] = useTotalStakedTokens({
    wallet,
    connection,
  })

  useEffect(() => {
    const getRINSupply = async () => {
      const CCAICircSupplyValue = await getRINCirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const tokenPrice = getDexTokensPricesQuery.getDexTokensPrices[0].price
  const totalStakedUSD = tokenPrice * totalStaked
  return (
    <>
      <Row>
        <Cell colMd={6}>
          <Block icon={locksIcon}>
            <BlockContentStretched>
              <BlockTitle>Total Staked</BlockTitle>
              <BigNumber>
                <InlineText color="success">
                  {stripByAmountAndFormat(totalStaked)}
                </InlineText>{' '}
                RIN
              </BigNumber>
              <Number>{stripByAmountAndFormat(totalStakedUSD)}</Number>
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
                  <ShareButton text={SHARE_TEXT}></ShareButton>
                  {/* <BorderButton
                    target="_blank"
                    href={
                      'https://twitter.com/intent/tweet?text=I+stake+my+%24RIN+on+%40Aldrin_Exchange+with+192%25+APY%21%0D%0A%0D%0ADon%27t+miss+your+chance%21'
                    }
                    borderColor={'#fbf2f2'}
                    borderRadius="3rem"
                  >
                    Share
                    <SvgIcon src={lightBird} style={{ marginLeft: '1rem' }} />
                  </BorderButton> */}
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
                    <Number>${stripByAmount(tokenPrice)}</Number>
                    <InlineText
                      color={isPriceIncreasing ? 'success' : 'error'}
                      size="xs"
                    >
                      ▲ 125.00%
                    </InlineText>
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
                  <Number>112,252 RIN</Number>
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
