import * as React from 'react'
import { searchAssetsQuery } from '@containers/User/api'
import { SelectT } from '@styles/cssUtils'
import { client } from '@utils/apolloClient'
import { Data } from './SelectCoinList.types'
import { ApolloQueryResult } from 'apollo-client'

const combineDataToSelectOptions = ( data: Data ) => {
  // console.log('data in combine', data);

  const coinOptions =
    data.searchAssets &&
    data.searchAssets
      .slice()
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .map(({ symbol }) => ({
        label: symbol,
        value: symbol,
      }))

  return coinOptions
}

const promiseOptions = (inputValue: string) => {
  // console.log('inputValue in: ', inputValue);

  return client.query({query: searchAssetsQuery, variables: {'search': inputValue}})
    .then((response: ApolloQueryResult<any> ) => combineDataToSelectOptions(response.data))
    .catch(error=> {console.log(error)})
}


export default class SelectCoinList extends React.Component {

  render() {
    const { ...otherPropsForSelect } = this.props

    return (
      <SelectT
        asyncSelect={true}
        loadOptions={promiseOptions}
        defaultOptions={true}
        cacheOptions={true}
        placeholder="Select..."
        {...otherPropsForSelect}
      />
    )
  }
}

