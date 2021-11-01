import React, { useEffect, useRef } from 'react'
import { StretchedBlock } from '@sb/components/Layout'
import { Text } from '@sb/components/Typography'
import { ChartContainer, Chart, ChartCanvas } from '../styles'
import { createRewardsChart } from './CreateRewardsChart'

export const RewardsChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return () => {
        return null
      }
    }
    const chart = createRewardsChart(chartRef.current)

    return () => chart.destroy()
  }, [])

  return (
    <>
      <ChartContainer>
        <StretchedBlock>
          <Text maxWidth="100%" size="sm">
            Reward growth subject to restaking of rewards on a monthly basis.
          </Text>{' '}
          <Text maxWidth="100%" noWrap size="sm">
            1 Y
          </Text>
        </StretchedBlock>
        <Chart>
          <ChartCanvas ref={chartRef} />
        </Chart>
      </ChartContainer>
    </>
  )
}
