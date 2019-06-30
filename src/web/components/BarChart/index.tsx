import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import _ from 'lodash'
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  HorizontalBarSeries,
  XYPlot,
  XAxis,
  YAxis,
  Hint,
} from 'react-vis'
import { withTheme } from '@material-ui/styles'

import { IProps, IState, Items, IValue, IChart } from './types'

import { LegendContainer } from '../cssUtils'
import { CentredContainer } from '@sb/styles/cssUtils'

import {tickPercentageFormatter, tickLabelFormatter} from '../Utils/barChartUtils'

import {
  Container,
  ChartTooltip,
  StyledDiscreteColorLegend,
  ScrollContainer,
  axisStyle,
  barSeriesStyles,
  flexibleXYPlotMargine
} from './styles'

class BarChartComponent extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
     minColumnWidth: 20,
     bottomMargin: 5,
  }

  state = {
    value: { x: null, y: null },
  }
  
  onValueMouseOver = (value: IValue) => this.setState({ value })
  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const {
      showPlaceholder,
      showCustomPlaceholder,
      placeholderElement,
      charts,
      alwaysShowLegend,
      minColumnWidth,
      hideDashForToolTip,
      animated = false,
      bottomMargin,
      theme,
      xAxisVertical,
      height,
      customAxisStyleObject,
      customBarSeriesStyles = {},
      yType,
      xDomain,
      color
    } = this.props

    const { value } = this.state 
     
    const DataArr = charts[0].data;
    const percentageValuesArray = [];
    const labelValuesArray = [];

    for(let i = 0; i < DataArr.length; i++){
      labelValuesArray.push( DataArr[i].y);
      percentageValuesArray.push( DataArr[i].x);
    }  

    const items: Items[] = charts.map((chart: IChart) => {
      const { title, color } = chart
      return { title, color }
    })

    const uniqueXLengh = (data: any[]) => {
      const uniqueLength = _.uniqBy(data, 'x').length
      if (uniqueLength > data.length)
        console.warn('There are duplicate x indices in the input')
      return uniqueLength
    }

    const minWidth =
      Math.max.apply(null, charts.map((chart) => uniqueXLengh(chart.data))) *
      minColumnWidth

    const axisStyleWithTheme = axisStyle({
      stroke: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      textColor: theme.palette.grey.dark,
      ticks: { stroke: 'transparent'},
      line: { stroke: 'transparent' },
      fontSize: '12px', //theme.typography.fontSize,
      textTransform: 'uppercase',
    })

    const Charts = charts.map((chart: IChart, chartIndex: number) => {
      const { color, data, isHorizontal = false } = chart
      
      const BarSeries = isHorizontal ? HorizontalBarSeries : VerticalBarSeries 

      return (
        <BarSeries
          style={{ ...barSeriesStyles, ...customBarSeriesStyles }}
          onSeriesMouseOut={this.onSeriesMouseOut}
          onValueMouseOver={this.onValueMouseOver}
          key={chartIndex}
          data={DataArr}
          color={color}
          animation={animated && 'wobbly'}
        />
      )
    })



    return (
      <ScrollContainer height={130}>
        <Container height={130} minWidth={minWidth}>
          {showCustomPlaceholder ? (
            placeholderElement
          ) : (
              <FlexibleXYPlot
                onMouseLeave={this.onSeriesMouseOut}
                yType={yType}      
                xDomain={xDomain}  
                margin={{bottomMargin, ...flexibleXYPlotMargine}} 
              >
                {alwaysShowLegend && (
                  <LegendContainer transition={theme.transitions.duration.short} style={{ display: 'none' }}>
                    <StyledDiscreteColorLegend
                      orientation="horizontal"
                      fontFamily={theme.typography.fontFamily}
                      textColor={theme.palette.text.primary}
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
                    ]}
                    color={theme.palette.action.disabledBackground}
                  />
                ) : (
                    [
                      <YAxis
                        animation={animated && 'gentle'}
                        style={axisStyleWithTheme}
                        tickValues={[0, 1, 2]}
                        tickFormat={() => tickLabelFormatter(labelValuesArray)}
                        top={-20}
                        key="y"
                      />,

                      <YAxis
                        animation={animated && 'gentle'}
                        style={axisStyleWithTheme}
                        orientation={'right'}
                        right={50}
                        key="yright"
                        top={-20}
                        tickValues={[0, 1, 2, 3, 4]}
                        tickFormat={()=>tickPercentageFormatter(percentageValuesArray)}
                      />,
                      <HorizontalBarSeries
                        animation={animated && 'gentle'}
                        key="chart"
                        data={DataArr}
                        color={color}
                        style={{ ...barSeriesStyles, ...customBarSeriesStyles, padding: '0px' }}
                      />,
                     //...Charts,
                    ]
                  )}

                {value.x === null || value.y === null ? null : (
                  <Hint value={value}>
                    <ChartTooltip>
                      <Typography variant="h5">{`${value.x} ${
                        hideDashForToolTip ? '' : '-'
                        } ${value.y}%`}</Typography>
                    </ChartTooltip>
                  </Hint>
                )}
              </FlexibleXYPlot>
            )}
        </Container>
      </ScrollContainer>
    )
  }
}

export const BarChart = withTheme()(BarChartComponent)
export default BarChart
