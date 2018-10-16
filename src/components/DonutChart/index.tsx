import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import { RadialChart, GradientDefs, makeVisFlexible } from 'react-vis'
import { withTheme } from '@material-ui/core/styles'

import { 
  Props,
  State,
  DonutPiece,
  InputRecord,
  gradient,
  } from './types'
import {
  ChartContainer,
  ValueContainer,
  LabelContainer,
  ChartWrapper,
} from './styles'

const FlexibleChart = makeVisFlexible(RadialChart)

class DonutChartWitoutTheme extends Component<Props, State> {
  static defaultProps: Props = {
    radius: 100,
    thickness: 20,
    gradients: [['#335ecc', '#2193b0']]
  }
  state: State = {
    data: [],
    value: null,
  }

  componentDidMount = () => {
    this.setState({ data: this.getDataFromImput(this.props.data) })
  }

  getDataFromImput = (inputData: InputRecord[]) =>
    inputData.map((record: InputRecord, index: number) => ({
      angle: record.realValue,
      label: record.label,
      realValue: record.realValue,
      gradientIndex: (index % 5) + 1,
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
    const { value, data } = this.state

    const { 
      radius,
      thickness,
      labelPlaceholder,
      gradients,
    } = this.props

    return (
      <ChartContainer>
        <LabelContainer>
          <Typography variant="display1">
            {value ? value.label : labelPlaceholder || ''}
          </Typography>
        </LabelContainer>
        <ChartWrapper>
          <FlexibleChart
            data={data}
            radius={radius}
            innerRadius={radius - thickness}
            animation={true}
            colorType={'literal'}
            getColor={(d) => `url(#${d.gradientIndex})`}
            onValueMouseOver={(v: DonutPiece) => this.onValueMouseOver(v)}
            onSeriesMouseOut={() => this.onSeriesMouseOut()}
            style={{
              strokeWidth: 0,
            }}
          >
            <ValueContainer value={value}>
              <Typography variant="display2">
                {value ? `${value.realValue}%` : '_'}
              </Typography>
            </ValueContainer>
            <GradientDefs>
              {gradients.map((pair: gradient, index: number) => (
                <linearGradient id={index.toString()} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={pair[0]} opacity={0.6} />
                  <stop offset="100%" stopColor={pair[1]} opacity={0.6} />
                </linearGradient>
              ))}
              <linearGradient id="1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#335ecc" opacity={0.6} />
                <stop offset="100%" stopColor="#2193b0" opacity={0.6} />
              </linearGradient>
              <linearGradient id="2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#07c61b" opacity={0.6} />
                <stop offset="100%" stopColor="#17b27c" opacity={0.6} />
              </linearGradient>
              <linearGradient id="3" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ce549d" opacity={0.6} />
                <stop offset="100%" stopColor="#ce39bd" opacity={0.6} />
              </linearGradient>
              <linearGradient id="4" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f05011" opacity={0.6} />
                <stop offset="100%" stopColor="#f59519" opacity={0.6} />
              </linearGradient>
              <linearGradient id="5" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#CAC531" opacity={0.6} />
                <stop offset="100%" stopColor="#F3F9A7" opacity={0.6} />
              </linearGradient>
            </GradientDefs>
          </FlexibleChart>
        </ChartWrapper>
      </ChartContainer>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart
