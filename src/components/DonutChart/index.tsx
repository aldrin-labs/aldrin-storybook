import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import {
  RadialChart,
  GradientDefs,
  makeVisFlexible,
  DiscreteColorLegend,
} from 'react-vis'
import { withTheme } from '@material-ui/core/styles'
import { darken } from '@material-ui/core/styles/colorManipulator'
import _ from 'lodash'
import { getRandomColor } from './utils'

import { Props, State, DonutPiece, InputRecord } from './types'
import {
  ChartContainer,
  ValueContainer,
  LabelContainer,
  LebelVraper,
  ChartWrapper,
  SDiscreteColorLegend,
  ChartWithLegend,
} from './styles'
import defaultColors from './colors'

const FlexibleChart = makeVisFlexible(RadialChart)

class DonutChartWitoutTheme extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelPlaceholder: '',
    data: [
      {
        label: 'Default 1',
        realValue: 50,
      },
      {
        label: 'Default 2',
        realValue: 50,
      },
    ],
    radius: 100,
    hightCoefficient: 16,
    widthCoefficient: 6,
    thicknessCoefficient: 10,
    colors: defaultColors,
  }
  state: State = {
    data: [],
    value: null,
    colorsWithRandom: [],
  }

  componentDidMount = () => {
    this.setState({ data: this.getDataFromImput(this.props.data) })
    this.setState({colorsWithRandom : this.getColorsWithRandom(this.props.colors, this.props.data.length)})
  }

  getColorsWithRandom = ( colors: string[], dataLengh ) => {
    return [
    ...colors, ...(_.range(dataLengh - colors.length)).map(() =>
      getRandomColor()
    ),
  ]
}

  getDataFromImput = (inputData: InputRecord[]) =>
    inputData.map((record: InputRecord, index: number) => ({
      angle: record.realValue,
      label: record.label,
      realValue: record.realValue,
      colorIndex: index,
    }))

  onValueMouseOver = (value: DonutPiece) => {
    const { data, value: stateValue } = this.state
    if (stateValue && stateValue.label === value.label) return

    const index = data.findIndex((d) => d.label === value.label)
    const newData = data.slice().map((d) => ({ ...d, opacity: 0.1 }))
    newData.splice(index, 1, {
      ...data[index],
      opacity: 1,
    })

    this.setState({ value, data: newData })
  }

  onSeriesMouseOut = () => {
    this.setState({ value: null, data: this.getDataFromImput(this.props.data) })
  }

  render() {
    const {
      value,
      data,
      colorsWithRandom,
    } = this.state

    const {
      radius,
      thickness,
      labelPlaceholder,
      colors,
      colorLegend,
      theme,
      isSizeFlexible,
      hightCoefficient,
      widthCoefficient,
      thicknessCoefficient,
    } = this.props



    const FlexibleRadius = isSizeFlexible
      ? Math.min(
          window.innerWidth / hightCoefficient,
          window.innerHeight / widthCoefficient
        )
      : radius

    const innerRadius = thickness
      ? FlexibleRadius - thickness
      : FlexibleRadius - FlexibleRadius / thicknessCoefficient

    return (
      <ChartWithLegend>
        {colorLegend && (
          <SDiscreteColorLegend
            width={250}
            items={data.map((d) => d.label)}
            colors={data.map(
              (d, index) => colorsWithRandom[index]
            )}
            textColor={theme.typography.body1.color}
          />
        )}
        <ChartContainer>
          <LebelVraper>
            <LabelContainer>
              <Typography variant="h4">
                {value ? value.label : labelPlaceholder || ''}
              </Typography>
            </LabelContainer>
          </LebelVraper>
          <ChartWrapper>
            <FlexibleChart
              data={data}
              radius={FlexibleRadius}
              innerRadius={innerRadius}
              animation={true}
              colorType={'literal'}
              getColor={(d) => `url(#${d.colorIndex})`}
              onValueMouseOver={(v: DonutPiece) => this.onValueMouseOver(v)}
              onSeriesMouseOut={() => this.onSeriesMouseOut()}
              style={{
                strokeWidth: 0,
              }}
            >
              <ValueContainer opacity={value !== undefined}>
                <Typography variant="h3">
                  {value ? `${value.realValue}%` : '\u2063'}
                </Typography>
              </ValueContainer>
              <GradientDefs>
                {colorsWithRandom.map((color: string, index: number) => (
                  <linearGradient
                    id={index.toString()}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} opacity={0.6} />
                    <stop offset="100%" stopColor={darken(color, 0.3)} opacity={0.6} />
                  </linearGradient>
                ))}
              </GradientDefs>
            </FlexibleChart>
          </ChartWrapper>
        </ChartContainer>
      </ChartWithLegend>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart
