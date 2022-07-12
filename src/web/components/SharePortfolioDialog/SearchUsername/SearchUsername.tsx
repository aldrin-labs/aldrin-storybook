import { ApolloQueryResult } from 'apollo-client'
import * as React from 'react'

import ReactSelectComponent from '@sb/components/ReactSelectComponent/index'

import { client } from '@core/graphql/apolloClient'
import { searchUsername } from '@core/graphql/queries/user/searchUsername'
import ForwarderRefHoc from '@core/hoc/ForwarderRef'

import { SearchUsernameQueryOutputType } from './SearchUsername.types'

const combineDataToSelectOptions = (data: SearchUsernameQueryOutputType) => {
  const usernameOptions =
    data.searchUsername &&
    data.searchUsername
      .slice()
      .sort((a, b) => a.username.localeCompare(b.username))
      .map(({ username, _id }) => ({
        label: username,
        value: _id,
      }))

  return usernameOptions
}

const promiseOptions = (inputValue = '') => {
  return client
    .query({
      query: searchUsername,
      variables: { search: inputValue, limit: 25 },
    })
    .then((response: ApolloQueryResult<any>) => combineDataToSelectOptions(response.data))
    .catch((error) => {
      console.log(error)
    })
}

class SearchUsername extends React.Component {
  render() {
    const { forwardedRef, ...otherPropsForSelect } = this.props

    return (
      <ReactSelectComponent
        ref={forwardedRef}
        asyncSelect
        defaultOptions
        loadOptions={promiseOptions}
        cacheOptions
        placeholder="Search username..."
        {...otherPropsForSelect}
      />
    )
  }
}

export default ForwarderRefHoc(SearchUsername)
