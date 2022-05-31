import React from 'react'

import {
  HeaderContainer,
  Row,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { Line } from '@sb/compositions/Pools/components/Popups/index.styles'
import { BlockTemplate } from '@sb/compositions/Pools/index.styles'

import Info from '@icons/inform.svg'

import SvgIcon from '../SvgIcon'
import { DarkTooltip } from '../TooltipCustom/Tooltip'
import { InlineText } from '../Typography'
import AllocationDonutChart from './DonutChart'
import {
  AllocationChartContainer,
  AllocationLegendContainer,
  ChartContainer,
} from './index.styles'
import { IProps } from './index.types'
import AllocationLegend from './Legend'

export const ROWS_TO_SHOW_IN_LEGEND = 4

const DonutChartWithLegend = ({
  data = [],
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
      width="100%"
      height="48%"
    >
      <ChartContainer>
        <HeaderContainer justify="space-between">
          <RowContainer padding="2rem" style={{ flexWrap: 'nowrap' }}>
            <InlineText
              size="sm"
              style={{ marginRight: '1rem', whiteSpace: 'nowrap' }}
            >
              {id === 'target' ? (
                <DarkTooltip title="The final distribution may differ slightly from the set distribution due to differences in min. order size values in different markets, as well as market movements.">
                  <Row wrap="nowrap">
                    <InlineText style={{ whiteSpace: 'nowrap' }} size="sm">
                      Est. Target Allocation
                    </InlineText>
                    <SvgIcon src={Info} width="3rem" padding="0 0 0 1rem" />
                  </Row>
                </DarkTooltip>
              ) : (
                'Current Allocation'
              )}
            </InlineText>
            <Line style={{ borderTop: '0.1rem solid #383B45' }} />
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
              data={legendData}
              colors={formattedColorsForLegend}
            />
          </AllocationLegendContainer>
        </RowContainer>
      </ChartContainer>
    </BlockTemplate>
  )
}

export default DonutChartWithLegend
