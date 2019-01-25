import React from 'react'

import ExchangesTable from './Table/ExchangesTable'
import { mockExchanges } from './mockExchanges'
import { IExchangesTable } from './TableContainer.types'

const transformDataToExchangesTable = ({ data, ...props }: IExchangesTable) => {
  if (data && data.marketByName) {
    const exchangesWithoutMocks =
      data.marketByName.length > 0
        ? data.marketByName[0].exchanges.map(({ name, symbol }) => ({
            name,
            symbol,
          }))
        : []
    const exchanges = props.isShownMocks
      ? [...exchangesWithoutMocks, ...mockExchanges]
      : exchangesWithoutMocks

    return <ExchangesTable exchanges={exchanges} {...props} />
  }

  return null
}

export default transformDataToExchangesTable
