import React, { Component } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import { CSS_CONFIG } from '@sb/config/cssConfig'
import LineChart from '@sb/components/LineChart'

import {
    SocialPortfolioChartWrapper,
    SocialPortfolioCalendar,
    SocialPortfolioChartTypography
} from './SocialPortfolioChart.styles'

@withTheme()
class SocialPortfolioChart extends Component {
    render() {
        return (
            <SocialPortfolioChartWrapper style={{ height: '50vh' }}>
                <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                        <Grid container alignItems="center">
                            <SocialPortfolioCalendar>24H</SocialPortfolioCalendar>
                            <SocialPortfolioCalendar>Week</SocialPortfolioCalendar>
                            <SocialPortfolioCalendar>Month</SocialPortfolioCalendar>
                            <SocialPortfolioCalendar>6M</SocialPortfolioCalendar>
                            <SocialPortfolioCalendar>Year</SocialPortfolioCalendar>
                        </Grid>
                    </Grid>

                    <SocialPortfolioChartTypography>Portfolio performance</SocialPortfolioChartTypography>
                </Grid>
                <LineChart
                    additionalInfoInPopup={true}
                    alwaysShowLegend={true}
                />
            </SocialPortfolioChartWrapper>
        )
    }
}

export default SocialPortfolioChart
