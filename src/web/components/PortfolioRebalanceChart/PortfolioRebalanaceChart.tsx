import React from 'react'

import { BarChart, CardHeader } from '@sb/components/index'
import { ChartContainer, Chart } from './PortfolioRebalanceChart.styles'
import { IProps } from './PortfolioRebalanceChart.types'

import ProgressBarWrapper from '@sb/components/ProgressBarCustom/ProgressBarWrapper.tsx'

const PortfolioRebalanceChartComponent = ({
  // theme, //TODO: Я ЗАКОММЕНТИЛ Потому что не юзаю
  // title,
  // rebalanceChartsData,
  // ...otherProps
  coinData,
  otherCoinData,
  otherCoinsPercentage,
  isSectionChart,
  sectionDataProgress,
}: IProps) => (
  <>
    <ProgressBarWrapper
      sectionDataProgress={sectionDataProgress}
      coinData={coinData}
      otherCoinData={otherCoinData}
      otherCoinsPercentage={otherCoinsPercentage}
      isSectionChart={isSectionChart}
    />
  </>
)

export default PortfolioRebalanceChartComponent