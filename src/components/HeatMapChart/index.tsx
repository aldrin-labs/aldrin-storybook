import React, { Component } from 'react'
import { HeatmapSeries, XYPlot, XAxis, YAxis } from 'react-vis'

import { Props } from './annotations'

export class HeatMapChart extends Component<Props> {
  render() {
    const { data, width, height } = this.props
    return (
      <XYPlot width={width || 300} height={height || 300}>
        <XAxis top={0} hideLine />
        <YAxis />
        <HeatmapSeries data={data} colorType="literal" />
      </XYPlot>
    )
  }
}

export default HeatMapChart
