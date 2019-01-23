import React, { Component } from 'react'
import styled from 'styled-components'
import MdAddCircleOutline from '@material-ui/icons/AddOutlined'
import MdRemoveCircleOutline from '@material-ui/icons/RemoveOutlined'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  AreaSeries,
  Crosshair,
} from 'react-vis'
import {
  Divider,
  Typography,
  IconButton,
  CircularProgress,
} from '@material-ui/core'
import { red, green } from '@material-ui/core/colors'

import { Loading } from '@storybook/components/Loading/Loading'
import { abbrNum } from '../DepthChart/depthChartUtil'
import { hexToRgbAWithOpacity } from '@storybook/styles/helpers'
import { IDepthChartProps, IDepthChartState } from './DepthChart.types'
import ComingSoon from '@storybook/components/ComingSoon'

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
    // console.log(props)
    let totalVolumeAsks = 0
    let transformedAsksData = props.asks.map((el) => {
      totalVolumeAsks = totalVolumeAsks + +el.size

      return {
        x: +el.price,
        y: totalVolumeAsks,
      }
    })
    let totalVolumeBids = 0
    let transformedBidsData = props.bids.map((el) => {
      totalVolumeBids = totalVolumeBids + +el.size

      return {
        x: +el.price,
        y: totalVolumeBids,
      }
    })

    //  if arrays of dada not equal crosshair not worhing correctly
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
      MAX_DOMAIN_PLOT: totalVolumeAsks,
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
    const {
      base,
      quote,
      animated,
      //      asks,
      //      bids,
      xAxisTickTotal,
      theme,
    } = this.props
    const { palette } = theme
    const axisStyle = {
      ticks: {
        padding: '1rem',
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
      <Container>
        <ComingSoon />
        <FlexibleXYPlot
          margin={{ right: 48 }}
          onMouseLeave={this.onMouseLeave}
          yDomain={[0, this.state.MAX_DOMAIN_PLOT]}
        >
          <ScaleWrapper>
            <MidPriceContainer
              background={hexToRgbAWithOpacity(palette.primary.light, 0.1)}
            >
              <IconButton onClick={() => this.scale('increase', 1.5)}>
                <MdRemoveCircleOutline />
              </IconButton>

              <MidPriceColumnWrapper>
                <Typography variant="subtitle1">
                  {this.props.midMarketPrice || 'soon'}
                </Typography>
                <Typography variant="caption">Mid Market Price</Typography>
              </MidPriceColumnWrapper>

              <IconButton onClick={() => this.scale('decrease', 1.5)}>
                <MdAddCircleOutline />
              </IconButton>
            </MidPriceContainer>
          </ScaleWrapper>
          <XAxis
            tickTotal={xAxisTickTotal || 10}
            tickFormat={(value: number) => abbrNum(+value.toFixed(4), 4)}
            style={axisStyle}
          />
          <YAxis
            tickFormat={(value: number) => abbrNum(+value.toFixed(2), 2)}
            key="afd"
            hideLine
            animation="stiff"
            orientation="right"
            style={axisStyle}
          />
          <YAxis
            tickFormat={(value: number) => abbrNum(+value.toFixed(2), 2)}
            key="dsafd"
            hideLine
            animation="stiff"
            style={axisStyle}
          />
          {/* <VerticalRectSeries
            animation="gentle"
            key="charst"
            data={[
              {
                x0:
                  ordersData.length > 1 &&
                  ordersData[ordersData.length - 1].x - 0.0001,
                x: ordersData.length > 1 && ordersData[ordersData.length - 1].x,
                y: this.state.MAX_DOMAIN_PLOT / 2,
              },
            ]}
            color="rgba(91, 96, 102, 0.7)"
          /> */}
          <AreaSeries
            curve={'curveStep'}
            onNearestX={this.onNearestOrderX}
            style={{
              fill: hexToRgbAWithOpacity(red['A100'], 0.25),
              stroke: red[400],
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chart"
            data={ordersData}
          />
          <AreaSeries
            curve={'curveStep'}
            onNearestX={this.onNearestSpreadX}
            style={{
              fill: hexToRgbAWithOpacity(green['A200'], 0.25),
              stroke: green[500],
              strokeWidth: '3px',
            }}
            animation={animated}
            key="chardt"
            data={spreadData}
          />

          <Crosshair values={crosshairValuesForSpread}>
            <CrosshairContent
              background={palette.primary.main}
              textColor={palette.text.primary}
            >
              {crosshairValuesForSpread.length >= 1 ? (
                <>
                  <Typography variant="h6" color="secondary">
                    {`${crosshairValuesForSpread[0].x.toFixed(8)} `}
                    {base || 'Fiat'}
                  </Typography>
                  <Br light={true} />
                  <CrosshairBottomWrapper>
                    <Typography variant="body1">
                      Can be bought {crosshairValuesForSpread[0].y.toFixed(2)}{' '}
                      {base || 'Fiat'}
                    </Typography>
                    <RotatedBr />
                    <Typography variant="body1">
                      For a total of{' '}
                      {(
                        crosshairValuesForSpread[0].y *
                        crosshairValuesForSpread[0].x
                      ).toFixed(8)}{' '}
                      {quote || 'CC'}
                    </Typography>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
          </Crosshair>
          <Crosshair values={crosshairValuesForOrder}>
            <CrosshairContent
              background={palette.primary.main}
              textColor={palette.text.primary}
            >
              {crosshairValuesForOrder.length >= 1 ? (
                <>
                  <Typography variant="h6" color="secondary">
                    {`${crosshairValuesForOrder[0].x.toFixed(8)} `}{' '}
                    {base || 'Fiat'}
                  </Typography>

                  <Br light={true} />
                  <CrosshairBottomWrapper>
                    <Typography variant="body1">
                      Can be sold {crosshairValuesForOrder[0].y.toFixed(2)}{' '}
                      {base || 'Fiat'}
                    </Typography>
                    <RotatedBr />
                    <Typography variant="body1">
                      {' '}
                      For a total of{' '}
                      {(
                        crosshairValuesForOrder[0].y *
                        crosshairValuesForOrder[0].x
                      ).toFixed(8)}{' '}
                      {quote || 'CC'}
                    </Typography>
                  </CrosshairBottomWrapper>
                </>
              ) : (
                <CircularProgress color="primary" />
              )}
            </CrosshairContent>
          </Crosshair>
        </FlexibleXYPlot>
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`

const CrosshairContent = styled.div`
  background: ${(props: { background?: string; textColor?: string }) =>
    props.background};
  color: ${(props: { textColor?: string; background?: string }) =>
    props.textColor};
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  min-width: 15rem;
  z-index: 1;
`

const Br = styled(Divider)`
  && {
    width: 10%;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
  }
`

const RotatedBr = styled(Br)`
  && {
    transform: rotate(90deg);
    margin-top: 1rem;
    margin-left: -1rem;
  }
`

const CrosshairBottomWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: gray;
  font-weight: 300;
  font-size: 0.75rem;
`

const ScaleWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 1rem;
`

const MidPriceContainer = styled.div`
  background: ${(props: { background?: string }) => props.background};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 11rem;
  position: relative;
  margin: 0 auto;
`

const MidPriceColumnWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export default DepthChart
