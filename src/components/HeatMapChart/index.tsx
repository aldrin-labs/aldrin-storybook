import * as React from 'react'
// import styled from 'styled-components'
import { HeatmapSeries, XYPlot, XAxis, YAxis } from 'react-vis'

import { Props } from '@components/HeatMapChart/annotations'

export default class HeatMapChart extends React.Component<Props> {
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
