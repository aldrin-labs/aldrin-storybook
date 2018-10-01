import * as React from 'react'
import styled from 'styled-components'
import { XAxis, YAxis, AreaSeries, FlexibleXYPlot } from 'react-vis'

import { Props } from './types'

export default class AreaChart extends React.Component<Props> {
  render() {
    const { data } = this.props

    return (
      <Chart>
        <FlexibleXYPlot>
          <XAxis hideLine hideTicks />
          <YAxis hideLine hideTicks />

          <AreaSeries
            data={data}
            style={{
              fill: 'rgba(133, 237, 238, 0.35)',
              stroke: 'rgb(78, 216, 218)',
              strokeWidth: '3px',
            }}
          />
        </FlexibleXYPlot>
      </Chart>
    )
  }
}

const Chart = styled.div`
  width: 100%;
  height: 5em;
  min-height: 5em;
  max-height: 10em;
  margin-top: 24px;
`
