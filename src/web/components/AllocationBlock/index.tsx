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

import Info from '@icons/inform.svg'
import AllocationDonutChart from './DonutChart'
import AllocationLegend from './Legend'

import { IProps } from './index.types'
import {
  AllocationChartContainer,
  AllocationLegendContainer,
  ChartContainer,
} from './index.styles'

import { DarkTooltip } from '../TooltipCustom/Tooltip'
import SvgIcon from '../SvgIcon'

export const ROWS_TO_SHOW_IN_LEGEND = 4

const DonutChartWithLegend = ({
  data = [],
  theme,
  id,
  colors,
  colorsForLegend,
}: IProps) => {
  const formattedData = Object.values(data)
    .map((el) => ({
      symbol: el.symbol,
      value: id === 'target' ? el.targetPercentage : el.percentage,
    }))
    .sort((a, b) => b.value - a.value)

  const sortedData = formattedData
    // .sort((a, b) => b.value - a.value)
    .map((tokenData) => ({
      ...tokenData,
      value: tokenData.value,
    }))

  const chartData = sortedData.map((tokenData) => tokenData.value)

  const formattedColorsForLegend = formattedData.map(
    (el) => colorsForLegend[el.symbol]
  )

  const formattedColorsForChart = formattedData.map((el) => colors[el.symbol])
  // const chartId = chartData.reduce((prev, value) => prev + value + id, '')

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
      width="100%"
      height="48%"
    >
      <ChartContainer>
        <HeaderContainer theme={theme} justify="space-between">
          <RowContainer padding="2rem" style={{ flexWrap: 'nowrap' }}>
            <WhiteTitle theme={theme} style={{ marginRight: '1rem' }}>
              {id === 'target' ? (
                <DarkTooltip title="The final distribution may differ slightly from the set distribution due to differences in min. order size values in different markets, as well as market movements.">
                  <Row wrap="nowrap">
                    <span>Est. Target Allocation</span>
                    <SvgIcon src={Info} width="3rem" padding="0 0 0 1rem" />
                  </Row>
                </DarkTooltip>
              ) : (
                'Current Allocation'
              )}
            </WhiteTitle>
            <Line style={{ border: '0.1rem solid #383B45' }} />
          </RowContainer>
        </HeaderContainer>
        <RowContainer height="calc(100% - 5rem)">
          <AllocationChartContainer>
            <AllocationDonutChart
              id={id}
              data={chartData}
              colors={formattedColorsForChart}
              tooltipData={sortedData}
            />
          </AllocationChartContainer>
          <AllocationLegendContainer centerRows={legendData.length <= 4}>
            <AllocationLegend
              id="legend"
              theme={theme}
              data={legendData}
              colors={formattedColorsForLegend}
            />
          </AllocationLegendContainer>
        </RowContainer>
      </ChartContainer>
    </BlockTemplate>
  )
}

export default withTheme()(DonutChartWithLegend)
