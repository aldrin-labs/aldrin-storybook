import * as React from 'react'
import { getExchangesForKeysListQuery } from '@containers/User/api'
import QueryRenderer from '@components/QueryRenderer'
import { SelectR } from '@styles/cssUtils'

const SelectExchangeList = ({ data, ...otherPropsForSelect }) => {
  // console.log(otherPropsForSelect)

  const exchangeOptions =
    data.exchangePagination &&
    data.exchangePagination.items
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
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
