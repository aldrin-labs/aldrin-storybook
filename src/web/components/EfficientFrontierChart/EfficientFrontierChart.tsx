import React, { Component } from 'react'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineMarkSeries,
  MarkSeries,
  Hint,
} from 'react-vis'
import { Typography } from '@material-ui/core'


import { IState, IProps, Data } from './EfficientFrontierChart.types'
import { ChartTooltip, Container } from './EfficientFrontierChart.styles'
import { CentredContainer } from '@sb/styles/cssUtils'


export default class EfficientFrontierChart extends Component<IProps, IState> {
  state = {
    value: { x: null, y: null },
  }

  onValueMouseOver = (value: { x: string; y: string }) =>
    this.setState({ value })

  onSeriesMouseOut = () => this.setState({ value: { x: null, y: null } })

  render() {
    const { theme, showBlurOnSections, showCustomPlaceholder, placeholderElement } = this.props
    const { percentages, risk, activeButton } = this.props.data
    const { value } = this.state

    const textColor: string = this.props.theme.palette.getContrastText(
      this.props.theme.palette.background.paper
    )
    const background: string = theme.palette.background.paper

    const axisStyle = {
      ticks: {
        // padding: '1rem',
        stroke: theme.palette.secondary.main,
        opacity: 0.75,
        fontFamily: theme.typography.fontFamily,
        fontSize: '12px',
        fontWeight: 100,
      },
      title: {
        fontWeight: 600,
        fontFamily: theme.typography.fontFamily,
        fill: theme.palette.secondary.main,
      },
    }

    let data: ReadonlyArray<Data> = []
    const highlightedDotData = []

    if (percentages.length > 1) {
      data = percentages.map((percentage, i) => ({
        x: +Number(risk[i]).toFixed(6),
        y: +Number(percentage).toFixed(6),
      }))

      highlightedDotData.push(data[activeButton])
    }

    return (
      <Container
        hide={showBlurOnSections}
        className="EfficientFrontierChart"
      >
        {showCustomPlaceholder ? (
          placeholderElement
        ) : (
          <FlexibleXYPlot margin={{ left: 80, bottom: 65 }}>
            {highlightedDotData.length < 1 ? (
              <LineMarkSeries
                animation="gentle"
                curve={'curveCatmullRom'}
                color="rgba(91, 96, 102, 0.7)"
                data={[{ x: 4, y: 1 }, { x: 3, y: 2 }, { x: 8, y: 5 }]}
              />
            ) : (
              [
                <XAxis
                  animation="gentle"
                  style={axisStyle}
                  key="x"
                  title="Risk"
                  tickLabelAngle={-90}
                />,
                <YAxis
                  hideLine
                  style={axisStyle}
                  key="y"
                  title="Return"
                  left={-20}
                />,
                <LineMarkSeries
                  key="c"
                  curve={'curveCatmullRom'}
                  color="#4fd8da90"
                  onSeriesMouseOut={this.onSeriesMouseOut}
                  onValueMouseOver={this.onValueMouseOver}
                  data={data}
                />,
                <MarkSeries
                  onSeriesMouseOut={this.onSeriesMouseOut}
                  onValueMouseOver={this.onValueMouseOver}
                  animation="stiff"
                  key="h"
                  color="#4fa1da"
                  size={8}
                  data={highlightedDotData}
                />,
                <HorizontalGridLines style={{ stroke: '#686c71' }} key="g" />,
              ]
            )}

            {value.x === null || value.y === null ? null : (
              <Hint value={value}>
                <ChartTooltip
                  color={textColor}
                  background={background}
                >{`Risk ${value.x}% - Return ${value.y}%`}</ChartTooltip>
              </Hint>
            )}
          </FlexibleXYPlot>
          )}
      </Container>
    )
  }
}
