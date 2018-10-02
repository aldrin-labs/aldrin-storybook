import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Chart from '@components/BitcoinPriceChart/Chart'
import BarChart from '@components/BitcoinPriceChart/BarChart'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import bounce from '@icons/bounce.svg'
import diez from '@icons/diez.svg'
import time from '@icons/time.svg'
import { firstDataSet, secondDataSet, thirdDataSet } from '@components/BitcoinPriceChart/barChartDataMock'

class BitcoinPriceChart extends Component {
  render() {
    return (
      <MainWrapper>
        <MainContainer>
          <PricesContainer>
            <PricesColumn>
              <div>
                <Value
                  style={{
                    color: '#4ed8da',
                    fontSize: '25px',
                    fontWeight: '500',
                  }}
                >
                  9 713, 19
                </Value>
                <PriceLabel>Current Rate USD </PriceLabel>
              </div>
              <div>
                <Value
                  style={{
                    color: '#fff',
                  }}
                >
                  5 808 B
                </Value>
                <PriceLabel> Volume 24h USD</PriceLabel>
              </div>
            </PricesColumn>

            <PricesColumn>
              <div>
                <Value
                  style={{
                    color: '#ff687a',
                  }}
                >
                  904.79
                </Value>
                <PriceLabel>Low: 25 Mar 2017</PriceLabel>
              </div>

              <div>
                <Value
                  style={{
                    color: '#fff',
                  }}
                >
                  164.3 B
                </Value>
                <PriceLabel>Market Cap #1 USD</PriceLabel>
              </div>
            </PricesColumn>

            <PricesColumn>
              <div>
                <Value
                  style={{
                    color: '#65c000',
                  }}
                >
                  20078,10
                </Value>
                <PriceLabel>High: 17 Dec 2017</PriceLabel>
              </div>

              <div>
                <Value
                  style={{
                    color: '#65c000',
                  }}
                >
                  + 748,77%
                </Value>
                <PriceLabel> Change in Year USD</PriceLabel>
              </div>
            </PricesColumn>
          </PricesContainer>

          <Chart
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              left: '-1rem ',
              minWidth: '100%',
            }}
          />
        </MainContainer>

        <SideContainer>
          <SideContainerDataBox>
            <div>
              <SideContainerData>
                {' '}
                <span style={{ padding: '0 1rem' }}>
                  <SvgIcon src={diez} width={24} />
                </span>
                120.495
              </SideContainerData>
              <SideContainerDataDetail>
                Number of transactions(24h)
              </SideContainerDataDetail>
              <BarChart data={firstDataSet} />
            </div>

            <Hr />

            <div>
              <SideContainerData>
                {' '}
                <span style={{ padding: '0 1rem' }}>
                  <SvgIcon src={bounce} width={24} />
                </span>12.5%
              </SideContainerData>
              <SideContainerDataDetail>
                %Earned from TFees
              </SideContainerDataDetail>
              <BarChart data={secondDataSet} />
            </div>

            <Hr />

            <div>
              <SideContainerData>
                {' '}
                <span style={{ padding: '0 1rem' }}>
                  <SvgIcon src={time} width={24} />
                </span>8.33 Minutes
              </SideContainerData>
              <SideContainerDataDetail>
                Avg Time between blocks(24h)
              </SideContainerDataDetail>
              <BarChart data={thirdDataSet} />
            </div>

            <Btn to="/profile">Open BTC Profile</Btn>
          </SideContainerDataBox>
        </SideContainer>
      </MainWrapper>
    )
  }
}

const MainWrapper = styled.div`
  display: flex;
  height: 125%;
  position: relative;
`

const MainContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 70%;

  @media (max-width: 630px) {
    width: 100%;
  }
`
const SideContainer = styled.div`
  position: absolute;
  right: -1.2rem;
  z-index: 0;
  top: -3.1rem;
  width: 30%;
  height: calc(100% + 33px + 32px);
  border-radius: 0px 3px 3px 0px;

  @media (max-width: 630px) {
    display: none;
  }

  @media (max-width: 1100px) and (min-width: 996px) {
    width: 33%;
  }
`

const SideContainerDataBox = styled.div`
  height: calc(100% - 16px);
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`
const SideContainerData = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #4ed8da;
`

const SideContainerDataDetail = styled.div`
  padding-left: 3.5rem;
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`

const Btn = styled(Link)`
  border-radius: 3px;
  background-color: #393e44;
  border-color: transparent;
  color: #fff;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 10px 0;
  margin: -2rem auto 0 auto;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  width: 12em;
`

const Hr = styled.div`
  margin-left: 1rem;
  margin-top: -2rem;
  width: 80%;
  height: 1px;
  max-height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
`

const PricesContainer = styled.div`
  width: 100%;
  height: 30%;
  margin-top: 2rem;
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  //border-bottom: 1px solid #fff;

  @media (max-width: 480px) {
    height: 45%;
    flex-flow: wrap;
    border-bottom: none;
  }
`
const PricesColumn = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding-bottom: 1rem;
`
const Value = styled.div`
  margin: 0 auto;
  height: 33px;
  font-family: Roboto, sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 33px;
  letter-spacing: normal;
  text-align: left;
`
const PriceLabel = styled.div`
  height: 19px;
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`

export default BitcoinPriceChart
