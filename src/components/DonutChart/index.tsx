import React, { Component } from 'react'
import { Typography } from '@material-ui/core'

import { withTheme } from '@material-ui/styles'
import _ from 'lodash'
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
    isEmpty: false,
    sizeKey: 1,
  }

  componentDidMount = () => {
    this.setState({ data: this.getDataFromImput(this.props.data) })
    this.setState({
      colorsWithRandom: this.getColorsWithRandom(
        this.props.colors,
        this.props.data.length
      ),
    })
    window.addEventListener('resize', this.shuffle)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.shuffle)
  }

  shuffle = () => {
    this.setState((prevState: State) => ({ sizeKey: -prevState.sizeKey }))
  }

  getColorsWithRandom = (colors: string[], dataLengh: number) => {
    return [
      ...colors,
      ..._.range(dataLengh - colors.length).map(() => getRandomColor()),
    ]
  }

  getDataFromImput = (inputData: InputRecord[]) => {
    const data = inputData
      .map((record: InputRecord) => ({
        angle: record.realValue,
        label: record.label,
        realValue: record.realValue,
      }))
      .filter((piece) => piece.realValue > 0)
      .map((record, index: number) => ({ ...record, colorIndex: index }))
    if (data.length === 0) this.setState({ isEmpty: true })
    return data
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
    this.setState({ value: null, data: this.getDataFromImput(this.props.data) })
  }

  refSizeMesure = (element) => {
    if (element) {
      this.setState({ chartSize: element.getBoundingClientRect })
    }
  }

  render() {
    const { value, data, colorsWithRandom, isEmpty, sizeKey } = this.state

    const {
      labelPlaceholder,
      colorLegend,
      theme,
      thicknessCoefficient,
      colorLegendWhidh,
    } = this.props

    const emptyData = {
      angle: 1,
      label: '1',
      realValue: 1,
      colorIndex: 0,
    }

    return (
      <ChartWithTitle key={sizeKey}>
        <LabelContainer>
          <Typography variant="h4">
            {value ? value.label : labelPlaceholder || ''}
          </Typography>
        </LabelContainer>
        <ChartWithLegend>
          {colorLegend && !isEmpty && (
            <ColorLegendContainer width={colorLegendWhidh}>
              <SDiscreteColorLegend
                width={colorLegendWhidh}
                items={data.map((d) => d.label)}
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
              />
            )}
          </ChartContainer>
        </ChartWithLegend>
      </ChartWithTitle>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart
