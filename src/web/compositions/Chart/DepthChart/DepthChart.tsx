import React, { Component } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/styles'
import MdAddCircleOutline from '@material-ui/icons/AddOutlined'
import MdRemoveCircleOutline from '@material-ui/icons/RemoveOutlined'
import { FlexibleXYPlot, XAxis, YAxis, AreaSeries, Crosshair } from 'react-vis'
import {
  Divider,
  Typography,
  IconButton,
  CircularProgress,
} from '@material-ui/core'

import { getDataFromTree } from '@core/utils/chartPageUtils'

import { red, green } from '@material-ui/core/colors'
import {
  transformOrderbookData,
  addOrderToOrderbook,
} from '@core/utils/chartPageUtils'

import { Loading } from '@sb/components/Loading/Loading'
import { abbrNum } from '../DepthChart/depthChartUtil'
import { hexToRgbAWithOpacity } from '@sb/styles/helpers'
import { IDepthChartProps, IDepthChartState } from './DepthChart.types'
// import ComingSoon from '@sb/components/ComingSoon'

@withTheme()
class DepthChart extends Component<IDepthChartProps, IDepthChartState> {
  state = {
    // must be calculated
    MAX_DOMAIN_PLOT: 0,
    crosshairValuesForSpread: [],
    crosshairValuesForOrder: [],
    nearestOrderXIndex: null,
    nearestSpreadXIndex: null,
    transformedAsksData: [],
    transformedBidsData: [],
  }

  static getDerivedStateFromProps(
    props: IDepthChartProps,
    state: IDepthChartState
  ) {
    const { data } = props

    console.log('data', data)

    let totalVolumeAsks = 0
    let transformedAsksData = getDataFromTree(data['asks'], 'asks')
      .reverse()
      .map(({ price, size }) => {
        totalVolumeAsks = totalVolumeAsks + Number(size)

        return {
          y: +price,
          x: totalVolumeAsks,
        }
      })

    let totalVolumeBids = 0
    let transformedBidsData = getDataFromTree(data['bids'], 'bids')
      .reverse()
      .map(({ price, size }) => {
        totalVolumeBids = totalVolumeBids + Number(size)

        return {
          y: +price,
          x: totalVolumeBids,
        }
      })

    // if arrays of dada not equal crosshair not worhing correctly
    if (transformedBidsData.length > transformedAsksData.length) {
      transformedBidsData = transformedBidsData.slice(
        0,
        transformedAsksData.length
      )
    } else if (transformedBidsData.length < transformedAsksData.length) {
      transformedAsksData = transformedAsksData.slice(
        0,
        transformedBidsData.length
      )
    }

    return {
      transformedBidsData,
      transformedAsksData,
      MAX_DOMAIN_PLOT: Math.max(totalVolumeAsks, totalVolumeBids),
    }
  }

  scale = (type: 'increase' | 'decrease', scale: number) => {
    if (type === 'increase') {
      this.setState((prevState) => ({
        MAX_DOMAIN_PLOT: prevState.MAX_DOMAIN_PLOT * scale,
      }))
    }

    if (type === 'decrease') {
      this.setState((prevState) => ({
        MAX_DOMAIN_PLOT: prevState.MAX_DOMAIN_PLOT / scale,
      }))
    }
  }

  onNearestOrderX = (value, { index }) => {
    this.setState({
      crosshairValuesForOrder: this.state.transformedAsksData
        .map((d, i) => {
          if (
            index === 0 &&
            this.state.nearestSpreadXIndex === 0 &&
            i === index
          ) {
            return d
          }
          if (index === 0) {
            return null
          }

          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
      nearestOrderXIndex: index,
    })
  }

  onNearestSpreadX = (value, { index }) => {
    const { transformedBidsData } = this.state
    this.setState({
      crosshairValuesForSpread: transformedBidsData
        .map((d, i) => {
          if (
            index === 0 &&
            this.state.nearestOrderXIndex === 0 &&
            i === index
          ) {
            return d
          }

          if (index === 0) {
            return null
          }

          if (i === index) {
            return d
          }

          return null
        })
        .filter(Boolean),
      nearestSpreadXIndex: index,
    })
  }

  onMouseLeave = () => {
    this.setState({
      crosshairValuesForSpread: [],
      crosshairValuesForOrder: [],
    })
  }

  render() {
    let {
      crosshairValuesForSpread,
      crosshairValuesForOrder,
      transformedAsksData: ordersData,
      transformedBidsData: spreadData,
    } = this.state

    // https://github.com/uber/react-vis/blob/master/docs/animation.md
    const { base, quote, animated = false, xAxisTickTotal, theme } = this.props

    const { palette } = theme
    const axisStyle = {
      ticks: {
        padding: '1.6rem',
        stroke: theme.palette.text.primary,
        opacity: 0.5,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontFamily.fontSize,
        fontWeight: theme.typography.fontFamily.fontWeightLight,
      },
    }

    // hack for showing only one crosshair at once
    if (
      crosshairValuesForSpread.length >= 1 &&
      crosshairValuesForOrder.length >= 1
    ) {
      crosshairValuesForSpread = []
      crosshairValuesForOrder = []
    }

    if (!ordersData || !spreadData) {
      return <Loading centerAligned />
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'flex-end',
        }}
      >
        <Container>
          <FlexibleXYPlot
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onMouseLeave={this.onMouseLeave}
            style={{ transform: 'scale(-1, -1)' }}
          >
            <AreaSeries
              curve={'curveStep'}
              onNearestX={this.onNearestOrderX}
              style={{
                fill: theme.palette.depthChart.redBackground,
                stroke: theme.palette.depthChart.redStroke,
                strokeWidth: '.2rem',
                transform: 'translate(0)',
              }}
              animation={animated}
              key="chart"
              data={ordersData}
            />
          </FlexibleXYPlot>
        </Container>
        <Container>
          <FlexibleXYPlot
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onMouseLeave={this.onMouseLeave}
            style={{ transform: 'scale(-1, 1)' }}
          >
            <AreaSeries
              curve={'curveStep'}
              onNearestX={this.onNearestSpreadX}
              style={{
                fill: theme.palette.depthChart.greenBackground,
                stroke: theme.palette.depthChart.greenStroke,
                strokeWidth: '.2rem',
                transform: 'translate(0)',
              }}
              animation={animated}
              key="chardt"
              data={spreadData}
            />
          </FlexibleXYPlot>
        </Container>
      </div>
    )
  }
}

const Container = styled.div`
  height: 50%;
  width: 60%;
  position: relative;
`

const CrosshairContent = styled.div`
  background: ${(props: { background?: string; textColor?: string }) =>
    props.background};
  color: ${(props: { textColor?: string; background?: string }) =>
    props.textColor};
  padding: 0.8rem;
  font-size: 1.6rem;
  border-radius: 5px;
  min-width: 24rem;
  z-index: 1;
`

const Br = styled(Divider)`
  && {
    width: 10%;
    margin-top: -0.8rem;
    margin-bottom: 0.8rem;
  }
`

const RotatedBr = styled(Br)`
  && {
    transform: rotate(90deg);
    margin-top: 1.6rem;
    margin-left: -1.6rem;
  }
`

const CrosshairBottomWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: gray;
  font-weight: 300;
  font-size: 1.2rem;
`

const ScaleWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 1.6rem;
`

const MidPriceContainer = styled.div`
  background: ${(props: { background?: string }) => props.background};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 17.6rem;
  position: relative;
  margin: 0 auto;
`

const MidPriceColumnWrapper = styled.div`
  display: flex;
  padding: 0.8rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export default DepthChart
