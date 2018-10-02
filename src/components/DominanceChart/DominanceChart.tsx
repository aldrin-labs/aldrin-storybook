import * as React from 'react'
import styled from 'styled-components'
import PieChart from '@components/PieChart'
import SvgIcon from '@components/SvgIcon/SvgIcon'
import mask from '../../icons/mask.svg'

const chartCoins = [
  { angle: 5, label: 'BCash', color: '#f9b057' },
  { angle: 30, label: 'Bitcoin', color: '#f9a626' },
  { angle: 5, label: 'NEO', color: '#0eb8e8' },
  { angle: 5, label: 'Ethereum', color: '#8c8c8c' },
  { angle: 15, label: 'Litecoin', color: '#a0a1a1' },
  { angle: 5, label: 'Stellar', color: '#86d301' },
  { angle: 5, label: 'Ripple', color: '#0099d4' },
  { angle: 5, label: 'Cardano', color: '#0c1e2c' },
  { angle: 25, label: 'Others', color: '#b6b8b8' },
]

export default class DominanceChart extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ChartWrapper>
          <PieChart
            data={chartCoins}
            innerRadius={80}
            width={256}
            height={256}
            radius={128}
          />
          <SvgIcon
            src={mask}
            width={185}
            height={185}
            style={{ position: 'absolute', borderRadius: '50%' }}
          />

          <ChartInnerText>
            100%
            <br />
            <span style={{ fontSize: '20px' }}>All Cryptos</span>
          </ChartInnerText>
        </ChartWrapper>

        <ChartInfoContainer>
          {chartCoins.map((coin) => {
            return (
              <ChartInfoBlock key={coin.label}>
                <ChartInfoCircle style={{ backgroundColor: coin.color }} />

                <ChartInfoDesc>{coin.label}</ChartInfoDesc>
              </ChartInfoBlock>
            )
          })}
        </ChartInfoContainer>
      </React.Fragment>
    )
  }
}

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 23px;
`

const ChartInfoDesc = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  color: #fff;
  padding-left: 7px;

  @media (max-width: 350px) {
    font-size: 16px;
  }

  @media (max-width: 700px) and (min-width: 630px) {
    font-size: 16px;
  }
  @media (max-width: 1120px) and (min-width: 996px) {
    font-size: 16px;
  }
`

const ChartInfoCircle = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  @media (max-width: 350px) {
    padding-right: 5px;
  }
`

const ChartInfoBlock = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
`

const ChartInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 40px;

  & > * {
    margin-bottom: 8px;
  }
`

const ChartInnerText = styled.span`
  max-width: 100px;
  font-family: Roboto, sans-serif;
  font-size: 28px;
  text-align: center;
  color: #ffffff;
  position: absolute;
`
