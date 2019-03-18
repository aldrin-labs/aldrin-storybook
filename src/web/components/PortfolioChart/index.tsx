import React, { Component } from 'react'
import {
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  AreaSeries,
  FlexibleXYPlot,
  GradientDefs,
  Crosshair,
} from 'react-vis'
import Button from '@material-ui/core/Button'

import Highlight from './Highlight'
import { abbrNum } from '../Utils/dephtChartUtils'
import { Loading } from '../Loading'
import { Props } from './types'
import {
  Chart,
  SProfileChart,
  axisStyle,
  horizontalGridLinesStyle,
  verticalGridLinesStyle,
  areaSeriesStyle,
  crosshairStyle,
} from './styles'
import CardHeader from '../CardHeader'

export default class PortfolioChart extends Component<Props> {
  state: Partial<Props> = {
    activeChart: '1Y',
    crosshairValues: [],
    data: [],
  }

  static getDerivedStateFromProps(newProps: Props, state: Props) {
    return Object.assign(state, newProps) || null
  }

  onChangeActiveChart = (label: string) => {
    if (this.state.mapLabelToDays && this.state.mapLabelToDays[label]) {
      this.props.setActiveChartAndUpdateDays(
        label,
        this.state.mapLabelToDays[label]
      )
    }
  }

  _onNearestX = (value: string, { index }) => {
    this.setState({
      crosshairValues: [value],
    })
  }

  _onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  _formatDate = (date) => {}

  _onBrushStart = (data) => {}

  _onBrushEnd = (area) => {
    this.props.onChangeDateRange(area)
  }

  render() {
    const {
      style,
      height = '100%',
      lastDrawLocation,
      data,
      crosshairValues,
      activeChart,
      theme,
      chartBtns,
      title,
    } = this.state
    return (
      <SProfileChart style={{ ...style, height }}>
        <CardHeader
          title={title}
          action={
            <>
              {chartBtns &&
                chartBtns.map((chartBtn) => (
                  <Button
                    color="secondary"
                    size="small"
                    onClick={() => {
                      this.onChangeActiveChart(chartBtn)
                    }}
                    data-e2e={`${chartBtn}`}
                    variant={chartBtn !== activeChart ? 'text' : 'contained'}
                    key={chartBtn}
                    style={{ margin: '0 1rem' }}
                  >
                    {chartBtn}
                  </Button>
                ))}
            </>
          }
        />
        {/* minus cardHeader Height */}
        <Chart height={`calc(100% - 68px)`}>
            <FlexibleXYPlot
              margin={{ left: 50 }}
              animation={true}
              onMouseLeave={this._onMouseLeave}
              xDomain={
                lastDrawLocation && [
                  lastDrawLocation.left,
                  lastDrawLocation.right,
                ]
              }
            >
              <VerticalGridLines
                style={verticalGridLinesStyle}
                tickTotal={12}
                tickFormat={(v: number) => '`$${v}`'}
                tickValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
                labelValues={[0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]}
              />
              <HorizontalGridLines style={horizontalGridLinesStyle} />
              <XAxis
                style={axisStyle}
                tickFormat={(v: number) =>
                  new Date(v * 1000).toUTCString().substring(5, 11)
                }
              />
              {/* hiding Axis for a while */}
              {false && (
                <YAxis
                  style={axisStyle}
                  tickFormat={(value: any) =>
                    `$${abbrNum(+value.toFixed(2), 2)}`
                  }
                />
              )}
              <GradientDefs>
                <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={theme && theme.palette.secondary.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="60%"
                    stopColor={theme && theme.palette.secondary.main}
                    stopOpacity={0}
                  />
                </linearGradient>
              </GradientDefs>
              <AreaSeries
                color={'url(#CoolGradient)'}
                onNearestX={this._onNearestX}
                data={data}
                style={areaSeriesStyle}
              />

              <Crosshair values={crosshairValues}>
                <div style={crosshairStyle}>
                  <p>
                    {crosshairValues &&
                      crosshairValues
                        .map((v) => new Date(v.x * 1000).toDateString())
                        .join(' ')}
                    :{' '}
                    {crosshairValues &&
                      crosshairValues
                        .map((v) => `$${Number(v.y).toFixed(2)}`)
                        .join(' ')}
                  </p>
                </div>
              </Crosshair>

              {this.props.isShownMocks ? null : (
                <Highlight onBrushEnd={this._onBrushEnd} />
              )}
            </FlexibleXYPlot>
        </Chart>
      </SProfileChart>
    )
  }
}
