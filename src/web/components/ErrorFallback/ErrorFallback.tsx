import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { ApolloError } from 'apollo-client'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { MASTER_BUILD } from '@core/utils/config'

const Error = styled(Paper)`
  display: flex;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  background: ${(props) => props.theme.colors.gray5};
`

const FormatErrorToUser = (errorMessage: string) => {
  switch (errorMessage) {
    case 'GraphQL error: You must supply a JWT for authorization!':
      console.log(errorMessage)
      return 'You are not authorized, click Log In and then refresh the page.'

    default:
      break
  }

  return errorMessage
}

export const CustomError = ({
  error,
  children,
}: {
  error?: string
  children?: ReactNode
}) => (
  <Error>
    <Typography variant="h5" color="error">
      {error || children || 'Error'}
    </Typography>
  </Error>
)

const SimpleError = ({ error }: { error?: ApolloError }) => (
  <Typography variant="h5" color="error">
    {error ? FormatErrorToUser(error.message) : 'Error'}
  </Typography>
)

const ErrorWithoutMessage = () => (
  <Typography variant="body1" align="center" color="error">
    Network error, please refresh page or contact support in telegram chat
  </Typography>
)

// For ApolloErrors
export const ErrorFallback = (props: {
  error?: ApolloError
  refetch?: Function
}) => {
  return (
    <Error style={{ margin: 'auto' }} elevation={10}>
      {MASTER_BUILD ? <ErrorWithoutMessage /> : <SimpleError {...props} />}
    </Error>
  )
}

interface IProps {
  children: React.ReactNode
}

class ErrorBoundary extends React.Component<IProps> {
  componentDidCatch(error: any, info: any) {
    // implement service/component to send errors to our database
    console.log(error)
    console.log(info)
  }

  render() {
    const { children } = this.props

    return children
  }
}

export default ErrorBoundary
