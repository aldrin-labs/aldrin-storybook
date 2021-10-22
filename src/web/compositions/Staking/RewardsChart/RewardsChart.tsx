import React, { useEffect } from 'react'
import { StretchedBlock } from '@sb/components/Layout'
import { ChartContainer, Chart } from '../Staking.styles'
import { Text } from '@sb/components/Typography'
import { createRewardsChart } from './CreateRewardsChart'
export const RewardsChart = ({ id }: { id: string }) => {
  useEffect(() => {
    createRewardsChart({ id })

    // @ts-ignore - we set it in create chart function above
    return () => window[`RewardsChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <ChartContainer>
        <StretchedBlock>
          <Text maxWidth="100%" size="sm">
            Reward growth subject to restaking of rewards on a monthly basis.
          </Text>{' '}
          <Text maxWidth="100%" size="sm">
            1 Y
          </Text>
        </StretchedBlock>
        <Chart>
          <canvas id="RewardsChart"></canvas>
        </Chart>
      </ChartContainer>
    </>
  )
}
