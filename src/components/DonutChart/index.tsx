import React, { Component } from 'react'
import styled from 'styled-components'
import {
  RadialChart,
  GradientDefs
} from 'react-vis'

import { Props, State, DonutPiece } from './types'
import { withTheme } from '@material-ui/core/styles'

class DonutChartWitoutTheme extends Component<Props, State> {
  constructor(props: Props) {

    super(props)

    this.state = {
      data: [],
      value: null,
    }
  }

  onValueMouseOver = (value: DonutPiece) => {
    const { data } = this.state
    console.log(value)
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
    const { value } = this.state
    const { data } = this.props

    const {
      width,
      height,
      radius,
      showLabels,
      labelsRadiusMultiplier,
      labelsStyle,
      theme,
    } = this.props

    const hasCustomColors = data.some((a) => !!a.color || !!a.style)
    const background = theme.palette.background.paper
    const textColor: string = theme.palette.getContrastText(background)

    return (
        <RadialChart
          data={data}
          animation
          width={width || 200}
          height={height || 200}
          radius={radius || 100}
          innerRadius={radius ? radius - 10 : 90}
  //        colorType={hasCustomColors ? 'literal' : 'linear'}
          onValueMouseOver={(v: DonutPiece) => this.setState({ value: v })}
          onSeriesMouseOut={() => this.setState({ value: null })}
          labelsRadiusMultiplier={1}
          labelsStyle={labelsStyle || {}}
        >
          <TextContainer textColor={textColor}>
            { this.state.value && this.state.value.title }
          </TextContainer>
          <GradientDefs>
            <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="red" stopOpacity={0.4} />
              <stop offset="100%" stopColor="blue" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="blue" stopOpacity={0.4} />
              <stop offset="100%" stopColor="green" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="yellow" stopOpacity={0.4} />
              <stop offset="100%" stopColor="green" stopOpacity={0.3} />
            </linearGradient>
          </GradientDefs>
        </RadialChart>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart

const TextContainer = styled.div`
  color: ${(props: { textColor: string }) => 
    props.textColor
  };
  margin: 0px;
  position: relative;
  top: -50%;
  transform: translate(0,-50%);
  text-align: center;
`