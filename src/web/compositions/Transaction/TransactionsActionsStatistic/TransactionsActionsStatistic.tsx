import React, { Component } from 'react'

import { DaysBlock, WeekBlock } from './TransactionsActionsStatisticBlock'
import { Grid } from '@material-ui/core'

class TransactionsActionsStatistic extends Component {
  render() {
    return (
      <Grid item>
        <Grid item style={{ position: 'relative', marginBottom: '1.2rem' }}>
          <DaysBlock title={'last 24 h'} />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <WeekBlock title={'last 7 d'} />
        </Grid>
      </Grid>
    )
  }
}

export default TransactionsActionsStatistic
