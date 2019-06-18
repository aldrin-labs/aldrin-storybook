import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import _ from 'lodash'
import {
  FlexibleXYPlot,
  VerticalBarSeries,
  HorizontalBarSeries,
  XAxis,
  YAxis,
  Hint,
} from 'react-vis'
import { withTheme } from '@material-ui/styles'

import { IProps, IState, Items, IValue, IChart } from './types'

import { LegendContainer } from '../cssUtils'
import { CentredContainer } from '@sb/styles/cssUtils'

import {
  Container,
  ChartTooltip,
  StyledDiscreteColorLegend,
  ScrollContainer,
  axisStyle,
} from './styles'






class BarChartComponent extends Component<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    // minColumnWidth: 20,
    // bottomMargin: 55,
  }

  state = {
    value: { x: null, y: null },
    //y_tick_values: ['0-17', '18-25', '25-30', '30-45']
  }

    //   tickMapper(v) {
    //     return(
    //         <tspan>{this.state.y_tick_values[v]}</tspan>
    //     );
    // }



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
      customAxisStyleObject
    } = this.props

    const { value } = this.state
    
    const mockedChangedXY = [
      { x: 55, y: 'Social' },
      { x: 25, y: 'Index' },
      { x: 20, y: 'Portfolio' },
    ]
    const percentageValuesArray = ['50%', '30%','10%']
    const labelValuesArray = ['Portfolio', 'Index','social']

    function tickPercentageFormatter() {
      return (<tspan>
          {
            percentageValuesArray.map((item) => {
              return <tspan x="0" dy="50px">{item}</tspan>
            })
          }
      </tspan>);
    }


    function tickLabelFormatter() {
      return (<tspan>
          {
            labelValuesArray.map((item) => {
              return <tspan x="0" dy="50px">{item}</tspan>
            })
          }
      </tspan>);
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
      <ScrollContainer height={160}>
        <Container height={160} minWidth={minWidth}>
          {showCustomPlaceholder ? (
            placeholderElement
          ) : (
              <FlexibleXYPlot
                onMouseLeave={this.onSeriesMouseOut}
                yType="ordinal"
                xDomain={[0, 100]}
                margin={{ bottom: bottomMargin, right: 95, left: 95 }}
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
                        style={{  
                          ...axisStyleWithTheme,
                          ticks: {
                            ...axisStyleWithTheme.ticks,
                            stroke: 'transparent',
                          },
                          line: { stroke: 'transparent' },
                          
                        }}
                        tickValues={[0, 1, 2]}
                        tickFormat={tickLabelFormatter}

                        top={-20}

                        key="y"
                      />,

                      <YAxis
                      animation={animated && 'gentle'}
                      style={{
                          ...axisStyleWithTheme,
                          ticks: {
                            ...axisStyleWithTheme.ticks,
                            stroke: 'transparent',
                          },
                          line: { stroke: 'transparent' }
                        }}
                        orientation={'right'}
                        right={50}
                        key="yright"
                        top={-20}

                        tickValues={[0, 1, 2,3,4]}
                        tickFormat={tickPercentageFormatter}
                      />,
                      <HorizontalBarSeries
                        animation={animated && 'gentle'}
                        key="chart"
                        data={mockedChangedXY}
                        color={"#fff"}
                        style={{
                          rx: 10,
                          ry: 10,
                          height: 25,
                        }}
                      />
                      // ...Charts,
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
