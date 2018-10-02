import * as React from 'react'
import styled from 'styled-components'
import {
  RadialChart,
  Hint,
  makeVisFlexible,
  DiscreteColorLegend,
} from 'react-vis'

import { Props, State, PiePiece } from './PieChart.types'
import { customAquaScrollBar } from '@styles/cssUtils'

const FlexibleRadialChart = makeVisFlexible(RadialChart)

export default class PieChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
      value: null,
    }
  }

  onValueMouseOver = (value: PiePiece) => {
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
    const { value } = this.state
    const { data } = this.props

    const {
      width,
      height,
      radius,
      innerRadius,
      flexible,
      withHints,
      showLabels,
      labelsRadiusMultiplier,
      labelsStyle,
      colorLegend,
      theme,
    } = this.props

    const hasCustomColors = data.some((a) => !!a.color || !!a.style)
    const colorIsNumber = data.every((a) => typeof a.color === 'number')
    const background = theme? theme.palette.background.paper : '#393e44'
    const textColor: string = theme? theme.palette.getContrastText(background) : '#fff'
    const FLRadialChart = () => (
      <>
        {colorLegend && (
          <SDiscreteColorLegend
            width={400}
            items={data
              // .concat(data, data, data, data, data)
              .map((d) => d.title)}
            colors={data
              // .concat(data, data, data, data, data)
              .map((d) => d.color)}
            textColor={textColor}
          />
        )}
        <FlexibleRadialChart
          data={data}
          animation
          innerRadius={innerRadius || 0}
          colorType={hasCustomColors ? 'literal' : 'linear'}
          onValueMouseOver={this.onValueMouseOver}
          onSeriesMouseOut={this.onSeriesMouseOut}
          showLabels={showLabels}
          labelsRadiusMultiplier={labelsRadiusMultiplier || 1.1}
          labelsStyle={labelsStyle || {}}
        >
          {value &&
            !!withHints && (
              <Hint value={value}>
                <ChartTooltip
                  textColor={textColor}
                  background={background}
                >{`${
                  value.labelCurrency ? value.labelCurrency : ''
                } ${value.label} ${value.realValue}`}</ChartTooltip>
              </Hint>
            )}
          {value &&
            !withHints && (
              <ChartTooltip
                textColor={textColor}
                background={background}
              >{`${value.label} ${value.realValue}`}</ChartTooltip>
            )}
        </FlexibleRadialChart>
      </>
    )

    const NonFLRadialChart = () => (
      <>
        {colorLegend && (
          <SDiscreteColorLegend
            width={400}
            items={data
              // .concat(data, data, data, data, data)
              .map((d) => d.title)}
            colors={data
              // .concat(data, data, data, data, data)
              .map((d) => d.color)}
            textColor={textColor}
          />
        )}
        <RadialChart
          data={data}
          animation
          width={width || 200}
          height={height || 200}
          radius={radius || 200}
          innerRadius={innerRadius || 0}
          colorType={hasCustomColors ? 'literal' : 'linear'}
          onValueMouseOver={(v: PiePiece) => this.setState({ value: v })}
          onSeriesMouseOut={() => this.setState({ value: null })}
          showLabels={showLabels}
          labelsRadiusMultiplier={labelsRadiusMultiplier || 1.1}
          labelsStyle={labelsStyle || {}}
        >
          {value &&
            !!withHints && (
              <Hint value={value}>
                <ChartTooltip
                  textColor={textColor}
                  background={background}
                >{`${value.label} ${
                  value.realValue
                }`}</ChartTooltip>
              </Hint>
            )}
          {value &&
            !withHints && (
              <ChartTooltip
                  textColor={textColor}
                  background={background}
                >{`${value.label} ${value.realValue}`}</ChartTooltip>
            )}
        </RadialChart>
      </>
    )

    if (flexible) {
      return <FLRadialChart />
    }

    return <NonFLRadialChart />
  }
}

const ChartTooltip = styled.span`
  color: ${(props: { textColor: string }) => props.textColor};
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  text-align: left;
  border-radius: 3px;
  background: ${(props: {background: string}) =>
      props.background
    };
  box-shadow: 0 2px 6px 0 #0006;
  padding: 8px;
  width: 100px;
  height: 100px;
`
const SDiscreteColorLegend = styled(DiscreteColorLegend)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${customAquaScrollBar} & .rv-discrete-color-legend-item {
    width: 50%;
    display: flex;
    align-items: center;
    color: ${(props: { textColor: string }) => props.textColor};
  }
  & .rv-discrete-color-legend-item__color {
    height: 14px;
    width: 14px;
    border-radius: 50%;
  }
  & .rv-discrete-color-legend-item__title {
    text-align: left;
    font-family: Roboto, sans-serif;
  }
`
