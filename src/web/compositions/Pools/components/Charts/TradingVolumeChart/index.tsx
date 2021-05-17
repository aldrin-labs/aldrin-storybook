import React, { useEffect } from 'react'
import { Theme } from '@material-ui/core'

import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { createTradingVolumeChart } from '../utils'

const TradingVolumeChart = ({
  theme,
  id,
  title,
}: {
  theme: Theme
  id: string
  title: string
}) => {
  useEffect(() => {
    createTradingVolumeChart({ theme, id })

    // @ts-ignore - we set it in create chart function above
    return () => window[`TradingVolumeChart-${id}`].destroy()
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
        <canvas id="TradingVolumeChart"></canvas>
      </ChartContainer>
    </>
  )
}

export { TradingVolumeChart }
