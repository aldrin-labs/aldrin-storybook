import React, { useState, useEffect } from 'react'
import { withTheme } from '@material-ui/core'

import {
  HeaderContainer,
  Row,
  RowContainer,
  WhiteTitle,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

import AllocationDonutChart from './DonutChart'
import AllocationLegend from './Legend'
import { fixedColors, getRandomBlueColor } from './DonutChart/utils'

import { IProps } from './index.types'
import {
  AllocationChartContainer,
  AllocationLegendContainer,
  ChartContainer,
} from './index.styles'

export const mockData = [
  { symbol: 'SOL', value: 100 },
  { symbol: 'CCAI', value: 75 },
  { symbol: 'BNB', value: 50 },
  { symbol: 'OXY', value: 40 },
  { symbol: 'YFI', value: 35 },
  { symbol: 'SRM', value: 30 },
  { symbol: 'KIN', value: 25 },
  { symbol: 'HIN', value: 20 },
  { symbol: 'BTC', value: 15 },
  { symbol: 'ETH', value: 10 },
]

export const ROWS_TO_SHOW_IN_LEGEND = 4

const DonutChartWithLegend = ({ data = [], theme, id }: IProps) => {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    const generatedColors = data.map((_, i) =>
      i < fixedColors.length ? fixedColors[i] : getRandomBlueColor()
    )

    setColors(generatedColors)
  }, [data])

  const totalValue = data.reduce((prev, curr) => prev + curr.value, 0)
  const sortedData = data
    .sort((a, b) => b.value - a.value)
    .map((tokenData) => ({
      ...tokenData,
      value: (tokenData.value / totalValue) * 100,
    }))

  const chartData = sortedData.map((tokenData) => tokenData.value)
  // const chartId = chartData.reduce((prev, value) => prev + value + id, '')

  // we need to show only 4 rows in legend
  const otherTokensProgressBarData =
    sortedData.length > ROWS_TO_SHOW_IN_LEGEND
      ? sortedData.slice(ROWS_TO_SHOW_IN_LEGEND).reduce(
          (prev, tokenData) => ({
            ...prev,
            value: prev.value + tokenData.value,
          }),
          { symbol: 'Other', value: 0 }
        )
      : []

  const legendData = [...sortedData.slice(0, ROWS_TO_SHOW_IN_LEGEND)].concat(
    otherTokensProgressBarData
  )
  return (
    <BlockTemplate
      style={{ margin: '0 0 2rem 0', overflow: 'scroll' }}
      theme={theme}
      width={'100%'}
      height={'48%'}
    >
      <ChartContainer>
        <HeaderContainer theme={theme} justify={'space-between'}>
          <Row margin={'0 0 0 2rem'}>
            <WhiteTitle theme={theme}>
              {id === 'target' ? 'Target Allocation' : 'Current Allocation'}
            </WhiteTitle>
          </Row>
        </HeaderContainer>
        <RowContainer height={'calc(100% - 5rem)'}>
          <AllocationChartContainer>
            {/* we need to re-render chart on data update */}
            <AllocationDonutChart
              id={id}
              data={chartData}
              tooltipData={mockData}
              colors={colors}
            />
          </AllocationChartContainer>
          <AllocationLegendContainer>
            <AllocationLegend theme={theme} data={legendData} colors={colors} />
          </AllocationLegendContainer>
        </RowContainer>
      </ChartContainer>
    </BlockTemplate>
  )
}

export default withTheme()(DonutChartWithLegend)
