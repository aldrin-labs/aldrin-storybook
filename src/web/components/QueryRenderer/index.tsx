import * as React from 'react'
import { Query } from 'react-apollo'

import { ErrorFallback, QueryRenderPlaceholder, LinearProgressCustom } from '@sb/components/index'
import { Loader as RinLoader } from '@sb/components/Loader/Loader'
import Loader from '@sb/components/TablePlaceholderLoader/newLoader'
import { useInterval } from '@sb/dexUtils/useInterval'

import { IProps, HOCTypes } from './index.types'
import { getVariables } from './utils'

const QueryRenderer = (props: IProps) => {
  const {
    query,
    component,
    variables,
    subscriptionArgs,
    placeholder: Placeholder,
    fetchPolicy = 'cache-first',
    pollInterval,
    withOutSpinner,
    withTableLoader,
    centerAlign = true,
    showLoadingWhenQueryParamsChange = true,
    isDataLoading = false,
    withoutLoading = false,
    showNoLoader = false,
    includeVariables = false,
    includeQueryBody = false,
    name = 'data',
    loaderColor = '#651CE4',
    loaderSize = 64,
    skip,
    ...rest
  } = props

  return (
    <Query
      query={query}
      variables={getVariables(variables, props)}
      // pollInterval={pollInterval}
      fetchPolicy={fetchPolicy}
      skip={!!getVariables(skip, props)}
    >
      {({ loading, error, data, refetch, networkStatus, fetchMore, subscribeToMore, ...result }) => {
        const refProps = React.useRef(props)

        const isDataInCacheExists = !!data
        const queryParamsWereChanged = loading && networkStatus === 2 && showLoadingWhenQueryParamsChange

        const extendedLoading =
          ((loading && !isDataInCacheExists) || queryParamsWereChanged || isDataLoading) && !withoutLoading

        React.useEffect(() => {
          refProps.current = props
        }, [props])

        if (pollInterval) {
          useInterval(() => {
            if (extendedLoading || !pollInterval || fetchPolicy === 'cache-only') return

            const newVariables = getVariables(variables, refProps.current)
            refetch(newVariables)
          }, pollInterval)
        }

        if (extendedLoading && Placeholder) {
          return <QueryRenderPlaceholder centerAlign={centerAlign} placeholderComponent={Placeholder} />
        }
        if (extendedLoading && !withOutSpinner) {
          return (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <RinLoader width={loaderSize} color={loaderColor} />
            </div>
          )
        }
        if (extendedLoading && withTableLoader) {
          return <Loader />
        }
        if (error) {
          return <ErrorFallback error={error} refetch={refetch} />
        }
        if (extendedLoading && showNoLoader) {
          return null
        }
        if (extendedLoading) {
          return <LinearProgressCustom />
        }

        const subscribeToMoreFunction = () =>
          subscribeToMore({
            document: subscriptionArgs.subscription,
            variables: getVariables(subscriptionArgs.variables, props),
            updateQuery: subscriptionArgs.updateQueryFunction,
            onError: (err) => console.error(err),
          })

        const dataObject = {
          [name]: {
            ...data,
            subscribeToMore,
            subscribeToMoreFunction,
            error,
            loading,
            variables: includeVariables ? getVariables(variables, props) : {},
            query: includeQueryBody ? query : null,
          },
          [`${name}Refetch`]: refetch,
          [`${name}SubscribeToMore`]: subscribeToMoreFunction,
        }

        const Component = component

        delete result.variables

        return subscriptionArgs ? (
          <Component
            {...dataObject}
            {...result}
            {...rest}
            refetch={refetch}
            fetchMore={fetchMore}
            subscribeToMore={subscribeToMoreFunction}
          />
        ) : (
          <Component {...dataObject} {...rest} fetchMore={fetchMore} refetch={refetch} />
        )
      }}
    </Query>
  )
}

export const queryRendererHoc =
  (params: HOCTypes) =>
  (WrappedComponent: React.ComponentType<any>) =>
  (props: object): React.ReactElement<object> =>
    <QueryRenderer component={WrappedComponent} query={params.query} {...{ ...params, ...props }} />

export default QueryRenderer
