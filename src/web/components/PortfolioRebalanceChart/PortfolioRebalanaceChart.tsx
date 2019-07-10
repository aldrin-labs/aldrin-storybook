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
  <ChartContainer>
    <ProgressBarWrapper
      sectionDataProgress={sectionDataProgress}
      coinData={coinData}
      otherCoinData={otherCoinData}
      otherCoinsPercentage={otherCoinsPercentage}
      isSectionChart={isSectionChart}
    />
  </ChartContainer>
)

export default PortfolioRebalanceChartComponent

// import React from 'react'

// import { BarChart, CardHeader } from '@sb/components/index'
// import { ChartContainer, Chart } from './PortfolioRebalanceChart.styles'
// import { IProps } from './PortfolioRebalanceChart.types'

// import ProgressBarWrapper from '@sb/components/ProgressBarCustom/ProgressBarWrapper.tsx'

// const PortfolioRebalanceChartComponent = ({
//   // theme, //TODO: Я ЗАКОММЕНТИЛ
//   // title,
//   // rebalanceChartsData,
//   // ...otherProps
//   coinData,
// }: IProps) => (
//   <ChartContainer>
//     <CardHeader title={title} />
//     <Chart background={theme.palette.background.default}>
//       <ProgressBarWrapper coinData={coinData} data={'1'} />

//          <BarChart theme={theme} charts={rebalanceChartsData} {...otherProps} />
//      </Chart>
//    </ChartContainer>
//  )

//  export default PortfolioRebalanceChartComponent
