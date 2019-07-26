import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
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
  width: 300,
  height: 300
}

@withTheme()

class DonutChartWitoutTheme extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelPlaceholder: '',
    data: [],
    thicknessCoefficient: 10,
    colors: defaultColors,
    colorLegendWhidh: 150,
  }
  state: State = {
    data: [],
    value: null,
    colorsWithRandom: [],
    chartSize: 0,
    sizeKey: 1,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
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
      colorLegendWhidh,

      chartWidth,
      chartHeight,
      vertical,
      chartValueVariant,

      removeLabels
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

    return (
      <ChartWithTitle key={sizeKey}>
        {!removeLabels && <LabelContainer>
            <Typography variant="h4">
              {value ? value.label : labelPlaceholder || ''}
            </Typography>
          </LabelContainer>
        }

        <ChartWithLegend vertical={vertical}>
          {colorLegend && !isEmpty && (
            <ColorLegendContainer width={colorLegendWhidh}>
              <SDiscreteColorLegend
                width={colorLegendWhidh}
                items={data.map((d) => `${d.label} - ${d.realValue.toFixed(1)}%`)}
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

                width={chartWidth || DEFAULT_CHART_SIZE.width}
                height={chartHeight || DEFAULT_CHART_SIZE.height}
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

                width={chartWidth || DEFAULT_CHART_SIZE.width}
                height={chartHeight || DEFAULT_CHART_SIZE.height}
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

export const DonutChart = DonutChartWitoutTheme

export default DonutChart
