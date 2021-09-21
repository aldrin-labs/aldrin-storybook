import React from 'react'
import { IProps } from './TradeHistoryDataWrapper.types'
import TradeHistoryTable from './TradeHistoryTable'

const TradeHistoryDataWrapper = ({
  tab,
  show,
  theme,
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
        theme,
        marketType,
        handlePairChange,
      }}
    />
  )
}

export default TradeHistoryDataWrapper
