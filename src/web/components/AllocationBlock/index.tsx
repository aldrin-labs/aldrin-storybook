import React, { useState, useEffect } from 'react'
import { withTheme } from '@material-ui/core'

import {
  HeaderContainer,
  Row,
  RowContainer,
  WhiteTitle,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
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

const fixedColorsForLegend = [
  'linear-gradient(90deg, #366CE5 0%, #747CF6 95.65%)',
  'linear-gradient(90deg, #D3A987 0%, #EE7A96 100%)',
  'linear-gradient(90deg, #95D2BA 0%, #83E6EC 100%)',
  'linear-gradient(90deg, #4071B6 0%, #52B7F6 100%)',
]

export const ROWS_TO_SHOW_IN_LEGEND = 4

const DonutChartWithLegend = ({ data = [], theme, id }: IProps) => {
  const [colors, setColors] = useState<string[]>([])
  const [colorsForLegend, setColorsForLegend] = useState<string[]>([])

  useEffect(() => {
    const generatedColors = data.map((_, i) =>
      i < fixedColors.length ? fixedColors[i] : getRandomBlueColor()
    )

    const generatedColorsForLegend = data.map((_, i) =>
      i < fixedColorsForLegend.length
        ? fixedColorsForLegend[i]
        : getRandomBlueColor()
    )

    setColors(generatedColors)
    setColorsForLegend(generatedColorsForLegend)
  }, [data])

  const sortedData = data
    .sort((a, b) => b.value - a.value)
    .map((tokenData) => ({
      ...tokenData,
      value: tokenData.value,
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

  // console.log('generatedColorsForLegend', colorsForLegend)

  return (
    <BlockTemplate
      style={{ margin: '0 0 2rem 0', overflow: 'scroll' }}
      theme={theme}
      width={'100%'}
      height={'48%'}
    >
      <ChartContainer>
        <HeaderContainer theme={theme} justify={'space-between'}>
          <RowContainer padding={'2rem'} style={{ flexWrap: 'nowrap' }}>
            <WhiteTitle theme={theme} style={{ marginRight: '2rem' }}>
              {id === 'target' ? 'Target Allocation' : 'Current Allocation'}
            </WhiteTitle>
            <Line style={{ border: '0.1rem solid #383B45' }} />
          </RowContainer>
        </HeaderContainer>
        <RowContainer height={'calc(100% - 5rem)'}>
          <AllocationChartContainer>
            {/* we need to re-render chart on data update */}
            <AllocationDonutChart
              id={id}
              data={chartData}
              colors={colors}
              tooltipData={sortedData}
            />
          </AllocationChartContainer>
          <AllocationLegendContainer>
            <AllocationLegend
              theme={theme}
              data={legendData}
              colors={colorsForLegend}
            />
          </AllocationLegendContainer>
        </RowContainer>
      </ChartContainer>
    </BlockTemplate>
  )
}

export default withTheme()(DonutChartWithLegend)
