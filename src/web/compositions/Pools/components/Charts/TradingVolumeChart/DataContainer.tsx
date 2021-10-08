import React from 'react'
import { Theme } from '@material-ui/core'

import TradingVolumeChart from './index'

const TradingVolumeChartDataContainer = ({ theme }: { theme: Theme }) => {
  return (
    <TradingVolumeChart
      theme={theme}
      id="TradingVolumeChart"
      title="Trading Volume"
    />
  )
}

const Wrappper = TradingVolumeChartDataContainer

export { Wrappper as TradingVolumeChart }
