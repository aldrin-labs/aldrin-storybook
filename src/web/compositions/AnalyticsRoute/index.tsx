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
  background-color: ${(props)=>props.backgroundColor || theme.palette.white.block};
  margin: 0.7rem;
  border-radius: 0.8rem;
  border: 1px solid ${(props)=>props.border || theme.palette.grey.block};
  font-family: DM Sans;
  font-size: 1.12rem;
  letter-spacing: 0.06rem;
  padding-top: 4rem;
  padding-left: 3rem;
  text-transform: uppercase;
  color: ${(props)=>props.color || theme.palette.text.grey};
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
    background: ${(props) => props.background ||theme.palette.grey.block};
`
const Link = styled.a`
display: block;
  width: fit-content;
  color: ${(props)=>props.color || theme.palette.blue.serum};

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

const AnalyticsRoute = (props) => {
const {theme} = props;
const {market}= useMarket();

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
        <Block >
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
      <Line bottom={'5.7rem'}/>        <Link  href="https://cryptocurrencies.ai/">cryptocurrencies.ai</Link>
    
      </RowContainer>

  
    </RowContainer>
  )
}

export default compose(withTheme())(AnalyticsRoute)
