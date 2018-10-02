import * as React from 'react'
import { Treemap, makeVisFlexible, FlexibleXYPlot } from 'react-vis'
import styled from 'styled-components'

import { myData } from '@components/TreeMapChart/mocks'
import { State } from '@components/TreeMapChart/types'

const FlexibleTreeMapChart = makeVisFlexible(Treemap)

export default class TreeMapChart extends React.Component {
  state: State = {
    hoveredNode: false,
    treemapData: myData,
  }

  render() {
    const treeProps = {
      animation: {
        damping: 9,
        stiffness: 300,
      },
      data: this.state.treemapData,
      onLeafMouseOver: (x: JSX.Element) => this.setState({ hoveredNode: x }),
      onLeafMouseOut: () => this.setState({ hoveredNode: false }),
      height: 300,
      mode: 'binary',
      getLabel: (x: { title: string }) => x.title,
      style: {
        border: 'thin solid #393e44',
        fontFamily: 'Roboto',
        fonWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.875)',
        backgroundColor: '#4ed8da',
      },
    }

    return (
      <React.Fragment>
        <ChartWrapper>
          <FlexibleTreeMapChart {...treeProps} />
        </ChartWrapper>
      </React.Fragment>
    )
  }
}

const ChartWrapper = styled.div`
  display: flex;
  width: 100%;
  min-width: 100%;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 10px;
`
