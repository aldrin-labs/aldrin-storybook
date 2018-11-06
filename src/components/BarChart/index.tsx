import React, { Component } from 'react'
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  Hint,
} from 'react-vis'

import {
  IProps,
  IState,
  Items,
  IValue,
  IChart,
} from './types'

import { LegendContainer } from '../cssUtils'

import {
  Container,
  ChartTooltip,
  StyledDiscreteColorLegend,
  ScrollContainer,
} from './styles'

const axisStyle = {
  ticks: {
    padding: '1rem',
    stroke: '#fff',
    opacity: 0.75,
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 100,
  },
  text: { stroke: 'none', fill: '#4ed8da', fontWeight: 600, opacity: 1 },
}
export class BarChart extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    minColumnWidth: 20,
  }

  state = {
    value: { x: null, y: null },
  }

  onValueMouseOver = (value: IValue) => this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const {
      showPlaceholder,
      charts,
      height,
      alwaysShowLegend,
      minColumnWidth,
      hideDashForToolTip,
      animated = false,
      xAxisVertical,
    } = this.props
    const { value } = this.state

    const ITEMS: Items[] = []
    const minWidth = Math.min(charts[0].data.length, charts[1].data.length) * minColumnWidth

    const Charts = charts.map((chart: IChart, chartIndex: number) => {
      const { color, title, data } = chart
      ITEMS.push({ title, color })

      return (
        <VerticalBarSeries
          style={{ cursor: 'pointer' }}
          onSeriesMouseOut={this.onSeriesMouseOut}
          onValueMouseOver={this.onValueMouseOver}
          key={chartIndex}
          data={data}
          color={color}
          animation={animated && 'wobbly'}
        />
      )
    })
    return (
      <ScrollContainer height={height}>
        <Container
          height={height}
          minWidth={minWidth}
        >
          <FlexibleXYPlot onMouseLeave={this.onSeriesMouseOut} xType="ordinal" margin={{ bottom: 55}}>
            {alwaysShowLegend && (
              <LegendContainer>
                <StyledDiscreteColorLegend orientation="horizontal" items={ITEMS} />
              </LegendContainer>
            )}
            {showPlaceholder ? (
              <VerticalBarSeries
                animation={animated && 'gentle'}
                key="chart"
                data={[
                  { x: 'Q1', y: 10 },
                  { x: 'Q2', y: 5 },
                  { x: 'Q3', y: 15 },
                  { x: 'Q4', y: 25 },
                  { x: 'Q5', y: 20 },
                ]}
                color="rgba(91, 96, 102, 0.7)"
              />
            ) : (
              [
                <YAxis
                  animation={animated && 'gentle'}
                  style={axisStyle}
                  key="y"
                />,
                <XAxis
                  animation={animated && 'gentle'}
                  style={axisStyle}
                  key="x"
                  tickLabelAngle={xAxisVertical ? -90 : 0}
                />,
                ...Charts,
              ]
            )}

            {value.x === null || value.y === null ? null : (
              <Hint value={value}>
                <ChartTooltip>{`${value.x} ${hideDashForToolTip ? '' : '-'} ${value.y}%`}</ChartTooltip>
              </Hint>
            )}
          </FlexibleXYPlot>
        </Container>
      </ScrollContainer>
    )
  }
}

export default BarChart
