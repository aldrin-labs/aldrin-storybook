import * as React from 'react'
import { getExchangesForKeysListQuery } from '@core/graphql/queries/user/getExchangesForKeysListQuery'
import QueryRenderer from '@core/components/QueryRenderer'
import { SelectR } from '@sb/styles/cssUtils'

const SelectExchangeList = ({
  data = {
    exchangePagination: {
      items: [{ name: 'Binance' }],
    },
  },
  placeholder = '',
  ...otherPropsForSelect
}) => {
  const exchangeOptions =
    data.exchangePagination &&
    data.exchangePagination.items
      .filter((el) => !!el.name)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      // TODO: hardcode it for now, because we currently support only Binance
      .filter((el) => el.name.toLowerCase() === 'binance')
      .map(({ name }) => ({
        label: name,
        value: name,
      }))

  return (
    <SelectR
      placeholder={placeholder}
      options={exchangeOptions || []}
      {...otherPropsForSelect}
    />
  )
}

// No need for now because we support only binance

// const DataWrapper = ({ ...props }) => {
//   return (
//     <QueryRenderer
//       withOutSpinner={false}
//       withTableLoader={true}
//       component={SelectExchangeList}
//       query={getExchangesForKeysListQuery}
//       {...props}
//     />
//   )
// }

export default SelectExchangeList
