import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { ApolloProvider } from 'react-apollo'

import { backgrounds } from './backgrounds'
import GQLChart from '../components/GQLChart'
import ApolloHOC from '../utils/apolloHOC'
import { client } from '../utils/apolloClient'


const ChartWrapper = styled(Paper)`
  max-height: 100%;
  height: 100vh;
  width: 50%;
`
const coins = ['ETH', 'BTC', 'TRX'];
const GqlChart = (<ApolloProvider client={client} >
    <GQLChart
        coins={coins}
    />
</ApolloProvider>)

storiesOf('GQLChart', module)
    .addDecorator(backgrounds)
    .add(
        'GQLChart',
        withInfo({
            propTables: false
        })(() => (
            <ApolloProvider client={client} >
                <GQLChart
                    coins={coins} />
            </ApolloProvider>
        ))
    )
