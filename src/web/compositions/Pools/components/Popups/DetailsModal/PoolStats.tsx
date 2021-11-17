import React from 'react'
import { PoolStatsBlock, PoolStatsTitle, PoolStatsData, PoolStatsText } from './styles'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { formatNumberToUSFormat } from '@core/utils/PortfolioTableUtils'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

interface PoolStatsProps {
  title: React.ReactNode
  value: number
}
export const PoolStats: React.FC<PoolStatsProps> = (props) => {
  const { title, value } = props
  return (
    <PoolStatsBlock>
      <PoolStatsTitle>{title}</PoolStatsTitle>
      <PoolStatsData>
        <PoolStatsText>
          <DarkTooltip title={`$${formatNumberToUSFormat(Math.round(value))}`}>
            <span>
              ${stripByAmountAndFormat(value)}
            </span>
          </DarkTooltip>
        </PoolStatsText>
      </PoolStatsData>
    </PoolStatsBlock>
  )
}