import React from 'react'

import { SubColumnValue } from '../ActiveTrades/Columns'
import { IProps } from './ActiveSmartTradePnl.types'
import { isBuyTypeOrder } from '../TradingTable.utils'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

const PnlBlock = ({
  theme,
  price,
  pairArr,
  entryPrice,
  leverage,
  side,
  exitPrice,
  entryOrderPrice,
  entryLevels,
  receivedProfitPercentage,
  receivedProfitAmount,
  positionAmount,
  templatePnl,
  isSplitTargets,
}: IProps) => {
  const { green, red, blue } = theme.palette
  let currentPrice = price

  // for waitLossHedge for example
  if (exitPrice > 0 && !isSplitTargets) {
    // handle for split targets
    currentPrice = exitPrice
  }

  let profitPercentage =
    ((currentPrice / entryOrderPrice) * 100 - 100) *
    leverage *
    (isBuyTypeOrder(side) ? 1 : -1)

  let profitAmount =
    (positionAmount / leverage) * entryOrderPrice * (profitPercentage / 100)

  // pnl for averaging
  if (entryLevels && entryLevels.length > 0) {
    // if no entry price then we have no entry level
    if (!entryPrice) {
      profitAmount = receivedProfitPercentage
      profitPercentage = receivedProfitPercentage
    } else {
      profitPercentage += receivedProfitPercentage
      profitAmount += receivedProfitAmount
    }
  }

  return (
    <SubColumnValue
      theme={theme}
      style={{ fontSize: '1.3rem' }}
      color={+profitPercentage > 0 || templatePnl > 0 ? green.main : red.main}
    >
      {' '}
      {!!templatePnl
        ? `${stripDigitPlaces(templatePnl, 3)} ${pairArr[1]}`
        : `${profitAmount < 0 ? '-' : ''}${Math.abs(
            Number(profitAmount.toFixed(3))
          )} ${pairArr[1]} / ${profitPercentage < 0 ? '-' : ''}${Math.abs(
            Number(profitPercentage.toFixed(2))
          )}%`}
    </SubColumnValue>
  )
}

export const MemoizedPnlBlock = React.memo(PnlBlock)
