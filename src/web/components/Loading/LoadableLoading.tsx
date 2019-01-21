import * as React from 'react'
import { Loading } from '@storybook/components/Loading/Loading'

export default class LoadableLoading extends React.Component {
  render() {
    const { error, timedOut, pastDelay } = this.props

    if (error) {
      throw new Error(`ERROR in LoadableLoading: &{error}`)
    } else if (timedOut) {
      // When the loader has taken longer than the timeout
      return <div>Taking a long time...</div>
    } else if (pastDelay) {
      // When the loader has taken longer than the delay
      return <Loading centerAligned />
    } else {
      // When the loader has just started
      return null
    }
  }
}
