import React, { Component } from 'react'
import styled from 'styled-components'
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
    const newData = this.props.data.map((record: InputRecord, index: number) => (
      {
        angle: record.realValue,
        label: record.label,
        realValue: record.realValue,
        gradientIndex: 1
      }
    ))
    this.setState({ data: newData })
    console.log(this.state.data)
  }

  onValueMouseOver = (value: DonutPiece) => {
    const { data } = this.state
    if (this.state.value && this.state.value.label === value.label) return

    const index = data.findIndex((d) => d.label === value.label)
    const newData = data.slice().map((d) => ({ ...d, opacity: 0.5 }))
    newData.splice(index, 1, {
      ...data[index],
      opacity: 1,
      style: { stroke: '#fff', strokeWidth: '0.5px' },
    })

    this.setState({ value, data: newData })
  }

  onSeriesMouseOut = () => {
    this.setState({ value: null, data: this.props.data })
  }

  render() {
    const { value, data } = this.state

    const {
      width,
      height,
      radius,

      theme,
    } = this.props

    const hasCustomColors = data.some((a) => !!a.color || !!a.style)
    const background = theme.palette.background.paper
    const textColor: string = theme.palette.getContrastText(background)

    return (
      <>
        <RadialChart
          data={data}
          animation
          width={width || 200}
          height={height || 200}
          radius={radius || 100}
          innerRadius={radius ? radius - 15 : 90}
          colorType={'literal'}
          getColor={(d) => `url(#${d.gradientIndex})`}
          onValueMouseOver={(v: DonutPiece) => this.setState({ value: v })}
          onSeriesMouseOut={() => this.setState({ value: null })}
          style={{strokeWidth: 0}}
        >
          <ValueContainer textColor={textColor}>
            { this.state.value && this.state.value.realValue }
          </ValueContainer>
          <GradientDefs>
            <linearGradient id="1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="red"  />
              <stop offset="100%" stopColor="blue" />
            </linearGradient>
            <linearGradient id="2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="blue"  />
              <stop offset="100%" stopColor="green"  />
            </linearGradient>
            <linearGradient id="3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="yellow"  />
              <stop offset="100%" stopColor="green" />
            </linearGradient>
          </GradientDefs>
        </RadialChart>
      </>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart

const ValueContainer = styled.div`
  font-size: 20;
  color: ${(props: { textColor: string }) => 
    props.textColor
  };
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0,-50%);
  text-align: center;
`