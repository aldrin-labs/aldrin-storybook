import React, { Component } from 'react'
import { Grid } from '@material-ui/core'

import {
    TransactionActionsTypography
} from './../TransactionsActionsStatistic/TransactionsActionsStatistic.styles'
import {
    WinLossRatioWrapper,
    WinLossRatioNumber,
    TypographyProfit,
    WinLossRatioChart,
    WinLossSelect
} from './WinLossRatio.styles'

class WinLossRatio extends Component {
    render() {
        return (
            <WinLossRatioWrapper>
                <Grid container justify="space-between" alignItems="center" style={{
                    borderBottom: '2px solid #e0e5ec',
                    marginBottom: '1rem'
                }}>
                    <TransactionActionsTypography>Win & loss ratio</TransactionActionsTypography>
                    <WinLossSelect options={[
                        { id: 0, label: '30D' },
                        { id: 1, label: '7D' }
                    ]} value={[{ id: 0, label: '30D' }]}/>
                </Grid>

                <Grid container alignItems="stretch" justify="space-between">
                    <Grid>
                        <Grid style={{
                            borderBottom: '2px solid #e0e5ec',
                            marginBottom: '2rem',
                            paddingBottom: '2rem'
                        }}>
                            <TransactionActionsTypography>Win</TransactionActionsTypography>
                            <WinLossRatioNumber>24</WinLossRatioNumber>
                            <TypographyProfit profit>+ $12,500.32</TypographyProfit>
                        </Grid>
                        <Grid>
                        <TransactionActionsTypography>Loss</TransactionActionsTypography>
                            <WinLossRatioNumber>11</WinLossRatioNumber>
                            <TypographyProfit>- $12,500.32</TypographyProfit>
                        </Grid>
                    </Grid>

                    <WinLossRatioChart win={70}/>
                </Grid>
            </WinLossRatioWrapper>
        )
    }
}

export default WinLossRatio
