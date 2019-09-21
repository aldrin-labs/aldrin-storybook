import React, { Component } from 'react'

import { DayBlock } from '@core/components/TransactionsActionsStatistic/DayActionsStatistic'
import { WeekBlock } from '@core/components/TransactionsActionsStatistic/WeekActionsStatistic'

import { Grid } from '@material-ui/core'

class TransactionsActionsStatistic extends Component {
  render() {
    return (
      <Grid item>
        <Grid item style={{ position: 'relative', marginBottom: '1.2rem' }}>
          <DayBlock title={'last 24h'} />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <WeekBlock title={'last 7d'} />
        </Grid>
      </Grid>
    )
  }
}

export default TransactionsActionsStatistic
