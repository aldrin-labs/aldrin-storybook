import React from 'react'
import { IProps } from './PortfolioRebalanceChart.types'
import ProgressBarWrapper from '@sb/components/ProgressBarCustom/ProgressBarWrapper.tsx'

const PortfolioRebalanceChartComponent = ({
  coinData,
  otherCoinData,
  otherCoinsPercentage,
  isSectionChart,
  sectionDataProgress,
  isTargetChart,
  isPanelExpanded,
  onChangeExpandedPanel,
}: IProps) => (
  <>
    <ProgressBarWrapper
      isPanelExpanded={isPanelExpanded}
      onChangeExpandedPanel={onChangeExpandedPanel}
      isTargetChart={isTargetChart}
      sectionDataProgress={sectionDataProgress}
      coinData={coinData}
      otherCoinData={otherCoinData}
      otherCoinsPercentage={otherCoinsPercentage}
      isSectionChart={isSectionChart}
    />
  </>
)

export default PortfolioRebalanceChartComponent
