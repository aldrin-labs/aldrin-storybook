import React, { Component } from 'react'
import { CachePersistor } from 'apollo-cache-persist'

import {
  Loading,
} from '@sb/components/index'

import storage from '@storage'
import { memCache, restoreCache } from '@core/graphql/apolloClient'

export const ApolloPersistContext = React.createContext({ persistorInstance: null });

export default class ApolloPersistWrapper extends Component<any> {
  state = {
    persistorInstance: null, 
    loaded: false,
  }
  
  async componentDidMount() {
    const cachePersistor = new CachePersistor({
        cache: memCache,
        storage: storage,
    })

    try {
      await restoreCache(cachePersistor)

    } catch (error) {
      console.error('Error restoring Apollo cache', error);
    }

    this.setState({
      persistorInstance: cachePersistor,
      loaded: true,
    });
  }

  render() {

    if (!this.state.loaded) {
      return <Loading centerAligned={true} color={'#165BE0'} />
    }
    
    return (
      <ApolloPersistContext.Provider value={this.state}>
        {this.props.children}
      </ApolloPersistContext.Provider>
    )
  }
}
