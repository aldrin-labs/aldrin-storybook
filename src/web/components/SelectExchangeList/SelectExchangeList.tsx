import * as React from 'react'
import { getExchangesForKeysListQuery } from '@core/graphql/queries/user/getExchangesForKeysListQuery'
import QueryRenderer from '@core/components/QueryRenderer'
import { SelectR } from '@sb/styles/cssUtils'

const SelectExchangeList = ({ data, ...otherPropsForSelect }) => {
  // console.log(otherPropsForSelect)

  const exchangeOptions =
    data.exchangePagination &&
    data.exchangePagination.items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      // TODO: hardcode it for now, because we currently support only Binance
      .filter(el => el.name === 'Binance')
      .map(({ name }) => ({
        label: name,
        value: name,
      }))
  return (
    <SelectR
      placeholder=""
      options={exchangeOptions || []}
      {...otherPropsForSelect}
    />
  )
}

const DataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={SelectExchangeList}
      query={getExchangesForKeysListQuery}
      {...props}
    />
  )
}

export default DataWrapper
