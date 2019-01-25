import * as React from 'react'
import styled from 'styled-components'
import {
  XAxis,
  YAxis,
  VerticalGridLines,
  AreaSeries,
  FlexibleXYPlot,
  Crosshair,
} from 'react-vis'
import Highlight from '@sb/components/Highlight/Highlight'
import { IProfileChartProps, IProfileChartState } from '@core/types/ProfileTypes'
import { yearData } from '@sb/mocks/chartMocks'

function calculateMonths(v: number) {
  switch (v) {
    case 0:
      return 'Mar'

    case 6:
      return 'Apr'

    case 12:
      return 'May'

    case 18:
      return 'Jun'

    case 24:
      return 'Jul'

    case 30:
      return 'Aug'

    case 36:
      return 'Sep'

    case 42:
      return 'Oct'

    case 48:
      return 'Nov'

    case 54:
      return 'Dec'

    case 60:
      return 'Jan'

    case 66:
      return 'Feb'

    default:
      return 'Month'
  }
}

const chartBtns = ['1D', '7D', '1M', '3M', '1Y', 'YTD', 'ALL']

export default class ProfileChart extends React.Component<IProfileChartProps, IProfileChartState> {
  showSupplies: JSX.Element
  state: IProfileChartState = {
    activeChart: 4,
    lastDrawLocation: null,
    crosshairValues: [],
  }

  onChangeActiveChart = (index: number) => {
    this.setState({ activeChart: index })
  }

  _onNearestX = (value, { index }) => {
    this.setState({
      crosshairValues: yearData
        .map((d) => {
          if (d.x === index) {
            return d
          }
          return null
        })
        .filter(Boolean),
    })
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  render() {
    const { lastDrawLocation, crosshairValues } = this.state
    const { coin, style, height, marginTopHr } = this.props
    const { name = '', priceUSD = '' } = coin || {}

    const axisStyle = {
      ticks: {
        stroke: '#fff',
        opacity: 0.5,
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontWeight: 100,
      },
    }

    return (
      <SProfileChart style={style}>
        {/*TODO: need refactoring, need real data */}
        {this.showSupplies && (
          <SuppliesBlock>
            <SupplyBlock>
              <CurrentRate>{priceUSD || '9 713,19'}</CurrentRate>
              <SupplyDetail>Current rate USD</SupplyDetail>
            </SupplyBlock>

            <SupplyBlock>
              <CommonRate>{'5,808 B'}</CommonRate>
              <SupplyDetail>Volume 24h USD</SupplyDetail>
            </SupplyBlock>

            <SupplyBlock>
              <CommonRate>{'164,3 B'}</CommonRate>
              <SupplyDetail>Market Cap #1 USD</SupplyDetail>
            </SupplyBlock>

            <SupplyBlock>
              <SupplyLowRate>{'904,79'}</SupplyLowRate>
              <SupplyDetail>Low: 25 Mar 2017</SupplyDetail>
            </SupplyBlock>

            <SupplyBlock>
              <SupplyHighRate>{'20078,10'}</SupplyHighRate>
              <SupplyDetail>High: 17 Dec 2017</SupplyDetail>
            </SupplyBlock>

            <SupplyBlock>
              <SupplyHighRate>{'+748,77%'}</SupplyHighRate>
              <SupplyDetail>Change in year USD</SupplyDetail>
            </SupplyBlock>
          </SuppliesBlock>
        )}

        <Chart
          style={{
            height
          }}
        >
          <FlexibleXYPlot
            animation
            onMouseLeave={this._onMouseLeave}
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right,
              ]
            }
          >
            <XAxis
              hideLine
              tickFormat={(v: number) => calculateMonths(v)}
              tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              labelValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              style={axisStyle}
            />
            <VerticalGridLines
              style={{ stroke: 'rgba(134, 134, 134, 0.5)' }}
              tickTotal={12}
              tickFormat={(v: number) => calculateMonths(v)}
              tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              labelValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
            />
            <YAxis hideTicks hideLine />
            <AreaSeries
              onNearestX={this._onNearestX}
              data={yearData}
              style={{
                fill: 'rgba(133, 237, 238, 0.35)',
                stroke: 'rgb(78, 216, 218)',
                strokeWidth: '3px',
              }}
            />

            <Crosshair values={crosshairValues}>
              <div
                style={{
                  background: '#4c5055',
                  color: '#4ed8da',
                  padding: '5px',
                  fontSize: '14px',
                }}
              >
                <p>
                  {crosshairValues.map((v) => calculateMonths(v.x)).join(' ')}:{' '}
                  {crosshairValues.map((v) => v.y.toFixed(2)).join(' ')}
                </p>
              </div>
            </Crosshair>

            <Highlight
              onBrushEnd={(area) => {
                this.setState({
                  lastDrawLocation: area,
                })
              }}
            />
          </FlexibleXYPlot>
        </Chart>

        <Hr marginTopHr={marginTopHr} />

        <BtnsContainer>
          {chartBtns.map((chartBtn, i) => {
            return (
              <ChartBtn
                onClick={() => this.onChangeActiveChart(i)}
                style={
                  i === this.state.activeChart
                    ? { backgroundColor: '#4ed8da', color: '#4c5055' }
                    : {}
                }
                key={chartBtn}
              >
                {chartBtn}
              </ChartBtn>
            )
          })}
        </BtnsContainer>
      </SProfileChart>
    )
  }
}

const Chart = styled.div`
  width: 100%;
  min-height: 5em;
  margin-top: 24px;
`

const Hr = styled.hr`
  margin: ${(props: { marginTopHr: string }) =>
    props.marginTopHr
      ? `${props.marginTopHr} auto 0 auto;`
      : '45px auto 0 auto;'};
  width: 95%;
  height: 0.5px;
  border-radius: 1px;
  background-color: #ffffff;
`

const BtnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 20px auto;
`

const ChartBtn = styled.button`
  border-radius: 2px;
  background-color: #4c5055;
  margin-right: 16px;
  padding: 10px;
  border: none;
  outline: none;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #4ed8da;
  cursor: pointer;
`

const SProfileChart = styled.div`
  width: 100%;
  padding: 0 16px;
  border-radius: 3px;
  background-color: #393e44;
  min-height: 38vh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  border-top: 1px solid #fff;
`

const SuppliesBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 16px auto 0 auto;
`

const SupplyBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 56px;
  margin-right: 35px;
`

const CurrentRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 25px;
  font-weight: 500;
  color: #4ed8da;
`

const CommonRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #ffffff;
`

const SupplyLowRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #ff687a;
`

const SupplyHighRate = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 20px;
  color: #65c000;
`

const SupplyDetail = styled.span`
  opacity: 0.5;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin-top: 4px;
`
