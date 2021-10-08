import React from 'react'
import { Theme } from '@material-ui/core'

import TotalVolumeLockedChart from './index'

const TotalVolumeLockedChartDataContainer = ({ theme }: { theme: Theme }) => {
  return (
    <TotalVolumeLockedChart
      theme={theme}
      id="TotalVolumeLockedChart"
      title="Total Value Locked"
    />
  )
}

const Wrappper = TotalVolumeLockedChartDataContainer

export { Wrappper as TotalVolumeLockedChart }
