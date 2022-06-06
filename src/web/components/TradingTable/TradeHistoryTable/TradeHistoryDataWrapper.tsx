import React from 'react'

import { IProps } from './TradeHistoryDataWrapper.types'
import TradeHistoryTable from './TradeHistoryTable'

const TradeHistoryDataWrapper = ({
  tab,
  show,
  handlePairChange,
  marketType,
}: IProps) => {
  if (!show) {
    return null
  }

  return (
    <TradeHistoryTable
      {...{
        tab,
        marketType,
        handlePairChange,
      }}
    />
  )
}

export default TradeHistoryDataWrapper
