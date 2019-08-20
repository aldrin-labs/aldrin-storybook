import React, { Component } from 'react'
import moment from 'moment'

import { Grid } from '@material-ui/core'

import {
    TransactionActionsTypography
} from '../TransactionsActionsStatistic/TransactionsActionsStatistic.styles'
import {
    WinLossRatioGrid,
    WinLossSelect
} from './WinLossRatio.styles'
import WinLossRatio from './WinLossRatio'

class WinLossRatioWrapper extends Component {
    state = {
        periods: [
            { id: 0, label: '30D', period: moment().subtract(1, 'months') },
            { id: 1, label: '7D', period: moment().subtract(1, 'weeks') }
        ],
        period: null
    }

    onPeriodChange = period => {
        this.setState({
            period
        })
    }

    render() {
        const { periods, period } = this.state

        return (
            <WinLossRatioGrid>
                <Grid container justify="space-between" alignItems="center" style={{
                    borderBottom: '2px solid #e0e5ec',
                    marginBottom: '1rem'
                }}>
                    <TransactionActionsTypography>Profit & loss ratio</TransactionActionsTypography>
                    <WinLossSelect options={periods} value={period} onChange={this.onPeriodChange} />
                </Grid>

                <WinLossRatio startDate={period || periods[0]} endDate={moment()}/>
            </WinLossRatioGrid>
        )
    }

    componentDidMount() {
        this.setState(({ periods }) => ({
            periods,
            period: periods[0]
        }))
    }
}

export default WinLossRatioWrapper
