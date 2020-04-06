import React, { PureComponent } from 'react'

import { DayBlock } from '@core/components/TransactionsActionsStatistic/DayActionsStatistic'
import { WeekBlock } from '@core/components/TransactionsActionsStatistic/WeekActionsStatistic'
import { AllTimeBlock } from '@core/components/TransactionsActionsStatistic/AllTimeActionsStatistic'

import { Grid } from '@material-ui/core'

class TransactionsActionsStatistic extends PureComponent<{
  includeFutures: boolean
  includeTrades: boolean
}> {
  render() {
    const { includeFutures, includeTrades } = this.props
    
    return (
      <Grid item>
        <Grid item style={{ position: 'relative', marginBottom: '1.2rem' }}>
          <DayBlock
            includeFutures={includeFutures}
            includeTrades={includeTrades}
            title={'today'}
          />
        </Grid>
        <Grid item style={{ position: 'relative', marginBottom: '1.2rem'  }}>
          <WeekBlock
            includeFutures={includeFutures}
            includeTrades={includeTrades}
            title={'7 days'}
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <AllTimeBlock
            includeFutures={includeFutures}
            includeTrades={includeTrades}
            title={'all time'}
          />
        </Grid>
      </Grid>
    )
  }
}

export default TransactionsActionsStatistic
