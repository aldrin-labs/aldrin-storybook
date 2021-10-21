import React, { useEffect, useState } from 'react'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Theme } from '@sb/types/materialUI'
import { ADAPTIVE_UPPER_BLOCKS } from '../Staking.styles'
import { BlockTemplate } from '../../Pools/index.styles'
import { Text } from '@sb/compositions/Addressbook/index'
import { BorderButton } from '../../Pools/components/Tables/index.styles'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'

import RedArrow from '@icons/redTriangle.svg'
import GreenArrow from '@icons/greenTriangle.svg'
import lightBird from '@icons/lightBird.svg'
import locksIcon from '@icons/lockIcon.svg'
import { SvgIcon } from '@sb/components'
import { getCCAICirculationSupply } from '@sb/compositions/AnalyticsRoute/components/CirculationSupply'
import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import { compose } from 'recompose'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { conformsTo } from 'lodash'

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
      const CCAICircSupplyValue = await getCCAICirculationSupply()
      setCirculatingSupply(CCAICircSupplyValue)
    }
    getRINSupply()
  }, [])

  const tokenPrice = getDexTokensPricesQuery.getDexTokensPrices[0].price

  return (
    <Row
      direction={'column'}
      justify={'space-between'}
      width={isMobile ? '100%' : '49%'}
      height={isMobile ? 'auto' : '100%'}
    >
      <RowContainer
        direction={isMobile ? 'column' : 'row'}
        justify={'space-between'}
        height={isMobile ? 'auto' : '47%'}
      >
        <BlockTemplate
          style={ADAPTIVE_UPPER_BLOCKS({ isMobile })}
          theme={theme}
        >
          <RowContainer
            direction={'column'}
            justify={'space-between'}
            align={'flex-start'}
            height={'100%'}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
              Total Staked
            </Text>
            <Text fontFamily={'Avenir Next Bold'} fontSize={'3.5rem'}>
              <span style={{ color: '#53DF11' }}>10,000,000</span> RIN
            </Text>
            <RowContainer justify={'flex-start'} align={'flex-end'}>
              <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
                $1.53b
              </Text>
            </RowContainer>
          </RowContainer>
          <SvgIcon
            style={{ position: 'absolute', bottom: '5rem', right: '3rem' }}
            src={locksIcon}
            width={'11rem'}
            height={'auto'}
          />
        </BlockTemplate>
        <BlockTemplate
          style={ADAPTIVE_UPPER_BLOCKS({ isMobile, needBackground: true })}
          theme={theme}
        >
          <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
            Estimated Rewards
          </Text>
          <Text fontFamily={'Avenir Next Bold'} fontSize={'4rem'}>
            193%
          </Text>
          <RowContainer justify={'space-between'} align={'flex-end'}>
            <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
              APY
            </Text>
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
          </RowContainer>
        </BlockTemplate>
      </RowContainer>
      <BlockTemplate
        theme={theme}
        width={'100%'}
        height={isMobile ? '30rem' : '47%'}
        style={{ margin: isMobile ? '2rem 0' : '0', padding: '3rem' }}
        direction="column"
        align="flex-start"
        justify="space-between"
      >
        <Text fontFamily={'Avenir Next Demi'} fontSize={'2.3rem'}>
          RIN Stats
        </Text>
        <RowContainer justify="space-between">
          <Row direction="column" width="30%" align="flex-start">
            <Text fontSize="1.5rem" padding="0 0 2rem 0">
              Price
            </Text>
            <Row>
              <Text
                fontFamily={'Avenir Next Bold'}
                fontSize={'2.3rem'}
                padding={'0 1rem 0 0'}
              >
                ${stripByAmount(tokenPrice)}
              </Text>{' '}
              <SvgIcon
                src={isPriceIncreasing ? GreenArrow : RedArrow}
                width={'0.7rem'}
                height="auto"
              />
              <Text
                fontFamily={'Avenir Next Medium'}
                fontSize={'1.5rem'}
                color={isPriceIncreasing ? '#53DF11' : '#F69894'}
              >
                {' '}
                125.00%
              </Text>
            </Row>
          </Row>
          <Row direction="column" width="30%" align="flex-start">
            <Text fontSize="1.5rem" padding="0 0 2rem 0">
              Circulating Supply
            </Text>
            <Text fontFamily={'Avenir Next Bold'} fontSize={'2.3rem'}>
              {stripByAmountAndFormat(RINCirculatingSupply)} RIN
            </Text>
          </Row>
          <Row direction="column" width="30%" align="flex-start">
            <Text fontSize="1.5rem" padding="0 0 2rem 0">
              Daily Rewards{' '}
            </Text>
            <Text fontFamily={'Avenir Next Bold'} fontSize={'2.3rem'}>
              112,252 RIN{' '}
            </Text>
          </Row>
        </RowContainer>
      </BlockTemplate>
    </Row>
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
