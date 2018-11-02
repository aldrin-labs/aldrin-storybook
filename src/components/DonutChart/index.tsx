import React, { Component } from 'react'
import { Typography } from '@material-ui/core'

import { withTheme } from '@material-ui/core/styles'
import _ from 'lodash'
import { getRandomColor } from './utils'

import { Props, State, DonutPiece, InputRecord } from './types'
import {
  ChartContainer,
  LabelContainer,
  ChartWithTitle,
  SDiscreteColorLegend,
  ChartWithLegend,
} from './styles'
import { defaultColors, emptyColor}  from './colors'

import { FlexibleChart } from './FlexibleChart'

class DonutChartWitoutTheme extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelPlaceholder: '',
    data: [],
    thicknessCoefficient: 10,
    colors: defaultColors,
  }
  state: State = {
    data: [],
    value: null,
    colorsWithRandom: [],
    chartSize: 0,
    isEmpty: false,
  }

  componentDidMount = () => {
    this.setState({ data: this.getDataFromImput(this.props.data) })
    this.setState({colorsWithRandom : this.getColorsWithRandom(this.props.colors, this.props.data.length)})
  }

  getColorsWithRandom = ( colors: string[], dataLengh: number ) => {
    return [
      ...colors, ...(_.range(dataLengh - colors.length)).map(() => getRandomColor()),
    ]
  }

  getDataFromImput = (inputData: InputRecord[]) => {
    const data = (inputData
        .map((record: InputRecord) => ({
          angle: record.realValue,
          label: record.label,
          realValue: record.realValue,
        })))
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

  refSizeMesure = element => {
    if (element) {
      this.setState({ chartSize: element.getBoundingClientRect})
    }
  }

  render() {
    const {
      value,
      data,
      colorsWithRandom,
      isEmpty,
    } = this.state

    const {
      labelPlaceholder,
      colorLegend,
      theme,
      thicknessCoefficient,
    } = this.props

    const emptyData = {
      angle: 1,
      label: '1',
      realValue: 1,
      colorIndex: 0,
    }

    return (
      <ChartWithTitle>
        <LabelContainer>
          <Typography variant="h4">
            {value ? value.label : labelPlaceholder || ''}
          </Typography>
        </LabelContainer>
        <ChartWithLegend>
          {colorLegend && !isEmpty && (
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
            {data.length
            ? <FlexibleChart
              data={data}
              onValueMouseOver={(v: DonutPiece) => this.onValueMouseOver(v)}
              onSeriesMouseOut={() => this.onSeriesMouseOut()}
              value={value}
              colorsWithRandom={colorsWithRandom}
              thicknessCoefficient={thicknessCoefficient}
              isEmpty={isEmpty}
            />
          :<FlexibleChart
            data={[emptyData]}
            onValueMouseOver={() => undefined}
            onSeriesMouseOut={() => undefined}
            value={value}
            colorsWithRandom={[emptyColor]}
            thicknessCoefficient={thicknessCoefficient}
            isEmpty={isEmpty}
        />}
          </ChartContainer>
        </ChartWithLegend>
      </ChartWithTitle>
    )
  }
}

export const DonutChart = withTheme()(DonutChartWitoutTheme)

export default DonutChart
