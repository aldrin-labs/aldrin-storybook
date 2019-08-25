import React, { Component } from 'react'

import { DaysBlock, WeekBlock } from './TransactionsActionsStatisticBlock'
import { Grid } from '@material-ui/core'

class TransactionsActionsStatistic extends Component {
  render() {
    return (
      <Grid item>
        <DaysBlock />
        <WeekBlock />
      </Grid>
    )
  }
}

export default TransactionsActionsStatistic
