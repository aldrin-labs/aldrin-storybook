import storage from '@storage'
import { CachePersistor } from 'apollo-cache-persist'
import React, { Component } from 'react'

import { Loading } from '@sb/components/index'

import { memCache, restoreCache } from '@core/graphql/apolloClient'
import { MASTER_BUILD } from '@core/utils/config'

export const ApolloPersistContext = React.createContext({
  persistorInstance: null,
})

export default class ApolloPersistWrapper extends Component<any> {
  state = {
    persistorInstance: null,
    loaded: false,
  }

  async componentDidMount() {
    const cachePersistor = new CachePersistor({
      cache: memCache,
      storage,
    })

    // for logging
    if (!MASTER_BUILD) {
      window.cachePersistor = cachePersistor
    }

    try {
      await restoreCache(cachePersistor)
    } catch (error) {
      console.error('Error restoring Apollo cache', error)
    }

    this.setState({
      persistorInstance: cachePersistor,
      loaded: true,
    })
  }

  render() {
    if (!this.state.loaded) {
      return <Loading centerAligned color="#5E55F2" />
    }

    return (
      <ApolloPersistContext.Provider value={this.state}>
        {this.props.children}
      </ApolloPersistContext.Provider>
    )
  }
}
