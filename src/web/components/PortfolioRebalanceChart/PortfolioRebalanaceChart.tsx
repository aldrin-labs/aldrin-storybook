import React from 'react'

import { BarChart, CardHeader } from '@sb/components/index'
import { ChartContainer, Chart } from './PortfolioRebalanceChart.styles'
import { IProps } from './PortfolioRebalanceChart.types'

const PortfolioRebalanceChartComponent = ({
  theme,
  title,
  rebalanceChartsData,
  ...otherProps
}: IProps) => (
  <ChartContainer>
    <CardHeader title={title} />
    <Chart background={theme.palette.background.default}>
      <BarChart theme={theme} charts={rebalanceChartsData} {...otherProps} />
    </Chart>
  </ChartContainer>
)

export default PortfolioRebalanceChartComponent
