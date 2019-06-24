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

    // console.log('barSeriesStyles', barSeriesStyles)
    // console.log('customBarSeriesStyles', customBarSeriesStyles)

    const { value } = this.state
    
    console.log(charts);

    // const mockedChangedXY = [
    //   { x: 55, y: 'Social' },
    //   { x: 25, y: 'Index' },
    //   { x: 20, y: 'Portfolio' },
    // ]

    //  const percentageValuesArray = ['50%', '30%','10%']
    //  const labelValuesArray = ['Portfolio', 'Index','Social']

    

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
      textColor: theme.palette.secondary.main,
      fontSize: theme.typography.fontSize,
      ticks: { stroke: 'transparent'},
      line: { stroke: 'transparent' },
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
          data={data}
          color={color}
          animation={animated && 'wobbly'}
        />
      )
    })



    return (
      <ScrollContainer height={200}>
        <Container height={200} minWidth={minWidth}>
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
                       // tickValues={[0, 1, 2]}
                       // tickFormat={() => tickLabelFormatter(labelValuesArray)}
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
                       // tickValues={[0, 1, 2, 3, 4]}
                        // tickFormat={()=>tickPercentageFormatter(percentageValuesArray)}
                      />,
                      // <HorizontalBarSeries
                      //   animation={animated && 'gentle'}
                      //   key="chart"
                      //   data={data}
                      //   color={color}
                      //   style={{ ...barSeriesStyles, ...customBarSeriesStyles }}
                      // />
                     ...Charts,
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
