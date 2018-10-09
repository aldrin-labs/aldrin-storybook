import React, { Component } from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import {
  RadialChart,
  GradientDefs
} from 'react-vis'

import { Props, State, DonutPiece, InputRecord } from './types'
import { withTheme } from '@material-ui/core/styles'

class DonutChartWitoutTheme extends Component<Props, State> {
  constructor(props: Props) {

    super(props)

    this.state = {

      data: [],
      value: null,
    }
  }

  componentDidMount = () => {
    this.setState({ data: this.getDataFromImput(this.props.data) })
  }

  getDataFromImput = (inputData: InputRecord[]) => (
    inputData.map((record: InputRecord, index: number) => (
      {
        angle: record.realValue,
        label: record.label,
        realValue: record.realValue,
        gradientIndex: index % 4 + 1
      }
    ))
  )

  onValueMouseOver = (value: DonutPiece) => {
    const { data } = this.state
    if (this.state.value && this.state.value.label === value.label) return

    const index = data.findIndex((d) => d.label === value.label)
    const newData = data.slice().map((d) => ({ ...d }))
    newData.splice(index, 1, {
      ...data[index],
      opacity: 1,
      gradientIndex: 0
    })

    this.setState({ value, data: newData })
  }

  onSeriesMouseOut = () => {
    this.setState({ value: null })
    this.setState({ data: this.getDataFromImput(this.props.data) })
  }

  render() {
    const { value, data } = this.state

    const {
      width,
      height,
      radius,
      thickness,
    } = this.props
    const WithDefaults = {
      width: width || 200,
      height: height || 200,
      radius: radius || 100,
      thickness: thickness || 20
    }
    return (
      <ChartContainer width={width? width : 200}>
        <LabelConteiner>
          <Typography variant='display1'>
            { value && value.label }
          </Typography>
        </LabelConteiner>
        <RadialChart
          data={data}
          width={WithDefaults.width}
          height={WithDefaults.height}
          radius={WithDefaults.radius}
          innerRadius={WithDefaults.radius - WithDefaults.thickness}
          colorType={'literal'}
          getColor={(d) => `url(#${d.gradientIndex})`}
          onValueMouseOver={(v: DonutPiece) => this.onValueMouseOver(v)}
          onSeriesMouseOut={() => this.onSeriesMouseOut()}
          style={{
            strokeWidth: 0
          }}
        >
          <ValueContainer>
            <Typography variant='display2'>
              { value && value.realValue }
            </Typography>
          </ValueContainer>
          <GradientDefs>
            <linearGradient id="1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#335ecc" opacity={0.6} />
              <stop offset="100%" stopColor="#2193b0" opacity={0.6} />
            </linearGradient>
            <linearGradient id="2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6dd000" opacity={0.6} />
              <stop offset="100%" stopColor="#2193b0" opacity={0.6} />
            </linearGradient>
            <linearGradient id="3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#06beb6" opacity={0.6} />
              <stop offset="100%" stopColor="#47bf53" opacity={0.6} />
            </linearGradient>
            <linearGradient id="4" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5B86E5" opacity={0.6} />
              <stop offset="100%" stopColor="#36D1DC" opacity={0.6} />
            </linearGradient>
            <linearGradient id="0" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#acb6e5" />
              <stop offset="50%" stopColor="#86fde8" />
              <stop offset="100%" stopColor="#acb6e5" />
            </linearGradient>
          </GradientDefs>
        </RadialChart>
      </ChartContainer>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart

const ChartContainer = styled.div`
  width: ${(props: {width: number}) =>
      props.width + 'px'
    };
`

const ValueContainer = styled.div`
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0,-50%);
  text-align: center;
  z-index: -1;
`

const LabelConteiner = styled.div`
  margin: 0px;
  position: relative;
  text-align: center;
  height: 90px;
`
