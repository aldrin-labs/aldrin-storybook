import React from 'react'
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
} from 'react-vis'

import { srmVolumesInUSDT, dcfiVolumes } from '../index'

export const Chart = (props) => {
  const axisStyle = {
    ticks: {
      fontSize: '7px',
      color: '#f65683',
      fontFamily: 'DM Sans',
    },
    title: {
      fontSize: '16px',
      color: '#333',
    },
    stroke: {
      background: '#f65683',
      color: '#f65683',
    },
    text: {
      fontSize: '7px',
    },
  }

  return (
    <FlexibleXYPlot
      style={{ stroke: props.theme.palette.dark.main, fontSize: '9px' }}
    >
      <VerticalGridLines style={{ stroke: '#f65683', color: '#f65683' }} />
      <HorizontalGridLines style={{ stroke: '#f65683', color: '#f65683' }} />
      <XAxis
        hideLine
        // title="Volume of SRM market buy, $"
        labelFormat={(v) => `Value is ${v}`}
        labelValues={[2]}
        // tickValues={[0, 200000, 1000000, 2000000, 10000000, 20000000, 50000000, 100000000, 150000000, 200000000, 400000000]}
        tickValues={[0, ...srmVolumesInUSDT.slice(1, 5)]}
        tickFormat={(v) => {
          if (v >= 1000000) {
            return `${v / 1000000} m`
          } else {
            return `${v / 1000} k`
          }
        }}
        style={axisStyle}
      />
      <YAxis
        // title="Reward DCFI"
        hideLine
        labelValues={[2]}
        tickFormat={(v) => {
          if (v >= 1000000) {
            return `${v / 1000000} m`
          } else {
            return `${v / 1000} k`
          }
        }}
        style={axisStyle}
        tickValues={[0, ...dcfiVolumes.slice(0, 5)]}
        // tickValues={[0, 200000, 400000, 600000, 800000, 1000000, 1200000, 1400000, 1600000, 1800000, 2000000, ]}
      />
      <MarkSeries
        size={10}
        fill={props.theme.palette.red.chart}
        data={[{ x: props.pointData.srmInUSDT, y: props.pointData.dcfi }]}
      />
      <LineSeries
        // curve={'curveMonotoneX'}
        style={{
          strokeLinejoin: 'round',
          stroke: props.theme.palette.red.chart,
          strokeWidth: '.4rem',
          boxShadow: '0px 0px 12px rgba(218, 255, 224, 0.65);',
        }}
        data={[
          { y: 0, x: 0 },
          ...dcfiVolumes.slice(0, 5).map((dcfiVolume, i) => {
            return {
              x: srmVolumesInUSDT[i],
              y: dcfiVolume,
            }
          }),
        ]}
        // data={[{y: 0, x: 0}, {y: 200000, x: 200000}, {y: 400000, x: 1000000}, {y: 600000, x: 2000000}, {y: 800000, x: 10000000}, {y: 1000000, x: 20000000}, {y: 1200000, x: 50000000}, {y: 1400000, x: 100000000}, {y: 1600000, x: 150000000}, {y: 1800000, x: 200000000}, {y: 2000000, x: 400000000}]}
      />
    </FlexibleXYPlot>
  )
}
