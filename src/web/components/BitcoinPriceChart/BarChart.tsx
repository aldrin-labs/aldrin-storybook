import React, { Component } from 'react'
import styled from 'styled-components'
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalRectSeries,
  VerticalGridLines,
  LineSeries,
} from 'react-vis'

class BarChart extends Component {
  render() {
    return (
      <div>
        <Container>
          <XYPlot width={200} height={90}>
            <VerticalRectSeries data={this.props.data} color="#4fd8da" />
          </XYPlot>
        </Container>
      </div>
    )
  }
}

const Container = styled.div`
  position: relative;
  left: -1rem;
  max-width: 205px;
`

export default BarChart
