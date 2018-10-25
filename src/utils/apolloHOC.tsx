import * as React from 'react'
import { client } from './apolloClient'
import { ApolloProvider } from 'react-apollo'

const ApolloWrapper = (Component: React.ComponentType) => {
    return (
        <ApolloProvider client={client} >
            <div>
                <Component />
            </div>
        </ApolloProvider>
    )
}

export default ApolloWrapper;