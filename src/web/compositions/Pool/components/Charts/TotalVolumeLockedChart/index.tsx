import React, { useEffect } from 'react'
import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { createTotalVolumeLockedChart } from '../utils'
import { Theme } from '@material-ui/core'

const TotalVolumeLockedChart = ({
  theme,
  data,
  id,
  title,
}: {
  theme: Theme
  data: any
  id: string
  title: string
}) => {
  useEffect(() => {
    createTotalVolumeLockedChart({ id })

    return () => window[`TotalVolumeLockedChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <Row margin={'0 0 0 2rem'}>
          <WhiteTitle theme={theme}>{title}</WhiteTitle>
        </Row>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="TotalVolumeLockedChart"></canvas>
      </ChartContainer>
    </>
  )
}

export { TotalVolumeLockedChart }
