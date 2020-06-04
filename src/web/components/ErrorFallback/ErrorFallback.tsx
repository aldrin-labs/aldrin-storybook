import React, { useEffect } from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { ApolloError } from 'apollo-client'
import { MASTER_BUILD } from '@core/utils/config'

const Error = styled(Paper)`
  display: flex;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
`

const FormatErrorToUser = (errorMessage: string) => {
  switch (errorMessage) {
    case 'GraphQL error: You must supply a JWT for authorization!':
      console.log(errorMessage)

      return 'You are not authorized, click Log In and then refresh the page.'
      break

    default:
      break
  }

  return errorMessage
}

export const CustomError = (props: {
  error?: string
  children?: React.ReactNode
}) => (
  <Error>
    <Typography variant="h5" color="error">
      {props.error || props.children || 'Error'}
    </Typography>
  </Error>
)

const SimpleError = (props: { error?: ApolloError }) => (
  <Typography variant="h5" color="error">
    {props.error ? FormatErrorToUser(props.error.message) : 'Error'}
  </Typography>
)

const ErrorWithoutMessage = () => (
  <Typography variant="body1" align="center" color="error">
    {`Network error, please refresh page or contact support in telegram chat`}
  </Typography>
)

// For ApolloErrors
export const ErrorFallback = (props: {
  error?: ApolloError
  refetch?: Function
}) => {

  useEffect(() => {

    try {
      props.refetch && props.refetch()
    } catch(e) {
      console.log('refetch error', e)
    }
  })

  return (
    <Error style={{ margin: 'auto' }} elevation={10}>
      {MASTER_BUILD ? <ErrorWithoutMessage /> : <SimpleError {...props} />}
    </Error>
  )
}

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  /*  static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI.
      return { error, hasError: true }
    }*/

  componentDidCatch(error: any, info: any) {
    // imlement service/component to send errors to our database
    console.log(error)
    console.log(info)
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      if (
        error.split(' ')[1] === 'Loading' &&
        error.split(' ')[2] === 'chunk'
      ) {
        window.location.reload()
      }
      // You can render any custom fallback UI
      return <ErrorFallback error={error} />
    }

    return this.props.children
  }
}
