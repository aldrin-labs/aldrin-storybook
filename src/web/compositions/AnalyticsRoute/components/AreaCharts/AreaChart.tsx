import React, { useEffect } from 'react'
import {
  WhiteTitle,
  HeaderContainer,
  Row,
  ChartContainer,
} from '../../index.styles'
import { createAreaChart } from '../utils'
import { Theme } from '@material-ui/core'
// import { TooltipForAreaChart } from './Tooltips'

const AreaChart = ({
  theme,
  data,
  selectedPair,
  id,
  title
}: {
  theme: Theme
  data: any
  selectedPair: string
  id: string
  title: string
}) => {
  useEffect(() => {
    createAreaChart(data, selectedPair)

    return () => window.myAreaChart.destroy()
  }, [id])

  return (
    <>
      <HeaderContainer theme={theme} justify={'space-between'}>
        <Row margin={'0 0 0 2rem'}>
          <WhiteTitle theme={theme}>{title}</WhiteTitle>
        </Row>
        <Row margin={'0 2rem 0 0'}>
          <WhiteTitle theme={theme}>30d</WhiteTitle>
        </Row>
      </HeaderContainer>
      <ChartContainer>
        <canvas id="areaChart"></canvas>
        {/* <TooltipForAreaChart theme={theme} /> */}
      </ChartContainer>
    </>
  )
}

export default AreaChart
