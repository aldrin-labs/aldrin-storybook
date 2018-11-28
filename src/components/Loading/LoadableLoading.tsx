import * as React from 'react'
import { Loading } from '@components/Loading/Loading'
import { CustomError } from '@components/ErrorFallback/ErrorFallback'

export default class LoadableLoading extends React.Component {
  render() {
    const { error, timedOut, pastDelay } = this.props

    if (error) {
      // When the loader has errored
      console.log('ERROR in LoadableLoading: ', error)
      console.log('error.stack: ', error.stack)

      return <CustomError error={error.message} />
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
