import * as React from 'react'
import Typography from '@material-ui/core/Typography'

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  MarkSeries,
  LineSeries,
  Crosshair,
  LineMarkSeries,
} from 'react-vis'

import { formatDate } from '../../../../../core/src/utils/dateUtils'
import { Props, State } from './LineChart.types'
import {
  ContainerForCrossHairValues,
  StyledDiscreteColorLegend,
} from './LineChart.styles'
import { CSS_CONFIG } from '../../config/cssConfig'
import { LegendContainer } from '../../styles/cssUtils'

const axisStyle = {
  ticks: {
    stroke: '#fff',
    opacity: 0.75,
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 100,
  },
  text: { stroke: 'none', fill: '#4ed8da', fontWeight: 600, opacity: 1 },
}

export default class LineChart extends React.Component<Props, State> {
  state: State = {
    crosshairValues: [],
    deepLevel: 1,
  }

  onNearestX = (_: any, v: { index: number }) => {
    const { data } = this.props
    if (!data) return

    this.setState({
      crosshairValues: data.map((serie) => {
        const { data } = serie
        return data[v.index]
      }),
    })
  }

  onMouseLeave = () => {
    this.setState({ crosshairValues: [] })
  }

  render() {
    const {
      data,
      activeLine,
      alwaysShowLegend,
      itemsForChartLegend,
      additionalInfoInPopup,
      theme,
    } = this.props

    const textColor = theme.palette.getContrastText(
      theme.palette.background.paper
    )
    const fontFamily = theme.typography.fontFamily

    const { crosshairValues } = this.state

    if (!data) {
      return (
        <FlexibleXYPlot>
          <LineMarkSeries
            curve={'curveCatmullRom'}
            color="rgba(91, 96, 102, 0.7)"
            data={[
              { x: 3, y: 2 },
              { x: 3, y: 2 },
              { x: 8, y: 5 },
              { x: 6, y: 7 },
            ]}
          />
        </FlexibleXYPlot>
      )
    }

    const dateOptionsFormat = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const dateDataFormatted =
      crosshairValues &&
      crosshairValues[0] &&
      new Date(crosshairValues[0].x * 1000).toLocaleDateString(
        'en-US',
        dateOptionsFormat
      )

    return (
      <FlexibleXYPlot
        onMouseLeave={this.onMouseLeave}
        margin={{ left: 55, bottom: 55 }}
      >
        {alwaysShowLegend && (
          <LegendContainer
            right={`0%`}
            color={textColor}
            fontFamily={fontFamily}
          >
            <StyledDiscreteColorLegend
              orientation="horizontal"
              items={itemsForChartLegend}
            />
          </LegendContainer>
        )}

        <XAxis
          style={axisStyle}
          tickFormat={(v: number) => formatDate(v, 'MMM DD')}
          tickLabelAngle={-90}
        />

        <YAxis style={axisStyle} />

        {data.map((serie, i) => {
          const color = serie.color ? serie.color : CSS_CONFIG.colors[i]

          return (
            <LineSeries
              key={i}
              animation
              data={serie.data}
              color={color}
              onNearestX={this.onNearestX}
            />
          )
        })}

        {crosshairValues && (
          <MarkSeries data={crosshairValues} animation color="#E0F2F1" />
        )}

        {crosshairValues && (
          <Crosshair values={crosshairValues}>
            <ContainerForCrossHairValues>
              <Typography variant="subtitle1" style={{ marginBottom: '1rem' }}>
                {dateDataFormatted}
              </Typography>

              {crosshairValues.map((v, i) => (
                <div key={`${v.label}: ${v.y} USD`}>
                  <Typography
                    variant="body2"
                    style={{
                      color:
                        data.length > 1
                          ? CSS_CONFIG.colors[i]
                          : theme.palette.common.white,
                    }}
                  >{`${v.label}: ${Number(v.y).toFixed(2)}`}</Typography>
                </div>
              ))}
              {additionalInfoInPopup && (
                <Typography
                  variant="body2"
                  style={{ marginTop: '1rem', fontStyle: 'italic' }}
                >
                  Note: we simulate the starting balance of $1,000 for
                  optimization
                </Typography>
              )}
            </ContainerForCrossHairValues>
          </Crosshair>
        )}
      </FlexibleXYPlot>
    )
  }
}
