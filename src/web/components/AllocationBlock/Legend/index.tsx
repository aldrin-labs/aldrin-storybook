import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import React from 'react'

import { IProps } from '../index.types'
import {
  BarTitle,
  PercentageTitle,
  TokenAllocationProgressBar,
  TokenAllocationProgressBarContainer,
} from './index.styles'

import { ROWS_TO_SHOW_IN_LEGEND } from '../index'
import { formatSymbol } from '../DonutChart/utils'

interface LegendProps extends IProps {
  colors: string[]
}

const AllocationLegend = ({ data, colors, theme }: LegendProps) => {
  return (
    <>
      {data.map((tokenData, i) => (
        <RowContainer
          wrap={'nowrap'}
          key={`${tokenData.symbol}-${tokenData.value}`}
        >
          <BarTitle theme={theme}>
            {tokenData.symbol.length > 15
              ? formatSymbol({ symbol: tokenData.symbol })
              : tokenData.symbol}
          </BarTitle>
          <TokenAllocationProgressBarContainer
            width={'calc(100% - 14rem)'}
            justify={'flex-start'}
          >
            <TokenAllocationProgressBar
              // other bar has another color
              color={
                data.length - 1 === i && data.length > ROWS_TO_SHOW_IN_LEGEND
                  ? '#365FBC'
                  : colors[i]
              }
              height={'2.2rem'}
              width={`${tokenData.value}%`}
              variant="determinate"
              value={0}
            />
          </TokenAllocationProgressBarContainer>
          <PercentageTitle theme={theme}>
            {stripDigitPlaces(tokenData.value.toFixed(2), 2)}%
          </PercentageTitle>
        </RowContainer>
      ))}
    </>
  )
}

export default AllocationLegend
