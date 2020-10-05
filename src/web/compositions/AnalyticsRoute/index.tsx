import React from 'react'
import styled from 'styled-components'
import CardsPanel from '@sb/compositions/Chart/components/CardsPanel'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'
import { useMarket } from '@sb/dexUtils/markets'
import {
  NavBarLink
} from '@sb/components/PortfolioMainAllocation/PortfolioMainAllocation.styles'


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
  background-color: #1b2028;
  margin: 0.7rem;
  border-radius: 0.8rem;
  border: 1px solid #424b68;
  font-family: DM Sans;
  font-size: 1.12rem;
  letter-spacing: 0.06rem;
  padding-top: 4rem;
  padding-left: 3rem;
  text-transform: uppercase;
  color: white;
`

export const Text = styled.div`
  font-family: DM Sans;
  font-weight: bold;
  font-size: 1.5rem;
  text-transform: uppercase;
`
const Line = styled.div`
    position:absolute;
    top:${(props) => props.top || 'none'};
    bottom:${(props) => props.bottom || 'none'};
    width: 100%;
    height: .1rem;
    background: #424B68;
`

const AnalyticsRoute = (props) => {
const {theme} = props;
const {market}= useMarket();

    let quantityPrecision = market?.minOrderSize && getDecimalCount(market.minOrderSize);
    let pricePrecision = market?.tickSize && getDecimalCount(market.tickSize);

  return (
    <RowContainer
      style={{
        background: '#0E1016',
        height: '100%',
        paddingLeft: '.8%',
        paddingRight: '.8%',
      }}
    >
      <ChartGridContainer xs={12} theme={theme}>
        <CardsPanel

          {...{
            pair:'BTC_USDT', // url
            view: 'default',
            theme,
            marketType:0, // url
            quantityPrecision, // chart
            pricePrecision,
            activeExchange:'serum', // serum
          }}
        />
       
      </ChartGridContainer> <Line top={'5.7rem'}/>
      <RowContainer style={{ height: 'calc(96% - 2rem)', flexDirection: 'column',paddingBottom:'6rem' }}>
        <Block>
          srm marketcap
          
        </Block>
        <Block>
          srm totaly supply
        </Block>
        <Block>
          srm burned
        </Block>
        <Block>
          srm burned
        </Block>
        <Block>
          srm last price
        </Block>
        <Block>
          srm circulating supply
        </Block>
        <Block>
          srm pending burn
        </Block>
        <Block>
          srm pending burn
        </Block>
        <Block width={'62.5%'} height={'84.4%'} />
      </RowContainer>
      <RowContainer>
      <Line bottom={'5.7rem'}/>
      </RowContainer>
      <Link border={'none'} 
      style={{color:'#09ACC7'}} to="/vbn/">cryptocurrencies.ai</Link>
    </RowContainer>
  )
}

export default compose(withTheme())(AnalyticsRoute)
