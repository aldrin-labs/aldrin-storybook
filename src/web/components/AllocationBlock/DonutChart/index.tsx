import React, { useEffect } from 'react'

import { ChartContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { createAllocationDonutChart } from './utils'

const AllocationDonutChart = ({
  id,
  colors,
  data,
}: {
  id: string
  colors: string[]
  data: number[]
}) => {
  useEffect(() => {
    createAllocationDonutChart({ id, data, colors, })

    // @ts-ignore - we set it in create chart function above
    return () => window[`AllocationDonutChart-${id}`].destroy()
  }, [id, data, colors])
  return (
    <ChartContainer height={'100%'}>
      <canvas id={`AllocationDonutChart-${id}`}></canvas>
    </ChartContainer>
  )
}

export default AllocationDonutChart
