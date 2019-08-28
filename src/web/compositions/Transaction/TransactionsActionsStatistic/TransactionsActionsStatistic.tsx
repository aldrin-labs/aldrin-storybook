import React, { Component } from 'react'

import { DayBlock } from '@core/components/TransactionsActionsStatistic/DayActionsStatistic'
import { WeekBlock } from '@core/components/TransactionsActionsStatistic/WeekActionsStatistic'

import { Grid } from '@material-ui/core'

class TransactionsActionsStatistic extends Component {
  render() {
    return (
      <Grid item>
        <DayBlock title={'today'} />
        <WeekBlock title={'this week'} />
      </Grid>
    )
  }
}

export default TransactionsActionsStatistic
