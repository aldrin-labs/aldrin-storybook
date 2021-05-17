import React, { useEffect } from 'react'
import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTotalVolumeLockedChart } from '../utils'

const TotalVolumeLockedChart = ({
  theme,
  id,
  title,
}: {
  theme: Theme
  id: string
  title: string
}) => {
  useEffect(() => {
    createTotalVolumeLockedChart({ theme, id })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TotalVolumeLockedChart-${id}`].destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <Row margin={'0 0 0 2rem'}>
          <WhiteTitle theme={theme} color={theme.palette.white.text}>
            {title}
          </WhiteTitle>
        </Row>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="TotalVolumeLockedChart"></canvas>
      </ChartContainer>
    </>
  )
}

export { TotalVolumeLockedChart }
