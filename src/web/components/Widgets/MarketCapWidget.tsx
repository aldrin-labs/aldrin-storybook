import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from '@sb/components/Elements/Button'
import AreaChart from '@sb/components/AreaChart'
import Widget from '@sb/components/Widget'
import { intervalsData } from './marketCapMocks'
import { yearData } from '@sb/mocks/chartMocks'

export const intervals = ['YTD', '1D', '7D', '1M', '1Y']

export default class MarketCapWidget extends React.Component<> {
  constructor(props) {
    super(props)

    this.state = {
      currentInterval: '1D',
    }
  }

  onChangeCurrentInterval(i: number) {
    this.setState({
      currentInterval: intervals[i],
    })
  }

  render() {
    const { currentInterval } = this.state

    // index for fake data random look in chart
    let indexOfSliceOfYearData =
      intervals.findIndex((el) => {
        return el === currentInterval
      }) + 1

    return (
      <Widget heading="Market Cap">
        <ShortcutDesc>Intervals</ShortcutDesc>
        <BtnsContainer>
          {intervals.map((interval, i) => (
            <Button
              style={{
                width: '15%',
              }}
              key={i}
              title={interval}
              active={interval === currentInterval}
              onClick={() => this.onChangeCurrentInterval(i)}
            />
          ))}
        </BtnsContainer>

        <InfoBlock>
          <InfoItem>
            <InfoItemKey>{this.state.currentInterval} Vol:</InfoItemKey>
            <InfoItemValue>{intervalsData[currentInterval].vol}</InfoItemValue>
          </InfoItem>
        </InfoBlock>

        <InfoBlock>
          <InfoItem>
            <InfoItemKey>{this.state.currentInterval} high:</InfoItemKey>
            <InfoItemValue style={{ color: '#65c000' }}>
              {intervalsData[currentInterval].high}
            </InfoItemValue>
          </InfoItem>

          <InfoItem>
            <InfoItemKey>{this.state.currentInterval} low:</InfoItemKey>
            <InfoItemValue style={{ color: '#ff687a' }}>
              {intervalsData[currentInterval].low}
            </InfoItemValue>
          </InfoItem>
        </InfoBlock>

        <BigNumbersContainer>
          <Dot />
          <BigNumberContainer>
            <BigNumber
              style={{
                color: '#fff',
              }}
            >
              552.8 B
            </BigNumber>

            <Detail>Current rate USD</Detail>
          </BigNumberContainer>

          <BigNumberContainer>
            <BigNumber style={{ color: '#ff687a' }}>-1,67%</BigNumber>

            <Detail>Change in day</Detail>
          </BigNumberContainer>
        </BigNumbersContainer>

        <AreaChart data={yearData.slice(0, indexOfSliceOfYearData * 7)} />

        <Btn to="/chart">Open chart</Btn>
      </Widget>
    )
  }
}

const Btn = styled(Link)`
  border-radius: 3px;
  background-color: #282c2f;
  border-color: transparent;
  color: #fff;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  width: 15em;
  margin: 0 auto;
`
const ShortcutDesc = styled.span`
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin: 8px 0;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin-bottom: 16px;
    margin-right: 16px;
  }
`

const Dot = styled.div`
  background-color: #4ed8da;
  width: 8px;
  height: 8px;
  border-radius: 50%;
`

const Detail = styled.span`
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  text-align: left;
  color: #ffffff;
`

const BigNumber = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 35px;
  text-align: left;
`

const BigNumberContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  justify-content: space-around;
  align-items: center;
`

const BigNumbersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const InfoItemValue = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  letter-spacing: 0.7px;
  text-align: left;
  color: #fff;
  padding-left: 16px;
`

const InfoItemKey = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  letter-spacing: 0.7px;
  text-align: left;
  color: #ffffff80;
`

const InfoItem = styled.div`
  margin-right: 40px;
`

const InfoBlock = styled.div`
  display: flex;
  margin-top: 16px;
`
