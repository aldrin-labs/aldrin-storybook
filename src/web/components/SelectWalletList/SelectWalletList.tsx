import * as React from 'react'
import { searchSupportedNetworksQuery } from '@core/graphql/queries/user/searchSupportedNetworksQuery'
import QueryRenderer from '@core/components/QueryRenderer/index'
import { SelectR } from '@sb/styles/cssUtils'

const SelectWalletList = ({ data, ...otherPropsForSelect }) => {
  // console.log(otherPropsForSelect, 'this props in wallet')

  const walletOptions =
    data.searchSupportedNetworks &&
    data.searchSupportedNetworks
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ name }) => ({
        label: name,
        value: name,
      }))

  return (
    <SelectR
      placeholder=""
      options={walletOptions || []}
      {...otherPropsForSelect}
    />
  )
}

const DataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={SelectWalletList}
      query={searchSupportedNetworksQuery}
      {...props}
    />
  )
}

export default DataWrapper
