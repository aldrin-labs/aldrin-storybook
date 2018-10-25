import * as React from 'react'
import { Query } from 'react-apollo'
import { DocumentNode } from 'graphql'

import { Loading } from '@components/Loading'
import { ErrorFallback } from '@components/ErrorFallback'

interface HOCTypes {
  component?: React.ReactNode
  query: DocumentNode
  pollInterval?: number
  withOutSpinner?: boolean
  fetchPolicy?:
    | 'cache-first'
    | 'cache-and-network'
    | 'network-only'
    | 'cache-only'
    | 'no-cache'
    | 'standby'
  placeholder?: React.SFC | React.ComponentClass
  variables?: { [key: string]: any } | null
  [key: string]: any
}

export interface IProps extends HOCTypes {
  component: React.ReactNode
}

export default class QueryRenderer extends React.Component<IProps> {
  render() {
    const {
      query,
      component,
      variables,
      subscriptionArgs,
      placeholder: Placeholder,
      fetchPolicy,
      pollInterval,
      withOutSpinner,
      centerAlign = true,
      ...rest
    } = this.props

    return (
      <Query
        query={query}
        variables={variables}
        pollInterval={pollInterval}
        fetchPolicy={fetchPolicy ? fetchPolicy : 'cache-first'}
      >
        {({
          loading,
          error,
          data,
          refetch,
          networkStatus,
          fetchMore,
          subscribeToMore,
          ...result
        }) => {
          if (loading && Placeholder) {
            return (
              <>
                {Placeholder && (
                  <div
                    style={
                      centerAlign
                        ? { margin: '0 auto', height: '100%', width: '100%' }
                        : {}
                    }
                  >
                    <Placeholder />{' '}
                  </div>
                )}
              </>
            )
          } else if (loading && !withOutSpinner) {
            return <Loading centerAligned={true} />
          } else if (error) {
            return <ErrorFallback error={error} />
          }

          const Component = component

          return subscriptionArgs ? (
            <Component
              data={data}
              refetch={refetch}
              fetchMore={fetchMore}
              subscribeToMore={() =>
                subscribeToMore({
                  document: subscriptionArgs.subscription,
                  variables: { ...subscriptionArgs.variables },
                  updateQuery: subscriptionArgs.updateQueryFunction,
                })
              }
              {...result}
              {...rest}
            />
          ) : (
            <Component
              data={data}
              fetchMore={fetchMore}
              refetch={refetch}
              {...rest}
            />
          )
        }}
      </Query>
    )
  }
}

export const queryRendererHoc = (params: HOCTypes) => (
  WrappedComponent: React.ReactNode
) => (props: object): React.ReactElement<object> => (
  <QueryRenderer
    component={WrappedComponent}
    query={params.query}
    {...{ ...params, ...props }}
  />
)
