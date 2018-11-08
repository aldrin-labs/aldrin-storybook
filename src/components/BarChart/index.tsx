import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import _ from 'lodash'
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  Hint,
} from 'react-vis'
import { withTheme } from '@material-ui/core/styles'

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
  axisStyle,
} from './styles'

class BarChartComponent extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    minColumnWidth: 20,
    bottomMargin: 55,
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
      bottomMargin,
      theme,
    } = this.props
    const { value } = this.state

    const items: Items[] = charts.map((chart: IChart, chartIndex: number) => {
      const { title, color } = chart
      return { title, color }
    })

    const uniqueXLengh = (data: any[]) => {
      const uniqueLength = _.uniqBy(data, 'x').length
      if (uniqueLength > data.length) console.warn('There are duplicate x indices in the input')
      return uniqueLength
    }

    const minWidth = Math.max.apply(null, charts.map(chart => uniqueXLengh(chart.data))) * minColumnWidth

    const axisStyleWithTheme = axisStyle({
      stroke: theme.palette.text.primary,
      textColor: theme.palette.secondary.main,
      fontSize: theme.typography.fontSize,
    })

    const Charts = charts.map((chart: IChart, chartIndex: number) => {
      const { color, data } = chart
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
          <FlexibleXYPlot onMouseLeave={this.onSeriesMouseOut} xType="ordinal" margin={{ bottom: bottomMargin }}>
            {alwaysShowLegend && (
              <LegendContainer
                backgroundColor={theme.palette.background.default}
                textColor={theme.palette.text.primary}
                transition={theme.transitions.duration.short}
              >
                <StyledDiscreteColorLegend
                  orientation="horizontal"
                  fontFamily={theme.typography.fontFamily}
                  items={items}
                />
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
                color={theme.palette.action.disabledBackground}
              />
            ) : (
              [
                <YAxis
                  animation={animated && 'gentle'}
                  style={axisStyleWithTheme}
                  key="y"
                />,
                <XAxis
                  animation={animated && 'gentle'}
                  style={axisStyleWithTheme}
                  key="x"
                  tickLabelAngle={xAxisVertical ? -90 : 0}
                />,
                ...Charts,
              ]
            )}

            {value.x === null || value.y === null ? null : (
              <Hint value={value}>
                <ChartTooltip>
                  <Typography variant="title">{`${value.x} ${hideDashForToolTip ? '' : '-'} ${value.y}%`}</Typography>
                </ChartTooltip>
              </Hint>
            )}
          </FlexibleXYPlot>
        </Container>
      </ScrollContainer>
    )
  }
}

export const BarChart = withTheme()(BarChartComponent)
export default BarChart
