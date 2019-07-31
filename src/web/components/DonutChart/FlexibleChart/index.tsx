import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import {
  RadialChart,
  GradientDefs,
  makeVisFlexible,
} from 'react-vis'
import { darken } from '@material-ui/core/styles/colorManipulator'

const Chart = makeVisFlexible(RadialChart)

import { Props, State, DonutPiece } from './types'
import {

  ChartWrapper,
  ValueContainer
} from './styles'

const DEFAULT_CHART_STROKE_WIDTH = 10

export class FlexibleChart extends Component<Props, State>{

  state: State = {
    chartRadius: 0,
    doReportSize: false,
    elementRef: '',
  }

  componentDidMount() {
    window.addEventListener('resize', this.shuffle)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.shuffle)
  }

  shuffle = () => {
    this.setState({doReportSize: true})
  }

  refCallback = element => {
    this.setState({elementRef: element})
    this.setRadius(element)
  }

  setRadius = element => {
    if (element) {
      this.setState({chartRadius:
      Math.min(
        element.getBoundingClientRect().width,
        element.getBoundingClientRect().height
      ) / 2.2})
      this.setState({doReportSize: false})
    }
  }

  componentDidUpdate() {
    if (this.state.doReportSize) {
      this.setRadius(this.state.elementRef)
    }
  }

  render() {
    const {
      data,
      value,
      thicknessCoefficient,
      colorsWithRandom,
      isEmpty,
      onValueMouseOver,
      onSeriesMouseOut,

      width,
      height,
      strokeWidth,
      valueVariant,

      removeValueContainer
    } = this.props

    return (
      <ChartWrapper ref={this.refCallback}>
        <Chart
        data={data}
        radius={this.state.chartRadius}
        innerRadius={this.state.chartRadius * (1 - 1 / thicknessCoefficient)}
        animation={true}
        colorType={'literal'}
        getColor={(d: any) => `url(#${d.colorIndex})`}
        onValueMouseOver={(v: DonutPiece) => onValueMouseOver(v)}
        onSeriesMouseOut={() => onSeriesMouseOut()}
        style={{
          strokeWidth: strokeWidth ? strokeWidth : DEFAULT_CHART_STROKE_WIDTH
        }}

        width={width}
        height={height}
        >
          {!removeValueContainer && <ValueContainer isOpacity={value !== undefined}>
            <Typography variant={valueVariant ? valueVariant : 'h3'}>
              {
                isEmpty
                ? 'Empty'
                : value ? `${value.realValue}%` : '\u2063'
              }
            </Typography>
          </ValueContainer>}
        <GradientDefs>
          {colorsWithRandom.map((color: string, index: number) => (
            <linearGradient
              key={index}
              id={index.toString()}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} opacity={1} />
              <stop offset="100%" stopColor={color} opacity={1} />
            </linearGradient>
          ))}
        </GradientDefs>
        </Chart>
      </ChartWrapper>
  )}

}

