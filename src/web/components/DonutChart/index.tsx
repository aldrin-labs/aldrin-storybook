import React, { Component } from 'react'
import { Typography, withWidth } from '@material-ui/core'
import { isWidthUp, isWidthDown } from '@material-ui/core/withWidth'
import { withTheme } from '@material-ui/styles'
import { isEqual, range } from 'lodash-es'

import { getRandomColor } from './utils'
import { Props, State, DonutPiece, InputRecord } from './types'
import {
  ChartContainer,
  LabelContainer,
  ChartWithTitle,
  SDiscreteColorLegend,
  ChartWithLegend,
  ColorLegendContainer,
  ColorLegendPercentContainer,
} from './styles'
import { defaultColors, emptyColor } from './colors'
import { FlexibleChart } from './FlexibleChart'

const getDataFromImput = (inputData: InputRecord[]) => {
  const data = inputData
    .map((record: InputRecord) => ({
      angle: record.realValue,
      label: record.label,
      realValue: record.realValue,
    }))
    .filter((piece) => piece.realValue > 0)
    .map((record, index: number) => ({ ...record, colorIndex: index }))

  return data
}

const getColorsWithRandom = (colors: string[], dataLengh: number) => {
  return [
    ...colors,
    ...range(dataLengh - colors.length).map(() => getRandomColor()),
  ]
}

const DEFAULT_CHART_SIZE = {
  width: 150,
  height: 150,
  strokeWidth: 13,
}
const DEFAULT_COLOR_LEGEND_WIDTH = 150

@withTheme()
class DonutChartWitoutTheme extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelPlaceholder: '',
    data: [],
    thicknessCoefficient: 10,
    colors: defaultColors,
    colorLegendWidth: DEFAULT_COLOR_LEGEND_WIDTH,
  }
  state: State = {
    data: [],
    value: null,
    colorsWithRandom: [],
    chartSize: 0,
    sizeKey: 1,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    console.log(nextProps.colors)
    const newData = getDataFromImput(nextProps.data)
    if (!isEqual(prevState.data, newData)) {
      return {
        sizeKey: -prevState.sizeKey,
        data: newData,
        colorsWithRandom: getColorsWithRandom(
          nextProps.colors,
          nextProps.data.length
        ),
      }
    }
    return {}
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.shuffle)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.shuffle)
  }

  shuffle = () => {
    this.setState((prevState: State) => ({ sizeKey: -prevState.sizeKey }))
  }

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
    this.setState({ value: null, data: getDataFromImput(this.props.data) })
  }

  render() {
    const { value, data, colorsWithRandom, sizeKey } = this.state

    const {
      labelPlaceholder,
      colorLegend,
      theme,
      thicknessCoefficient,
      colorLegendWidth,

      chartWidth,
      chartHeight,
      vertical,
      chartValueVariant,

      removeLabels,
      width,
      strokeWidth,
    } = this.props

    // show chart withoutData UI
    let isEmpty = false
    if (data.length === 0) isEmpty = true

    const emptyData = {
      angle: 1,
      label: '1',
      realValue: 1,
      colorIndex: 0,
    }

    let donutSize =
      chartWidth && chartHeight
        ? {
            width: chartWidth,
            height: chartHeight,
            strokeWidth,
          }
        : DEFAULT_CHART_SIZE

    if (window.outerWidth > 2244) {
      donutSize = {
        width: 300,
        height: 300,
        strokeWidth: 30,
      }
    } else if (window.outerWidth > 1920) {
      donutSize = {
        width: 200,
        height: 200,
        strokeWidth: 16,
      }
    } else if (isWidthDown('md', width)) {
      donutSize = {
        width: 100,
        height: 100,
        strokeWidth: 8,
      }
    }

    let responsiveLegendWidth = colorLegendWidth
    if (
      responsiveLegendWidth === DEFAULT_COLOR_LEGEND_WIDTH &&
      isWidthUp('xl', width)
    ) {
      responsiveLegendWidth = 250
    }

    return (
      <ChartWithTitle key={sizeKey}>
        {!removeLabels && (
          <LabelContainer>
            <Typography variant="h4">
              {value ? value.label : labelPlaceholder || ''}
            </Typography>
          </LabelContainer>
        )}

        <ChartWithLegend vertical={vertical}>
          {colorLegend && !isEmpty && (
            <ColorLegendContainer width={responsiveLegendWidth}>
              <SDiscreteColorLegend
                width={responsiveLegendWidth}
                items={data.map((d) => (
                  <ColorLegendPercentContainer>
                    <span>{d.label}</span>
                    <span>{d.realValue.toFixed(1)}%</span>
                  </ColorLegendPercentContainer>
                ))}
                colors={data.map((d, index) => colorsWithRandom[index])}
                textColor={theme.typography.body1.color}
              />
            </ColorLegendContainer>
          )}
          <ChartContainer>
            {data.length ? (
              <FlexibleChart
                data={data}
                onValueMouseOver={(v: DonutPiece) => this.onValueMouseOver(v)}
                onSeriesMouseOut={() => this.onSeriesMouseOut()}
                value={value}
                colorsWithRandom={colorsWithRandom}
                thicknessCoefficient={thicknessCoefficient}
                isEmpty={isEmpty}
                {...donutSize}
                valueVariant={chartValueVariant}
                removeValueContainer={removeLabels}
              />
            ) : (
              <FlexibleChart
                data={[emptyData]}
                onValueMouseOver={() => undefined}
                onSeriesMouseOut={() => undefined}
                value={value}
                colorsWithRandom={[emptyColor]}
                thicknessCoefficient={thicknessCoefficient}
                isEmpty={isEmpty}
                {...donutSize}
                valueVariant={chartValueVariant}
                removeValueContainer={removeLabels}
              />
            )}
          </ChartContainer>
        </ChartWithLegend>
      </ChartWithTitle>
    )
  }
}

const wrappedDonutChart = withWidth()(DonutChartWitoutTheme)

export const DonutChart = wrappedDonutChart

export default wrappedDonutChart
